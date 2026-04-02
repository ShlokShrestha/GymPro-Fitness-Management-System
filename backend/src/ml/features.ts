export function buildFeatures(goal: any) {
  const age = Number(goal.age ?? 25);
  const bmi = Number(goal.bmi ?? 22);
  const startWeight = Number(goal.startWeight ?? 70);
  const targetWeight = Number(goal.targetWeight ?? 65);

  return {
    age,
    bmi,
    startWeight,
    targetWeight,
    weightDiff: startWeight - targetWeight,
  };
}
