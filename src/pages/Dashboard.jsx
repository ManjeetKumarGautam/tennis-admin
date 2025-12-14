import { useEffect, useState } from "react";
import axios from "axios";
import {
    Users,
    Activity,
    BarChart2,
    Clock,
    Trophy
} from "lucide-react";
import { motion } from "framer-motion";

/* =============================
   STAT CARD
============================= */
function StatCard({ label, value, Icon }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-white border border-gray-200 hover:shadow-sm flex items-center gap-4"
        >
            <div className="p-3 rounded-lg bg-[#1E2A4A] text-white">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-semibold text-[#1E2A4A]">
                    {value}
                </p>
            </div>
        </motion.div>
    );
}

/* =============================
   MAIN DASHBOARD
============================= */
export default function TennisAdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/dashboard`
                );
                setDashboard(res.data);
            } catch (err) {
                console.error("Dashboard Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-600">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-[#1E2A4A]">
                    Tennis Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                    Live overview of matches & players
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard
                    label="Total Players"
                    value={dashboard.stats.totalPlayers}
                    Icon={Users}
                />
                <StatCard
                    label="Total Matches"
                    value={dashboard.stats.totalMatches}
                    Icon={BarChart2}
                />
                <StatCard
                    label="Live Matches"
                    value={dashboard.stats.liveMatches}
                    Icon={Activity}
                />
                <StatCard
                    label="Today Matches"
                    value={dashboard.stats.todayMatches}
                    Icon={Clock}
                />
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT SIDE */}
                <div className="lg:col-span-2 space-y-6">

                    {/* LIVE MATCHES */}
                    <div className="rounded-xl border border-gray-200  p-5">
                        <h2 className="text-lg font-semibold text-[#d30d2e] mb-4">
                            Live Matches
                        </h2>

                        {dashboard.liveMatches.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No live matches currently
                            </p>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="w-full text-sm text-gray-700">
                                    <thead className="bg-[#1E2A4A] text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-medium">
                                                Match
                                            </th>
                                            <th className="px-6 py-3 text-left font-medium">
                                                Score
                                            </th>
                                            <th className="px-6 py-3 text-left font-medium">
                                                Court
                                            </th>
                                            <th className="px-6 py-3 text-left font-medium">
                                                Time
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dashboard.liveMatches.map((m) => (
                                            <tr
                                                key={m._id}
                                                className="border-b border-gray-200 bg-white last:border-none hover:bg-gray-100 transition"
                                            >
                                                <td className="px-6 py-4 font-medium text-[#1E2A4A]">
                                                    {m.playerA.name} vs {m.playerB.name}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {m.score?.setScore?.playerA ?? 0} :
                                                    {m.score?.setScore?.playerB ?? 0}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {m.matchInfo?.court || "-"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {new Date(m.matchDateTime).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* UPCOMING MATCHES */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h2 className="text-lg font-semibold text-[#1E2A4A] mb-4">
                            Upcoming Matches
                        </h2>

                        {dashboard.upcomingMatches.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No upcoming matches
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {dashboard.upcomingMatches.map((u) => (
                                    <li
                                        key={u._id}
                                        className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                    >
                                        <p className="font-medium text-[#1E2A4A]">
                                            {u.playerA.name} vs {u.playerB.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(u.matchDateTime).toLocaleString()} •{" "}
                                            {u.matchInfo?.tournament}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">

                    {/* TOP PLAYERS */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h2 className="text-lg font-semibold text-[#1E2A4A] mb-4">
                            Top Ranking Players
                        </h2>

                        <ol className="space-y-2">
                            {dashboard.topRankingPlayers.map((p, idx) => (
                                <li
                                    key={p._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-[#1E2A4A]">
                                            #{idx + 1} {p.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {p.country}
                                        </p>
                                    </div>
                                    <Trophy className="text-yellow-500" />
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* RECENT RESULTS */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <h2 className="text-lg font-semibold text-[#1E2A4A] mb-4">
                            Recent Results
                        </h2>

                        <ul className="space-y-2">
                            {dashboard.recentMatchResults.map((r) => (
                                <li
                                    key={r.matchId}
                                    className="p-3 bg-gray-50 rounded-lg"
                                >
                                    <p className="font-medium text-[#1E2A4A]">
                                        {r.winner} def. {r.loser}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {r.setScore?.playerA} : {r.setScore?.playerB}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
