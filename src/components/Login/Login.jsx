import React, { useContext, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, Redirect } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { appState } from "./../../App";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login() {
    const classes = useStyles();
    const { isLogin, setIsLogin } = useContext(appState);
    const [inputData, setInputData] = useState({
        email: "",
        password: ""
    });
    const [redirect, setRedirect] = useState(false);
    const [responseData, setResponseData] = useState({
        message: "",
        state: false
    });
    function handleChange(ev) {
        const { name, value } = ev.target;
        setInputData(prevData => {
            return { ...prevData, [name]: value };
        })
    }
    function handleSubmit(ev) {
        ev.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status === 200) {
                try {
                    const [{ _id, username, password }] = JSON.parse(this.responseText);
                    bcrypt.compare(inputData.password, password, function (err, res) {
                        if (res) {
                            setResponseData({ message: `You have successfully logIn ${username}`, state: true });
                            jwt.sign(_id, process.env.REACT_APP_JWT_SECRET, (error, token) => {
                                Cookies.set('auth_token', token, { expires: 7 });
                                setIsLogin(true);
                            });
                            setInputData({
                                email: "",
                                password: ""
                            });
                            setTimeout(() => {
                                setRedirect(true);
                            }, 2000);
                        } else {
                            setResponseData({ message: `Invalid Credentials`, state: false });
                        }
                    });
                } catch (error) {
                    setResponseData({ message: `Email not Found`, state: false });
                }
            } else {
                setResponseData({ message: `Something went wrong`, state: false });
            }
        };
        xhr.open("GET", `${process.env.REACT_APP_DB_ENDPOINT}?q=email:${inputData.email}`, true);
        xhr.send();
    }

    return (
        <Container component="main" maxWidth="xs">
            {isLogin && redirect && <Redirect to="/secret" />}
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
        </Typography>
                {responseData.message !== "" && <>{responseData.state ? <Alert severity="success">{responseData.message}</Alert> : <Alert severity="warning">{responseData.message}</Alert>}</>}
                <form className={classes.form} onSubmit={handleSubmit} noValidate={false}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        type="email"
                        label="Email Address"
                        name="email"
                        value={inputData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={inputData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
          </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/register">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}