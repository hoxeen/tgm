import {useState, useCallback} from 'react'

export const useAuth = () => {
    const testToken = async (token) => {
        try {
            let method='GET'
            let headers={'Content-Type': 'application/json','x-access-token': token}
            console.log(token)
            const response = await fetch('/api/test/'+localStorage.roles, {method,headers})
            return response;
        } catch (e) {
            console.log(e)
        }
    }

    const dataLocal = () => {
        if(localStorage.length===0) {
            localStorage.setItem('userId', null)
            localStorage.setItem('token', null)
            localStorage.setItem('roles', 'auth')
        } else {
            testToken(localStorage.token).then(values => {
                if(values.status!==200) {
                    localStorage.clear()
                    localStorage.setItem('userId', null)
                    localStorage.setItem('token', null)
                    localStorage.setItem('roles', 'auth')
                }
            })
        }
        return localStorage
    }

    const [dataState, setDateState] = useState(dataLocal)

    const login = useCallback((data) => {
        Object.entries(data).forEach(([k,v]) => {
            localStorage.setItem(k, v)
        });
        const newArray = {...dataState, ...dataLocal};
        setDateState(newArray);
    }, [])

    const logout = useCallback(() => {
        localStorage.clear()
        localStorage.setItem('userId', null)
        localStorage.setItem('token', null)
        localStorage.setItem('roles', 'auth')
        const newArray = {...dataState, ...dataLocal};
        setDateState(newArray);
    }, [])

    return {dataState, login, logout}

}