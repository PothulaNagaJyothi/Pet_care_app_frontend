import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

function Vaccinations() {
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    pet_id: "",
    vaccine_name: "",
    due_date: "",
    status: "pending",
  });

  const [editingVaccination, setEditingVaccination] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [petsRes, vacRes] = await Promise.all([
        api.get("/pets"),
        api.get("/vaccinations"),
      ]);

      setPets(petsRes.data.data);
      setVaccinations(vacRes.data.data);
    } catch {
      showToast("Failed to fetch data", "error");
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
      vaccine_name: "",
      due_date: "",
      status: "pending",
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/vaccinations", form);

      resetForm();
      fetchData();
      showToast("Vaccination added");
    } catch {
      showToast("Failed to add vaccination", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/vaccinations/${editingVaccination.id}`, form);

      setEditingVaccination(null);
      resetForm();
      fetchData();
      showToast("Vaccination updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/vaccinations/${deleteTarget.id}`);

      setDeleteTarget(null);
      fetchData();
      showToast("Vaccination deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEditModal = (vac) => {
    setEditingVaccination(vac);
    setForm({
      pet_id: vac.pet_id,
      vaccine_name: vac.vaccine_name,
      due_date: vac.due_date,
      status: vac.status,
    });
  };

  const getPetName = (petId) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Unknown";
  };

  const today = new Date();

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Vaccinations</h1>

      {/* Vaccination List */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">
          Vaccination Records
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : vaccinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No vaccination records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccinations.map((vac) => {
              const dueDate = new Date(vac.due_date);
              const isOverdue =
                vac.status === "pending" && dueDate < today;

              return (
                <div
                  key={vac.id}
                  className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${isOverdue
                    ? "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50"
                    : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:dark:bg-slate-800 shadow-sm"
                    }`}
                >
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      {vac.vaccine_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="text-slate-500 mr-1">Pet:</span>
                        {getPetName(vac.pet_id)}
                      </p>
                      <p className={`${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        <span className="text-slate-500 mr-1">Due:</span>
                        {new Date(vac.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${vac.status === "completed"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                        : isOverdue
                          ? "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                          : "bg-brand-50 dark:bg-brand-accent/10 text-brand-600 dark:text-brand-accent border-brand-200 dark:border-brand-accent/20"
                        }`}
                    >
                      {vac.status === "pending" && isOverdue ? "overdue" : vac.status}
                    </span>

                    <div className="flex gap-2 ml-auto">
                      <Button
                        variant="secondary"
                        onClick={() => openEditModal(vac)}
                        className="py-1.5 px-3 text-sm"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => setDeleteTarget(vac)}
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

      {/* Add Vaccination */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Vaccination</h2>

        <form onSubmit={handleAdd} className="grid md:grid-cols-4 gap-6">
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
            name="vaccine_name"
            placeholder="Vaccine Name"
            value={form.vaccine_name}
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
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <div className="md:col-span-4">
            <Button type="submit">Add Vaccination</Button>
          </div>
        </form>
      </Card >

      {/* Edit Modal */}
      {
        editingVaccination && (
          <Modal onClose={() => setEditingVaccination(null)}>
            <h2 className="text-2xl font-semibold mb-6">
              Edit Vaccination
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
                name="vaccine_name"
                value={form.vaccine_name}
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
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingVaccination(null)}
                >
                  Cancel
                </Button>

                <Button type="submit">Update</Button>
              </div>
            </form>
          </Modal>
        )
      }

      {/* Confirm Delete */}
      {
        deleteTarget && (
          <ConfirmModal
            title="Delete Vaccination"
            message={`Are you sure you want to delete ${deleteTarget.vaccine_name}?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )
      }
    </div >
  );
}

export default Vaccinations;