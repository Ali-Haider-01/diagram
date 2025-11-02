export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (!previous || previous === 0) return 0;
  const change = ((current - previous) / previous) * 100;

  // Cap the value between -100 and 100
  if (change > 100) return 100;
  if (change < -100) return -100;

  return +change.toFixed(2);
}
