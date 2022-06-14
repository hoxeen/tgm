import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const nav = useNavigate()
    const [form, setForm] = useState({
        login:'',
        password:''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const loginHandler = async () => {
        const method = 'POST'
        const body = JSON.stringify({...form})
        const headers = {'Content-Type': 'application/json'}
        try {
            const data = await request('/api/auth/signin', {method, body, headers})
            // console.log(data)
            if(typeof (data.token) != 'undefined') {
                auth.login(data)
                nav('/'+data.roles)
            }
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col"></div>
            <h1>Tgm</h1>
            <div className="card darken-1">
                <div className="card-content">
                    <span className="card-title white-text">Авторизация</span>
                    <div>
                        <div className="input-field">
                            <input
                                id="login"
                                type="text"
                                name="login"
                                onChange={changeHandler}/>
                                <label htmlFor="login">Login</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                onChange={changeHandler}/>
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                </div>
                <div className="card-action">
                    <button className="btn yellow darken-4" onClick={loginHandler} disabled={loading}>Войти</button>
                    <a className="btn grey lighten-1 black-text" href='/register' >Новый аккаунт</a>
                </div>
            </div>
        </div>
    )
}