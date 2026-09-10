import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { serviceIcons, serviceIconNames } from "../lib/servicesIcons";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function AdminServiceForm() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        icon_name: serviceIconNames[0],
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        published: true,
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase.from("services").insert([form]);

        setSaving(false);

        if (error) {
            alert("Failed to save: " + error.message);
            return;
        }

        navigate(`/${ADMIN_PATH}/services`);
    };

    return (
        <div className="min-h-screen bg-cream">
            <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-bold">Add Service</h1>
                <button
                    onClick={() => navigate(`/${ADMIN_PATH}/services`)}
                    className="text-sm text-stone-300 hover:text-gold"
                >
                    ← Back to services
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Icon</label>
                    <div className="grid grid-cols-6 gap-3">
                        {serviceIconNames.map((name) => {
                            const Icon = serviceIcons[name];
                            const isSelected = form.icon_name === name;
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => handleChange("icon_name", name)}
                                    aria-label={name}
                                    className={`aspect-square rounded-md border-2 flex items-center justify-center transition-colors ${isSelected
                                        ? "border-gold bg-gold/10"
                                        : "border-zinc-200 hover:border-zinc-300"
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 ${isSelected ? "text-gold" : "text-zinc-500"}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">Title (English)</label>
                        <input
                            type="text"
                            required
                            value={form.title_en}
                            onChange={(e) => handleChange("title_en", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">Title (Arabic)</label>
                        <input
                            type="text"
                            required
                            dir="rtl"
                            value={form.title_ar}
                            onChange={(e) => handleChange("title_ar", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">Description (English)</label>
                        <textarea
                            required
                            rows="3"
                            value={form.description_en}
                            onChange={(e) => handleChange("description_en", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">Description (Arabic)</label>
                        <textarea
                            required
                            rows="3"
                            dir="rtl"
                            value={form.description_ar}
                            onChange={(e) => handleChange("description_ar", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="published"
                        checked={form.published}
                        onChange={(e) => handleChange("published", e.target.checked)}
                    />
                    <label htmlFor="published" className="text-sm text-charcoal">
                        Publish immediately
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-gold hover:opacity-90 text-charcoal font-semibold px-6 py-3 rounded-md disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Service"}
                </button>
            </form>
        </div>
    );
}