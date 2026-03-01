import { useState, useEffect } from "react";
import { Plus, Flame, Utensils, Apple, Coffee, Trash2, ChevronDown, Check } from "lucide-react";
import api from "../../services/api";

const Nutrition = () => {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState("");
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        meal_type: "Breakfast",
        food_name: "",
        amount: "",
        calories: "",
        date: new Date().toISOString().split('T')[0]
    });

    const mealOptions = ["Breakfast", "Lunch", "Dinner", "Snack", "Treats"];

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
        if (selectedPet) {
            fetchLogs();
        }
    }, [selectedPet]);

    const fetchPets = async () => {
        try {
            const res = await api.get("/pets");
            setPets(res.data.data);
            if (res.data.data.length > 0) {
                setSelectedPet(res.data.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch pets", error);
        }
    };

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/nutrition/pet/${selectedPet}`);
            setLogs(res.data.data);
        } catch (error) {
            console.error("Failed to fetch nutrition logs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                pet_id: selectedPet,
                calories: formData.calories ? parseInt(formData.calories) : null
            };
            await api.post("/nutrition", payload);

            setShowForm(false);
            setFormData({
                meal_type: "Breakfast",
                food_name: "",
                amount: "",
                calories: "",
                date: new Date().toISOString().split('T')[0]
            });
            fetchLogs();
        } catch (error) {
            console.error("Failed to add nutrition log", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this meal log?")) return;
        try {
            await api.delete(`/nutrition/${id}`);
            fetchLogs();
        } catch (error) {
            console.error("Failed to delete log", error);
        }
    };

    // UI Helpers
    const getMealIcon = (type) => {
        switch (type) {
            case "Breakfast": return <Coffee className="w-5 h-5 text-amber-500" />;
            case "Lunch": return <Utensils className="w-5 h-5 text-emerald-500" />;
            case "Dinner": return <Utensils className="w-5 h-5 text-blue-500" />;
            case "Snack": return <Apple className="w-5 h-5 text-rose-500" />;
            default: return <Flame className="w-5 h-5 text-orange-500" />;
        }
    };

    const currentPet = pets.find(p => p.id === selectedPet) || {};

    // Calculate total calories for the current day safely against ISO timestamps
    const today = new Date().toISOString().split('T')[0];
    const todaysLogs = logs.filter(log => log.date && log.date.split('T')[0] === today);
    const totalCaloriesToday = todaysLogs.reduce((sum, log) => sum + (log.calories || 0), 0);

    // Dynamic calorie target based on the pet's weight
    let calorieTarget = 800; // default for a medium dog
    if (currentPet.weight) {
        const weightValue = parseFloat(String(currentPet.weight).replace(/[^0-9.]/g, ''));
        if (!isNaN(weightValue) && weightValue > 0) {
            // Generalized active dog calorie formula: [30 * Weight(kg) + 70] * 1.6
            // Assuming the weight is roughly in kg. If in lbs, the numbers will be a bit inflated but still functional for the UI.
            calorieTarget = Math.round((weightValue * 30 + 70) * 1.6);
        }
    }

    const calorieProgress = Math.min((totalCaloriesToday / calorieTarget) * 100, 100);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Nutrition & Meals
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        Track daily food intake, treats, and calorie goals.
                    </p>
                </div>

                {/* Pet Selector */}
                {pets.length > 0 && (
                    <div className="relative min-w-[200px]">
                        <select
                            value={selectedPet}
                            onChange={(e) => setSelectedPet(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow cursor-pointer font-medium shadow-sm hover:shadow-md"
                        >
                            {pets.map(pet => (
                                <option key={pet.id} value={pet.id}>{pet.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                )}
            </div>

            {(!pets || pets.length === 0) ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-slate-500 dark:text-slate-400">Please add a pet profile first to track nutrition.</p>
                </div>
            ) : (
                <>
                    {/* Calorie Progress Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center shrink-0">
                                    <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Today's Calorie Goal</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                                        {currentPet?.weight ? `Based on ${currentPet.name}'s current weight` : "Based on typical adult dog maintenance needs"}
                                    </p>
                                    <div className="mt-4 flex items-end gap-2 text-slate-900 dark:text-white">
                                        <span className="text-4xl font-extrabold">{totalCaloriesToday}</span>
                                        <span className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">/ {calorieTarget} kcal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex-1 w-full max-w-md space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-600 dark:text-slate-300">Intake Progress</span>
                                    <span className="text-brand-600 dark:text-brand-400">{Math.round(calorieProgress)}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-1 ${calorieProgress > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-400 to-brand-600'
                                            }`}
                                        style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                                    >
                                    </div>
                                </div>
                                {calorieProgress > 100 && (
                                    <p className="text-xs text-rose-500 font-medium text-right mt-1 animate-pulse">
                                        Over daily calorie target
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">

                        {/* Form Section */}
                        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-brand-500" />
                                Log a Meal
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meal Type</label>
                                    <div className="relative">
                                        <select
                                            name="meal_type"
                                            value={formData.meal_type}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 appearance-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                            required
                                        >
                                            {mealOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Food Name / Brand</label>
                                    <input
                                        type="text"
                                        name="food_name"
                                        value={formData.food_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Purina Pro Plan"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount</label>
                                        <input
                                            type="text"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 1 cup, 200g"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Calories (kcal)</label>
                                        <input
                                            type="number"
                                            name="calories"
                                            value={formData.calories}
                                            onChange={handleInputChange}
                                            placeholder="Optional"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" /> Save Meal Log
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* List Section */}
                        <div className="lg:col-span-2 space-y-4">
                            {loading ? (
                                <div className="flex justify-center p-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
                                </div>
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-brand-300 dark:hover:border-brand-700 transition duration-300 shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300 shrink-0">
                                                {getMealIcon(log.meal_type)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">{log.food_name}</h3>
                                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                        {log.meal_type}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                    <span>{log.amount}</span>
                                                    {log.calories && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></span>
                                                            <span className="text-orange-600 dark:text-orange-400 font-semibold">{log.calories} kcal</span>
                                                        </>
                                                    )}
                                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></span>
                                                    <span className="whitespace-nowrap">{new Date(log.date).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(log.id)}
                                            className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 self-end sm:self-auto shrink-0"
                                            aria-label="Delete Nutrition Log"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Utensils className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No nutrition logs</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
                                        Use the form on the left to start tracking {pets.find(p => p.id === selectedPet)?.name}'s meals and calorie intake.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default Nutrition;
