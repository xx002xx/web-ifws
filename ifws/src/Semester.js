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
  InputLabel,
  FormControl,
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

const Semester = () => {
  const classes = useStyles();
  const [nama, setNama] = useState("");
  const [semester, setSemester] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_semester: "",
    tahun_awal: "",
    tahun_akhir: "",
    semester: "",
    tanggal_awal: "",
    tanggal_akhir: "",
  });
  const [isAddMode, setIsAddMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/semester/data?limit=5&offset=${
          (currentPage - 1) * 5
        }&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setSemester(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching semester:", error);
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
      tahun_awal: "",
      tahun_akhir: "",
      semester: "",
      tanggal_awal: "",
      tanggal_akhir: "",
    });
    setIsAddMode(true);
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_URL}/semester`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan semester");
      }

      fetchData();
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Semester has been added successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleUpdate = (
    id_semester,
    tahun_awal,
    tahun_akhir,
    semester,
    tanggal_awal,
    tanggal_akhir
  ) => {
    setFormData({
      id_semester,
      tahun_awal,
      tahun_akhir,
      semester,
      tanggal_awal,
      tanggal_akhir,
    });
    setIsAddMode(false);
    handleOpenModal();
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        `${API_URL}/semester/${formData.id_semester}`,
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
        throw new Error("Gagal memperbarui semester");
      }

      fetchData();
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Semester has been updated successfully!",
      });
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  };

  const handleDelete = async (id_semester) => {
    try {
      const response = await fetch(
        `${API_URL}/semester/delete/${id_semester}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        const updatedSemester = semester.filter(
          (semester) => semester.id_semester !== id_semester
        );
        setSemester(updatedSemester);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Semester has been deleted successfully!",
        });
      } else {
        console.error("Failed to delete semester");
      }
    } catch (error) {
      console.error("Error deleting semester:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderModalContent = () => {
    return (
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isAddMode ? "Tambah Semester" : "Perbarui Semester"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="tahun_awal"
            label="Tahun Awal"
            type="number"
            variant="outlined"
            size="small"
            value={formData.tahun_awal}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          />
          <TextField
            name="tahun_akhir"
            label="Tahun Akhir"
            type="number"
            variant="outlined"
            size="small"
            value={formData.tahun_akhir}
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          />
          <FormControl fullWidth className={classes.formInput}>
            <InputLabel>Semester</InputLabel>
            <Select
              name="semester"
              value={formData.semester}
              onChange={handleFormChange}
            >
              <MenuItem value="Ganjil">Ganjil</MenuItem>
              <MenuItem value="Genap">Genap</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="tanggal_awal"
            label="Tanggal Awal"
            variant="outlined"
            size="small"
            type="date"
            //value={formData.tanggal_awal}
            value={
              formData.tanggal_awal
                ? new Date(formData.tanggal_awal).toLocaleDateString("en-CA")
                : ""
            }
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
          />
          <TextField
            name="tanggal_akhir"
            label="Tanggal Akhir"
            variant="outlined"
            size="small"
            type="date"
            //value={formData.tanggal_akhir}
            value={
              formData.tanggal_akhir
                ? new Date(formData.tanggal_akhir).toLocaleDateString("en-CA")
                : ""
            }
            onChange={handleFormChange}
            fullWidth
            className={classes.formInput} // Apply form input styling
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
              Data Semester
            </Typography>
            <Box className={classes.searchField}>
              <TextField
                label="Cari Semester"
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
              {isAddMode ? "Tambah Semester" : "Perbarui Semester"}
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Tahun Awal
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Tahun Akhir
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Semester
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Tanggal Awal
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Tanggal Akhir
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {semester.map((semester) => (
                  <TableRow
                    key={semester.tahun_awal}
                    className={classes.tableRow}
                  >
                    <TableCell>{semester.tahun_awal}</TableCell>
                    <TableCell align="right"> {semester.tahun_akhir}</TableCell>
                    <TableCell align="center">{semester.semester}</TableCell>
                    <TableCell align="center">
                      {semester.tanggal_awal
                        ? new Date(semester.tanggal_awal).toLocaleDateString(
                            "en-CA"
                          )
                        : ""}
                    </TableCell>
                    <TableCell align="center">
                      {semester.tanggal_akhir
                        ? new Date(semester.tanggal_akhir).toLocaleDateString(
                            "en-CA"
                          )
                        : ""}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleUpdate(
                              semester.id_semester,
                              semester.tahun_awal,
                              semester.tahun_akhir,
                              semester.semester,
                              semester.tanggal_awal,
                              semester.tanggal_akhir
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(semester.id_semester)}
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

const SemesterComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Semester />
    </ThemeProvider>
  );
};

export default SemesterComponent;
