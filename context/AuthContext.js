import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const router = useRouter()

    const login = (userData, token) => {
        localStorage.setItem("token", token)
        setUser(userData)
        router.push("/dashboard")
    } 

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        router.push("/login")
    }

    return(
        <AuthContext.Provider value = {{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext)