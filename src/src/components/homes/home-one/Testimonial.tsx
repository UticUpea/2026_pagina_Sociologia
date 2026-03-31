"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";

// =============================================
// INTERFACES
// =============================================
interface InstitucionData {
   institucion_id: number;
   institucion_nombre: string;
   institucion_sobre_ins: string;
   institucion_logo: string;
}

// =============================================
// CONSTANTES - API DEL NUEVO SERVICIO
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35";

// =============================================
// UTILIDADES
// =============================================
const sanitizeHtml = (html: string): string => {
   try {
      return DOMPurify.sanitize(html, {
         ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'span'],
         ALLOWED_ATTR: ['class', 'style']
      });
   } catch (error) {
      console.error('Error sanitizando HTML:', error);
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                 .replace(/on\w+="[^"]*"/gi, '')
                 .replace(/javascript:/gi, '');
   }
};

// =============================================
// COMPONENTE - API + LAYOUT MEJORADO ✨
// =============================================
const Testimonial = () => {
   
   const [institucion, setInstitucion] = useState<InstitucionData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [sanitizedContent, setSanitizedContent] = useState<string>("");

   // =============================================
   // CARGAR DATOS DESDE API
   // =============================================
   useEffect(() => {
      const fetchInstitucionData = async () => {
         try {
            console.log('🔄 [Testimonial] Cargando perfil profesional desde API...');
            
            const url = `${API_BASE_URL}/api/v2/institucionesPrincipal/${INSTITUCION_ID}`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
            };
            if (API_TOKEN) {
               headers['Authorization'] = `Bearer ${API_TOKEN}`;
            }
            
            const response = await fetch(url, { 
               method: 'GET', 
               headers,
               cache: 'no-store'
            });
            
            if (response.ok) {
               const result = await response.json();
               const datos = result?.Descripcion || result;
               
               console.log('✅ [Testimonial] Datos cargados:', {
                  nombre: datos.institucion_nombre,
                  tienePerfil: !!datos.institucion_sobre_ins
               });
               
               setInstitucion(datos);
               
               // Sanitizar y preparar el contenido HTML
               if (datos.institucion_sobre_ins) {
                  const clean = sanitizeHtml(datos.institucion_sobre_ins);
                  setSanitizedContent(clean);
               }
            } else {
               console.warn('⚠️ [Testimonial] Error en la respuesta:', response.status);
            }
            
            setLoading(false);
            
         } catch (error) {
            console.error('❌ [Testimonial] Error cargando datos:', error);
            setLoading(false);
         }
      };
      
      fetchInstitucionData();
   }, []);

   // =============================================
   // ESTILOS VISUALES - COLORES INSTITUCIONALES 🎨
   // =============================================
   const testimonialStyles = {
      section: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         padding: '100px 0'
      },
      decorativeBg: {
         position: 'absolute' as const,
         top: '-150px',
         left: '-150px',
         width: '400px',
         height: '400px',
         background: 'radial-gradient(circle, rgba(250,178,101,0.15) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      decorativeBg2: {
         position: 'absolute' as const,
         bottom: '-100px',
         right: '-100px',
         width: '350px',
         height: '350px',
         background: 'radial-gradient(circle, rgba(253,28,10,0.15) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      container: {
         position: 'relative' as const,
         zIndex: 1
      },
      contentWrapper: {
         display: 'flex',
         alignItems: 'stretch',
         gap: '50px',
         flexWrap: 'wrap' as const
      },
      imageColumn: {
         flex: '0 0 45%',
         maxWidth: '45%'
      },
      imageWrapper: {
         position: 'relative' as const,
         borderRadius: '24px',
         overflow: 'hidden',
         boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
         border: '4px solid rgba(250,178,101,0.3)',
         backdropFilter: 'blur(10px)',
         height: '100%',
         minHeight: '500px'
      },
      imageOverlay: {
         position: 'absolute' as const,
         top: 0, left: 0, right: 0, bottom: 0,
         background: 'linear-gradient(180deg, transparent 0%, rgba(5,5,4,0.7) 100%)',
         zIndex: 1
      },
      imageBadge: {
         position: 'absolute' as const,
         bottom: '24px',
         left: '24px',
         background: 'linear-gradient(135deg, #FAB265, #FFD700)',
         color: '#050504',
         padding: '12px 20px',
         borderRadius: '12px',
         fontWeight: 700,
         fontSize: '0.9rem',
         zIndex: 2,
         boxShadow: '0 8px 24px rgba(250,178,101,0.4)',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px'
      },
      contentColumn: {
         flex: '0 0 50%',
         maxWidth: '50%',
         display: 'flex',
         flexDirection: 'column' as const
      },
      cardWrapper: {
         background: 'rgba(255,255,255,0.05)',
         borderRadius: '24px',
         padding: '48px',
         border: '2px solid rgba(250,178,101,0.2)',
         backdropFilter: 'blur(20px)',
         boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
         flex: 1,
         display: 'flex',
         flexDirection: 'column' as const
      },
      headerSection: {
         marginBottom: '32px',
         paddingBottom: '24px',
         borderBottom: '2px solid rgba(250,178,101,0.2)'
      },
      sectionTitle: {
         color: '#FAB265',
         fontSize: '0.9rem',
         fontWeight: 700,
         textTransform: 'uppercase',
         letterSpacing: '1.5px',
         marginBottom: '8px',
         display: 'flex',
         alignItems: 'center',
         gap: '8px'
      },
      sectionSubtitle: {
         color: '#FFFFFF',
         fontSize: '1.8rem',
         fontWeight: 800,
         marginBottom: 0,
         textShadow: '0 2px 12px rgba(250,178,101,0.4)'
      },
      contentArea: {
         color: '#FFFFFF',
         fontSize: '1.05rem',
         lineHeight: 1.8,
         flex: 1
      },
      loading: {
         textAlign: 'center' as const,
         padding: '60px 40px',
         color: '#FFFFFF'
      }
   };

   if (loading) {
      return (
         <div className="testimonial-area pd-top-100" style={testimonialStyles.section}>
            <div className="container">
               <div style={testimonialStyles.loading}>
                  <div className="spinner-border" role="status" style={{ 
                     width: '4rem', 
                     height: '4rem', 
                     borderWidth: '5px',
                     borderColor: '#FAB265',
                     borderRightColor: 'transparent'
                  }}>
                     <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-4" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                     Cargando perfil profesional...
                  </p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="testimonial-area pd-top-100" style={testimonialStyles.section}>
         {/* Elementos decorativos de fondo */}
         <div style={testimonialStyles.decorativeBg} />
         <div style={testimonialStyles.decorativeBg2} />
         
         <div className="container" style={testimonialStyles.container}>
            <div className="testimonial-area-inner">
               
               <div style={testimonialStyles.contentWrapper}>
                  
                  {/* Columna Izquierda: Imagen */}
                  <div style={testimonialStyles.imageColumn}>
                     <div style={testimonialStyles.imageWrapper}>
                        <Image 
                           src="/assets/img/sociologia2.jpg" 
                           alt="Estudiantes de Sociología UPEA"
                           width={500}
                           height={650}
                           style={{ 
                              width: '100%', 
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                           }}
                        />
                        <div style={testimonialStyles.imageOverlay} />
                        <div style={testimonialStyles.imageBadge}>
                           <i className="fa fa-users"></i>
                           Estudiantes UPEA
                        </div>
                     </div>
                  </div>
                  
                  {/* Columna Derecha: Contenido del Perfil Profesional */}
                  <div style={testimonialStyles.contentColumn}>
                     <div style={testimonialStyles.cardWrapper}>
                        
                        {/* Header */}
                        <div style={testimonialStyles.headerSection}>
                           <h6 style={testimonialStyles.sectionTitle}>
                              <i className="fa fa-graduation-cap"></i>
                              PERFIL PROFESIONAL
                           </h6>
                           <h2 style={testimonialStyles.sectionSubtitle}>
                              {institucion?.institucion_nombre || "SOCIOLOGÍA"}
                           </h2>
                        </div>
                        
                        {/* Contenido HTML sanitizado */}
                        <div 
                           style={testimonialStyles.contentArea}
                           dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                           className="perfil-profesional-content"
                        />
                        
                     </div>
                  </div>
                  
               </div>
               
            </div>
         </div>
         
         {/* =============================================
            CSS Global - RESPONSIVE DESIGN
            ============================================= */}
         <style jsx global>{`
            .perfil-profesional-content p {
               margin-bottom: 1.5rem;
               color: rgba(255,255,255,0.95);
               line-height: 1.8;
            }
            
            .perfil-profesional-content strong {
               color: #FAB265;
               font-weight: 700;
               display: block;
               margin-bottom: 0.5rem;
               font-size: 1.1rem;
            }
            
            .perfil-profesional-content ul {
               list-style: none;
               padding-left: 0;
               margin: 1rem 0;
            }
            
            .perfil-profesional-content ul li {
               padding: 8px 0 8px 32px;
               position: relative;
               color: rgba(255,255,255,0.9);
               border-bottom: 1px solid rgba(250,178,101,0.1);
            }
            
            .perfil-profesional-content ul li:before {
               content: '✓';
               position: absolute;
               left: 0;
               color: #FAB265;
               font-weight: bold;
               font-size: 1.2rem;
            }
            
            .perfil-profesional-content ul li:last-child {
               border-bottom: none;
            }
            
            /* =============================================
               RESPONSIVE DESIGN - TESTIMONIAL
               ============================================= */
            
            /* Tablet */
            @media (max-width: 991px) {
               .testimonial-area {
                  padding: 80px 0 !important;
               }
               
               .testimonial-area .contentWrapper {
                  gap: 40px !important;
               }
               
               .testimonial-area .imageColumn,
               .testimonial-area .contentColumn {
                  flex: 0 0 100% !important;
                  maxWidth: 100% !important;
               }
               
               .testimonial-area .imageWrapper {
                  min-height: 400px !important;
               }
               
               .testimonial-area .cardWrapper {
                  padding: 40px !important;
               }
               
               .testimonial-area .sectionSubtitle {
                  font-size: 1.5rem !important;
               }
            }
            
            /* Móvil */
            @media (max-width: 767px) {
               .testimonial-area {
                  padding: 60px 0 !important;
               }
               
               .testimonial-area .decorativeBg,
               .testimonial-area .decorativeBg2 {
                  display: none !important;
               }
               
               .testimonial-area .contentWrapper {
                  gap: 30px !important;
               }
               
               .testimonial-area .imageWrapper {
                  min-height: 300px !important;
                  border-radius: 20px !important;
               }
               
               .testimonial-area .imageBadge {
                  bottom: 16px !important;
                  left: 16px !important;
                  padding: 8px 16px !important;
                  font-size: 0.8rem !important;
               }
               
               .testimonial-area .cardWrapper {
                  padding: 32px 24px !important;
                  border-radius: 20px !important;
               }
               
               .testimonial-area .headerSection {
                  margin-bottom: 24px !important;
                  padding-bottom: 20px !important;
               }
               
               .testimonial-area .sectionTitle {
                  font-size: 0.85rem !important;
                  justify-content: center !important;
               }
               
               .testimonial-area .sectionSubtitle {
                  font-size: 1.3rem !important;
                  text-align: center !important;
               }
               
               .testimonial-area .contentArea {
                  font-size: 0.95rem !important;
                  line-height: 1.6 !important;
               }
               
               .perfil-profesional-content p {
                  font-size: 0.95rem !important;
                  margin-bottom: 1.2rem !important;
               }
               
               .perfil-profesional-content strong {
                  font-size: 1rem !important;
                  text-align: center !important;
               }
               
               .perfil-profesional-content ul li {
                  padding: 6px 0 6px 28px !important;
                  font-size: 0.9rem !important;
               }
            }
            
            /* Móvil pequeño */
            @media (max-width: 576px) {
               .testimonial-area {
                  padding: 50px 0 !important;
               }
               
               .testimonial-area .imageWrapper {
                  min-height: 250px !important;
               }
               
               .testimonial-area .cardWrapper {
                  padding: 28px 20px !important;
               }
               
               .testimonial-area .sectionTitle {
                  font-size: 0.8rem !important;
               }
               
               .testimonial-area .sectionSubtitle {
                  font-size: 1.2rem !important;
               }
               
               .testimonial-area .contentArea {
                  font-size: 0.9rem !important;
               }
               
               .perfil-profesional-content p {
                  font-size: 0.9rem !important;
               }
               
               .perfil-profesional-content strong {
                  font-size: 0.95rem !important;
               }
               
               .perfil-profesional-content ul li {
                  padding: 5px 0 5px 24px !important;
                  font-size: 0.85rem !important;
               }
               
               .perfil-profesional-content ul li:before {
                  font-size: 1rem !important;
               }
            }
         `}</style>
      </div>
   )
}

export default Testimonial;