"use client";

import { useEffect, useState } from "react";
import { AppConfig } from "@/lib/api/config";
import { Trash2 } from "lucide-react";

const API = `${AppConfig.postgresHttpBaseUrl}/merchant`;

type DayKey =
    | "Monday" | "Tuesday" | "Wednesday" | "Thursday"
    | "Friday" | "Saturday" | "Sunday";

interface Category {
  categoryId: number;
  name: string;
}

export default function ConfigurationsPage() {
  /* ───── STATE ───── */
  const [inputs,      setInputs]      = useState<string[]>(Array(10).fill(""));
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [schedule,    setSchedule]    = useState<Record<DayKey,string|null>>({
    Monday:null, Tuesday:null, Wednesday:null, Thursday:null,
    Friday:null, Saturday:null, Sunday:null
  });
  const [rangeDraft,  setRangeDraft]  = useState("");      // for “apply to all”
  const [error,       setError]       = useState("");

  /* ───── INITIAL LOAD ───── */
  useEffect(() => {
    (async () => {
      try {
        /* categories */
        const catRes = await AppConfig.fetchWithAuth(`${API}/configurations/categories`);
        const catJson = await catRes.json();
        setCategories(catJson.categories);
        const names = (catJson.categories as Category[]).map(c => c.name).slice(0,10);
        setInputs([...names, ...Array(10-names.length).fill("")]);

        /* discount schedule */
        const discRes = await AppConfig.fetchWithAuth(`${API}/configurations/discount`);
        const discJson = await discRes.json();
        const parsed: Record<DayKey,string|null> = JSON.parse(discJson.discountSchedule);
        setSchedule(prev => ({...prev, ...parsed}));
      } catch (e:any) { setError(e.message); }
    })();
  }, []);

  /* ───── CATEGORY HELPERS ───── */
  const handleInputChange = (i:number,val:string) =>
      setInputs(prev => { const c=[...prev]; c[i]=val; return c; });

  const saveCategories = async () => {
    const parsed = inputs.map(s=>s.trim()).filter(Boolean);
    if (parsed.length < 3 || parsed.length > 8) {
      setError("You must provide between 3 and 8 categories."); return;
    }
    const res = await AppConfig.fetchWithAuth(`${API}/configurations/categories`,{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(parsed)
    });
    if (!res.ok) { setError("Failed to save"); return; }
    const data = await res.json();
    setCategories(data.categories);
    setError("");
  };

  const deleteCategory = async (id:number) => {
    await AppConfig.fetchWithAuth(`${API}/configurations/categories/${id}`,{ method:"DELETE" });
    setCategories(prev => prev.filter(c => c.categoryId!==id));
  };

  /* ───── DISCOUNT HELPERS ───── */
  const updateDayRange = (day:DayKey,val:string|null) =>
      setSchedule(prev => ({...prev,[day]:val}));

  const applyToAll = () => {
    if (!rangeDraft.trim()) return;
    setSchedule(Object.fromEntries(
        Object.keys(schedule).map(k => [k, rangeDraft.trim()])
    ) as Record<DayKey,string|null>);
  };

  const saveSchedule = async () => {
    const res = await AppConfig.fetchWithAuth(
        `${API}/configurations/discount`,
        {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify(schedule)
        }
    );
    if (!res.ok) { setError("Failed to save schedule"); }
    else setError("");
  };

  return (
      <div className="p-6 bg-white min-h-screen text-black">
        <h1 className="text-4xl font-bold mb-6 text-center">Configurations</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* ───── CATEGORIES ───── */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Item Categories</h2>
          <p className="text-sm text-gray-600 mb-4">Enter category names. Leave others blank.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {inputs.map((v,i)=>(
                <input key={i} value={v} placeholder={`Category ${i+1}`}
                       onChange={e=>handleInputChange(i,e.target.value)}
                       className="border px-3 py-2 rounded"/>
            ))}
          </div>

          <button onClick={saveCategories}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Categories
          </button>

          <ul className="pl-6 mt-4 space-y-1">
            {categories.map(cat=>(
                <li key={cat.categoryId} className="flex items-center gap-2">
                  {cat.name}
                  <Trash2 size={16} className="text-red-600 cursor-pointer"
                          onClick={()=>deleteCategory(cat.categoryId)}/>
                </li>
            ))}
          </ul>
        </section>

        {/* ───── DISCOUNT SCHEDULE ───── */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Discount Schedule</h2>
          <p className="text-sm text-gray-600 mb-4">
            Time ranges per day. Format: <code>hh:mm-hh:mm</code> or multiple separated with <code>|</code>.
          </p>
          <div className="flex items-center gap-3 mb-4">
            <input value={rangeDraft} onChange={e => setRangeDraft(e.target.value)}
                   placeholder="hh:mm-hh:mm range"
                   className="border px-2 py-1 rounded flex-1"/>
            <button onClick={applyToAll}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
              Apply to all days
            </button>
          </div>
          <table className="w-full max-w-xl text-sm mb-4">
            <tbody>
            {Object.keys(schedule).map(day => (
                <tr key={day} className="border-b">
                  <td className="py-2 pr-4 font-medium">{day}</td>
                  <td className="py-2">
                    <input
                        value={schedule[day as DayKey] ?? ""}
                        onChange={e => updateDayRange(day as DayKey, e.target.value)}
                        placeholder="e.g. 17:00-19:00 | 22:00-23:59"
                        className="w-full border px-2 py-1 rounded"/>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          {/* apply all */}


          <button onClick={saveSchedule}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Schedule
          </button>
        </section>
      </div>
  );
}
