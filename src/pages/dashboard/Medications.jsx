import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

function Medications() {
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    pet_id: "",
    medication_name: "",
    dosage: "",
    due_date: "",
    status: "ongoing",
  });

  const [editingMedication, setEditingMedication] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [petsRes, medRes] = await Promise.all([
        api.get("/pets"),
        api.get("/medications"),
      ]);

      setPets(petsRes.data.data);
      setMedications(medRes.data.data);
    } catch {
      showToast("Failed to fetch medications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      pet_id: "",
      medication_name: "",
      dosage: "",
      due_date: "",
      status: "ongoing",
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/medications", form);
      resetForm();
      fetchData();
      showToast("Medication added");
    } catch {
      showToast("Failed to add medication", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/medications/${editingMedication.id}`, form);
      setEditingMedication(null);
      resetForm();
      fetchData();
      showToast("Medication updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/medications/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
      showToast("Medication deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEditModal = (med) => {
    setEditingMedication(med);
    setForm({
      pet_id: med.pet_id,
      medication_name: med.medication_name,
      dosage: med.dosage,
      due_date: med.due_date,
      status: med.status,
    });
  };

  const getPetName = (petId) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Unknown";
  };

  const today = new Date();

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Medications</h1>

      {/* Medication List */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">
          Medication Records
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No medications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => {
              const dueDate = new Date(med.due_date);
              const isOverdue =
                med.status === "ongoing" && dueDate < today;

              return (
                <div
                  key={med.id}
                  className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${isOverdue
                    ? "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50"
                    : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:dark:bg-slate-800 shadow-sm"
                    }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {med.medication_name}
                      </p>
                      <span className="text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded text-sm">
                        {med.dosage}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium mt-1">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="text-slate-500 mr-1">Pet:</span>
                        {getPetName(med.pet_id)}
                      </p>
                      <p className={`${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        <span className="text-slate-500 mr-1">Due:</span>
                        {new Date(med.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${med.status === "completed"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                        : med.status === "stopped"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          : isOverdue
                            ? "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                            : "bg-brand-50 dark:bg-brand-accent/10 text-brand-600 dark:text-brand-accent border-brand-200 dark:border-brand-accent/20"
                        }`}
                    >
                      {med.status}
                    </span>

                    <div className="flex gap-2 ml-auto">
                      <Button
                        variant="secondary"
                        onClick={() => openEditModal(med)}
                        className="py-1.5 px-3 text-sm"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => setDeleteTarget(med)}
                        className="py-1.5 px-3 text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add Medication */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Add Medication
        </h2>

        <form onSubmit={handleAdd} className="grid md:grid-cols-5 gap-6">
          <select
            name="pet_id"
            value={form.pet_id}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          >
            <option value="">Select Pet</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="medication_name"
            placeholder="Medication Name"
            value={form.medication_name}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <input
            type="text"
            name="dosage"
            placeholder="Dosage"
            value={form.dosage}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="stopped">Stopped</option>
          </select>

          <div className="md:col-span-5">
            <Button type="submit">Add Medication</Button>
          </div>
        </form>
      </Card>

      {/* Edit Modal */}
      {editingMedication && (
        <Modal onClose={() => setEditingMedication(null)}>
          <h2 className="text-2xl font-semibold mb-6">
            Edit Medication
          </h2>

          <form onSubmit={handleUpdate} className="grid gap-6">
            <select
              name="pet_id"
              value={form.pet_id}
              onChange={handleChange}
              required
              className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="medication_name"
              value={form.medication_name}
              onChange={handleChange}
              required
              className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />

            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              required
              className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />

            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              required
              className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="stopped">Stopped</option>
            </select>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingMedication(null)}
              >
                Cancel
              </Button>

              <Button type="submit">Update</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Medication"
          message={`Are you sure you want to delete ${deleteTarget.medication_name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default Medications;