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
import AddIcon from "@mui/icons-material/Add";

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

const Panitia = () => {
  const classes = useStyles();
  const [nama, setNama] = useState("");
  const [panitia, setPanitia] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_panitia: "",
    nama_panitia: "",
    rate_panitia: "",
    id_role: "",
  });
  const [isAddMode, setIsAddMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [openAkunModal, setOpenAkunModal] = useState(false);
  const [akunData, setAkunData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/panitia/data?limit=5&page=${currentPage}&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setPanitia(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching panitia:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/roles`, {
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
      id_panitia: "",
      nama_panitia: "",
      rate_panitia: "",
      id_role: "",
    });
    setIsAddMode(true);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/panitia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan panitia");
      }

      fetchData();
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Panitia has been added successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleUpdate = (idPanitia, namaPanitia, ratePanitia, idRole) => {
    setFormData({
      id_panitia: idPanitia,
      nama_panitia: namaPanitia,
      rate_panitia: ratePanitia,
      id_role: idRole,
    });
    setIsAddMode(false);
    handleOpenModal();
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

      fetchData();
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

  const handleDelete = async (idPanitia) => {
    try {
      const response = await fetch(`${API_URL}/panitia/delete/${idPanitia}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (response.ok) {
        const updatedPanitia = panitia.filter(
          (panitia) => panitia.id_panitia !== idPanitia
        );
        setPanitia(updatedPanitia);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAkunModal = (idPanitia, namaPanitia, idRole) => {
    setAkunData({
      id_panitia: idPanitia,
      nama_panitia: namaPanitia,
      id_role: idRole,
    });
    setOpenAkunModal(true);
  };

  const handleCloseAkunModal = () => {
    setOpenAkunModal(false);
    setAkunData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleAkunFormChange = (event) => {
    setAkunData({
      ...akunData,
      [event.target.name]: event.target.value,
    });
  };

  const handleBuatAkun = async () => {
    try {
      const response = await fetch(`${API_URL}/akun`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(akunData),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat akun");
      }

      handleCloseAkunModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Akun has been created successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const renderModalContent = () => {
    return (
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isAddMode ? "Tambah Panitia" : "Perbarui Panitia"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="nama_panitia"
            label="Nama Panitia"
            variant="outlined"
            size="small"
            value={formData.nama_panitia}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          />

          <Select
            name="id_role"
            label="ID Role"
            variant="outlined"
            size="small"
            value={formData.id_role}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          >
            {roles.map((role) => (
              <MenuItem key={role.id_role} value={role.id_role}>
                {role.nm_role}
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

  const renderAkunModalContent = () => {
    return (
      <Dialog open={openAkunModal} onClose={handleCloseAkunModal}>
        <DialogTitle>Buat Akun</DialogTitle>
        <DialogContent>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            size="small"
            value={akunData.username}
            onChange={handleAkunFormChange}
            fullWidth
            className={classes.formInput}
          />
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            size="small"
            value={akunData.email}
            onChange={handleAkunFormChange}
            fullWidth
            className={classes.formInput}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            value={akunData.password}
            onChange={handleAkunFormChange}
            fullWidth
            className={classes.formInput}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleBuatAkun}
            color="primary"
            variant="contained"
            className={classes.formInput}
          >
            Buat Akun
          </Button>
          <Button
            onClick={handleCloseAkunModal}
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
              Data Panitia
            </Typography>
            <Box className={classes.searchField}>
              <TextField
                label="Cari Panitia"
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
              className={classes.addButton} // Apply button styling
              size="small" // Set the size to "small"
            >
              {isAddMode ? "Tambah Panitia" : "Perbarui Panitia"}
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Nama Panitia
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Role
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {panitia.map((panitia) => (
                  <TableRow
                    key={panitia.id_panitia}
                    className={classes.tableRow}
                  >
                    <TableCell>{panitia.nama_panitia}</TableCell>

                    <TableCell align="center">{panitia.nm_role}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleUpdate(
                              panitia.id_panitia,
                              panitia.nama_panitia,
                              panitia.rate_panitia,
                              panitia.id_role
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Akun">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleOpenAkunModal(
                              panitia.id_panitia,
                              panitia.nama_panitia,
                              panitia.id_role
                            )
                          }
                        >
                          buat akun <AddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(panitia.id_panitia)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
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
      {renderAkunModalContent()}
    </div>
  );
};

const theme = createTheme();

const PanitiaComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Panitia />
    </ThemeProvider>
  );
};

export default PanitiaComponent;
