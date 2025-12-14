import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Trophy, Flag } from "lucide-react";
import FlagIcon from "../components/FlagIcon";
import { getCountryCode } from "../utils/utils";

export default function MatchDetails() {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMatch = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/matches/${matchId}`
            );
            setMatch(res.data);
        } catch (err) {
            console.error("Failed to fetch match", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatch();
    }, [matchId]);

    if (loading) {
        return <div className="p-10 text-center">Loading match details...</div>;
    }

    if (!match) {
        return <div className="p-10 text-center">Match not found</div>;
    }

    const statusColor = {
        upcoming: "bg-gray-100 text-gray-600",
        live: "bg-red-100 text-red-600",
        completed: "bg-green-100 text-green-600"
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        {match.playerA.name} vs {match.playerB.name}
                    </h1>
                    <span
                        className={`px-4 py-1 rounded-full font-semibold text-sm ${statusColor[match.status]}`}
                    >
                        {match.status.toUpperCase()}
                    </span>
                </div>

                <p className="text-gray-500 mt-1">
                    {match.matchInfo.tournament} • {match.matchInfo.round}
                </p>
            </div>

            {/* PLAYERS */}
            <div className="grid grid-cols-2 gap-6">
                <PlayerCard player={match.playerA} isWinner={match.status === "completed" && match.winner === "playerA"} />
                <PlayerCard player={match.playerB} isWinner={match.status === "completed" && match.winner === "playerB"} />
            </div>

            {/* SET SCORES (IF AVAILABLE) */}
            {match.score?.sets?.length > 0 && (
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold mb-4 text-center text-lg">
                        Set Scores
                    </h2>

                    {match.score.sets.map((set, idx) => (
                        <div key={idx} className="grid grid-cols-3 text-center py-1">
                            <span>{set.games.playerA}</span>
                            <span className="text-gray-500">Set {idx + 1}</span>
                            <span>{set.games.playerB}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* WINNER */}
            {match.status === "completed" && match.winner && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center font-semibold">
                    🏆 Winner:
                    {" "}
                    {match.winner === "playerA"
                        ? match.playerA.name
                        : match.playerB.name}
                </div>
            )}


            {/* LIVE SCORE LINK */}
            {
                match.status === "live" && (
                    <div className="text-center">
                        <Link
                            to={`/matches/${match._id}/scoreboard`}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                        >
                            View Live Scoreboard
                        </Link>
                    </div>
                )
            }
        </div >
    );
}


export function PlayerCard({ player, isWinner = false }) {
    return (
        <div
            className={`rounded-2xl p-5 transition-all
            ${isWinner
                    ? "bg-green-50 border-2 border-green-500 shadow-lg"
                    : "bg-gray-50 border border-gray-200"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <FlagIcon
                        code={getCountryCode(player?.country_code)}
                        className="w-16 h-10"
                    />

                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            {player.name}

                            {/* 🏆 WINNER ICON */}
                            {isWinner && (
                                <Trophy className="w-5 h-5 text-yellow-500" />
                            )}
                        </h3>

                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Flag className="w-3 h-3" />
                            {player.country}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500">Rank</p>
                    <p className="text-xl font-bold">#{player.ranking}</p>
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-3 text-center">
                <Info label="Age" value={player.age} />
                <Info label="Wins" value={player.wins} />
                <Info label="Losses" value={player.losses} />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                <span>Hand: {player.hand || "Right"}</span>
                <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    {player.grandSlams || 0}
                </span>
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="bg-white rounded-xl py-2 shadow-sm">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
}


