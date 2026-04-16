"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

// =============================================
// UTILIDADES - Manejo Inteligente de Imágenes
// =============================================

/**
 * Construye URL completa para imágenes de autoridades
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta de autoridades
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'autoridad' | 'logo' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' = 'autoridad'
): string => {
  if (!imagePath) return '/images/placeholder.png';
  
  const cleanPath = imagePath.trim();
  
  // ✅ CASO 1: Ya es URL completa (MinIO o externo) → NO modificar
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // ✅ CASO 2: Ruta relativa /storage/... → Agregar API_BASE_URL
  if (cleanPath.startsWith('/storage/')) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  
  // ✅ CASO 3: UUID o filename → Construir URL con carpeta según tipo
  const typeFolders: Record<string, string> = {
    autoridad: '/storage/imagenes/autoridades/',
    logo: '/storage/imagenes/logos/',
    portada: '/storage/imagenes/portadas/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

const getInitials = (name: string): string => {
   if (!name) return "A";
   return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const TeamArea: React.FC = () => {
   const [autoridades, setAutoridades] = useState<AutoridadItem[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchAutoridades = async () => {
         try {
            console.log('🔄 [TeamArea] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ Headers con variables de entorno
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
            };
            if (API_TOKEN) {
               headers['Authorization'] = `Bearer ${API_TOKEN}`;
            }
            
            // ✅ URL con variables de entorno
            const response = await fetch(
               `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/contenido`,
               { method: 'GET', headers, cache: 'no-store' }
            );
            
            if (response.ok) {
               const data = await response.json();
               const lista = data?.autoridad || [];
               
               console.log('✅ [TeamArea] Autoridades cargadas:', lista.length);
               
               if (lista.length > 0) {
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
               } else {
                  setAutoridades([]);
               }
            } else {
               console.error('❌ Error API:', response.status);
               setError(`Error ${response.status} al cargar autoridades`);
               setAutoridades([]);
            }
            
            setLoading(false);
            
         } catch (error: any) {
            console.error('❌ Error crítico:', error?.message);
            setError(error?.message || 'Error de conexión con el servidor');
            setAutoridades([]);
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
                     <p className="mt-3">
                        Conectando con: {API_BASE_URL}
                     </p>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="team-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                     <div className="alert alert-warning p-4" style={{ 
                        borderRadius: '12px',
                        background: '#fff3cd',
                        border: '2px solid #ffc107'
                     }}>
                        <i className="fa fa-exclamation-triangle fa-2x mb-3" style={{ color: '#856404' }}></i>
                        <h5 className="text-warning mb-2">Error al Cargar</h5>
                        <p className="mb-0 text-muted">{error}</p>
                        <p className="text-muted small mt-2">
                           API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                        </p>
                        <button 
                           onClick={() => window.location.reload()}
                           className="btn btn-warning btn-sm mt-3"
                        >
                           <i className="fa fa-refresh me-1"></i> Reintentar
                        </button>
                     </div>
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
                  <p className="text-muted small mt-2">
                     <i className="fa fa-database me-1"></i>
                     API: {API_BASE_URL} | Institución: {INSTITUCION_ID}
                  </p>
               </div>
            </div>
            
            <div className="row justify-content-center g-4">
               {autoridades.length === 0 ? (
                  <div className="col-12 text-center">
                     <div className="alert alert-info p-4" style={{ 
                        borderRadius: '12px',
                        background: '#e7f3ff',
                        border: '2px solid #0d6efd'
                     }}>
                        <i className="fa fa-users fa-2x mb-3" style={{ color: '#0d6efd' }}></i>
                        <h5 className="text-primary mb-2">Sin Autoridades Disponibles</h5>
                        <p className="mb-0 text-muted">
                           Las autoridades se mostrarán aquí cuando la administración las publique.
                        </p>
                        <p className="text-muted small mt-2">
                           API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                        </p>
                     </div>
                  </div>
               ) : (
                  autoridades.map((auth, index) => {
                     // ✅ Construir URL de imagen inteligente
                     const imageUrl = buildImageUrl(auth.foto_autoridad, 'autoridad');
                     const initials = getInitials(auth.nombre_autoridad);
                     const isExternalImage = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
                     
                     return (
                        <div key={auth.id || index} className="col-lg-4 col-md-6">
                           <article className="team-member-card h-100" style={{
                              borderRadius: "12px",
                              overflow: "hidden",
                              boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                              background: "#fff",
                              transition: "transform 0.3s ease, box-shadow 0.3s ease"
                           }}
                           onMouseEnter={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(-8px)';
                              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                           }}
                           onMouseLeave={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                           }}
                           >
                              <div style={{ width: "100%", height: "260px", background: "#f8f9fa", position: "relative" }}>
                                 <Image
                                    src={imageUrl}
                                    alt={auth.nombre_autoridad}
                                    width={600}
                                    height={260}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    // ✅ No optimizar si es URL externa (MinIO)
                                    unoptimized={isExternalImage}
                                    onError={(e) => {
                                       const target = e.target as HTMLImageElement;
                                       target.style.display = 'none';
                                       const fallback = document.createElement('div');
                                       fallback.style.cssText = `width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#FD1C0A,#FAB265);color:#fff;font-size:3rem;font-weight:700;`;
                                       fallback.textContent = initials;
                                       target.parentNode?.appendChild(fallback);
                                    }}
                                    loading="lazy"
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
                  })
               )}
            </div>
         </div>
      </section>
   );
};

export default TeamArea;