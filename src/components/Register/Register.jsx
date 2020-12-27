import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import bcrypt from "bcryptjs";


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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Register() {
    const classes = useStyles();
    const [regInput, setRegInput] = useState({
        username: "",
        email: "",
        password: "",
        cpassword: ""
    });
    const [responseData, setResponseData] = useState({
        message: "",
        state: false
    });

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        if (name === "password") {
            const regularEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regularEx.test(value)) {
                setResponseData({ message: `Enter a strong password`, state: false });
            } else {
                setResponseData({ message: `Password look strong`, state: true });
            }
        }
        setRegInput({ ...regInput, [name]: value });
    };

    const formSubmit = (ev) => {
        ev.preventDefault();
        const regularEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regularEx.test(regInput.password)) {
            if (regInput.password === regInput.cpassword) {
                const xhttp = new XMLHttpRequest();
                xhttp.onload = function (event) {
                    if ((JSON.parse(this.responseText)).length > 0) {
                        setResponseData({ message: `Email Already exsist`, state: false });
                    } else {
                        xhttp.onload = function () {
                            if (this.status === 200) {
                                setResponseData({
                                    message: `Successfully register ${JSON.parse(this.responseText).username}`,
                                    state: true
                                });
                                setRegInput({
                                    username: "",
                                    email: "",
                                    password: "",
                                    cpassword: ""
                                });
                            } else {
                                setResponseData({ message: `Something went wrong, Please try again`, state: false });
                            }
                        };

                        /* Instead of LocalStorage I prefer to use a database(here use online DB) system. Because Local Storage increase the browser data size. which may slow your browser. */
                        xhttp.open("POST", process.env.REACT_APP_DB_ENDPOINT, true);
                        xhttp.setRequestHeader("Content-type", "application/json");
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(regInput.password, salt, function (err, hash) {
                                // Store hash in your password DB.
                                xhttp.send(JSON.stringify({ username: regInput.username, email: regInput.email, password: hash, cpassword: hash }));
                            });
                        });
                    }
                }
                xhttp.open('GET', `${process.env.REACT_APP_DB_ENDPOINT}?q=email:${regInput.email}`, true);
                xhttp.send();
            } else {
                setResponseData({ message: `Confirm password is not match`, state: false });
            }
        } else {
            setResponseData({ message: `Enter a strong password`, state: false });
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
        </Typography>
                {responseData.message !== "" && <>{responseData.state ? <Alert severity="success">{responseData.message}</Alert> : <Alert severity="warning">{responseData.message}</Alert>}</>}
                <form className={classes.form} onSubmit={formSubmit} noValidate={false}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                value={regInput.username}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                type="email"
                                id="email"
                                label="Email Address"
                                name="email"
                                value={regInput.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={regInput.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="cpassword"
                                label="confirm Password"
                                type="password"
                                id="cpassword"
                                value={regInput.cpassword}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
          </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/login">
                                Already have an account? Sign in
              </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}