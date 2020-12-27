import React, { useState } from 'react';
import "./Navbar.css";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Drawer, IconButton, Toolbar, useMediaQuery, useTheme } from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import NavbarLink from './NavbarLink';

const useStyle = makeStyles((theme) => ({
    AppBar: {
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: "2000",
        position: "sticky",
        [theme.breakpoints.down('xs')]: {
            backgroundColor: "#ecf0f1",
        },
    },
    menuButton: {
        color: "black",
        border: "1px solid grey",
        [theme.breakpoints.up("sm")]: {
            display: "none",
        }
    },
    nav: {
        [theme.breakpoints.down('xs')]: {
            display: "none",
        },
    },
    link: {
        textDecoration: "none",
        marginLeft: "20px",
        fontSize: "16px",
    },
    mobilelink: {
        marginTop: "20px",
        textDecoration: "none",
        fontSize: "16px",
    },
    drawer: {
        display: "flex",
        flexDirection: "column",
        margin: "70px 0",
        padding: "0 10vw",
    }
}));

function Navbar() {
    const classes = useStyle();
    const theme = useTheme();
    const match = useMediaQuery(theme.breakpoints.down('xs'));
    const [state, setstate] = useState(false);

    function navbarOpen() {
        setstate(!state);
    }
    return (
        <>
            <AppBar className={classes.AppBar}>
                <img className="navbar_brand" src="asset/manufac_logo.png" alt="Manufac Logo" />
                <Toolbar className={classes.toolbar}>
                    <IconButton edge="start" className={classes.menuButton} onClick={navbarOpen} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <nav onClick={navbarOpen} className={classes.nav}>
                        <NavbarLink className={classes.link} />
                    </nav>
                </Toolbar>
            </AppBar>
            {match && <Drawer style={{ color: "transparent" }} anchor='top' open={state} onClose={navbarOpen} >
                <nav onClick={navbarOpen} className={classes.drawer}>
                    <NavbarLink className={classes.mobilelink} />
                </nav>
            </Drawer>}
        </>
    )
}

export default Navbar
