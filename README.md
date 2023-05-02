# Forke

Forke is a simple CLI tool designed to measure development productivity from GitHub info.

## Install

```bash
# Install
npm install -g forke

# This npm requires GITHUB_TOKEN, so please set it in the environment variable in any way.
export GITHUB_TOKEN='...'
```

## Concepts

This tool is designed to measure Four Keys, a development productivity indicator.

Measuring the Four Keys is not enough; it is important to link the results of the measurement to improvements. For this reason, a `stat` command is provided to retrieve the indicators and a `list` command to output the original data of the indicators.
The user of the tool is expected to see from the results of the list command which work of the development team is the bottleneck when each indicator is bad.

### Lead time for changes & Deployment frequency

```
[BaseBranch]                                                    to LeadTimeBranch |  to DeployBranch |
|---------------------------------- lead time ------------------------------------|--   No Stat    --|
|-- timeFromCommitToOpen --|-- timeFromOpenToReview --|-- timeFromReviewToMerge --|------------------|
------------------------------------------------------------------------------------------------------
^                          ^                          ^                           ^                  ^
first commit        create PullRequest            first review              merge PullRequest       release
```

- **Deployment frequency = Number of PullRequests targeting DeployBranch**
- **Lead time for changes = timeFromCommitToOpen + timeFromOpenToReview + timeFromReviewToMerge.**
  - As shown in the figure, the time between the merge and the deployment is not captured by Forke.
  - As the deployment process is heavily influenced by the business side, I have decided that it is not possible to drill down from the GitHub data and have used this specification, but I may make it possible to obtain this information in the future.

### Change failure rate & Time to restore service

- **Change failure rate = (Number of PullRequests targeting LeadTimeBranch and head is hotfixBranch) / (Number of PullRequests targeting LeadTimeBranch)**
- **Time to restore service = Average(Lead time of PullRequests targeting LeadTimeBranch and head is hotfixBranch)**
  - The Lead 　 time calculation method is the same as for calculating lead time for changes.

## Usage

### List PullRequests

List merged pull requests that match the search conditions are output to standard output.

```bash
npx forke list --query ...
```

#### Result

| Name                     | Description                                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title                    | The title of the pull request.                                                                                                                                                                    |
| url                      | The URL of the pull request.                                                                                                                                                                      |
| repository               | The repository's owner and name, separated by a slash (ex: IkumaTadokoro/Forke).                                                                                                                  |
| author                   | Pull Request's author name.                                                                                                                                                                       |
| baseRefName              | The name of the base branch for the pull request.                                                                                                                                                 |
| headRefName              | The name of the head branch for the pull request.                                                                                                                                                 |
| labels                   | The labels array associated with the pull request.                                                                                                                                                |
| isDraft                  | Whether the pull request is a draft or not.                                                                                                                                                       |
| isReadByViewer           | Whether the pull request has been read by the viewer.                                                                                                                                             |
| isForcePushed            | Whether the pull request has been force pushed.                                                                                                                                                   |
| state                    | The state of the pull request ("OPEN", "MERGED", "CLOSED").                                                                                                                                       |
| additions                | The number of lines added in the pull request.                                                                                                                                                    |
| deletions                | The number of lines deleted in the pull request.                                                                                                                                                  |
| changedFileCount         | The number of files changed in the pull request.                                                                                                                                                  |
| firstCommitUrl           | The url of the first commit associated with the pull request; if it has been force pushed, it refers to the commit before it was force pushed, not the first commit currently associated with it. |
| firstCommitAuthoredDate  | The authored date of the first commit associated with the pull request.                                                                                                                           |
| firstCommitCommittedDate | The committed date of the first commit associated with the pull request.                                                                                                                          |
| firstReviewedAt          | Time the pull request was first reviewed.                                                                                                                                                         |
| reviewers                | Reviewer names (Array).                                                                                                                                                                           |
| totalCommentsCount       | The total number of comments on the pull request.                                                                                                                                                 |
| createdAt                | The creation date of the pull request.                                                                                                                                                            |
| updatedAt                | The last update date of the pull request.                                                                                                                                                         |
| publishedAt              | The publication date of the pull request.                                                                                                                                                         |
| closedAt                 | The date when the pull request was closed.                                                                                                                                                        |
| mergedAt                 | The date when the pull request was merged.                                                                                                                                                        |
| timeFromCommitToOpen     | The lead time between firstCommitAuthoredDate and pullRequest createdAt. The units are those specified in the `timeunit` option.                                                                  |
| timeFromOpenToReview     | The lead time between pullRequest createdAt and firstReviewedAt. The units are those specified in the `timeunit` option.                                                                          |
| timeFromReviewToMerge    | The lead time between firstReviewedAt and pullRequest mergedAt. The units are those specified in the `timeunit` option.                                                                           |
| leadTime                 | Total of timeFromCommitToOpen, timeFromOpenToReview and timeFromReviewToMerge.                                                                                                                    |

#### Options

The following options can be specified.

```bash
# ex)
npx forke list -f 2023-04-01T00:00:00+09:00 -q 'base:main base:release' --format json --timeunit hour
```

| Long     | Alias | Choices                  | Default      | Description                                                                                                                                                                                                                                                                                                      |
| -------- | ----- | ------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from     | f     | (any string)             | `*`          | Starting point of the PullRequest search condition(mergedAt).                                                                                                                                                                                                                                                    |
| to       | t     | (any string)             | `*`          | End point of the PullRequest search condition(mergedAt)                                                                                                                                                                                                                                                          |
| query    | q     | (any string)             | -            | Search query. Internally is:pr is:merged merged:{from}..{to} is specified, this option allows additional refinement criteria to be specified.　 See [here](https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax) for options that can be specified. |
| timezone | -     | UTC, Asia/Tokyo          | `Asia/Tokyo` | Specifies in which time zone the acquisition results are displayed.                                                                                                                                                                                                                                              |
| format   | -     | csv, csv-no-header, json | `csv`        | Result format.                                                                                                                                                                                                                                                                                                   |
| timeunit | -     | minute, hour, second     | `minute`     | Unit for calculating lead time.                                                                                                                                                                                                                                                                                  |
| order    | o     | asc, dec                 | `asc`        | Ascending or descending result order of MergedAt.                                                                                                                                                                                                                                                                |

### Create Stats

Output statistics from pull requests that match the specified conditions.

```bash
npx forke stat --query ...
```

#### Result

| Name                         | Description                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| from                         | Starting period of the measurement; value specified in the from option.                  |
| to                           | End period of the measurement, the value specified in the to option.                     |
| deployCount                  | The number of pull requests for the deploy target branch.                                |
| leadTimeTargetCount          | The number of pull requests for the lead time target branch.                             |
| hotfixCount                  | The number of pull requests for the hotfix target branch.                                |
| totalAdditions               | The total number of lines added across all pull requests.                                |
| averageAdditions             | The average number of lines added per pull request.                                      |
| medianAdditions              | The median number of lines added per pull request.                                       |
| totalDeletions               | The total number of lines deleted across all pull requests.                              |
| averageDeletions             | The average number of lines deleted per pull request.                                    |
| medianDeletions              | The median number of lines deleted per pull request.                                     |
| totalDiffs                   | The total number of line differences (additions and deletions) across all pull requests. |
| averageDiffs                 | The average number of line differences (additions and deletions) per pull request.       |
| totalChangedFiles            | The total number of files changed across all pull requests.                              |
| averageChangedFiles          | The average number of files changed per pull request.                                    |
| medianChangedFiles           | The median number of files changed per pull request.                                     |
| totalComments                | The total number of comments across all pull requests.                                   |
| averageComments              | The average number of comments per pull request.                                         |
| medianComments               | The median number of comments per pull request.                                          |
| totalLeadTime                | The total lead time across all pull requests.                                            |
| averageLeadTime              | The average lead time per pull request.                                                  |
| medianLeadTime               | The median lead time per pull request.                                                   |
| totalTimeFromCommitToOpen    | The total time from commit to open across all pull requests.                             |
| averageTimeFromCommitToOpen  | The average time from commit to open per pull request.                                   |
| medianTimeFromCommitToOpen   | The median time from commit to open per pull request.                                    |
| totalTimeFromOpenToReview    | The total time from open to review across all pull requests.                             |
| averageTimeFromOpenToReview  | The average time from open to review per pull request.                                   |
| medianTimeFromOpenToReview   | The median time from open to review per pull request.                                    |
| totalTimeFromReviewToMerge   | The total time from review to merge across all pull requests.                            |
| averageTimeFromReviewToMerge | The average time from review to merge per pull request.                                  |
| medianTimeFromReviewToMerge  | The median time from review to merge per pull request.                                   |
| changeFailureRate            | The ratio of hotfix pull requests to lead time target branch pull requests.              |
| meanTimeToRepair             | The average lead time for hotfix pull requests.                                          |

#### Options

The following options can be specified.

```bash
# ex)
npx forke stat -f 2023-04-01T00:00:00+09:00 -q 'base:main base:release' --format json --timeunit hour --deployBranch release
```

| Long           | Alias | Choices                  | Default              | Description                                                                                                                                                                                                                                                                                                    |
| -------------- | ----- | ------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from           | f     | (any string)             | `*`                  | Starting point of the PullRequest search condition(mergedAt).                                                                                                                                                                                                                                                  |
| to             | t     | (any string)             | `*`                  | End point of the PullRequest search condition(mergedAt).                                                                                                                                                                                                                                                       |
| query          | q     | (any string)             | -                    | Search query. Internally is:pr is:merged merged:{from}..{to} is specified, this option allows additional refinement criteria to be specified. See [here](https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax) for options that can be specified. |
| timezone       | -     | UTC, Asia/Tokyo          | `Asia/Tokyo`         | Specifies in which time zone the acquisition results are displayed.                                                                                                                                                                                                                                            |
| format         | -     | csv, csv-no-header, json | `csv`                | Result format.                                                                                                                                                                                                                                                                                                 |
| timeunit       | -     | minute, hour, second     | `minute`             | Unit for calculating lead time.                                                                                                                                                                                                                                                                                |
| deployBranch   | -     | RegExp                   | `^(main \| master)$` | Target branch name for deploy.                                                                                                                                                                                                                                                                                 |
| leadTimeBranch | -     | RegExp                   | `^(main \| master)$` | Target branch name for lead time.                                                                                                                                                                                                                                                                              |
| hotfixBranch   | -     | RegExp                   | `hotfix`             | Target branch name for hotfix.                                                                                                                                                                                                                                                                                 |

## Contribution

### Issues

The following Issue is accepted (English or Japanese).

- Questions about features
- Report errors or problems
- Propose additions or improvements to feature

Please click [here](https://github.com/IkumaTadokoro/forke/issues/new) to issue.

### How to send Pull Request

1. Fork the repository
2. Create a branch
3. Add or modify feature
4. Run unit test
5. Check the feature in your terminal
6. Commit Changes
7. Push branch
8. Create Pull Request

### How to set up a Local Development Environment

First, clone the forked repository locally.

```bash
git clone git@github.com:IkumaTadokoro/forke.git
```

Install dependencies.

```bash
npm i
```

(Option) Setup envfile for debug. When the configuration is complete, the script can be executed in `npm run dev -- <command> <options>`.

```bash
cp .env.sample .env
# Set your secrets in .env.
```

That's it. Happy coding :+1:

## License

Forke is available under the MIT License.
