import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // If already logged in, skip the landing page entirely
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
            P
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-200 tracking-tight">
            PetCare
          </h1>
        </div>

        <div className="space-x-4 md:space-x-6 flex items-center">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition hidden sm:flex"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors hidden sm:block">
            Log in
          </Link>

          <Link
            to="/register"
            className="bg-brand-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/30 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-32 bg-slate-50 dark:bg-slate-950 min-h-[80vh]">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-300 dark:bg-brand-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-rose-300 dark:bg-rose-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 animate-fadeIn">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 font-semibold text-sm mb-6 border border-brand-200 dark:border-brand-800 shadow-sm">
            ✨ Your pet's digital medical record
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold max-w-4xl leading-tight mb-6 text-slate-900 dark:text-white tracking-tight">
            Smarter <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-brand-accent">Pet Health</span> Management
          </h2>

          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg md:text-xl mb-12 mx-auto leading-relaxed">
            Track vaccinations, appointments, medications, routines, and more —
            all in one secure, beautiful platform built for modern pet parents.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-brand-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-600 shadow-xl shadow-brand-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Create Free Account
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-300"
              >
                Log In to PetCare
              </Link>
            </div>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-6 font-medium">
            No credit card required · Free forever for basic use
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-white dark:bg-slate-900 relative z-10 border-y border-slate-100 dark:border-slate-800 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
            Everything Your Pet Needs
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            A complete suite of tools designed to simplify pet care management, giving you peace of mind.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/50 text-brand-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all">
              ❤️
            </div>
            <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
              Health Tracking
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage vaccinations, medications, weight logs, and complete
              medical history in one beautifully organized place.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-brand-accent/20 dark:bg-brand-accent/10 text-brand-accent rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-white transition-all">
              📅
            </div>
            <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
              Smart Appointments
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Keep track of vet visits and grooming sessions. Never miss an important checkup with organized scheduling.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all">
              🐾
            </div>
            <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
              Daily Routines
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Log daily habits, walks, and feeding schedules to ensure your furry friend stays happy and healthy every day.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center py-24 px-6 bg-brand-50 dark:bg-slate-950 relative overflow-hidden">
          {/* Decorative Background for CTA */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTU0LjYyNyAwTDYwIDUuMzczLjAwMSA2NS4zNzItNS4zNzMgNjB6IiBmaWxsPSIjMTRiOGE2IiBmaWxsLW9wYWNpdHk9IjAuMDUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-50 dark:opacity-20"></div>

          <div className="relative z-10 max-w-3xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900 dark:text-white">
              Give your pet the care they deserve
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
              Join thousands of pet parents managing their pet's health with PetCare.
            </p>

            <Link
              to="/register"
              className="inline-block bg-brand-500 px-10 py-4 rounded-xl text-lg font-bold text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 hover:-translate-y-1 transition-all"
            >
              Get Started Now — It's Free
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-800 text-gray-500 text-sm">
        © {new Date().getFullYear()} PetCare. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;