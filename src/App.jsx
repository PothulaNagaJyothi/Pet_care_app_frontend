import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import DashboardLayout from "./layouts/DashboardLayout";

// Lazy-loaded Dashboard Modules
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const Pets = lazy(() => import("./pages/dashboard/Pets"));
const Vaccinations = lazy(() => import("./pages/dashboard/Vaccinations"));
const Appointments = lazy(() => import("./pages/dashboard/Appointments"));
const Medications = lazy(() => import("./pages/dashboard/Medications"));
const WeightLogs = lazy(() => import("./pages/dashboard/WeightLogs"));
const Journal = lazy(() => import("./pages/dashboard/Journal"));
const Routines = lazy(() => import("./pages/dashboard/Routines"));
const Insurance = lazy(() => import("./pages/dashboard/Insurance"));
const EmergencyVets = lazy(() => import("./pages/dashboard/EmergencyVets"));
const Community = lazy(() => import("./pages/dashboard/Community"));
const CareTips = lazy(() => import("./pages/dashboard/CareTips"));
const Nutrition = lazy(() => import("./pages/dashboard/Nutrition"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));

// Simple Fallback Loader
const Loader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="pets" element={<Pets />} />
          <Route path="vaccinations" element={<Vaccinations />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="medications" element={<Medications />} />
          <Route path="weight" element={<WeightLogs />} />
          <Route path="journal" element={<Journal />} />
          <Route path="routines" element={<Routines />} />
          <Route path="insurance" element={<Insurance />} />
          <Route path="emergency-vets" element={<EmergencyVets />} />
          <Route path="community" element={<Community />} />
          <Route path="tips" element={<CareTips />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;