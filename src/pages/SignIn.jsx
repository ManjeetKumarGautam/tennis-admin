import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
                form
            );

            // save auth data
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // redirect
            navigate("/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

                <h1 className="text-2xl font-semibold text-[#1E2A4A] mb-1">
                    Sign In
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    Welcome back, please login
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1E2A4A] hover:bg-[#162038] text-white py-2 rounded-lg font-medium"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-[#1E2A4A] font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
