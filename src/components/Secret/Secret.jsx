import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { Redirect } from 'react-router-dom';
import jwt from "jsonwebtoken";
import "./Secret.css";

function Secret() {
    const [hasCookie, setHasCookie] = useState(false);
    const [id, setId] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        if (Cookies.get('auth_token')) {
            setHasCookie(false);
            jwt.verify(Cookies.get('auth_token'), process.env.REACT_APP_JWT_SECRET, (err, decode) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    const { _id, username } = JSON.parse(this.responseText);
                    setId(_id);
                    setUser(username);
                }
                xhr.open('GET', `${process.env.REACT_APP_DB_ENDPOINT}/${decode}`, true);
                xhr.send()
            });
        } else {
            setHasCookie(true);
        }
    }, []);


    return (
        <div className="secret">
            {hasCookie ? <Redirect to="/login" /> :
                <div className="secret_items">
                    <h1>Welcome <span style={{ color: "white" }}>{user}</span></h1>
                    <h4>Your account _id is: <span style={{ color: "white" }}>{id}</span></h4>
                </div>
            }
        </div>
    )
}

export default Secret
