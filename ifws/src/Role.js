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
    border: `1px solid ${theme.palette.divider}`, // Border for the table
    borderCollapse: "collapse", // Collapse border
    width: "100%", // Ensure table takes full width
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "& > td, & > th": {
      border: `1px solid ${theme.palette.divider}`, // Border for table cells
      padding: theme.spacing(1), // Adjust the padding as needed
    },
  },
  tableHeader: {
    border: `1px solid ${theme.palette.divider}`, // Border for table header
    fontWeight: "bold", // Bold font for table header
    // Add additional styling for table header if needed
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2), // Adjust margin top as needed
  },
  addButton: {
    marginBottom: theme.spacing(2), // Add margin bottom to separate from the table
    fontSize: "0.8rem", // Set font size smaller
  },
  searchField: {
    marginBottom: theme.spacing(2), // Add margin bottom to separate from the table
  },
}));

const Role = () => {
  const classes = useStyles();
  const [nama, setNama] = useState("");
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData(); // Panggil fetchData ketika komponen pertama kali dimuat
  }, [currentPage, searchTerm]); // Panggil fetchData setiap kali currentPage berubah

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/roles/data?limit=5&offset=${
          (currentPage - 1) * 5
        }&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`, // Ganti dengan token autentikasi Anda
          },
        }
      );
      const data = await response.json();
      setRoles(data.items);
      setTotalPages(data.totalPages); // Pastikan totalPages diatur dengan benar
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    const namaPengguna = localStorage.getItem("nama");
    setNama(namaPengguna || "");
  }, []);

  const handleUpdate = (roleId, roleName) => {
    Swal.fire({
      title: "Update Role",
      input: "text",
      inputValue: roleName,
      showCancelButton: true,
      confirmButtonText: "Update",
      showLoaderOnConfirm: true,
      preConfirm: async (newRoleName) => {
        try {
          const response = await fetch(`${API_URL}/roles/${roleId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({ namaRole: newRoleName }),
          });

          if (response.ok) {
            const updatedRoles = roles.map((role) => {
              if (role.id_role === roleId) {
                return { ...role, nm_role: newRoleName };
              }
              return role;
            });
            setRoles(updatedRoles);
            Swal.fire("Success", "Role updated successfully!", "success");
          } else {
            throw new Error("Failed to update role");
          }
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleDelete = async (roleId) => {
    try {
      const response = await fetch(`${API_URL}/roles/delete/${roleId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (response.ok) {
        const updatedRoles = roles.filter((role) => role.id_role !== roleId);
        setRoles(updatedRoles);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Role has been deleted successfully!",
        });
      } else {
        console.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleAdd = async () => {
    const { value: namaRole } = await Swal.fire({
      title: "Tambah Role",
      input: "text",
      inputLabel: "Nama Role",
      showCancelButton: true,
      confirmButtonText: "Tambah",
      showLoaderOnConfirm: true,
      preConfirm: async (namaRole) => {
        try {
          const response = await fetch(`${API_URL}/roles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({ namaRole: namaRole }),
          });

          if (!response.ok) {
            throw new Error("Gagal menambahkan role");
          }

          // Return the namaRole so it can be used below
          return namaRole;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    // If namaRole is truthy (i.e., not null or undefined), reload data
    if (namaRole) {
      fetchData(); // Call fetchData function to update the roles data
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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
              Data Role
            </Typography>
            <Box className={classes.searchField}>
              {" "}
              {/* Menggunakan Box untuk memastikan TextField berada dalam satu baris */}
              <TextField
                label="Cari Role"
                variant="outlined"
                size="small"
                onChange={handleSearch}
                fullWidth
              />
            </Box>
            <IconButton
              className={classes.addButton}
              color="primary"
              onClick={handleAdd}
            >
              <AddIcon /> Tambah Role
            </IconButton>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Nama Role
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id_role} className={classes.tableRow}>
                    <TableCell>{role.nm_role}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleUpdate(role.id_role, role.nm_role)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(role.id_role)}
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
    </div>
  );
};

const theme = createTheme();

const RoleComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Role />
    </ThemeProvider>
  );
};

export default RoleComponent;
