import { graphql } from "../gql";
import { request } from "graphql-request";
import { SearchPullRequestQuery } from "../gql/graphql";
import {
  DATE_FORMAT,
  TIME_UNIT,
  calcTimeDiff,
  formatUTCDate,
} from "./dateUtil";

const apiBaseUrl = "https://api.github.com/graphql";
const header = {
  authorization: `Bearer ${process.env["GITHUB_TOKEN"]}`,
};
const searchPullRequestQueryDocument = graphql(`
  query SearchPullRequest($searchQuery: String!, $after: String) {
    search(type: ISSUE, first: 100, query: $searchQuery, after: $after) {
      __typename
      issueCount
      nodes {
        ... on PullRequest {
          __typename
          id
          title
          number
          url
          repository {
            owner {
              login
            }
            name
          }
          author {
            login
          }
          baseRefName
          headRefName
          # 本来はページネーションで取得すべきだが、巨大なOSSでもない限りラベルが大量についているケースは少ないため、3件のみ取得している。
          labels(first: 3) {
            nodes {
              name
            }
          }
          isDraft
          isReadByViewer
          state
          additions
          deletions
          changedFiles
          commits(first: 1) {
            nodes {
              commit {
                commitUrl
                message
                committedDate
                authoredDate
              }
            }
          }
          # force pushを行うと、コミット履歴が消えてしまう。LTを正しく計算するために、HEAD_REF_FORCE_PUSHED_EVENTを取得する。
          # このイベントはforce pushが行われる度に発生し、force push前後のコミット情報を含んでいる。
          # 最初に発生したforce pushの変更前のコミット（beforeCommit）がPRに紐づく最初のコミットになる。
          timelineItems(first: 1, itemTypes: HEAD_REF_FORCE_PUSHED_EVENT) {
            nodes {
              ... on HeadRefForcePushedEvent {
                beforeCommit {
                  commitUrl
                  message
                  committedDate
                  authoredDate
                }
              }
            }
          }
          reviews(first: 1) {
            nodes {
              ... on PullRequestReview {
                createdAt
              }
            }
          }
          reviewRequests(first: 5) {
            nodes {
              requestedReviewer {
                __typename
                ... on Mannequin {
                  login
                }
                ... on User {
                  login
                }
                ... on Team {
                  name
                }
              }
            }
          }
          totalCommentsCount
          createdAt
          updatedAt
          publishedAt
          closedAt
          mergedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

const fetchPullRequest = async (query: string, endCursor?: string) => {
  return await request(
    apiBaseUrl,
    searchPullRequestQueryDocument,
    { searchQuery: query, after: endCursor },
    header
  );
};

export type PullRequest = Extract<
  NonNullable<SearchPullRequestQuery["search"]["nodes"]>[number],
  { __typename: "PullRequest" }
>;

export const searchPullRequest = async (
  query: string,
  previousValues: PullRequest[] = [],
  endCursor?: string
): Promise<PullRequest[]> => {
  const response = await fetchPullRequest(query, endCursor);
  const { pageInfo } = response.search;
  const currentPullRequests =
    response.search.nodes?.flatMap((node) =>
      node && node.__typename === "PullRequest" ? node : []
    ) ?? [];
  const pullRequests = [...previousValues, ...currentPullRequests];

  // base case
  if (!pageInfo.hasNextPage || !pageInfo.endCursor) {
    return pullRequests;
  }

  // recursive case
  return searchPullRequest(query, pullRequests, pageInfo.endCursor);
};

export type FormattedPullRequest = ReturnType<typeof formatPullRequest>[number];
export const formatPullRequest = (
  pullRequests: PullRequest[],
  timezone: string,
  timeUnit: ValueOf<typeof TIME_UNIT>
) => {
  return pullRequests.map((pullRequest) => {
    let firstCommit:
      | {
          message: string;
          commitUrl: string;
          committedDate: string;
          authoredDate: string;
        }
      | undefined = pullRequest.commits?.nodes?.[0]?.commit;
    let isForcePushed = false;
    const forcePushedHistories = pullRequest.timelineItems?.nodes;
    if (
      forcePushedHistories &&
      forcePushedHistories[0] &&
      forcePushedHistories[0].__typename === "HeadRefForcePushedEvent" &&
      forcePushedHistories[0].beforeCommit
    ) {
      isForcePushed = true;
      firstCommit = forcePushedHistories[0].beforeCommit;
    }
    // TODO: レビュワーの取得が取れたり、取れなかったり不安定なので、GraphQLかPATあたりを見直す
    const reviewers =
      pullRequest.reviewRequests?.nodes?.map((node) => {
        if (node) {
          switch (node.requestedReviewer?.__typename) {
            case "Mannequin":
              return node.requestedReviewer?.login;
            case "User":
              return node.requestedReviewer?.login;
            case "Team":
              return node.requestedReviewer?.name;
            default:
              return "";
          }
        }
        return "";
      }) ?? [];

    const formatDate = (date?: string) =>
      date ? formatUTCDate(date, timezone, DATE_FORMAT.HUMAN_READABLE) : "";
    const {
      timeFromCommitToOpen,
      timeFromOpenToReview,
      timeFromReviewToMerge,
      leadTime,
    } = calcLeadTime({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      firstCommitAt: new Date(firstCommit!.authoredDate),
      openedAt: new Date(pullRequest.createdAt),
      // レビューなしでマージされている場合は、Approveをレビューとみなす
      firstReviewedAt: new Date(
        pullRequest.reviews?.nodes?.[0]?.createdAt ?? pullRequest.mergedAt
      ),
      mergedAt: new Date(pullRequest.mergedAt),
      timeUnit,
    });

    return {
      title: pullRequest.title,
      url: pullRequest.url as string,
      repository: `${pullRequest.repository.owner.login}/${pullRequest.repository.name}`,
      author: pullRequest.author?.login,
      baseRefName: pullRequest.baseRefName,
      headRefName: pullRequest.headRefName,
      labels:
        pullRequest.labels?.nodes?.flatMap((label) => label?.name ?? []) ?? "",
      isDraft: pullRequest.isDraft,
      isReadByViewer: pullRequest.isReadByViewer,
      isForcePushed,
      state: pullRequest.state as string,
      additions: pullRequest.additions,
      deletions: pullRequest.deletions,
      changedFileCount: pullRequest.changedFiles,
      //   firstCommitMessage: firstCommit?.message ?? "",
      firstCommitUrl: firstCommit?.commitUrl ?? "",
      firstCommitAuthoredDate: formatDate(firstCommit?.authoredDate),
      firstCommitCommittedDate: formatDate(firstCommit?.committedDate),
      firstReviewedAt: formatDate(pullRequest.reviews?.nodes?.[0]?.createdAt),
      reviewers,
      totalCommentsCount: pullRequest.totalCommentsCount ?? 0,
      createdAt: formatDate(pullRequest.createdAt),
      updatedAt: formatDate(pullRequest.updatedAt),
      publishedAt: formatDate(pullRequest.publishedAt),
      closedAt: formatDate(pullRequest.closedAt),
      mergedAt: formatDate(pullRequest.mergedAt),
      timeFromCommitToOpen,
      timeFromOpenToReview,
      timeFromReviewToMerge,
      leadTime,
    };
  });
};

export const calcLeadTime = ({
  firstCommitAt,
  openedAt,
  firstReviewedAt,
  mergedAt,
  timeUnit,
}: {
  firstCommitAt: Date;
  openedAt: Date;
  firstReviewedAt: Date;
  mergedAt: Date;
  timeUnit: ValueOf<typeof TIME_UNIT>;
}) => {
  const timeFromCommitToOpen = calcTimeDiff(firstCommitAt, openedAt, timeUnit);
  const timeFromOpenToReview = calcTimeDiff(
    openedAt,
    firstReviewedAt,
    timeUnit
  );
  const timeFromReviewToMerge = calcTimeDiff(
    firstReviewedAt,
    mergedAt,
    timeUnit
  );
  const leadTime =
    timeFromCommitToOpen + timeFromOpenToReview + timeFromReviewToMerge;
  return {
    timeFromCommitToOpen,
    timeFromOpenToReview,
    timeFromReviewToMerge,
    leadTime,
  };
};
