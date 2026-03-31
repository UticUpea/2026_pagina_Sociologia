"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";
import { CSSProperties } from 'react';

// =============================================
// INTERFACES (SIN CAMBIOS)
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

// =============================================
// CONSTANTES (SIN CAMBIOS)
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35";

// =============================================
// UTILIDADES (SIN CAMBIOS)
// =============================================
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

// =============================================
// COMPONENTE - INTERFAZ CORREGIDA ✨
// =============================================
const About: React.FC = () => {
   const [institucion, setInstitucion] = useState<InstitucionData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGA DE DATOS (SIN CAMBIOS)
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchInstitucion = async () => {
         try {
            setLoading(true);
            setError(null);
            
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
               
               if (isMounted) setInstitucion(datos);
            } else {
               if (isMounted) setError(`Error ${response.status} al cargar datos`);
            }
            
            setLoading(false);
            
         } catch (err: any) {
            console.error("Error:", err?.message);
            if (isMounted) {
               setError(err?.message || "Error de conexión");
               setLoading(false);
            }
         }
      };

      fetchInstitucion();
      return () => { isMounted = false; };
      
   }, []);

   const sanitizedContent = useMemo(() => {
      if (!institucion?.institucion_sobre_ins) return "";
      return sanitizeHtml(institucion.institucion_sobre_ins);
   }, [institucion?.institucion_sobre_ins]);

   // =============================================
   // ESTILOS VISUALES - CORREGIDOS 🎨
   // =============================================
   const aboutStyles = {
      section: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         padding: '100px 0'
      },
      decorativeElement: {
         position: 'absolute' as const,
         top: '-100px',
         right: '-100px',
         width: '300px',
         height: '300px',
         background: 'radial-gradient(circle, rgba(250,178,101,0.12) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      decorativeElement2: {
         position: 'absolute' as const,
         bottom: '-80px',
         left: '-80px',
         width: '250px',
         height: '250px',
         background: 'radial-gradient(circle, rgba(253,28,10,0.12) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      headerSection: {
         textAlign: 'center' as const,
         marginBottom: '4rem',
         position: 'relative' as const,
         zIndex: 1
      },
      mainTitle: {
         color: '#FFFFFF',
         fontSize: '3.5rem',
         fontWeight: 800,
         marginBottom: '1rem',
         position: 'relative' as const,
         display: 'block',
         textShadow: '0 4px 16px rgba(250,178,101,0.4)'
      },
      titleLine: {
         position: 'absolute' as const,
         bottom: '-10px',
         left: '50%',
         transform: 'translateX(-50%)',
         width: '100px',
         height: '4px',
         background: 'linear-gradient(90deg, #FAB265, #FD1C0A)',
         borderRadius: '2px'
      },
      sectionSubtitle: {
         color: '#FAB265',
         fontWeight: 700,
         fontSize: '0.9rem',
         textTransform: 'uppercase',
         letterSpacing: '2px',
         marginBottom: '1rem',
         display: 'inline-block',
         padding: '10px 24px',
         background: 'rgba(250,178,101,0.15)',
         borderRadius: '20px',
         border: '2px solid rgba(250,178,101,0.4)',
         backdropFilter: 'blur(10px)'
      } as CSSProperties,
      sectionDescription: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '1.05rem',
         marginTop: '1rem'
      } as CSSProperties,
      contentWrapper: {
         background: 'rgba(255,255,255,0.05)',
         borderRadius: '24px',
         padding: '48px',
         border: '2px solid rgba(250,178,101,0.2)',
         backdropFilter: 'blur(20px)',
         boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
         height: '100%',
         display: 'flex',
         flexDirection: 'column' as const
      } as CSSProperties,
      imageWrapper: {
         position: 'relative' as const,
         borderRadius: '24px',
         overflow: 'hidden',
         boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
         border: '4px solid rgba(250,178,101,0.3)',
         backdropFilter: 'blur(10px)',
         transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
         height: '100%',
         minHeight: '650px'
      } as CSSProperties,
      imageOverlay: {
         position: 'absolute' as const,
         top: 0, left: 0, right: 0, bottom: 0,
         background: 'linear-gradient(180deg, transparent 0%, rgba(5,5,4,0.7) 100%)',
         zIndex: 1
      } as CSSProperties,
      imageBadge: {
         position: 'absolute' as const,
         top: '24px',
         left: '24px',
         background: 'linear-gradient(135deg, #FAB265, #FFD700)',
         color: '#050504',
         padding: '12px 24px',
         borderRadius: '12px',
         fontWeight: 700,
         fontSize: '0.9rem',
         zIndex: 2,
         boxShadow: '0 8px 24px rgba(250,178,101,0.4)',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px'
      } as CSSProperties,
      profileTitle: {
         color: '#FAB265',
         fontSize: '1.1rem',
         fontWeight: 700,
         marginBottom: '1.5rem',
         display: 'flex',
         alignItems: 'center',
         gap: '10px',
         textTransform: 'uppercase',
         letterSpacing: '1px'
      } as CSSProperties,
      content: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '1.05rem',
         lineHeight: 1.8,
         marginBottom: '2rem',
         flex: 1
      } as CSSProperties,
      highlightBox: {
         background: 'rgba(250,178,101,0.1)',
         borderLeft: '4px solid #FAB265',
         borderRadius: '12px',
         padding: '20px',
         marginTop: '1.5rem'
      } as CSSProperties,
      highlightText: {
         color: '#FFFFFF',
         fontWeight: 600,
         fontSize: '1rem',
         fontStyle: 'italic',
         marginBottom: 0
      } as CSSProperties,
      badges: {
         display: 'flex',
         flexWrap: 'wrap' as const,
         gap: '12px',
         marginTop: '2rem'
      } as CSSProperties,
      badge: {
         background: 'rgba(255,255,255,0.08)',
         color: '#FFFFFF',
         padding: '10px 20px',
         borderRadius: '12px',
         fontWeight: 600,
         fontSize: '0.9rem',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
         border: '2px solid rgba(250,178,101,0.3)',
         transition: 'all 0.3s ease',
         backdropFilter: 'blur(10px)'
      } as CSSProperties,
      badgeHover: {
         background: 'rgba(250,178,101,0.2)',
         borderColor: '#FAB265',
         transform: 'translateY(-3px)',
         boxShadow: '0 8px 20px rgba(250,178,101,0.3)'
      } as CSSProperties,
      ctaButton: {
         background: 'linear-gradient(135deg, #FD1C0A, #cc1608)',
         color: '#FFFFFF',
         padding: '14px 32px',
         borderRadius: '16px',
         fontWeight: 700,
         fontSize: '0.95rem',
         textDecoration: 'none',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '10px',
         boxShadow: '0 6px 20px rgba(253, 28, 10, 0.4)',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         border: '2px solid transparent',
         marginTop: '2rem',
         alignSelf: 'flex-start'
      } as CSSProperties,
      loading: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         minHeight: '600px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center'
      } as CSSProperties,
      error: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         minHeight: '600px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center'
      } as CSSProperties
   };

   // =============================================
   // RENDERIZADO - INTERFAZ CORREGIDA ✨
   // =============================================
   
   if (loading) {
      return (
         <section className="about-area pd-top-140 pd-bottom-100" style={aboutStyles.loading}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8 text-center">
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
                        Cargando Información
                     </h3>
                     <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                        Obteniendo datos de Sociología...
                     </p>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="about-area pd-top-140 pd-bottom-100" style={aboutStyles.error}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8">
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

   return (
      <section className="about-area pd-top-140 pd-bottom-100" style={aboutStyles.section}>
         {/* Elementos decorativos de fondo */}
         <div style={aboutStyles.decorativeElement} />
         <div style={aboutStyles.decorativeElement2} />
         
         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            
            {/* ✅ HEADER: SOCIOLOGÍA ARRIBA, SOBRE LA CARRERA ABAJO */}
            <div style={aboutStyles.headerSection}>
               
               {/* SOCIOLOGÍA - TÍTULO PRINCIPAL ARRIBA */}
               <h2 className="title" style={aboutStyles.mainTitle}>
                  SOCIOLOGÍA
                  <span style={aboutStyles.titleLine} />
               </h2>
               
               {/* SOBRE LA CARRERA - SUBTÍTULO ABAJO */}
               <h6 className="sub-title" style={aboutStyles.sectionSubtitle}>
                  <i className="fa fa-info-circle"></i>
                  SOBRE LA CARRERA
               </h6>
               
               <p style={aboutStyles.sectionDescription}>
                  <i className="fa fa-graduation-cap me-2"></i>
                  Conoce más sobre la Carrera de Sociología de la UPEA
               </p>
            </div>
            
            <div className="row align-items-stretch g-4">
               
               {/* Columna de Imagen - MISMA ALTURA QUE EL CONTENIDO */}
               <div className="col-lg-6">
                  <div 
                     className="about-thumb-wrap" 
                     style={aboutStyles.imageWrapper}
                     onMouseEnter={(e: any) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 40px 100px rgba(0,0,0,0.5)';
                     }}
                     onMouseLeave={(e: any) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.4)';
                     }}
                  >
                     <Image 
                        src="/assets/img/sociologia4.jpg" 
                        alt="Sociología UPEA"
                        fill
                        style={{ 
                           objectFit: 'cover',
                           transition: 'transform 0.4s ease'
                        }}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1.03)';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1)';
                        }}
                     />
                     <div style={aboutStyles.imageOverlay} />
                     <div style={aboutStyles.imageBadge}>
                        <i className="fa fa-award"></i>
                        Carrera Acreditada
                     </div>
                  </div>
               </div>
               
               {/* Columna de Contenido */}
               <div className="col-lg-6">
                  {institucion && (
                     <article style={aboutStyles.contentWrapper}>
                        
                        {/* Perfil Profesional */}
                        <h3 style={aboutStyles.profileTitle}>
                           <i className="fa fa-user-tie"></i>
                           PERFIL PROFESIONAL
                        </h3>
                        
                        {/* Contenido Sanitizado */}
                        <div 
                           className="content"
                           style={aboutStyles.content}
                           dangerouslySetInnerHTML={{ 
                              __html: sanitizedContent
                                 .replace(/<p>/g, '<p style="margin-bottom: 1rem; color: rgba(255,255,255,0.9);">')
                                 .replace(/<strong>/g, '<strong style="color: #FAB265; font-weight: 700;">')
                                 .replace(/<ul>/g, '<ul style="list-style: none; padding-left: 0; margin: 1rem 0;">')
                                 .replace(/<li>/g, '<li style="padding: 8px 0 8px 32px; position: relative; color: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(250,178,101,0.1); margin-bottom: 0.5rem;">')
                           }}
                        />
                        
                        {/* Caja Destacada */}
                        <div style={aboutStyles.highlightBox}>
                           <p style={aboutStyles.highlightText}>
                              <i className="fa fa-check-circle me-2" style={{ color: '#FAB265' }}></i>
                              Formación integral con enfoque social, crítico y humanista
                           </p>
                        </div>
                        
                        {/* Badges Informativos */}
                        <div style={aboutStyles.badges}>
                           <span 
                              style={aboutStyles.badge}
                              onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, aboutStyles.badgeHover)}
                              onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, aboutStyles.badge)}
                           >
                              <i className="fa fa-graduation-cap" style={{ color: '#FAB265' }}></i>
                              Licenciatura
                           </span>
                           <span 
                              style={aboutStyles.badge}
                              onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, aboutStyles.badgeHover)}
                              onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, aboutStyles.badge)}
                           >
                              <i className="fa fa-clock-o" style={{ color: '#FAB265' }}></i>
                              10 Semestres
                           </span>
                           <span 
                              style={aboutStyles.badge}
                              onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, aboutStyles.badgeHover)}
                              onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, aboutStyles.badge)}
                           >
                              <i className="fa fa-building" style={{ color: '#FAB265' }}></i>
                              Presencial
                           </span>
                        </div>
                        
                        {/* Botón CTA */}
                        <a 
                           href="/about"
                           style={aboutStyles.ctaButton}
                           onMouseEnter={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(-3px)';
                              e.currentTarget.style.boxShadow = '0 10px 28px rgba(253,28,10,0.5)';
                           }}
                           onMouseLeave={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(253,28,10,0.4)';
                           }}
                        >
                           Conocer Más <i className="fa fa-arrow-right"></i>
                        </a>
                        
                     </article>
                  )}
               </div>
            </div>
         </div>
         
         {/* CSS Global para animaciones y responsive */}
         <style jsx global>{`
            @keyframes fadeInUp {
               from {
                  opacity: 0;
                  transform: translateY(30px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }
            
            @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
            
            .about-area .content p {
               margin-bottom: 1rem !important;
               line-height: 1.8 !important;
            }
            
            .about-area .content strong {
               color: #FAB265 !important;
               font-weight: 700 !important;
            }
            
            .about-area .content ul {
               list-style: none !important;
               padding-left: 0 !important;
               margin: 1rem 0 !important;
            }
            
            .about-area .content li {
               padding: 8px 0 8px 32px !important;
               position: relative !important;
               color: rgba(255,255,255,0.9) !important;
               border-bottom: 1px solid rgba(250,178,101,0.1) !important;
               margin-bottom: 0.5rem !important;
            }
            
            .about-area .content li:before {
               content: '✓' !important;
               position: absolute !important;
               left: 0 !important;
               color: #FAB265 !important;
               font-weight: bold !important;
               font-size: 1.2rem !important;
            }
            
            .row.align-items-stretch > [class*="col-"] {
               display: flex;
               flex-direction: column;
            }
            
            /* =============================================
               RESPONSIVE DESIGN - ABOUT
               ============================================= */
            
            /* Tablet */
            @media (max-width: 991px) {
               .about-area {
                  padding: 80px 0 !important;
               }
               
               .about-area .title {
                  font-size: 2.5rem !important;
               }
               
               .about-area .sub-title {
                  font-size: 0.85rem !important;
                  padding: 8px 20px !important;
               }
               
               .about-area .content {
                  font-size: 1rem !important;
               }
               
               .about-area .imageWrapper {
                  min-height: 400px !important;
               }
               
               .about-area .contentWrapper {
                  padding: 36px !important;
               }
            }
            
            /* Móvil */
            @media (max-width: 767px) {
               .about-area {
                  padding: 60px 0 !important;
               }
               
               .about-area .title {
                  font-size: 2rem !important;
               }
               
               .about-area .titleLine {
                  width: 80px !important;
                  height: 3px !important;
                  bottom: -8px !important;
               }
               
               .about-area .sub-title {
                  font-size: 0.8rem !important;
                  padding: 6px 16px !important;
               }
               
               .about-area .sectionDescription {
                  font-size: 0.95rem !important;
               }
               
               .about-area .content {
                  font-size: 0.95rem !important;
                  line-height: 1.6 !important;
               }
               
               .about-area .imageWrapper {
                  min-height: 300px !important;
                  margin-bottom: 24px;
               }
               
               .about-area .contentWrapper {
                  padding: 30px 24px !important;
               }
               
               .about-area .profileTitle {
                  font-size: 1rem !important;
                  margin-bottom: 1rem !important;
               }
               
               .about-area .highlightBox {
                  padding: 16px !important;
                  margin-top: 1rem !important;
               }
               
               .about-area .badges {
                  justify-content: center;
                  gap: 8px !important;
               }
               
               .about-area .badge {
                  padding: 8px 16px !important;
                  font-size: 0.85rem !important;
               }
               
               .about-area .ctaButton {
                  width: 100%;
                  justify-content: center;
                  padding: 12px 24px !important;
                  font-size: 0.9rem !important;
                  margin-top: 1.5rem !important;
               }
               
               .about-area .imageBadge {
                  top: 16px !important;
                  left: 16px !important;
                  padding: 8px 16px !important;
                  font-size: 0.8rem !important;
               }
            }
            
            /* Móvil pequeño */
            @media (max-width: 576px) {
               .about-area {
                  padding: 50px 0 !important;
               }
               
               .about-area .title {
                  font-size: 1.6rem !important;
               }
               
               .about-area .titleLine {
                  width: 60px !important;
                  height: 3px !important;
               }
               
               .about-area .sub-title {
                  font-size: 0.75rem !important;
                  padding: 5px 12px !important;
               }
               
               .about-area .sectionDescription {
                  font-size: 0.9rem !important;
               }
               
               .about-area .content {
                  font-size: 0.9rem !important;
               }
               
               .about-area .imageWrapper {
                  min-height: 250px !important;
               }
               
               .about-area .contentWrapper {
                  padding: 24px 20px !important;
               }
               
               .about-area .profileTitle {
                  font-size: 0.95rem !important;
               }
               
               .about-area .highlightText {
                  font-size: 0.9rem !important;
               }
               
               .about-area .badge {
                  padding: 6px 12px !important;
                  font-size: 0.8rem !important;
               }
               
               .about-area .ctaButton {
                  padding: 10px 20px !important;
                  font-size: 0.85rem !important;
               }
            }
         `}</style>
      </section>
   );
};

export default About;