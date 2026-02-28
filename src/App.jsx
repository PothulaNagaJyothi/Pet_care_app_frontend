import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Pets from "./pages/dashboard/Pets";
import Vaccinations from "./pages/dashboard/Vaccinations";
import Appointments from "./pages/dashboard/Appointments";
import Medications from "./pages/dashboard/Medications";
import WeightLogs from "./pages/dashboard/WeightLogs";
import Journal from "./pages/dashboard/Journal";
import Routines from "./pages/dashboard/Routines";
import Insurance from "./pages/dashboard/Insurance";
import EmergencyVets from "./pages/dashboard/EmergencyVets";
import Community from "./pages/dashboard/Community";

function App() {
  return (
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
</Route>

    </Routes>
  );
}

export default App;