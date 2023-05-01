import { stringify } from "csv-stringify/sync";

export const formatOutput = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: { [key: string]: any }[],
  format: FormatOptions["format"]
) => {
  switch (format) {
    case "json":
      return JSON.stringify(result, null, 2);
    case "csv":
      return stringify(result, { header: true });
    case "csv-no-header":
      return stringify(result);
    default:
      return `Unknown format: ${format}`;
  }
};
