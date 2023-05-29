import fs from "fs";
import * as url from "url";

import { oneEnv, deleteTargetEnvFiles } from "../../oneEnv.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("oneEnv.js", () => {
  afterEach(() => {
    // deleteTargetEnvFiles(__dirname);
  });

  it("should create front and back .env files", () => {
    oneEnv(__dirname);
    try {
    } catch (err) {}
  });
});
