import { searchPullRequest, formatPullRequest } from "../lib/github";
import { stringify } from "csv-stringify/sync";

export const listHandler = async (args: ListOptions) => {
  const { from, to, query, format, timezone } = args;

  const searchQuery = `is:pr is:merged merged:${from}..${to}${
    query ? " " + query : ""
  }`;
  const prs = formatPullRequest(await searchPullRequest(searchQuery), timezone);
  return formatResult(prs, format);
};

const formatResult = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: { [key: string]: any }[],
  format: ListOptions["format"]
) => {
  switch (format) {
    case "json":
      return JSON.stringify(result, null, 2);
    case "csv":
      return stringify(result, { header: true });
    default:
      return `Unknown format: ${format}`;
  }
};
