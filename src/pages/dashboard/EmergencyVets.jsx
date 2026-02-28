import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

function EmergencyVets() {
  const { showToast } = useToast();

  const [vets, setVets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });

  const [editingVet, setEditingVet] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      const res = await api.get("/emergency-vets");
      setVets(res.data.data);
    } catch {
      showToast("Failed to fetch emergency vets", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      city: "",
      phone: "",
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/emergency-vets", form);
      resetForm();
      fetchVets();
      showToast("Emergency vet added");
    } catch {
      showToast("Failed to add vet", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/emergency-vets/${editingVet.id}`, form);
      setEditingVet(null);
      resetForm();
      fetchVets();
      showToast("Emergency vet updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/emergency-vets/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchVets();
      showToast("Emergency vet deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEditModal = (vet) => {
    setEditingVet(vet);
    setForm({
      name: vet.name,
      address: vet.address,
      city: vet.city,
      phone: vet.phone,
    });
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Emergency Vets</h1>

      {/* Add Form */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Add Emergency Vet
        </h2>

        <form
          onSubmit={handleAdd}
          className="grid md:grid-cols-2 gap-6"
        >
          <input
            name="name"
            placeholder="Clinic Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <input
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium md:col-span-2"
          />

          <div className="md:col-span-2">
            <Button type="submit">
              Add Vet
            </Button>
          </div>
        </form>
      </Card>

      {/* List */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Available Emergency Clinics
        </h2>

        {vets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No emergency clinics added yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {vets.map((vet) => (
              <div
                key={vet.id}
                className="p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col justify-between shadow-sm hover:dark:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 p-2 rounded-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    </div>
                    <p className="font-bold text-xl text-slate-900 dark:text-white">
                      {vet.name}
                    </p>
                  </div>
                  <div className="space-y-1.5 mt-4 text-sm font-medium">
                    <p className="text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">📍</span> {vet.address}, {vet.city}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span className="text-slate-400">📞</span> {vet.phone}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button
                    variant="secondary"
                    onClick={() => openEditModal(vet)}
                    className="py-1.5 px-4 text-sm"
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => setDeleteTarget(vet)}
                    className="py-1.5 px-4 text-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      {editingVet && (
        <Modal onClose={() => setEditingVet(null)}>
          <h2 className="text-2xl font-semibold mb-6">
            Edit Emergency Vet
          </h2>

          <form onSubmit={handleUpdate} className="grid gap-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingVet(null)}
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

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Emergency Vet"
          message={`Delete ${deleteTarget.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default EmergencyVets;