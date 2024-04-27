import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Home from "./Dashboard";
import Role from "./Role";
import Panitia from "./Panitia";
import Akun from "./Akun";
import Semester from "./Semester";

function RoutesComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fungsi untuk menangani login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  // GuardedRoute untuk memeriksa apakah pengguna sudah login sebelum mengakses rute tertentu
  const GuardedRoute = ({ element, ...props }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman login */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/logout" element={<Login onLogin={handleLogout} />} />
        {/* Rute untuk halaman home yang dilindungi */}
        <Route path="/home" element={<GuardedRoute element={<Home />} />} />
        {/* Rute untuk halaman home yang dilindungi */}
        <Route path="/role" element={<GuardedRoute element={<Role />} />} />
        <Route
          path="/panitia"
          element={<GuardedRoute element={<Panitia />} />}
        />
        <Route path="/akun" element={<GuardedRoute element={<Akun />} />} />
        <Route
          path="/semester"
          element={<GuardedRoute element={<Semester />} />}
        />
        {/* Redirect jika pengguna mencoba mengakses rute yang tidak valid */}
        <Route path="*" element={<Navigate to="/login" />} />
        {/*<Route path="*" element={<Navigate to="/login" />} />*/}
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
