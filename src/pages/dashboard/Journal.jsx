import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

function Journal() {
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
    pet_id: "",
    title: "",
    description: "",
  });

  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [petsRes, journalRes] = await Promise.all([
        api.get("/pets"),
        api.get("/journal"),
      ]);

      setPets(petsRes.data.data);
      setEntries(journalRes.data.data);
    } catch {
      showToast("Failed to fetch journal", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      pet_id: "",
      title: "",
      description: "",
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/journal", form);
      resetForm();
      fetchData();
      showToast("Journal entry added");
    } catch {
      showToast("Failed to add entry", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/journal/${editingEntry.id}`, form);
      setEditingEntry(null);
      resetForm();
      fetchData();
      showToast("Entry updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/journal/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
      showToast("Entry deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setForm({
      pet_id: entry.pet_id,
      title: entry.title,
      description: entry.description,
    });
  };

  const getPetName = (petId) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Unknown";
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Health Journal</h1>

      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Entry</h2>

        <form onSubmit={handleAdd} className="grid gap-6">
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
            name="title"
            placeholder="Journal Entry Title"
            value={form.title}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <textarea
            name="description"
            placeholder="Write out the details here..."
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium resize-y"
          />

          <Button type="submit">Add Entry</Button>
        </form>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Entries</h2>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No journal entries found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 shadow-sm hover:dark:bg-slate-800 transition-colors items-start sm:items-center"
              >
                <div className="flex-1">
                  <p className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                    {entry.title}
                  </p>
                  <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">
                    {getPetName(entry.pet_id)}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {entry.description}
                  </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => openEditModal(entry)}
                    className="py-1.5 px-3 text-sm"
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setDeleteTarget(entry)}
                    className="py-1.5 px-3 text-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {editingEntry && (
        <Modal onClose={() => setEditingEntry(null)}>
          <h2 className="text-2xl font-semibold mb-6">Edit Entry</h2>

          <form onSubmit={handleUpdate} className="grid gap-6">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium resize-y"
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingEntry(null)}
              >
                Cancel
              </Button>

              <Button type="submit">Update</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Entry"
          message={`Delete "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default Journal;