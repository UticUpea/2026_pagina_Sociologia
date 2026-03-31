/* si lo usamos */
"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// =============================================
// INTERFACES
// =============================================
interface EventoItem {
   evento_id: number;
   evento_titulo: string;
   evento_imagen: string;
   evento_descripcion: string;
   evento_fecha: string;
   evento_hora: string;
   evento_lugar: string;
}

interface ApiErrorResponse {
   statusCode: number;
   message: string;
   path: string;
   timestamp: string;
}

// =============================================
// CONSTANTES - ID DE INSTITUCIÓN (NUEVO SERVIDOR)
// =============================================
// Según endpoint: https://apiadministrador.upea.bo/api/v2/institucionesPrincipal/35
const INSTITUCION_ID = "35"; // Sociología

// =============================================
// UTILIDADES
// =============================================

/**
 * Construye URL de imagen desde el nuevo servidor
 */
const buildImageUrl = (fileName: string | null | undefined): string => {
   if (!fileName) return '/images/placeholder-event.jpg';
   
   const cleanName = fileName.trim();
   
   // Si ya es URL absoluta
   if (cleanName.startsWith('http://') || cleanName.startsWith('https://')) {
      return cleanName;
   }
   
   // Usar proxy local con autenticación
   return `/api/recurso?file=${encodeURIComponent(cleanName)}`;
};

/**
 * Formatea fecha en español
 */
const formatDateES = (dateString: string | null | undefined): string => {
   if (!dateString) return "Sin fecha definida";
   
   try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleDateString("es-ES", {
         day: "numeric",
         month: "long",
         year: "numeric"
      });
   } catch {
      return "Sin fecha definida";
   }
};

/**
 * Limpia HTML eliminando etiquetas (sanitización básica)
 */
const cleanHtml = (html: string): string => {
   if (!html) return "";
   try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
   } catch {
      return html.replace(/<[^>]*>/g, '');
   }
};

// =============================================
// SERVICIO: Obtener eventos/gaceta
// =============================================
const getInstitucionGacetaEventos = async (institucionId: string) => {
   try {
      const response = await fetch(
         `/api/institucion?path=institucion/${institucionId}/gacetaEventos`,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );
      
      const data = await response.json();
      
      console.log('[Service] Respuesta eventos:', {
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
      console.error('[Service] Error fetching eventos:', error);
      throw error;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const BlogDetailsArea: React.FC = () => {
   
   const [eventos, setEventos] = useState<EventoItem[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGA DE DATOS - NUEVO SERVICIO API V2
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchEventos = async () => {
         try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 [BlogDetails] Cargando eventos para Sociología (ID: ${INSTITUCION_ID})...`);
            
            // ✅ Llamada al nuevo servicio con token (vía proxy)
            const response = await getInstitucionGacetaEventos(INSTITUCION_ID);
            
            console.log('📡 [BlogDetails] Respuesta completa:', response);
            
            // =============================================
            // CASO 1: Error 404 - Sin eventos (ESPERADO)
            // =============================================
            if (response.status === 404 || response.data?.statusCode === 404) {
               console.log('ℹ️ [BlogDetails] Sin eventos disponibles (404 del nuevo servicio)');
               if (isMounted) {
                  setEventos([]);
               }
               return;
            }
            
            // =============================================
            // CASO 2: Respuesta con array "upea_evento"
            // =============================================
            if (response.data?.upea_evento && Array.isArray(response.data.upea_evento)) {
               const lista = response.data.upea_evento.map((item: any): EventoItem => ({
                  evento_id: item.evento_id ?? item.id ?? item.idEvento ?? 0,
                  evento_titulo: String(item.evento_titulo ?? item.titulo ?? item.nombre ?? "Sin título"),
                  evento_imagen: String(item.evento_imagen ?? item.imagen ?? item.foto ?? item.portada ?? ""),
                  evento_descripcion: String(item.evento_descripcion ?? item.descripcion ?? item.resumen ?? ""),
                  evento_fecha: String(item.evento_fecha ?? item.fecha ?? item.fechaEvento ?? item.fechaInicio ?? ""),
                  evento_hora: String(item.evento_hora ?? item.hora ?? item.horaInicio ?? ""),
                  evento_lugar: String(item.evento_lugar ?? item.lugar ?? item.ubicacion ?? "")
               }));
               
               if (isMounted) {
                  setEventos(lista);
                  console.log(`✅ [BlogDetails] ${lista.length} eventos cargados exitosamente`);
               }
               return;
            }
            
            // =============================================
            // CASO 3: Array directo en response.data
            // =============================================
            if (Array.isArray(response.data)) {
               const lista = response.data.map((item: any): EventoItem => ({
                  evento_id: item.evento_id ?? item.id ?? 0,
                  evento_titulo: String(item.evento_titulo ?? item.titulo ?? "Sin título"),
                  evento_imagen: String(item.evento_imagen ?? item.imagen ?? ""),
                  evento_descripcion: String(item.evento_descripcion ?? item.descripcion ?? ""),
                  evento_fecha: String(item.evento_fecha ?? item.fecha ?? ""),
                  evento_hora: String(item.evento_hora ?? item.hora ?? ""),
                  evento_lugar: String(item.evento_lugar ?? item.lugar ?? "")
               }));
               
               if (isMounted) {
                  setEventos(lista);
               }
               return;
            }
            
            // =============================================
            // CASO 4: Respuesta vacía o sin datos válidos
            // =============================================
            console.warn('⚠️ [BlogDetails] Formato de respuesta no reconocido:', response);
            if (isMounted) {
               setEventos([]);
            }
            
         } catch (err: any) {
            console.error("❌ [BlogDetails] Error cargando eventos:", {
               message: err?.message,
               name: err?.name,
               status: err?.status
            });
            
            if (isMounted) {
               if (err?.status === 404) {
                  setEventos([]);
               } else {
                  setError(err?.message || "Error al cargar los eventos");
                  setEventos([]);
               }
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchEventos();
      
      return () => { isMounted = false; };
      
   }, []); // ID fijo en constante

   // =============================================
   // ESTADOS DE UI
   // =============================================
   if (loading) {
      return (
         <div className="blog-area pd-top-120 pd-bottom-120">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                     <div className="loading-spinner">
                        <div className="spinner-border text-primary" role="status">
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">Cargando eventos de Sociología...</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
   
   if (error && eventos.length === 0) {
      return (
         <div className="blog-area pd-top-120 pd-bottom-120">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                     <div className="alert alert-warning" role="alert">
                        <i className="fa fa-exclamation-triangle me-2"></i>
                        <strong>Atención:</strong> {error}
                     </div>
                     <button 
                        className="btn btn-outline-primary mt-3"
                        onClick={() => window.location.reload()}
                     >
                        <i className="fa fa-refresh me-1"></i> Reintentar
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // =============================================
   // RENDERIZADO
   // =============================================
   return (
      <div className="blog-area pd-top-120 pd-bottom-120">
         <div className="container">
            <div className="row">
               
               {eventos.length === 0 && (
                  <div className="col-12 text-center py-5">
                     <div className="empty-state">
                        <i className="fa fa-calendar-times-o display-4 text-muted mb-3"></i>
                        <h5 className="text-muted">No hay eventos publicados</h5>
                        <p className="text-muted small mb-0">
                           Los eventos y actividades de Sociología se mostrarán aquí cuando estén disponibles.
                        </p>
                     </div>
                  </div>
               )}
               
               {eventos.map((evento) => (
                  <div
                     key={evento.evento_id}
                     className="col-lg-4 mb-4"
                     style={{ minWidth: "320px", maxWidth: "400px" }}
                  >
                     <article className="blog-details-page-content h-100">
                        <div className="single-blog-inner style-border h-100 d-flex flex-column">
                           
                           {/* Thumbnail con imagen */}
                           <div className="thumb position-relative">
                              <Image
                                 src={buildImageUrl(evento.evento_imagen)}
                                 alt={`Evento: ${evento.evento_titulo}`}
                                 width={500}
                                 height={300}
                                 className="fixed-image"
                                 style={{ objectFit: "cover" }}
                                 unoptimized={evento.evento_imagen?.startsWith('http')}
                                 onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-event.jpg';
                                 }}
                                 loading="lazy"
                              />
                              {/* Badge de fecha */}
                              {evento.evento_fecha && (
                                 <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                                    <i className="fa fa-calendar me-1"></i>
                                    {new Date(evento.evento_fecha).toLocaleDateString("es-ES", {
                                       day: "2-digit", month: "short"
                                    })}
                                 </span>
                              )}
                           </div>
                           
                           {/* Contenido */}
                           <div className="details flex-grow-1 d-flex flex-column">
                              
                              {/* Meta información */}
                              <ul className="blog-meta list-unstyled d-flex gap-2 mb-2 flex-wrap">
                                 <li className="text-muted small">
                                    <i className="fa fa-user me-1" aria-hidden="true"></i>
                                    Sociología UPEA
                                 </li>
                                 <li className="text-muted small">
                                    <i className="fa fa-calendar-check-o me-1" aria-hidden="true"></i>
                                    <span>{formatDateES(evento.evento_fecha)}</span>
                                 </li>
                                 {evento.evento_hora && (
                                    <li className="text-muted small">
                                       <i className="fa fa-clock-o me-1" aria-hidden="true"></i>
                                       <span>{evento.evento_hora}</span>
                                    </li>
                                 )}
                              </ul>
                              
                              {/* Título */}
                              <h3 className="title mb-3">
                                 <Link 
                                    href={`/evento/${evento.evento_id}`} 
                                    className="text-decoration-none text-dark stretched-link"
                                    title={evento.evento_titulo}
                                 >
                                    {evento.evento_titulo}
                                 </Link>
                              </h3>
                              
                              {/* Descripción limpia */}
                              {evento.evento_descripcion && (
                                 <p className="text-muted mb-3 flex-grow-1 text-limit">
                                    {cleanHtml(evento.evento_descripcion)}
                                 </p>
                              )}
                              
                              {/* Lugar si existe */}
                              {evento.evento_lugar && (
                                 <p className="text-muted small mb-3">
                                    <i className="fa fa-map-marker me-1"></i>
                                    {evento.evento_lugar}
                                 </p>
                              )}
                              
                              {/* Botón de acción */}
                              <div className="mt-auto">
                                 <Link 
                                    href={`/evento/${evento.evento_id}`}
                                    className="btn btn-sm btn-outline-primary"
                                 >
                                    Ver más detalles <i className="fa fa-arrow-right ms-1"></i>
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </article>
                  </div>
               ))}
               
               {/* Sidebar placeholder (opcional) */}
               <div className="col-lg-4 col-12 d-none d-lg-block">
                  {/* <BlogSidebar /> */}
               </div>
            </div>
         </div>

         {/* =============================================
             ESTILOS CSS-IN-JS
             ============================================= */}
         <style jsx>{`
            .single-blog-inner {
               height: 100%;
               padding: 15px;
               background: #fff;
               border-radius: 12px;
               box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
               transition: transform 0.2s ease, box-shadow 0.2s ease;
               border: 1px solid rgba(0,0,0,0.05);
            }
            
            .single-blog-inner:hover {
               transform: translateY(-4px);
               box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }

            .details {
               padding: 16px 8px 8px;
            }

            .text-limit {
               display: -webkit-box;
               -webkit-line-clamp: 4;
               -webkit-box-orient: vertical;
               overflow: hidden;
               text-overflow: ellipsis;
               line-height: 1.5;
               max-height: 6em;
            }

            .blog-meta {
               font-size: 13px;
               color: #6c757d;
            }

            .title {
               font-size: 1.1rem;
               font-weight: 600;
               line-height: 1.4;
               margin: 0;
            }
            
            .title a:hover {
               color: #0d6efd !important;
            }

            .thumb {
               width: 100%;
               height: 200px;
               display: flex;
               justify-content: center;
               align-items: center;
               overflow: hidden;
               border-radius: 8px;
               background: #f8f9fa;
               position: relative;
            }

            .fixed-image {
               width: 100%;
               height: 100%;
               transition: transform 0.3s ease;
            }
            
            .single-blog-inner:hover .fixed-image {
               transform: scale(1.03);
            }
            
            .empty-state {
               padding: 40px 20px;
               background: #f8f9fa;
               border-radius: 12px;
               border: 2px dashed #dee2e6;
            }
            
            .loading-spinner {
               padding: 60px 20px;
            }
            
            @media (max-width: 768px) {
               .thumb {
                  height: 180px;
               }
               .title {
                  font-size: 1rem;
               }
               .text-limit {
                  -webkit-line-clamp: 3;
                  max-height: 4.5em;
               }
            }
         `}</style>
      </div>
   );
};

export default BlogDetailsArea;