"use client";
import React, { useEffect, useState, useRef } from "react";
import { AppConfig } from "@/lib/api/config";

/* ───── API + S3 ───── */
const API        = `${AppConfig.postgresHttpBaseUrl}/merchant`;
const S3_BUCKET  = "megrimages";
const S3_REGION  = "us-east-1";

/* ─── Column-width constants (pixels) ───────────────────────── */
const WIDTH_NAME        = "min-w-[160px]";  // Name
const WIDTH_DESCRIPTION = "min-w-[300px]";  // Description
const WIDTH_CATEGORIES  = "min-w-[100px]";  // Categories
const WIDTH_IMAGE       = "min-w-[200px]";  // Image
const NUMERIC_COL_W     = ["min-w-[70px]","min-w-[70px]","min-w-[70px]","min-w-[70px]","min-w-[70px]"] as const;

/* ───── Types ───── */
export interface Item {
  itemId: number;
  name: string;
  description: string;
  regularPrice:   number | "" | null;
  discountPrice:  number | "" | null;
  pointPrice:     number | "";
  gratuityPercent:number | "" | null;
  taxPercent:     number | "" | null;
  categoryIds:    number[];
  imageFile?: File;
  imageUrl?: string;
  image?: string;
}
interface Category { categoryId: number; name: string }

/* ───── S3 helpers ───── */
async function getPresignedUrl(file: File) {
  const params = new URLSearchParams({ filename: file.name }).toString();
  const res = await AppConfig.fetchWithAuth(`${API}/upload-image-url?${params}`, {
    method: "POST", credentials: "include",
  });
  if (!res.ok) throw new Error("Presign failed");
  return (await res.json()) as { url: string; key: string };
}
const uploadToS3 = (url:string,file:File)=>
    fetch(url,{method:"PUT",headers:{"Content-Type":file.type},body:file})
        .then(r=>{if(!r.ok)throw new Error("Upload failed");});

/* ───── Numeric meta ───── */
const NUMERIC_FIELDS = ["regularPrice","discountPrice","pointPrice","taxPercent","gratuityPercent"] as const;
type NumericField = (typeof NUMERIC_FIELDS)[number];
const label = (k:NumericField)=>({
  regularPrice:"Price", discountPrice:"Discount", pointPrice:"Pts",
  taxPercent:"Tax %",   gratuityPercent:"Gratuity %"
}[k]);

/* ───── Component ───── */
export default function InventoryPage() {
  const [items,setItems]   = useState<Item[]>([]);
  const [cats,setCats]     = useState<Category[]>([]);
  const [err,setErr]       = useState("");
  const [dirty,setDirty]   = useState<Set<number>>(new Set());

  /* description edit state */
  const [editingId,setEditingId] = useState<number|null>(null);
  const [tempDesc,setTempDesc]   = useState("");
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);

  const blank:Item={itemId:0,name:"",description:"",
    regularPrice:"",discountPrice:"",pointPrice:"",
    taxPercent:0,gratuityPercent:0,categoryIds:[]};
  const [newItem,setNewItem]=useState<Item>({...blank});

  /* ── load menu + categories ── */
  useEffect(()=>{(async()=>{
    try{
      const menu = await AppConfig.fetchWithAuth(API,{credentials:"include"})
          .then(r=>{if(!r.ok)throw new Error("Menu load");return r.json();}) as Item[];
      setItems(menu.map(m=>({...m,imageUrl:m.image ?? m.imageUrl,gratuityPercent:m.gratuityPercent??0}))
          .sort((a,b)=>a.itemId-b.itemId));

      const cat  = await AppConfig.fetchWithAuth(`${API}/configurations/categories`,{credentials:"include"})
          .then(r=>{if(!r.ok)throw new Error("Cat load");return r.json();});
      setCats(cat.categories||[]);
    }catch(e:any){setErr(e.message);}
  })();},[]);

  /* ── local helpers ── */
  const mark = (id:number)=>setDirty(p=>new Set(p).add(id));
  const fixNums=(obj:any)=>NUMERIC_FIELDS.forEach(f=>{obj[f]=obj[f]===""||obj[f]==null?0:Number(obj[f]);});
  const updateField=(id:number)=>(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    const isNum=NUMERIC_FIELDS.includes(name as NumericField);
    const v=isNum?(value===""?"":Number(value)):value;
    setItems(p=>p.map(i=>i.itemId===id?{...i,[name]:v}:i)); mark(id);
  };
  const updateDesc=(id:number,value:string)=>{setItems(p=>p.map(i=>i.itemId===id?{...i,description:value}:i)); mark(id);};

  const updateCats=(id:number,ids:number[])=>{
    setItems(p=>p.map(i=>i.itemId===id?{...i,categoryIds:ids}:i)); mark(id);
  };
  const updateImg=(id:number)=>(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]; if(!file)return;
    setItems(p=>p.map(i=>i.itemId===id?{...i,imageFile:file}:i)); mark(id);
  };

  /* ── save / patch ── */
  const saveItem=async(it:Item)=>{
    try{
      let imageUrl=it.imageUrl;
      if(it.imageFile){const {url,key}=await getPresignedUrl(it.imageFile);
        await uploadToS3(url,it.imageFile);
        imageUrl=`https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;}
      const body:{[k:string]:any}={...it,image:imageUrl}; fixNums(body); delete body.imageFile; delete body.imageUrl;
      await AppConfig.fetchWithAuth(`${API}/${it.itemId}`,{
        method:"PATCH",credentials:"include",
        headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      setItems(p=>p.map(x=>x.itemId===it.itemId?{...x,imageUrl,imageFile:undefined}:x));
      setDirty(p=>{const s=new Set(p);s.delete(it.itemId);return s;});
    }catch(e:any){setErr(e.message);}
  };

  /* ── create ─ */
  const addItem=async()=>{
    try{
      let imageUrl:string|undefined;
      if(newItem.imageFile){const {url,key}=await getPresignedUrl(newItem.imageFile);
        await uploadToS3(url,newItem.imageFile);
        imageUrl=`https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;}
      const body:{[k:string]:any}={...newItem,image:imageUrl}; fixNums(body); delete body.imageFile; delete body.imageUrl;
      const created = await AppConfig.fetchWithAuth(API,{
        method:"POST",credentials:"include",
        headers:{"Content-Type":"application/json"},body:JSON.stringify(body)
      }).then(r=>{if(!r.ok)throw new Error("Create fail");return r.json();}) as Item;

      setItems(p=>[...p,{...created,imageUrl:created.image??created.imageUrl,gratuityPercent:created.gratuityPercent??0}]
          .sort((a,b)=>a.itemId-b.itemId));
      setNewItem({...blank});
    }catch(e:any){setErr(e.message);}
  };

  /* ── delete ─ */
  const delItem=(id:number)=>AppConfig.fetchWithAuth(`${API}/${id}`,{method:"DELETE",credentials:"include"})
      .then(()=>setItems(p=>p.filter(i=>i.itemId!==id)));

  /* focus textarea when it appears */
  useEffect(()=>{if(editingId!==null){textareaRef.current?.focus();}},[editingId]);

  /* ── UI ── */
  return(
      <div className="w-full min-h-screen p-6 overflow-auto bg-white text-black">
        <h1 className="text-4xl font-extrabold text-center mb-6">Inventory Dashboard</h1>
        {err&&<p className="bg-red-200 p-3 mb-4 border-l-4 border-red-600 whitespace-pre-line">{err}</p>}

        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-black">
          <tr>
            {/* ID column removed from UI */}
            <Th><span className={`${WIDTH_NAME} inline-block`}>Name</span></Th>
            <Th><span className={`${WIDTH_DESCRIPTION} inline-block`}>Description</span></Th>
            <Th><span className={`${WIDTH_CATEGORIES} inline-block`}>Categories</span></Th>
            {NUMERIC_FIELDS.map((f,i)=><Th key={f} className={`${NUMERIC_COL_W[i]} whitespace-nowrap`}>{label(f)}</Th>)}
            <Th><span className={`${WIDTH_IMAGE} inline-block`}>Image</span></Th>
            <Th>Actions</Th>
          </tr>
          </thead>

          <tbody>
          {items.map(it=>(
              <tr key={it.itemId} className="hover:bg-gray-100">
                {/* Name */}
                <Td><Input name="name" value={it.name} onChange={updateField(it.itemId)} className={WIDTH_NAME}/></Td>

                {/* Description cell with click-to-edit */}
                <Td className={WIDTH_DESCRIPTION}>
                  {editingId===it.itemId ? (
                      <textarea
                          ref={textareaRef}
                          value={tempDesc}
                          onChange={e=>setTempDesc(e.target.value)}
                          onBlur={()=>{updateDesc(it.itemId,tempDesc);setEditingId(null);}}
                          onKeyDown={e=>{
                            if(e.key==="Escape"){setEditingId(null);}
                            if(e.key==="Enter" && !e.shiftKey){
                              e.preventDefault();
                              updateDesc(it.itemId,tempDesc);
                              setEditingId(null);
                            }
                          }}
                          className="w-full h-24 border border-gray-400 rounded p-2"
                      />
                  ) : (
                      <div
                          onClick={()=>{setEditingId(it.itemId);setTempDesc(it.description);}}
                          className="cursor-text min-h-[40px] whitespace-pre-wrap"
                          title="Click to edit"
                      >
                        {it.description || <span className="text-gray-400">(click to add)</span>}
                      </div>
                  )}
                </Td>

                {/* Categories */}
                <Td className={WIDTH_CATEGORIES}>
                  <CategoryDropdown selected={it.categoryIds} categories={cats} onChange={ids=>updateCats(it.itemId,ids)}/>
                </Td>

                {/* Numbers */}
                {NUMERIC_FIELDS.map((n,i)=>(
                    <Td key={n}><Input name={n} type="number" step="0.01" className={NUMERIC_COL_W[i]} value={(it as any)[n]} onChange={updateField(it.itemId)}/></Td>
                ))}

                {/* Image */}
                <Td className={`${WIDTH_IMAGE} flex flex-col gap-1`}>
                  {it.imageUrl && !it.imageFile && <span className="text-green-600 font-semibold">✓ Image</span>}
                  {it.imageFile && <span className="text-orange-500">pending…</span>}
                  <label className="inline-block px-3 py-1.5 border border-gray-400 rounded shadow-sm text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer w-fit">
                    {it.imageUrl ? "Update file" : "Choose file"}
                    <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={updateImg(it.itemId)}/>
                  </label>
                </Td>

                {/* Actions */}
                <Td>
                  <div className="flex flex-col gap-1">
                    <button className="text-red-600 font-semibold hover:underline" onClick={()=>delItem(it.itemId)}>Delete</button>
                    {dirty.has(it.itemId)&&<button className="text-blue-600 font-semibold hover:underline" onClick={()=>saveItem(it)}>Save</button>}
                  </div>
                </Td>
              </tr>
          ))}

          {/* new item row */}
          <tr className="hover:bg-gray-100">
            <Td><Input name="name" value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} className={WIDTH_NAME}/></Td>
            <Td><Input name="description" value={newItem.description} onChange={e=>setNewItem({...newItem,description:e.target.value})} className={WIDTH_DESCRIPTION}/></Td>
            <Td className={WIDTH_CATEGORIES}>
              <CategoryDropdown selected={newItem.categoryIds} categories={cats} onChange={ids=>setNewItem({...newItem,categoryIds:ids})}/>
            </Td>
            {NUMERIC_FIELDS.map((n,i)=>(
                <Td key={n}><Input name={n} type="number" step="0.01" className={NUMERIC_COL_W[i]} value={(newItem as any)[n]} onChange={e=>setNewItem({...newItem,[n]:e.target.value===""?"":Number(e.target.value)})}/></Td>
            ))}
            <Td className={WIDTH_IMAGE}>
              <input type="file" accept="image/png,image/jpeg" onChange={e=>setNewItem({...newItem,imageFile:e.target.files?.[0]})}/>
            </Td>
            <Td><button className="text-green-600 font-semibold hover:underline" onClick={addItem}>Add</button></Td>
          </tr>
          </tbody>
        </table>
      </div>);
}

/* ───── UI helpers ───── */
function CategoryDropdown({selected,onChange,categories}:{selected:number[];onChange:(ids:number[])=>void;categories:Category[]}) {
  const tog=(id:number)=>selected.includes(id)?selected.filter(x=>x!==id):[...selected,id];
  const togAll=()=>onChange(selected.length===categories.length?[]:categories.map(c=>c.categoryId));
  return(
      <details className="relative w-full">
        <summary className="cursor-pointer border px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 truncate">
          {selected.length===0?"Select":selected.length===categories.length?"All":`${selected.length} selected`}
        </summary>
        <div className="absolute z-10 bg-white shadow border mt-1 w-60 max-h-48 overflow-y-auto p-2 text-sm">
          <label className="block cursor-pointer mb-1 text-blue-600 hover:underline" onClick={togAll}>
            {selected.length===categories.length?"Unselect All":"Select All"}
          </label>
          {categories.map(cat=>(
              <label key={cat.categoryId} className="block cursor-pointer">
                <input type="checkbox" className="mr-1" checked={selected.includes(cat.categoryId)} onChange={()=>onChange(tog(cat.categoryId))}/>
                {cat.name}
              </label>
          ))}
        </div>
      </details>);
}

const Th = ({children,className=""}:{children:React.ReactNode;className?:string})=><th className={`p-2 text-left uppercase tracking-wide ${className}`}>{children}</th>;
const Td = ({children,className=""}:{children:React.ReactNode;className?:string})=><td className={`p-2 align-top ${className}`}>{children}</td>;
const Input = (props:React.InputHTMLAttributes<HTMLInputElement>)=><input {...props} className={`${props.className??""} w-full px-2 py-0.5 border border-black rounded focus:ring-1 focus:ring-black`}/>
