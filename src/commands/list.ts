import type { Arguments, Argv } from "yargs";
import { listHandler } from "../handler/listHandler";
import { Spinner } from "../lib/spinner";
import { listOptions } from "./options";

export const command = "list";
export const desc = "List pull request";

export const builder = (
  yargs: Argv<ListCommandOptions>
): Argv<ListCommandOptions> => {
  return yargs.options(listOptions);
};

export const handler = async (
  args: Arguments<ListCommandOptions>
): Promise<void> => {
  const spinner = new Spinner("Loading...");
  spinner.start();
  const result = await listHandler(args);
  spinner.stop();
  process.stdout.write(result);
};
