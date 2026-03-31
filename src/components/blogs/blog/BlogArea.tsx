"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CSSProperties } from 'react';

// =============================================
// INTERFACES
// =============================================
interface Convocatoria {
   idconvocatorias: number;
   con_foto_portada: string;
   con_titulo: string;
   con_descripcion: string;
   con_fecha_inicio: string;
   con_fecha_fin: string;
   tipo_conv_comun?: {
      tipo_conv_comun_titulo: string;
   };
}

interface Evento {
   evento_id: number;
   evento_titulo: string;
   evento_imagen: string;
   evento_descripcion: string;
   evento_fecha: string;
   evento_hora: string;
   evento_lugar: string;
   tipo_evento: string;
}

interface Curso {
   iddetalle_cursos_academicos: number;
   det_img_portada: string;
   det_titulo: string;
   det_descripcion: string;
   det_modalidad: string;
   det_fecha_ini: string;
   det_fecha_fin: string;
   tipo_curso_otro?: {
      tipo_conv_curso_nombre: string;
   };
}

interface Gaceta {
   gaceta_id: number;
   gaceta_titulo: string;
   gaceta_fecha: string;
   gaceta_documento: string;
   gaceta_tipo: string;
}

// =============================================
// CONSTANTES - SOLO ID 35 (SOCIOLOGÍA)
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35"; // ✅ SOLO SOCIOLOGÍA

// =============================================
// UTILIDADES
// =============================================
const buildImageUrl = (fileName: string | null | undefined): string => {
   if (!fileName) return '/images/placeholder-event.jpg';
   const cleanName = fileName.trim();
   if (cleanName.startsWith('http')) return cleanName;
   if (cleanName.startsWith('/storage/')) return `${API_BASE_URL}${cleanName}`;
   return `${API_BASE_URL}${cleanName}`;
};

const formatDate = (dateString: string): string => {
   if (!dateString) return 'Fecha no disponible';
   const date = new Date(dateString);
   return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   });
};

// =============================================
// COMPONENTE PRINCIPAL - SOLO ID 35 ✨
// =============================================
const BlogArea: React.FC = () => {
   const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
   const [eventos, setEventos] = useState<Evento[]>([]);
   const [cursos, setCursos] = useState<Curso[]>([]);
   const [gacetas, setGacetas] = useState<Gaceta[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            setError(null);
            console.log(`🔄 [BlogArea] Cargando desde ID ${INSTITUCION_ID} (Sociología)...`);
            
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/gacetaEventos`;
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
            
            const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
            
            if (response.ok) {
               const data = await response.json();
               console.log('✅ [BlogArea] Datos cargados:', {
                  convocatorias: data.convocatorias?.length || 0,
                  eventos: data.upea_evento?.length || 0,
                  cursos: data.cursos?.length || 0,
                  gacetas: data.upea_gaceta_universitaria?.length || 0
               });
               
               setConvocatorias(data.convocatorias || []);
               setEventos(data.upea_evento || []);
               setCursos(data.cursos || []);
               setGacetas(data.upea_gaceta_universitaria || []);
            } else {
               console.error('❌ Error en la respuesta:', response.status);
               setError(`Error ${response.status} al cargar datos`);
            }
            
            setLoading(false);
         } catch (error) {
            console.error('❌ Error cargando datos:', error);
            setError('Error de conexión');
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   // =============================================
   // ESTILOS VISUALES - FONDO OSCURO INSTITUCIONAL 🎨
   // =============================================
   const blogStyles = {
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
         overflow: 'hidden',
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
      sectionHeader: {
         color: '#FAB265',
         fontSize: '1.5rem',
         fontWeight: 700,
         marginBottom: '2rem',
         display: 'flex',
         alignItems: 'center',
         gap: '10px',
         paddingBottom: '12px',
         borderBottom: '3px solid rgba(250,178,101,0.4)'
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
         <section className="blog-area pd-top-120 pd-bottom-90" style={blogStyles.section}>
            <div style={blogStyles.decorativeBg} />
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
                  Cargando Convocatorias
               </h3>
               <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                  Obteniendo datos de Sociología...
               </p>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="blog-area pd-top-120 pd-bottom-90" style={blogStyles.section}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div style={blogStyles.error}>
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

   const totalItems = convocatorias.length + eventos.length + cursos.length + gacetas.length;

   return (
      <section className="blog-area pd-top-120 pd-bottom-90" style={blogStyles.section}>
         {/* Elemento decorativo de fondo */}
         <div style={blogStyles.decorativeBg} />
         
         <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Header de Sección */}
            <div className="row justify-content-center mb-5" style={blogStyles.header}>
               <div className="col-lg-8 text-center">
                  
                  <h2 className="title" style={blogStyles.sectionTitle}>
                     CONVOCATORIAS Y EVENTOS
                     <span style={blogStyles.titleLine} />
                  </h2>
                  
                  <h6 className="sub-title" style={blogStyles.sectionSubtitle}>
                     <i className="fa fa-calendar"></i>
                     ÚLTIMAS PUBLICACIONES
                  </h6>
                  
                  <p style={blogStyles.sectionDescription}>
                     <i className="fa fa-graduation-cap me-2"></i>
                     Fuente: Sociología (ID {INSTITUCION_ID})
                  </p>
                  
               </div>
            </div>

            {totalItems === 0 ? (
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div style={blogStyles.emptyState}>
                        <i className="fa fa-folder-open-o" style={{ 
                           fontSize: '4rem', 
                           color: '#FAB265',
                           marginBottom: '20px',
                           opacity: 0.6
                        }}></i>
                        <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                           Sin Publicaciones Disponibles
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}>
                           Las convocatorias y eventos se mostrarán aquí cuando estén disponibles.
                        </p>
                     </div>
                  </div>
               </div>
            ) : (
               <div>
                  {/* CONVOCATORIAS */}
                  {convocatorias.length > 0 && (
                     <div className="mb-5">
                        <h3 style={blogStyles.sectionHeader}>
                           <i className="fa fa-file-text-o"></i>
                           Convocatorias ({convocatorias.length})
                        </h3>
                        <div className="row g-4">
                           {convocatorias.map((convocatoria) => (
                              <div key={convocatoria.idconvocatorias} className="col-lg-4 col-md-6">
                                 <article 
                                    style={blogStyles.card}
                                    onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, blogStyles.cardHover)}
                                    onMouseLeave={(e: any) => {
                                       Object.assign(e.currentTarget.style, {
                                          transform: 'translateY(0)',
                                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                          borderColor: 'rgba(250,178,101,0.2)',
                                          background: 'rgba(255,255,255,0.08)'
                                       });
                                    }}
                                 >
                                    <div style={blogStyles.imageWrapper}>
                                       <img
                                          src={buildImageUrl(convocatoria.con_foto_portada)}
                                          alt={convocatoria.con_titulo}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                          onMouseEnter={(e: any) => e.currentTarget.style.transform = 'scale(1.1)'}
                                          onMouseLeave={(e: any) => e.currentTarget.style.transform = 'scale(1)'}
                                       />
                                       {convocatoria.tipo_conv_comun && (
                                          <span style={blogStyles.badge}>
                                             {convocatoria.tipo_conv_comun.tipo_conv_comun_titulo}
                                          </span>
                                       )}
                                    </div>
                                    <div style={blogStyles.content}>
                                       <h5 style={blogStyles.title}>{convocatoria.con_titulo}</h5>
                                       {convocatoria.con_descripcion && (
                                          <div style={blogStyles.description}
                                             dangerouslySetInnerHTML={{ 
                                                __html: convocatoria.con_descripcion.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                                             }}
                                          />
                                       )}
                                       {convocatoria.con_fecha_inicio && (
                                          <div style={blogStyles.infoBox}>
                                             <i className="fa fa-calendar" style={{ color: '#FAB265' }}></i>
                                             <strong>Inicio:</strong> {formatDate(convocatoria.con_fecha_inicio)}
                                          </div>
                                       )}
                                       {convocatoria.con_fecha_fin && (
                                          <div style={blogStyles.infoBox}>
                                             <i className="fa fa-calendar-check-o" style={{ color: '#28a745' }}></i>
                                             <strong>Fin:</strong> {formatDate(convocatoria.con_fecha_fin)}
                                          </div>
                                       )}
                                       <Link 
                                          href={`/event-details/${convocatoria.idconvocatorias}`}
                                          style={blogStyles.button}
                                          onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, blogStyles.buttonHover)}
                                          onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, blogStyles.button)}
                                       >
                                          Ver más <i className="fa fa-arrow-right"></i>
                                       </Link>
                                    </div>
                                 </article>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* EVENTOS */}
                  {eventos.length > 0 && (
                     <div className="mb-5">
                        <h3 style={{...blogStyles.sectionHeader, color: '#FAB265', borderBottomColor: 'rgba(250,178,101,0.4)'}}>
                           <i className="fa fa-calendar"></i>
                           Eventos ({eventos.length})
                        </h3>
                        <div className="row g-4">
                           {eventos.map((evento) => (
                              <div key={evento.evento_id} className="col-lg-4 col-md-6">
                                 <article 
                                    style={blogStyles.card}
                                    onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, blogStyles.cardHover)}
                                    onMouseLeave={(e: any) => {
                                       Object.assign(e.currentTarget.style, {
                                          transform: 'translateY(0)',
                                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                          borderColor: 'rgba(250,178,101,0.2)',
                                          background: 'rgba(255,255,255,0.08)'
                                       });
                                    }}
                                 >
                                    <div style={blogStyles.imageWrapper}>
                                       <img
                                          src={buildImageUrl(evento.evento_imagen)}
                                          alt={evento.evento_titulo}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                          onMouseEnter={(e: any) => e.currentTarget.style.transform = 'scale(1.1)'}
                                          onMouseLeave={(e: any) => e.currentTarget.style.transform = 'scale(1)'}
                                       />
                                       <span style={blogStyles.badge}>Evento</span>
                                    </div>
                                    <div style={blogStyles.content}>
                                       <h5 style={blogStyles.title}>{evento.evento_titulo}</h5>
                                       {evento.evento_descripcion && (
                                          <div style={blogStyles.description}
                                             dangerouslySetInnerHTML={{ 
                                                __html: evento.evento_descripcion.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                                             }}
                                          />
                                       )}
                                       <div style={blogStyles.infoBox}>
                                          <i className="fa fa-calendar" style={{ color: '#FAB265' }}></i>
                                          <strong>Fecha:</strong> {evento.evento_fecha}
                                       </div>
                                       {evento.evento_hora && (
                                          <div style={blogStyles.infoBox}>
                                             <i className="fa fa-clock-o" style={{ color: '#17a2b8' }}></i>
                                             <strong>Hora:</strong> {evento.evento_hora}
                                          </div>
                                       )}
                                       {evento.evento_lugar && (
                                          <div style={blogStyles.infoBox}>
                                             <i className="fa fa-map-marker" style={{ color: '#dc3545' }}></i>
                                             <strong>Lugar:</strong> {evento.evento_lugar}
                                          </div>
                                       )}
                                       <Link 
                                          href={`/event-details/${evento.evento_id}`}
                                          style={{...blogStyles.button, background: 'transparent', borderColor: '#FAB265', color: '#FAB265'}}
                                          onMouseEnter={(e: any) => {
                                             Object.assign(e.currentTarget.style, {
                                                background: 'linear-gradient(135deg, #FAB265, #FFD700)',
                                                color: '#050504',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 20px rgba(250,178,101,0.5)'
                                             });
                                          }}
                                          onMouseLeave={(e: any) => {
                                             Object.assign(e.currentTarget.style, {
                                                background: 'transparent',
                                                borderColor: '#FAB265',
                                                color: '#FAB265',
                                                transform: 'translateY(0)',
                                                boxShadow: '0 4px 12px rgba(253, 28, 10, 0.4)'
                                             });
                                          }}
                                       >
                                          Ver más <i className="fa fa-arrow-right"></i>
                                       </Link>
                                    </div>
                                 </article>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* CURSOS */}
                  {cursos.length > 0 && (
                     <div className="mb-5">
                        <h3 style={{...blogStyles.sectionHeader, color: '#FAB265', borderBottomColor: 'rgba(250,178,101,0.4)'}}>
                           <i className="fa fa-graduation-cap"></i>
                           Cursos ({cursos.length})
                        </h3>
                        <div className="row g-4">
                           {cursos.map((curso) => (
                              <div key={curso.iddetalle_cursos_academicos} className="col-lg-4 col-md-6">
                                 <article 
                                    style={blogStyles.card}
                                    onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, blogStyles.cardHover)}
                                    onMouseLeave={(e: any) => {
                                       Object.assign(e.currentTarget.style, {
                                          transform: 'translateY(0)',
                                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                          borderColor: 'rgba(250,178,101,0.2)',
                                          background: 'rgba(255,255,255,0.08)'
                                       });
                                    }}
                                 >
                                    <div style={blogStyles.imageWrapper}>
                                       <img
                                          src={buildImageUrl(curso.det_img_portada)}
                                          alt={curso.det_titulo}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                          onMouseEnter={(e: any) => e.currentTarget.style.transform = 'scale(1.1)'}
                                          onMouseLeave={(e: any) => e.currentTarget.style.transform = 'scale(1)'}
                                       />
                                       {curso.tipo_curso_otro && (
                                          <span style={blogStyles.badge}>
                                             {curso.tipo_curso_otro.tipo_conv_curso_nombre}
                                          </span>
                                       )}
                                    </div>
                                    <div style={blogStyles.content}>
                                       <h5 style={blogStyles.title}>{curso.det_titulo}</h5>
                                       {curso.det_descripcion && (
                                          <div style={blogStyles.description}
                                             dangerouslySetInnerHTML={{ 
                                                __html: curso.det_descripcion.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                                             }}
                                          />
                                       )}
                                       {curso.det_modalidad && (
                                          <div style={blogStyles.infoBox}>
                                             <i className="fa fa-laptop" style={{ color: '#FAB265' }}></i>
                                             <strong>Modalidad:</strong> {curso.det_modalidad}
                                          </div>
                                       )}
                                       <Link 
                                          href={`/course-details/${curso.iddetalle_cursos_academicos}`}
                                          style={blogStyles.button}
                                          onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, blogStyles.buttonHover)}
                                          onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, blogStyles.button)}
                                       >
                                          Ver más <i className="fa fa-arrow-right"></i>
                                       </Link>
                                    </div>
                                 </article>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* GACETAS UNIVERSITARIAS */}
                  {gacetas.length > 0 && (
                     <div className="mb-5">
                        <h3 style={{...blogStyles.sectionHeader, color: '#FAB265', borderBottomColor: 'rgba(250,178,101,0.4)'}}>
                           <i className="fa fa-newspaper-o"></i>
                           Gacetas Universitarias ({gacetas.length})
                        </h3>
                        <div className="row g-4">
                           {gacetas.map((gaceta) => (
                              <div key={gaceta.gaceta_id} className="col-lg-4 col-md-6">
                                 <article 
                                    style={blogStyles.card}
                                    onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, blogStyles.cardHover)}
                                    onMouseLeave={(e: any) => {
                                       Object.assign(e.currentTarget.style, {
                                          transform: 'translateY(0)',
                                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                          borderColor: 'rgba(250,178,101,0.2)',
                                          background: 'rgba(255,255,255,0.08)'
                                       });
                                    }}
                                 >
                                    <div style={blogStyles.content}>
                                       <h5 style={blogStyles.title}>{gaceta.gaceta_titulo}</h5>
                                       <div style={blogStyles.infoBox}>
                                          <i className="fa fa-calendar" style={{ color: '#FAB265' }}></i>
                                          <strong>Fecha:</strong> {formatDate(gaceta.gaceta_fecha)}
                                       </div>
                                       {gaceta.gaceta_tipo && (
                                          <div style={blogStyles.infoBox}>
                                             <i className="fa fa-file-pdf-o" style={{ color: '#dc3545' }}></i>
                                             <strong>Tipo:</strong> {gaceta.gaceta_tipo}
                                          </div>
                                       )}
                                       <a
                                          href={buildImageUrl(gaceta.gaceta_documento)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={blogStyles.button}
                                          onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, blogStyles.buttonHover)}
                                          onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, blogStyles.button)}
                                       >
                                          <i className="fa fa-download"></i> Descargar PDF
                                       </a>
                                    </div>
                                 </article>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
         
         {/* CSS Global para animaciones */}
         <style jsx global>{`
            @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
            
            .blog-area article {
               will-change: transform, box-shadow, background;
            }
            
            @media (max-width: 991px) {
               .blog-area {
                  padding: 60px 0 !important;
               }
               .section-title {
                  font-size: 2.5rem !important;
               }
            }
            
            @media (max-width: 767px) {
               .blog-area {
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

export default BlogArea;