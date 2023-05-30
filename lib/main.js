#!/usr/bin/env node
import * as url from "url";

import { oneEnv } from "../lib/oneEnv.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// __dirname will be at ../node_modules/oneenv/lib so we need to come down to root
oneEnv(__dirname + "../../../");
