import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function AdminProjectForm() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [coverPreview, setCoverPreview] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const [form, setForm] = useState({
        category: "residential",
        cover_image_url: "",
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
        project_date: "",
        work_en: "",
        work_ar: "",
        budget: "",
        location_en: "",
        location_ar: "",
        client_en: "",
        client_ar: "",
        published: true,
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingCover(true);
        setCoverPreview(URL.createObjectURL(file));

        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, file);

        if (uploadError) {
            alert("Cover image upload failed: " + uploadError.message);
            setUploadingCover(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(fileName);

        setForm((prev) => ({ ...prev, cover_image_url: urlData.publicUrl }));
        setUploadingCover(false);
    };

    const handleGallerySelect = (e) => {
        const files = Array.from(e.target.files);
        setGalleryFiles(files);
        setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.cover_image_url) {
            alert("Please upload a cover image before saving.");
            return;
        }

        setSaving(true);

        // 1. Insert the project itself, and get back its new id
        const { data: insertedProject, error } = await supabase
            .from("projects")
            .insert([form])
            .select()
            .single();

        if (error) {
            alert("Failed to save project: " + error.message);
            setSaving(false);
            return;
        }

        // 2. Upload each gallery image and link it to this project
        for (const file of galleryFiles) {
            const fileName = `${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("project-images")
                .upload(fileName, file);

            if (uploadError) {
                console.error("Gallery upload failed:", uploadError.message);
                continue;
            }

            const { data: urlData } = supabase.storage
                .from("project-images")
                .getPublicUrl(fileName);

            await supabase.from("project_media").insert([
                {
                    project_id: insertedProject.id,
                    image_url: urlData.publicUrl,
                    media_type: "gallery",
                },
            ]);
        }

        setSaving(false);
        navigate(`/${ADMIN_PATH}/projects`);
    };

    return (
        <div className="min-h-screen bg-cream">
            <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
                <h1 className="text-lg font-bold">Add Project</h1>
                <button
                    onClick={() => navigate(`/${ADMIN_PATH}/projects`)}
                    className="text-sm text-stone-300 hover:text-gold"
                >
                    ← Back to projects
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-10 space-y-8">
                {/* Cover image */}
                <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                        Cover Image
                    </label>
                    {coverPreview && (
                        <img
                            src={coverPreview}
                            alt="Cover preview"
                            className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                    )}
                    <input type="file" accept="image/*" onChange={handleCoverUpload} />
                    {uploadingCover && <p className="text-sm text-zinc-500 mt-1">Uploading...</p>}
                </div>

                {/* Gallery images */}
                <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                        Gallery Photos (proof of work — multiple allowed)
                    </label>
                    {galleryPreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {galleryPreviews.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`Gallery preview ${i + 1}`}
                                    className="w-full h-24 object-cover rounded-md"
                                />
                            ))}
                        </div>
                    )}
                    <input type="file" accept="image/*" multiple onChange={handleGallerySelect} />
                </div>



                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                        Category
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2"
                    >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="renovation">Renovation</option>
                    </select>
                </div>

                {/* Title EN/AR */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Title (English)
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title_en}
                            onChange={(e) => handleChange("title_en", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Title (Arabic)
                        </label>
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

                {/* Description EN/AR */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Description (English)
                        </label>
                        <textarea
                            required
                            rows="4"
                            value={form.description_en}
                            onChange={(e) => handleChange("description_en", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Description (Arabic)
                        </label>
                        <textarea
                            required
                            rows="4"
                            dir="rtl"
                            value={form.description_ar}
                            onChange={(e) => handleChange("description_ar", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                </div>

                {/* Date, Budget */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={form.project_date}
                            onChange={(e) => handleChange("project_date", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Budget
                        </label>
                        <input
                            type="text"
                            placeholder="$180,000"
                            value={form.budget}
                            onChange={(e) => handleChange("budget", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                </div>

                {/* Work type EN/AR */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Work Type (English)
                        </label>
                        <input
                            type="text"
                            placeholder="Design & Build"
                            value={form.work_en}
                            onChange={(e) => handleChange("work_en", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Work Type (Arabic)
                        </label>
                        <input
                            type="text"
                            dir="rtl"
                            value={form.work_ar}
                            onChange={(e) => handleChange("work_ar", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                </div>

                {/* Location EN/AR */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Location (English)
                        </label>
                        <input
                            type="text"
                            value={form.location_en}
                            onChange={(e) => handleChange("location_en", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Location (Arabic)
                        </label>
                        <input
                            type="text"
                            dir="rtl"
                            value={form.location_ar}
                            onChange={(e) => handleChange("location_ar", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                </div>

                {/* Client EN/AR */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Client (English)
                        </label>
                        <input
                            type="text"
                            value={form.client_en}
                            onChange={(e) => handleChange("client_en", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                            Client (Arabic)
                        </label>
                        <input
                            type="text"
                            dir="rtl"
                            value={form.client_ar}
                            onChange={(e) => handleChange("client_ar", e.target.value)}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                        />
                    </div>
                </div>

                {/* Published toggle */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="published"
                        checked={form.published}
                        onChange={(e) => handleChange("published", e.target.checked)}
                    />
                    <label htmlFor="published" className="text-sm text-charcoal">
                        Publish immediately (visible on the live site)
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={saving || uploadingCover}
                    className="bg-gold hover:opacity-90 text-charcoal font-semibold px-6 py-3 rounded-md disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Project"}
                </button>
            </form>
        </div>
    );
}