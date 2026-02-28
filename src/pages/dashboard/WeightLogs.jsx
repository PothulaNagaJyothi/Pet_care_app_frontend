import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function WeightLogs() {
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [weightLogs, setWeightLogs] = useState([]);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) fetchWeightLogs();
  }, [selectedPet]);

  const fetchPets = async () => {
    try {
      const res = await api.get("/pets");
      setPets(res.data.data);
    } catch {
      showToast("Failed to fetch pets", "error");
    }
  };

  const fetchWeightLogs = async () => {
    try {
      const res = await api.get(`/weight-logs/${selectedPet}`);
      setWeightLogs(res.data.data);
    } catch {
      showToast("Failed to fetch weight logs", "error");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedPet) {
      showToast("Select a pet first", "error");
      return;
    }

    try {
      await api.post(`/weight-logs/${selectedPet}`, {
        weight: Number(weight),
      });

      setWeight("");
      fetchWeightLogs();
      showToast("Weight added");
    } catch {
      showToast("Failed to add weight", "error");
    }
  };

  const chartData = weightLogs.map((log) => ({
    date: new Date(log.recorded_at).toLocaleDateString(),
    weight: log.weight,
  }));

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Weight Tracking</h1>

      {/* Select Pet */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Select Pet
        </h2>

        <select
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
          className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium w-full md:w-auto"
        >
          <option value="">Select Pet</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </Card>

      {/* Add Weight */}
      {selectedPet && (
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Add Weight Entry
          </h2>

          <form
            onSubmit={handleAdd}
            className="flex gap-4 items-center"
          >
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium flex-1 md:flex-none"
            />

            <Button type="submit">
              Add
            </Button>
          </form>
        </Card>
      )}

      {/* Chart */}
      {selectedPet && weightLogs.length > 0 && (
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Weight Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* History List */}
      {selectedPet && (
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Weight History
          </h2>

          {weightLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-lg">No weight entries yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {weightLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl flex justify-between items-center shadow-sm hover:dark:bg-slate-800 transition-colors"
                >
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {new Date(log.recorded_at).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-lg text-slate-900 dark:text-white bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 px-3 py-1 rounded-lg">
                    {log.weight} kg
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default WeightLogs;