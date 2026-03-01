import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

const routineTypes = [
  "walk",
  "feeding",
  "medication",
  "grooming",
  "custom"
];

function Routines() {
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [routines, setRoutines] = useState([]);

  const [form, setForm] = useState({
    pet_id: "",
    type: "walk",
    custom_label: "",
    scheduled_time: "",
    completed: false
  });

  const [editingRoutine, setEditingRoutine] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [petsRes, routineRes] = await Promise.all([
        api.get("/pets"),
        api.get("/routines")
      ]);

      setPets(petsRes.data.data);
      setRoutines(routineRes.data.data);
    } catch {
      showToast("Failed to fetch routines", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const resetForm = () => {
    setForm({
      pet_id: "",
      type: "walk",
      custom_label: "",
      scheduled_time: "",
      completed: false
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/routines", form);
      resetForm();
      fetchData();
      showToast("Routine added");
    } catch {
      showToast("Failed to add routine", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/routines/${editingRoutine.id}`, form);
      setEditingRoutine(null);
      resetForm();
      fetchData();
      showToast("Routine updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/routines/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
      showToast("Routine deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const toggleComplete = async (routine) => {
    try {
      await api.put(`/routines/${routine.id}`, {
        completed: !routine.completed
      });
      fetchData();
    } catch {
      showToast("Failed to update routine", "error");
    }
  };

  const openEditModal = (routine) => {
    setEditingRoutine(routine);
    setForm({
      pet_id: routine.pet_id,
      type: routine.type,
      custom_label: routine.custom_label || "",
      scheduled_time: routine.scheduled_time,
      completed: routine.completed
    });
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : "Unknown";
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Daily Routines</h1>

      {/* Routine List */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">
          Today’s Routine
        </h2>

        {routines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No routines added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map(routine => (
              <div
                key={routine.id}
                className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 ${routine.completed
                  ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 opacity-75 grayscale-[0.2]"
                  : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 shadow-sm"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center p-1">
                    <input
                      type="checkbox"
                      checked={routine.completed}
                      onChange={() => toggleComplete(routine)}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer transition-colors"
                    />
                  </div>
                  <div>
                    <p className={`font-bold text-lg capitalize ${routine.completed ? 'text-emerald-800 dark:text-emerald-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                      {routine.type === "custom"
                        ? routine.custom_label
                        : routine.type}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm font-medium">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="text-slate-500 mr-1">Pet:</span>{getPetName(routine.pet_id)}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="text-slate-500 mr-1">Time:</span>{routine.scheduled_time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => openEditModal(routine)}
                    className="py-1.5 px-4 text-sm flex-1 sm:flex-none"
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setDeleteTarget(routine)}
                    className="py-1.5 px-4 text-sm flex-1 sm:flex-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Form */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Add Routine
        </h2>

        <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-6">

          <select
            name="pet_id"
            value={form.pet_id}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          >
            <option value="">Select Pet</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium capitalize"
          >
            {routineTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {form.type === "custom" && (
            <input
              name="custom_label"
              placeholder="Custom Label"
              value={form.custom_label}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />
          )}

          <input
            type="time"
            name="scheduled_time"
            value={form.scheduled_time}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <div className="md:col-span-2">
            <Button type="submit">
              Add Routine
            </Button>
          </div>

        </form>
      </Card>

      {/* Edit Modal */}
      {editingRoutine && (
        <Modal onClose={() => setEditingRoutine(null)}>
          <h2 className="text-2xl font-semibold mb-6">
            Edit Routine
          </h2>

          <form onSubmit={handleUpdate} className="grid gap-6">

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium capitalize"
            >
              {routineTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {form.type === "custom" && (
              <input
                name="custom_label"
                value={form.custom_label}
                onChange={handleChange}
                required
                className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
              />
            )}

            <input
              type="time"
              name="scheduled_time"
              value={form.scheduled_time}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingRoutine(null)}
              >
                Cancel
              </Button>

              <Button type="submit">
                Update
              </Button>
            </div>

          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Routine"
          message="Are you sure you want to delete this routine?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default Routines;