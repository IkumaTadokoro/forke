import { TIME_UNIT } from "../lib/dateUtil";
import { searchPullRequest, formatPullRequest } from "../lib/github";
import { formatOutput } from "../lib/output";

export const listHandler = async (args: ListCommandOptions) => {
  const { from, to, query, format, timezone, timeUnit, order } = args;

  const searchQuery = `is:pr is:merged merged:${from}..${to}${
    query ? " " + query : ""
  }`;
  const prs = formatPullRequest(
    await searchPullRequest(searchQuery),
    timezone,
    TIME_UNIT[timeUnit]
  );
  const sortedPrs = prs.sort((a, b) => {
    if (a.mergedAt < b.mergedAt) {
      return order === "asc" ? -1 : 1;
    }
    if (a.mergedAt > b.mergedAt) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  return formatOutput(sortedPrs, format);
};
