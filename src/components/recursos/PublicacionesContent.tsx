"use client";
import React, { useEffect, useState } from 'react';
import HeaderOne from "@/layouts/headers/HeaderOne";
import Breadcrumb from "@/components/common/Breadcrumb";
import FooterOne from "@/layouts/footers/FooterOne";
import Image from 'next/image'; // ✅ IMPORTANTE: Asegurar import de Image

// =============================================
// INTERFACES
// =============================================
interface LinkExterno {
   id_link: number;
   imagen: string;
   nombre: string;
   url_link: string;
   estado: number;
   tipo: string;
}

interface Publicacion {
   id?: number;
   titulo?: string;
   descripcion?: string;
   imagen?: string;
   fecha?: string;
   archivo?: string;
   [key: string]: any;
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
  type: 'publicacion' | 'link' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'publicacion'
): string => {
  if (!imagePath) return '/images/placeholder.jpg';
  
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
    publicacion: '/storage/imagenes/publicaciones/',
    link: '/storage/imagenes/links/',
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

const formatDate = (dateString: string): string => {
   if (!dateString) return 'Fecha no disponible';
   return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   });
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const PublicacionesContent: React.FC = () => {
   const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
   const [linksExternos, setLinksExternos] = useState<LinkExterno[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchRecursos = async () => {
         try {
            console.log('🔄 [Publicaciones] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ URL y headers con variables de entorno
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/recursos`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
            };
            if (API_TOKEN) {
               headers['Authorization'] = `Bearer ${API_TOKEN}`;
            }
            
            const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
            
            if (response.ok) {
               const data = await response.json();
               console.log('✅ Recursos cargados:', {
                  publicaciones: data.upea_publicaciones?.length || 0,
                  links: data.linksExternoInterno?.length || 0
               });
               
               setPublicaciones(data.upea_publicaciones || []);
               setLinksExternos(data.linksExternoInterno || []);
            } else {
               console.error('❌ Error API:', response.status);
               setError(`Error ${response.status} al cargar recursos`);
            }
            
            setLoading(false);
         } catch (error: any) {
            console.error('❌ Error crítico:', error?.message);
            setError(error?.message || 'Error de conexión con el servidor');
            setLoading(false);
         }
      };

      fetchRecursos();
   }, []);

   if (loading) {
      return (
         <>
            <HeaderOne style_2={true} />
            <Breadcrumb title="Publicaciones" sub_title="Publicaciones" />
            <section className="publicaciones-area pd-top-120 pd-bottom-90">
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
            <Breadcrumb title="Publicaciones" sub_title="Publicaciones" />
            <section className="publicaciones-area pd-top-120 pd-bottom-90">
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
            <FooterOne />
         </>
      );
   }

   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Publicaciones" sub_title="Publicaciones" />
         
         <section className="publicaciones-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center mb-5">
                  <div className="col-lg-8 text-center">
                     <h6 className="sub-title" style={{ color: '#FD1C0A', fontWeight: 600 }}>
                        <i className="fa fa-book me-2"></i>RECURSOS Y PUBLICACIONES
                     </h6>
                     <h2 className="title" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Publicaciones de Sociología
                     </h2>
                     <p className="text-muted small">
                        <i className="fa fa-database me-1"></i>
                        API: {API_BASE_URL} | Institución: {INSTITUCION_ID}
                     </p>
                  </div>
               </div>

               {linksExternos.length > 0 && (
                  <div className="mb-5">
                     <h3 className="mb-4" style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: '#FD1C0A', 
                        borderBottom: '3px solid #FD1C0A', 
                        paddingBottom: '10px' 
                     }}>
                        <i className="fa fa-external-link me-2"></i>Enlaces de Interés
                     </h3>
                     <div className="row g-4">
                        {linksExternos.map((link) => {
                           // ✅ Construir URL de imagen inteligente
                           const imageUrl = buildImageUrl(link.imagen, 'link');
                           const isExternalImage = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
                           
                           return (
                              <div key={link.id_link} className="col-lg-4 col-md-6">
                                 <a 
                                    href={link.url_link.trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card h-100"
                                    style={{ 
                                       borderRadius: '12px', 
                                       overflow: 'hidden',
                                       boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                       border: '1px solid #e0e0e0',
                                       textDecoration: 'none',
                                       transition: 'transform 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                 >
                                    <div style={{ 
                                       width: '100%', 
                                       height: '150px', 
                                       background: '#f8f9fa', 
                                       display: 'flex',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       padding: '20px'
                                    }}>
                                       {/* ✅ REEMPLAZADO: <img> → <Image /> de Next.js (Línea ~265) */}
                                       <Image
                                          src={imageUrl}
                                          alt={link.nombre}
                                          width={200}
                                          height={150}
                                          style={{ 
                                             maxWidth: '100%', 
                                             maxHeight: '100%', 
                                             objectFit: 'contain' 
                                          }}
                                          // ✅ No optimizar si es URL externa (MinIO)
                                          unoptimized={isExternalImage}
                                          // ✅ Fallback si la imagen falla
                                          onError={(e) => {
                                             const target = e.target as HTMLImageElement;
                                             target.src = '/images/placeholder.jpg';
                                          }}
                                          loading="lazy"
                                       />
                                    </div>
                                    <div className="card-body p-4 text-center">
                                       <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#212529', marginBottom: '0.5rem' }}>
                                          {link.nombre}
                                       </h5>
                                       <span style={{ 
                                          fontSize: '0.85rem', 
                                          color: '#FD1C0A',
                                          background: '#fff3cd',
                                          padding: '4px 12px',
                                          borderRadius: '4px',
                                          fontWeight: 600
                                       }}>
                                          {link.tipo}
                                       </span>
                                    </div>
                                 </a>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               )}

               {publicaciones.length > 0 ? (
                  <div>
                     <h3 className="mb-4" style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: '#FAB265', 
                        borderBottom: '3px solid #FAB265', 
                        paddingBottom: '10px' 
                     }}>
                        <i className="fa fa-file-text me-2"></i>Publicaciones ({publicaciones.length})
                     </h3>
                     <div className="row g-4">
                        {publicaciones.map((pub, index) => {
                           // ✅ Construir URL de imagen inteligente
                           const imageUrl = pub.imagen ? buildImageUrl(pub.imagen, 'publicacion') : '';
                           const isExternalImage = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
                           
                           return (
                              <div key={pub.id || index} className="col-lg-4 col-md-6">
                                 <article className="card h-100" style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    background: '#fff',
                                    border: '1px solid #e0e0e0',
                                    transition: 'transform 0.3s ease'
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                 >
                                    {pub.imagen && (
                                       <div style={{ width: '100%', height: '200px', background: '#f8f9fa', overflow: 'hidden' }}>
                                          {/* ✅ REEMPLAZADO: <img> → <Image /> de Next.js (Línea ~331) */}
                                          <Image
                                             src={imageUrl}
                                             alt={pub.titulo || 'Publicación'}
                                             width={500}
                                             height={300}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                             // ✅ No optimizar si es URL externa (MinIO)
                                             unoptimized={isExternalImage}
                                             // ✅ Fallback si la imagen falla
                                             onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/placeholder.jpg';
                                             }}
                                             loading="lazy"
                                          />
                                       </div>
                                    )}
                                    <div className="card-body p-4">
                                       <h5 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#212529' }}>
                                          {pub.titulo || 'Sin título'}
                                       </h5>
                                       {pub.descripcion && (
                                          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '1rem', lineHeight: '1.5' }}
                                             dangerouslySetInnerHTML={{ 
                                                __html: pub.descripcion.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                                             }}
                                          />
                                       )}
                                       {pub.fecha && (
                                          <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '1rem' }}>
                                             <i className="fa fa-calendar me-2" style={{ color: '#FD1C0A' }}></i>
                                             {formatDate(pub.fecha)}
                                          </div>
                                       )}
                                    </div>
                                 </article>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               ) : (
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <div className="alert alert-info text-center p-5" style={{ borderRadius: '12px', background: '#d1ecf1', border: '1px solid #bee5eb' }}>
                           <i className="fa fa-book fa-3x mb-3" style={{ color: '#17a2b8' }}></i>
                           <h5 className="text-info mb-3">No hay publicaciones disponibles</h5>
                           <p className="mb-0 text-muted">Las publicaciones de Sociología se mostrarán aquí cuando estén disponibles.</p>
                           <p className="text-muted small mt-2">
                              API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                           </p>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </section>
         
         <FooterOne />
      </>
   );
};

export default PublicacionesContent;