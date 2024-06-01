import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login"; // Perbaikan casing untuk menghindari masalah lint
import Home from "./Dashboard";
import Role from "./Role";
import Panitia from "./Panitia";
import Akun from "./Akun";
import Semester from "./Semester";
import Kegiatan from "./Kegiatan";
import Kegiatansekre from "./Kegiatansekre";
import Kegiatanben from "./Kegiatanben";
import Menu from "./Menu";
import Detailpanitia from "./Detailpanitia";
import Detailpanitiaben from "./Detailpanitiaben";
import Detailpeserta from "./Detailpeserta";
import Pesertatugasakhir from "./Pesertatugasakhir";
import Kegiatanrepo from "./Kegiatanrepo";
import Detailrepo from "./Detailrepo";
import Rekapkehadiran from "./Rekapkehadiran";
import Laporankegiatan from "./Laporankegiatan";
import Kegiatansekreemail from "./Kegiatansekreemail";
import Detailpesertalist from "./Detailpesertalist";
import DaftarkehadiranNarsum from "./DaftarkehadiranNarsum";
import DaftarkehadiranPeserta from "./DaftarkehadiranPeserta";

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
    window.location.href = "/login";
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
          path="/kegiatanben"
          element={<GuardedRoute element={<Kegiatanben />} />}
        />
        <Route
          path="/detailpanitia"
          element={<GuardedRoute element={<Detailpanitia />} />}
        />
        <Route
          path="/detailpanitiaben"
          element={<GuardedRoute element={<Detailpanitiaben />} />}
        />
        <Route
          path="/detailpeserta"
          element={<GuardedRoute element={<Detailpeserta />} />}
        />
        <Route
          path="/pesertatugasakhir"
          element={<GuardedRoute element={<Pesertatugasakhir />} />}
        />
        <Route
          path="/kegiatanrepo"
          element={<GuardedRoute element={<Kegiatanrepo />} />}
        />
        <Route
          path="/detailrepo"
          element={<GuardedRoute element={<Detailrepo />} />}
        />
        <Route
          path="/rekapkehadiran"
          element={<GuardedRoute element={<Rekapkehadiran />} />}
        />
        <Route
          path="/laporankegiatan"
          element={<GuardedRoute element={<Laporankegiatan />} />}
        />
        <Route
          path="/kegiatansekreemail"
          element={<GuardedRoute element={<Kegiatansekreemail />} />}
        />
        <Route
          path="/detailpesertalist"
          element={<GuardedRoute element={<Detailpesertalist />} />}
        />
        <Route
          path="/daftarkehadirannarsum"
          element={<GuardedRoute element={<DaftarkehadiranNarsum />} />}
        />
        <Route
          path="/daftarkehadiranpeserta"
          element={<GuardedRoute element={<DaftarkehadiranPeserta />} />}
        />
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
