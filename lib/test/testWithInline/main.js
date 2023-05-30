import * as url from "url";

import { oneEnv } from "../../oneEnv.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// console.log('HERE', __dirname);
oneEnv(__dirname);
