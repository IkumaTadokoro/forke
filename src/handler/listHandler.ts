import { TIME_UNIT } from "../lib/dateUtil";
import { searchPullRequest, formatPullRequest } from "../lib/github";
import { formatOutput } from "../lib/output";

export const listHandler = async (args: ListCommandOptions) => {
  const { from, to, query, format, timezone, timeUnit } = args;

  const searchQuery = `is:pr is:merged merged:${from}..${to}${
    query ? " " + query : ""
  }`;
  const prs = formatPullRequest(
    await searchPullRequest(searchQuery),
    timezone,
    TIME_UNIT[timeUnit]
  );
  return formatOutput(prs, format);
};
