import { describe, expect, test } from "vitest";
import { average, median } from "../mathUtil";

describe("average", () => {
  test.each([
    [[0, 0, 0, 0, 0], 0], //合計が0
    [[1.1, 2.2, 3.3], 2.2], // 合計が小数
    [[1, 4, 7, 8, 9], 5.8], // 平均と中央値が異なる
    [[1, 2, 3, 4, 5, 6], 3.5], // 小数第1位の小数
    [[1, 2, 3, 4, 5, 0, 7], 3.14], // 小数第2位の小数
    [[], 0], // 空配列
  ])(`average(%s): %s`, (numbers, expected) => {
    expect(average(numbers)).toBe(expected);
  });
});

describe("median", () => {
  test.each([
    [[0, 0, 0, 0, 0], 0], //合計が0
    [[1.1, 2.2, 3.3], 2.2], // 合計が小数
    [[1, 4, 7, 8, 9], 7], // 平均と中央値が異なる
    [[1, 2, 3, 4, 5, 6], 3.5], // 小数第1位の小数
    [[1, 2, 3, 4, 5, 0, 7], 3], // 小数第2位の小数
    [[], 0], // 空配列
  ])(`median(%s): %s`, (numbers, expected) => {
    expect(median(numbers)).toBe(expected);
  });
});
