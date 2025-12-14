import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayerModal({ open, setOpen, player, refresh }) {
    const [form, setForm] = useState({
        name: "",
        country: "",
        ranking: "",
        age: "",
        wins: "",
        losses: "",
        grandSlams: ""
    });

    useEffect(() => {
        if (player) setForm(player);
        else {
            setForm({
                name: "",
                country: "",
                ranking: "",
                age: "",
                wins: "",
                losses: "",
                grandSlams: ""
            });
        }
    }, [player, open]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (player) {
                await axios.put(`/api/players/${player._id}`, form);
            } else {
                await axios.post("/api/players", form);
            }
            refresh();
            setOpen(false);
        } catch (err) {
            console.error(err);
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
                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <FiX size={22} />
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {player ? "Edit Player" : "Add New Player"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Enter player details below
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
                            <Input label="Country" name="country" value={form.country} onChange={handleChange} />
                            <Input label="Ranking" type="number" name="ranking" value={form.ranking} onChange={handleChange} />
                            <Input label="Age" type="number" name="age" value={form.age} onChange={handleChange} />
                            <Input label="Wins" type="number" name="wins" value={form.wins} onChange={handleChange} />
                            <Input label="Losses" type="number" name="losses" value={form.losses} onChange={handleChange} />
                            <Input label="Grand Slams" type="number" name="grandSlams" value={form.grandSlams} onChange={handleChange} />

                            {/* Actions */}
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow"
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

/* Reusable Input Component */
function Input({ label, ...props }) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
                {label}
            </label>
            <input
                {...props}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );
}
