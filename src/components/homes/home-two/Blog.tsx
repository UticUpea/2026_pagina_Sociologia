"use client"
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "dompurify";

// =============================================
// INTERFACES
// =============================================
interface PublicacionItem {
   publicaciones_id: number;
   publicaciones_titulo: string;
   publicaciones_imagen: string;
   publicaciones_descripcion: string;
   publicaciones_fecha: string;
   publicaciones_autor: string;
   // Propiedades alternativas por si la API devuelve otros nombres
   id?: number;
   titulo?: string;
   imagen?: string;
   descripcion?: string;
   fecha?: string;
   autor?: string;
   url_link?: string;
   tipo?: string;
}

// =============================================
// CONSTANTES - ID DE INSTITUCIÓN (NUEVO SERVIDOR)
// =============================================
// Según endpoint: https://apiadministrador.upea.bo/api/v2/institucionesPrincipal/35
const INSTITUCION_ID = "35"; // Sociología

// =============================================
// UTILIDADES DE SEGURIDAD Y FORMATO
// =============================================

/**
 * Construye URL de imagen desde el nuevo servidor
 */
const buildImageUrl = (fileName: string | null | undefined): string => {
   if (!fileName) return '/images/placeholder-publicacion.png';
   
   const cleanName = fileName.trim();
   
   // Si ya es URL absoluta
   if (cleanName.startsWith('http://') || cleanName.startsWith('https://')) {
      return cleanName;
   }
   
   // Usar proxy local con autenticación
   return `/api/recurso?file=${encodeURIComponent(cleanName)}`;
};

/**
 * Sanitiza contenido HTML para prevenir XSS
 */
const sanitizeHtml = (html: string | null | undefined): string => {
   if (!html) return "";
   try {
      return DOMPurify.sanitize(html, {
         ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'span'],
         ALLOWED_ATTR: ['class', 'style']
      });
   } catch {
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                 .replace(/on\w+="[^"]*"/gi, '')
                 .replace(/javascript:/gi, '');
   }
};

/**
 * Formatea fecha en español
 */
const formatDateES = (dateString: string | null | undefined): string => {
   if (!dateString) return "Sin fecha";
   
   try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleDateString("es-ES", {
         day: "numeric",
         month: "short",
         year: "numeric"
      });
   } catch {
      return "Sin fecha";
   }
};

/**
 * Trunca texto plano con límite de caracteres
 */
const truncateText = (text: string, maxLength: number = 100): string => {
   if (!text) return "";
   const clean = text.replace(/<[^>]*>/g, '').trim();
   return clean.length > maxLength 
      ? clean.substring(0, maxLength).trim() + "..." 
      : clean;
};

// =============================================
// SERVICIO: Obtener publicaciones/recursos
// =============================================
const getInstitucionRecursos = async (institucionId: string) => {
   try {
      // ✅ Llamada vía proxy local que ya incluye token y limpieza
      const response = await fetch(
         `/api/institucion?path=institucion/${institucionId}/recursos`,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
            cache: 'no-store'
         }
      );
      
      const data = await response.json();
      
      console.log('[Service] Respuesta recursos (Blog):', {
         status: response.status,
         ok: response.ok,
         data
      });
      
      return {
         data,
         status: response.status,
         ok: response.ok
      };
      
   } catch (error) {
      console.error('[Service] Error fetching recursos:', error);
      throw error;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const Blog: React.FC<{ style?: string }> = ({ style }) => {
   
   const [publicaciones, setPublicaciones] = useState<PublicacionItem[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGA DE DATOS - NUEVO SERVICIO API V2
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchPublicaciones = async () => {
         try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 [Blog] Cargando publicaciones para Sociología (ID: ${INSTITUCION_ID})...`);
            
            // ✅ Llamada al nuevo servicio con token (vía proxy)
            const response = await getInstitucionRecursos(INSTITUCION_ID);
            
            console.log('📡 [Blog] Respuesta completa:', response);
            
            // =============================================
            // CASO 1: Error 404 - Sin publicaciones (ESPERADO)
            // =============================================
            if (response.status === 404 || response.data?.statusCode === 404) {
               console.log('ℹ️ [Blog] Sin publicaciones disponibles (404 del nuevo servicio)');
               if (isMounted) {
                  setPublicaciones([]);
               }
               return;
            }
            
            // =============================================
            // CASO 2: Extraer publicaciones de la respuesta
            // =============================================
            // La API retorna: { upea_publicaciones: [...], linksExternoInterno: [...], links: [...] }
            let lista: PublicacionItem[] = [];
            
            // Prioridad 1: upea_publicaciones
            if (response.data?.upea_publicaciones && Array.isArray(response.data.upea_publicaciones)) {
               lista = response.data.upea_publicaciones;
            }
            // Prioridad 2: linksExternoInterno (adaptar estructura)
            else if (response.data?.linksExternoInterno && Array.isArray(response.data.linksExternoInterno)) {
               lista = response.data.linksExternoInterno.map((item: any) => ({
                  publicaciones_id: item.id_link ?? item.id ?? 0,
                  publicaciones_titulo: item.nombre ?? item.titulo ?? "Sin título",
                  publicaciones_imagen: item.imagen ?? item.foto_portada ?? "",
                  publicaciones_descripcion: item.descripcion ?? item.resumen ?? item.tipo ?? "",
                  publicaciones_fecha: item.fecha ?? "",
                  publicaciones_autor: item.autor ?? "",
                  url_link: item.url_link ?? "",
                  tipo: item.tipo ?? ""
               }));
            }
            // Prioridad 3: Array directo
            else if (Array.isArray(response.data)) {
               lista = response.data;
            }
            
            // Mapeo flexible para normalizar campos
            const normalized = lista.map((item: any): PublicacionItem => ({
               publicaciones_id: item.publicaciones_id ?? item.id_link ?? item.id ?? 0,
               publicaciones_titulo: String(item.publicaciones_titulo ?? item.nombre ?? item.titulo ?? "Sin título"),
               publicaciones_imagen: String(item.publicaciones_imagen ?? item.imagen ?? item.foto_portada ?? ""),
               publicaciones_descripcion: String(item.publicaciones_descripcion ?? item.descripcion ?? item.resumen ?? ""),
               publicaciones_fecha: String(item.publicaciones_fecha ?? item.fecha ?? ""),
               publicaciones_autor: String(item.publicaciones_autor ?? item.autor ?? "ADMIN"),
               url_link: item.url_link ?? item.link ?? "",
               tipo: item.tipo ?? ""
            }));
            
            if (isMounted) {
               setPublicaciones(normalized);
               console.log(`✅ [Blog] ${normalized.length} publicaciones cargadas exitosamente`);
            }
            
         } catch (err: any) {
            console.error("❌ [Blog] Error cargando publicaciones:", {
               message: err?.message,
               name: err?.name,
               status: err?.status
            });
            
            if (isMounted) {
               if (err?.status === 404) {
                  setPublicaciones([]);
               } else {
                  setError(err?.message || "Error al cargar las publicaciones");
                  setPublicaciones([]);
               }
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchPublicaciones();
      
      return () => { isMounted = false; };
      
   }, []); // ID fijo en constante

   // =============================================
   // PREPARAR PUBLICACIONES PARA RENDERIZAR (memoizado)
   // =============================================
   const displayedPublicaciones = useMemo(() => {
      // Mostrar máximo 6 publicaciones ordenadas por fecha (más recientes primero)
      return [...publicaciones]
         .sort((a, b) => {
            const dateA = a.publicaciones_fecha ? new Date(a.publicaciones_fecha).getTime() : 0;
            const dateB = b.publicaciones_fecha ? new Date(b.publicaciones_fecha).getTime() : 0;
            return dateB - dateA;
         })
         .slice(0, 6);
   }, [publicaciones]);

   // =============================================
   // ESTADOS DE UI
   // =============================================
   
   if (loading) {
      return (
         <section className={`blog-area pd-bottom-90 ${style ? "pd-top-120" : "pd-top-110"}`}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                     <div className="loading-spinner py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">Cargando publicaciones de Sociología...</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }
   
   if (error) {
      return (
         <section className={`blog-area pd-bottom-90 ${style ? "pd-top-120" : "pd-top-110"}`}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div className="alert alert-warning" role="alert" style={{ borderRadius: "12px" }}>
                        <div className="d-flex align-items-center">
                           <i className="fa fa-exclamation-triangle fa-2x me-3 text-warning"></i>
                           <div>
                              <h5 className="alert-heading mb-1">⚠️ Atención</h5>
                              <p className="mb-0">{error}</p>
                           </div>
                        </div>
                     </div>
                     <div className="text-center mt-4">
                        <button 
                           className="btn btn-outline-primary"
                           onClick={() => window.location.reload()}
                        >
                           <i className="fa fa-refresh me-2"></i> Reintentar carga
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   // =============================================
   // RENDERIZADO PRINCIPAL
   // =============================================
   return (
      <section className={`blog-area pd-bottom-90 ${style ? "pd-top-120" : "pd-top-110"}`}>
         <div className="container">
            
            {/* Header */}
            <div className="row justify-content-center mb-5">
               <div className="col-xl-6 col-lg-7">
                  <div className="section-title text-center">
                     <h6 
                        className={`sub-title ${style ? "style-btn" : "double-line"} mb-3`}
                        style={{ 
                           color: '#FD1C0A',
                           fontWeight: 600,
                           fontSize: '0.9rem',
                           textTransform: 'uppercase',
                           letterSpacing: '0.5px'
                        }}
                     >
                        📰 PUBLICACIONES
                     </h6>
                     <h2 
                        className="title mb-0" 
                        style={{ 
                           color: '#212529',
                           fontSize: '1.75rem',
                           fontWeight: 700
                        }}
                     >
                        Últimas Noticias de Sociología
                     </h2>
                     <p className="text-muted mt-2 small">
                        Mantente informado sobre las últimas actividades y logros de nuestra carrera
                     </p>
                  </div>
               </div>
            </div>
            
            {/* Grid de Publicaciones */}
            <div className="row justify-content-center g-4">
               
               {displayedPublicaciones.length === 0 && (
                  <div className="col-12 text-center py-5">
                     <div className="empty-state p-4" style={{ 
                        background: "#fff", 
                        borderRadius: "12px",
                        border: "2px dashed #dee2e6",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                     }}>
                        <i className="fa fa-newspaper-o display-4 text-muted mb-3"></i>
                        <h5 className="text-muted">Sin publicaciones disponibles</h5>
                        <p className="text-muted small mb-0">
                           Las noticias y publicaciones de Sociología se mostrarán aquí cuando estén disponibles.
                        </p>
                     </div>
                  </div>
               )}
               
               {displayedPublicaciones.map((pub, index) => {
                  const imageUrl = buildImageUrl(pub.publicaciones_imagen);
                  const sanitizedTitle = sanitizeHtml(pub.publicaciones_titulo);
                  const formattedDate = formatDateES(pub.publicaciones_fecha);
                  
                  return (
                     <div key={pub.publicaciones_id || index} className="col-lg-4 col-md-6">
                        <article 
                           className="single-blog-inner h-100"
                           style={{
                              background: "#fff",
                              borderRadius: "12px",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                              border: "1px solid rgba(0,0,0,0.05)",
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "420px",
                              transition: "transform 0.2s ease, box-shadow 0.2s ease"
                           }}
                           onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                           }}
                           onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                           }}
                        >
                           {/* Thumbnail con imagen y fecha */}
                           <div 
                              className="thumb position-relative"
                              style={{
                                 width: "100%",
                                 height: "220px",
                                 display: "flex",
                                 justifyContent: "center",
                                 alignItems: "center",
                                 overflow: "hidden",
                                 background: "#f8f9fa"
                              }}
                           >
                              <Image
                                 src={imageUrl}
                                 alt={pub.publicaciones_titulo || "Publicación de Sociología"}
                                 width={500}
                                 height={300}
                                 style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease"
                                 }}
                                 unoptimized={pub.publicaciones_imagen?.startsWith('http')}
                                 onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-publicacion.png';
                                 }}
                                 loading="lazy"
                              />
                              
                              {/* Badge de fecha */}
                              <span 
                                 className="date position-absolute top-0 end-0 m-3"
                                 style={{
                                    background: "linear-gradient(135deg, #FD1C0A, #FAB265)",
                                    color: "#fff",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    zIndex: 2
                                 }}
                              >
                                 <i className="fa fa-calendar me-1"></i>
                                 {formattedDate}
                              </span>
                           </div>
                           
                           {/* Contenido */}
                           <div className="details flex-grow-1 d-flex flex-column p-3">
                              
                              {/* Meta información */}
                              <ul className="blog-meta list-unstyled d-flex gap-2 mb-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                                 <li>
                                    <i className="fa fa-user me-1"></i> 
                                    BY <strong>{pub.publicaciones_autor}</strong>
                                 </li>
                                 <li>
                                    <i className="fa fa-folder-open-o me-1"></i> Sociología
                                 </li>
                              </ul>
                              
                              {/* Título con enlace */}
                              <h5 className="title mb-3" style={{ 
                                 fontSize: "1.1rem", 
                                 fontWeight: 600,
                                 lineHeight: 1.4,
                                 margin: 0,
                                 minHeight: "3.2em",
                                 display: "-webkit-box",
                                 WebkitLineClamp: 2,
                                 WebkitBoxOrient: "vertical",
                                 overflow: "hidden"
                              }}>
                                 <Link 
                                    href={pub.url_link || `/blog-details/${pub.publicaciones_id}`}
                                    target={pub.url_link?.startsWith('http') ? "_blank" : undefined}
                                    rel={pub.url_link?.startsWith('http') ? "noopener noreferrer" : undefined}
                                    className="text-decoration-none text-dark stretched-link"
                                    title={pub.publicaciones_titulo}
                                    style={{ color: "inherit" }}
                                    dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
                                 />
                              </h5>
                              
                              {/* Descripción truncada */}
                              {pub.publicaciones_descripcion && (
                                 <p 
                                    className="text-muted small mb-3 flex-grow-1"
                                    style={{
                                       display: "-webkit-box",
                                       WebkitLineClamp: 3,
                                       WebkitBoxOrient: "vertical",
                                       overflow: "hidden",
                                       lineHeight: 1.5
                                    }}
                                    dangerouslySetInnerHTML={{ 
                                       __html: truncateText(sanitizeHtml(pub.publicaciones_descripcion), 120) 
                                    }}
                                 />
                              )}
                              
                              {/* Botón READ MORE */}
                              <div className="mt-auto pt-2 border-top">
                                 <Link 
                                    href={pub.url_link || `/blog-details/${pub.publicaciones_id}`}
                                    target={pub.url_link?.startsWith('http') ? "_blank" : undefined}
                                    rel={pub.url_link?.startsWith('http') ? "noopener noreferrer" : undefined}
                                    className="read-more-text text-decoration-none"
                                    style={{ 
                                       color: '#FD1C0A',
                                       fontWeight: 600,
                                       fontSize: '0.85rem',
                                       textTransform: 'uppercase',
                                       letterSpacing: '0.5px',
                                       display: 'inline-flex',
                                       alignItems: 'center',
                                       gap: '4px',
                                       transition: 'gap 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
                                    onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
                                 >
                                    READ MORE <i className="fa fa-angle-right"></i>
                                 </Link>
                              </div>
                           </div>
                        </article>
                     </div>
                  );
               })}
            </div>
            
         </div>

         {/* =============================================
             ESTILOS CSS-IN-JS (scoped al componente)
             ============================================= */}
         <style jsx>{`
            .section-title .title {
               position: relative;
               padding-bottom: 12px;
            }
            
            .section-title .title::after {
               content: '';
               position: absolute;
               bottom: 0;
               left: 50%;
               transform: translateX(-50%);
               width: 70px;
               height: 3px;
               background: linear-gradient(90deg, #FD1C0A, #FAB265);
               border-radius: 2px;
            }
            
            .single-blog-inner:hover .thumb img {
               transform: scale(1.03);
            }
            
            .title a:hover {
               color: #FD1C0A !important;
            }
            
            .blog-meta {
               display: flex;
               flex-wrap: wrap;
               gap: 12px;
            }
            
            .blog-meta li {
               display: flex;
               align-items: center;
               gap: 4px;
            }
            
            .empty-state {
               padding: 40px 20px;
            }
            
            .loading-spinner {
               padding: 60px 20px;
            }
            
            @media (max-width: 768px) {
               .section-title .title {
                  font-size: 1.4rem !important;
               }
               .thumb {
                  height: 180px !important;
               }
               .title {
                  font-size: 1rem !important;
                  min-height: 2.8em !important;
               }
            }
         `}</style>
      </section>
   );
};

export default Blog;