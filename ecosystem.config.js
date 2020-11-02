module.exports = {
  apps : [{
    name: 'facade-api-service',
    script: 'dist/index.js',
    instances: 2,
    autorestart: true,
    // max_memory_restart: '1G',
    env_development: {
      NODE_ENV: 'development',
      watch: 'dist',
      'watch_options': {
        'followSymlinks': false
      }
    },
    env_stagging: {
      NODE_ENV: 'stagging',
      watch: 'dist',
      'watch_options': {
        'followSymlinks': false
      }
    },
    env_production: {
      NODE_ENV: 'production',
      watch: false
    }
  }],

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : '212.83.163.1',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
