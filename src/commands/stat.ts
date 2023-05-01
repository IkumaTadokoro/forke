import type { Arguments, Argv } from "yargs";
import { Spinner } from "../lib/spinner";
import { statHandler } from "../handler/statHandler";
import { statOptions } from "./options";

export const command = "stat";
export const desc = "Create statistics of pull request";

export const builder = (
  yargs: Argv<StatCommandOptions>
): Argv<StatCommandOptions> => {
  return yargs.options(statOptions);
};

export const handler = async (
  args: Arguments<StatCommandOptions>
): Promise<void> => {
  const spinner = new Spinner("Loading...");
  spinner.start();
  const result = await statHandler(args);
  spinner.stop();
  process.stdout.write(result);
};
