import React, { createContext, useEffect, useState } from "react";
import './App.css';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './components/Login/Login';
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Home from './components/Home/Home';
import Secret from './components/Secret/Secret';
import Register from './components/Register/Register';
import Cookies from "js-cookie";


export const appState = createContext();


function App() {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (Cookies.get('auth_token')) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);



  return (
    <Router>
      <appState.Provider value={{ isLogin, setIsLogin }}>
        <div className="background"></div>
        <div className="App" >
          <Navbar />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/secret">
              <Secret />
            </Route>
            <Route path="*">
              <ErrorPage />
            </Route>
          </Switch>
          <Footer />
        </div>
      </appState.Provider>
    </Router>
  );
}

export default App;
