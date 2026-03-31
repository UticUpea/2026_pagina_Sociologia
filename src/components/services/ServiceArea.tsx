"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CSSProperties } from 'react';

// ✅ IMPORTAR HEADER Y FOOTER
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

// =============================================
// INTERFACES
// =============================================
interface ServicioCarrera {
   serv_id: number;
   serv_imagen: string;
   serv_nombre: string;
   serv_descripcion: string;
   serv_nro_celular: number;
   serv_active: string;
}

interface PortadaData {
   portada_id: number;
   portada_imagen: string;
   portada_titulo: string;
   portada_subtitulo: string;
}

// =============================================
// CONSTANTES
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35";
const PORTADA_IDS_RANDOM = [238, 239, 240];

// =============================================
// UTILIDADES
// =============================================
const buildImageUrl = (fileName: string | null | undefined): string => {
   if (!fileName) return '/images/placeholder-service.jpg';
   const cleanName = fileName.trim();
   if (cleanName.startsWith('http')) return cleanName;
   if (cleanName.startsWith('/storage/')) return `${API_BASE_URL}${cleanName}`;
   return `${API_BASE_URL}${cleanName}`;
};

const buildPortadaUrl = (imagenPath: string | null | undefined): string => {
   if (!imagenPath) return '/assets/img/sociologia3.jpg';
   const cleanPath = imagenPath.trim();
   if (cleanPath.startsWith('http')) return cleanPath;
   if (cleanPath.startsWith('/storage/')) return `${API_BASE_URL}${cleanPath}`;
   return `${API_BASE_URL}/storage/imagenes/portadas/${cleanPath}`;
};

const getRandomPortada = (portadas: PortadaData[]): PortadaData | null => {
   const portadasFiltradas = portadas.filter(p => 
      PORTADA_IDS_RANDOM.includes(p.portada_id)
   );
   
   if (portadasFiltradas.length === 0) return null;
   
   const randomIndex = Math.floor(Math.random() * portadasFiltradas.length);
   return portadasFiltradas[randomIndex];
};

// =============================================
// COMPONENTE - BANNER HERO
// =============================================
const HeroBanner: React.FC = () => {
   const [portadaUrl, setPortadaUrl] = useState<string>('/assets/img/sociologia3.jpg');

   useEffect(() => {
      const fetchPortada = async () => {
         try {
            const response = await fetch(
               `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/contenido`,
               {
                  method: 'GET',
                  headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${API_TOKEN}`
                  },
                  cache: 'no-store'
               }
            );
            
            if (response.ok) {
               const result = await response.json();
               const portadaArray = result?.portada || [];
               
               const portadaRandom = getRandomPortada(portadaArray);
               
               if (portadaRandom) {
                  const fullUrl = buildPortadaUrl(portadaRandom.portada_imagen);
                  setPortadaUrl(fullUrl);
               } else {
                  setPortadaUrl('/assets/img/sociologia3.jpg');
               }
            } else {
               setPortadaUrl('/assets/img/sociologia3.jpg');
            }
         } catch (error) {
            console.error('❌ [ServiceArea] Error cargando portada:', error);
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
            // ✅ CORREGIDO: backgroundImage en lugar de background
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
               SERVICIOS DE CARRERA
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
                     <span style={{ color: '#FAB265', fontWeight: 600 }}>
                        <i className="fa fa-angle-right me-1"></i> Servicios de Carrera
                     </span>
                  </li>
               </ol>
            </nav>
         </div>
         
         <style jsx global>{`
            @keyframes fadeInDown {
               from {
                  opacity: 0;
                  transform: translateY(-30px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
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
         `}</style>
      </div>
   );
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const ServiceArea: React.FC = () => {
   const [servicios, setServicios] = useState<ServicioCarrera[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchServicios = async () => {
         try {
            setLoading(true);
            setError(null);
            
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/gacetaEventos`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${API_TOKEN}`
            };
            
            const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
            
            if (response.ok) {
               const data = await response.json();
               const serviciosData = (data.serviciosCarrera || []).filter((s: ServicioCarrera) => s.serv_active === "1");
               
               console.log('✅ [Servicios] Datos cargados:', {
                  total: serviciosData.length,
                  fuente: `Sociología (ID ${INSTITUCION_ID})`
               });
               
               setServicios(serviciosData);
            } else {
               setError(`Error ${response.status} al cargar servicios`);
            }
            
            setLoading(false);
         } catch (error) {
            console.error('❌ Error crítico cargando servicios:', error);
            setError('Error de conexión');
            setLoading(false);
         }
      };

      fetchServicios();
   }, []);

   const serviceStyles = {
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
         flexDirection: 'column' as const,
         alignItems: 'center' as const,
         textAlign: 'center' as const,
         padding: '40px 28px'
      } as CSSProperties,
      cardHover: {
         transform: 'translateY(-12px)',
         boxShadow: '0 20px 48px rgba(250,178,101,0.25)',
         borderColor: 'rgba(250,178,101,0.5)',
         background: 'rgba(255,255,255,0.12)'
      } as CSSProperties,
      iconBox: {
         width: '90px',
         height: '90px',
         background: 'linear-gradient(135deg, #FAB265, #FFD700)',
         borderRadius: '50%',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         marginBottom: '1.5rem',
         boxShadow: '0 8px 24px rgba(250,178,101,0.4)'
      } as CSSProperties,
      title: {
         color: '#FFFFFF',
         fontSize: '1.25rem',
         fontWeight: 700,
         marginBottom: '16px',
         lineHeight: 1.4,
         textShadow: '0 2px 8px rgba(0,0,0,0.4)'
      } as CSSProperties,
      description: {
         color: 'rgba(255,255,255,0.85)',
         fontSize: '0.95rem',
         lineHeight: 1.6,
         marginBottom: '20px'
      } as CSSProperties,
      contactInfo: {
         fontSize: '0.9rem',
         color: 'rgba(255,255,255,0.9)',
         padding: '12px',
         background: 'rgba(250,178,101,0.1)',
         borderRadius: '8px',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         marginTop: 'auto'
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
      } as CSSProperties
   };

   if (loading) {
      return (
         <>
            <HeaderOne />
            <HeroBanner />
            <section className="service-area pd-top-120 pd-bottom-90" style={serviceStyles.section}>
               <div style={serviceStyles.decorativeBg} />
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
                     Cargando Servicios
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                     Obteniendo servicios de la carrera...
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
            <section className="service-area pd-top-120 pd-bottom-90" style={serviceStyles.section}>
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <div style={serviceStyles.error}>
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
         
         <section className="service-area pd-top-120 pd-bottom-90" style={serviceStyles.section}>
            <div style={serviceStyles.decorativeBg} />
            
            <div className="container" style={serviceStyles.contentWrapper}>
               <div className="row g-4 justify-content-center">
                  {servicios.map((servicio) => (
                     <div key={servicio.serv_id} className="col-lg-4 col-md-6">
                        <article 
                           style={serviceStyles.card}
                           onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, serviceStyles.cardHover)}
                           onMouseLeave={(e: any) => {
                              Object.assign(e.currentTarget.style, {
                                 transform: 'translateY(0)',
                                 boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                 borderColor: 'rgba(250,178,101,0.2)',
                                 background: 'rgba(255,255,255,0.08)'
                              });
                           }}
                        >
                           <div style={serviceStyles.iconBox}>
                              <i className="fa fa-handshake-o fa-3x" style={{ color: '#050504' }}></i>
                           </div>
                           
                           <h5 style={serviceStyles.title}>
                              {servicio.serv_nombre}
                           </h5>
                           
                           {servicio.serv_descripcion && (
                              <p style={serviceStyles.description}>
                                 {servicio.serv_descripcion}
                              </p>
                           )}
                           
                           {servicio.serv_nro_celular && (
                              <div style={serviceStyles.contactInfo}>
                                 <i className="fa fa-phone" style={{ color: '#FAB265' }}></i>
                                 <strong>Contacto:</strong> {servicio.serv_nro_celular}
                              </div>
                           )}
                        </article>
                     </div>
                  ))}
               </div>
            </div>
            
            <style jsx global>{`
               @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
               }
               
               .service-area article {
                  will-change: transform, box-shadow, background;
               }
               
               @media (max-width: 991px) {
                  .service-area {
                     padding: 60px 0 !important;
                  }
               }
               
               @media (max-width: 767px) {
                  .service-area {
                     padding: 50px 0 !important;
                  }
               }
            `}</style>
         </section>
         <FooterOne />
      </>
   );
};

export default ServiceArea;