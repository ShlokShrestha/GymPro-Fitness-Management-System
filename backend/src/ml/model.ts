import { RandomForestClassifier } from "ml-random-forest";
import fs from "fs";
import { dataset } from "./dataset";

export const model: any = new RandomForestClassifier({
  nEstimators: 120,
});

const MODEL_PATH = "./rf-model.json";

export function trainModel(dataset: any[]) {
  const X = dataset.map((d) => d.x);
  const y = dataset.map((d) => d.y);

  model.train(X, y);

  fs.writeFileSync(MODEL_PATH, JSON.stringify(model.toJSON()));
}

export function loadModel() {
  if (!fs.existsSync("rf-model.json")) {
    console.log("⚠️ No saved model found. Training new model...");

    const X = dataset.map((d) => d.x);
    const y = dataset.map((d) => d.y);

    model.train(X, y);

    fs.writeFileSync("rf-model.json", JSON.stringify({ trained: true }));

    return;
  }
  const X = dataset.map((d) => d.x);
  const y = dataset.map((d) => d.y);

  model.train(X, y);
}
