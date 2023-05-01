import { describe, expect, test } from "vitest";
import {
  prsOnlyDefaultBranch,
  prsWithDeployAndHotfix,
  prsWithHotfix,
} from "./fixtures/prs";
import { mergeObjArrayToMap, createStat } from "../stat";
import {
  statWithoutOptionAndWithHotfix,
  statWithoutOptionAndWithoutHotfix,
  statWithAllOption,
} from "./fixtures/stats";

describe("createStat", () => {
  test("デフォルトオプション、hotfixなし", () => {
    expect(
      createStat(prsOnlyDefaultBranch, {
        deployTargetBranchName: "^(main|master)$",
        leadTimeTargetBranchName: "^(main|master)$",
        hotfixTargetBranchName: "hotfix",
      })
    ).toStrictEqual(statWithoutOptionAndWithoutHotfix);
  });

  test("デフォルトオプション、hotfixあり", () => {
    expect(
      createStat(prsWithHotfix, {
        deployTargetBranchName: "^(main|master)$",
        leadTimeTargetBranchName: "^(main|master)$",
        hotfixTargetBranchName: "hotfix",
      })
    ).toStrictEqual(statWithoutOptionAndWithHotfix);
  });

  test("deployTargetBranchNameオプション変更", () => {
    expect(
      createStat(prsWithDeployAndHotfix, {
        deployTargetBranchName: "release",
        leadTimeTargetBranchName: "^(main|master)$",
        hotfixTargetBranchName: "hotfix",
      })
    ).toStrictEqual(statWithAllOption);
  });

  test("leadTimeTargetBranchNameオプション変更", () => {
    expect(
      createStat(prsOnlyDefaultBranch, {
        deployTargetBranchName: "^(main|master)$",
        leadTimeTargetBranchName: "main",
        hotfixTargetBranchName: "hotfix",
      })
    ).toStrictEqual(statWithoutOptionAndWithoutHotfix);
  });

  test("hotfixTargetBranchNameオプション指定あり", () => {
    expect(
      createStat(prsWithHotfix, {
        deployTargetBranchName: "^(main|master)$",
        leadTimeTargetBranchName: "main",
        hotfixTargetBranchName: "hotfix",
      })
    ).toStrictEqual(statWithoutOptionAndWithHotfix);
  });

  test("オプションすべて指定あり、hotfixあり", () => {
    expect(
      createStat(prsWithDeployAndHotfix, {
        deployTargetBranchName: "release",
        leadTimeTargetBranchName: "main",
        hotfixTargetBranchName: "hotfix",
      })
    ).toStrictEqual(statWithAllOption);
  });
});

describe("mergeObjArrayToMap", () => {
  test("空の配列を渡すと空のMapが返されること", () => {
    expect(mergeObjArrayToMap([])).toEqual(new Map());
  });

  test("共通のキーを持つオブジェクトをマージして、マップに配列として格納されること", () => {
    const objArray = [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 40, city: "New York" },
      { name: "Charlie", city: "San Francisco" },
    ];

    const expectedMap = new Map([
      ["name", ["Alice", "Bob", "Charlie"]],
      ["age", [30, 40]],
      ["city", ["New York", "San Francisco"]],
    ]);

    expect(mergeObjArrayToMap(objArray)).toEqual(expectedMap);
  });

  test("異なるキーのオブジェクトを別々の配列としてマップにマージすること", () => {
    const objArray = [
      { name: "Alice", age: 30 },
      { city: "New York" },
      { name: "Bob", age: 40, city: "New York" },
    ];

    const expectedMap = new Map([
      ["name", ["Alice", "Bob"]],
      ["age", [30, 40]],
      ["city", ["New York", "New York"]],
    ]);

    expect(mergeObjArrayToMap(objArray)).toEqual(expectedMap);
  });
});
