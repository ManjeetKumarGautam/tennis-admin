import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import CreateMatchModal from "../../components/CreateMatchModal";
import { useNavigate } from "react-router-dom";


export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const navigate = useNavigate();

    const fetchMatches = async () => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/matches`
        );
        setMatches(data);
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const deleteMatch = async (id) => {
        if (!window.confirm("Delete this match?")) return;
        await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/api/matches/${id}`
        );
        fetchMatches();
    };

    const filteredMatches = matches.filter((m) => {
        const textMatch =
            m.playerA?.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.playerB?.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.matchInfo?.tournament
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const statusMatch =
            statusFilter === "all" || m.status === statusFilter;

        return textMatch && statusMatch;
    });

    return (
        <div className="min-h-screen bg-gray-50 px-8 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Matches
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage scheduled, live and completed matches
                    </p>
                </div>


            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search player or tournament"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />

                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedMatch(null);
                            setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                    >
                        <FiPlus /> Create Match
                    </button>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                        <option value="all">All Matches</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>


            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-sm text-gray-700">
                    <thead className="bg-[#1E2A4A]  text-white border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">
                                S.No.
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Match
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Tournament
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredMatches.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No matches found
                                </td>
                            </tr>
                        ) : (
                            filteredMatches.map((match, idx) => (
                                <tr
                                    key={match._id}
                                    className="border-b border-gray-200 last:border-none hover:bg-gray-100 transition"

                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {idx + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {match.playerA?.name} vs{" "}
                                        {match.playerB?.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {match.matchInfo?.tournament}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(
                                            match.matchDateTime
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={match.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex gap-3">
                                            {/* <button
                                                onClick={() => {
                                                    setSelectedMatch(match);
                                                    setModalOpen(true);
                                                }}
                                                className="text-gray-500 hover:text-gray-800 hover:cursor-pointer"
                                                title="Edit"
                                            >
                                                <FiEdit />
                                            </button> */}
                                            <button
                                                onClick={() =>
                                                    deleteMatch(match._id)
                                                }
                                                className="text-gray-400 hover:text-red-600 hover:cursor-pointer"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                            <button

                                                onClick={() => navigate(`/matches/${match._id}`)}
                                                className="text-gray-400 hover:text-blue-600 hover:cursor-pointer"
                                                title="View"
                                            >
                                                <FiEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <CreateMatchModal
                open={modalOpen}
                setOpen={setModalOpen}
                match={selectedMatch}
                refresh={fetchMatches}
            />
        </div>
    );
}

/* ---------- Status Badge ---------- */
function StatusBadge({ status }) {
    const base =
        "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize";

    const styles = {
        upcoming: "bg-orange-100 text-orange-700",
        live: "bg-red-100 text-red-700",
        completed: "bg-green-100 text-green-700",
    };

    return (
        <span className={`${base} ${styles[status] || ""}`}>
            {status}
        </span>
    );
}
