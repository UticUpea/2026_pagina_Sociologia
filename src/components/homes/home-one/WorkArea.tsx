"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";

import icon_1 from "@/assets/img/icon/12.png";
import icon_2 from "@/assets/img/icon/13.png";
import icon_3 from "@/assets/img/icon/14.png";
import icon_4 from "@/assets/img/icon/15.png";

interface DataType {
   id: number;
   icon: any;
   title: string;
   desc: string;
}

const work_data: DataType[] = [
   {
      id: 1,
      icon: icon_1,
      title: "Investigación social y análisis de datos",
      desc: "El sociólogo investiga fenómenos sociales mediante métodos cuantitativos y cualitativos para comprender la realidad social.",
   },
   {
      id: 2,
      icon: icon_2,
      title: "Diseño y evaluación de políticas públicas",
      desc: "Participa en el diseño, implementación y evaluación de políticas sociales para mejorar la calidad de vida de la población.",
   },
   {
      id: 3,
      icon: icon_3,
      title: "Docencia e investigación académica",
      desc: "Ejerce la docencia en universidades y centros de investigación, formando nuevos profesionales en ciencias sociales.",
   },
   {
      id: 4,
      icon: icon_4,
      title: "Consultoría y asesoría social",
      desc: "Brinda consultoría a organizaciones públicas y privadas en temas de dinámica social, cultura organizacional y cambio social.",
   },
];

// =============================================
// CONSTANTES - API DEL NUEVO SERVICIO
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35";

// =============================================
// COMPONENTE - VALIDACIÓN MEJORADA + HTML SEGURO ✨
// =============================================
const WorkArea = () => {
   
   const [sociologoData, setSociologoData] = useState<string>("");
   const [hasData, setHasData] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);
   
   // =============================================
   // VALIDAR SI EL CONTENIDO ES HTML VÁLIDO
   // =============================================
   const isValidContent = (content: string): boolean => {
      if (!content || content.trim().length < 50) return false;
      
      // ✅ Verificar si contiene etiquetas HTML malformadas (sin renderizar)
      if (content.includes('<p>') || content.includes('<strong>') || 
          content.includes('</p>') || content.includes('</strong>')) {
         // Si tiene etiquetas pero están escapadas (se ven como texto), no es válido
         if (content.charAt(0) === '<' || content.includes('&lt;') || content.includes('&gt;')) {
            return false;
         }
      }
      
      return true;
   };
   
   // =============================================
   // SANITIZAR Y RENDERIZAR HTML
   // =============================================
   const sanitizeAndRenderHTML = (html: string): string => {
      try {
         // ✅ Usar DOMPurify para sanitizar HTML de forma segura
         const cleanHTML = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'span'],
            ALLOWED_ATTR: ['class', 'style']
         });
         
         return cleanHTML;
      } catch (error) {
         console.error('❌ [WorkArea] Error sanitizando HTML:', error);
         return "";
      }
   };
   
   // =============================================
   // CARGAR DATOS DESDE API - CON VALIDACIÓN MEJORADA
   // =============================================
   useEffect(() => {
      const fetchSociologoData = async () => {
         try {
            console.log('🔄 [WorkArea] Cargando datos del sociólogo desde API...');
            
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
               
               // ✅ VALIDACIÓN MEJORADA
               const sobreIns = datos?.institucion_sobre_ins;
               
               if (sobreIns && isValidContent(sobreIns)) {
                  // ✅ HAY DATOS VÁLIDOS - Sanitizar y mostrar
                  const cleanHTML = sanitizeAndRenderHTML(sobreIns);
                  
                  if (cleanHTML && cleanHTML.length > 50) {
                     setSociologoData(cleanHTML);
                     setHasData(true);
                     console.log('✅ [WorkArea] Datos válidos cargados y HTML sanitizado');
                  } else {
                     // ❌ HTML vacío o muy corto después de sanitizar
                     setHasData(false);
                     setSociologoData("");
                     console.log('⚠️ [WorkArea] HTML vacío después de sanitizar');
                  }
               } else {
                  // ❌ NO HAY DATOS O SON INVÁLIDOS
                  setHasData(false);
                  setSociologoData("");
                  console.log('⚠️ [WorkArea] Contenido inválido o malformado');
               }
            } else {
               console.warn('⚠️ [WorkArea] Error en la respuesta de la API:', response.status);
               setHasData(false);
               setSociologoData("");
            }
            
            setLoading(false);
            
         } catch (error) {
            console.error('❌ [WorkArea] Error cargando datos:', error);
            setHasData(false);
            setSociologoData("");
            setLoading(false);
         }
      };
      
      fetchSociologoData();
   }, []);

   // =============================================
   // ESTILOS VISUALES
   // =============================================
   const workStyles = {
      section: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         padding: '80px 0'
      },
      decorativeBg: {
         position: 'absolute' as const,
         top: '-100px',
         right: '-100px',
         width: '350px',
         height: '350px',
         background: 'radial-gradient(circle, rgba(250,178,101,0.15) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      decorativeBg2: {
         position: 'absolute' as const,
         bottom: '-80px',
         left: '-80px',
         width: '280px',
         height: '280px',
         background: 'radial-gradient(circle, rgba(253,28,10,0.15) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      content: {
         position: 'relative' as const,
         zIndex: 1
      },
      header: {
         marginBottom: '4rem'
      },
      sectionTag: {
         color: '#FAB265',
         fontSize: '0.85rem',
         fontWeight: 700,
         textTransform: 'uppercase',
         letterSpacing: '2px',
         marginBottom: '0.75rem',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         padding: '8px 18px',
         background: 'rgba(250,178,101,0.15)',
         borderRadius: '20px',
         border: '2px solid rgba(250,178,101,0.4)',
         backdropFilter: 'blur(10px)',
         boxShadow: '0 4px 12px rgba(250,178,101,0.2)'
      },
      sectionTitle: {
         color: '#FFFFFF',
         fontSize: '2.5rem',
         fontWeight: 800,
         marginBottom: '1.5rem',
         lineHeight: 1.2,
         textShadow: '0 4px 16px rgba(0,0,0,0.5)'
      },
      sectionDescription: {
         color: '#FFFFFF',
         fontSize: '1.1rem',
         lineHeight: 1.9,
         marginBottom: 0
      },
      noDataMessage: {
         color: 'rgba(255,255,255,0.7)',
         fontSize: '1.05rem',
         lineHeight: 1.8,
         marginBottom: 0,
         padding: '32px 36px',
         background: 'rgba(255,255,255,0.05)',
         borderRadius: '20px',
         border: '2px dashed rgba(250,178,101,0.3)',
         backdropFilter: 'blur(10px)',
         fontStyle: 'italic',
         display: 'flex',
         alignItems: 'center',
         gap: '12px'
      },
      card: {
         background: 'rgba(255,255,255,0.08)',
         borderRadius: '20px',
         padding: '32px 28px',
         height: '100%',
         display: 'flex',
         flexDirection: 'column' as const,
         alignItems: 'flex-start',
         border: '2px solid rgba(250,178,101,0.2)',
         backdropFilter: 'blur(15px)',
         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
         position: 'relative' as const,
         overflow: 'hidden' as const
      },
      cardHover: {
         background: 'rgba(255,255,255,0.15)',
         borderColor: 'rgba(250,178,101,0.5)',
         transform: 'translateY(-10px)',
         boxShadow: '0 20px 48px rgba(250,178,101,0.25)'
      },
      cardNumber: {
         position: 'absolute' as const,
         top: '20px',
         right: '20px',
         fontSize: '3.5rem',
         fontWeight: 900,
         color: 'rgba(250,178,101,0.1)',
         lineHeight: 1,
         zIndex: 0
      },
      cardIcon: {
         marginBottom: '1.5rem',
         position: 'relative' as const,
         zIndex: 1,
         width: '70px',
         height: '70px',
         background: 'linear-gradient(135deg, #FD1C0A, #FAB265)',
         borderRadius: '16px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         padding: '16px',
         boxShadow: '0 8px 24px rgba(253,28,10,0.4)',
         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      cardIconHover: {
         transform: 'scale(1.1) rotate(5deg)',
         boxShadow: '0 12px 32px rgba(250,178,101,0.5)'
      },
      cardTitle: {
         color: '#FFFFFF',
         fontSize: '1.15rem',
         fontWeight: 700,
         marginBottom: '1rem',
         lineHeight: 1.5,
         position: 'relative' as const,
         zIndex: 1,
         textShadow: '0 2px 10px rgba(0,0,0,0.4)'
      },
      cardDescription: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '0.95rem',
         lineHeight: 1.7,
         marginBottom: 0,
         position: 'relative' as const,
         zIndex: 1
      },
      cardBorder: {
         position: 'absolute' as const,
         bottom: 0,
         left: 0,
         width: '0%',
         height: '4px',
         background: 'linear-gradient(90deg, #FAB265, #FFD700)',
         transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
         zIndex: 2
      },
      cardBorderHover: {
         width: '100%'
      },
      loading: {
         textAlign: 'center' as const,
         padding: '40px',
         color: '#FFFFFF'
      },
      warningIcon: {
         fontSize: '1.5rem',
         color: '#FAB265',
         minWidth: '24px'
      }
   };

   return (
      <div className="work-area pd-top-110" style={workStyles.section}>
         {/* Elementos decorativos de fondo */}
         <div style={workStyles.decorativeBg} />
         <div style={workStyles.decorativeBg2} />
         
         <div className="container" style={workStyles.content}>
            <div className="section-title" style={workStyles.header}>
               <div className="row">
                  
                  {/* Columna Izquierda: Títulos */}
                  <div className="col-lg-6 align-self-center">
                     <h6 className="sub-title right-line" style={workStyles.sectionTag}>
                        <i className="fa fa-briefcase"></i>
                        ÁMBITO PROFESIONAL
                     </h6>
                     <h2 className="title" style={workStyles.sectionTitle}>
                        ¿QUÉ ES UN SOCIÓLOGO?
                     </h2>
                  </div>
                  
                  {/* Columna Derecha: Descripción con VALIDACIÓN MEJORADA */}
                  <div className="col-lg-6 align-self-center">
                     {loading ? (
                        <div style={workStyles.loading}>
                           <div className="spinner-border" role="status" style={{ 
                              width: '3rem', 
                              height: '3rem', 
                              borderWidth: '4px',
                              borderColor: '#FAB265',
                              borderRightColor: 'transparent'
                           }}>
                              <span className="visually-hidden">Cargando...</span>
                           </div>
                           <p className="mt-3" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}>
                              Cargando información del sociólogo...
                           </p>
                        </div>
                     ) : hasData && sociologoData ? (
                        // ✅ HAY DATOS VÁLIDOS - Renderizar HTML sanitizado
                        <div 
                           className="content mt-lg-0" 
                           style={workStyles.sectionDescription}
                           dangerouslySetInnerHTML={{ __html: sociologoData }}
                        />
                     ) : (
                        // ❌ NO HAY DATOS O SON INVÁLIDOS - Mostrar mensaje
                        <div style={workStyles.noDataMessage}>
                           <i className="fa fa-info-circle" style={workStyles.warningIcon}></i>
                           <div>
                              <strong style={{ display: 'block', marginBottom: '4px', color: '#FAB265' }}>
                                 Información no disponible
                              </strong>
                              El contenido sobre "¿Qué es un sociólogo?" será mostrado aquí cuando la administración lo publique.
                           </div>
                        </div>
                     )}
                  </div>
                  
               </div>
            </div>
            
            {/* Grid de Tarjetas */}
            <div className="row g-4">
               {work_data.map((item, index) => (
                  <div key={item.id} className="col-lg-6 col-md-6">
                     <div 
                        className="single-intro-inner style-icon-bg"
                        style={workStyles.card}
                        onMouseEnter={(e: any) => {
                           Object.assign(e.currentTarget.style, workStyles.cardHover);
                           const icon = e.currentTarget.querySelector('.card-icon');
                           const border = e.currentTarget.querySelector('.card-border');
                           if (icon) Object.assign(icon.style, workStyles.cardIconHover);
                           if (border) Object.assign(border.style, workStyles.cardBorderHover);
                        }}
                        onMouseLeave={(e: any) => {
                           Object.assign(e.currentTarget.style, {
                              background: 'rgba(255,255,255,0.08)',
                              borderColor: 'rgba(250,178,101,0.2)',
                              transform: 'translateY(0)',
                              boxShadow: 'none'
                           });
                           const icon = e.currentTarget.querySelector('.card-icon');
                           const border = e.currentTarget.querySelector('.card-border');
                           if (icon) Object.assign(icon.style, { 
                              transform: 'scale(1) rotate(0deg)',
                              boxShadow: '0 8px 24px rgba(253,28,10,0.4)'
                           });
                           if (border) Object.assign(border.style, { width: '0%' });
                        }}
                     >
                        {/* Número decorativo */}
                        <div style={workStyles.cardNumber}>{item.id}</div>
                        
                        {/* Ícono con fondo gradiente institucional */}
                        <div className="thumb card-icon" style={workStyles.cardIcon}>
                           <Image 
                              src={item.icon} 
                              alt={item.title}
                              width={38}
                              height={38}
                              style={{ 
                                 filter: 'brightness(0) invert(1)',
                                 transition: 'filter 0.3s ease'
                              }}
                           />
                        </div>
                        
                        {/* Título */}
                        <h5 style={workStyles.cardTitle}>
                           {item.title}
                        </h5>
                        
                        {/* Descripción */}
                        <p style={workStyles.cardDescription}>
                           {item.desc}
                        </p>
                        
                        {/* Línea decorativa animada */}
                        <div className="card-border" style={workStyles.cardBorder} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* CSS Global para animaciones */}
         <style jsx global>{`
            @keyframes float {
               0%, 100% {
                  transform: translateY(0px);
               }
               50% {
                  transform: translateY(-10px);
               }
            }
            
            .work-area .single-intro-inner {
               will-change: transform, box-shadow, background;
            }
            
            .work-area .thumb img {
               transition: filter 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .work-area .content p {
               margin-bottom: 1rem;
            }
            
            .work-area .content strong {
               color: #FAB265;
               font-weight: 700;
            }
            
            @media (max-width: 991px) {
               .work-area {
                  padding: 50px 0 !important;
               }
               .section-title .title {
                  font-size: 2rem !important;
               }
            }
            
            @media (max-width: 767px) {
               .work-area {
                  padding: 40px 0 !important;
               }
               .section-title .title {
                  font-size: 1.75rem !important;
               }
            }
         `}</style>
      </div>
   );
};

export default WorkArea;