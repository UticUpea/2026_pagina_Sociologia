"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // ✅ IMPORTANTE: Asegurar import de Image
import { CSSProperties } from 'react';

// ✅ IMPORTAR HEADER Y FOOTER CON RUTAS RELATIVAS
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

// =============================================
// INTERFACES
// =============================================
interface OfertaAcademica {
   ofertas_id: number;
   ofertas_titulo: string;
   ofertas_descripcion: string;
   ofertas_inscripciones_ini: string;
   ofertas_inscripciones_fin: string;
   ofertas_fecha_examen: string;
   ofertas_imagen: string;
   ofertas_referencia: string;
   ofertas_estado: number;
}

interface PortadaData {
   portada_id: number;
   portada_imagen: string;
   portada_titulo: string;
   portada_subtitulo: string;
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

// ✅ IDs DE PORTADAS ALEATORIAS (238, 239, 240)
const PORTADA_IDS_RANDOM = [238, 239, 240];

// =============================================
// UTILIDADES - Manejo Inteligente de Imágenes
// =============================================

/**
 * Construye URL completa para imágenes de ofertas
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta de ofertas
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'oferta' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'oferta'
): string => {
  if (!imagePath) return '/images/placeholder-offer.jpg';
  
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
    oferta: '/storage/imagenes/ofertas/',
    portada: '/storage/imagenes/portadas/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

// ✅ CONSTRUIR URL DE PORTADA DESDE API
const buildPortadaUrl = (
  imagenPath: string | null | undefined,
  type: 'portada' | 'oferta' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'portada'
): string => {
  if (!imagenPath) return '/assets/img/sociologia3.jpg';
  
  const cleanPath = imagenPath.trim();
  
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
    portada: '/storage/imagenes/portadas/',
    oferta: '/storage/imagenes/ofertas/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

// ✅ FUNCIÓN PARA SELECCIONAR PORTADA RANDOM (IDs 238-240)
const getRandomPortada = (portadas: PortadaData[]): PortadaData | null => {
   const portadasFiltradas = portadas.filter(p => 
      PORTADA_IDS_RANDOM.includes(p.portada_id)
   );
   
   if (portadasFiltradas.length === 0) return null;
   
   const randomIndex = Math.floor(Math.random() * portadasFiltradas.length);
   return portadasFiltradas[randomIndex];
};

const formatDate = (dateString: string): string => {
   if (!dateString) return 'Fecha no disponible';
   return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   });
};

// =============================================
// COMPONENTE - BANNER HERO CON PORTADA RANDOM ✨
// =============================================
const HeroBanner: React.FC = () => {
   const [portadaUrl, setPortadaUrl] = useState<string>('/assets/img/sociologia3.jpg');

   useEffect(() => {
      const fetchPortada = async () => {
         try {
            console.log('🔄 [HeroBanner] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ URL y headers con variables de entorno
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
               const result = await response.json();
               const portadaArray = result?.portada || [];
               
               console.log('📊 [HeroBanner] Total portadas:', portadaArray.length);
               
               const portadaRandom = getRandomPortada(portadaArray);
               
               if (portadaRandom) {
                  console.log('🎲 [HeroBanner] Portada seleccionada (random):', {
                     id: portadaRandom.portada_id,
                     titulo: portadaRandom.portada_titulo
                  });
                  
                  // ✅ Construir URL de portada inteligente
                  const fullUrl = buildPortadaUrl(portadaRandom.portada_imagen, 'portada');
                  console.log('🖼️ [HeroBanner] Portada cargada:', fullUrl);
                  setPortadaUrl(fullUrl);
               } else {
                  console.warn('⚠️ [HeroBanner] No se encontraron portadas con IDs 238-240, usando fallback');
                  setPortadaUrl('/assets/img/sociologia3.jpg');
               }
            } else {
               console.warn(`⚠️ [HeroBanner] Error ${response.status}, usando fallback`);
               setPortadaUrl('/assets/img/sociologia3.jpg');
            }
         } catch (error) {
            console.error('❌ [HeroBanner] Error cargando portada:', error);
            setPortadaUrl('/assets/img/sociologia3.jpg');
         }
      };

      fetchPortada();
   }, []);

   return (
      <div 
         className="page-banner-area"
         style={{
            position: 'relative' as const,
            backgroundImage: `linear-gradient(rgba(5, 5, 4, 0.5), rgba(5, 5, 4, 0.5)), url("${portadaUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundAttachment: 'scroll',
            backgroundRepeat: 'no-repeat',
            minHeight: '450px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden' as const
         }}
      >
         <div className="container" style={{ position: 'relative' as const, zIndex: 1, textAlign: 'center' as const }}>
            <h1 
               style={{
                  color: '#FFFFFF',
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  marginBottom: '16px',
                  textShadow: '0 4px 15px rgba(0,0,0,0.8)',
                  animation: 'fadeInDown 0.8s ease'
               }}
            >
               OFERTAS ACADÉMICAS
            </h1>
            
            <nav aria-label="breadcrumb">
               <ol className="breadcrumb justify-content-center mb-0" style={{ background: 'transparent' }}>
                  <li className="breadcrumb-item">
                     <Link 
                        href="/" 
                        style={{
                           color: '#FFFFFF',
                           textDecoration: 'none',
                           fontWeight: 500,
                           transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e: any) => e.currentTarget.style.color = '#FAB265'}
                        onMouseLeave={(e: any) => e.currentTarget.style.color = '#FFFFFF'}
                     >
                        <i className="fa fa-home me-1"></i> Inicio
                     </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                     <span style={{ 
                        color: '#FAB265', 
                        fontWeight: 600
                     }}>
                        <i className="fa fa-angle-right me-1"></i> Ofertas Académicas
                     </span>
                  </li>
               </ol>
            </nav>
         </div>
         
         <style jsx global>{`
            @keyframes fadeInDown {
               from { opacity: 0; transform: translateY(-30px); }
               to { opacity: 1; transform: translateY(0); }
            }
            .breadcrumb {
               background: transparent !important;
               padding: 0 !important;
               margin: 0 !important;
            }
            .breadcrumb-item + .breadcrumb-item::before {
               color: rgba(255,255,255,0.6);
            }
            .breadcrumb-item.active {
               color: #FAB265;
            }
            
            /* Responsive - Banner */
            @media (max-width: 767px) {
               .page-banner-area h1 {
                  font-size: 2rem !important;
               }
               .page-banner-area {
                  min-height: 350px !important;
               }
            }
            @media (max-width: 576px) {
               .page-banner-area h1 {
                  font-size: 1.5rem !important;
               }
               .page-banner-area {
                  min-height: 300px !important;
               }
            }
         `}</style>
      </div>
   );
};

// =============================================
// COMPONENTE PRINCIPAL - OFERTAS ACADÉMICAS ✨
// =============================================
const OfferArea: React.FC = () => {
   const [ofertas, setOfertas] = useState<OfertaAcademica[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchOfertas = async () => {
         try {
            console.log('🔄 [OfferArea] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ URL y headers con variables de entorno
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/gacetaEventos`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
            };
            if (API_TOKEN) {
               headers['Authorization'] = `Bearer ${API_TOKEN}`;
            }
            
            const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
            
            if (response.ok) {
               const data = await response.json();
               const ofertasData = data.ofertasAcademicas || [];
               
               console.log('✅ [OfferArea] Ofertas cargadas:', {
                  total: ofertasData.length,
                  fuente: `Sociología (ID ${INSTITUCION_ID})`
               });
               
               setOfertas(ofertasData);
            } else {
               console.error('❌ Error en la respuesta:', response.status);
               setError(`Error ${response.status} al cargar ofertas`);
            }
            
            setLoading(false);
         } catch (error: any) {
            console.error('❌ Error crítico cargando ofertas:', error?.message);
            setError(error?.message || 'Error de conexión con el servidor');
            setLoading(false);
         }
      };

      fetchOfertas();
   }, []);

   // =============================================
   // ESTILOS VISUALES
   // =============================================
   const offerStyles = {
      section: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         padding: '80px 0'
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
         height: '250px',
         overflow: 'hidden' as const,
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
         textTransform: 'uppercase' as const,
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
         fontSize: '1.25rem',
         fontWeight: 700,
         marginBottom: '16px',
         lineHeight: 1.4,
         textShadow: '0 2px 8px rgba(0,0,0,0.4)'
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
      loading: {
         background: 'transparent',
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
         <>
            <HeaderOne />
            <HeroBanner />
            <section className="offer-area pd-top-120 pd-bottom-90" style={offerStyles.section}>
               <div style={offerStyles.decorativeBg} />
               <div className="container text-center" style={{ position: 'relative' as const, zIndex: 1 }}>
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
                     Cargando Ofertas
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                     Conectando con: {API_BASE_URL}
                  </p>
               </div>
            </section>
            <FooterOne />
         </>
      );
   }

   if (error) {
      return (
         <>
            <HeaderOne />
            <HeroBanner />
            <section className="offer-area pd-top-120 pd-bottom-90" style={offerStyles.section}>
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <div style={offerStyles.error}>
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
                           <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '24px' }}>
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
               </div>
            </section>
            <FooterOne />
         </>
      );
   }

   return (
      <>
         <HeaderOne />
         <HeroBanner />
         
         <section className="offer-area pd-top-120 pd-bottom-90" style={offerStyles.section}>
            <div style={offerStyles.decorativeBg} />
            
            <div className="container" style={offerStyles.contentWrapper}>
               
               {/* Grid de Ofertas - RESPONSIVE */}
               <div className="row g-4">
                  {ofertas.length === 0 ? (
                     <div className="col-12 text-center">
                        <div style={offerStyles.emptyState}>
                           <i className="fa fa-graduation-cap" style={{ 
                              fontSize: '4rem', 
                              color: '#FAB265',
                              marginBottom: '20px',
                              opacity: 0.6,
                              display: 'block'
                           }}></i>
                           <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '12px' }}>
                              Sin Ofertas Disponibles
                           </h3>
                           <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}>
                              Las ofertas académicas se mostrarán aquí cuando estén disponibles.
                           </p>
                           <p className="text-muted small mt-2">
                              API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                           </p>
                        </div>
                     </div>
                  ) : (
                     ofertas.map((oferta) => {
                        // ✅ Construir URL de imagen inteligente
                        const imageUrl = buildImageUrl(oferta.ofertas_imagen, 'oferta');
                        const isExternalImage = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
                        
                        return (
                           <div key={oferta.ofertas_id} className="col-lg-4 col-md-6 col-sm-12">
                              <article 
                                 style={offerStyles.card}
                                 onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, offerStyles.cardHover)}
                                 onMouseLeave={(e: any) => {
                                    Object.assign(e.currentTarget.style, {
                                       transform: 'translateY(0)',
                                       boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                       borderColor: 'rgba(250,178,101,0.2)',
                                       background: 'rgba(255,255,255,0.08)'
                                    });
                                 }}
                              >
                                 <div style={offerStyles.imageWrapper}>
                                    {/* ✅ REEMPLAZADO: <img> → <Image /> de Next.js */}
                                    <Image
                                       src={imageUrl}
                                       alt={oferta.ofertas_titulo}
                                       width={500}
                                       height={300}
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
                                          target.src = '/images/placeholder-offer.jpg';
                                       }}
                                       loading="lazy"
                                    />
                                    <span style={offerStyles.badge}>
                                       <i className="fa fa-star"></i> Oferta
                                    </span>
                                 </div>
                                 
                                 <div style={offerStyles.content}>
                                    <h5 style={offerStyles.title}>
                                       {oferta.ofertas_titulo}
                                    </h5>
                                    
                                    {oferta.ofertas_inscripciones_ini && (
                                       <div style={offerStyles.infoBox}>
                                          <i className="fa fa-calendar" style={{ color: '#FAB265' }}></i>
                                          <strong>Inscripción Inicio:</strong> {formatDate(oferta.ofertas_inscripciones_ini)}
                                       </div>
                                    )}
                                    
                                    {oferta.ofertas_inscripciones_fin && (
                                       <div style={offerStyles.infoBox}>
                                          <i className="fa fa-calendar-check-o" style={{ color: '#28a745' }}></i>
                                          <strong>Inscripción Fin:</strong> {formatDate(oferta.ofertas_inscripciones_fin)}
                                       </div>
                                    )}
                                    
                                    {oferta.ofertas_fecha_examen && (
                                       <div style={offerStyles.infoBox}>
                                          <i className="fa fa-file-text-o" style={{ color: '#17a2b8' }}></i>
                                          <strong>Examen:</strong> {formatDate(oferta.ofertas_fecha_examen)}
                                       </div>
                                    )}
                                    
                                    <Link 
                                       href={`/offers/${oferta.ofertas_id}`}
                                       style={offerStyles.button}
                                       onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, offerStyles.buttonHover)}
                                       onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, offerStyles.button)}
                                    >
                                       Ver más detalles <i className="fa fa-arrow-right"></i>
                                    </Link>
                                    
                                 </div>
                              </article>
                           </div>
                        );
                     })
                  )}
               </div>
            </div>
            
            {/* =============================================
               CSS Global - RESPONSIVE DESIGN
               ============================================= */}
            <style jsx global>{`
               @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
               }
               
               .offer-area article {
                  will-change: transform, box-shadow, background;
               }
               
               /* =============================================
                  RESPONSIVE DESIGN - MEDIA QUERIES
                  ============================================= */
               
               /* Tablet */
               @media (max-width: 991px) {
                  .offer-area {
                     padding: 60px 0 !important;
                  }
                  
                  .offer-area .card {
                     padding: 35px 25px !important;
                  }
               }
               
               /* Móvil */
               @media (max-width: 767px) {
                  .offer-area {
                     padding: 50px 0 !important;
                  }
                  
                  .offer-area .card {
                     padding: 30px 20px !important;
                     margin-bottom: 20px;
                  }
                  
                  .offer-area .imageWrapper {
                     height: 200px !important;
                  }
                  
                  .offer-area h5 {
                     font-size: 1.1rem !important;
                  }
                  
                  .offer-area .infoBox {
                     font-size: 0.8rem !important;
                     padding: 8px !important;
                  }
                  
                  .offer-area .button {
                     width: 100%;
                     justify-content: center;
                     padding: 10px 20px !important;
                     font-size: 0.85rem !important;
                  }
                  
                  .offer-area .badge {
                     padding: 4px 10px !important;
                     font-size: 0.7rem !important;
                  }
               }
               
               /* Móvil pequeño */
               @media (max-width: 576px) {
                  .offer-area {
                     padding: 40px 0 !important;
                  }
                  
                  .offer-area .card {
                     padding: 25px 15px !important;
                  }
                  
                  .offer-area .imageWrapper {
                     height: 180px !important;
                  }
                  
                  .offer-area h5 {
                     font-size: 1rem !important;
                     margin-bottom: 12px !important;
                  }
                  
                  .offer-area .infoBox {
                     font-size: 0.75rem !important;
                     padding: 6px !important;
                     margin-bottom: 8px !important;
                  }
                  
                  .offer-area .button {
                     padding: 8px 16px !important;
                     font-size: 0.8rem !important;
                  }
                  
                  .offer-area .badge {
                     top: 10px !important;
                     right: 10px !important;
                     padding: 3px 8px !important;
                     font-size: 0.65rem !important;
                  }
               }
            `}</style>
         </section>
         <FooterOne />
      </>
   );
};

export default OfferArea;