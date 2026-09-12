import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { logActivity } from "../lib/LogActivity";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function AdminTeamForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    photo_url: "",
    name_en: "",
    name_ar: "",
    role_en: "",
    role_ar: "",
    bio_en: "",
    bio_ar: "",
    published: true,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setPhotoPreview(URL.createObjectURL(file));

    const fileName = `team-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);

    if (uploadError) {
      alert("Photo upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    setForm((prev) => ({ ...prev, photo_url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("team_members").insert([form]);

    setSaving(false);

    if (error) {
      alert("Failed to save: " + error.message);
      return;
    }

    await logActivity("created", "team", form.name_en, form.name_ar);

    navigate(`/${ADMIN_PATH}/team`);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Add Team Member</h1>
        <button
          onClick={() => navigate(`/${ADMIN_PATH}/team`)}
          className="text-sm text-stone-300 hover:text-gold"
        >
          ← Back to team
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto px-6 py-10 space-y-6"
      >
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Photo
          </label>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          )}
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {uploading && (
            <p className="text-sm text-zinc-500 mt-1">Uploading...</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Name (English)
            </label>
            <input
              type="text"
              required
              value={form.name_en}
              onChange={(e) => handleChange("name_en", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Name (Arabic)
            </label>
            <input
              type="text"
              required
              dir="rtl"
              value={form.name_ar}
              onChange={(e) => handleChange("name_ar", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Role (English)
            </label>
            <input
              type="text"
              required
              value={form.role_en}
              onChange={(e) => handleChange("role_en", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Role (Arabic)
            </label>
            <input
              type="text"
              required
              dir="rtl"
              value={form.role_ar}
              onChange={(e) => handleChange("role_ar", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Bio (English)
            </label>
            <textarea
              rows="3"
              value={form.bio_en}
              onChange={(e) => handleChange("bio_en", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Bio (Arabic)
            </label>
            <textarea
              rows="3"
              dir="rtl"
              value={form.bio_ar}
              onChange={(e) => handleChange("bio_ar", e.target.value)}
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
          disabled={saving || uploading}
          className="bg-gold hover:opacity-90 text-charcoal font-semibold px-6 py-3 rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Team Member"}
        </button>
      </form>
    </div>
  );
}
