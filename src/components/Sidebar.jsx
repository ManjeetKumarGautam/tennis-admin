import { useState } from "react";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function PremiumSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: FileText, label: "Matches", path: "/matches" },
        { icon: MessageSquare, label: "Live Matches", path: "/live-matches" },
        { icon: User, label: "Players", path: "/player" },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/40 z-40"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 h-full
                    bg-gray-100
                    border-r border-gray-300
                    transition-all duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    ${isMinimized ? "w-20" : "w-64"}
                `}
            >
                <div className="flex flex-col h-full">

                    {/* Logo */}
                    <div className="flex items-center justify-between px-5 h-16 border-b border-gray-300">
                        {!isMinimized && (
                            <span className="text-xl font-semibold text-gray-900">
                                FireScore
                            </span>
                        )}
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {isMinimized ? <ChevronsRight /> : <ChevronsLeft />}
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 px-3 py-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = location.pathname === item.path;

                                return (
                                    <li key={item.label}>
                                        <Link
                                            to={item.path}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg
                                                transition-all duration-200
                                                ${active
                                                    ? "bg-gray-300 text-gray-900"
                                                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                                                }
                                            `}
                                        >
                                            <Icon size={20} />
                                            {!isMinimized && (
                                                <span className="font-medium">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}
