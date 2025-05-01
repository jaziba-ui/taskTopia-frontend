import AuthForm from "../components/AuthForm";
import axiosInstance from "../utils/axiosInstance"; 
import { useAuth } from "../context/AuthContext";

console.log(AuthForm)
export default function RegisterPage() {
  const { login } = useAuth();

  const handleRegister = async (data) => {
    try {
      await axiosInstance.post("/auth/register", data); // Use axiosInstance here
      const res = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      login(res.data.user, res.data.token);
    } catch (err) {
      alert(err?.response?.data?.msg || "Registration failed");
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
