/* si lo usamos convocatorias */
"use client"
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Componentes locales (ajusta la ruta según tu estructura)
import CourseDetailsSidebar from "./CourseDetailsSidebar";
import CourseDetailsNavTab from "./CourseDetailsNavTab";

// =============================================
// INTERFACES
// =============================================
interface ConvocatoriaItem {
   idconvocatorias: number;
   con_titulo: string;
   con_foto_portada: string;
   con_descripcion: string;
   con_fecha_inicio: string;
   con_fecha_fin: string;
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
   if (!fileName) return '/images/placeholder-convocatoria.png';
   
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
 * Trunca texto con límite de caracteres
 */
const truncateText = (text: string, maxLength: number = 100): string => {
   if (!text) return "";
   const clean = text.replace(/<[^>]*>/g, '').trim();
   return clean.length > maxLength 
      ? clean.substring(0, maxLength).trim() + "..." 
      : clean;
};

/**
 * Calcula estado de convocatoria según fechas
 */
const getConvocatoriaStatus = (fechaInicio: string, fechaFin: string): { label: string; class: string } => {
   const hoy = new Date();
   const inicio = new Date(fechaInicio);
   const fin = new Date(fechaFin);
   
   if (hoy < inicio) {
      return { label: "Próximamente", class: "bg-secondary" };
   } else if (hoy >= inicio && hoy <= fin) {
      return { label: "Abierta", class: "bg-success" };
   } else {
      return { label: "Cerrada", class: "bg-danger" };
   }
};

// =============================================
// SERVICIO: Obtener convocatorias
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
      
      console.log('[Service] Respuesta convocatorias:', {
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
      console.error('[Service] Error fetching convocatorias:', error);
      throw error;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const CourseDetailsArea: React.FC = () => {
   
   const [convocatorias, setConvocatorias] = useState<ConvocatoriaItem[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGA DE DATOS - NUEVO SERVICIO API V2
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchConvocatorias = async () => {
         try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 [CourseDetails] Cargando convocatorias para Sociología (ID: ${INSTITUCION_ID})...`);
            
            // ✅ Llamada al nuevo servicio con token (vía proxy)
            const response = await getInstitucionGacetaEventos(INSTITUCION_ID);
            
            console.log('📡 [CourseDetails] Respuesta completa:', response);
            
            // =============================================
            // CASO 1: Error 404 - Sin convocatorias (ESPERADO)
            // =============================================
            if (response.status === 404 || response.data?.statusCode === 404) {
               console.log('ℹ️ [CourseDetails] Sin convocatorias disponibles (404 del nuevo servicio)');
               if (isMounted) {
                  setConvocatorias([]);
               }
               return;
            }
            
            // =============================================
            // CASO 2: Respuesta con array "convocatorias"
            // =============================================
            if (response.data?.convocatorias && Array.isArray(response.data.convocatorias)) {
               const lista = response.data.convocatorias.map((item: any): ConvocatoriaItem => ({
                  idconvocatorias: item.idconvocatorias ?? item.id ?? item.idConvocatoria ?? 0,
                  con_titulo: String(item.con_titulo ?? item.titulo ?? item.nombre ?? "Sin título"),
                  con_foto_portada: String(item.con_foto_portada ?? item.foto_portada ?? item.imagen ?? item.portada ?? ""),
                  con_descripcion: String(item.con_descripcion ?? item.descripcion ?? item.resumen ?? ""),
                  con_fecha_inicio: String(item.con_fecha_inicio ?? item.fecha_inicio ?? item.fechaPublicacion ?? ""),
                  con_fecha_fin: String(item.con_fecha_fin ?? item.fecha_fin ?? item.fechaCierre ?? "")
               }));
               
               if (isMounted) {
                  setConvocatorias(lista);
                  console.log(`✅ [CourseDetails] ${lista.length} convocatorias cargadas exitosamente`);
               }
               return;
            }
            
            // =============================================
            // CASO 3: Array directo en response.data
            // =============================================
            if (Array.isArray(response.data)) {
               const lista = response.data.map((item: any): ConvocatoriaItem => ({
                  idconvocatorias: item.idconvocatorias ?? item.id ?? 0,
                  con_titulo: String(item.con_titulo ?? item.titulo ?? "Sin título"),
                  con_foto_portada: String(item.con_foto_portada ?? item.imagen ?? ""),
                  con_descripcion: String(item.con_descripcion ?? item.descripcion ?? ""),
                  con_fecha_inicio: String(item.con_fecha_inicio ?? item.fecha_inicio ?? ""),
                  con_fecha_fin: String(item.con_fecha_fin ?? item.fecha_fin ?? "")
               }));
               
               if (isMounted) {
                  setConvocatorias(lista);
               }
               return;
            }
            
            // =============================================
            // CASO 4: Respuesta vacía o sin datos válidos
            // =============================================
            console.warn('⚠️ [CourseDetails] Formato de respuesta no reconocido:', response);
            if (isMounted) {
               setConvocatorias([]);
            }
            
         } catch (err: any) {
            console.error("❌ [CourseDetails] Error cargando convocatorias:", {
               message: err?.message,
               name: err?.name,
               status: err?.status
            });
            
            if (isMounted) {
               if (err?.status === 404) {
                  setConvocatorias([]);
               } else {
                  setError(err?.message || "Error al cargar las convocatorias");
                  setConvocatorias([]);
               }
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchConvocatorias();
      
      return () => { isMounted = false; };
      
   }, []); // ID fijo en constante

   // =============================================
   // PREPARAR CONVOCATORIAS RELACIONADAS (memoizado)
   // =============================================
   const relatedConvocatorias = useMemo(() => {
      // Mostrar máximo 3 convocatorias relacionadas (excluyendo la actual si estamos en detalle)
      return convocatorias.slice(0, 3);
   }, [convocatorias]);

   // =============================================
   // ESTADOS DE UI
   // =============================================
   if (loading) {
      return (
         <section className="course-single-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                     <div className="loading-spinner">
                        <div className="spinner-border text-primary" role="status">
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">Cargando convocatorias de Sociología...</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }
   
   if (error && convocatorias.length === 0) {
      return (
         <section className="course-single-area pd-top-120 pd-bottom-90">
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
         </section>
      );
   }

   // =============================================
   // RENDERIZADO
   // =============================================
   return (
      <section className="course-single-area pd-top-120 pd-bottom-90">
         <div className="container">
            <div className="row">
               
               {/* Columna principal - Contenido de detalle */}
               <div className="col-lg-8">
                  <article className="course-course-detaila-inner">
                     
                     {/* Tabs de navegación (componente existente) */}
                     <CourseDetailsNavTab />
                     
                     {/* Contenido principal de la convocatoria (placeholder - personalizar según necesidad) */}
                     <div className="course-content mt-4 p-4" style={{ 
                        background: "#fff", 
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
                     }}>
                        <h4 className="mb-3">
                           <i className="fa fa-info-circle text-primary me-2"></i>
                           Detalles de la Convocatoria
                        </h4>
                        <p className="text-muted">
                           Seleccione una convocatoria de la sección "Otros Comunicados" para ver sus detalles completos, 
                           requisitos, fechas importantes y proceso de postulación.
                        </p>
                        <div className="alert alert-info">
                           <i className="fa fa-lightbulb-o me-2"></i>
                           <strong>Nota:</strong> Las convocatorias se actualizan periódicamente. 
                           Verifique las fechas de inicio y fin para participar.
                        </div>
                     </div>
                     
                  </article>
               </div>
               
               {/* Sidebar - Componente existente */}
               <CourseDetailsSidebar />
               
            </div>

            {/* =============================================
                SECCIÓN: OTROS COMUNICADOS (Convocatorias relacionadas)
                ============================================= */}
            <div className="row justify-content-center pd-top-100" style={{ maxWidth: '1200px', margin: '0 auto' }}>
               
               <div className="col-12 mb-4">
                  <h2 className="section-title text-center">
                     <i className="fa fa-newspaper-o text-primary me-2"></i>
                     OTROS COMUNICADOS
                  </h2>
                  <p className="text-muted text-center small">
                     Convocatorias y anuncios recientes de la Carrera de Sociología
                  </p>
               </div>
               
               {relatedConvocatorias.length === 0 && (
                  <div className="col-12 text-center py-4">
                     <div className="empty-state p-4" style={{ 
                        background: "#f8f9fa", 
                        borderRadius: "12px",
                        border: "2px dashed #dee2e6"
                     }}>
                        <i className="fa fa-folder-open-o display-4 text-muted mb-3"></i>
                        <h5 className="text-muted">Sin comunicados adicionales</h5>
                        <p className="text-muted small mb-0">
                           No hay más convocatorias para mostrar en este momento.
                        </p>
                     </div>
                  </div>
               )}
               
               {relatedConvocatorias.map((convocatoria) => {
                  const status = getConvocatoriaStatus(convocatoria.con_fecha_inicio, convocatoria.con_fecha_fin);
                  const imageUrl = buildImageUrl(convocatoria.con_foto_portada);
                  
                  return (
                     <div key={convocatoria.idconvocatorias} className="col-lg-4 col-md-6 mb-4">
                        <article 
                           className="single-course-inner h-100"
                           style={{
                              background: "#fff",
                              borderRadius: "12px",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                              border: "1px solid rgba(0,0,0,0.05)",
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "480px",
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
                           {/* Thumbnail con imagen y badge de estado */}
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
                                 alt={convocatoria.con_titulo || "Convocatoria"}
                                 width={500}
                                 height={300}
                                 style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease"
                                 }}
                                 unoptimized={convocatoria.con_foto_portada?.startsWith('http')}
                                 onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-convocatoria.png';
                                 }}
                                 loading="lazy"
                              />
                              
                              {/* Badge de estado */}
                              <span className={`badge position-absolute top-0 start-0 m-3 ${status.class}`} style={{ zIndex: 1 }}>
                                 {status.label}
                              </span>
                              
                              {/* Badge de fecha */}
                              {convocatoria.con_fecha_inicio && (
                                 <span className="badge bg-primary position-absolute top-0 end-0 m-3" style={{ zIndex: 1 }}>
                                    <i className="fa fa-calendar me-1"></i>
                                    {new Date(convocatoria.con_fecha_inicio).toLocaleDateString("es-ES", {
                                       day: "2-digit", month: "short"
                                    })}
                                 </span>
                              )}
                           </div>
                           
                           {/* Contenido */}
                           <div className="details flex-grow-1 d-flex flex-column p-3">
                              
                              {/* Título con enlace */}
                              <h6 className="title mb-3" style={{ 
                                 fontSize: "1.05rem", 
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
                                    href={`/convocatoria/${convocatoria.idconvocatorias}`} 
                                    className="text-decoration-none text-dark stretched-link"
                                    title={convocatoria.con_titulo}
                                    style={{ color: "inherit" }}
                                 >
                                    {truncateText(convocatoria.con_titulo.replace(/<[^>]*>/g, ''), 50)}
                                 </Link>
                              </h6>
                              
                              {/* Fechas */}
                              <div className="convocatoria-dates mb-3" style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                                 <div className="d-flex align-items-center mb-1">
                                    <i className="fa fa-play-circle text-success me-2" style={{ width: "16px" }}></i>
                                    <strong>Inicio:</strong> <span className="ms-1">{formatDateES(convocatoria.con_fecha_inicio)}</span>
                                 </div>
                                 <div className="d-flex align-items-center">
                                    <i className="fa fa-stop-circle text-danger me-2" style={{ width: "16px" }}></i>
                                    <strong>Fin:</strong> <span className="ms-1">{formatDateES(convocatoria.con_fecha_fin)}</span>
                                 </div>
                              </div>
                              
                              {/* Descripción truncada */}
                              {convocatoria.con_descripcion && (
                                 <p className="text-muted small mb-3 flex-grow-1" style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.4
                                 }}>
                                    {truncateText(convocatoria.con_descripcion, 110)}
                                 </p>
                              )}
                              
                              {/* Botón de acción */}
                              <div className="mt-auto pt-2 border-top">
                                 <Link 
                                    href={`/convocatoria/${convocatoria.idconvocatorias}`}
                                    className="btn btn-sm btn-outline-primary w-100"
                                    style={{ borderRadius: "6px" }}
                                 >
                                    Ver detalles <i className="fa fa-arrow-right ms-1"></i>
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
            .section-title {
               font-size: 1.5rem;
               font-weight: 700;
               color: #212529;
               position: relative;
               padding-bottom: 12px;
            }
            
            .section-title::after {
               content: '';
               position: absolute;
               bottom: 0;
               left: 50%;
               transform: translateX(-50%);
               width: 80px;
               height: 3px;
               background: #0d6efd;
               border-radius: 2px;
            }
            
            .single-course-inner:hover .thumb img {
               transform: scale(1.03);
            }
            
            .title a:hover {
               color: #0d6efd !important;
            }
            
            .convocatoria-dates strong {
               min-width: 50px;
               color: #495057;
            }
            
            .empty-state {
               padding: 40px 20px;
            }
            
            .loading-spinner {
               padding: 60px 20px;
            }
            
            @media (max-width: 768px) {
               .section-title {
                  font-size: 1.25rem;
               }
               .thumb {
                  height: 180px !important;
               }
               .title {
                  font-size: 1rem !important;
                  min-height: 2.8em !important;
               }
               .convocatoria-dates {
                  font-size: 0.8rem !important;
               }
            }
         `}</style>
      </section>
   );
};

export default CourseDetailsArea;