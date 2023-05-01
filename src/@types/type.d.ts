type ValueOf<T> = T[keyof T];

type ListCommandOptions = FormatOptions & QueryOptions;

type FormatOptions = {
  format: "json" | "csv" | "csv-no-header";
};

type QueryOptions = {
  from: DateString;
  to: DateString;
  query?: string;
  timezone: "UTC" | "Asia/Tokyo";
  timeUnit: "second" | "minute" | "hour";
};

type StatOptions = {
  deployTargetBranchName: string;
  leadTimeTargetBranchName: string;
  hotfixTargetBranchName: string;
};

type StatCommandOptions = FormatOptions & QueryOptions & StatOptions;

type DateString = "*" | string;
