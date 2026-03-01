import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

function Insurance() {
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [form, setForm] = useState({
    pet_id: "",
    provider_name: "",
    policy_number: "",
    coverage_details: "",
    claim_status: "active",
  });

  const [editingPolicy, setEditingPolicy] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [petsRes, insRes] = await Promise.all([
        api.get("/pets"),
        api.get("/insurance"),
      ]);

      setPets(petsRes.data.data);
      setPolicies(insRes.data.data);
    } catch {
      showToast("Failed to fetch insurance", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      pet_id: "",
      provider_name: "",
      policy_number: "",
      coverage_details: "",
      claim_status: "active",
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/insurance", form);
      resetForm();
      fetchData();
      showToast("Policy added");
    } catch {
      showToast("Failed to add policy", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/insurance/${editingPolicy.id}`, form);
      setEditingPolicy(null);
      resetForm();
      fetchData();
      showToast("Policy updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/insurance/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
      showToast("Policy deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEditModal = (policy) => {
    setEditingPolicy(policy);
    setForm({
      pet_id: policy.pet_id,
      provider_name: policy.provider_name,
      policy_number: policy.policy_number,
      coverage_details: policy.coverage_details,
      claim_status: policy.claim_status,
    });
  };

  const getPetName = (petId) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Unknown";
  };

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Insurance</h1>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Policies</h2>

        {policies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No policies added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:dark:bg-slate-800 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-lg text-slate-900 dark:text-white">
                      {policy.provider_name}
                    </p>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      #{policy.policy_number}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium mt-2">
                    <p className="text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500 mr-1">Pet:</span>{getPetName(policy.pet_id)}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 max-w-sm truncate" title={policy.coverage_details}>
                      <span className="text-slate-500 mr-1">Coverage:</span>{policy.coverage_details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <span
                    className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${policy.claim_status === "active"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                      : policy.claim_status === "claimed"
                        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                        : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                      }`}
                  >
                    {policy.claim_status}
                  </span>

                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="secondary"
                      onClick={() => openEditModal(policy)}
                      className="py-1.5 px-3 text-sm"
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => setDeleteTarget(policy)}
                      className="py-1.5 px-3 text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Policy</h2>

        <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-6">
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
            name="provider_name"
            placeholder="Provider Name"
            value={form.provider_name}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <input
            name="policy_number"
            placeholder="Policy Number"
            value={form.policy_number}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <input
            name="coverage_details"
            placeholder="Coverage Details"
            value={form.coverage_details}
            onChange={handleChange}
            required
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <select
            name="claim_status"
            value={form.claim_status}
            onChange={handleChange}
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          >
            <option value="active">Active</option>
            <option value="claimed">Claimed</option>
            <option value="expired">Expired</option>
          </select>

          <div className="md:col-span-2">
            <Button type="submit">Add Policy</Button>
          </div>
        </form>
      </Card>

      {editingPolicy && (
        <Modal onClose={() => setEditingPolicy(null)}>
          <h2 className="text-2xl font-semibold mb-6">Edit Policy</h2>

          <form onSubmit={handleUpdate} className="grid gap-6">
            <input
              name="provider_name"
              value={form.provider_name}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <input
              name="policy_number"
              value={form.policy_number}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <input
              name="coverage_details"
              value={form.coverage_details}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            />

            <select
              name="claim_status"
              value={form.claim_status}
              onChange={handleChange}
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            >
              <option value="active">Active</option>
              <option value="claimed">Claimed</option>
              <option value="expired">Expired</option>
            </select>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingPolicy(null)}
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
          title="Delete Policy"
          message={`Delete policy ${deleteTarget.policy_number}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default Insurance;