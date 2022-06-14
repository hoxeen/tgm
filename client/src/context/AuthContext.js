import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    data:[],
    login: noop,
    logout: noop,
})