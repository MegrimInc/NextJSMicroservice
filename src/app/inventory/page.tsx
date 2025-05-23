"use client";
import React, { useEffect, useState } from "react";
import { AppConfig } from "@/lib/api/config";

const API        = `${AppConfig.postgresHttpBaseUrl}/merchant`;
const S3_BUCKET  = "megrimages";
const S3_REGION  = "us-east-1";

/* --------------------------- TYPES ---------------------------- */
export interface Item {
  itemId: number;
  name: string;
  description: string;
  regularPrice: number | null;
  discountPrice: number | null;
  pointPrice: number;
  gratuityPercent: number | null;
  taxPercent: number | null;
  categoryIds: number[];
  imageFile?: File;     // chosen locally (not persisted)
  imageUrl?: string;    // S3 URL stored in DB
}

interface Category {
  categoryId: number;
  name: string;
}

/* --------------- PRESIGN & UPLOAD HELPERS --------------------- */
async function getPresignedUrl(file: File) {
  const params = new URLSearchParams({ filename: file.name }).toString();
  const res = await AppConfig.fetchWithAuth(
      `${API}/upload-image-url?${params}`,
      { method: "POST", credentials: "include" }
  );
  if (!res.ok) throw new Error("Could not get upload URL");
  return (await res.json()) as { url: string; key: string };
}

async function uploadToS3(presignUrl: string, file: File) {
  const put = await fetch(presignUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!put.ok) {
    console.error(await put.text());
    throw new Error("Upload to S3 failed");
  }
}

/* ------------------------ COMPONENT --------------------------- */
export default function InventoryPage() {
  const [items,       setItems]       = useState<Item[]>([]);
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [error,       setError]       = useState("");
  const [editedRows,  setEditedRows]  = useState<Set<number>>(new Set());

  const blank: Item = {
    itemId: 0,
    name: "",
    description: "",
    regularPrice: 0,
    discountPrice: 0,
    pointPrice: 150,
    taxPercent: 0,
    gratuityPercent: 0,
    categoryIds: [],
  };
  const [newItem, setNewItem] = useState<Item>({ ...blank });

  /* -------------- INITIAL LOAD -------------- */
  useEffect(() => {
    (async () => {
      try {
        const menuRes = await AppConfig.fetchWithAuth(API, { credentials: "include" });
        if (!menuRes.ok) throw new Error("Cannot load menu");
        const menu = (await menuRes.json()) as Item[];
        setItems(menu.map((i) => ({ ...i, gratuityPercent: i.gratuityPercent ?? 0 })));

        const catRes = await AppConfig.fetchWithAuth(
            `${API}/configurations/categories`,
            { credentials: "include" }
        );
        if (!catRes.ok) throw new Error("Cannot load categories");
        setCategories((await catRes.json()).categories || []);
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, []);

  const markEdited = (id: number) =>
      setEditedRows((prev) => new Set(prev).add(id));

  /* -------- SAVE (PATCH) EXISTING ITEM -------- */
  const saveItem = async (item: Item) => {
    try {
      let imageUrl = item.imageUrl;

      if (item.imageFile) {
        const { url, key } = await getPresignedUrl(item.imageFile);
        await uploadToS3(url, item.imageFile);
        imageUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
      }

      const { imageFile, ...payload } = { ...item, imageUrl };

      await AppConfig.fetchWithAuth(`${API}/${item.itemId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setEditedRows((prev) => {
        const s = new Set(prev);
        s.delete(item.itemId);
        return s;
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* ------------ CREATE (POST) NEW ITEM ------------ */
  const addItem = async () => {
    try {
      let imageUrl: string | undefined;

      if (newItem.imageFile) {
        const { url, key } = await getPresignedUrl(newItem.imageFile);
        await uploadToS3(url, newItem.imageFile);
        imageUrl = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
      }

      const { imageFile, ...payload } = { ...newItem, imageUrl };

      const res = await AppConfig.fetchWithAuth(API, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");

      const created = (await res.json()) as Item;
      setItems((prev) => [...prev, { ...created, gratuityPercent: created.gratuityPercent ?? 0 }]);
      setNewItem({ ...blank });
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* ------------ DELETE ------------ */
  const deleteItem = async (id: number) => {
    await AppConfig.fetchWithAuth(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setItems((prev) => prev.filter((i) => i.itemId !== id));
  };

  /* -------- FIELD HANDLERS -------- */
  const updateField =
      (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numeric = ["regularPrice","discountPrice","pointPrice","taxPercent","gratuityPercent"].includes(name);
        const v = numeric ? parseFloat(value || "0") : value;
        setItems((prev) =>
            prev.map((it) => (it.itemId === id ? { ...it, [name]: v } : it))
        );
        markEdited(id);
      };

  const updateItemCategories = (id: number, ids: number[]) => {
    setItems((prev) =>
        prev.map((it) => (it.itemId === id ? { ...it, categoryIds: ids } : it))
    );
    markEdited(id);
  };

  const updateItemImage =
      (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setItems((prev) =>
            prev.map((it) => (it.itemId === id ? { ...it, imageFile: file } : it))
        );
        markEdited(id);
      };

  /* -------- JSX RENDER -------- */
  return (
      <div className="w-full min-h-screen p-6 bg-white text-black overflow-auto">
        <h1 className="text-4xl font-extrabold text-center mb-6">Inventory Dashboard</h1>

        {error && (
            <p className="bg-red-200 p-3 mb-4 border-l-4 border-red-600">{error}</p>
        )}

        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-black">
          <tr>
            <Th>ID</Th><Th className="w-24">$ Price</Th><Th className="w-24">Discount $</Th>
            <Th className="w-24">Pts</Th><Th className="w-28">Tax %</Th><Th className="w-28">Gratuity %</Th>
            <Th>Name</Th><Th>Description</Th><Th>Categories</Th><Th>Image</Th><Th>Actions</Th>
          </tr>
          </thead>
          <tbody>
          {/* EXISTING ITEMS */}
          {items.map((it) => (
              <tr key={it.itemId} className="hover:bg-gray-100">
                <Td>{it.itemId}</Td>

                {/* numeric fields */}
                {["regularPrice","discountPrice","pointPrice","taxPercent","gratuityPercent"].map((n, i) => (
                    <Td key={n}>
                      <Input
                          name={n}
                          type="number"
                          step="0.01"
                          className={["w-24","w-24","w-24","w-28","w-28"][i]}
                          value={(it as any)[n] ?? 0}
                          onChange={updateField(it.itemId)}
                      />
                    </Td>
                ))}

                {/* text fields */}
                <Td><Input name="name"        value={it.name}        onChange={updateField(it.itemId)} /></Td>
                <Td><Input name="description" value={it.description} onChange={updateField(it.itemId)} /></Td>

                {/* categories */}
                <Td>
                  <CategoryDropdown
                      selected={it.categoryIds}
                      categories={categories}
                      onChange={(ids) => updateItemCategories(it.itemId, ids)}
                  />
                </Td>

                {/* image picker */}
                <Td className="flex flex-col gap-1">
                  {it.imageUrl && <span className="text-green-600">Image ✓</span>}
                  <input type="file" accept="image/png,image/jpeg" onChange={updateItemImage(it.itemId)} />
                </Td>

                {/* actions */}
                <Td>
                  <div className="flex flex-col gap-1">
                    <button className="text-red-600 font-semibold hover:underline"
                            onClick={() => deleteItem(it.itemId)}>Delete</button>

                    {editedRows.has(it.itemId) && (
                        <button className="text-blue-600 font-semibold hover:underline"
                                onClick={() => saveItem(it)}>Save</button>
                    )}
                  </div>
                </Td>
              </tr>
          ))}

          {/* NEW ITEM ROW */}
          <tr className="hover:bg-gray-100">
            <Td>new</Td>
            {["regularPrice","discountPrice","pointPrice","taxPercent","gratuityPercent"].map((n,i)=>(
                <Td key={n}>
                  <Input
                      name={n}
                      type="number" step="0.01"
                      className={["w-24","w-24","w-24","w-28","w-28"][i]}
                      value={(newItem as any)[n] ?? 0}
                      onChange={(e)=>setNewItem({...newItem,[n]:parseFloat(e.target.value||"0")})}
                  />
                </Td>
            ))}

            <Td><Input name="name" value={newItem.name} onChange={(e)=>setNewItem({...newItem,name:e.target.value})} /></Td>
            <Td><Input name="description" value={newItem.description} onChange={(e)=>setNewItem({...newItem,description:e.target.value})} /></Td>

            <Td>
              <CategoryDropdown
                  selected={newItem.categoryIds}
                  categories={categories}
                  onChange={(ids) => setNewItem({ ...newItem, categoryIds: ids })}
              />
            </Td>

            <Td>
              <input
                  type="file" accept="image/png,image/jpeg"
                  onChange={(e)=>setNewItem({...newItem,imageFile:e.target.files?.[0]})}
              />
            </Td>

            <Td>
              <button className="text-green-600 font-semibold hover:underline" onClick={addItem}>Add</button>
            </Td>
          </tr>
          </tbody>
        </table>
      </div>
  );
}

/* ---------------------- DROPDOWN & UI HELPERS ---------------------- */
function CategoryDropdown({
                            selected, onChange, categories,
                          }: {
  selected: number[]; onChange: (ids: number[]) => void; categories: Category[];
}) {
  const toggle = (id: number) =>
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
  const toggleAll = () =>
      onChange(selected.length === categories.length ? [] : categories.map((c) => c.categoryId));

  return (
      <details className="relative w-full">
        <summary className="cursor-pointer border px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 truncate">
          {selected.length === 0
              ? "Select categories"
              : selected.length === categories.length
                  ? "All selected"
                  : `${selected.length} selected`}
        </summary>
        <div className="absolute z-10 bg-white shadow border mt-1 w-60 max-h-48 overflow-y-auto p-2 text-sm">
          <label
              className="block cursor-pointer mb-1 text-blue-600 hover:underline"
              onClick={toggleAll}
          >
            {selected.length === categories.length ? "Unselect All" : "Select All"}
          </label>
          {categories.map((cat) => (
              <label key={cat.categoryId} className="block cursor-pointer">
                <input
                    type="checkbox" className="mr-1"
                    checked={selected.includes(cat.categoryId)}
                    onChange={() => onChange(toggle(cat.categoryId))}
                />
                {cat.name}
              </label>
          ))}
        </div>
      </details>
  );
}

/* ---------------------- SMALL ELEMENTS ---------------------- */
const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string; }) =>
    <th className={`p-2 text-left uppercase tracking-wide ${className}`}>{children}</th>;

const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string; }) =>
    <td className={`p-2 align-top ${className}`}>{children}</td>;

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) =>
    <input {...props} className={`${props.className ?? ""} w-full px-2 py-0.5 border border-black rounded focus:ring-1 focus:ring-black`} />;
