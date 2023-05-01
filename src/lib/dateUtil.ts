import { parseISO, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const DATE_FORMAT = {
  ISO8601: "yyyy-MM-dd'T'HH:mm:ssxxx",
  HUMAN_READABLE: "yyyy-MM-dd HH:mm:ss",
} as const;

/**
 * UTC時刻を受け取り、指定のタイムゾーンの時刻に変換・指定のフォーマットにして返します。
 */
export const formatUTCDate = (
  dateString: string,
  timezone: string,
  dateFormat: (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT]
) => {
  const date = parseISO(dateString);
  const zonedDate = utcToZonedTime(date, timezone);
  return format(zonedDate, dateFormat);
};

/**
 * タイムゾーン付きの時刻文字列を受け取り、指定のフォーマットにして返します。
 */
export const formatLocalDate = (
  dateString: string,
  dateFormat: (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT]
) => {
  const date = parseISO(dateString);
  return format(date, dateFormat);
};

export const TIME_UNIT = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
} as const;

/**
 *  2つの日時の差分を分で返します。
 */
export const calcTimeDiff = (
  date1: Date,
  date2: Date,
  unit: ValueOf<typeof TIME_UNIT> = TIME_UNIT.minute
): number => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const diffInUnit = diff / unit;
  return Math.round((diffInUnit + Number.EPSILON) * 10) / 10;
};
