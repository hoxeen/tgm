import React, {useContext} from 'react'
// import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
export const Navbar = () => {
    const nav = useNavigate()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        // HTMLElement.click()
        auth.logout()
        nav('/')
        // console.log('text')
        // history.push('/')
    }

    return (
        <nav>
            <div className="nav-wrapper">
                <span className="brand-logo">Tgm</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {/*<li><NavLink to="/create">Создать</NavLink></li>*/}
                    {/*<li><NavLink to="/links">Создать</NavLink></li>*/}
                    <li><a href="/" onClick={logoutHandler} >Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}