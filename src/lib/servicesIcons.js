import { Building2, Hammer, Wrench, Ruler, ClipboardList, HardHat } from "lucide-react";

// Central icon registry for Services. To add a new icon later:
// 1. Import it from lucide-react above
// 2. Add it to this map with a unique key
// That's it — it will show up in the admin picker and render correctly on the public site.
export const serviceIcons = {
    Building2,
    Hammer,
    Wrench,
    Ruler,
    ClipboardList,
    HardHat,
};

export const serviceIconNames = Object.keys(serviceIcons);