// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashBoard from "./pages/UserDashBoard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-dashborad" element={<AdminDashboard />} />
        <Route path="/user-dashborad" element={<UserDashBoard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
