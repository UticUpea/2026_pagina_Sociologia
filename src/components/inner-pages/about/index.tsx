"use client";
import React, { useEffect, useState } from 'react';
import HeaderOne from "@/layouts/headers/HeaderOne";
import Breadcrumb from "@/components/common/Breadcrumb";
import FooterOne from "@/layouts/footers/FooterOne";
import Image from 'next/image'; // ✅ IMPORTANTE: Asegurar import de Image

// =============================================
// INTERFACES
// =============================================
interface InstitucionData {
   institucion_nombre: string;
   institucion_historia: string;
   institucion_mision: string;
   institucion_vision: string;
   institucion_objetivos: string;
   institucion_sobre_ins: string;
   institucion_logo?: string;
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
 * Construye URL completa para imágenes
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta según tipo
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'historia' | 'logo' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'historia'
): string => {
  if (!imagePath) return '/assets/img/about/historia.jpg';
  
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
    historia: '/storage/imagenes/historia/',
    logo: '/storage/imagenes/logos/',
    portada: '/storage/imagenes/portadas/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const About: React.FC = () => {
   const [data, setData] = useState<InstitucionData | null>(null);
   const [imageUrl, setImageUrl] = useState<string>('/assets/img/about/historia.jpg');
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState<string>('historia');

   useEffect(() => {
      const fetchData = async () => {
         try {
            console.log('🔄 [About] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ URL y headers con variables de entorno
            const url = `${API_BASE_URL}/api/v2/institucionesPrincipal/${INSTITUCION_ID}`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
            };
            if (API_TOKEN) {
               headers['Authorization'] = `Bearer ${API_TOKEN}`;
            }
            
            const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
            
            if (response.ok) {
               const result = await response.json();
               const institucionData = result?.Descripcion || result;
               
               console.log('✅ Datos cargados:', {
                  nombre: institucionData.institucion_nombre,
                  tieneHistoria: !!institucionData.institucion_historia
               });
               
               setData(institucionData);
               
               // ✅ Construir URL de imagen inteligente si existe logo
               if (institucionData.institucion_logo) {
                  const fullImageUrl = buildImageUrl(institucionData.institucion_logo, 'historia');
                  console.log('🖼️ [About] Imagen URL:', fullImageUrl);
                  setImageUrl(fullImageUrl);
               }
            } else {
               console.error('❌ Error API:', response.status);
               setError(`Error ${response.status} al cargar datos`);
            }
            
            setLoading(false);
         } catch (error: any) {
            console.error('❌ Error crítico:', error?.message);
            setError(error?.message || 'Error de conexión con el servidor');
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   // ✅ Contenido actual según tab activo
   const getActiveContent = () => {
      switch (activeTab) {
         case 'historia':
            return data?.institucion_historia || '<p>Historia no disponible</p>';
         case 'mision':
            return data?.institucion_mision || '<p>Misión no disponible</p>';
         case 'vision':
            return data?.institucion_vision || '<p>Visión no disponible</p>';
         case 'objetivos':
            return data?.institucion_objetivos || data?.institucion_sobre_ins || '<p>Objetivos no disponibles</p>';
         default:
            return data?.institucion_historia || '<p>Cargando...</p>';
      }
   };

   if (loading) {
      return (
         <>
            <HeaderOne style_2={true} />
            <Breadcrumb title="Historia" sub_title="Historia" />
            <section className="about-area pd-top-120 pd-bottom-90">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">
                           Conectando con: {API_BASE_URL}
                        </p>
                     </div>
                  </div>
               </div>
            </section>
            <FooterOne />
         </>
      );
   }

   if (error) {
      return (
         <>
            <HeaderOne style_2={true} />
            <Breadcrumb title="Historia" sub_title="Historia" />
            <section className="about-area pd-top-120 pd-bottom-90">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-8 text-center">
                        <div style={{
                           background: 'rgba(255,255,255,0.05)',
                           border: '2px solid #FD1C0A',
                           borderRadius: '20px',
                           padding: '40px',
                           textAlign: 'center'
                        }}>
                           <i className="fa fa-exclamation-triangle" style={{ 
                              fontSize: '3.5rem', 
                              color: '#FD1C0A',
                              marginBottom: '20px',
                              display: 'block'
                           }}></i>
                           <h3 style={{ color: '#212529', fontWeight: 700, marginBottom: '12px' }}>
                              ⚠️ Error al Cargar
                           </h3>
                           <p style={{ color: '#6c757d', fontSize: '1.05rem', marginBottom: '24px' }}>{error}</p>
                           <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                              API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                           </p>
                           <button 
                              onClick={() => window.location.reload()}
                              style={{
                                 background: 'linear-gradient(135deg, #FD1C0A, #cc1608)',
                                 color: '#FFFFFF',
                                 padding: '14px 32px',
                                 borderRadius: '14px',
                                 fontWeight: 700,
                                 border: 'none',
                                 cursor: 'pointer',
                                 display: 'inline-flex',
                                 alignItems: 'center',
                                 gap: '10px',
                                 fontSize: '1rem',
                                 transition: 'all 0.3s ease'
                              }}
                           >
                              <i className="fa fa-refresh"></i> Reintentar
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <FooterOne />
         </>
      );
   }

   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Historia" sub_title="Historia" />
         
         <section className="about-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center mb-5">
                  <div className="col-lg-8 text-center">
                     <h6 className="sub-title" style={{ color: '#FD1C0A', fontWeight: 600 }}>
                        <i className="fa fa-book me-2"></i>INFORMACIÓN DE LA CARRERA
                     </h6>
                     <h2 className="title" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        {data?.institucion_nombre || 'SOCIOLOGÍA'}
                     </h2>
                     <p className="text-muted small">
                        <i className="fa fa-database me-1"></i>
                        API: {API_BASE_URL} | Institución: {INSTITUCION_ID}
                     </p>
                  </div>
               </div>

               {/* Tabs */}
               <div className="row justify-content-center mb-5">
                  <div className="col-lg-8">
                     <div className="nav nav-tabs justify-content-center" style={{ borderBottom: 'none' }}>
                        <button
                           onClick={() => setActiveTab('historia')}
                           className={`nav-link px-4 py-2 me-2 ${activeTab === 'historia' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'historia' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'historia' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Historia
                        </button>
                        <button
                           onClick={() => setActiveTab('mision')}
                           className={`nav-link px-4 py-2 me-2 ${activeTab === 'mision' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'mision' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'mision' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Misión
                        </button>
                        <button
                           onClick={() => setActiveTab('vision')}
                           className={`nav-link px-4 py-2 me-2 ${activeTab === 'vision' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'vision' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'vision' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Visión
                        </button>
                        <button
                           onClick={() => setActiveTab('objetivos')}
                           className={`nav-link px-4 py-2 ${activeTab === 'objetivos' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'objetivos' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'objetivos' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Objetivos
                        </button>
                     </div>
                  </div>
               </div>

               {/* Contenido */}
               <div className="row align-items-center">
                  <div className="col-lg-6 mb-4 mb-lg-0">
                     <div className="about-thumb" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        {/* ✅ REEMPLAZADO: <img> → <Image /> de Next.js */}
                        <Image
                           src={imageUrl}
                           alt={data?.institucion_nombre || "Historia Sociología UPEA"}
                           width={600}
                           height={400}
                           style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                           // ✅ No optimizar si es URL externa (MinIO)
                           unoptimized={imageUrl.startsWith('http://') || imageUrl.startsWith('https://')}
                           // ✅ Fallback si la imagen falla
                           onError={(e) => {
                              console.warn('⚠️ Error cargando imagen:', imageUrl);
                              const target = e.target as HTMLImageElement;
                              target.src = '/assets/img/about/historia.jpg';
                           }}
                           loading="lazy"
                        />
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="about-content">
                        <h3 className="mb-4" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>
                           Carrera de Sociología
                        </h3>
                        
                        <div className="content-section">
                           <div 
                              style={{ fontSize: '1rem', color: '#6c757d', lineHeight: '1.8' }}
                              dangerouslySetInnerHTML={{ 
                                 __html: getActiveContent()
                              }}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         
         <FooterOne />
      </>
   );
};

export default About;