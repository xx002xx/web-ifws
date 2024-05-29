import React, { useEffect, useState } from "react";
import { API_URL, API_TOKEN } from "./GlobalVariables";
import { makeStyles } from "@mui/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // Import semua ikon yang diperlukan

const drawerWidth = 240;

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
  const [drawerItems, setDrawerItems] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuData = async () => {
      const roleId = localStorage.getItem("roleId"); // Mengambil roleId dari localStorage
      const response = await fetch(`${API_URL}/menu/dataakses/${roleId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      const data = await response.json();
      const menuItems = data.map((item) => ({
        text: item.nm_menu,
        icon: <MenuIcon />, // Sesuaikan ikon berdasarkan item.id_menu atau kondisi lain
        path: `/${item.url_menu}`,
      }));
      setDrawerItems(menuItems);
    };

    fetchMenuData();
  }, []);

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
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
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
