"use client";
import { useEffect, useState } from "react";

// =============================================
// INTERFACES - SOLO PARA VIDEOS
// =============================================
interface VideoData {
   video_id: number;
   video_enlace: string;
   video_titulo: string;
   video_breve_descripcion: string;
   video_estado: number;
   video_tipo: string;
}

interface ContenidoResponse {
   upea_videos?: VideoData[];
   [key: string]: any;
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

// =============================================
// UTILIDADES - Manejo de URLs de YouTube
// =============================================

/**
 * Convierte URL de YouTube a formato embed para iframe
 * ✅ https://www.youtube.com/watch?v=ABC123 → https://www.youtube.com/embed/ABC123
 * ✅ https://youtu.be/ABC123 → https://www.youtube.com/embed/ABC123
 * ✅ Ya es embed → Retorna tal cual
 */
const getYouTubeEmbedUrl = (videoUrl: string): string => {
  if (!videoUrl) return '';
  
  const cleanUrl = videoUrl.trim();
  
  // ✅ Si ya es formato embed, retornar tal cual
  if (cleanUrl.includes('/embed/')) {
    return cleanUrl;
  }
  
  // ✅ Extraer video ID de formato watch?v=
  const watchMatch = cleanUrl.match(/[?&]v=([^&]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&modestbranding=1&autoplay=0`;
  }
  
  // ✅ Extraer video ID de formato youtu.be/
  const shortMatch = cleanUrl.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1&autoplay=0`;
  }
  
  // ✅ Fallback: retornar URL original si no se puede convertir
  return cleanUrl;
};

// =============================================
// COMPONENTE PRINCIPAL - SOLO VIDEOS ✨
// =============================================
const Testimonial: React.FC = () => {
   
   const [videos, setVideos] = useState<VideoData[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGAR SOLO VIDEOS DESDE API /contenido
   // =============================================
   useEffect(() => {
      const fetchVideos = async () => {
         try {
            console.log('🔄 [Testimonial] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            console.log('🎬 Fetching videos desde: /api/v2/institucion/${INSTITUCION_ID}/contenido');
            
            // ✅ SOLO fetch al endpoint /contenido para obtener upea_videos
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/contenido`;
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
               const data: ContenidoResponse = await response.json();
               
               // ✅ Extraer SOLO upea_videos activos
               const videosActivos = (data.upea_videos || [])
                  .filter((video: VideoData) => video.video_estado === 1);
               
               console.log('✅ [Testimonial] Videos cargados:', {
                  total: videosActivos.length,
                  videos: videosActivos.map((v: VideoData) => ({
                     id: v.video_id,
                     titulo: v.video_titulo,
                     embed: getYouTubeEmbedUrl(v.video_enlace)
                  }))
               });
               
               setVideos(videosActivos);
            } else {
               console.warn(`⚠️ [Testimonial] Error ${response.status} al cargar videos`);
               setVideos([]);
            }
            
            setLoading(false);
            
         } catch (err: any) {
            console.error('❌ [Testimonial] Error cargando videos:', err?.message);
            setError(err?.message || 'Error de conexión con el servidor');
            setVideos([]);
            setLoading(false);
         }
      };
      
      fetchVideos();
   }, []);

   // =============================================
   // ESTILOS VISUALES - SOLO PARA VIDEOS 🎬
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
      headerSection: {
         textAlign: 'center' as const,
         marginBottom: '4rem'
      },
      sectionTitle: {
         color: '#FAB265',
         fontSize: '0.9rem',
         fontWeight: 700,
         textTransform: 'uppercase',
         letterSpacing: '1.5px',
         marginBottom: '8px',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         padding: '8px 20px',
         background: 'rgba(250,178,101,0.15)',
         borderRadius: '20px',
         border: '2px solid rgba(250,178,101,0.4)'
      },
      sectionSubtitle: {
         color: '#FFFFFF',
         fontSize: '2.5rem',
         fontWeight: 800,
         marginBottom: '1rem',
         textShadow: '0 4px 16px rgba(250,178,101,0.4)'
      },
      sectionDescription: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '1.05rem',
         maxWidth: '600px',
         margin: '0 auto'
      },
      videoGrid: {
         display: 'grid',
         gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
         gap: '30px',
         justifyContent: 'center'
      },
      videoCard: {
         background: 'rgba(255,255,255,0.05)',
         borderRadius: '24px',
         overflow: 'hidden',
         border: '2px solid rgba(250,178,101,0.2)',
         backdropFilter: 'blur(10px)',
         boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
         transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      },
      videoContainer: {
         position: 'relative' as const,
         width: '100%',
         paddingBottom: '56.25%', // 16:9 aspect ratio
         background: '#000'
      },
      videoIframe: {
         position: 'absolute' as const,
         top: 0,
         left: 0,
         width: '100%',
         height: '100%',
         border: 'none'
      },
      videoInfo: {
         padding: '24px'
      },
      videoTitle: {
         color: '#FFFFFF',
         fontSize: '1.25rem',
         fontWeight: 700,
         marginBottom: '8px',
         lineHeight: 1.4
      },
      videoDescription: {
         color: 'rgba(255,255,255,0.8)',
         fontSize: '0.95rem',
         lineHeight: 1.6,
         marginBottom: '16px'
      },
      videoBadge: {
         display: 'inline-flex',
         alignItems: 'center',
         gap: '6px',
         background: 'linear-gradient(135deg, #FD1C0A, #cc1608)',
         color: '#FFFFFF',
         padding: '6px 14px',
         borderRadius: '10px',
         fontSize: '0.8rem',
         fontWeight: 600
      },
      loading: {
         textAlign: 'center' as const,
         padding: '60px 40px',
         color: '#FFFFFF'
      },
      emptyState: {
         textAlign: 'center' as const,
         padding: '60px 40px',
         background: 'rgba(255,255,255,0.05)',
         borderRadius: '24px',
         border: '2px dashed rgba(250,178,101,0.3)'
      }
   };

   // =============================================
   // RENDERIZADO - SOLO VIDEOS
   // =============================================
   
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
                     Conectando con: {API_BASE_URL}
                  </p>
               </div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="testimonial-area pd-top-100" style={testimonialStyles.section}>
            <div className="container">
               <div style={{ ...testimonialStyles.emptyState, borderColor: '#FD1C0A' }}>
                  <i className="fa fa-exclamation-triangle" style={{ 
                     fontSize: '3.5rem', 
                     color: '#FD1C0A',
                     marginBottom: '20px',
                     display: 'block'
                  }}></i>
                  <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                     ⚠️ Error al Cargar Videos
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '24px' }}>{error}</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                     API: {API_BASE_URL} | ID: {INSTITUCION_ID}
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
      );
   }

   return (
      <div className="testimonial-area pd-top-100" style={testimonialStyles.section}>
         {/* Elementos decorativos de fondo */}
         <div style={testimonialStyles.decorativeBg} />
         <div style={testimonialStyles.decorativeBg2} />
         
         <div className="container" style={testimonialStyles.container}>
            
            {/* Header de Sección */}
            <div style={testimonialStyles.headerSection}>
               <h6 style={testimonialStyles.sectionTitle}>
                  <i className="fa fa-youtube-play"></i>
                  VIDEOS INSTITUCIONALES
               </h6>
               <h2 style={testimonialStyles.sectionSubtitle}>
                  Multimedia de Sociología
               </h2>
               <p style={testimonialStyles.sectionDescription}>
                  <i className="fa fa-database me-2"></i>
                  API: {API_BASE_URL} | Institución: {INSTITUCION_ID}
               </p>
            </div>
            
            {/* Grid de Videos */}
            {videos.length === 0 ? (
               <div style={testimonialStyles.emptyState}>
                  <i className="fa fa-video-camera" style={{ 
                     fontSize: '4rem', 
                     color: '#FAB265',
                     marginBottom: '20px',
                     opacity: 0.6,
                     display: 'block'
                  }}></i>
                  <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                     Sin Videos Disponibles
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                     Los videos institucionales se mostrarán aquí cuando la administración los publique.
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '1rem' }}>
                     API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                  </p>
               </div>
            ) : (
               <div style={testimonialStyles.videoGrid}>
                  {videos.map((video, index) => {
                     const embedUrl = getYouTubeEmbedUrl(video.video_enlace);
                     
                     return (
                        <article 
                           key={video.video_id}
                           style={testimonialStyles.videoCard}
                           onMouseEnter={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(-8px)';
                              e.currentTarget.style.boxShadow = '0 30px 80px rgba(250,178,101,0.4)';
                           }}
                           onMouseLeave={(e: any) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
                           }}
                        >
                           {/* Contenedor de Video - Iframe de YouTube */}
                           <div style={testimonialStyles.videoContainer}>
                              <iframe
                                 src={embedUrl}
                                 title={video.video_titulo}
                                 style={testimonialStyles.videoIframe}
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 allowFullScreen
                                 loading="lazy"
                              />
                           </div>
                           
                           {/* Información del Video */}
                           <div style={testimonialStyles.videoInfo}>
                              <h3 style={testimonialStyles.videoTitle}>
                                 {video.video_titulo}
                              </h3>
                              
                              {video.video_breve_descripcion && (
                                 <p style={testimonialStyles.videoDescription}>
                                    {video.video_breve_descripcion}
                                 </p>
                              )}
                              
                              {/* Badge de Tipo */}
                              {video.video_tipo && video.video_tipo !== 'sin tipo' && (
                                 <span style={testimonialStyles.videoBadge}>
                                    <i className="fa fa-tag"></i>
                                    {video.video_tipo}
                                 </span>
                              )}
                           </div>
                        </article>
                     );
                  })}
               </div>
            )}
            
         </div>
         
         {/* =============================================
            CSS Global - RESPONSIVE DESIGN
            ============================================= */}
         <style jsx global>{`
            /* =============================================
               RESPONSIVE DESIGN - TESTIMONIAL VIDEOS
               ============================================= */
            
            /* Tablet */
            @media (max-width: 991px) {
               .testimonial-area {
                  padding: 80px 0 !important;
               }
               
               .testimonial-area .sectionSubtitle {
                  font-size: 2rem !important;
               }
               
               .testimonial-area .videoGrid {
                  grid-template-columns: 1fr !important;
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
               
               .testimonial-area .sectionTitle {
                  font-size: 0.85rem !important;
                  padding: 6px 16px !important;
               }
               
               .testimonial-area .sectionSubtitle {
                  font-size: 1.5rem !important;
               }
               
               .testimonial-area .sectionDescription {
                  font-size: 0.95rem !important;
               }
               
               .testimonial-area .videoCard {
                  border-radius: 20px !important;
               }
               
               .testimonial-area .videoInfo {
                  padding: 20px !important;
               }
               
               .testimonial-area .videoTitle {
                  font-size: 1.1rem !important;
               }
               
               .testimonial-area .videoDescription {
                  font-size: 0.9rem !important;
               }
            }
            
            /* Móvil pequeño */
            @media (max-width: 576px) {
               .testimonial-area {
                  padding: 50px 0 !important;
               }
               
               .testimonial-area .sectionTitle {
                  font-size: 0.8rem !important;
               }
               
               .testimonial-area .sectionSubtitle {
                  font-size: 1.3rem !important;
               }
               
               .testimonial-area .videoTitle {
                  font-size: 1rem !important;
               }
               
               .testimonial-area .videoBadge {
                  padding: 5px 12px !important;
                  font-size: 0.75rem !important;
               }
            }
         `}</style>
      </div>
   )
}

export default Testimonial;