import { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useToast } from "../../context/ToastContext";

function AIAssistant() {
    const [messages, setMessages] = useState([
        {
            role: "model",
            content: "Hi there! I am your virtual Veterinary Assistant 🐾. Ask me anything about your pet's health, diet, or training!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { showToast } = useToast();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message to UI immediately
        const newMessages = [...messages, { role: "user", content: userMessage }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await api.post("/ai/chat", {
                message: userMessage,
                history: messages // Send previous context
            });

            if (res.data.success) {
                setMessages([...newMessages, { role: "model", content: res.data.message }]);
            }
        } catch (error) {
            console.error("AI Chat Error:", error);
            showToast("Failed to connect to AI Assistant.", "error");

            // Rollback optimistic update on failure
            setMessages(messages);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col py-2 sm:py-4 px-2 sm:px-4 md:px-0">
            {/* Header */}
            <div className="mb-3 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                    Virtual Vet Assistant 🤖
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">
                    Powered by Google Gemini AI. Always consult a real vet for emergencies.
                </p>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 shadow-xl">

                {/* Messages Layout */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-6 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-2 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex shrink-0 items-center justify-center shadow-sm ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                : 'bg-gradient-to-br from-brand-400 to-brand-600 text-white'
                                }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-3.5 max-w-[calc(100%-2.5rem)] sm:max-w-[75%] md:max-w-[70%] rounded-2xl shadow-sm text-sm sm:text-[15px] leading-relaxed break-words ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-tl-none font-medium'
                                }`}>
                                {/* Very basic markdown handling for bold/bullets locally */}
                                <p className="whitespace-pre-wrap">{msg.content.replace(/\*\*/g, '')}</p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-start gap-2 sm:gap-4 flex-row animate-fadeIn">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex shrink-0 items-center justify-center shadow-sm bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="px-3 sm:px-5 py-2 sm:py-4 max-w-[75%] sm:max-w-[80%] rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-brand-500" />
                                <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">AI is thinking...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 bg-transparent border-t border-slate-200/50 dark:border-slate-800/50">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-end gap-3 max-w-[800px] mx-auto relative group"
                    >
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question about your pet..."
                            className="flex-1 max-h-32 min-h-11 sm:min-h-[56px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-2 sm:py-3.5 pl-4 sm:pl-5 pr-12 sm:pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all custom-scrollbar"
                            rows={1}
                        />

                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Send className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />}
                        </button>
                    </form>
                    <div className="text-center mt-2 sm:mt-3">
                        <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
                            Press Shift+Enter for a new line. The AI assistant can make mistakes.
                        </span>
                    </div>
                </div>

            </Card>
        </div>
    );
}

export default AIAssistant;
