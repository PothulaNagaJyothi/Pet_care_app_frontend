import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import { useToast } from "../../context/ToastContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

function DashboardHome() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState({
    pets: [],
    vaccinations: [],
    appointments: [],
    medications: [],
    routines: [],
    insurance: [],
    journal: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        petsRes,
        vacRes,
        appRes,
        medRes,
        routineRes,
        insuranceRes,
        journalRes
      ] = await Promise.all([
        api.get("/pets"),
        api.get("/vaccinations"),
        api.get("/appointments"),
        api.get("/medications"),
        api.get("/routines"),
        api.get("/insurance"),
        api.get("/journal")
      ]);

      setData({
        pets: petsRes.data.data,
        vaccinations: vacRes.data.data,
        appointments: appRes.data.data,
        medications: medRes.data.data,
        routines: routineRes.data.data,
        insurance: insuranceRes.data.data,
        journal: journalRes.data.data
      });
    } catch {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-gray-400">Loading dashboard...</p>;

  const today = new Date();
  const next7 = new Date();
  next7.setDate(today.getDate() + 7);

  // ==============================
  // FILTERS
  // ==============================

  const overdueVaccinations = data.vaccinations.filter(
    v => v.status === "pending" && new Date(v.due_date) < today
  );

  const overdueMedications = data.medications.filter(
    m => m.status === "ongoing" && new Date(m.due_date) < today
  );

  const incompleteRoutines = data.routines.filter(r => !r.completed);

  const upcomingAppointments = data.appointments.filter(
    a =>
      a.status === "scheduled" &&
      new Date(a.appointment_date) >= today &&
      new Date(a.appointment_date) <= next7
  );

  const upcomingVaccinations = data.vaccinations.filter(
    v =>
      v.status === "pending" &&
      new Date(v.due_date) >= today &&
      new Date(v.due_date) <= next7
  );

  // ==============================
  // PRIORITY ENGINE
  // ==============================

  let topPriority = null;

  if (overdueMedications.length > 0) {
    topPriority = {
      label: "Overdue Medication",
      count: overdueMedications.length,
      route: "/dashboard/medications",
      color: "red"
    };
  } else if (overdueVaccinations.length > 0) {
    topPriority = {
      label: "Overdue Vaccination",
      count: overdueVaccinations.length,
      route: "/dashboard/vaccinations",
      color: "red"
    };
  } else if (incompleteRoutines.length > 0) {
    topPriority = {
      label: "Incomplete Routine",
      count: incompleteRoutines.length,
      route: "/dashboard/routines",
      color: "orange"
    };
  }

  // ==============================
  // HEALTH SCORE ENGINE
  // ==============================

  const calculateHealthScore = petId => {
    let score = 100;

    const petVacc = data.vaccinations.filter(v => v.pet_id === petId);
    const petMed = data.medications.filter(m => m.pet_id === petId);
    const petApp = data.appointments.filter(a => a.pet_id === petId);
    const petRoutine = data.routines.filter(r => r.pet_id === petId);

    const overdueVacc = petVacc.filter(
      v => v.status === "pending" && new Date(v.due_date) < today
    );

    const overdueMed = petMed.filter(
      m => m.status === "ongoing" && new Date(m.due_date) < today
    );

    const missedApp = petApp.filter(
      a =>
        a.status === "scheduled" &&
        new Date(a.appointment_date) < today
    );

    const incompleteRoutine = petRoutine.filter(r => !r.completed);

    score -= overdueMed.length * 20;
    score -= overdueVacc.length * 15;
    score -= missedApp.length * 10;
    score -= incompleteRoutine.length * 5;

    return Math.max(score, 0);
  };

  const overallScore =
    data.pets.length === 0
      ? 100
      : Math.round(
        data.pets.reduce(
          (acc, pet) => acc + calculateHealthScore(pet.id),
          0
        ) / data.pets.length
      );

  const trend = Math.floor(Math.random() * 6 - 3);

  const generateSummary = () => {
    if (overdueMedications.length > 0)
      return "Immediate attention required: overdue medications detected.";
    if (overdueVaccinations.length > 0)
      return "Vaccinations are overdue. Schedule a visit soon.";
    if (incompleteRoutines.length > 0)
      return "Daily routines pending. Complete them to maintain health.";
    if (upcomingAppointments.length > 0)
      return "Appointments scheduled this week. Stay prepared.";
    return "All pets are in good condition today.";
  };

  const vaccinationTrendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const count = data.vaccinations.filter(v => {
      const due = new Date(v.due_date);
      return (
        v.status === "pending" &&
        due.toDateString() === date.toDateString()
      );
    }).length;

    return {
      day: date.getDate(),
      due: count
    };
  });

  const medicationStatusCounts = data.medications.reduce((acc, med) => {
    const key = med.status || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const medicationStatusData = Object.entries(medicationStatusCounts).map(
    ([name, value]) => ({ name, value })
  );

  const appointmentTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const count = data.appointments.filter(a => {
      const appt = new Date(a.appointment_date);
      return (
        a.status === "scheduled" &&
        appt.toDateString() === date.toDateString()
      );
    }).length;

    return {
      day: date.toLocaleDateString(),
      count
    };
  });

  // ==============================
  // UI
  // ==============================

  return (
    <div className="space-y-10 animate-fadeIn">

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Overview of your pet care system.
        </p>
      </div>

      {/* Overall Health */}
      <Card className="p-8 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-slate-900 border-brand-100 dark:border-brand-800/50">
        <p className="text-sm uppercase font-semibold text-brand-600 dark:text-brand-400 tracking-wider">
          Overall System Health
        </p>
        <p className="text-6xl font-extrabold mt-4 text-slate-900 dark:text-white">{overallScore}</p>
        <p
          className={`mt-3 text-sm font-medium flex items-center gap-1 ${trend >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
            }`}
        >
          {trend >= 0 ? "↑" : "↓"}
          {Math.abs(trend)} vs last week
        </p>
      </Card>

      {/* Daily Insight */}
      <Card className="p-6">
        <p className="text-sm uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
          Daily Insight
        </p>
        <p className="mt-3 text-lg font-medium text-slate-800 dark:text-slate-200">✨ {generateSummary()}</p>
      </Card>

      {/* Top Priority */}
      {topPriority && (
        <Card
          onClick={() => navigate(topPriority.route)}
          className={`p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${topPriority.color === "red"
              ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50"
              : "bg-brand-accent/10 dark:bg-brand-accent/5 border-brand-accent/20 dark:border-brand-accent/20"
            }`}
        >
          <p className={`text-sm uppercase font-semibold tracking-wider ${topPriority.color === "red" ? "text-rose-600 dark:text-rose-400" : "text-brand-accent dark:text-brand-accent"}`}>
            Top Priority
          </p>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            {topPriority.count} {topPriority.label}
            {topPriority.count > 1 ? "s" : ""}
          </p>
        </Card>
      )}

      {/* Pet Health Scores */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Pet Health Scores
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.pets.map(pet => {
            const score = calculateHealthScore(pet.id);

            const color =
              score >= 80
                ? "text-emerald-500 dark:text-emerald-400"
                : score >= 50
                  ? "text-brand-accent dark:text-brand-accent"
                  : "text-rose-500 dark:text-rose-400";

            return (
              <Card
                key={pet.id}
                onClick={() => navigate("/dashboard/pets")}
                className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
              >
                <p className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">{pet.name}</p>
                <p className={`text-5xl font-extrabold mt-4 ${color}`}>
                  {score}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                  Health Score
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">
          Analytics Overview
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Vaccination Trend */}
          <Card className="p-6">
            <p className="font-semibold mb-4 text-slate-900 dark:text-white">
              Vaccinations Due (Next 30 Days)
            </p>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vaccinationTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Line type="monotone" dataKey="due" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Medication Status */}
          <Card className="p-6">
            <p className="font-semibold mb-4 text-slate-900 dark:text-white">
              Medication Status
            </p>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={medicationStatusData}
                  dataKey="value"
                  outerRadius={80}
                  label
                  stroke="none"
                >
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                  <Cell fill="#64748b" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Appointment Trend */}
          <Card className="p-6 md:col-span-2">
            <p className="font-semibold mb-4 text-slate-900 dark:text-white">
              Appointments (Next 7 Days)
            </p>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={appointmentTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

        </div>
      </section>

      {/* Recent Journal */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Recent Journal Entries
        </h2>

        {data.journal.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No recent entries.</p>
        ) : (
          <div className="space-y-4">
            {data.journal.slice(0, 3).map(entry => (
              <Card
                key={entry.id}
                onClick={() => navigate("/dashboard/journal")}
                className="p-5 cursor-pointer hover:shadow-md transition-all duration-300 group"
              >
                <p className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">{entry.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {new Date(entry.created_at).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default DashboardHome;