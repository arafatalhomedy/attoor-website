import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { serviceIcons } from "../lib/servicesIcons";
import { logActivity } from "../lib/LogActivity";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!error) setServices(data || []);
    setLoading(false);
  };

  const handleDelete = async (service) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", service.id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      await logActivity(
        "deleted",
        "service",
        service.title_en,
        service.title_ar,
      );
      setServices(services.filter((s) => s.id !== service.id));
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Manage Services</h1>
        <Link
          to={`/${ADMIN_PATH}`}
          className="text-sm text-stone-300 hover:text-gold"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal">Services</h2>
          <button
            onClick={() => navigate(`/${ADMIN_PATH}/services/new`)}
            className="bg-gold hover:opacity-90 text-charcoal font-semibold px-4 py-2 rounded-md"
          >
            + Add Service
          </button>
        </div>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-zinc-500">No services yet. Add your first one.</p>
        ) : (
          <div className="space-y-3">
            {services.map((service) => {
              const Icon =
                serviceIcons[service.icon_name] || serviceIcons.Building2;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg border border-zinc-200 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal">
                        {service.title_en}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {service.published ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/${ADMIN_PATH}/services/${service.id}`)
                      }
                      className="text-sm text-zinc-600 hover:text-gold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
