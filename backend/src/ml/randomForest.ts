type DataPoint = {
  x: number[];
  y: number;
};

type Node = {
  featureIndex?: number;
  threshold?: number;
  left?: Node;
  right?: Node;
  label?: number;
};

function gini(labels: number[]): number {
  const counts: Record<number, number> = {};
  labels.forEach((l) => (counts[l] = (counts[l] || 0) + 1));

  let impurity = 1;
  const total = labels.length;

  for (const key in counts) {
    const prob = counts[key] / total;
    impurity -= prob * prob;
  }

  return impurity;
}

function majorityLabel(labels: number[]): number {
  const counts: Record<number, number> = {};
  labels.forEach((l) => (counts[l] = (counts[l] || 0) + 1));

  return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
}

function bestSplit(data: DataPoint[], features: number[]) {
  let bestFeature = -1;
  let bestThreshold = 0;
  let bestScore = Infinity;

  for (const feature of features) {
    const values = data.map((d) => d.x[feature]);

    for (const threshold of values) {
      const left = data.filter((d) => d.x[feature] <= threshold);
      const right = data.filter((d) => d.x[feature] > threshold);

      if (left.length === 0 || right.length === 0) continue;

      const leftGini = gini(left.map((d) => d.y));
      const rightGini = gini(right.map((d) => d.y));

      const score =
        (left.length / data.length) * leftGini +
        (right.length / data.length) * rightGini;

      if (score < bestScore) {
        bestScore = score;
        bestFeature = feature;
        bestThreshold = threshold;
      }
    }
  }

  return { bestFeature, bestThreshold };
}

function buildTree(
  data: DataPoint[],
  depth: number,
  maxDepth: number,
  featureCount: number,
): Node {
  const labels = data.map((d) => d.y);

  if (depth >= maxDepth || new Set(labels).size === 1) {
    return { label: majorityLabel(labels) };
  }

  const features = Array.from({ length: featureCount }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.sqrt(featureCount)));

  const { bestFeature, bestThreshold } = bestSplit(data, features);

  if (bestFeature === -1) {
    return { label: majorityLabel(labels) };
  }

  const leftData = data.filter((d) => d.x[bestFeature] <= bestThreshold);
  const rightData = data.filter((d) => d.x[bestFeature] > bestThreshold);

  return {
    featureIndex: bestFeature,
    threshold: bestThreshold,
    left: buildTree(leftData, depth + 1, maxDepth, featureCount),
    right: buildTree(rightData, depth + 1, maxDepth, featureCount),
  };
}

function predictTree(node: Node, x: number[]): number {
  if (node.label !== undefined) return node.label;

  if (x[node.featureIndex!] <= node.threshold!) {
    return predictTree(node.left!, x);
  } else {
    return predictTree(node.right!, x);
  }
}

export class RandomForest {
  trees: Node[] = [];
  nEstimators: number;
  maxDepth: number;

  constructor(nEstimators = 10, maxDepth = 5) {
    this.nEstimators = nEstimators;
    this.maxDepth = maxDepth;
  }

  bootstrapSample(data: DataPoint[]): DataPoint[] {
    const sample: DataPoint[] = [];
    for (let i = 0; i < data.length; i++) {
      sample.push(data[Math.floor(Math.random() * data.length)]);
    }
    return sample;
  }

  train(dataset: DataPoint[]) {
    const featureCount = dataset[0].x.length;
    this.trees = [];

    for (let i = 0; i < this.nEstimators; i++) {
      const sample = this.bootstrapSample(dataset);
      const tree = buildTree(sample, 0, this.maxDepth, featureCount);
      this.trees.push(tree);
    }
  }

  predict(x: number[]): number {
    const predictions = this.trees.map((tree) => predictTree(tree, x));

    const counts: Record<number, number> = {};
    predictions.forEach((p) => (counts[p] = (counts[p] || 0) + 1));

    return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  }

  predictBatch(X: number[][]): number[] {
    return X.map((x) => this.predict(x));
  }
}
