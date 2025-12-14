import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import axios from "axios";
import PlayerModal from "../../components/PlayerModal";
import FlagIcon from "../../components/FlagIcon";
import { getCountryCode } from "../../utils/utils";

export default function PlayerManagement() {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);

    const fetchPlayers = async () => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/players`
        );
        setPlayers(data);
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const deletePlayer = async (id) => {
        if (!window.confirm("Delete this player?")) return;
        await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/api/players/${id}`
        );
        fetchPlayers();
    };

    const sortByRanking = () => {
        const sorted = [...players].sort((a, b) =>
            sortAsc ? a.ranking - b.ranking : b.ranking - a.ranking
        );
        setPlayers(sorted);
        setSortAsc(!sortAsc);
    };

    const filteredPlayers = players.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen  px-8 py-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Players
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage professional tennis players
                    </p>
                </div>


            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />

                <div className="flex gap-2">

                    <button
                        onClick={() => {
                            setSelectedPlayer(null);
                            setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
                    >
                        <FiPlus /> Add Player
                    </button>
                    <button
                        onClick={sortByRanking}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
                    >
                        Sort by ranking {sortAsc ? "↑" : "↓"}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-sm text-gray-700">
                    <thead className="border-b border-gray-200 bg-[#1E2A4A]  text-white">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium">
                                S.No.
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Country
                            </th>
                            <th
                                onClick={sortByRanking}
                                className="px-6 py-3 text-left font-medium cursor-pointer"
                            >
                                Ranking
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Age
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                W / L
                            </th>
                            <th className="px-6 py-3 text-left font-medium">
                                Slams
                            </th>
                            <th className="px-6 py-3 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPlayers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No players found
                                </td>
                            </tr>
                        ) : (
                            filteredPlayers.map((player, idx) => (
                                <tr
                                    key={player._id}
                                    className="border-b border-gray-200 last:border-none hover:bg-gray-100 transition"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {idx + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {player.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <FlagIcon
                                            code={getCountryCode(player?.country_code)}
                                            className="w-16 h-10"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {player.ranking}
                                    </td>
                                    <td className="px-6 py-4">
                                        {player.age}
                                    </td>
                                    <td className="px-6 py-4">
                                        {player.wins} / {player.losses}
                                    </td>
                                    <td className="px-6 py-4">
                                        {player.grandSlams}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="inline-flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedPlayer(player);
                                                    setModalOpen(true);
                                                }}
                                                className="text-gray-500 hover:text-gray-800 transition"
                                                title="Edit"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deletePlayer(player._id)
                                                }
                                                className="text-gray-400 hover:text-red-600 transition"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
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
            <PlayerModal
                open={modalOpen}
                setOpen={setModalOpen}
                player={selectedPlayer}
                refresh={fetchPlayers}
            />
        </div>
    );
}
