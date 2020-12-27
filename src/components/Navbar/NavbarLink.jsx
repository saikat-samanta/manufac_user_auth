
import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { NavLink, Link } from 'react-router-dom';
import Cookies from "js-cookie";
import "./Navbar.css";
import { appState } from "./../../App";


function NavbarLink({ className }) {
    const { isLogin, setIsLogin } = useContext(appState);
    function logout() {
        Cookies.remove('auth_token');
        setIsLogin(false);
    }

    return (
        <>
            <NavLink exact to="/" activeClassName="active" className={className}>
                Home
            </NavLink>
            <NavLink exact to="/secret" activeClassName="active" className={className}>
                Secret
            </NavLink>
            {isLogin ?
                <Button color="secondary" variant="outlined" onClick={logout} className={className}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        LogOut
        </Link>
                </Button> :
                <Button color="primary" variant="outlined" className={className}>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        Login
            </Link>
                </Button>
            }
        </>
    )
}

export default NavbarLink
