// formatDateのテストを書く

import { describe, expect, test } from "vitest";
import { DATE_FORMAT, formatUTCDate } from "../dateUtil";

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
