# MOEFIS Backend

* NodeJS
* Typescript
* PostgreSQL
* JWT

## Prerequisites

* Install NodeJS
* Install PostgreSQL Server

## Installation

``` bash
# clone the repo, example:
$ git clone ssh://git@gitlab.playcourt.id:31022/AMAdev/AMA-MOEFIS-FINSYS-BACKEND.git my-project

# go into app's directory
$ cd my-project

```

**Then copy and rename .env.example to .env**
**and edit .env file based on your or server needs**

``` bash
# install app's dependencies
$ npm install
```

### Basic usage (for developers)

``` bash
# running dev server with hot reload at http://localhost:3000
$ npm start
```

### Build (for devops)

Please inject environtment variables (contained database connection server and JWT secret) first (for security reason its not stored on repository). For examples vars, please open .env.example.

``` bash
# build for production
$ npm run build:production
```

``` bash
# build for stagging
$ npm run build:stagging
```

``` bash
# build for development
$ npm run build:stagging
```

Server will be running using pm2 with host & port on environtment variables.
