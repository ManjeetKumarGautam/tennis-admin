import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PlayerModal({ open, setOpen, player, refresh }) {
    const [form, setForm] = useState({
        name: "",
        country_code: "",
        ranking: "",
        age: "",
        wins: "",
        losses: "",
        grandSlams: ""
    });

    // -----------------------------
    // LOAD PLAYER DATA
    // -----------------------------
    useEffect(() => {
        if (player) {
            setForm({
                name: player.name ?? "",
                country_code: player.country_code ?? "",
                ranking: player.ranking ?? "",
                age: player.age ?? "",
                wins: player.wins ?? "",
                losses: player.losses ?? "",
                grandSlams: player.grandSlams ?? ""
            });
        } else {
            setForm({
                name: "",
                country_code: "",
                ranking: "",
                age: "",
                wins: "",
                losses: "",
                grandSlams: ""
            });
        }
    }, [player, open]);

    // -----------------------------
    // HANDLE CHANGE
    // -----------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // -----------------------------
    // SUBMIT
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: form.name,
                country_code: form.country_code.toUpperCase(),
                ranking: Number(form.ranking),
                age: Number(form.age),
                wins: Number(form.wins),
                losses: Number(form.losses),
                grandSlams: Number(form.grandSlams)
            };

            if (player) {
                await axios.put(
                    `${BASE_URL}/api/players/${player._id}`,
                    payload
                );
            } else {
                await axios.post(
                    `${BASE_URL}/api/players`,
                    payload
                );
            }

            refresh();
            setOpen(false);
        } catch (err) {
            console.error("Player save failed", err);
            alert(err.response?.data?.message || "Failed to save player");
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative"
                    >
                        {/* Close */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={22} />
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                {player ? "Edit Player" : "Add New Player"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Enter player details
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />

                            <Input
                                label="Country Code"
                                name="country_code"
                                value={form.country_code}
                                onChange={handleChange}
                                placeholder="IN, US"
                                required
                            />

                            <Input label="Ranking" type="number" name="ranking" value={form.ranking} onChange={handleChange} />
                            <Input label="Age" type="number" name="age" value={form.age} onChange={handleChange} />
                            <Input label="Wins" type="number" name="wins" value={form.wins} onChange={handleChange} />
                            <Input label="Losses" type="number" name="losses" value={form.losses} onChange={handleChange} />
                            <Input label="Grand Slams" type="number" name="grandSlams" value={form.grandSlams} onChange={handleChange} />

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-5 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white"
                                >
                                    {player ? "Update Player" : "Add Player"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* -----------------------------
   Input Component
----------------------------- */
function Input({ label, ...props }) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">{label}</label>
            <input
                {...props}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}
