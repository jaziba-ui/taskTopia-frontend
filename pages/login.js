import AuthForm from "../components/AuthForm";
import axiosInstance from "../utils/axiosInstance"; 
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth()

    const handleLogin = async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data)
            login(res.data.user, res.data.token)
        } catch (error) {
            alert(error?.response?.data?.msg || "Login failed")
        }
    }

    return <AuthForm type="login" onSubmit={handleLogin}/>
}