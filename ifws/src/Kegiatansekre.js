import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { API_URL, API_TOKEN } from "./GlobalVariables";
import { useNavigate } from "react-router-dom";
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
  Pagination,
  Tooltip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const Kegiatansekre = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [dataKegiatan, setDataKegiatan] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_semester: "",
    judul_topik: "",
    link_webinar: "",
    tanggal_kegiatan: "",
    waktu_mulai: "",
    waktu_selesai: "",
  });
  const [isAddMode, setIsAddMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    fetchData();
    fetchSemesters();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/kegiatan/data?limit=5&page=${currentPage}&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setDataKegiatan(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching data kegiatan:", error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await fetch(`${API_URL}/semester`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      const data = await response.json();
      setSemesters(data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  useEffect(() => {
    const namaPengguna = localStorage.getItem("nama");
    setNama(namaPengguna || "");
  }, []);

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      id_semester: "",
      judul_topik: "",
      link_webinar: "",
      tanggal_kegiatan: "",
      waktu_mulai: "",
      waktu_selesai: "",
    });
    setIsAddMode(true);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/kegiatan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      fetchData();
      handleCloseModal();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data kegiatan has been added successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: responseData.message,
        });
      }
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };
  const handlePanitia = (
    id_kegiatan,
    id_semester,
    judul_topik,
    link_webinar,
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai
  ) => {
    localStorage.setItem(
      "panitiaData",
      JSON.stringify({
        id_kegiatan,
        id_semester,
        judul_topik,
        link_webinar,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
      })
    );
    navigate("/detailpanitia");
  };

  const handlePeserta = (
    id_kegiatan,
    id_semester,
    judul_topik,
    link_webinar,
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai
  ) => {
    localStorage.setItem(
      "panitiaData",
      JSON.stringify({
        id_kegiatan,
        id_semester,
        judul_topik,
        link_webinar,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
      })
    );
    navigate("/detailpeserta");
    // Fungsi untuk menangani peserta belum diimplementasikan
  };

  const handleUpdate = (
    id_kegiatan,
    id_semester,
    judul_topik,
    link_webinar,
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai
  ) => {
    setFormData({
      id_kegiatan,
      id_semester,
      judul_topik,
      link_webinar,
      tanggal_kegiatan,
      waktu_mulai,
      waktu_selesai,
    });
    console.log(tanggal_kegiatan);
    setIsAddMode(false);
    handleOpenModal();
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        `${API_URL}/kegiatan/${formData.id_kegiatan}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      fetchData();
      handleCloseModal();
      if (responseData.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data kegiatan has been update successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: responseData.message,
        });
      }
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleDelete = async (id_kegiatan) => {
    try {
      const response = await fetch(
        `${API_URL}/kegiatan/delete/${id_kegiatan}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        const updatedDataKegiatan = dataKegiatan.filter(
          (dataKegiatan) => dataKegiatan.id_kegiatan !== id_kegiatan
        );
        setDataKegiatan(updatedDataKegiatan);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data kegiatan has been deleted successfully!",
        });
      } else {
        console.error("Failed to delete data kegiatan");
      }
    } catch (error) {
      console.error("Error deleting data kegiatan:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderModalContent = () => {
    if (!openModal) {
      return null;
    }

    return (
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isAddMode ? "Tambah Data Kegiatan" : "Perbarui Data Kegiatan"}
        </DialogTitle>
        <DialogContent>
          <Select
            name="id_semester"
            label="ID Semester"
            variant="outlined"
            size="small"
            value={formData.id_semester || ""}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput}
          >
            {semesters.map((semester) => (
              <MenuItem key={semester.id_semester} value={semester.id_semester}>
                {semester.semester} ({semester.tahun_awal} -{" "}
                {semester.tahun_akhir}) [{" "}
                {semester.tanggal_awal
                  ? new Date(semester.tanggal_awal)
                      .toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\//g, "/")
                  : ""}{" "}
                -{" "}
                {semester.tanggal_akhir
                  ? new Date(semester.tanggal_akhir)
                      .toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\//g, "/")
                  : ""}{" "}
                ]
              </MenuItem>
            ))}
          </Select>
          <TextField
            name="judul_topik"
            label="Judul Topik"
            variant="outlined"
            size="small"
            value={formData.judul_topik || ""}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput}
          />
          <TextField
            name="link_webinar"
            label="Link Webinar"
            variant="outlined"
            size="small"
            value={formData.link_webinar || ""}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput}
          />
          <TextField
            name="tanggal_kegiatan"
            label="Tanggal Kegiatan"
            variant="outlined"
            size="small"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={
              formData.tanggal_kegiatan
                ? new Date(formData.tanggal_kegiatan)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput}
          />
          <TextField
            name="waktu_mulai"
            label="Waktu Mulai"
            variant="outlined"
            size="small"
            type="time"
            value={formData.waktu_mulai || ""}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput}
          />
          <TextField
            name="waktu_selesai"
            label="Waktu Selesai"
            variant="outlined"
            type="time"
            size="small"
            value={formData.waktu_selesai || ""}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput}
          />
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
              Data Kegiatan
            </Typography>
            <Box className={classes.searchField}>
              <TextField
                label="Cari Data Kegiatan"
                variant="outlined"
                size="small"
                onChange={handleSearch}
                fullWidth
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              className={classes.addButton}
              size="small"
            >
              {isAddMode ? "Tambah Data Kegiatan" : "Perbarui Data Kegiatan"}
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tableHeader}>
                    Semester
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
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
                  <TableCell align="center" className={classes.tableHeader}>
                    Panitia
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Peserta
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataKegiatan && dataKegiatan.length > 0 ? (
                  dataKegiatan.map((dataKegiatan) => (
                    <TableRow key={dataKegiatan.id_kegiatan}>
                      <TableCell align="right">
                        {dataKegiatan.semester} ({dataKegiatan.tahun_awal} -{" "}
                        {dataKegiatan.tahun_akhir})
                      </TableCell>
                      <TableCell align="center">
                        {dataKegiatan.judul_topik}
                      </TableCell>
                      <TableCell align="center">
                        {dataKegiatan.link_webinar}
                      </TableCell>
                      <TableCell align="center">
                        {dataKegiatan.tanggal_kegiatan
                          ? new Date(dataKegiatan.tanggal_kegiatan)
                              .toLocaleString("id-ID", {
                                timeZone: "Asia/Jakarta",
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                              .replace(/\//g, "/")
                          : ""}
                      </TableCell>
                      <TableCell align="center">
                        {dataKegiatan.waktu_mulai}
                      </TableCell>
                      <TableCell align="center">
                        {dataKegiatan.waktu_selesai}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Panitia">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handlePanitia(
                                dataKegiatan.id_kegiatan,
                                dataKegiatan.id_semester,
                                dataKegiatan.judul_topik,
                                dataKegiatan.link_webinar,
                                dataKegiatan.tanggal_kegiatan
                                  ? new Date(
                                      dataKegiatan.tanggal_kegiatan
                                    ).toLocaleString("id-ID", {
                                      timeZone: "Asia/Jakarta",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })
                                  : "",
                                dataKegiatan.waktu_mulai,
                                dataKegiatan.waktu_selesai
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Peserta">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handlePeserta(
                                dataKegiatan.id_kegiatan,
                                dataKegiatan.id_semester,
                                dataKegiatan.judul_topik,
                                dataKegiatan.link_webinar,
                                dataKegiatan.tanggal_kegiatan
                                  ? new Date(
                                      dataKegiatan.tanggal_kegiatan
                                    ).toLocaleDateString("en-CA")
                                  : "",
                                dataKegiatan.waktu_mulai,
                                dataKegiatan.waktu_selesai
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleUpdate(
                                dataKegiatan.id_kegiatan,
                                dataKegiatan.id_semester,
                                dataKegiatan.judul_topik,
                                dataKegiatan.link_webinar,
                                dataKegiatan.tanggal_kegiatan
                                  ? new Date(dataKegiatan.tanggal_kegiatan)
                                      .toLocaleDateString("en-CA", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        timeZone: "Asia/Jakarta",
                                      })
                                      .slice(0, 10)
                                      .replace(/T/g, "")
                                  : "",
                                dataKegiatan.waktu_mulai,
                                dataKegiatan.waktu_selesai
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDelete(dataKegiatan.id_kegiatan)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className={classes.paginationContainer}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
              />
            </div>
          </CardContent>
        </Card>
      </Box>
      {renderModalContent()}
    </div>
  );
};

const theme = createTheme();

const kegiatansekreComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Kegiatansekre />
    </ThemeProvider>
  );
};

export default kegiatansekreComponent;
