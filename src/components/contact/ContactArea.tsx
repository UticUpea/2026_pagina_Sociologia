"use client";
import { useEffect, useState, useMemo } from "react";
import Image, { StaticImageData } from "next/image";

import icon_1 from "@/assets/img/icon/17.png";
import icon_2 from "@/assets/img/icon/18.png";
import icon_3 from "@/assets/img/icon/16.png";

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
}

interface ContactItem {
   id: number;
   icon: StaticImageData;
   title: string;
   items: {
      label: string;
      value: string;
      icon: string;
      href?: string;
      isLink?: boolean;
   }[];
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;
const MAX_INT32 = 2147483647;

// =============================================
// UTILIDADES - Manejo Inteligente de URLs
// =============================================

/**
 * Construye URL completa para imágenes/recursos
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta según tipo
 */
const buildResourceUrl = (
  resourcePath: string | null | undefined,
  type: 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' | 'contacto' = 'contacto'
): string => {
  if (!resourcePath) return '/images/placeholder.jpg';
  
  const cleanPath = resourcePath.trim();
  
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
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/',
    contacto: '/storage/imagenes/contactos/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

const cleanUrl = (url: string | null | undefined): string => {
   if (!url) return "#";
   return url.toString().trim();
};

const formatPhone = (phone: number | string | null | undefined): string | null => {
   if (phone === null || phone === undefined || phone === "") return null;
   if (typeof phone === "number" && (phone === MAX_INT32 || phone <= 0)) return null;
   return phone.toString().trim();
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
// SERVICIO: ✅ CON VARIABLES DE ENTORNO
// =============================================
const getInstitucionPrincipal = async (institucionId: string) => {
   try {
      // ✅ ENDPOINT CON VARIABLES DE ENTORNO
      const url = `${API_BASE_URL}/api/v2/institucionesPrincipal/${institucionId}`;
      
      console.log('[ContactArea] Fetching desde:', url);
      
      const headers: HeadersInit = {
         'Content-Type': 'application/json',
      };
      
      if (API_TOKEN) {
         headers['Authorization'] = `Bearer ${API_TOKEN}`;
      }
      
      const response = await fetch(url, {
         method: 'GET',
         headers: headers,
         cache: 'no-store'
      });
      
      const data = await response.json();
      
      console.log('[ContactArea] Respuesta:', {
         status: response.status,
         ok: response.ok,
         tieneDireccion: !!data?.Descripcion?.institucion_direccion,
         tieneTelefonos: !!data?.Descripcion?.institucion_celular1
      });
      
      return {
         data,
         status: response.status,
         ok: response.ok
      };
      
   } catch (error) {
      console.error('[ContactArea] Error:', error);
      throw error;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const ContactArea: React.FC = () => {
   
   const [institucion, setInstitucion] = useState<InstitucionData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   // =============================================
   // CARGA DE DATOS - API CON VARIABLES DE ENTORNO
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchInstitucion = async () => {
         try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 [ContactArea] API: ${API_BASE_URL}`);
            console.log(`📋 Institución ID: ${INSTITUCION_ID}`);
            
            const response = await getInstitucionPrincipal(INSTITUCION_ID);
            
            // =============================================
            // CASO 1: Error 404
            // =============================================
            if (response.status === 404 || response.data?.statusCode === 404) {
               console.log('ℹ️ [ContactArea] Sin datos de contacto disponibles (404)');
               if (isMounted) {
                  setInstitucion(null);
               }
               return;
            }
            
            // =============================================
            // CASO 2: Extraer datos de Descripcion
            // =============================================
            let datos: InstitucionData | null = null;
            
            if (response.data?.Descripcion && typeof response.data.Descripcion === 'object') {
               datos = response.data.Descripcion as InstitucionData;
               console.log('✅ [ContactArea] Datos extraídos de Descripcion');
            } 
            else if (response.data?.institucion_id) {
               datos = response.data as InstitucionData;
               console.log('✅ [ContactArea] Datos extraídos de raíz');
            }
            
            if (isMounted) {
               if (datos) {
                  setInstitucion(datos);
                  console.log('✅ [ContactArea] Datos de contacto cargados:', {
                     direccion: datos.institucion_direccion,
                     email: datos.institucion_correo1,
                     facebook: datos.institucion_facebook
                  });
               } else {
                  console.warn('⚠️ [ContactArea] No se encontraron datos válidos');
                  setInstitucion(null);
               }
            }
            
         } catch (err: any) {
            console.error("❌ [ContactArea] Error cargando institución:", err);
            
            if (isMounted) {
               if (err?.status === 404) {
                  setInstitucion(null);
               } else {
                  setError(err?.message || "Error al conectar con el servidor");
                  setInstitucion(null);
               }
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchInstitucion();
      
      return () => { isMounted = false; };
      
   }, []);

   // =============================================
   // PREPARAR DATOS DE CONTACTO
   // =============================================
   const contactData = useMemo(() => {
      if (!institucion) return null;
      
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
      
      const direccion = institucion.institucion_direccion?.trim() || "Sin dirección registrada";
      
      return {
         direccion,
         phones,
         emails,
         social: { facebook, twitter, youtube }
      };
      
   }, [institucion]);

   // =============================================
   // PREPARAR ITEMS
   // =============================================
   const contactItems = useMemo((): ContactItem[] => {
      if (!contactData) return [];
      
      const items: ContactItem[] = [];
      
      // Item 1: Ubicación
      items.push({
         id: 1,
         icon: icon_3,
         title: "📍 Ubicación",
         items: [
            {
               label: "Dirección",
               value: contactData.direccion,
               icon: "fa-map-marker",
               href: contactData.direccion !== "Sin dirección registrada" 
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactData.direccion)}`
                  : undefined,
               isLink: true
            }
         ]
      });
      
      // Item 2: Contactos
      if (contactData.phones.length > 0 || contactData.emails.length > 0) {
         const contactEntries: ContactItem['items'] = [];
         
         contactData.phones.forEach((phone, idx) => {
            contactEntries.push({
               label: idx === 0 ? "Celular principal" : `Celular ${idx + 1}`,
               value: phone,
               icon: "fa-phone",
               href: buildWhatsAppLink(phone),
               isLink: true
            });
         });
         
         contactData.emails.forEach((email, idx) => {
            contactEntries.push({
               label: idx === 0 ? "Correo principal" : `Correo ${idx + 1}`,
               value: email,
               icon: "fa-envelope",
               href: `mailto:${email}`,
               isLink: true
            });
         });
         
         items.push({
            id: 2,
            icon: icon_1,
            title: "📞 Contactos",
            items: contactEntries
         });
      }
      
      // Item 3: Redes Sociales
      const socialLinks = [
         contactData.social.facebook !== "#" && {
            label: "Facebook",
            value: "Sociología UPEA",
            icon: "fa-facebook",
            href: contactData.social.facebook,
            isLink: true
         },
         contactData.social.twitter !== "#" && {
            label: "Twitter / Telegram",
            value: "@SociologiaUPEA",
            icon: "fa-twitter",
            href: contactData.social.twitter,
            isLink: true
         },
         contactData.social.youtube !== "#" && {
            label: "YouTube",
            value: "Canal Oficial",
            icon: "fa-youtube-play",
            href: contactData.social.youtube,
            isLink: true
         }
      ].filter(Boolean) as ContactItem['items'];
      
      if (socialLinks.length > 0) {
         items.push({
            id: 3,
            icon: icon_2,
            title: "🌐 Redes Sociales",
            items: socialLinks
         });
      }
      
      return items;
      
   }, [contactData]);

   // =============================================
   // ESTADOS DE UI
   // =============================================
   if (loading) {
      return (
         <section className="contact-list pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-6 text-center">
                     <div className="loading-spinner">
                        <div className="spinner-border text-primary" role="status">
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">
                           Conectando con: {API_BASE_URL}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }
   
   if (error || contactItems.length === 0) {
      return (
         <section className="contact-list pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-6 text-center">
                     <div className="empty-state p-4" style={{ 
                        background: "#f8f9fa", 
                        borderRadius: "12px",
                        border: "2px dashed #dee2e6"
                     }}>
                        <i className="fa fa-address-card-o display-4 text-muted mb-3"></i>
                        <h5 className="text-muted">Información de contacto</h5>
                        <p className="text-muted small mb-0">
                           {error 
                              ? `⚠️ ${error}` 
                              : "Los datos de contacto de Sociología se mostrarán aquí cuando estén disponibles."}
                        </p>
                        <p className="text-muted small mt-2">
                           API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                        </p>
                        {error && (
                           <button 
                              className="btn btn-outline-primary btn-sm mt-3"
                              onClick={() => window.location.reload()}
                           >
                              <i className="fa fa-refresh me-1"></i> Reintentar
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   // =============================================
   // RENDERIZADO
   // =============================================
   return (
      <section className="contact-list pd-top-120 pd-bottom-90">
         <div className="container">
            <div className="row justify-content-center g-4">
               
               {contactItems.map((item) => (
                  <div key={item.id} className="col-lg-5 col-md-6">
                     <article 
                        className="contact-list-inner h-100"
                        style={{
                           background: "#fff",
                           borderRadius: "12px",
                           padding: "24px",
                           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                           border: "1px solid rgba(0,0,0,0.05)",
                           transition: "transform 0.2s ease, box-shadow 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                           e.currentTarget.style.transform = "translateY(-4px)";
                           e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                           e.currentTarget.style.transform = "translateY(0)";
                           e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                        }}
                     >
                        <div className="contact-header d-flex align-items-center mb-3 pb-2 border-bottom">
                           <span className="contact-icon text-primary me-3">
                              <i className={`fa ${item.id === 1 ? 'fa-map-marker fa-2x' : item.id === 2 ? 'fa-phone fa-2x' : 'fa-share-alt fa-2x'}`}></i>
                           </span>
                           <h5 className="mb-0" style={{ 
                              fontSize: "1.1rem", 
                              fontWeight: 600,
                              color: "#212529"
                           }}>
                              {item.title}
                           </h5>
                        </div>
                        
                        <ul className="contact-items list-unstyled mb-0">
                           {item.items.map((entry, idx) => (
                              <li key={idx} className="mb-2">
                                 {entry.isLink && entry.href ? (
                                    <a 
                                       href={entry.href}
                                       target={entry.href.startsWith('http') ? "_blank" : undefined}
                                       rel={entry.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                       className="text-decoration-none text-dark d-flex align-items-start"
                                       style={{ transition: "color 0.2s ease" }}
                                       onMouseEnter={(e) => (e.currentTarget.style.color = "#0d6efd")}
                                       onMouseLeave={(e) => (e.currentTarget.style.color = "#212529")}
                                    >
                                       <i className={`fa ${entry.icon} me-2 mt-1 text-muted`} style={{ width: "20px", textAlign: "center" }}></i>
                                       <span className="flex-grow-1">
                                          {entry.label && <small className="text-muted d-block">{entry.label}</small>}
                                          {entry.value}
                                       </span>
                                       <i className="fa fa-external-link ms-2 text-muted small" style={{ fontSize: "0.8rem" }}></i>
                                    </a>
                                 ) : (
                                    <div className="d-flex align-items-start">
                                       <i className={`fa ${entry.icon} me-2 mt-1 text-muted`} style={{ width: "20px", textAlign: "center" }}></i>
                                       <span className="flex-grow-1">
                                          {entry.label && <small className="text-muted d-block">{entry.label}</small>}
                                          {entry.value}
                                       </span>
                                    </div>
                                 )}
                              </li>
                           ))}
                        </ul>
                     </article>
                  </div>
               ))}
               
            </div>
         </div>

         <style jsx>{`
            .contact-list-inner:hover {
               transform: translateY(-4px);
               box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }
            
            .contact-items a:hover {
               color: #0d6efd !important;
            }
            
            .contact-icon {
               min-width: 40px;
               height: 40px;
               display: flex;
               align-items: center;
               justify-content: center;
               background: rgba(13, 110, 253, 0.1);
               border-radius: 50%;
            }
            
            .loading-spinner {
               padding: 40px 20px;
            }
            
            .empty-state {
               padding: 40px 20px;
            }
            
            @media (max-width: 768px) {
               .contact-list-inner {
                  padding: 20px !important;
               }
               .contact-header h5 {
                  font-size: 1rem !important;
               }
            }
         `}</style>
      </section>
   );
};

export default ContactArea;