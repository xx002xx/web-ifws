import React, { useState, useEffect } from "react";
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
import Kegiatan from "./Kegiatan";
import Kegiatansekre from "./Kegiatansekre";
import Menu from "./Menu";
import Detailpanitia from "./Detailpanitia";

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

  // Memeriksa status autentikasi saat aplikasi dimuat ulang
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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
        {/* Rute untuk halaman yang hanya bisa diakses ketika belum login */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        {/* Rute untuk halaman yang hanya bisa diakses ketika sudah login */}
        <Route path="/home" element={<GuardedRoute element={<Home />} />} />
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
        <Route path="/menu" element={<GuardedRoute element={<Menu />} />} />
        <Route
          path="/kegiatan"
          element={<GuardedRoute element={<Kegiatan />} />}
        />
        <Route
          path="/kegiatansekre"
          element={<GuardedRoute element={<Kegiatansekre />} />}
        />
        <Route
          path="/detailpanitia"
          element={<GuardedRoute element={<Detailpanitia />} />}
        />
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
