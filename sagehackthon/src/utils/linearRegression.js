/**
 * linearRegression.js
 * Simple Linear Regression implementation from scratch.
 * Used to predict future student performance based on past marks.
 *
 * Formula: y = mx + b
 *   m = slope     = (n*Σxy - Σx*Σy) / (n*Σx² - (Σx)²)
 *   b = intercept = (Σy - m*Σx) / n
 */

/**
 * Train a linear regression model on (x, y) data points.
 * @param {number[]} xValues - e.g. [1, 2, 3, 4, 5] (time periods)
 * @param {number[]} yValues - e.g. [65, 70, 68, 75, 80] (marks)
 * @returns {{ slope: number, intercept: number, predict: Function }}
 */
export function trainLinearRegression(xValues, yValues) {
  const n = xValues.length;
  if (n === 0) return { slope: 0, intercept: 0, predict: () => 0 };

  const sumX  = xValues.reduce((a, b) => a + b, 0);
  const sumY  = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0);

  const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predict = (x) => {
    const raw = slope * x + intercept;
    return Math.min(100, Math.max(0, Math.round(raw * 10) / 10)); // clamp 0–100
  };

  return { slope, intercept, predict };
}

/**
 * Predict next N values given historical data.
 * @param {number[]} historicalMarks - past marks array
 * @param {number}   steps           - how many future points to predict
 * @returns {number[]} predicted values
 */
export function predictNextScores(historicalMarks, steps = 2) {
  const x = historicalMarks.map((_, i) => i + 1);
  const { predict } = trainLinearRegression(x, historicalMarks);
  const nextX = historicalMarks.length;
  return Array.from({ length: steps }, (_, i) => predict(nextX + i + 1));
}

/**
 * Calculate improvement probability (0–100%) based on trend slope.
 * Positive slope → improving, negative → declining.
 */
export function getImprovementChance(historicalMarks) {
  const x = historicalMarks.map((_, i) => i + 1);
  const { slope } = trainLinearRegression(x, historicalMarks);
  // Normalize slope to a 0–100% probability
  const chance = Math.min(100, Math.max(0, 50 + slope * 10));
  return Math.round(chance);
}

/**
 * Determine risk level based on latest marks and attendance.
 */
export function getRiskLevel(latestMark, attendance) {
  if (latestMark < 50 || attendance < 60) return { level: "High",   color: "text-red-500",    bg: "bg-red-50" };
  if (latestMark < 65 || attendance < 75) return { level: "Medium", color: "text-amber-500",  bg: "bg-amber-50" };
  return                                         { level: "Low",    color: "text-emerald-500", bg: "bg-emerald-50" };
}
