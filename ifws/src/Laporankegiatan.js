import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { API_URL, API_TOKEN } from "./GlobalVariables";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { NumericFormat as NumberFormat } from "react-number-format";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  table: {
    border: `1px solid ${theme.palette.divider}`,
    borderCollapse: "collapse",
    width: "100%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "& > td, & > th": {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
    },
  },
  tableHeader: {
    border: `1px solid ${theme.palette.divider}`,
    fontWeight: "bold",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  addButton: {
    marginBottom: theme.spacing(2),
    fontSize: "0.8rem",
    padding: theme.spacing(1), // Add padding to reduce button size
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
  formInput: {
    marginBottom: theme.spacing(2), // Add more spacing between form inputs
  },
  select: {
    width: "100%",
  },
}));

const Laporankegiatan = () => {
  const classes = useStyles();
  const [nama, setNama] = useState("");
  const [dataKegiatan, setDataKegiatan] = useState([]);
  const [panitia, setPanitia] = useState([]);
  const [panitiaNo, setPanitiaNo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_kegiatan: "",
    id_panitia: "",
  });
  const [isAddMode, setIsAddMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModalRate, setOpenModalRate] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesNot, setRolesNot] = useState([]);
  const [selectedBulan, setSelectedBulan] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");

  useEffect(() => {
    const namaPengguna = localStorage.getItem("nama");
    setNama(namaPengguna || "");

    const panitiaData = JSON.parse(localStorage.getItem("panitiaData")) || [];
    console.log("panitiaData:", panitiaData);
    setDataKegiatan(panitiaData);
    console.log("data :", dataKegiatan);
    fetchRoles();
    fetchRoleNotNarasumber();
  }, [currentPage, searchTerm]);

  const fetchDatano = async () => {
    try {
      const response = await fetch(
        `${API_URL}/panitia/detail/${dataKegiatan.id_kegiatan}?role=notNarasumber`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setPanitiaNo(data.items);
      console.log(dataKegiatan.id_kegiatan);
    } catch (error) {
      console.error("Error fetching panitia:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/panitia/narasumber`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchRoleNotNarasumber = async () => {
    try {
      const response = await fetch(`${API_URL}/panitia/notnarasumber`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      const data = await response.json();
      setRolesNot(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOpenModal = () => {
    console.log("add ", dataKegiatan.id_kegiatan);
    setFormData({
      id_kegiatan: dataKegiatan.id_kegiatan,
      id_panitia: "",
    });
    setOpenModal(true);
  };

  const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  };
  const handleOpenModalRate = (panitia) => {
    console.log("rate ", panitia.id_detail_panitia);
    setFormData({
      id_detail_panitia: panitia.id_detail_panitia,
      rate_panitia: panitia.rate_panitia,
    });
    setOpenModalRate(true);
  };

  const handleOpenModalpanitia = () => {
    console.log("add ", dataKegiatan.id_kegiatan);
    setFormData({
      id_kegiatan: dataKegiatan.id_kegiatan,
      id_panitia: "",
    });
    setOpenModal2(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      id_kegiatan: "",
      id_panitia: "",
    });
    setIsAddMode(true);
  };

  const handleCloseModalRate = () => {
    setOpenModalRate(false);
    setFormData({
      id_detail_panitia: "",
      rate_panitia: "",
    });
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
    setFormData({
      id_kegiatan: "",
      id_panitia: "",
    });
    setIsAddMode(true);
  };

  const handleAdd = async () => {
    try {
      const formDataWithFile = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataWithFile.append(key, formData[key]);
      });
      const fileInput = document.querySelector('input[name="upload_panitia"]');
      if (fileInput && fileInput.files[0]) {
        formDataWithFile.append("file", fileInput.files[0]);
      }

      const response = await fetch(`${API_URL}/panitia/pesertatugasakhir`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: formDataWithFile,
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan panitia");
      }
      console.log(JSON.stringify(formData));
      fetchDatano();
      handleCloseModal();
      handleCloseModal2();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Narasumber has been added successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        `${API_URL}/panitia/${formData.id_panitia}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memperbarui panitia");
      }

      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Panitia has been updated successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleUpdateSubmitRate = async () => {
    try {
      const response = await fetch(
        `${API_URL}/panitia/detail/${formData.id_detail_panitia}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchDatano();
        setOpenModalRate(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Panitia has been update successfully!",
        });
      } else {
        console.error("Failed to update panitia");
      }
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleDelete = async (idPanitia) => {
    try {
      const response = await fetch(
        `${API_URL}/panitia/peserta/delete/${idPanitia}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        fetchDatano();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Panitia has been deleted successfully!",
        });
      } else {
        console.error("Failed to delete panitia");
      }
    } catch (error) {
      console.error("Error deleting panitia:", error);
    }
  };
  const handleChangeStatusTa = async (event) => {
    const status_ta = event.target.value;

    try {
      const response = await fetch(
        `${API_URL}/panitia/datakehadiran/${status_ta}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (data.items) {
        setPanitia(data.items);
      } else {
        console.error("Error fetching panitia: Unexpected response format");
      }
      console.log(data.items);
    } catch (error) {
      console.error("Error fetching panitia:", error);
    }
  };
  const tahunList = Array.from(
    { length: new Date().getFullYear() - 2021 + 1 },
    (_, index) => 2021 + index
  );
  const handleExportToExcel = () => {
    const dataToExport = panitia.map((item) => ({
      "Judul Topik": item.judul_topik,
      "Link Webinar": item.link_webinar,
      "Tanggal Kegiatan": new Date(item.tanggal_kegiatan).toLocaleString(
        "id-ID",
        { timeZone: "Asia/Jakarta" }
      ),
      "Waktu Mulai": item.waktu_mulai,
      "Waktu Selesai": item.waktu_selesai,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Kegiatan");
    XLSX.writeFile(wb, "Laporan_Kegiatan.xlsx");
  };

  // Menambahkan event handler untuk tombol "Lihat Laporan"
  const handleLihatLaporan = async () => {
    try {
      const response = await fetch(`${API_URL}/kegiatan/laporan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          bulan: selectedBulan, // Ganti dengan variabel bulan yang dipilih
          tahun: selectedTahun, // Ganti dengan variabel tahun yang dipilih
        }),
      });

      if (response.ok) {
        // Lakukan sesuatu setelah berhasil melakukan request
        const data = await response.json();
        if (data.items) {
          setPanitia(data.items);
        } else {
          console.error("Error fetching panitia: Unexpected response format");
        }
      } else {
        console.error("Gagal mengirim laporan kegiatan");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderModalContent = () => {
    return (
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isAddMode ? "Pilih File Data" : "Pilih File Data"}
        </DialogTitle>
        <DialogContent>
          <input
            type="file"
            name="upload_panitia"
            onChange={handleFormChange}
            className={classes.formInput} // Apply form input styling
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={isAddMode ? handleAdd : handleUpdateSubmit}
            color="primary"
            variant="contained"
            className={classes.formInput}
          >
            {isAddMode ? "Upload" : "Perbarui"}
          </Button>
          <Button
            onClick={handleCloseModal}
            color="primary"
            className={classes.formInput}
          >
            Batal
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderModalContentRate = () => {
    return (
      <Dialog open={openModalRate} onClose={handleCloseModalRate}>
        <DialogTitle>{isAddMode ? "Tambah Rate" : "Perbarui Rate"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Rate Panitia"
            variant="outlined"
            value={formData.rate_panitia}
            onChange={handleFormChange}
            name="rate_panitia"
            type="text"
            autoFocus // Menambahkan autoFocus agar tidak perlu klik terlebih dahulu
            InputProps={{
              inputComponent: NumberFormatCustom, // Komponen untuk format angka
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpdateSubmitRate}
            color="primary"
            variant="contained"
          >
            {isAddMode ? "Tambah" : "Perbarui"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderModalContent2 = () => {
    return (
      <Dialog open={openModal2} onClose={handleCloseModal}>
        <DialogTitle>
          {isAddMode ? "Tambah Panitia" : "Perbarui Panitia"}
        </DialogTitle>
        <DialogContent>
          <Select
            name="id_panitia"
            label="Narasumber"
            variant="outlined"
            size="small"
            value={formData.id_panitia}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          >
            {rolesNot.map((role) => (
              <MenuItem key={role.id_panitia} value={role.id_panitia}>
                {role.nama_panitia} - {role.nm_role}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={isAddMode ? handleAdd : handleUpdateSubmit}
            color="primary"
            variant="contained"
            className={classes.formInput}
          >
            {isAddMode ? "Tambah" : "Perbarui"}
          </Button>
          <Button
            onClick={handleCloseModal2}
            color="primary"
            className={classes.formInput}
          >
            Batal
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className={classes.root}>
      <Sidebar />
      <Box className={classes.content}>
        <Typography variant="h4" gutterBottom>
          Selamat Datang {nama && `, ${nama}`}
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Laporan Kegiatan
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Bulan</InputLabel>
                  <Select
                    labelId="bulan-label"
                    id="bulan"
                    value={selectedBulan}
                    onChange={(e) => setSelectedBulan(e.target.value)}
                  >
                    <MenuItem value="">Pilih Bulan</MenuItem>
                    <MenuItem value="01">Januari</MenuItem>
                    <MenuItem value="02">Februari</MenuItem>
                    <MenuItem value="03">Maret</MenuItem>
                    <MenuItem value="04">April</MenuItem>
                    <MenuItem value="05">Mei</MenuItem>
                    <MenuItem value="06">Juni</MenuItem>
                    <MenuItem value="07">Juli</MenuItem>
                    <MenuItem value="08">Agustus</MenuItem>
                    <MenuItem value="09">September</MenuItem>
                    <MenuItem value="10">Oktober</MenuItem>
                    <MenuItem value="11">November</MenuItem>
                    <MenuItem value="12">Desember</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Tahun</InputLabel>
                  <Select
                    labelId="tahun-label"
                    id="tahun"
                    value={selectedTahun}
                    onChange={(e) => setSelectedTahun(e.target.value)}
                  >
                    <MenuItem value="">Pilih Tahun</MenuItem>
                    {tahunList.map((tahun) => (
                      <MenuItem key={tahun} value={tahun}>
                        {tahun}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: 10, marginBottom: 10 }}
                onClick={handleLihatLaporan}
              >
                Lihat Laporan
              </Button>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Judul Topik
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Link Webinar
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Tanggal Kegiatan
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Waktu Mulai
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Waktu Selesai
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {panitia.map((panitia) => (
                  <TableRow
                    key={panitia.id_kegiatan}
                    className={classes.tableRow}
                  >
                    <TableCell>{panitia.judul_topik}</TableCell>
                    <TableCell align="center">{panitia.link_webinar}</TableCell>
                    <TableCell align="center">
                      {new Date(panitia.tanggal_kegiatan).toLocaleString(
                        "id-ID",
                        { timeZone: "Asia/Jakarta" }
                      )}
                    </TableCell>
                    <TableCell align="center">{panitia.waktu_mulai}</TableCell>
                    <TableCell align="center">
                      {panitia.waktu_selesai}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExportToExcel}
              style={{ marginTop: 10, marginBottom: 10, float: "right" }}
            >
              Export to Excel
            </Button>
          </CardContent>
        </Card>
      </Box>
      {renderModalContent()}
      {renderModalContent2()}
      {renderModalContentRate()}
    </div>
  );
};

const theme = createTheme();

const LaporankegiatanComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Laporankegiatan />
    </ThemeProvider>
  );
};

export default LaporankegiatanComponent;
