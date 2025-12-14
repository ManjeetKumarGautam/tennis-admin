import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { getCountryCode } from "../../utils/utils";

const POINT_MAP = [0, 15, 30, 40];

export default function ScoreBoard() {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    const socketRef = useRef(null);


    // -----------------------------
    // INITIAL DATA LOAD
    // -----------------------------
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


    // -----------------------------
    // SOCKET SETUP
    // -----------------------------
    useEffect(() => {
        fetchMatch(); // initial load

        socketRef.current = io(import.meta.env.VITE_BASE_URL, {
            transports: ["websocket"]
        });

        socketRef.current.emit("joinMatch", matchId);

        socketRef.current.on("scoreUpdated", (updatedScore) => {
            setMatch(prev => ({
                ...prev,
                score: updatedScore
            }));
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [matchId]);

    // -----------------------------
    // ADD POINT (ADMIN)
    // -----------------------------
    const addPoint = async (player, eventType = "point") => {
        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/scores/${matchId}/point`,
                { player, eventType }
            );
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        }
    };

    if (loading || !match) {
        return <div className="p-10 text-center">Loading scoreboard...</div>;
    }

    const displayPoint = (side) => {
        if (match.score?.advantage === side) return "AD";
        const p = match.score?.points?.[side] ?? 0;
        return POINT_MAP[p] ?? "40";
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        {match.playerA.name} vs {match.playerB.name}
                    </h1>
                    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full font-semibold">
                        LIVE
                    </span>
                </div>
                <p className="text-gray-500 mt-1">
                    {match.matchInfo.tournament} • {match.matchInfo.round}
                </p>
            </div>

            {/* PLAYERS */}
            <div className="grid grid-cols-2 gap-6">
                <PlayerCard
                    player={match.playerA}
                    isWinner={match.status === "completed" && match.winner === "playerA"}
                    isServing={match.score?.server === "playerA"}
                />

                <PlayerCard
                    player={match.playerB}
                    isWinner={match.status === "completed" && match.winner === "playerB"}
                    isServing={match.score?.server === "playerB"}
                />

            </div>

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

            {/* SCORE */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="font-semibold mb-4 text-center text-lg">
                    Current Score
                </h2>

                <div className="grid grid-cols-3 text-center text-xl font-bold mb-4">
                    <span>{displayPoint("playerA")}</span>
                    <span className="text-gray-500">Points</span>
                    <span>{displayPoint("playerB")}</span>
                </div>

                {match.score?.sets?.map((set, idx) => (
                    <div key={idx} className="grid grid-cols-3 text-center py-1">
                        <span>{set.games.playerA}</span>
                        <span className="text-gray-500">Set {idx + 1}</span>
                        <span>{set.games.playerB}</span>
                    </div>
                ))}

                <div className="flex justify-center gap-6 mt-6">
                    <button
                        onClick={() => addPoint("A")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        + Point {match.playerA.name}
                    </button>

                    <button
                        onClick={() => addPoint("B")}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                        + Point {match.playerB.name}
                    </button>
                </div>
            </div>


        </div>
    );
}


import { Trophy, Flag } from "lucide-react";
import FlagIcon from "../../components/FlagIcon";

export function PlayerCard({ player, isWinner = false, isServing = false }) {
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
                            {isWinner && <Trophy className="w-5 h-5 text-yellow-500" />}

                            {/* 🎾 SERVE ICON */}
                            {isServing && <span className="ml-2 text-green-600">🎾</span>}
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
