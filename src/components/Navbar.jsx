import { useState, useEffect, useRef } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return (
        <nav className="w-full h-16 bg-white shadow-md flex items-center justify-between px-6 z-50">
            <div></div>

            {/* Profile */}
            <div className="relative " ref={dropdownRef}>
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 p-2  rounded-full hover:cursor-pointer transition"
                >
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl py-2 border border-gray-200 animate-dropdown">

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-red-600 font-medium"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
