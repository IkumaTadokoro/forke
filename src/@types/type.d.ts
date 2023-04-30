type ListOptions = {
  from: DateString;
  to: DateString;
  format: "json" | "csv";
  query?: string;
  timezone: "UTC" | "Asia/Tokyo";
};

type DateString = "*" | string;
