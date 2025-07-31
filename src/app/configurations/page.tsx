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
  const [storeImageFile, setStoreImageFile] = useState<File | null>(null);
  const [storeImageUrl, setStoreImageUrl] = useState<string>("");

  const S3_BUCKET = "megrimages";
  const S3_REGION = "us-east-1";

  async function convertToWebP(file: File): Promise<File> {
    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("WebP conversion failed"));
        if (blob.size > 307200) return reject(new Error("Image is too large"));
        resolve(new File([blob], file.name.replace(/\.(png|jpe?g)$/i, ".webp"), { type: "image/webp" }));
      }, "image/webp", 0.9);
    });
  }

  async function getPresignedUrl(file: File) {
    const params = new URLSearchParams({ filename: file.name }).toString();
    const res = await AppConfig.fetchWithAuth(`${API}/upload-image-url?${params}`, {
      method: "POST", credentials: "include",
    });
    if (!res.ok) throw new Error("Presign failed");
    return (await res.json()) as { url: string; key: string };
  }

  const uploadToS3 = (url: string, file: File) =>
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      }).then(r => {
        if (!r.ok) throw new Error("Upload failed");
      });


    const resetAllEmployeeShifts = async () => {
        try {
            const res = await AppConfig.fetchWithAuth(`${API}/employees/reset-shift`, {
                method: "PATCH",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to reset shifts");

            setError(""); // clear any old error
            alert("All employee shifts have been reset.");
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleStoreImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setStoreImageFile(file);
  };

  const uploadStoreImage = async () => {
    if (!storeImageFile) return setError("No image selected");

    try {
      const webpFile = await convertToWebP(storeImageFile);
      const { url, key } = await getPresignedUrl(webpFile);
      await uploadToS3(url, webpFile);

      const finalUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

      const res = await AppConfig.fetchWithAuth(`${API}/configurations/store-image`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ storeImage: finalUrl }),
      });

      if (!res.ok) throw new Error("Upload failed");
      setStoreImageFile(null);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };


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
        {/* ───── STORE IMAGE ───── */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Store Image</h2>
          <p className="text-sm text-gray-600 mb-2">Upload an image to represent your store.</p>

          <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleStoreImageChange}
              className="mb-2"
          />

          <button
              onClick={uploadStoreImage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload Store Image
          </button>

          {error && <p className="text-red-600 mt-2">{error}</p>}
        </section>

          {/* ───── RESET SHIFTS ───── */}
          <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-2">Reset Employee Shifts</h2>
              <p className="text-sm text-gray-600 mb-4">
                  Resets the shift timestamp for all employees.
              </p>
              <button
                  onClick={resetAllEmployeeShifts}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                  Reset All Employee Shifts
              </button>
          </section>


      </div>
  );
}
