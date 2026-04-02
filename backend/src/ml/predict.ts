import { model } from "./model";
import { safetyOverride } from "./safety";

export const labelMap: Record<number, string> = {
  0: "fat_loss",
  1: "muscle_gain",
  2: "maintenance",
};

export function predictWorkout(features: any) {
  const safety = safetyOverride(features.bmi);
  if (safety !== null) return safety;

  const input = [
    features.age,
    features.bmi,
    features.startWeight,
    features.targetWeight,
    features.weightDiff,
  ];

  const result = model.predict([input])[0];
  return result;
}
