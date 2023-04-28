#!/usr/bin/env node

import yargs from "yargs";

const args = yargs
  .locale("en")
  .scriptName("aniya")
  .alias("h", "help")
  .alias("v", "version")
  .command("* <message>", "print a message received as an argument")
  .parseSync();

console.log(args["message"]);
