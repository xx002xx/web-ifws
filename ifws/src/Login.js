import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Definisikan navigate di sini

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Username dan Password harus diisi.",
      });
      return;
    }

    // Lakukan permintaan ke server untuk autentikasi
    fetch("http://localhost:3300/akun/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQ0NTkxNDAwMDB9.2bioeyiYk1b8QdXsjAvrcEC91_Nzrxxgq2T5-6-e69M",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Gagal melakukan login. Periksa kembali username dan password Anda.",
          });
          throw new Error("Gagal melakukan login");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Tampilkan data balasan dari server
        // Lakukan penanganan login berhasil di sini, misalnya menyimpan token ke local storage
        localStorage.setItem("email", data.email);
        localStorage.setItem("roleId", data.id_role);
        localStorage.setItem("token", data.key);
        localStorage.setItem("username", data.username);
        localStorage.setItem("nama", data.nama);
        localStorage.setItem("nm_role", data.nm_role);
        localStorage.setItem("id_panitia", data.id_panitia);
        localStorage.setItem("id_peserta", data.id_peserta);

        // Panggil onLogin untuk memperbarui status isLoggedIn
        onLogin();
        // Arahkan pengguna ke halaman home setelah login berhasil
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error.message);
        // Tampilkan pesan kesalahan kepada pengguna
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Gagal melakukan login. Periksa kembali username dan password Anda.",
        });
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: "20vh", textAlign: "center" }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: 6, marginTop: 4 }}>
              Silahkan Login
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              size="small"
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              size="small"
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
