#!/usr/bin/env node

import { StaticWebsite } from "../dist/server.js";

const website = new StaticWebsite();

website.setup();