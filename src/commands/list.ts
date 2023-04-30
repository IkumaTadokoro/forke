import type { Arguments, Argv } from "yargs";
import { listHandler } from "../handler/listHandler";
import { Spinner } from "../lib/spinner";

const options = {
  from: {
    alias: "f",
    type: "string",
    describe: "Starting point of the PullRequest search condition(mergedAt)",
    default: "*",
    requireArgs: true,
  },
  to: {
    alias: "t",
    type: "string",
    describe: "End point of the PullRequest search condition(mergedAt)",
    default: "*",
    requireArgs: true,
  },
  query: {
    alias: "q",
    type: "string",
    describe: "Search query",
    requiresArgs: true,
  },
  timezone: {
    alias: "tz",
    type: "string",
    choices: ["UTC", "Asia/Tokyo"] as const,
    default: "Asia/Tokyo",
    describe: "Timezone",
    requiresArgs: true,
  },
  format: {
    type: "string",
    choices: ["csv", "json"] as const,
    default: "csv",
    describe: "Result format",
    requiresArgs: true,
  },
} as const;

export const command = "list";
export const desc = "List pull request";

export const builder = (yargs: Argv<ListOptions>): Argv<ListOptions> => {
  return yargs.options(options);
};

export const handler = async (args: Arguments<ListOptions>): Promise<void> => {
  const spinner = new Spinner("Loading...");
  spinner.start();
  const result = await listHandler(args);
  spinner.stop();
  process.stdout.write(result);
};
