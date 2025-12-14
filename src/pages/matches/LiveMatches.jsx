import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LiveMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLiveMatches = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/matches/live`
            );
            setMatches(res.data);
        } catch (error) {
            console.error("Failed to fetch live matches", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveMatches();
        const interval = setInterval(fetchLiveMatches, 10000); // auto refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading live matches...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <h1 className="text-2xl font-bold">Live Matches</h1>
            </div>

            {matches.length === 0 ? (
                <div className="text-center bg-white rounded-xl p-10 shadow">
                    <p className="text-gray-500">No live matches right now</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {matches.map((match) => (
                        <Link to={`/matches/${match._id}/scoreboard`}
                            key={match._id}
                            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 border-l-4 border-red-500"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {match.playerA.name} vs {match.playerB.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {match.matchInfo.tournament} • {match.matchInfo.round}
                                    </p>
                                </div>
                                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
                                    LIVE
                                </span>
                            </div>

                            {/* Court Info */}
                            <div className="text-sm text-gray-600 mb-4">
                                {match.matchInfo.surface} • {match.matchInfo.court}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 text-xs text-gray-500">
                                Umpire: {match.matchInfo.umpire}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

