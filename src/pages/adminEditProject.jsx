import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { logActivity } from "../lib/LogActivity";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function AdminEditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
  const [existingStages, setExistingStages] = useState([]);
  const [newStages, setNewStages] = useState([]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    const { data: projectData } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    const { data: mediaData } = await supabase
      .from("project_media")
      .select("*")
      .eq("project_id", id)
      .order("sort_order", { ascending: true });

    setForm(projectData);
    setExistingGallery(
      (mediaData || []).filter((m) => m.media_type === "gallery"),
    );
    setExistingStages(
      (mediaData || []).filter((m) => m.media_type === "stage"),
    );
    setLoading(false);
  };
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewGallerySelect = (e) => {
    const files = Array.from(e.target.files);
    setNewGalleryFiles(files);
    setNewGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleDeleteExistingPhoto = async (mediaId) => {
    if (!confirm("Remove this photo?")) return;
    await supabase.from("project_media").delete().eq("id", mediaId);
    setExistingGallery(existingGallery.filter((m) => m.id !== mediaId));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Remove fields that shouldn't be part of the update payload
    const { id: _id, created_at, ...updateData } = form;

    const { error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id);

    if (error) {
      alert("Failed to update: " + error.message);
      setSaving(false);
      return;
    }

    await logActivity("updated", "project", form.title_en, form.title_ar);

    const startIndex = existingGallery.length;
    for (let i = 0; i < newGalleryFiles.length; i++) {
      const file = newGalleryFiles[i];
      const fileName = `${Date.now()}-${i}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, file);

      if (uploadError) continue;

      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      await supabase.from("project_media").insert([
        {
          project_id: id,
          image_url: urlData.publicUrl,
          media_type: "gallery",
          sort_order: startIndex + i,
        },
      ]);
    }
    // Upload new timeline stages
    const stageStartIndex = existingStages.length;
    for (let i = 0; i < newStages.length; i++) {
      const stage = newStages[i];
      if (!stage.file) continue;

      const fileName = `${Date.now()}-stage-${i}-${stage.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, stage.file);

      if (uploadError) continue;

      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      await supabase.from("project_media").insert([
        {
          project_id: id,
          image_url: urlData.publicUrl,
          media_type: "stage",
          stage_date: stage.stage_date,
          stage_title_en: stage.stage_title_en,
          stage_title_ar: stage.stage_title_ar,
          sort_order: stageStartIndex + i,
        },
      ]);
    }

    setSaving(false);
    navigate(`/${ADMIN_PATH}/projects`);
  };
  const addStageRow = () => {
    setNewStages([
      ...newStages,
      {
        file: null,
        preview: null,
        stage_date: "",
        stage_title_en: "",
        stage_title_ar: "",
      },
    ]);
  };

  const updateStageField = (index, field, value) => {
    const updated = [...newStages];
    updated[index][field] = value;
    setNewStages(updated);
  };

  const updateStagePhoto = (index, file) => {
    const updated = [...newStages];
    updated[index].file = file;
    updated[index].preview = URL.createObjectURL(file);
    setNewStages(updated);
  };

  const removeStageRow = (index) => {
    setNewStages(newStages.filter((_, i) => i !== index));
  };

  const handleDeleteExistingStage = async (mediaId) => {
    if (!confirm("Remove this timeline stage?")) return;
    await supabase.from("project_media").delete().eq("id", mediaId);
    setExistingStages(existingStages.filter((m) => m.id !== mediaId));
  };

  if (loading || !form) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Edit Project</h1>
        <button
          onClick={() => navigate(`/${ADMIN_PATH}/projects`)}
          className="text-sm text-stone-300 hover:text-gold"
        >
          ← Back to projects
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="max-w-3xl mx-auto px-6 py-10 space-y-8"
      >
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Title (English)
          </label>
          <input
            type="text"
            value={form.title_en || ""}
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
            dir="rtl"
            value={form.title_ar || ""}
            onChange={(e) => handleChange("title_ar", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Description (English)
          </label>
          <textarea
            rows="4"
            value={form.description_en || ""}
            onChange={(e) => handleChange("description_en", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>

        {/* Existing gallery photos, with delete option */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Current Gallery Photos
          </label>
          {existingGallery.length === 0 ? (
            <p className="text-sm text-zinc-500 mb-3">No gallery photos yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {existingGallery.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.image_url}
                    alt=""
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingPhoto(photo.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add more gallery photos */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Add More Gallery Photos
          </label>
          {newGalleryPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {newGalleryPreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewGallerySelect}
          />
        </div>

        {/* Existing timeline stages */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Current Construction Timeline
          </label>
          {existingStages.length === 0 ? (
            <p className="text-sm text-zinc-500 mb-3">
              No timeline stages yet.
            </p>
          ) : (
            <div className="space-y-3 mb-4">
              {existingStages.map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-3 bg-white border border-zinc-200 rounded-md p-3"
                >
                  <img
                    src={stage.image_url}
                    alt=""
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gold">
                      {stage.stage_date}
                    </p>
                    <p className="text-sm text-charcoal font-medium">
                      {stage.stage_title_en}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingStage(stage.id)}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new timeline stages */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            Add Timeline Stages
          </label>

          {newStages.map((stage, index) => (
            <div
              key={index}
              className="border border-zinc-200 rounded-md p-4 mb-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-500">
                  Stage {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeStageRow(index)}
                  className="text-red-600 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {stage.preview && (
                <img
                  src={stage.preview}
                  alt=""
                  className="w-24 h-24 object-cover rounded-md"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateStagePhoto(index, e.target.files[0])}
              />

              <div className="grid sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Date (e.g. 01/2024)"
                  value={stage.stage_date}
                  onChange={(e) =>
                    updateStageField(index, "stage_date", e.target.value)
                  }
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Title (English)"
                  value={stage.stage_title_en}
                  onChange={(e) =>
                    updateStageField(index, "stage_title_en", e.target.value)
                  }
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Title (Arabic)"
                  dir="rtl"
                  value={stage.stage_title_ar}
                  onChange={(e) =>
                    updateStageField(index, "stage_title_ar", e.target.value)
                  }
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addStageRow}
            className="text-sm text-gold font-semibold hover:opacity-80"
          >
            + Add another stage
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-gold hover:opacity-90 text-charcoal font-semibold px-6 py-3 rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
