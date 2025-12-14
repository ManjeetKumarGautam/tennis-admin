import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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
                `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
                form
            );

            // save token
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // redirect to dashboard
            navigate("/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.message || "Signup failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

                <h1 className="text-2xl font-semibold text-[#1E2A4A] mb-1">
                    Create Account
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    Register to access the dashboard
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 px-4 py-2 rounded-lg border"
                        />
                    </div>

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
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-[#1E2A4A] font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
