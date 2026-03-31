"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

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
   institucion_historia_corta?: string;
   colorinstitucion?: Array<{
      id_color: number;
      color_primario: string;
      color_secundario: string;
      color_terciario: string;
   }>;
}

interface InstitucionResponse {
   Descripcion?: InstitucionData;
   [key: string]: any;
}

interface DataType {
   list: string[];
}

// =============================================
// CONSTANTES - ID DE INSTITUCIÓN + COLORES
// =============================================
const INSTITUCION_ID = "35";
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const TARGET_COLOR_ID = 32;

// =============================================
// DATOS ESTÁTICOS
// =============================================
const list_data: DataType[] = [
   { list: ["Modalidad Presencial", "Infraestructura Moderna", "Calidad Académica"] },
   { list: ["Investigación Social", "Proyección Comunitaria", "Formación Integral"] },
];

// =============================================
// UTILIDADES
// =============================================
const sanitizeHtml = (html: string | null | undefined): string => {
   if (!html) return "";
   try {
      return DOMPurify.sanitize(html, {
         ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
         ALLOWED_ATTR: ['class', 'style']
      });
   } catch (error) {
      console.error('Error sanitizando HTML:', error);
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
               .replace(/on\w+="[^"]*"/gi, '')
               .replace(/javascript:/gi, '');
   }
};

const truncateText = (text: string, maxLength: number = 200): string => {
   if (!text) return "";
   const clean = text.replace(/<[^>]*>/g, '').trim();
   return clean.length > maxLength 
      ? clean.substring(0, maxLength).trim() + "..." 
      : clean;
};

const extractInstitutionalColors = (apiResponse: any) => {
   try {
      const descripcion = apiResponse?.Descripcion || apiResponse?.data || apiResponse;
      const colorScheme = descripcion?.colorinstitucion?.find(
         (c: any) => c.id_color === TARGET_COLOR_ID
      ) || descripcion?.colorinstitucion?.[0];
      
      if (!colorScheme) return null;
      
      return {
         primario: colorScheme.color_primario || '#FD1C0A',
         secundario: colorScheme.color_secundario || '#FAB265',
         terciario: colorScheme.color_terciario || '#050504'
      };
   } catch (error) {
      console.error('Error extrayendo colores:', error);
      return null;
   }
};

// =============================================
// SERVICIO: Obtener datos de institución (SIN PROXY)
// =============================================
const getInstitucionPrincipal = async (institucionId: string) => {
   try {
      // ✅ LLAMADA DIRECTA A API - SIN PROXY
      const response = await fetch(
         `${API_BASE_URL}/api/v2/institucionesPrincipal/${institucionId}`,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${API_TOKEN}`
            },
            cache: 'no-store'
         }
      );
      
      const data = await response.json();
      
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
// COMPONENTE PRINCIPAL - ESTILO OSCURO/ROJO ✨
// =============================================
const About: React.FC<{ style?: string }> = ({ style }) => {
   
   const [institucion, setInstitucion] = useState<InstitucionData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [colors, setColors] = useState({
      primario: '#FD1C0A',
      secundario: '#FAB265',
      terciario: '#050504'
   });

   // =============================================
   // CARGA DE DATOS - NUEVO SERVICIO API V2 (SIN PROXY)
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchInstitucion = async () => {
         try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 [About] Cargando desde: ${API_BASE_URL}/api/v2/institucionesPrincipal/${INSTITUCION_ID}`);
            
            // ✅ Llamada directa sin proxy
            const response = await getInstitucionPrincipal(INSTITUCION_ID);
            
            if (response.status === 404 || response.data?.statusCode === 404) {
               if (isMounted) setInstitucion(null);
               return;
            }
            
            let datos: InstitucionData | null = null;
            
            if (response.data?.Descripcion && typeof response.data.Descripcion === 'object') {
               datos = response.data.Descripcion as InstitucionData;
            } else if (response.data?.institucion_id) {
               datos = response.data as InstitucionData;
            }
            
            if (isMounted) {
               if (datos) {
                  setInstitucion(datos);
                  
                  // ✅ Extraer y aplicar colores institucionales
                  const institutionalColors = extractInstitutionalColors(response.data);
                  if (institutionalColors) {
                     setColors(institutionalColors);
                     // Aplicar variables CSS globales
                     const root = document.documentElement;
                     root.style.setProperty('--main-color', institutionalColors.primario);
                     root.style.setProperty('--heading-color', institutionalColors.secundario);
                     root.style.setProperty('--accent-color', institutionalColors.terciario);
                  }
               } else {
                  setInstitucion(null);
               }
            }
            
         } catch (err: any) {
            console.error("❌ [About] Error:", err?.message);
            if (isMounted) {
               if (err?.status === 404) {
                  setInstitucion(null);
               } else {
                  setError(err?.message || "Error al cargar la información");
                  setInstitucion(null);
               }
            }
         } finally {
            if (isMounted) setLoading(false);
         }
      };

      fetchInstitucion();
      return () => { isMounted = false; };
      
   }, []);

   // =============================================
   // CONTENIDO SANITIZADO
   // =============================================
   const sanitizedHistoria = useMemo(() => {
      if (!institucion?.institucion_historia) return "";
      return sanitizeHtml(institucion.institucion_historia);
   }, [institucion?.institucion_historia]);

   // =============================================
   // ESTILOS - DEGRADADO OSCURO A ROJO 🎨
   // =============================================
   const aboutStyles = {
      section: {
         background: `linear-gradient(135deg, ${colors.terciario} 0%, #1a0505 50%, ${colors.primario} 100%)`,
         position: 'relative' as const,
         overflow: 'hidden' as const,
         padding: '100px 0'
      },
      decorativeBg: {
         position: 'absolute' as const,
         top: '-150px',
         right: '-150px',
         width: '400px',
         height: '400px',
         background: 'radial-gradient(circle, rgba(250,178,101,0.12) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      contentWrapper: {
         position: 'relative' as const,
         zIndex: 1
      },
      imageWrapper: {
         position: 'relative' as const,
         borderRadius: '20px',
         overflow: 'hidden' as const,
         boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
         border: '3px solid rgba(250,178,101,0.3)',
         minHeight: '400px',
         backgroundImage: `url('/assets/img/sociologia2.jpg')`,
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         backgroundRepeat: 'no-repeat' as const
      },
      imageOverlay: {
         position: 'absolute' as const,
         inset: 0,
         background: 'linear-gradient(180deg, rgba(5,5,4,0.3) 0%, rgba(253,28,10,0.6) 100%)',
         zIndex: 1
      },
      imageBadge: {
         position: 'absolute' as const,
         bottom: '20px',
         left: '20px',
         right: '20px',
         background: 'rgba(5,5,4,0.9)',
         color: '#FFFFFF',
         padding: '16px 20px',
         borderRadius: '12px',
         border: '2px solid rgba(250,178,101,0.4)',
         backdropFilter: 'blur(10px)',
         zIndex: 2,
         fontSize: '1rem',
         fontWeight: 600,
         textShadow: '0 2px 8px rgba(0,0,0,0.5)'
      },
      contentCard: {
         background: 'rgba(255,255,255,0.08)',
         borderRadius: '20px',
         padding: '40px',
         border: '2px solid rgba(250,178,101,0.2)',
         backdropFilter: 'blur(10px)',
         boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      },
      sectionLabel: {
         color: colors.secundario,
         fontWeight: 700,
         fontSize: '0.9rem',
         textTransform: 'uppercase' as const,
         letterSpacing: '2px',
         marginBottom: '1rem',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         padding: '10px 24px',
         background: 'rgba(250,178,101,0.15)',
         borderRadius: '20px',
         border: '2px solid rgba(250,178,101,0.4)'
      },
      sectionTitle: {
         color: '#FFFFFF',
         fontSize: '2.2rem',
         fontWeight: 800,
         marginBottom: '1.5rem',
         lineHeight: 1.3,
         textShadow: '0 4px 16px rgba(0,0,0,0.5)'
      },
      contentText: {
         color: 'rgba(255,255,255,0.95)',
         fontSize: '1.05rem',
         lineHeight: 1.8,
         marginBottom: '2rem'
      },
      listWrapper: {
         display: 'grid',
         gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' as const,
         gap: '16px',
         marginBottom: '2rem'
      },
      listItem: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '0.95rem',
         display: 'flex',
         alignItems: 'center',
         gap: '10px',
         padding: '10px 16px',
         background: 'rgba(250,178,101,0.1)',
         borderRadius: '10px',
         border: '1px solid rgba(250,178,101,0.2)',
         transition: 'all 0.3s ease'
      },
      listItemHover: {
         background: 'rgba(250,178,101,0.2)',
         borderColor: colors.secundario,
         transform: 'translateX(4px)',
         color: colors.secundario
      },
      loading: {
         background: `linear-gradient(135deg, ${colors.terciario} 0%, ${colors.primario} 100%)`,
         minHeight: '600px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center'
      },
      error: {
         background: 'rgba(255,255,255,0.05)',
         border: '2px solid #FD1C0A',
         borderRadius: '20px',
         padding: '40px',
         textAlign: 'center' as const,
         color: '#FFFFFF'
      }
   };

   // =============================================
   // ESTADO: CARGANDO
   // =============================================
   if (loading) {
      return (
         <section className="about-area pd-top-120 pd-bottom-90" style={aboutStyles.section}>
            <div style={aboutStyles.decorativeBg} />
            <div className="container text-center" style={aboutStyles.contentWrapper}>
               <div style={{
                  width: '70px',
                  height: '70px',
                  border: '5px solid rgba(250,178,101,0.3)',
                  borderTop: '5px solid #FAB265',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 24px'
               }} />
               <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '8px' }}>
                  Cargando Historia
               </h3>
               <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                  Obteniendo información de Sociología UPEA...
               </p>
            </div>
         </section>
      );
   }

   // =============================================
   // ESTADO: ERROR
   // =============================================
   if (error) {
      return (
         <section className="about-area pd-top-120 pd-bottom-90" style={aboutStyles.section}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div style={aboutStyles.error}>
                        <i className="fa fa-exclamation-triangle" style={{ 
                           fontSize: '3.5rem', 
                           color: '#FD1C0A',
                           marginBottom: '20px',
                           display: 'block'
                        }}></i>
                        <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                           ⚠️ Error al Cargar
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '24px' }}>{error}</p>
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
                           onMouseEnter={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(-3px)';
                              e.currentTarget.style.boxShadow = '0 10px 28px rgba(253,28,10,0.5)';
                           }}
                           onMouseLeave={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                           }}
                        >
                           <i className="fa fa-refresh"></i> Reintentar
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
      <section className="about-area pd-top-120 pd-bottom-90" style={aboutStyles.section}>
         {/* Elemento decorativo de fondo */}
         <div style={aboutStyles.decorativeBg} />
         
         <div className="container" style={aboutStyles.contentWrapper}>
            <div className="row align-items-center g-4">
               
               {/* Columna Izquierda: Imagen */}
               <div className="col-lg-6 col-md-10">
                  <div style={aboutStyles.imageWrapper}>
                     <div style={aboutStyles.imageOverlay} />
                     
                     {/* Badge con texto */}
                     <div style={aboutStyles.imageBadge}>
                        <i className="fa fa-history me-2"></i>
                        Historia de la Carrera
                        <br />
                        <small style={{ 
                           display: 'block', 
                           marginTop: '4px', 
                           opacity: 0.8, 
                           fontSize: '0.9rem',
                           fontWeight: 400
                        }}>
                           Universidad Pública de El Alto
                        </small>
                     </div>
                  </div>
               </div>
               
               {/* Columna Derecha: Contenido */}
               <div className="col-lg-6">
                  {institucion && (
                     <article style={aboutStyles.contentCard}>
                        
                        {/* Label de sección */}
                        <div style={aboutStyles.sectionLabel}>
                           <i className="fa fa-book"></i>
                           HISTORIA
                        </div>
                        
                        {/* Título */}
                        <h2 style={aboutStyles.sectionTitle}>
                           Carrera de Sociología
                        </h2>
                        
                        {/* Contenido HTML sanitizado */}
                        <div 
                           style={aboutStyles.contentText}
                           dangerouslySetInnerHTML={{ __html: sanitizedHistoria }}
                        />
                        
                        {/* Listas de características */}
                        <div style={aboutStyles.listWrapper}>
                           {list_data.map((item, index) => (
                              <ul key={index} className="list-unstyled mb-0">
                                 {item.list.map((listItem, i) => (
                                    <li 
                                       key={i} 
                                       style={aboutStyles.listItem}
                                       onMouseEnter={(e: any) => {
                                          Object.assign(e.currentTarget.style, aboutStyles.listItemHover);
                                       }}
                                       onMouseLeave={(e: any) => {
                                          Object.assign(e.currentTarget.style, aboutStyles.listItem);
                                       }}
                                    >
                                       <i className="fa fa-check" style={{ color: colors.secundario }}></i> 
                                       <span>{listItem}</span>
                                    </li>
                                 ))}
                              </ul>
                           ))}
                        </div>
                        
                     </article>
                  )}
               </div>
               
            </div>
         </div>
         
         {/* CSS Global para animaciones */}
         <style jsx global>{`
            @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
            
            .about-area .content p {
               margin-bottom: 1rem;
            }
            
            .about-area .content strong {
               color: #FAB265;
               font-weight: 600;
            }
            
            .about-area .content ul {
               padding-left: 1.25rem;
               margin: 0.5rem 0;
            }
            
            .about-area .content li {
               margin-bottom: 0.25rem;
            }
            
            @media (max-width: 991px) {
               .about-area {
                  padding: 60px 0 !important;
               }
               .about-area .section-title {
                  font-size: 1.8rem !important;
               }
            }
            
            @media (max-width: 767px) {
               .about-area {
                  padding: 50px 0 !important;
               }
               .about-area .section-title {
                  font-size: 1.5rem !important;
               }
            }
         `}</style>
      </section>
   );
};

export default About;