export function safetyOverride(bmi: number): number | null {
  if (bmi < 16) return 1;
  if (bmi < 18.5) return 1;
  if (bmi > 32) return 0;
  return null;
}
