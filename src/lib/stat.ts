import { FormattedPullRequest } from "./github";
import { sum, average, median } from "./mathUtil";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeObjArrayToMap = <T extends Record<string, any>>(
  objArray: T[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return objArray.reduce((resultMap: Map<keyof T, any[]>, obj) => {
    Object.entries(obj).forEach(([key, value]) =>
      resultMap.set(key as keyof T, [
        ...(resultMap.get(key as keyof T) ?? []),
        value,
      ])
    );
    return resultMap;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, new Map<keyof T, any[]>());
};

type StatOptions = {
  deployTargetBranchName: string;
  leadTimeTargetBranchName: string;
  hotfixTargetBranchName: string;
};

export type Stat = ReturnType<typeof createStat>;

export const createStat = (
  prs: FormattedPullRequest[],
  options: StatOptions
) => {
  const {
    deployTargetBranchName,
    leadTimeTargetBranchName,
    hotfixTargetBranchName,
  } = options;
  const prsDeployTargetBranch = prs.filter((pr) =>
    new RegExp(deployTargetBranchName).test(pr.baseRefName)
  );
  const prsLeadTimeTargetBranch = prs.filter((pr) =>
    new RegExp(leadTimeTargetBranchName).test(pr.baseRefName)
  );
  const prsHotfixTargetBranch = prsLeadTimeTargetBranch.filter((pr) =>
    new RegExp(hotfixTargetBranchName).test(pr.headRefName)
  );

  const prsMap = mergeObjArrayToMap(prsLeadTimeTargetBranch);
  const hotfixPrsMap = mergeObjArrayToMap(prsHotfixTargetBranch);

  const additions = prsMap.get("additions") ?? [];
  const deletions = prsMap.get("deletions") ?? [];
  const changedFileCounts = prsMap.get("changedFileCount") ?? [];
  const totalCommentsCounts = prsMap.get("totalCommentsCount") ?? [];
  const leadTimes = prsMap.get("leadTime") ?? [];
  const timesFromCommitToOpen = prsMap.get("timeFromCommitToOpen") ?? [];
  const timesFromOpenToReview = prsMap.get("timeFromOpenToReview") ?? [];
  const timesFromReviewToMerge = prsMap.get("timeFromReviewToMerge") ?? [];

  return {
    deployCount: prsDeployTargetBranch.length,
    leadTimeTargetCount: prsLeadTimeTargetBranch.length,
    hotfixCount: prsHotfixTargetBranch.length,
    totalAdditions: sum(additions),
    averageAdditions: average(additions),
    medianAdditions: median(additions),
    totalDeletions: sum(deletions),
    averageDeletions: average(deletions),
    medianDeletions: median(deletions),
    totalDiffs: sum(additions) + sum(deletions),
    averageDiffs:
      (sum(additions) + sum(deletions)) / prsLeadTimeTargetBranch.length,
    totalChangedFiles: sum(changedFileCounts),
    averageChangedFiles: average(changedFileCounts),
    medianChangedFiles: median(changedFileCounts),
    totalComments: sum(totalCommentsCounts),
    averageComments: average(totalCommentsCounts),
    medianComments: median(totalCommentsCounts),
    totalLeadTime: sum(leadTimes),
    averageLeadTime: average(leadTimes),
    medianLeadTime: median(leadTimes),
    totalTimeFromCommitToOpen: sum(timesFromCommitToOpen),
    averageTimeFromCommitToOpen: average(timesFromCommitToOpen),
    medianTimeFromCommitToOpen: median(timesFromCommitToOpen),
    totalTimeFromOpenToReview: sum(timesFromOpenToReview),
    averageTimeFromOpenToReview: average(timesFromOpenToReview),
    medianTimeFromOpenToReview: median(timesFromOpenToReview),
    totalTimeFromReviewToMerge: sum(timesFromReviewToMerge),
    averageTimeFromReviewToMerge: average(timesFromReviewToMerge),
    medianTimeFromReviewToMerge: median(timesFromReviewToMerge),
    changeFailureRate:
      prsHotfixTargetBranch.length / prsLeadTimeTargetBranch.length,
    meanTimeToRepair: average(hotfixPrsMap.get("leadTime") || []),
  };
};
