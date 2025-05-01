import { useState } from "react";

const AuthForm = ({ type, onSubmit }) => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 shadow-lg rounded-2xl bg-[#DFD3C3]">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#85586F]">
                {type === "login" ? "Login" : "Register"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {type === "register" && (
                    <input
                        className="w-full p-3 border rounded-lg bg-[#F8EDE3] text-[#85586F] placeholder-[#85586F] focus:outline-none focus:ring-2 focus:ring-[#D0B8A8]"
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        required
                    />
                )}
                <input
                    className="w-full p-3 border rounded-lg bg-[#F8EDE3] text-[#85586F] placeholder-[#85586F] focus:outline-none focus:ring-2 focus:ring-[#D0B8A8]"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-3 border rounded-lg bg-[#F8EDE3] text-[#85586F] placeholder-[#85586F] focus:outline-none focus:ring-2 focus:ring-[#D0B8A8]"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#85586F] text-white font-semibold hover:bg-[#6f445c] transition"
                >
                    {type === "login" ? "Login" : "Register"}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;


// {type === "login" ? "Welcome Back!" : "Join Us 💖"}
