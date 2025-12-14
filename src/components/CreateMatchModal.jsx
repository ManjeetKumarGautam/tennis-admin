import { useEffect, useState } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";

export default function CreateMatchModal({ open, setOpen, refresh }) {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        playerA: "",
        playerB: "",
        status: "upcoming",
        matchDateTime: "",
        matchInfo: {
            tournament: "World Tour Finals",
            round: "Semi-Final",
            surface: "Hard (Indoor)",
            court: "Center Court",
            umpire: "Mohamed Lahyani",
        },
        statistics: {
            aces: { playerA: 0, playerB: 0 },
            doubleFaults: { playerA: 0, playerB: 0 },
            firstServePercentage: { playerA: 0, playerB: 0 },
            winOnFirstServe: { playerA: 0, playerB: 0 },
            winners: { playerA: 0, playerB: 0 },
            unforcedErrors: { playerA: 0, playerB: 0 },
            breakPointsSaved: { playerA: 0, playerB: 0 },
        },
    });

    useEffect(() => {
        if (!open) return;
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/api/players`)
            .then((res) => setPlayers(res.data))
            .catch(console.error);
    }, [open]);

    const updateStat = (key, side, value) => {
        setForm((prev) => ({
            ...prev,
            statistics: {
                ...prev.statistics,
                [key]: {
                    ...prev.statistics[key],
                    [side]: Number(value),
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.playerA || !form.playerB || form.playerA === form.playerB) {
            return alert("Please select two different players");
        }

        try {
            setLoading(true);
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/matches`,
                form
            );
            refresh?.();
            setOpen(false);
        } catch (err) {
            alert("Failed to create match");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white w-full max-w-5xl rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Create Match
                        </h2>
                        <p className="text-sm text-gray-500">
                            Configure match details and statistics
                        </p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-gray-700"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="max-h-[80vh] overflow-y-auto px-6 py-5 space-y-8"
                >
                    {/* Players */}
                    <Section title="Players">
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                value={form.playerA}
                                onChange={(e) =>
                                    setForm({ ...form, playerA: e.target.value })
                                }
                            >
                                <option value="">Select Player A</option>
                                {players.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                value={form.playerB}
                                onChange={(e) =>
                                    setForm({ ...form, playerB: e.target.value })
                                }
                            >
                                <option value="">Select Player B</option>
                                {players.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </Section>

                    {/* Schedule */}
                    <Section title="Schedule">
                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                type="date"
                                label="Match Date"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        matchDateTime: `${e.target.value}T${form.matchDateTime.split("T")[1] ||
                                            "00:00"
                                            }`,
                                    })
                                }
                            />
                            <Input
                                type="time"
                                label="Match Time"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        matchDateTime: `${form.matchDateTime.split("T")[0] ||
                                            ""
                                            }T${e.target.value}`,
                                    })
                                }
                            />
                            <Select
                                label="Status"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="upcoming">Scheduled</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                            </Select>
                        </div>
                    </Section>

                    {/* Match Info */}
                    <Section title="Match Information">
                        <div className="grid grid-cols-3 gap-4">
                            <Select
                                value={form.matchInfo.tournament}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        matchInfo: {
                                            ...form.matchInfo,
                                            tournament: e.target.value,
                                        },
                                    })
                                }
                            >
                                <option>World Tour Finals</option>
                                <option>Australian Open</option>
                                <option>French Open</option>
                                <option>Wimbledon</option>
                                <option>US Open</option>
                            </Select>

                            <Select
                                value={form.matchInfo.round}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        matchInfo: {
                                            ...form.matchInfo,
                                            round: e.target.value,
                                        },
                                    })
                                }
                            >
                                <option>Final</option>
                                <option>Semi-Final</option>
                                <option>Quarter-Final</option>
                                <option>Round of 16</option>
                            </Select>

                            <Select
                                value={form.matchInfo.surface}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        matchInfo: {
                                            ...form.matchInfo,
                                            surface: e.target.value,
                                        },
                                    })
                                }
                            >
                                <option>Hard</option>
                                <option>Hard (Indoor)</option>
                                <option>Clay</option>
                                <option>Grass</option>
                            </Select>

                            <Select
                                value={form.matchInfo.court}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        matchInfo: {
                                            ...form.matchInfo,
                                            court: e.target.value,
                                        },
                                    })
                                }
                            >
                                <option>Center Court</option>
                                <option>Court 1</option>
                                <option>Court 2</option>
                            </Select>

                            <Select
                                value={form.matchInfo.umpire}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        matchInfo: {
                                            ...form.matchInfo,
                                            umpire: e.target.value,
                                        },
                                    })
                                }
                            >
                                <option>Mohamed Lahyani</option>
                                <option>Carlos Ramos</option>
                                <option>Eva Asderaki</option>
                                <option>James Keothavong</option>
                            </Select>
                        </div>
                    </Section>

                    {/* Statistics */}
                    <Section title="Statistics">
                        <div className="space-y-3">
                            {Object.keys(form.statistics).map((key) => (
                                <div
                                    key={key}
                                    className="grid grid-cols-3 gap-4 items-center"
                                >
                                    <span className="text-sm text-gray-600 capitalize">
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="Player A"
                                        onChange={(e) =>
                                            updateStat(
                                                key,
                                                "playerA",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Player B"
                                        onChange={(e) =>
                                            updateStat(
                                                key,
                                                "playerB",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            className="px-5 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                        >
                            {loading ? "Creating..." : "Create Match"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ---------- Small Components ---------- */

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {title}
            </h3>
            {children}
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-xs text-gray-500">{label}</label>
            )}
            <input
                {...props}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
        </div>
    );
}

function Select({ label, children, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-xs text-gray-500">{label}</label>
            )}
            <select
                {...props}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
                {children}
            </select>
        </div>
    );
}
