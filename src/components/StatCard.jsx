import { Users, Trophy, Activity, Calendar, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function StatCard({ label, value, Icon, live }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between"
        >
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                {live && (
                    <span className="inline-flex items-center gap-2 text-sm text-red-500 mt-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Live Now
                    </span>
                )}
            </div>
            <div className="p-3 rounded-xl bg-gray-100">
                <Icon className="w-6 h-6" />
            </div>
        </motion.div>
    );
}