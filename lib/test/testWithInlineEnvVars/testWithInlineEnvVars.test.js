import fs from "fs";
import * as url from "url";
import * as shell from 'shelljs';

import { autoGenerationMessage } from "../../oneEnv.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("test with inline env vars", () => {
  beforeEach(() => {
    shell.default.exec('cross-env front__env_config_target=front back__env_config_target=back sv__SHARED_SECRET=mysharedsecret front__VITE_SECRET=anothersecretforfrontend front__VITE_SHARED_SECRET=sv__SHARED_SECRET back__SECRET=anothersecretforbackend back__SHARED_SECRET=sv__SHARED_SECRET node ./lib/test/testWithInlineEnvVars/main.js');
  });

  afterEach(() => {
    // Remove created test .env files
    const handles = ['front', 'back'];
    for (let i = 0; i < handles.length; i++) {
      const targetFile = __dirname + handles[i] + "/.env";
      try {
        if (fs.existsSync(targetFile)) {
          fs.unlinkSync(targetFile);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });

  it("should create front and back .env files with inline env vars", () => {
    const expectedFiles = [
      autoGenerationMessage +
        "VITE_SECRET=anothersecretforfrontend\nVITE_SHARED_SECRET=mysharedsecret\n",
      autoGenerationMessage +
        "SECRET=anothersecretforbackend\nSHARED_SECRET=mysharedsecret\n",
    ];

    const handles = ['front', 'back'];
    for (let i = 0; i < handles.length; i++) {
      const targetFile = __dirname + handles[i] + "/.env";
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
