import {useState, useCallback} from 'react'

export const useHttp = () => {
    const [loading,setLoading]=useState(false)
    const [error,setNotification]=useState(false)

    const request = useCallback(async (url, init) => {
            setLoading(true)
            const response = await fetch(url, init)
            const data = await response.json()
            setLoading(false)
            setNotification(data.message)
            return data;
    }, [])
    const clearError = () => setNotification(null)
    return {loading, request, error, clearError}
}