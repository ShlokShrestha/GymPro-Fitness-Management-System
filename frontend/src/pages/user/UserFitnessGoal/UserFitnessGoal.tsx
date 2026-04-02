import { useEffect, useState } from "react";
import API from "../../../api/axios";
import "./UserFitnessGoal.css";

export default function UserFitnessGoal() {
  const [goal, setGoal] = useState<any>(null);
  const [workout, setWorkout] = useState<any>(null);
  const [loadingWorkout, setLoadingWorkout] = useState(false);

  const [form, setForm] = useState<any>({
    goalType: "WEIGHT_LOSS",
    startWeight: "",
    targetWeight: "",
    height: "",
    dateOfBirth: "",
    gender: "MALE",
  });

  // BMI CALCULATION
  const calculateBMI = (weight: number, heightCm: number) => {
    if (!weight || !heightCm) return 0;
    const h = heightCm / 100;
    return Number((weight / (h * h)).toFixed(2));
  };

  const bmi = calculateBMI(Number(form.startWeight), Number(form.height));

  const getBMICategory = (bmi: number) => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
  };

  const fetchGoal = async () => {
    try {
      const res = await API.get("/fitness-goal");
      setGoal(res.data.data);

      if (res.data.data) {
        setForm({
          goalType: res.data.data.goalType,
          startWeight: res.data.data.startWeight,
          targetWeight: res.data.data.targetWeight,
          height: res.data.data.height,
          dateOfBirth: res.data.data.dateOfBirth || "",
          gender: res.data.data.gender || "MALE",
        });
        fetchWorkoutRecommendation(res.data.data.userId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      goalType: form.goalType,
      startWeight: Number(form.startWeight),
      targetWeight: Number(form.targetWeight),
      height: Number(form.height),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
    };

    try {
      if (goal) {
        await API.put("/fitness-goal", payload);
      } else {
        await API.post("/fitness-goal", payload);
      }
      fetchGoal();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  const fetchWorkoutRecommendation = async (userId?: string) => {
    try {
      if (!userId && !goal?.userId) return;

      setLoadingWorkout(true);

      const res = await API.get("/fitness-goal/workout");

      setWorkout(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingWorkout(false);
    }
  };

  return (
    <div className="fitness-container">
      <h1 className="title">🏋️ Fitness Goal Tracker + AI Coach</h1>

      <div className="layout">
        <div className="form-card">
          <div className="field">
            <label>Goal Type</label>
            <select
              name="goalType"
              value={form.goalType}
              onChange={handleChange}
            >
              <option value="WEIGHT_LOSS">Weight Loss</option>
              <option value="WEIGHT_GAIN">Weight Gain</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="MUSCLE_BUILDING">Muscle Building</option>
            </select>
          </div>

          <div className="field-group">
            <div className="field">
              <label>Start Weight</label>
              <input
                type="number"
                name="startWeight"
                value={form.startWeight}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Target Weight</label>
              <input
                type="number"
                name="targetWeight"
                value={form.targetWeight}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <button className="btn" onClick={handleSubmit}>
            {goal ? "Update Goal" : "Create Goal"}
          </button>
        </div>

        <div className="goal-card">
          <div className="bmi-card">
            <h2>📊 BMI Calculator</h2>
            <p className="bmi-value">{bmi || "--"}</p>
            <p className="bmi-category">
              Category: <b>{getBMICategory(bmi)}</b>
            </p>
          </div>

          <h2>Current Goal</h2>
          {goal ? (
            <>
              <p>
                <b>Goal:</b> {goal.goalType}
              </p>
              <p>
                <b>Start Weight:</b> {goal.startWeight} kg
              </p>
              <p>
                <b>Target Weight:</b> {goal.targetWeight} kg
              </p>
              <p>
                <b>Height:</b> {goal.height} cm
              </p>
              <p>
                <b>BMI:</b> {goal.bmi}
              </p>

              {/* AI BUTTON */}
            </>
          ) : (
            <p>No goal created yet</p>
          )}
        </div>
      </div>

      {loadingWorkout && <p>Loading AI workout...</p>}
      {workout && (
        <div className="workout-card">
          <button className="btn" onClick={() => fetchWorkoutRecommendation()}>
            Get AI Workout Plan
          </button>
          <h2>AI Workout Plan</h2>
          <p>
            <b>Prediction:</b> {workout.prediction}
          </p>
          <h3>Recommended Workouts</h3>
          <ul>
            {workout.recommendedWorkouts.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
