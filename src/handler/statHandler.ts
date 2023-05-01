import { DATE_FORMAT, TIME_UNIT, formatLocalDate } from "../lib/dateUtil";
import { searchPullRequest, formatPullRequest } from "../lib/github";
import { formatOutput } from "../lib/output";
import { createStat } from "../lib/stat";

export const statHandler = async (args: StatCommandOptions) => {
  const {
    from,
    to,
    query,
    timezone,
    deployTargetBranchName,
    leadTimeTargetBranchName,
    hotfixTargetBranchName,
    format,
    timeUnit,
  } = args;

  const searchQuery = `is:pr is:merged merged:${from}..${to}${
    query ? " " + query : ""
  }`;
  const prs = formatPullRequest(
    await searchPullRequest(searchQuery),
    timezone,
    TIME_UNIT[timeUnit]
  );
  const term = {
    from: formatLocalDate(from, DATE_FORMAT.HUMAN_READABLE),
    to: formatLocalDate(to, DATE_FORMAT.HUMAN_READABLE),
  };
  const stat = createStat(prs, {
    deployTargetBranchName,
    leadTimeTargetBranchName,
    hotfixTargetBranchName,
  });
  return formatOutput([{ ...term, ...stat }], format);
};
