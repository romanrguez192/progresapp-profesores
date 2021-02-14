import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LogOutIcon from "@material-ui/icons/ExitToApp";
import { ReactComponent as BarLogo } from "../assets/bar-logo.svg";
import BarDarkMode from "@material-ui/icons/Brightness4";
import DrawerIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
import Background from "../assets/background-appbar.svg";
import ExitIcon from "@material-ui/icons/ExitToApp";
import Assignment from "@material-ui/icons/Assignment";
import { signOut } from "../firebase/functions";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import PeopleIcon from "@material-ui/icons/People";
import { useUser } from "../contexts/UserContext";

function NavBar() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const user = useUser();

  const numerito = 7;

  const handleDrawer = () => {
    setOpen(true);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="sticky"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            style={{ marginRight: "5pt" }}
            onClick={handleDrawer}
          >
            <DrawerIcon />
          </IconButton>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            component={Link}
            to="/"
          >
            <SvgIcon>
              <BarLogo />
            </SvgIcon>
          </IconButton>
          <Link className="titulo" to="/">
            ProgresApp
          </Link>
          <div className="separador1" />
          <Tooltip title="Perfil">
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={openMenu}
            onClose={handleCloseMenu}
          >
            <MenuItem>{user.name}</MenuItem>
            <MenuItem onClick={signOut}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <div className="drawerContainer">
          <ListItem
            button
            component={Link}
            to="/"
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/tutorias"
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Buscar Tutorías" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/estudiantes"
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Lista de Estudiantes" />
          </ListItem>
          <Divider style={{ marginTop: "5pt", marginBottom: "5pt" }} />
          <div className="cDrawerBottom">
            <ListItem button onClick={() => signOut()}>
              <ListItemIcon>
                <ExitIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
}

export default NavBar;
