"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // ✅ Ya importado
import Link from 'next/link';
import { CSSProperties } from 'react';

// =============================================
// INTERFACES
// =============================================
interface Curso {
   iddetalle_cursos_academicos: number;
   det_img_portada: string;
   det_titulo: string;
   det_descripcion: string;
   det_costo: number | null;
   det_costo_ext: number | null;
   det_carga_horaria: number | null;
   det_lugar_curso: string;
   det_modalidad: string;
   det_fecha_ini: string;
   det_fecha_fin: string;
   tipo_curso_otro?: {
      tipo_conv_curso_nombre: string;
   };
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
 * Construye URL completa para imágenes de cursos
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta de cursos
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'curso' | 'convocatoria' | 'evento' | 'gaceta' | 'autoridad' | 'portada' = 'curso'
): string => {
  if (!imagePath) return '/images/placeholder-course.jpg';
  
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
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    evento: '/storage/imagenes/eventos/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/',
    portada: '/storage/imagenes/portadas/'
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

const formatPrice = (price: number | null): string => {
   if (!price) return 'Consultar';
   return `Bs. ${price.toLocaleString('es-BO')}`;
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const CourseGridArea: React.FC = () => {
   const [cursos, setCursos] = useState<Curso[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchCursos = async () => {
         try {
            setLoading(true);
            setError(null);
            console.log(`🔄 [Cursos] API: ${API_BASE_URL}`);
            console.log(`📋 Institución ID: ${INSTITUCION_ID}`);
            
            // ✅ LLAMADA CON VARIABLES DE ENTORNO
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/gacetaEventos`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
               ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
            };
            
            const response = await fetch(url, { 
               method: 'GET', 
               headers, 
               cache: 'no-store' 
            });
            
            if (response.ok) {
               const data = await response.json();
               const cursosData = data.cursos || [];
               
               console.log('✅ [Cursos] Datos cargados:', {
                  total: cursosData.length,
                  fuente: `Sociología (ID ${INSTITUCION_ID})`
               });
               
               setCursos(cursosData);
            } else {
               console.error('❌ Error en la respuesta:', response.status);
               setError(`Error ${response.status} al cargar cursos`);
            }
            
            setLoading(false);
         } catch (error) {
            console.error('❌ Error crítico cargando cursos:', error);
            setError('Error de conexión con el servidor');
            setLoading(false);
         }
      };

      fetchCursos();
   }, []);

   // =============================================
   // ESTILOS VISUALES
   // =============================================
   const courseStyles = {
      section: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
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
      header: {
         position: 'relative' as const,
         zIndex: 1,
         marginBottom: '4rem'
      },
      sectionSubtitle: {
         color: '#FAB265',
         fontWeight: 700,
         fontSize: '0.85rem',
         textTransform: 'uppercase',
         letterSpacing: '2px',
         marginBottom: '1rem',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         padding: '10px 24px',
         background: 'rgba(250,178,101,0.15)',
         borderRadius: '20px',
         border: '2px solid rgba(250,178,101,0.4)',
         backdropFilter: 'blur(10px)'
      } as CSSProperties,
      sectionTitle: {
         color: '#FFFFFF',
         fontSize: '3rem',
         fontWeight: 800,
         marginBottom: '1rem',
         position: 'relative' as const,
         display: 'inline-block',
         textShadow: '0 4px 16px rgba(250,178,101,0.4)'
      } as CSSProperties,
      titleLine: {
         position: 'absolute' as const,
         bottom: '-10px',
         left: '50%',
         transform: 'translateX(-50%)',
         width: '100px',
         height: '4px',
         background: 'linear-gradient(90deg, #FAB265, #FD1C0A)',
         borderRadius: '2px'
      } as CSSProperties,
      sectionDescription: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '1.05rem'
      } as CSSProperties,
      card: {
         background: 'rgba(255,255,255,0.08)',
         borderRadius: '20px',
         boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
         border: '2px solid rgba(250,178,101,0.2)',
         overflow: 'hidden' as const,
         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
         backdropFilter: 'blur(10px)',
         height: '100%',
         display: 'flex',
         flexDirection: 'column' as const
      } as CSSProperties,
      cardHover: {
         transform: 'translateY(-12px)',
         boxShadow: '0 20px 48px rgba(250,178,101,0.25)',
         borderColor: 'rgba(250,178,101,0.5)',
         background: 'rgba(255,255,255,0.12)'
      } as CSSProperties,
      imageWrapper: {
         position: 'relative' as const,
         width: '100%',
         height: '220px',
         overflow: 'hidden',
         background: 'linear-gradient(135deg, rgba(253,28,10,0.2), rgba(250,178,101,0.2))'
      } as CSSProperties,
      badge: {
         position: 'absolute' as const,
         top: '15px',
         right: '15px',
         background: 'linear-gradient(135deg, #FAB265, #FFD700)',
         color: '#050504',
         padding: '6px 14px',
         borderRadius: '10px',
         fontWeight: 700,
         fontSize: '0.75rem',
         textTransform: 'uppercase',
         zIndex: 2,
         boxShadow: '0 4px 12px rgba(250,178,101,0.4)',
         backdropFilter: 'blur(10px)'
      } as CSSProperties,
      content: {
         padding: '28px',
         flex: 1,
         display: 'flex',
         flexDirection: 'column' as const
      } as CSSProperties,
      title: {
         color: '#FFFFFF',
         fontSize: '1.15rem',
         fontWeight: 700,
         marginBottom: '12px',
         lineHeight: 1.4,
         textShadow: '0 2px 8px rgba(0,0,0,0.4)'
      } as CSSProperties,
      description: {
         color: 'rgba(255,255,255,0.85)',
         fontSize: '0.95rem',
         lineHeight: 1.6,
         marginBottom: '16px',
         flex: 1
      } as CSSProperties,
      infoBox: {
         fontSize: '0.85rem',
         color: 'rgba(255,255,255,0.9)',
         marginBottom: '10px',
         padding: '10px',
         background: 'rgba(250,178,101,0.1)',
         borderRadius: '8px',
         display: 'flex',
         alignItems: 'center',
         gap: '8px'
      } as CSSProperties,
      price: {
         fontSize: '1.25rem',
         fontWeight: 800,
         color: '#FAB265',
         marginBottom: '1.5rem',
         display: 'flex',
         alignItems: 'center',
         gap: '8px',
         textShadow: '0 2px 8px rgba(250,178,101,0.4)'
      } as CSSProperties,
      button: {
         background: 'linear-gradient(135deg, #FD1C0A, #cc1608)',
         color: '#FFFFFF',
         padding: '12px 24px',
         borderRadius: '12px',
         fontWeight: 700,
         fontSize: '0.9rem',
         textDecoration: 'none',
         display: 'inline-flex',
         alignItems: 'center',
         justifyContent: 'center',
         gap: '8px',
         boxShadow: '0 4px 12px rgba(253, 28, 10, 0.4)',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         border: '2px solid transparent',
         marginTop: 'auto'
      } as CSSProperties,
      buttonHover: {
         transform: 'translateY(-2px)',
         boxShadow: '0 8px 20px rgba(253, 28, 10, 0.5)',
         background: 'transparent',
         color: '#FAB265',
         borderColor: '#FAB265'
      } as CSSProperties,
      loading: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         minHeight: '600px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center'
      } as CSSProperties,
      error: {
         background: 'rgba(255,255,255,0.05)',
         border: '2px solid #FD1C0A',
         borderRadius: '20px',
         padding: '40px',
         textAlign: 'center' as const
      } as CSSProperties,
      emptyState: {
         background: 'rgba(255,255,255,0.05)',
         border: '2px dashed rgba(250,178,101,0.3)',
         borderRadius: '20px',
         padding: '60px 40px',
         textAlign: 'center' as const
      } as CSSProperties
   };

   if (loading) {
      return (
         <section className="course-area pd-top-120 pd-bottom-90" style={courseStyles.section}>
            <div style={courseStyles.decorativeBg} />
            <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
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
                  Cargando Cursos
               </h3>
               <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                  Conectando con: {API_BASE_URL}
               </p>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="course-area pd-top-120 pd-bottom-90" style={courseStyles.section}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div style={courseStyles.error}>
                        <i className="fa fa-exclamation-triangle" style={{ 
                           fontSize: '3.5rem', 
                           color: '#FD1C0A',
                           marginBottom: '20px',
                           display: 'block'
                        }}></i>
                        <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                            Error al Cargar
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '24px' }}>{error}</p>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                           API: {API_BASE_URL} | Institución: {INSTITUCION_ID}
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
      <section className="course-area pd-top-120 pd-bottom-90" style={courseStyles.section}>
         <div style={courseStyles.decorativeBg} />
         
         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="row justify-content-center mb-5" style={courseStyles.header}>
               <div className="col-lg-8 text-center">
                  <h2 className="title" style={courseStyles.sectionTitle}>
                     CURSOS ACADÉMICOS
                     <span style={courseStyles.titleLine} />
                  </h2>
                  
                  <h6 className="sub-title" style={courseStyles.sectionSubtitle}>
                     <i className="fa fa-graduation-cap"></i>
                     NUESTROS CURSOS
                  </h6>
                  
            
               </div>
            </div>

            {cursos.length === 0 ? (
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div style={courseStyles.emptyState}>
                        <i className="fa fa-graduation-cap" style={{ 
                           fontSize: '4rem', 
                           color: '#FAB265',
                           marginBottom: '20px',
                           opacity: 0.6
                        }}></i>
                        <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                           Sin Cursos Publicados
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}>
                           Los cursos académicos se mostrarán aquí cuando estén disponibles.
                        </p>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="row g-4">
                  {cursos.map((curso) => {
                     // ✅ Construir URL de imagen inteligente
                     const imageUrl = buildImageUrl(curso.det_img_portada, 'curso');
                     // ✅ Detectar si es URL externa para unoptimized
                     const isExternalImage = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
                     
                     return (
                        <div key={curso.iddetalle_cursos_academicos} className="col-lg-4 col-md-6">
                           <article 
                              style={courseStyles.card}
                              onMouseEnter={(e: any) => {
                                 Object.assign(e.currentTarget.style, courseStyles.cardHover);
                                 const img = e.currentTarget.querySelector('.course-image');
                                 if (img) Object.assign(img.style, { transform: 'scale(1.1)' });
                              }}
                              onMouseLeave={(e: any) => {
                                 Object.assign(e.currentTarget.style, {
                                    transform: 'translateY(0)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    borderColor: 'rgba(250,178,101,0.2)',
                                    background: 'rgba(255,255,255,0.08)'
                                 });
                                 const img = e.currentTarget.querySelector('.course-image');
                                 if (img) Object.assign(img.style, { transform: 'scale(1)' });
                              }}
                           >
                              {/* Imagen del curso */}
                              <div style={courseStyles.imageWrapper}>
                                 {/* ✅ REEMPLAZADO: <img> → <Image /> de Next.js */}
                                 <Image
                                    src={imageUrl}
                                    alt={curso.det_titulo}
                                    width={500}
                                    height={300}
                                    className="course-image"
                                    style={{ 
                                       width: '100%', 
                                       height: '100%', 
                                       objectFit: 'cover',
                                       transition: 'transform 0.4s ease'
                                    }}
                                    // ✅ No optimizar si es URL externa (MinIO)
                                    unoptimized={isExternalImage}
                                    // ✅ Fallback si la imagen falla
                                    onError={(e) => {
                                       const target = e.target as HTMLImageElement;
                                       target.src = '/images/placeholder-course.jpg';
                                    }}
                                    loading="lazy"
                                 />
                                 
                                 {/* Badge de tipo de curso */}
                                 {curso.tipo_curso_otro && (
                                    <span style={courseStyles.badge}>
                                       {curso.tipo_curso_otro.tipo_conv_curso_nombre}
                                    </span>
                                 )}
                              </div>
                              
                              {/* Contenido */}
                              <div style={courseStyles.content}>
                                 
                                 {/* Título */}
                                 <h5 style={courseStyles.title}>
                                    {curso.det_titulo}
                                 </h5>
                                 
                                 {/* Descripción */}
                                 {curso.det_descripcion && (
                                    <div style={courseStyles.description}
                                       dangerouslySetInnerHTML={{ 
                                          __html: curso.det_descripcion.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                                       }}
                                    />
                                 )}
                                 
                                 {/* Información del curso */}
                                 {curso.det_carga_horaria && (
                                    <div style={courseStyles.infoBox}>
                                       <i className="fa fa-clock-o" style={{ color: '#FAB265' }}></i>
                                       <strong>Duración:</strong> {curso.det_carga_horaria} hrs
                                    </div>
                                 )}
                                 
                                 {curso.det_modalidad && (
                                    <div style={courseStyles.infoBox}>
                                       <i className="fa fa-laptop" style={{ color: '#FAB265' }}></i>
                                       <strong>Modalidad:</strong> {curso.det_modalidad}
                                    </div>
                                 )}
                                 
                                 {curso.det_lugar_curso && (
                                    <div style={courseStyles.infoBox}>
                                       <i className="fa fa-map-marker" style={{ color: '#FAB265' }}></i>
                                       <strong>Lugar:</strong> {curso.det_lugar_curso}
                                    </div>
                                 )}
                                 
                                 {curso.det_fecha_ini && (
                                    <div style={courseStyles.infoBox}>
                                       <i className="fa fa-calendar" style={{ color: '#FAB265' }}></i>
                                       <strong>Inicio:</strong> {formatDate(curso.det_fecha_ini)}
                                    </div>
                                 )}
                                 
                                 {/* Precio */}
                                 <div style={courseStyles.price}>
                                    <i className="fa fa-money"></i>
                                    {formatPrice(curso.det_costo)}
                                 </div>
                                 
                                 {/* Botón Ver más */}
                                 <Link 
                                    href={`/course-details/${curso.iddetalle_cursos_academicos}`}
                                    style={courseStyles.button}
                                    onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, courseStyles.buttonHover)}
                                    onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, courseStyles.button)}
                                 >
                                    Ver más detalles <i className="fa fa-arrow-right"></i>
                                 </Link>
                              </div>
                           </article>
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
         
         <style jsx global>{`
            @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
            
            .course-area article {
               will-change: transform, box-shadow, background;
            }
            
            @media (max-width: 991px) {
               .course-area {
                  padding: 60px 0 !important;
               }
               .section-title {
                  font-size: 2.5rem !important;
               }
            }
            
            @media (max-width: 767px) {
               .course-area {
                  padding: 50px 0 !important;
               }
               .section-title {
                  font-size: 2rem !important;
               }
            }
         `}</style>
      </section>
   );
};

export default CourseGridArea;