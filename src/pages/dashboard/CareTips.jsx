import { useState, useEffect } from "react";
import { Lightbulb, BookOpen, Shield, HeartPulse, Activity, Sparkles, Droplets } from "lucide-react";
import api from "../../services/api";

const CareTips = () => {
    const [tips, setTips] = useState([]);
    const [dailyTip, setDailyTip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "General Health", "Seasonal Care", "Nutrition", "Activity", "Lifecycle"];

    useEffect(() => {
        fetchTips();
        fetchDailyTip();
    }, [activeCategory]);

    const fetchTips = async () => {
        try {
            setLoading(true);
            const url = activeCategory === "All" ? "/tips" : `/tips?category=${activeCategory}`;
            const res = await api.get(url);
            setTips(res.data.data);
        } catch (error) {
            console.error("Failed to fetch tips", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDailyTip = async () => {
        try {
            const res = await api.get("/tips/daily");
            setDailyTip(res.data.data);
        } catch (error) {
            console.error("Failed to fetch daily tip", error);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "General Health": return <HeartPulse className="w-5 h-5 text-rose-500" />;
            case "Seasonal Care": return <Sparkles className="w-5 h-5 text-amber-500" />;
            case "Nutrition": return <Droplets className="w-5 h-5 text-blue-500" />;
            case "Activity": return <Activity className="w-5 h-5 text-emerald-500" />;
            case "Lifecycle": return <Shield className="w-5 h-5 text-purple-500" />;
            default: return <BookOpen className="w-5 h-5 text-brand-500" />;
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Expert Pet Care Tips
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    Curated advice to help your furry friend live their best life.
                </p>
            </div>

            {/* Daily Tip Featured Card */}
            {dailyTip && (
                <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-xl shadow-brand-500/20">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <Lightbulb className="w-6 h-6 text-yellow-300" />
                            </div>
                            <span className="font-semibold text-brand-50 tracking-wider uppercase text-sm">
                                Tip of the Day
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            {dailyTip.title}
                        </h2>
                        <p className="text-brand-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                            {dailyTip.content}
                        </p>

                        <div className="mt-6 flex items-center gap-2">
                            <span className="px-3 py-1 bg-black/20 rounded-full text-xs font-medium backdrop-blur-sm">
                                {dailyTip.category}
                            </span>
                            {dailyTip.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Filter */}
            <div className="flex flex-wrap pb-2 gap-2 custom-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${activeCategory === cat
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md transform scale-105"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Tips Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 h-64 animate-pulse">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
                            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-5/6"></div>
                            </div>
                        </div>
                    ))
                ) : tips.length > 0 ? (
                    tips.map((tip) => (
                        <div
                            key={tip.id}
                            className="group bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800/60 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-brand-500/30 transition-all duration-300 flex flex-col"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-100 dark:border-slate-800">
                                {getCategoryIcon(tip.category)}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">
                                {tip.title}
                            </h3>

                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1">
                                {tip.content}
                            </p>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2">
                                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2.5 py-1 rounded-md">
                                    {tip.category}
                                </span>
                                {tip.tags?.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No tips found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Check back later for new advice in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareTips;
