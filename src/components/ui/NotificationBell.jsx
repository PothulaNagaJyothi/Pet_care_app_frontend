import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Bell, Check, Trash2, Settings, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const { showToast } = useToast();

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get("/notifications");
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on initial load and click
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Handle clicking outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation(); // Prevent dropdown from closing
        try {
            const res = await api.put(`/notifications/${id}/read`);
            if (res.data.success) {
                // Instantly update local UI state mapping
                setNotifications(prev => prev.map(n =>
                    n.id === id ? { ...n, is_read: true } : n
                ));
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            const res = await api.put("/notifications/read-all");
            if (res.data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                showToast("All notifications cleared", "success");
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
            showToast("Failed to clear notifications", "error");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications(); // Refresh when opening
                }}
                className={`relative p-2.5 rounded-xl transition-all duration-200 ${isOpen
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
            >
                <Bell className="w-5 h-5" />

                {/* Red Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_0_2px_white] dark:shadow-[0_0_0_2px_#0f172a]" />
                )}
            </button>

            {/* Dropdown Card */}
            {isOpen && (
                <div className="absolute top-12 -right-12 sm:right-0 w-[90vw] sm:w-80 md:w-96 max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden transform opacity-100 scale-100 origin-top-right transition-all">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold w-fit">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={handleMarkAllAsRead}
                                title="Mark all as read"
                                disabled={unreadCount === 0}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <Link
                                to="/dashboard/settings"
                                onClick={() => setIsOpen(false)}
                                title="Settings"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {loading && notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                <p className="text-sm">Loading alerts...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 transition-colors ${notif.is_read ? 'bg-transparent opacity-75' : 'bg-brand-50/30 dark:bg-brand-500/5'}`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Status Indicator */}
                                            <div className="mt-1.5 w-2 h-2 rounded-full shrink-0 flex items-center justify-center">
                                                {!notif.is_read && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                    <h4 className={`text-sm font-medium pr-4 ${notif.is_read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                                        {notif.title}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                    {!notif.is_read && (
                                                        <button
                                                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                                                            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                    <Bell className="w-6 h-6 text-slate-400" />
                                </div>
                                <h4 className="font-medium text-slate-900 dark:text-white mb-1">All caught up!</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    You have no new notifications from your fluffy friends.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-center">
                        <span className="text-xs font-medium text-slate-400">
                            Updates sync securely
                        </span>
                    </div>

                </div>
            )}
        </div>
    );
}

export default NotificationBell;
