import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Sidebar from "./Sidebar"; // Import Sidebar component

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    marginBottom: theme.spacing(3), // Menambahkan margin bawah pada card
    marginTop: theme.spacing(3), // Menambahkan margin atas pada card
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [nama, setNama] = useState(""); // State untuk menyimpan nama pengguna

  // Ambil nama pengguna dari local storage saat komponen dimuat
  useEffect(() => {
    const namaPengguna = localStorage.getItem("nama");
    setNama(namaPengguna || ""); // Mengatur nilai nama atau string kosong jika nama tidak ada
  }, []);

  return (
    <div className={classes.root}>
      <style>
        {`
          .css-12i7wg6-MuiPaper-root-MuiDrawer-paper {
            background-color: #2755AE !important; /* Menetapkan warna latar belakang ke biru yang lebih tua */
            color: #ffffff !important;
          }
        `}
      </style>
      <Sidebar />
      <Box className={classes.content}>
        {/* Tampilkan nama pengguna di samping teks "Selamat Datang" */}
        <Typography variant="h4" gutterBottom>
          Selamat Datang {nama && `, ${nama}`}{" "}
          {/* Tambahkan nama pengguna jika ada */}
        </Typography>
        {/* Menambahkan Card */}
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sistem Informasi IFWS
            </Typography>
            <Typography variant="body1">
              Sistem Informasi IFWS adalah suatu wadah digital yang dirancang
              khusus untuk menyelenggarakan, mengelola, dan memfasilitasi
              berbagai aspek dari sebuah webinar. Sebagai sebuah platform
              aplikasi, SIW menawarkan beragam fitur yang membantu penyelenggara
              dalam mengatur dan menjalankan webinar dengan efisien.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};
const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
};

export default App;
