import { useEffect, useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";

function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
    medical_history: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [editingPet, setEditingPet] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const { showToast } = useToast();

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pets");
      setPets(res.data.data);
    } catch {
      showToast("Failed to fetch pets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Compress + Preview
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      setImageFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch {
      showToast("Image compression failed", "error");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      breed: "",
      age: "",
      gender: "",
      weight: "",
      medical_history: "",
    });

    setImageFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buildFormData = () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (imageFile) {
      data.append("image", imageFile);
    }

    return data;
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      const formData = buildFormData();

      await api.post("/pets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      fetchPets();
      showToast("Pet added successfully");
    } catch {
      showToast("Failed to add pet", "error");
    }
  };

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    try {
      const formData = buildFormData();

      await api.put(`/pets/${editingPet.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditingPet(null);
      resetForm();
      fetchPets();
      showToast("Pet updated successfully");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pets/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPets();
      showToast("Pet deleted successfully");
    } catch {
      showToast("Failed to delete pet", "error");
    }
  };

  const openEditModal = (pet) => {
    setEditingPet(pet);
    setForm({
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      weight: pet.weight,
      medical_history: pet.medical_history || "",
    });

    setPreviewUrl(pet.image_url || null);
    setImageFile(null);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-12">My Pets</h1>

      {/* Pets Section */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="text-6xl mb-6">🐕</div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No pets added yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Add your furry friends to start managing their health, vaccinations, and appointments.</p>
          <Button onClick={scrollToForm} className="shadow-lg shadow-brand-500/30">Add Your First Pet</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {pets.map((pet) => (
            <Card
              key={pet.id}
              className="overflow-hidden p-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border-0 shadow-md dark:shadow-none bg-white dark:bg-slate-800/80"
            >
              {pet.image_url ? (
                <div className="w-full h-56 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-brand-100 to-brand-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-6xl shadow-inner">
                  {pet.gender === 'Female' ? '🐈' : '🐕'}
                </div>
              )}

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white truncate pr-2">
                    {pet.name}
                  </h3>
                  <span className="shrink-0 inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {pet.age} yrs
                  </span>
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0">Tags:</span>
                    <span className="truncate">{pet.breed} • {pet.gender}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0">Weight:</span>
                    {pet.weight} kg
                  </p>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                  <Button variant="secondary" onClick={() => openEditModal(pet)} className="flex-1 py-2.5">
                    Edit
                  </Button>

                  <Button variant="danger" onClick={() => setDeleteTarget(pet)} className="flex-1 py-2.5">
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Pet */}
      <div ref={formRef}>
        <Card className="p-10 mb-16">
          <h2 className="text-2xl font-semibold mb-8">Add New Pet</h2>

          <form onSubmit={handleAddPet} className="grid md:grid-cols-3 gap-6">
            <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <Input name="breed" placeholder="Breed" value={form.breed} onChange={handleChange} required />
            <Input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <Input type="number" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} required />

            <textarea
              name="medical_history"
              placeholder="Medical History (Optional)"
              value={form.medical_history}
              onChange={handleChange}
              rows={4}
              className="md:col-span-3 p-3.5 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium resize-none custom-scrollbar"
            />

            <div className="md:col-span-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {previewUrl && (
              <div className="md:col-span-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-700"
                />
              </div>
            )}

            <div className="md:col-span-3">
              <Button type="submit">Add Pet</Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Edit Modal */}
      {editingPet && (
        <Modal onClose={() => setEditingPet(null)}>
          <h2 className="text-2xl font-semibold mb-8">Edit Pet</h2>

          <form onSubmit={handleUpdatePet} className="grid gap-6">
            <Input name="name" value={form.name} onChange={handleChange} required />
            <Input name="breed" value={form.breed} onChange={handleChange} required />
            <Input type="number" name="age" value={form.age} onChange={handleChange} required />
            <Input type="number" name="weight" value={form.weight} onChange={handleChange} required />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl"
              />
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="secondary" onClick={() => setEditingPet(null)}>
                Cancel
              </Button>

              <Button type="submit">Update</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Pet"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default Pets;