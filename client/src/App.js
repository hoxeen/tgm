// import logo from './logo.svg';
// import './App.css'
import 'materialize-css'
import React from 'react'
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {BrowserRouter as Router} from "react-router-dom";
// import {Routes} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";
import {appRoutes} from "./appRoutes";
// import {useHttp} from "./hooks/http.hook";



function App() {
    // const [key,setKey] = React.useState('auth');
    const {dataState, login, logout} = useAuth()

    return (
        <AuthContext.Provider value={{dataState, login, logout}}>
        <Router>
            {dataState.roles!=='auth' && <Navbar />}
        <div className="container">
            {useRoutes(appRoutes[dataState.roles])}
        </div>
        </Router>
        </AuthContext.Provider>
    );
}

export default App