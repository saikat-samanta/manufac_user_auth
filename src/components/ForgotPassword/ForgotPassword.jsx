import { Button, Grid, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import bcrypt from "bcryptjs";
import { Alert } from '@material-ui/lab';

function ForgotPassword() {
    const [inputData, setInputData] = useState({
        email: "",
        password: "",
        cpassword: ""
    });
    const [statMessage, setStatMessage] = useState({
        message: "",
        state: false
    });
    const [userData, setUserData] = useState({
        _id: "",
        username: "",
        email: ""
    });
    function handleChange(ev) {
        const { name, value } = ev.target;
        setInputData({ ...inputData, [name]: value });
    }
    function dataSubmit(ev) {
        ev.preventDefault();
        const xhr = new XMLHttpRequest();
        xhr.onprogress = function () {
            setStatMessage({ message: "We are searching for You...", state: false });
        };
        xhr.onload = function () {
            try {
                const [{ _id, username, email }] = JSON.parse(this.responseText);
                setTimeout(() => {
                    setStatMessage({ message: "We taking you forword", state: true });
                    setUserData({ _id, username, email });
                }, 1200);
            } catch {
                setStatMessage({ message: "Email not found", state: false });
            }
        };
        xhr.open('GET', `${process.env.REACT_APP_DB_ENDPOINT}?q=email:${inputData.email}`, true);
        xhr.send();
    }
    function passwordSubmit(ev) {
        ev.preventDefault();
        const regularEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regularEx.test(inputData.password)) {
            if (inputData.password === inputData.cpassword) {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    setStatMessage({ message: "Your Password has changed successfully", state: true });
                };
                xhr.open("PUT", `${process.env.REACT_APP_DB_ENDPOINT}/${userData._id}`, true);
                xhr.setRequestHeader("content-type", "application/json");
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(inputData.password, salt, function (err, hash) {
                        xhr.send(JSON.stringify({ username: userData.username, email: userData.email, password: hash, cpassword: hash }));
                    });
                });
            } else {
                setStatMessage({ message: "confirm password not match", state: false });
            }
        } else {
            setStatMessage({ message: "Please enter a strong password", state: false });
        }
    }
    return (
        <div>
            <Grid container justify="center" alignContent="center" style={{ minHeight: "80vh" }} direction="column">
                {(!userData._id) ? <Grid item xs={11} sm={6} >
                    <Typography variant="h5" align="center" color="primary">Please enter your email:</Typography>
                    {statMessage.message && <>{statMessage.state ? <Alert severity="success">{statMessage.message}</Alert> : <Alert severity="warning">{statMessage.message}</Alert>}</>}
                    <form onSubmit={dataSubmit}>
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
                            autoFocus={true}
                            style={{ padding: "10px 0" }}
                        />
                        <Button type="submit" variant="contained" color="primary" >submit</Button>
                    </form>
                </Grid> :
                    <Grid item xs={11} sm={6}>
                        <Typography variant="h5" align="center" color="primary">Please enter your new password:</Typography>
                        {statMessage.message && <>{statMessage.state ? <Alert severity="success">{statMessage.message}</Alert> : <Alert severity="warning">{statMessage.message}</Alert>}</>}
                        <form onSubmit={passwordSubmit}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={inputData.password}
                                onChange={handleChange}
                                style={{ padding: "10px 0" }}
                            />
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="cpassword"
                                label="Confirm Password"
                                type="password"
                                id="cpassword"
                                value={inputData.cpassword}
                                onChange={handleChange}
                                style={{ paddingBottom: "10px" }}
                            />
                            <Button type="submit" variant="contained" color="primary">submit</Button>
                        </form>
                    </Grid>}
            </Grid>
        </div>
    )
}

export default ForgotPassword
