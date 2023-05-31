# oneenv

OneEnv helps keep all `.env` files' content in one file or one shell call in a monorepo. The content is then distributed to the specified folders (targets). Mainly, this is to help the developers to easily share just one master `.env` file between the services which helps creating new dev environments when a new developer joins or a developer switches computers (this has happened to me more than I would have thought). The main goal of this package is to streamline the development, but this can also be used to create `.env` files for CI/CD pipelines. It uses (dotenv)[https://www.npmjs.com/package/dotenv] under the hood.

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

# root level .env variable (without the handle)
SOME_ROOT_SECRET=rootsecret
```

Config file, `oneenv.config.json` (root of your project):

```json
{
  "targets": {
    "front": "front",
    "back": "back",
    "calcService": "calcService/src"
  },
  "separator": "--"
}
```
