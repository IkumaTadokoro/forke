#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .locale("en")
  .scriptName("forke")
  .usage("Usage: $0 <command> [options]")
  .commandDir("commands")
  .strict()
  .alias({ h: "help", v: "version" }).argv;
