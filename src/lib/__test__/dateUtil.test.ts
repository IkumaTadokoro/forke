import { describe, expect, test } from "vitest";
import {
  DATE_FORMAT,
  TIME_UNIT,
  calcTimeDiff,
  formatUTCDate,
} from "../dateUtil";

describe("format Date (With TZ)", () => {
  test.each<[string, string, string]>([
    ["2023-01-01T00:00:00Z", "Asia/Tokyo", "2023-01-01T09:00:00+09:00"],
    ["2023-01-01T00:00:00+09:00", "Asia/Tokyo", "2023-01-01T00:00:00+09:00"],
  ])(
    `formatDate(%s, %s, ${DATE_FORMAT.ISO8601}): %s`,
    (dateString, timezone, expected) => {
      const dateFormat = DATE_FORMAT.ISO8601;
      expect(formatUTCDate(dateString, timezone, dateFormat)).toBe(expected);
    }
  );

  test.each<[string, string, string]>([
    ["2023-01-01T00:00:00Z", "Asia/Tokyo", "2023-01-01 09:00:00"],
    ["2023-01-01T00:00:00+09:00", "Asia/Tokyo", "2023-01-01 00:00:00"],
  ])(
    `formatDate(%s, %s, ${DATE_FORMAT.HUMAN_READABLE}): %s`,
    (dateString, timezone, expected) => {
      const dateFormat = DATE_FORMAT.HUMAN_READABLE;
      expect(formatUTCDate(dateString, timezone, dateFormat)).toBe(expected);
    }
  );
});

describe("format Date (Without TZ)", () => {
  test.each<[string, string, string]>([
    ["2023-01-01", "Asia/Tokyo", "2023-01-01T00:00:00+09:00"],
  ])(
    `formatDate(%s, %s, ${DATE_FORMAT.ISO8601}): %s`,
    (dateString, timezone, expected) => {
      const dateFormat = DATE_FORMAT.ISO8601;
      expect(formatUTCDate(dateString, timezone, dateFormat)).toBe(expected);
    }
  );

  test.each<[string, string, string]>([
    ["2023-01-01", "Asia/Tokyo", "2023-01-01 00:00:00"],
  ])(
    `formatDate(%s, %s, ${DATE_FORMAT.HUMAN_READABLE}): %s`,
    (dateString, timezone, expected) => {
      const dateFormat = DATE_FORMAT.HUMAN_READABLE;
      expect(formatUTCDate(dateString, timezone, dateFormat)).toBe(expected);
    }
  );
});

describe("calcTimeDiff", () => {
  test.each<[Date, Date, number]>([
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T01:00:00Z"), 60],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:06:00Z"), 6],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:05:00Z"), 5],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:01:00Z"), 1],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:00:01Z"), 0],
  ])(`[DEFAULT: minute]calcTimeDiff(%s, %s): %s`, (date1, date2, expected) => {
    expect(calcTimeDiff(date1, date2)).toBe(expected);
  });

  test.each<[Date, Date, number]>([
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T01:00:00Z"), 1],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:06:00Z"), 0.1],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:05:00Z"), 0.1],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:01:00Z"), 0],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:00:01Z"), 0],
  ])(`[hour]calcTimeDiff(%s, %s): %s`, (date1, date2, expected) => {
    expect(calcTimeDiff(date1, date2, TIME_UNIT.hour)).toBe(expected);
  });

  test.each<[Date, Date, number]>([
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T01:00:00Z"), 60],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:06:00Z"), 6],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:05:00Z"), 5],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:01:00Z"), 1],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:00:01Z"), 0],
  ])(`[minute]calcTimeDiff(%s, %s): %s`, (date1, date2, expected) => {
    expect(calcTimeDiff(date1, date2, TIME_UNIT.minute)).toBe(expected);
  });

  test.each<[Date, Date, number]>([
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T01:00:00Z"), 3600],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:06:00Z"), 360],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:05:00Z"), 300],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:01:00Z"), 60],
    [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:00:01Z"), 1],
  ])(`[second]calcTimeDiff(%s, %s): %s`, (date1, date2, expected) => {
    expect(calcTimeDiff(date1, date2, TIME_UNIT.second)).toBe(expected);
  });
});
