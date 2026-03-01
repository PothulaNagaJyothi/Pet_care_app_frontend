import { useState, useEffect } from "react";
import { Bell, Mail, Clock, ShieldCheck, Check, AlertCircle } from "lucide-react";
import api from "../../services/api";

const Settings = () => {
    const [settings, setSettings] = useState({
        feeding_reminders: true,
        medication_reminders: true,
        vet_reminders: true,
        email_notifications: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await api.get("/settings");
            if (res.data.data) {
                setSettings({
                    feeding_reminders: res.data.data.feeding_reminders,
                    medication_reminders: res.data.data.medication_reminders,
                    vet_reminders: res.data.data.vet_reminders,
                    email_notifications: res.data.data.email_notifications
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setSaveMessage({ text: "", type: "" });

            await api.put("/settings", settings);

            setSaveMessage({ text: "Settings saved successfully", type: "success" });
            setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
        } catch (error) {
            console.error("Failed to update settings", error);
            setSaveMessage({ text: error.response?.data?.message || "Failed to update settings", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Alerts & Reminders
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    Customize how and when you want to be notified about your pet's needs.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">

                {/* Settings List */}
                <div className="p-6 sm:p-8 space-y-8">

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-brand-500" />
                            Push Notifications
                        </h2>

                        <div className="grid gap-4">
                            {/* Feeding */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Feeding & Routine Reminders</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Alerts when it's time for meals or daily walks.</p>
                                    </div>
                                </div>
                                <Toggle isChecked={settings.feeding_reminders} onToggle={() => handleToggle('feeding_reminders')} />
                            </div>

                            {/* Medication */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Medication Alerts</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Crucial alerts for daily medicine or monthly preventatives.</p>
                                    </div>
                                </div>
                                <Toggle isChecked={settings.medication_reminders} onToggle={() => handleToggle('medication_reminders')} />
                            </div>

                            {/* Vet Visits */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Vet Visits</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Reminders for scheduled appointments and check-ups.</p>
                                    </div>
                                </div>
                                <Toggle isChecked={settings.vet_reminders} onToggle={() => handleToggle('vet_reminders')} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    {/* Email Settings */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Mail className="w-5 h-5 text-brand-500" />
                            Email Communications
                        </h2>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Weekly Health Summary</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Receive an email recap of your pet's week and upcoming events.</p>
                            </div>
                            <Toggle isChecked={settings.email_notifications} onToggle={() => handleToggle('email_notifications')} />
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-6 sm:p-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">

                    <div className="flex-1">
                        {saveMessage.text && (
                            <div className={`flex items-center gap-2 text-sm font-medium ${saveMessage.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} animate-fadeIn`}>
                                {saveMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {saveMessage.text}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : "Save Preferences"}
                    </button>
                </div>

            </div>
        </div>
    );
};

// Reusable Toggle Component
const Toggle = ({ isChecked, onToggle }) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isChecked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
            role="switch"
            aria-checked={isChecked}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isChecked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    );
};

export default Settings;
