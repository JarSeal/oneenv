import fs from "fs";
import * as url from "url";
import * as shell from "shelljs";

import { autoGenerationMessage } from "../../oneEnv.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("test with inline env vars and and a config file", () => {
  beforeEach(() => {
    shell.default.exec(
      "cross-env sv__SHARED_SECRET=mysharedsecret front__VITE_SECRET=anothersecretforfrontend front__VITE_SHARED_SECRET=sv__SHARED_SECRET back__SECRET=anothersecretforbackend back__SHARED_SECRET=sv__SHARED_SECRET node ./lib/test/testWithInlineAndConfig/main.js"
    );
  });

  afterEach(() => {
    // Remove created test .env files
    const handles = ["front", "back"];
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

  it("should create front and back .env files with inline env vars and a config file", () => {
    const expectedFiles = {
      front: [
        autoGenerationMessage,
        "VITE_SECRET=anothersecretforfrontend",
        "VITE_SHARED_SECRET=mysharedsecret",
      ],
      back: [
        autoGenerationMessage,
        "SECRET=anothersecretforbackend",
        "SHARED_SECRET=mysharedsecret",
      ],
    };

    const handles = ["front", "back"];
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
      for (let j = 0; j < expectedFiles[handles[i]].length; j++) {
        const content = expectedFiles[handles[i]][j];
        expect(envFileContent.includes(content)).toBeTruthy();
      }
    }
  });
});
