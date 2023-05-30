#!/usr/bin/env node
// const { default: url } = await import('url');
// const { oneEnv } = await import('../lib/oneEnv.js');
import * as url from "url";
import { oneEnv } from "../lib/oneEnv.js";

// __dirname will be at ../node_modules/oneenv/lib so we need to come down to root
const path = url.fileURLToPath(new URL(".", import.meta.url)) + "../../../";

oneEnv(path);
