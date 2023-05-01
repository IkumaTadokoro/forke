const commonOptions = {
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
    choices: ["csv", "csv-no-header", "json"] as const,
    default: "csv",
    describe: "Result format",
    requiresArgs: true,
  },
  timeUnit: {
    alias: "timeunit",
    type: "string",
    choices: ["minute", "hour", "second"] as const,
    default: "minute",
    describe: "Time unit for lead time",
    requiresArgs: true,
  },
} as const;

export const listOptions = {
  ...commonOptions,
} as const;

export const statOptions = {
  ...commonOptions,
  deployTargetBranchName: {
    alias: "deployBranch",
    type: "string",
    default: "^(main|master)$",
    describe: "Target branch name for deploy.",
    requiresArgs: true,
  },
  leadTimeTargetBranchName: {
    alias: "leadTimeBranch",
    type: "string",
    default: "^(main|master)$",
    describe: "Target branch name for lead time.",
    requiresArgs: true,
  },
  hotfixTargetBranchName: {
    alias: "hotfixBranch",
    type: "string",
    default: "hotfix",
    describe: "Target branch name for hotfix.",
    requiresArgs: true,
  },
} as const;
