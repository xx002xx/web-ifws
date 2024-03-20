import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MenuIcon from "@mui/icons-material/Menu";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk navigasi

const drawerWidth = 240;

const drawerItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/home" },
  { text: "Role", icon: <PermIdentityIcon />, path: "/role" },
  { text: "Menu", icon: <MenuIcon />, path: "/menu" },
  { text: "Akun", icon: <AccountBoxIcon />, path: "/akun" },
  { text: "Logout", icon: <ExitToAppIcon />, path: "/logout" }, // Tambahkan path untuk logout
];

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#0d47a1",
    color: "#ffffff",
  },
  title: {
    textAlign: "center",
    padding: theme.spacing(2),
    backgroundColor: "#2755AE",
    color: "#ffffff",
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    // Lakukan logout di sini
    localStorage.clear(); // Membersihkan storage
    navigate("/login"); // Navigasi ke halaman login setelah logout
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Typography variant="h5" className={classes.title}>
        SI IFWS
      </Typography>
      <List>
        {drawerItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              if (item.text === "Logout") {
                handleLogout(); // Panggil handleLogout saat logout diklik
              } else {
                navigate(item.path); // Navigasi ke path yang ditentukan saat item selain Logout diklik
              }
            }}
          >
            <ListItemIcon style={{ color: "#ffffff" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
