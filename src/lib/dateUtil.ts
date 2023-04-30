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
