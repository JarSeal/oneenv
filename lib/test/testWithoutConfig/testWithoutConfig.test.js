import fs from "fs";
import * as url from "url";

import {
  oneEnv,
  setEnvVarsToProcessEnvAndGetPath,
  getTargets,
  deleteTargetEnvFiles,
  autoGenerationMessage,
} from "../../oneEnv.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("test without config file", () => {
  afterEach(() => {
    deleteTargetEnvFiles(__dirname);
  });

  it("should create front and back .env files with targets in root .env file", () => {
    oneEnv(__dirname, true);

    const expectedFiles = [
      autoGenerationMessage +
        "VITE_SECRET=anothersecretforfrontend\nVITE_SHARED_SECRET=mysharedsecret\n",
      autoGenerationMessage +
        "SECRET=anothersecretforbackend\nSHARED_SECRET=mysharedsecret\n",
    ];

    const path = setEnvVarsToProcessEnvAndGetPath(__dirname);
    const targets = getTargets(path);
    const handles = Object.keys(targets);
    for (let i = 0; i < handles.length; i++) {
      const targetFile = path + handles[i] + "/.env";
      let envFileContent;
      try {
        if (fs.existsSync(targetFile)) {
          envFileContent = fs.readFileSync(targetFile, "utf8");
        }
      } catch (err) {
        console.log(err);
      }
      expect(envFileContent).toBe(expectedFiles[i]);
    }
  });
});
