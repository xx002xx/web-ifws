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

const Menu = () => {
  const classes = useStyles();
  const [nama, setNama] = useState("");
  const [menus, setMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData(); // Panggil fetchData ketika komponen pertama kali dimuat
  }, [currentPage, searchTerm]); // Panggil fetchData setiap kali currentPage berubah

  const fetchData = async () => {
    console.log(`Previous page: ${currentPage}`);
    try {
      const response = await fetch(
        `${API_URL}/menu/data?limit=5&offset=${currentPage}&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`, // Ganti dengan token autentikasi Anda
          },
        }
      );
      const data = await response.json();
      setMenus(data.items);
      setTotalPages(data.totalPages); // Pastikan totalPages diatur dengan benar
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    const namaPengguna = localStorage.getItem("nama");
    setNama(namaPengguna || "");
  }, []);

  const handleUpdate = (menuId, menuName) => {
    Swal.fire({
      title: "Update Menu",
      input: "text",
      inputValue: menuName,
      showCancelButton: true,
      confirmButtonText: "Update",
      showLoaderOnConfirm: true,
      preConfirm: async (newMenuName) => {
        try {
          const response = await fetch(`${API_URL}/menu/${menuId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({ nm_menu: newMenuName }),
          });

          if (response.ok) {
            const updatedMenus = menus.map((menu) => {
              if (menu.id_menu === menuId) {
                return { ...menu, nm_menu: newMenuName };
              }
              return menu;
            });
            setMenus(updatedMenus);
            Swal.fire("Success", "Menu updated successfully!", "success");
          } else {
            throw new Error("Failed to update menu");
          }
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleDelete = async (menuId) => {
    try {
      const response = await fetch(`${API_URL}/menu/delete/${menuId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (response.ok) {
        const updatedMenus = menus.filter((menu) => menu.id_menu !== menuId);
        setMenus(updatedMenus);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Menu has been deleted successfully!",
        });
      } else {
        console.error("Failed to delete menu");
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  const handleAdd = async () => {
    const { value: menuName } = await Swal.fire({
      title: "Tambah Menu",
      input: "text",
      inputLabel: "Nama Menu",
      showCancelButton: true,
      confirmButtonText: "Tambah",
      showLoaderOnConfirm: true,
      preConfirm: async (menuName) => {
        try {
          const response = await fetch(`${API_URL}/menu`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({ nm_menu: menuName }),
          });

          if (!response.ok) {
            throw new Error("Gagal menambahkan menu");
          }

          // Return the menuName so it can be used below
          return menuName;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    // If menuName is truthy (i.e., not null or undefined), reload data
    if (menuName) {
      fetchData(); // Call fetchData function to update the menus data
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
              Data Menu
            </Typography>
            <Box className={classes.searchField}>
              {" "}
              {/* Menggunakan Box untuk memastikan TextField berada dalam satu baris */}
              <TextField
                label="Cari Menu"
                variant="outlined"
                size="small"
                onChange={handleSearch}
                fullWidth
              />
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Nama Menu
                  </TableCell>
                  <TableCell className={classes.tableHeader}>
                    Path URL
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeader}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menus.map((menu) => (
                  <TableRow key={menu.id_menu} className={classes.tableRow}>
                    <TableCell>{menu.nm_menu}</TableCell>
                    <TableCell>{menu.url_menu}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleUpdate(menu.id_menu, menu.nm_menu)
                          }
                        >
                          <EditIcon />
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

const menuComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Menu />
    </ThemeProvider>
  );
};

export default menuComponent;
