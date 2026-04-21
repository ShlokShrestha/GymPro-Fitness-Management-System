import fs from "fs";
import { dataset } from "./dataset";
import { RandomForest } from "./randomForest";

const MODEL_PATH = "./rf-model.json";

const model = new RandomForest(20, 6);

export function trainModel() {
  model.train(dataset);

  fs.writeFileSync(MODEL_PATH, JSON.stringify(model));
  console.log("✅ Model trained & saved");
}

export function loadModel() {
  if (!fs.existsSync(MODEL_PATH)) {
    console.log("⚠️ No saved model found. Training new model...");
    trainModel();
    return;
  }

  const raw = JSON.parse(fs.readFileSync(MODEL_PATH, "utf-8"));
  Object.assign(model, raw);

  console.log("✅ Model loaded");
}

export function predict(input: number[]) {
  return model.predict(input);
}
