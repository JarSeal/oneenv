import fs from "fs";
import * as url from "url";
import { config } from "dotenv";

export const oneEnv = (path, silent) => {
  path = setEnvVarsToProcessEnvAndGetPath(path);

  const S = getSeparator(path);
  const allKeys = Object.keys(process.env);

  // Get config data
  const targets = getTargets(path, S);
  const handles = Object.keys(targets);

  // Create shared values object
  const sharedValuesObj = allKeys
    .filter((key) => key.startsWith(`sv${S}`))
    .reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {});

  for (let i = 0; i < handles.length; i++) {
    const h = handles[i];

    const obj = allKeys
      .filter(
        (key) => key.includes(`${h}${S}`) && key !== `${h}${S}env_config_target`
      )
      .map((key) => ({ [key.replace(`${h}${S}`, "")]: process.env[key] }));

    let envFileContent = autoGenerationMessage;
    obj.forEach((keyAndVal) => {
      for (let [key, value] of Object.entries(keyAndVal)) {
        if (value.includes(`sv${S}`) && sharedValuesObj[value]) {
          value = sharedValuesObj[value];
        }
        envFileContent += key + "=" + value + "\n";
      }
    });

    const target = targets[h];
    const targetFile = path + target;
    try {
      if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile);
      }
      fs.writeFileSync(targetFile, envFileContent, { flag: "w+" });
      if (!silent) console.log(`Created "${h}" .env file: ${target}`);
    } catch (err) {
      console.log(err);
    }
  }

  if (!handles.length) {
    if (!silent) console.log("No .env files were created.");
  }
};

// Remove auto-created env files
export const deleteTargetEnvFiles = (path) => {
  path = setEnvVarsToProcessEnvAndGetPath(path);
  const targets = getTargets(path);
  const handles = Object.keys(targets);
  for (let i = 0; i < handles.length; i++) {
    const targetFile = path + handles[i] + "/.env";
    try {
      if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const setEnvVarsToProcessEnvAndGetPath = (path) => {
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
  if (!path) path = __dirname;
  config({ path: path + ".env" });
  return path;
};

const getTargets = (path) => {
  const allKeys = Object.keys(process.env);
  const configFileContent = getConfigFileContent(path);
  const S = getSeparator(path, configFileContent);
  const configTargets = configFileContent?.targets
    ? configFileContent.targets
    : {};

  const embeddedTargets = allKeys
    .filter((key) => key.includes(`${S}env_config_target`))
    .reduce((acc, key) => {
      const handle = key.split(S)[0];
      if (handle === "sv") {
        throw new Error(
          'Handle "sv" is a reserved handle for shared values. Choose another handle.'
        );
      }
      acc[handle] = process.env[key];
      return acc;
    }, {});

  return { ...configTargets, ...embeddedTargets };
};

const getSeparator = (path, configFileContent) => {
  let S = process.env.__ENV_CONFIG_SEPARATOR || "__"; // Default separator
  if (configFileContent === undefined) {
    configFileContent = getConfigFileContent(path);
  }
  if (configFileContent?.separator) S = configFileContent.separator;
  return S;
};

const getConfigFileContent = (path) => {
  const configFile = path + "oneenv.config.json";
  let configFileContent = null;
  try {
    if (fs.existsSync(configFile)) {
      configFileContent = JSON.parse(fs.readFileSync(configFile, "utf8"));
    }
  } catch (err) {
    console.log(err);
    throw new Error(
      `Error while checking/reading config file (${configFile}).`
    );
  }
  return configFileContent;
};

const autoGenerationMessage =
  "# This is an auto-generated file.\n# Do not edit the contents of this file.\n# Only edit the root folder .env file.\n";
