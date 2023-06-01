# oneenv

OneEnv helps keep all `.env` files' content in one file or one `NPM` (or `yarn`) task call in a monorepo. The content is then distributed to the specified folders (targets). This is to help the developers to easily share just one master `.env` file (in the root of the project), but can also be used to set up CI/CD pipelines. It uses [dotenv](https://www.npmjs.com/package/dotenv) under the hood.

**REMEMBER TO GITIGNORE ALL `.env` FILES IN YOUR PROJECT.**

## Install

```console
npm i oneenv
```

or

```console
yarn add oneenv
```

## Syntax examples

Master .env file (root of your project):

```dosini
# special separator for handle and variable (default is '__')
__ENV_CONFIG_SEPARATOR=--

# handles and targets definitions
front--env_config_target=frontend
back--env_config_target=backend

# handles starting with 'sv--' can be used as variables
sv--SHARED_SECRET=mysharedsecret

# all these will be in an .env file in the '/frontend' folder (without the 'front--' handle)
front--VITE_SECRET=anothersecretforfrontend
front--VITE_SHARED_SECRET=sv--SHARED_SECRET

# all these will be in an .env file in the '/backend' folder (without the 'back--' handle)
back--SECRET=anothersecretforbackend
back--SHARED_SECRET=sv--SHARED_SECRET

# root level .env variable (without any handle and separator)
SOME_ROOT_SECRET=rootsecret
```

Config file, `oneenv.config.json` (root of your project):
```json
{
  "targets": {
    "frontend": "frontend",
    "backend": "backend",
    "calcService": "calcService/src"
  },
  "separator": "--"
}
```

You do not need to specify the separator and the targets in both files, either specify them in the root .env file, in the config file, or in a package.json script task. The defining of the separator is optional, default is `__`.

## Targets

Targets define the `handle` and the `folder` (as the value) where the .env file is created. Targets can be set in three different ways (one of these ways is required):

1. In the master .env file:
```dosini
front__env_config_target=frontend
back__env_config_target=backend
```

2. In the `oneenv.config.json` file:
```json
"targets": {
    "frontend": "front",
    "backend": "back",
  },
```

3. In a package.json script task:
```json
...
"scripts": {
  "env": "front__env_config_target=frontend back__env_config_target=backend oneenv"
}
...
```

## Variables

The variables are defined as `[handle][separator][VARIABLEKEY]=[VALUE]`. The root .env file:
```dosini
front__VARIABLE_KEY=somefrontendsecret
back__VARIABLE_KEY=somebackendsecret
```
or in a terminal call:
```console
front__VARIABLE_KEY=somefrontendsecret back__VARIABLE_KEY=somebackendsecret npm run env
```

## Shared values (sv)

The variables can share a value by using `sv` as the handle. For example:
```dosini
sv__SHARED_VALUE=somesharedvalue

front__VARIABLE_KEY=sv__SHARED_VALUE
back__VARIABLE_KEY=sv__SHARED_VALUE
```
