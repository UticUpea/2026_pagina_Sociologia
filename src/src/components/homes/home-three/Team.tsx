"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// =============================================
// INTERFACES
// =============================================
interface AutoridadItem {
   foto_autoridad: string;
   nombre_autoridad: string;
   cargo_autoridad: string;
   celular_autoridad: string;
   facebook_autoridad?: string;
   twitter_autoridad?: string;
   email_autoridad?: string;
   id?: number;
}

// =============================================
// CONFIGURACIÓN
// =============================================
const API_BASE_URL = process.env.NEXT_APP_API_URL_V1 || 'https://apiadministrador.upea.bo';
const API_TOKEN = process.env.NEXT_APP_API_TOKEN || '';
const INSTITUCION_ID = process.env.NEXT_PUBLIC_API_INSTITUCION || "35";

// =============================================
// UTILIDADES
// =============================================
const buildImageUrl = (fileName: string | null | undefined): string => {
   if (!fileName) return '/images/placeholder.png';
   const cleanName = fileName.trim();
   if (cleanName.startsWith('http')) return cleanName;
   if (cleanName.startsWith('/storage/')) return `${API_BASE_URL}${cleanName}`;
   return `/api/recurso?file=${encodeURIComponent(cleanName)}`;
};

const getInitials = (name: string): string => {
   if (!name) return "A";
   return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
};

// =============================================
// COMPONENTE
// =============================================
const Team: React.FC = () => {
   const [autoridades, setAutoridades] = useState<AutoridadItem[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchAutoridades = async () => {
         try {
            console.log('🔄 [Team] Cargando autoridades...');
            
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
            
            const response = await fetch(
               `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/contenido`,
               { method: 'GET', headers, cache: 'no-store' }
            );
            
            const data = await response.json();
            const lista = data?.autoridad || [];
            
            console.log('✅ [Team] Encontradas', lista.length, 'autoridades');
            
            const normalized = lista.map((item: any, idx: number): AutoridadItem => ({
               id: item.id_autoridad ?? idx,
               nombre_autoridad: (item.nombre_autoridad || `Autoridad ${idx + 1}`).trim(),
               cargo_autoridad: (item.cargo_autoridad || "Sin cargo").trim(),
               foto_autoridad: item.foto_autoridad || "",
               celular_autoridad: item.celular_autoridad || "",
               facebook_autoridad: item.facebook_autoridad || "",
               twitter_autoridad: item.twitter_autoridad || item.twiter_autoridad || "",
               email_autoridad: item.email_autoridad || ""
            }));
            
            setAutoridades(normalized);
            setLoading(false);
            
         } catch (error) {
            console.error('❌ [Team] Error:', error);
            setLoading(false);
         }
      };

      fetchAutoridades();
   }, []);

   if (loading) {
      return (
         <section className="team-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                     </div>
                     <p className="mt-3">Cargando autoridades...</p>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="team-area pd-top-120 pd-bottom-90">
         <div className="container">
            <div className="row justify-content-center mb-5">
               <div className="col-lg-7 text-center">
                  <h6 className="sub-title" style={{ color: '#FD1C0A' }}>SOCIOLOGÍA</h6>
                  <h2 className="title">AUTORIDADES</h2>
               </div>
            </div>
            
            <div className="row justify-content-center g-4">
               {autoridades.map((auth, index) => {
                  const imageUrl = buildImageUrl(auth.foto_autoridad);
                  const initials = getInitials(auth.nombre_autoridad);
                  
                  return (
                     <div key={auth.id || index} className="col-lg-4 col-md-6">
                        <article className="team-member-card h-100" style={{
                           borderRadius: "12px",
                           overflow: "hidden",
                           boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                           background: "#fff"
                        }}>
                           <div style={{ width: "100%", height: "260px", background: "#f8f9fa", position: "relative" }}>
                              <Image
                                 src={imageUrl}
                                 alt={auth.nombre_autoridad}
                                 width={600}
                                 height={260}
                                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                 unoptimized={imageUrl.startsWith('http')}
                                 onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.style.cssText = `width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#FD1C0A,#FAB265);color:#fff;font-size:3rem;font-weight:700;`;
                                    fallback.textContent = initials;
                                    target.parentNode?.appendChild(fallback);
                                 }}
                              />
                           </div>
                           
                           <div className="p-3">
                              <h5 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "#212529" }}>
                                 {auth.nombre_autoridad}
                              </h5>
                              <p style={{ color: "#6c757d", fontSize: "0.9rem", marginBottom: 0 }}>
                                 {auth.cargo_autoridad}
                              </p>
                           </div>
                        </article>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>
   );
};

export default Team;