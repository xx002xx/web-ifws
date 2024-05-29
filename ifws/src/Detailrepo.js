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
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { NumericFormat as NumberFormat } from "react-number-format";

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

const Detailrepo = () => {
  const classes = useStyles();
  const [nama, setNama] = useState("");
  const [dataKegiatan, setDataKegiatan] = useState([]);
  const [panitia, setPanitia] = useState([]);
  const [panitiaNo, setPanitiaNo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_kegiatan: "",
    nama_file: "",
  });
  const [isAddMode, setIsAddMode] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModalRate, setOpenModalRate] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesNot, setRolesNot] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const namaPengguna = localStorage.getItem("nama");
    setNama(namaPengguna || "");

    const panitiaData = JSON.parse(localStorage.getItem("panitiaData")) || [];
    console.log("panitiaData:", panitiaData);
    setDataKegiatan(panitiaData);
    console.log("data :", dataKegiatan);
    fetchRoles();
    fetchRoleNotNarasumber();
  }, []);

  useEffect(() => {
    if (dataKegiatan.id_kegiatan) {
      fetchData();
    }
  }, [dataKegiatan]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/panitia/datarepository/${dataKegiatan.id_kegiatan}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setPanitia(data.items);
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
      nama_file: "",
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
    setLoading(true);
    try {
      const formDataWithFile = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataWithFile.append(key, formData[key]);
      });
      const fileInput = document.querySelector('input[name="upload_panitia"]');
      if (fileInput && fileInput.files[0]) {
        formDataWithFile.append("file", fileInput.files[0]);
      }
      const username = localStorage.getItem("username");
      formDataWithFile.append("username", username);
      const response = await fetch(`${API_URL}/panitia/repository`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: formDataWithFile,
      });

      console.log("Status Response:", response.status); // Debugging status
      if (response.status === 200) {
        console.log("Fetching data..."); // Debugging
        await fetchData();
        console.log("Data fetched"); // Debugging
        setLoading(false);
        handleCloseModal();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Narasumber has been added successfully!",
        }).then((result) => {
          if (result.isConfirmed) {
            fetchData();
          }
        });
      } else {
        throw new Error("Gagal menambahkan panitia");
      }
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
        fetchData();
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
        `${API_URL}/panitia/deleterepo/${idPanitia}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        fetchData();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Repository has been deleted successfully!",
        });
      } else {
        console.error("Failed to delete panitia");
      }
    } catch (error) {
      console.error("Error deleting panitia:", error);
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
          <input
            type="text"
            name="nama_file"
            onChange={handleFormChange}
            className={classes.formInput} // Apply form input styling
            placeholder="Nama File"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={isAddMode ? handleAdd : handleUpdateSubmit}
            color="primary"
            variant="contained"
            className={classes.formInput}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
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
              Data Kegiatan
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
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
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {/* Hapus properti yang tidak perlu */}
                  <TableCell align="center">
                    {dataKegiatan.judul_topik}
                  </TableCell>
                  <TableCell align="center">
                    {dataKegiatan.link_webinar}
                  </TableCell>
                  <TableCell align="center">
                    {dataKegiatan.tanggal_kegiatan}
                  </TableCell>
                  <TableCell align="center">
                    {dataKegiatan.waktu_mulai}
                  </TableCell>
                  <TableCell align="center">
                    {dataKegiatan.waktu_selesai}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography variant="h6" gutterBottom>
              Repository
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              className={classes.addButton} // Apply button styling
              size="small" // Set the size to "small"
            >
              Add
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Nama File
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    File
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Created By
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {panitia.map((panitia) => (
                  <TableRow
                    key={panitia.id_repository}
                    className={classes.tableRow}
                  >
                    <TableCell>{panitia.nama_file}</TableCell>
                    <TableCell align="center">
                      <a
                        target="_blank"
                        href={`${API_URL}/${panitia.url_file}`}
                        download
                      >
                        Download
                      </a>
                    </TableCell>
                    <TableCell align="center">{panitia.nama}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(panitia.id_repository)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

const DetailrepoComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Detailrepo />
    </ThemeProvider>
  );
};

export default DetailrepoComponent;
