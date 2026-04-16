"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// ✅ Logos locales (assets estáticos - NO vienen del API)
import footerLogo from "@/assets/img/logo-sociologia.png";
import footerLog from "@/assets/img/logo-utic-foother.png";

// =============================================
// INTERFACES
// =============================================
interface InstitucionData {
   institucion_id: number;
   institucion_nombre: string;
   institucion_celular1: number | string;
   institucion_celular2: number | string;
   institucion_telefono1: number | string;
   institucion_telefono2: number | string;
   institucion_correo1: string;
   institucion_correo2: string;
   institucion_facebook: string;
   institucion_youtube: string;
   institucion_twitter: string;
   institucion_direccion: string;
   institucion_api_google_map: string;
   id?: number;
   nombre?: string;
   celular?: string;
   telefono?: string;
   correo?: string;
   facebook?: string;
   twitter?: string;
   youtube?: string;
   direccion?: string;
   google_map?: string;
}

interface AutoridadItem {
   id_autoridad: number;
   foto_autoridad: string;
   nombre_autoridad: string;
   cargo_autoridad: string;
   facebook_autoridad?: string;
   celular_autoridad?: string;
   twiter_autoridad?: string;
}

interface InstitucionResponse {
   Descripcion?: InstitucionData;
   autoridad?: AutoridadItem[];
   [key: string]: any;
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;
const MAX_INT32 = 2147483647;

// =============================================
// UTILIDADES - Manejo Inteligente de Imágenes y URLs
// =============================================

/**
 * Construye URL completa para imágenes
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta según tipo
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'autoridad' | 'logo' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' = 'autoridad'
): string => {
  if (!imagePath) return '/images/placeholder-autoridad.png';
  
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
    autoridad: '/storage/imagenes/autoridades/',
    logo: '/storage/imagenes/logos/',
    portada: '/storage/imagenes/portadas/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

const cleanUrl = (url: string | null | undefined): string => {
   if (!url) return "#";
   return url.toString().trim();
};

const formatPhone = (phone: number | string | null | undefined): string | null => {
   if (phone === null || phone === undefined || phone === "" || phone === MAX_INT32) return null;
   const clean = phone.toString().trim();
   const digits = clean.replace(/\D/g, "");
   if (digits.length < 8) return null;
   return clean;
};

const isValidEmail = (email: string): boolean => {
   if (!email) return false;
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email.trim());
};

const buildWhatsAppLink = (phone: string): string => {
   const clean = phone.replace(/\D/g, "");
   if (clean.startsWith("591")) {
      return `https://wa.me/${clean}`;
   }
   if (clean.length === 8) {
      return `https://wa.me/591${clean}`;
   }
   return `https://wa.me/591${clean}`;
};

// =============================================
// SERVICIO: Obtener datos del footer - CON VARIABLES DE ENTORNO
// =============================================
const getInstitucionFooterData = async (institucionId: string) => {
   try {
      // ✅ URL con variables de entorno - SIN PROXY
      const url = `${API_BASE_URL}/api/v2/institucion/${institucionId}/contenido`;
      
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
      
      const data = await response.json();
      
      console.log('[Service] Respuesta footer:', {
         status: response.status,
         ok: response.ok,
         hasAutoridad: !!data?.autoridad,
         data: data ? Object.keys(data) : null
      });
      
      return { data, status: response.status, ok: response.ok };
      
   } catch (error) {
      console.error('[Service] Error fetching footer data:', error);
      throw error;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const FooterOne: React.FC = () => {
   
   const [institucion, setInstitucion] = useState<InstitucionData | null>(null);
   const [autoridadPrincipal, setAutoridadPrincipal] = useState<AutoridadItem | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGA DE DATOS - API CON VARIABLES DE ENTORNO
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchFooterData = async () => {
         try {
            console.log('🔄 [Footer] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            const response = await getInstitucionFooterData(INSTITUCION_ID);
            
            console.log('📡 [Footer] Respuesta completa:', response);
            
            if (response.status === 404 || response.data?.statusCode === 404) {
               console.log('ℹ️ [Footer] Sin datos disponibles (404)');
               if (isMounted) {
                  setInstitucion(null);
                  setAutoridadPrincipal(null);
               }
               return;
            }
            
            let datos: InstitucionData | null = null;
            
            // ✅ Cargar autoridad principal si existe
            if (response.data?.autoridad && Array.isArray(response.data.autoridad) && response.data.autoridad.length > 0) {
               const primeraAutoridad = response.data.autoridad[0];
               setAutoridadPrincipal({
                  id_autoridad: primeraAutoridad.id_autoridad ?? 0,
                  foto_autoridad: primeraAutoridad.foto_autoridad ?? "",
                  nombre_autoridad: primeraAutoridad.nombre_autoridad ?? "Sin nombre",
                  cargo_autoridad: primeraAutoridad.cargo_autoridad ?? "Sin cargo",
                  facebook_autoridad: primeraAutoridad.facebook_autoridad ?? primeraAutoridad.twiter_autoridad ?? "",
                  celular_autoridad: primeraAutoridad.celular_autoridad ?? ""
               });
               console.log('✅ [Footer] Autoridad principal cargada:', primeraAutoridad.nombre_autoridad);
            }
            
            // ✅ Extraer datos de institución
            if (response.data?.Descripcion && typeof response.data.Descripcion === 'object') {
               datos = response.data.Descripcion as InstitucionData;
            } 
            else if (response.data?.ubicacion && Array.isArray(response.data.ubicacion) && response.data.ubicacion.length > 0) {
               const ubicacion = response.data.ubicacion[0];
               datos = {
                  institucion_id: INSTITUCION_ID as unknown as number,
                  institucion_nombre: "SOCIOLOGÍA",
                  institucion_celular1: "",
                  institucion_celular2: "",
                  institucion_telefono1: "",
                  institucion_telefono2: "",
                  institucion_correo1: "sociologia@upea.bo",
                  institucion_correo2: "",
                  institucion_facebook: "",
                  institucion_youtube: "",
                  institucion_twitter: "",
                  institucion_direccion: ubicacion.ubicacion_descripcion || "Zona Villa Esperanza, Campus UPEA",
                  institucion_api_google_map: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.678553338397!2d-68.19589318451965!3d-16.491806444888784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915ede3378ea9d6d%3A0x26cac4a2caefcb29!2sUniversidad%20P%C3%BAblica%20de%20El%20Alto!5e0!3m2!1ses!2sbo!4v1621349240107!5m2!1ses!2sbo`
               } as InstitucionData;
            }
            else if (response.data?.institucion_id) {
               datos = response.data as InstitucionData;
            }
            
            if (isMounted) {
               if (datos) {
                  setInstitucion(datos);
                  console.log('✅ [Footer] Datos de contacto cargados');
               } else {
                  console.warn('⚠️ [Footer] No se encontraron datos válidos');
                  setInstitucion(null);
               }
            }
            
         } catch (err: any) {
            console.error("❌ [Footer] Error cargando institución:", err?.message);
            if (isMounted) {
               setInstitucion(null);
               setAutoridadPrincipal(null);
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchFooterData();
      
      return () => { isMounted = false; };
      
   }, []);

   // =============================================
   // PREPARAR DATOS DE CONTACTO
   // =============================================
   const contactData = useMemo(() => {
      if (!institucion) {
         return {
            direccion: "Av. Sucre Z. Villa Esperanza, Campus UPEA Bloque D 2",
            emails: ["sociologia@upea.bo"],
            phones: [],
            social: {
               facebook: "https://www.facebook.com/Ingenieriadesistemasupeafuturo/",
               twitter: "#",
               youtube: "#"
            }
         };
      }
      
      const phones = [
         formatPhone(institucion.institucion_celular1),
         formatPhone(institucion.institucion_celular2),
         formatPhone(institucion.institucion_telefono1),
         formatPhone(institucion.institucion_telefono2)
      ].filter((p): p is string => p !== null);
      
      const emails = [
         institucion.institucion_correo1,
         institucion.institucion_correo2
      ].filter(email => email && isValidEmail(email)).map(e => e!.trim());
      
      const facebook = cleanUrl(institucion.institucion_facebook);
      const twitter = cleanUrl(institucion.institucion_twitter);
      const youtube = cleanUrl(institucion.institucion_youtube);
      
      const direccion = institucion.institucion_direccion?.trim() || "Zona Villa Esperanza, Campus UPEA";
      
      return {
         direccion,
         emails: emails.length > 0 ? emails : ["sociologia@upea.bo"],
         phones,
         social: { facebook, twitter, youtube }
      };
      
   }, [institucion]);

   // =============================================
   // ESTILOS VISUALES
   // =============================================
   const footerStyles = {
      container: {
         background: 'linear-gradient(180deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         color: '#FFFFFF'
      },
      widgetTitle: {
         color: '#FAB265',
         fontWeight: 700,
         fontSize: '1.25rem',
         marginBottom: '1.5rem',
         position: 'relative' as const,
         paddingBottom: '12px',
         borderBottom: '3px solid #FAB265'
      },
      widgetTitleAfter: {
         content: '""',
         position: 'absolute' as const,
         bottom: '-3px',
         left: 0,
         width: '60px',
         height: '3px',
         background: '#FAB265'
      },
      contactItem: {
         display: 'flex',
         alignItems: 'flex-start',
         gap: '12px',
         marginBottom: '1rem',
         padding: '8px 0',
         borderBottom: '1px solid rgba(255,255,255,0.1)'
      },
      contactIcon: {
         color: '#FAB265',
         fontSize: '1.1rem',
         marginTop: '4px',
         minWidth: '20px'
      },
      contactText: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '0.95rem',
         lineHeight: 1.5
      },
      contactLink: {
         color: 'rgba(255,255,255,0.9)',
         textDecoration: 'none',
         transition: 'all 0.3s ease',
         fontWeight: 500
      },
      contactLinkHover: {
         color: '#FAB265',
         paddingLeft: '4px'
      },
      quickLink: {
         color: 'rgba(255,255,255,0.85)',
         textDecoration: 'none',
         transition: 'all 0.3s ease',
         display: 'flex',
         alignItems: 'center',
         gap: '8px',
         padding: '6px 0',
         fontSize: '0.95rem'
      },
      quickLinkHover: {
         color: '#FAB265',
         transform: 'translateX(4px)'
      },
      socialButton: {
         width: '44px',
         height: '44px',
         borderRadius: '50%',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         fontSize: '1.2rem',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      },
      whatsappButton: {
         background: 'linear-gradient(135deg, #25D366, #128C7E)',
         color: '#FFFFFF',
         border: 'none',
         borderRadius: '10px',
         padding: '8px 20px',
         fontWeight: 600,
         fontSize: '0.9rem',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '8px',
         transition: 'all 0.3s ease',
         boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)'
      },
      autoridadCard: {
         background: 'rgba(255,255,255,0.1)',
         borderRadius: '12px',
         padding: '16px',
         marginBottom: '1.5rem',
         backdropFilter: 'blur(10px)',
         border: '1px solid rgba(250,178,101,0.3)'
      },
      autoridadImage: {
         borderRadius: '50%',
         border: '3px solid #FAB265',
         objectFit: 'cover' as const,
         boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      },
      autoridadName: {
         color: '#FFFFFF',
         fontWeight: 700,
         fontSize: '1rem',
         marginBottom: '2px'
      },
      autoridadCargo: {
         color: '#FAB265',
         fontSize: '0.85rem',
         fontWeight: 500
      },
      autoridadButtons: {
         display: 'flex',
         gap: '8px',
         marginTop: '12px'
      },
      autoridadBtnSmall: {
         fontSize: '0.75rem',
         padding: '4px 12px',
         borderRadius: '8px',
         fontWeight: 600,
         transition: 'all 0.2s ease',
         border: 'none'
      },
      footerBottom: {
         background: 'rgba(5,5,4,0.95)',
         borderTop: '2px solid #FAB265',
         padding: '20px 0'
      },
      copyright: {
         color: 'rgba(255,255,255,0.7)',
         fontSize: '0.9rem',
         marginBottom: 0
      },
      logoImage: {
         filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
         transition: 'transform 0.3s ease'
      }
   };

   // =============================================
   // RENDERIZADO
   // =============================================
   return (
      <footer className="footer-area" style={footerStyles.container}>
         
         <div className="footer-top py-5">
            <div className="container">
               <div className="row g-4">
                  
                  {/* Widget de contacto */}
                  <div className="col-lg-4 col-md-6">
                     <div className="widget widget_contact">
                        <h4 className="widget-title" style={footerStyles.widgetTitle}>
                           Contáctos
                        </h4>
                        <ul className="details list-unstyled">
                           
                           {/* Dirección */}
                           <li style={footerStyles.contactItem}>
                              <i className="fa fa-map-marker" style={footerStyles.contactIcon}></i>
                              <span style={footerStyles.contactText}>{contactData.direccion}</span>
                           </li>
                           
                           {/* Emails */}
                           {contactData.emails.map((email, idx) => (
                              <li key={`email-${idx}`} style={{...footerStyles.contactItem, borderBottom: 'none'}}>
                                 <i className="fa fa-envelope" style={footerStyles.contactIcon}></i>
                                 <a 
                                    href={`mailto:${email}`}
                                    style={footerStyles.contactLink}
                                    onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, footerStyles.contactLinkHover)}
                                    onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, footerStyles.contactLink)}
                                 >
                                    {email}
                                 </a>
                              </li>
                           ))}
                           
                           {/* Teléfonos */}
                           {contactData.phones.map((phone, idx) => (
                              <li key={`phone-${idx}`} style={{...footerStyles.contactItem, borderBottom: 'none'}}>
                                 <i className="fa fa-phone" style={footerStyles.contactIcon}></i>
                                 <a 
                                    href={`tel:${phone}`}
                                    style={footerStyles.contactLink}
                                    onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, footerStyles.contactLinkHover)}
                                    onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, footerStyles.contactLink)}
                                 >
                                    {phone}
                                 </a>
                              </li>
                           ))}
                           
                           {/* WhatsApp */}
                           {contactData.phones.length > 0 && (
                              <li className="mt-4">
                                 <a 
                                    href={buildWhatsAppLink(contactData.phones[0])}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={footerStyles.whatsappButton}
                                    onMouseEnter={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(-3px)';
                                       e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.6)';
                                    }}
                                    onMouseLeave={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(0)';
                                       e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
                                    }}
                                 >
                                    <i className="fa fa-whatsapp"></i>
                                    WhatsApp
                                 </a>
                              </li>
                           )}
                           
                        </ul>
                     </div>
                  </div>
                  
                  {/* Widget de enlaces rápidos */}
                  <div className="col-lg-4 col-md-6">
                     <div className="widget widget_nav_menu">
                        <h4 className="widget-title" style={footerStyles.widgetTitle}>
                           Enlaces Rápidos
                        </h4>
                        <ul className="list-unstyled">
                           <li>
                              <Link 
                                 href="/about" 
                                 style={footerStyles.quickLink}
                                 onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLinkHover)}
                                 onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLink)}
                              >
                                 <i className="fa fa-chevron-right" style={{fontSize: '0.7rem', color: '#FAB265'}}></i>
                                 Sobre la Carrera
                              </Link>
                           </li>
                           <li>
                              <Link 
                                 href="/blog" 
                                 style={footerStyles.quickLink}
                                 onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLinkHover)}
                                 onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLink)}
                              >
                                 <i className="fa fa-chevron-right" style={{fontSize: '0.7rem', color: '#FAB265'}}></i>
                                 Convocatorias
                              </Link>
                           </li>
                           <li>
                              <Link 
                                 href="/course" 
                                 style={footerStyles.quickLink}
                                 onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLinkHover)}
                                 onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLink)}
                              >
                                 <i className="fa fa-chevron-right" style={{fontSize: '0.7rem', color: '#FAB265'}}></i>
                                 Gaceta Universitaria
                              </Link>
                           </li>
                           <li>
                              <Link 
                                 href="/contact" 
                                 style={footerStyles.quickLink}
                                 onMouseEnter={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLinkHover)}
                                 onMouseLeave={(e: any) => Object.assign(e.currentTarget.style, footerStyles.quickLink)}
                              >
                                 <i className="fa fa-chevron-right" style={{fontSize: '0.7rem', color: '#FAB265'}}></i>
                                 Contáctanos
                              </Link>
                           </li>
                        </ul>
                     </div>
                  </div>
                  
                  {/* Widget de redes sociales + Autoridad Principal */}
                  <div className="col-lg-4 col-md-6">
                     <div className="widget widget_contact">
                        <h4 className="widget-title" style={footerStyles.widgetTitle}>
                           Síguenos
                        </h4>
                        <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1.5rem'}}>
                           Mantente conectado con las últimas noticias y actividades de Sociología UPEA.
                        </p>
                        
                        {/* Autoridad principal */}
                        {autoridadPrincipal && (
                           <div style={footerStyles.autoridadCard}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                                 {autoridadPrincipal.foto_autoridad && (
                                    <Image
                                       // ✅ Construir URL de imagen inteligente
                                       src={buildImageUrl(autoridadPrincipal.foto_autoridad, 'autoridad')}
                                       alt={autoridadPrincipal.nombre_autoridad}
                                       width={56}
                                       height={56}
                                       style={footerStyles.autoridadImage}
                                       // ✅ No optimizar si es URL externa (MinIO)
                                       unoptimized={autoridadPrincipal.foto_autoridad.startsWith('http')}
                                       onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/images/placeholder-autoridad.png';
                                       }}
                                       loading="lazy"
                                    />
                                 )}
                                 <div>
                                    <h6 style={footerStyles.autoridadName}>
                                       {autoridadPrincipal.nombre_autoridad}
                                    </h6>
                                    <small style={footerStyles.autoridadCargo}>
                                       {autoridadPrincipal.cargo_autoridad}
                                    </small>
                                 </div>
                              </div>
                              <div style={footerStyles.autoridadButtons}>
                                 {autoridadPrincipal.facebook_autoridad && autoridadPrincipal.facebook_autoridad.startsWith('http') && (
                                    <a 
                                       href={cleanUrl(autoridadPrincipal.facebook_autoridad)}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       style={{
                                          ...footerStyles.autoridadBtnSmall,
                                          background: '#1877F2',
                                          color: '#fff'
                                       }}
                                       onMouseEnter={(e: any) => {
                                          e.currentTarget.style.transform = 'translateY(-2px)';
                                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 119, 242, 0.5)';
                                       }}
                                       onMouseLeave={(e: any) => {
                                          e.currentTarget.style.transform = 'translateY(0)';
                                          e.currentTarget.style.boxShadow = 'none';
                                       }}
                                    >
                                       <i className="fa fa-facebook"></i>
                                    </a>
                                 )}
                                 {formatPhone(autoridadPrincipal.celular_autoridad) && (
                                    <a 
                                       href={`https://wa.me/591${formatPhone(autoridadPrincipal.celular_autoridad)?.replace(/\D/g, '')}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       style={{
                                          ...footerStyles.autoridadBtnSmall,
                                          background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                          color: '#fff'
                                       }}
                                       onMouseEnter={(e: any) => {
                                          e.currentTarget.style.transform = 'translateY(-2px)';
                                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.5)';
                                       }}
                                       onMouseLeave={(e: any) => {
                                          e.currentTarget.style.transform = 'translateY(0)';
                                          e.currentTarget.style.boxShadow = 'none';
                                       }}
                                    >
                                       <i className="fa fa-whatsapp"></i>
                                    </a>
                                 )}
                              </div>
                           </div>
                        )}
                        
                        {/* Redes sociales */}
                        <ul className="social-media list-unstyled d-flex gap-3">
                           
                           {contactData.social.facebook !== "#" && (
                              <li>
                                 <a 
                                    href={contactData.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                       ...footerStyles.socialButton,
                                       background: 'linear-gradient(135deg, #1877F2, #42b72a)',
                                       color: '#fff'
                                    }}
                                    onMouseEnter={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                                       e.currentTarget.style.boxShadow = '0 8px 20px rgba(24, 119, 242, 0.5)';
                                    }}
                                    onMouseLeave={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                       e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                                    }}
                                    title="Facebook"
                                 >
                                    <i className="fa fa-facebook"></i>
                                 </a>
                              </li>
                           )}
                           
                           {contactData.social.twitter !== "#" && (
                              <li>
                                 <a 
                                    href={contactData.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                       ...footerStyles.socialButton,
                                       background: 'linear-gradient(135deg, #1DA1F2, #0d8bd9)',
                                       color: '#fff'
                                    }}
                                    onMouseEnter={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                                       e.currentTarget.style.boxShadow = '0 8px 20px rgba(29, 161, 242, 0.5)';
                                    }}
                                    onMouseLeave={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                       e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                                    }}
                                    title="Twitter"
                                 >
                                    <i className="fa fa-twitter"></i>
                                 </a>
                              </li>
                           )}
                           
                           {contactData.social.youtube !== "#" && (
                              <li>
                                 <a 
                                    href={contactData.social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                       ...footerStyles.socialButton,
                                       background: 'linear-gradient(135deg, #FF0000, #cc0000)',
                                       color: '#fff'
                                    }}
                                    onMouseEnter={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                                       e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 0, 0, 0.5)';
                                    }}
                                    onMouseLeave={(e: any) => {
                                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                       e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                                    }}
                                    title="YouTube"
                                 >
                                    <i className="fa fa-youtube-play"></i>
                                 </a>
                              </li>
                           )}
                           
                        </ul>
                     </div>
                  </div>
                  
               </div>
            </div>
         </div>

         {/* Footer Bottom */}
         <div className="footer-bottom" style={footerStyles.footerBottom}>
            <div className="container">
               <div className="row align-items-center">
                  
                  {/* Logo Sociología */}
                  <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                     <Link href="/" className="d-inline-block">
                        <Image 
                           src={footerLogo} 
                           alt="Logo Sociología UPEA" 
                           width={130} 
                           height={65}
                           style={{
                              ...footerStyles.logoImage,
                              objectFit: 'contain'
                           }}
                           onMouseEnter={(e: any) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                           }}
                           onMouseLeave={(e: any) => {
                              e.currentTarget.style.transform = 'scale(1)';
                           }}
                        />
                     </Link>
                  </div>
                  
                  {/* Logo UTIC */}
                  <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                     <Link 
                        href="https://utic.upea.bo/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="d-inline-block"
                     >
                        <Image 
                           src={footerLog} 
                           alt="Logo UTIC" 
                           width={130} 
                           height={65}
                           style={{
                              ...footerStyles.logoImage,
                              objectFit: 'contain'
                           }}
                           onMouseEnter={(e: any) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                           }}
                           onMouseLeave={(e: any) => {
                              e.currentTarget.style.transform = 'scale(1)';
                           }}
                        />
                     </Link>
                  </div>
                  
                  {/* Copyright */}
                  <div className="col-lg-4 col-md-12 text-center mb-3 mb-lg-0">
                     <p style={footerStyles.copyright}>
                        copyright © {new Date().getFullYear()} by U-TIC / deV: ETC
                     </p>
                  </div>
                  
                  {/* Mapa */}
                  <div className="col-lg-2 col-md-6 text-md-end">
                     {institucion?.institucion_api_google_map && (
                        <a 
                           href={cleanUrl(institucion.institucion_api_google_map).split('?')[0]}
                           target="_blank"
                           rel="noopener noreferrer"
                           style={{
                              color: '#FAB265',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                              fontWeight: 500
                           }}
                           onMouseEnter={(e: any) => {
                              e.currentTarget.style.color = '#FFFFFF';
                              e.currentTarget.style.transform = 'translateX(4px)';
                           }}
                           onMouseLeave={(e: any) => {
                              e.currentTarget.style.color = '#FAB265';
                              e.currentTarget.style.transform = 'translateX(0)';
                           }}
                        >
                           <i className="fa fa-map-marker"></i>
                           Ver mapa
                        </a>
                     )}
                  </div>
                  
               </div>
            </div>
         </div>
         
         {/* =============================================
            CSS Global - RESPONSIVE DESIGN
            ============================================= */}
         <style jsx global>{`
            /* =============================================
               RESPONSIVE DESIGN - FOOTER
               ============================================= */
            
            /* Tablet */
            @media (max-width: 991px) {
               .footer-top {
                  padding: 40px 0 !important;
               }
               
               .footer-area .widget-title {
                  font-size: 1.1rem !important;
                  margin-bottom: 1rem !important;
               }
               
               .footer-area .contactText,
               .footer-area .quickLink {
                  font-size: 0.9rem !important;
               }
               
               .footer-area .socialButton {
                  width: 40px !important;
                  height: 40px !important;
                  font-size: 1rem !important;
               }
            }
            
            /* Móvil */
            @media (max-width: 767px) {
               .footer-top {
                  padding: 30px 0 !important;
               }
               
               .footer-area .widget {
                  margin-bottom: 30px !important;
               }
               
               .footer-area .widget-title {
                  font-size: 1rem !important;
                  margin-bottom: 1rem !important;
                  text-align: center !important;
               }
               
               .footer-area .contactItem {
                  justify-content: center !important;
                  text-align: center !important;
                  padding: 6px 0 !important;
               }
               
               .footer-area .contactText,
               .footer-area .quickLink {
                  font-size: 0.85rem !important;
               }
               
               .footer-area .quickLink {
                  justify-content: center !important;
               }
               
               .footer-area .social-media {
                  justify-content: center !important;
               }
               
               .footer-area .socialButton {
                  width: 38px !important;
                  height: 38px !important;
                  font-size: 0.9rem !important;
               }
               
               .footer-area .whatsappButton {
                  width: 100%;
                  justify-content: center;
                  padding: 10px 16px !important;
                  font-size: 0.85rem !important;
               }
               
               .footer-area .autoridadCard {
                  padding: 12px !important;
                  text-align: center !important;
               }
               
               .footer-area .autoridadCard > div {
                  flex-direction: column !important;
                  text-align: center !important;
               }
               
               .footer-area .autoridadButtons {
                  justify-content: center !important;
               }
               
               .footer-bottom {
                  padding: 15px 0 !important;
                  text-align: center !important;
               }
               
               .footer-bottom .row {
                  justify-content: center !important;
               }
               
               .footer-bottom .col-lg-3,
               .footer-bottom .col-lg-4,
               .footer-bottom .col-lg-2 {
                  text-align: center !important;
                  margin-bottom: 10px !important;
               }
               
               .footer-bottom img {
                  max-width: 100px !important;
                  height: auto !important;
               }
               
               .footer-bottom .copyright {
                  font-size: 0.8rem !important;
               }
            }
            
            /* Móvil pequeño */
            @media (max-width: 576px) {
               .footer-top {
                  padding: 25px 0 !important;
               }
               
               .footer-area .widget-title {
                  font-size: 0.95rem !important;
               }
               
               .footer-area .contactText,
               .footer-area .quickLink {
                  font-size: 0.8rem !important;
               }
               
               .footer-area .socialButton {
                  width: 34px !important;
                  height: 34px !important;
                  font-size: 0.85rem !important;
               }
               
               .footer-area .whatsappButton {
                  padding: 8px 14px !important;
                  font-size: 0.8rem !important;
               }
               
               .footer-area .autoridadName {
                  font-size: 0.9rem !important;
               }
               
               .footer-area .autoridadCargo {
                  font-size: 0.8rem !important;
               }
               
               .footer-bottom {
                  padding: 12px 0 !important;
               }
               
               .footer-bottom img {
                  max-width: 90px !important;
               }
               
               .footer-bottom .copyright {
                  font-size: 0.75rem !important;
               }
            }
         `}</style>
      </footer>
   );
};

export default FooterOne;