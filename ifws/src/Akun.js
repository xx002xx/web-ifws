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

const Akun = () => {
  const classes = useStyles();
  const [nama, setNama] = useState("");
  const [dataAkun, setDataAkun] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email_akun: "",
    password: "",
    id_role: "",
  });
  const [isAddMode, setIsAddMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/akun/data?limit=5&page=${currentPage}&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setDataAkun(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching data akun:", error);
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
      username: "",
      nama: "",
      email_akun: "",
      password: "",
      id_role: "",
    });
    setIsAddMode(true);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/akun`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan data akun");
      }

      fetchData();
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data akun has been added successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleUpdate = (username, nama, email_akun, password, id_role) => {
    setFormData({
      username,
      nama,
      email_akun,
      password,
      id_role,
    });
    setIsAddMode(false);
    handleOpenModal();
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/akun/${formData.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui data akun");
      }

      fetchData();
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data akun has been updated successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleDelete = async (username) => {
    try {
      const response = await fetch(`${API_URL}/akun/delete/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (response.ok) {
        const updatedDataAkun = dataAkun.filter(
          (dataAkun) => dataAkun.username !== username
        );
        setDataAkun(updatedDataAkun);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data akun has been deleted successfully!",
        });
      } else {
        console.error("Failed to delete data akun");
      }
    } catch (error) {
      console.error("Error deleting data akun:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderModalContent = () => {
    return (
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isAddMode ? "Tambah Data Akun" : "Perbarui Data Akun"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            size="small"
            value={formData.username}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          />
          <TextField
            name="nama"
            label="Nama"
            variant="outlined"
            size="small"
            value={formData.nama}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          />
          <TextField
            name="email_akun"
            label="Email Akun"
            variant="outlined"
            size="small"
            value={formData.email_akun}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            size="small"
            value={formData.password}
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
              Data Akun
            </Typography>
            <Box className={classes.searchField}>
              <TextField
                label="Cari Data Akun"
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
              {isAddMode ? "Tambah Data Akun" : "Perbarui Data Akun"}
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Username
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Nama
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Email Akun
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
                {dataAkun.map((dataAkun) => (
                  <TableRow
                    key={dataAkun.username}
                    className={classes.tableRow}
                  >
                    <TableCell>{dataAkun.username}</TableCell>
                    <TableCell align="right">{dataAkun.nama}</TableCell>
                    <TableCell align="center">{dataAkun.email_akun}</TableCell>
                    <TableCell align="center">{dataAkun.nm_role}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleUpdate(
                              dataAkun.username,
                              dataAkun.nama,
                              dataAkun.email_akun,
                              dataAkun.password,
                              dataAkun.id_role
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(dataAkun.username)}
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
    </div>
  );
};

const theme = createTheme();

const AkunComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Akun />
    </ThemeProvider>
  );
};

export default AkunComponent;
