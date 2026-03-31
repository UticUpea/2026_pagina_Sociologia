/* SI LO USAMOS */
"use client"
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// =============================================
// INTERFACES
// =============================================
interface InstitucionData {
   institucion_id: number;
   institucion_nombre: string;
   institucion_mision: string;
   institucion_objetivos: string;
   institucion_vision: string;
   institucion_logo: string;
   institucion_sobre_ins: string;
   institucion_historia: string;
}

interface InstitucionResponse {
   Descripcion?: InstitucionData;
   institucion_mision?: string;
   institucion_vision?: string;
   institucion_objetivos?: string;
}

interface TestimonialItem {
   id: number;
   titulo: string;
   texto: string;
   icono: string;
}

// =============================================
// CONSTANTES - ID DE INSTITUCIÓN (NUEVO SERVIDOR)
// =============================================
// Según endpoint: https://apiadministrador.upea.bo/api/v2/institucionesPrincipal/35
const INSTITUCION_ID = "35"; // Sociología

// =============================================
// CONFIGURACIÓN DEL SLIDER
// =============================================
const sliderSettings = {
   infinite: true,
   speed: 1500,
   slidesToShow: 3,
   slidesToScroll: 1,
   centerMode: true,
   centerPadding: '0',
   dots: false,
   arrows: false,
   autoplay: true,
   autoplaySpeed: 5000,
   pauseOnHover: true,
   responsive: [
      {
         breakpoint: 1200,
         settings: { slidesToShow: 3 }
      },
      {
         breakpoint: 992,
         settings: { slidesToShow: 2 }
      },
      {
         breakpoint: 600,
         settings: { slidesToShow: 1 }
      }
   ]
};

// =============================================
// UTILIDADES
// =============================================

/**
 * Sanitiza HTML eliminando etiquetas (prevención XSS básica)
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

/**
 * Trunca texto con límite de caracteres y ellipsis
 */
const truncateText = (text: string, maxLength: number = 200): string => {
   if (!text) return "";
   const clean = cleanHtml(text);
   return clean.length > maxLength 
      ? clean.substring(0, maxLength).trim() + "..." 
      : clean;
};

// =============================================
// SERVICIO: Obtener datos de institución
// =============================================
const getInstitucionPrincipal = async (institucionId: string) => {
   try {
      const response = await fetch(
         `/api/institucion?path=institucionesPrincipal/${institucionId}`,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         }
      );
      
      const data = await response.json();
      
      console.log('[Service] Respuesta institución:', {
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
      console.error('[Service] Error fetching institución:', error);
      throw error;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const CommonTestimonial: React.FC = () => {
   
   const [institucion, setInstitucion] = useState<InstitucionData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGA DE DATOS - NUEVO SERVICIO API V2
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchInstitucion = async () => {
         try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 [CommonTestimonial] Cargando datos de Sociología (ID: ${INSTITUCION_ID})...`);
            
            // ✅ Llamada al nuevo servicio con token (vía proxy)
            const response = await getInstitucionPrincipal(INSTITUCION_ID);
            
            console.log('📡 [CommonTestimonial] Respuesta completa:', response);
            
            // =============================================
            // CASO 1: Error 404 - Sin datos (ESPERADO)
            // =============================================
            if (response.status === 404 || response.data?.statusCode === 404) {
               console.log('ℹ️ [CommonTestimonial] Sin datos de institución disponibles (404 del nuevo servicio)');
               if (isMounted) {
                  setInstitucion(null);
               }
               return;
            }
            
            // =============================================
            // CASO 2: Extraer datos de la respuesta
            // =============================================
            // La API retorna: { Descripcion: { ... } } o directamente los datos
            let datos: InstitucionData | null = null;
            
            if (response.data?.Descripcion && typeof response.data.Descripcion === 'object') {
               datos = response.data.Descripcion as InstitucionData;
            } else if (response.data?.institucion_id) {
               datos = response.data as InstitucionData;
            } else if (typeof response.data === 'object' && response.data !== null) {
               // Buscar campos clave en cualquier nivel
               const possibleData = response.data;
               if (possibleData.institucion_mision || possibleData.institucion_vision) {
                  datos = possibleData as InstitucionData;
               }
            }
            
            if (isMounted) {
               if (datos) {
                  setInstitucion(datos);
                  console.log('✅ [CommonTestimonial] Datos de institución cargados exitosamente');
               } else {
                  console.warn('⚠️ [CommonTestimonial] No se encontraron datos válidos en la respuesta');
                  setInstitucion(null);
               }
            }
            
         } catch (err: any) {
            console.error("❌ [CommonTestimonial] Error cargando institución:", {
               message: err?.message,
               name: err?.name,
               status: err?.status
            });
            
            if (isMounted) {
               if (err?.status === 404) {
                  setInstitucion(null);
               } else {
                  setError(err?.message || "Error al cargar los datos de la institución");
                  setInstitucion(null);
               }
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchInstitucion();
      
      return () => { isMounted = false; };
      
   }, []); // ID fijo en constante

   // =============================================
   // PREPARAR ELEMENTOS DEL SLIDER (memoizado)
   // =============================================
   const testimonialItems = useMemo((): TestimonialItem[] => {
      if (!institucion) return [];
      
      return [
         {
            id: 1,
            titulo: "🎯 MISIÓN",
            texto: institucion.institucion_mision || "",
            icono: "fa-bullseye"
         },
         {
            id: 2,
            titulo: "🔭 VISIÓN",
            texto: institucion.institucion_vision || "",
            icono: "fa-eye"
         },
         {
            id: 3,
            titulo: "📋 OBJETIVOS",
            texto: institucion.institucion_objetivos || "",
            icono: "fa-list-ul"
         }
      ].filter(item => item.texto && item.texto.trim().length > 0);
      
   }, [institucion]);

   // =============================================
   // ESTADOS DE UI
   // =============================================
   if (loading) {
      return (
         <section className="testimonial-area pd-top-80 pd-bottom-80">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                     <div className="loading-spinner">
                        <div className="spinner-border text-primary" role="status">
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">Cargando información de Sociología...</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }
   
   if (error || testimonialItems.length === 0) {
      return (
         <section className="testimonial-area pd-top-80 pd-bottom-80">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
                     <div className="empty-state p-4" style={{ 
                        background: "#f8f9fa", 
                        borderRadius: "12px",
                        border: "2px dashed #dee2e6"
                     }}>
                        <i className="fa fa-info-circle display-4 text-muted mb-3"></i>
                        <h5 className="text-muted">Información institucional</h5>
                        <p className="text-muted small mb-0">
                           {error 
                              ? `⚠️ ${error}` 
                              : "La misión, visión y objetivos de Sociología se mostrarán aquí cuando estén disponibles."}
                        </p>
                        {error && (
                           <button 
                              className="btn btn-outline-primary btn-sm mt-3"
                              onClick={() => window.location.reload()}
                           >
                              <i className="fa fa-refresh me-1"></i> Reintentar
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   // =============================================
   // RENDERIZADO DEL SLIDER
   // =============================================
   return (
      <section className="testimonial-area pd-top-80 pd-bottom-80">
         <div className="container">
            
            {/* Header opcional */}
            <div className="row mb-4">
               <div className="col-12 text-center">
                  <h2 className="section-title mb-0">
                     {institucion?.institucion_nombre || "Sociología UPEA"}
                  </h2>
                  <p className="text-muted small">
                     <i className="fa fa-university me-1"></i>
                     Universidad Pública de El Alto
                  </p>
               </div>
            </div>
            
            {/* Slider de Testimonios (Misión, Visión, Objetivos) */}
            <Slider {...sliderSettings} className="testimonial-slider-2">
               {testimonialItems.map((item) => (
                  <div key={item.id} className="item px-2">
                     <article 
                        className="single-testimonial-inner h-100"
                        style={{
                           background: "#fff",
                           borderRadius: "12px",
                           padding: "24px",
                           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                           border: "1px solid rgba(0,0,0,0.05)",
                           display: "flex",
                           flexDirection: "column",
                           minHeight: "280px",
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
                        {/* Icono y título */}
                        <div className="testimonial-header mb-3">
                           <span className="testimonial-quote text-primary mb-2 d-block">
                              <i className={`fa ${item.icono} fa-2x`}></i>
                           </span>
                           <h6 className="mb-0" style={{ 
                              fontSize: "1.1rem", 
                              fontWeight: 600,
                              color: "#212529"
                           }}>
                              {item.titulo}
                           </h6>
                        </div>
                        
                        {/* Texto truncado */}
                        <p className="testimonial-text mb-0 flex-grow-1" style={{ 
                           fontSize: "0.95rem",
                           lineHeight: 1.6,
                           color: "#495057",
                           display: "-webkit-box",
                           WebkitLineClamp: 6,
                           WebkitBoxOrient: "vertical",
                           overflow: "hidden",
                           textOverflow: "ellipsis"
                        }}>
                           {truncateText(item.texto, 280)}
                        </p>
                        
                        {/* Footer decorativo */}
                        <div className="testimonial-footer mt-3 pt-3 border-top">
                           <small className="text-muted">
                              <i className="fa fa-graduation-cap me-1"></i>
                              Carrera de Sociología
                           </small>
                        </div>
                     </article>
                  </div>
               ))}
            </Slider>
            
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
               padding-bottom: 8px;
            }
            
            .section-title::after {
               content: '';
               position: absolute;
               bottom: 0;
               left: 50%;
               transform: translateX(-50%);
               width: 60px;
               height: 3px;
               background: #0d6efd;
               border-radius: 2px;
            }
            
            .testimonial-slider-2 :global(.slick-slide) {
               padding: 10px;
            }
            
            .testimonial-slider-2 :global(.slick-center) {
               opacity: 1;
               transform: scale(1.02);
            }
            
            .testimonial-slider-2 :global(.slick-slide:not(.slick-center)) {
               opacity: 0.7;
               transform: scale(0.95);
               transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .loading-spinner {
               padding: 40px 20px;
            }
            
            .empty-state {
               padding: 40px 20px;
            }
            
            @media (max-width: 768px) {
               .section-title {
                  font-size: 1.25rem;
               }
               .single-testimonial-inner {
                  padding: 20px !important;
                  minHeight: 260px !important;
               }
               .testimonial-text {
                  -webkit-line-clamp: 5 !important;
               }
            }
         `}</style>
      </section>
   );
};

export default CommonTestimonial;