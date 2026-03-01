import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

function Appointments() {
  const { showToast } = useToast();

  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    pet_id: "",
    appointment_date: "",
    notes: "",
    status: "scheduled",
  });

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [petsRes, appRes] = await Promise.all([
        api.get("/pets"),
        api.get("/appointments"),
      ]);

      setPets(petsRes.data.data);
      setAppointments(appRes.data.data);
    } catch {
      showToast("Failed to fetch appointments", "error");
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
      appointment_date: "",
      notes: "",
      status: "scheduled",
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/appointments", form);
      resetForm();
      fetchData();
      showToast("Appointment added");
    } catch {
      showToast("Failed to add appointment", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${editingAppointment.id}`, form);
      setEditingAppointment(null);
      resetForm();
      fetchData();
      showToast("Appointment updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/appointments/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchData();
      showToast("Appointment deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEditModal = (app) => {
    setEditingAppointment(app);
    setForm({
      pet_id: app.pet_id,
      appointment_date: app.appointment_date,
      notes: app.notes || "",
      status: app.status,
    });
  };

  const getPetName = (petId) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Unknown";
  };

  const today = new Date();

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Appointments</h1>

      {/* Appointment List */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">
          Appointment Records
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No appointments scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => {
              const date = new Date(app.appointment_date);
              const isPast =
                app.status === "scheduled" && date < today;

              return (
                <div
                  key={app.id}
                  className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${isPast
                    ? "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50"
                    : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:dark:bg-slate-800 shadow-sm"
                    }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {getPetName(app.pet_id)}
                      </p>
                      {app.notes && (
                        <span className="text-slate-500 dark:text-slate-400 text-sm italic border-l border-slate-300 dark:border-slate-600 pl-3">
                          {app.notes}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
                      <p className={`${isPast ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        <span className="text-slate-500 mr-1">Time:</span>
                        {date.toLocaleString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${app.status === "completed"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                        : app.status === "cancelled"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          : isPast
                            ? "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                            : "bg-brand-50 dark:bg-brand-accent/10 text-brand-600 dark:text-brand-accent border-brand-200 dark:border-brand-accent/20"
                        }`}
                    >
                      {app.status}
                    </span>

                    <div className="flex gap-2 ml-auto">
                      <Button
                        variant="secondary"
                        onClick={() => openEditModal(app)}
                        className="py-1.5 px-3 text-sm"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => setDeleteTarget(app)}
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

      {/* Add Appointment */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Schedule Appointment
        </h2>

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
            type="datetime-local"
            name="appointment_date"
            value={form.appointment_date}
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
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="text"
            name="notes"
            placeholder="Notes (Optional)"
            value={form.notes}
            onChange={handleChange}
            className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
          />

          <div className="md:col-span-4">
            <Button type="submit">Add Appointment</Button>
          </div>
        </form>
      </Card>

      {/* Edit Modal */}
      {editingAppointment && (
        <Modal onClose={() => setEditingAppointment(null)}>
          <h2 className="text-2xl font-semibold mb-6">
            Edit Appointment
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
              type="datetime-local"
              name="appointment_date"
              value={form.appointment_date}
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
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingAppointment(null)}
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
          title="Delete Appointment"
          message="Are you sure you want to delete this appointment?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default Appointments;