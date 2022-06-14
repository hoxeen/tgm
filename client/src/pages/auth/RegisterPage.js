import React, {useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";

export const RegisterPage = () => {
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        firstname:'',
        lastname:'',
        patronymic:'',
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

    const registrHandler = async () => {
        const method = 'POST'
        const body = JSON.stringify({...form})
        const headers = {'Content-Type': 'application/json'}

        try {
            console.log('Data', form)
            await request('/api/auth/signup', {method, body, headers})
        } catch (e) {}
    }
    return (
        <div className="row">
            <div className="col"></div>
            <h1>Tgm</h1>
            <div className="card darken-1">
                <div className="card-content">
                    <span className="card-title white-text">Регистрация</span>
                    <div>
                        <div className="input-field">
                            <input
                                id="firstname"
                                type="text"
                                name="firstname"
                                onChange={changeHandler}/>
                            <label htmlFor="firstname">Имя</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="lastname"
                                type="text"
                                name="lastname"
                                onChange={changeHandler}/>
                            <label htmlFor="lastname">Фамилия</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="patronymic"
                                type="text"
                                name="patronymic"
                                onChange={changeHandler}/>
                            <label htmlFor="patronymic">Отчество</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="login"
                                type="text"
                                name="login"
                                onChange={changeHandler}/>
                            <label htmlFor="login">Логин</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="password"
                                type="password"
                                name="password"
                                onChange={changeHandler}/>
                            <label htmlFor="password">Пароль</label>
                        </div>
                        <form onChange={changeHandler}>
                            <p>
                                <label>
                                    <input name="roles" value="Supervisor" type="radio" />
                                    <span>Руководитель</span>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <input name="roles" value="User" type="radio"/>
                                    <span>Пользователь</span>
                                </label>
                            </p>
                        </form>
                    </div>
                </div>
                <div className="card-action">
                    <a className="btn yellow darken-4" href='/'>Уже есть аккаунт?</a>
                    <button className="btn grey lighten-1 black-text" onClick={registrHandler} disabled={loading}>Регистрация</button>
                </div>
            </div>
        </div>
    )
}