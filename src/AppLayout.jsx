import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col bg-gray-50">
                <Navbar />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
