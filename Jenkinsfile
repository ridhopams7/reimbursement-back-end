pipeline {
    parameters {
        string(name: 'PRODUCTION_NAMESPACE',       description: 'Production Namespace',                 defaultValue: 'ama-moefis-finsys-prod')
        string(name: 'STAGING_NAMESPACE',          description: 'Staging Namespace',                    defaultValue: 'ama-moefis-finsys-stage')
        string(name: 'DEVELOPMENT_NAMESPACE',      description: 'Development Namespace',                defaultValue: 'ama-moefis-finsys-dev')

        string(name: 'VSAN_REGISTRY_URL',          description: ' Openshift registry URL',              defaultValue: 'docker-registry-default.vsan-apps.playcourt.id')
        string(name: 'STAGE_REGISTRY_URL',         description: ' Openshift registry URL',              defaultValue: 'docker-registry-default.stage-apps.playcourt.id')

        string(name: 'DOCKER_IMAGE_NAME',          description: 'Docker Image Name',                    defaultValue: 'ama-finsys-backend')

        string(name: 'CHAT_ID',                    description: 'chat id of telegram group',            defaultValue: '-383243277')
    }
    agent none
    options {
        // Skip default checkout behavior
        skipDefaultCheckout()
    }
    stages {
        stage('Checkout SCM') {
            agent { label "nodejs" }
            steps {
                checkout scm
                script {
                    echo "get COMMIT_ID"
                    sh 'echo -n $(git rev-parse --short HEAD) > ./commit-id'
                    commitId = readFile('./commit-id')
                }
                // stash this current workspace
                stash(name: 'ws', includes:'**,./commit-id')
            }
        }
        stage('Initialize') {
            parallel {
                stage("Agent: nodejs") {
                    agent { label "nodejs" }
                    steps {
                        cleanWs()
                        script{
                            def node = tool name: 'NodeJS-8.9', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                            env.PATH = "${node}/bin:${env.PATH}"
                        }
                    }
                }
                stage("Agent: Docker") {
                    agent { label "Docker" }
                    steps {
                        cleanWs()
                        script{
                            // Setup variable for retagging purpose
                            if ( env.BRANCH_NAME == 'master' ){
                                projectName =  "${params.PRODUCTION_NAMESPACE}"
                                registryURL = "${params.VSAN_REGISTRY_URL}"
                                envStage = "production"

                            } else if ( env.BRANCH_NAME == 'release' ){
                                projectName =  "${params.STAGING_NAMESPACE}"
                                registryURL = "${params.STAGE_REGISTRY_URL}"
                                envStage = "staging"
                                
                            } else if ( env.BRANCH_NAME == 'develop'){
                                projectName =  "${params.DEVELOPMENT_NAMESPACE}"
                                registryURL = "${params.VSAN_REGISTRY_URL}"
                                envStage = "development"
                            }
                            // Defind for Final image name
                            imageNameFinal = "${registryURL}/${projectName}/${params.DOCKER_IMAGE_NAME}"
                        }
                    }
                }
            }
        }
        stage('Unit Test') {
            agent { label "nodejs" }
            steps {
                unstash 'ws'
                echo "Do Unit Test Here"
               // sh "npm install"
               // sh "npm run build:${envStage}"
		       // sh "npm run test"
            }    
        }
        stage('SonarQube Analysis') {
            when {
                anyOf {
                    branch 'master'
                    branch 'release'
                    branch 'develop'
                }
            }
            agent { label "nodejs" }
            steps {
                unstash 'ws'
                echo "Run SonarQube"
                script {
                    sh "npm install typescript"
                    echo "defining sonar-scanner"
                    def scannerHome = tool 'SonarScanner' ;
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Build & Deploy') {
            when {
                anyOf{
                    branch 'master'
                    branch 'release'
                    branch 'develop'
                }
            }
            agent { label "Docker" }
            stages{
                stage("Build Image") {
                    steps{
                        unstash 'ws'
                        sh "docker build --rm --no-cache -t ${params.DOCKER_IMAGE_NAME}:${BUILD_NUMBER}-${commitId} ."
                    }
                }
                stage("Login into registry") {
                    steps{
                        script{
                            if ( env.BRANCH_NAME == 'master'){
                                withCredentials([string(credentialsId: 'VSAN_OC_REGISTRY_TOKEN', variable: 'TOKEN')]) {
                                    sh "docker login ${registryURL} -u jenkins -p ${TOKEN}"
                                }
                            } else if  ( env.BRANCH_NAME == 'release') {
                                withCredentials([string(credentialsId: 'STAGE_OC_REGISTRY_TOKEN', variable: 'TOKEN')]) {
                                    sh "docker login ${registryURL} -u jenkins -p ${TOKEN}"
                                }
                            } else if ( env.BRANCH_NAME == 'develop') {
                                withCredentials([string(credentialsId: 'VSAN_OC_REGISTRY_TOKEN', variable: 'TOKEN')]) {
                                    sh "docker login ${registryURL} -u jenkins -p ${TOKEN}"
                                }
                            }
                        }
                    }
                }
                stage ('Re-tag Image'){
                    steps{
                        echo "Retaging Image"
                        sh "docker tag ${params.DOCKER_IMAGE_NAME}:${BUILD_NUMBER}-${commitId} \
                                       ${imageNameFinal}:latest"
                    }
                }
                stage ('Deploy'){
                    steps{
                        unstash 'ws'
                        //vars envStage, ProjectName and imageNameFinal is from previous deployment stage (re-tagin image)
                        script{
                            // this step will be hold until deployment confirmed
                            if (env.BRANCH_NAME == 'master'){
                                timeout(10) {
                                    input message: 'Deploy to PRODUCTION?', ok: 'Deploy'
                                }
                                echo "Deploying to ${envStage} (${projectName})"
                                sh "docker push ${imageNameFinal}:latest"
				                // push image with commitId tag
				                sh "docker tag ${imageNameFinal}:latest ${imageNameFinal}:${commitId}"
                                sh "docker push ${imageNameFinal}:${commitId}"
				                sh "docker rmi -f ${imageNameFinal}:${commitId}"
                            } else{
                                echo "Deploying to ${envStage} (${projectName})"
                                sh "docker push ${imageNameFinal}:latest"
                            }
                        }
                        echo "CleanUp Images"
                        sh "docker rmi -f ${params.DOCKER_IMAGE_NAME}:${BUILD_NUMBER}-${commitId}"
                        sh "docker rmi -f ${imageNameFinal}"
                    }
                }
            }
        }
    }
    post {
        failure{
            node("Docker"){
                script{
                    withCredentials([string(credentialsId: 'telegram-token', variable: 'TELEGRAM_TOKEN')]) {
                        if  (BRANCH_NAME == 'master' || BRANCH_NAME == 'release' || BRANCH_NAME == 'develop'){
                            textMessage = "(╥﹏╥) Jenkins Job --- ${JOB_NAME}-${BUILD_NUMBER}-${commitId} is FAILED , Please check ${BUILD_URL}console"
                            sh "curl -s -X POST 'https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${params.CHAT_ID}&text=${textMessage}'"
                        }
                    }
                }
            }
        }
        success{
            node("Docker"){
                script{
                    withCredentials([string(credentialsId: 'telegram-token', variable: 'TELEGRAM_TOKEN')]) {
                        if  (BRANCH_NAME == 'master' || BRANCH_NAME == 'release' || BRANCH_NAME == 'develop'){
                            textMessage = "҉\\(•˘▽˘•)/҉   Jenkins Job --- ${JOB_NAME}-${BUILD_NUMBER}-${commitId} is SUCCESS"
                            sh "curl -s -X POST 'https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${params.CHAT_ID}&text=${textMessage}'"
                        }
                    }
                }
            }
        }
    }
}
