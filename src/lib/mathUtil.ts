export const sum = (numbers: number[]) =>
  numbers.reduce((acc, cur) => acc + cur, 0);

export const average = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  // 小数第2位までの精度で計算する
  return Math.round((sum(numbers) / numbers.length) * 100) / 100;
};

export const median = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  const sorted = numbers.sort((a, b) => a - b);
  const center = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    // 偶数の場合は中央の2つの平均を取る
    const leftValue = sorted[center - 1] ?? 0;
    const rightValue = sorted[center] ?? 0;
    return average([leftValue, rightValue]);
  } else {
    // 奇数の場合は中央の値をそのまま返す
    return sorted[center] as number;
  }
};
