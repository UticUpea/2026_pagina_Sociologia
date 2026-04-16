"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";

// =============================================
// INTERFACES
// =============================================
interface ColorInstitucion {
   id_color: number;
   color_primario: string;
   color_secundario: string;
   color_terciario: string;
}

interface InstitucionData {
   institucion_id: number;
   institucion_nombre: string;
   institucion_facebook: string;
   institucion_youtube: string;
   institucion_twitter: string;
   institucion_direccion: string;
   institucion_api_google_map: string;
   institucion_celular1: number | string;
   institucion_correo1: string;
   colorinstitucion?: ColorInstitucion[];
   id?: number;
   nombre?: string;
   facebook?: string;
   twitter?: string;
   youtube?: string;
   direccion?: string;
   google_map?: string;
   celular?: string;
   correo?: string;
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;
const TARGET_COLOR_ID = process.env.NEXT_PUBLIC_COLOR_ID 
   ? parseInt(process.env.NEXT_PUBLIC_COLOR_ID, 10) 
   : 32;

// =============================================
// UTILIDADES
// =============================================

const cleanUrl = (url: string | null | undefined): string => {
   if (!url) return "#";
   return url.toString().trim();
};

const isLightColor = (hex: string): boolean => {
   try {
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
   } catch {
      return false;
   }
};

const getContrastTextColor = (bgColor: string): string => {
   return isLightColor(bgColor) ? '#000000' : '#FFFFFF';
};

const extractInstitutionalColors = (apiResponse: any) => {
   try {
      const descripcion = apiResponse?.Descripcion || apiResponse?.data || apiResponse;
      const colorScheme = descripcion?.colorinstitucion?.find(
         (c: ColorInstitucion) => c.id_color === TARGET_COLOR_ID
      ) || descripcion?.colorinstitucion?.[0];
      
      if (!colorScheme) return null;
      
      return {
         id_color: colorScheme.id_color || TARGET_COLOR_ID,
         primario: (colorScheme.color_primario || '#FD1C0A').trim(),
         secundario: (colorScheme.color_secundario || '#FAB265').trim(),
         terciario: (colorScheme.color_terciario || '#050504').trim()
      };
   } catch (error) {
      console.error('❌ Error extrayendo colores:', error);
      return null;
   }
};

const getInstitucionHeaderData = async (institucionId: string) => {
   try {
      const url = `${API_BASE_URL}/api/v2/institucionesPrincipal/${institucionId}`;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
      
      const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      const data = await response.json();
      
      return { data, status: response.status, ok: response.ok };
   } catch (error) {
      console.error('[Service] Error fetching header:', error);
      throw error;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const HeaderTopOne: React.FC = () => {
   const [institucion, setInstitucion] = useState<InstitucionData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [colors, setColors] = useState<{
      primario: string;
      secundario: string;
      terciario: string;
      textOnPrimario: string;
      textOnSecundario: string;
   }>({
      primario: '#FD1C0A',
      secundario: '#050504',
      terciario: '#FAB265',
      textOnPrimario: '#FFFFFF',
      textOnSecundario: '#FFFFFF'
   });

   // ✅ applyCssVariables como función estable (no depende de nada externo)
   const applyCssVariables = useCallback((
      primario: string, 
      secundario: string, 
      terciario: string,
      textOnPrimario: string,
      textOnSecundario: string
   ) => {
      const root = document.documentElement;
      root.style.setProperty('--main-color', primario);
      root.style.setProperty('--heading-color', secundario);
      root.style.setProperty('--paragraph-color', '#333333');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
      root.style.setProperty('--text-on-main', textOnPrimario);
      root.style.setProperty('--text-on-heading', textOnSecundario);
      root.style.setProperty('--accent-color', terciario);
   }, []); // ✅ Sin dependencias → función estable
   
   // ✅ applyDefaultColors con useCallback para evitar warnings de eslint
   const applyDefaultColors = useCallback(() => {
      const primario = '#FD1C0A';
      const secundario = '#050504';
      const terciario = '#FAB265';
      
      setColors({
         primario,
         secundario,
         terciario,
         textOnPrimario: '#FFFFFF',
         textOnSecundario: '#FFFFFF'
      });
      
      applyCssVariables(primario, secundario, terciario, '#FFFFFF', '#FFFFFF');
   }, [applyCssVariables]); // ✅ Solo depende de applyCssVariables (estable)

   // =============================================
   // CARGA DE DATOS
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchHeaderData = async () => {
         try {
            console.log('🔄 [HeaderTop] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            const response = await getInstitucionHeaderData(INSTITUCION_ID);
            
            if (response.status === 404 || response.data?.statusCode === 404) {
               if (isMounted) {
                  setInstitucion(null);
                  applyDefaultColors();
               }
               return;
            }
            
            let datos: InstitucionData | null = null;
            if (response.data?.Descripcion && typeof response.data.Descripcion === 'object') {
               datos = response.data.Descripcion as InstitucionData;
            } else if (response.data?.institucion_id) {
               datos = response.data as InstitucionData;
            }
            
            if (isMounted) {
               if (datos) {
                  setInstitucion(datos);
                  
                  const extractedColors = extractInstitutionalColors(response.data);
                  
                  if (extractedColors) {
                     const textOnPrimario = getContrastTextColor(extractedColors.primario);
                     const textOnSecundario = getContrastTextColor(extractedColors.secundario);
                     
                     setColors({
                        primario: extractedColors.primario,
                        secundario: extractedColors.secundario,
                        terciario: extractedColors.terciario,
                        textOnPrimario,
                        textOnSecundario
                     });
                     
                     applyCssVariables(extractedColors.primario, extractedColors.secundario, extractedColors.terciario, textOnPrimario, textOnSecundario);
                  } else {
                     applyDefaultColors();
                  }
               } else {
                  setInstitucion(null);
                  applyDefaultColors();
               }
            }
            
         } catch (err: any) {
            console.error("❌ [HeaderTop] Error:", err?.message);
            if (isMounted) {
               setInstitucion(null);
               applyDefaultColors();
            }
         } finally {
            if (isMounted) setLoading(false);
         }
      };

      fetchHeaderData();
      return () => { isMounted = false; };
      
   }, [applyDefaultColors, applyCssVariables]); // ✅ Dependencias explícitas

   // =============================================
   // DATOS MEMOIZADOS
   // =============================================
   const headerData = useMemo(() => {
      if (!institucion) {
         return {
            direccion: "Av. Sucre Z. Villa Esperanza, Campus UPEA",
            facebook: "https://www.facebook.com/Ingenieriadesistemasupeafuturo/",
            twitter: "#",
            youtube: "#"
         };
      }
      
      return {
         direccion: cleanUrl(institucion.institucion_direccion) || "Zona Villa Esperanza, Campus UPEA",
         facebook: cleanUrl(institucion.institucion_facebook),
         twitter: cleanUrl(institucion.institucion_twitter),
         youtube: cleanUrl(institucion.institucion_youtube)
      };
   }, [institucion]);

   // =============================================
   // RENDERIZADO
   // =============================================
   
   if (loading) {
      return (
         <div className="navbar-top" style={{ 
            backgroundColor: colors.secundario,
            color: colors.textOnSecundario,
            padding: '8px 0',
            fontSize: '0.85rem'
         }}>
            <div className="container">
               <div className="row">
                  <div className="col-12 text-center">
                     <small>Conectando con: {API_BASE_URL}</small>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <header 
         className="navbar-top" 
         style={{ 
            backgroundColor: colors.primario,
            color: colors.textOnPrimario,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            padding: '8px 0',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'background-color 0.3s ease, color 0.3s ease'
         }}
      >
         <div className="container">
            <div className="row align-items-center">
               
               {/* Columna izquierda: Dirección */}
               <div className="col-md-7 col-12 text-md-start text-center mb-2 mb-md-0">
                  <ul className="list-unstyled mb-0 d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
                     <li>
                        <span 
                           className="d-inline-flex align-items-center gap-2"
                           style={{ 
                              textShadow: colors.textOnPrimario === '#000000' 
                                 ? '0 1px 2px rgba(255,255,255,0.8)' 
                                 : '0 1px 2px rgba(0,0,0,0.6)'
                           }}
                        >
                           <i className="fa fa-map-marker" style={{ color: colors.terciario }}></i>
                           <span>{headerData.direccion}</span>
                        </span>
                     </li>
                     
                     {institucion?.institucion_celular1 && institucion.institucion_celular1 !== 2147483647 && (
                        <li>
                           <a 
                              href={`tel:${institucion.institucion_celular1}`}
                              className="text-decoration-none"
                              style={{ 
                                 color: colors.textOnPrimario,
                                 textShadow: colors.textOnPrimario === '#000000' 
                                    ? '0 1px 2px rgba(255,255,255,0.8)' 
                                    : '0 1px 2px rgba(0,0,0,0.6)',
                                 transition: 'opacity 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                           >
                              <i className="fa fa-phone me-1" style={{ color: colors.terciario }}></i>
                              {institucion.institucion_celular1}
                           </a>
                        </li>
                     )}
                  </ul>
               </div>
               
               {/* Columna derecha: Redes sociales */}
               <div className="col-md-5 col-12">
                  <ul className="topbar-right list-unstyled mb-0 d-flex justify-content-center justify-content-md-end gap-3">
                     
                     {headerData.facebook !== "#" && (
                        <li>
                           <Link 
                              href={headerData.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-flex align-items-center justify-content-center"
                              title="Facebook"
                              style={{
                                 width: '32px',
                                 height: '32px',
                                 borderRadius: '50%',
                                 background: colors.textOnPrimario === '#FFFFFF' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.2)',
                                 color: colors.textOnPrimario === '#FFFFFF' ? '#1877F2' : colors.terciario,
                                 fontSize: '0.9rem',
                                 transition: 'transform 0.2s ease, background 0.2s ease',
                                 textDecoration: 'none'
                              }}
                              onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.background = colors.textOnPrimario === '#FFFFFF' ? '#fff' : 'rgba(0,0,0,0.35)';
                              }}
                              onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.background = colors.textOnPrimario === '#FFFFFF' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.2)';
                              }}
                           >
                              <i className="fa fa-facebook"></i>
                           </Link>
                        </li>
                     )}
                     
                     {headerData.twitter !== "#" && (
                        <li>
                           <Link 
                              href={headerData.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-flex align-items-center justify-content-center"
                              title="Twitter / Telegram"
                              style={{
                                 width: '32px',
                                 height: '32px',
                                 borderRadius: '50%',
                                 background: colors.textOnPrimario === '#FFFFFF' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.2)',
                                 color: colors.textOnPrimario === '#FFFFFF' ? '#1DA1F2' : colors.terciario,
                                 fontSize: '0.9rem',
                                 transition: 'transform 0.2s ease, background 0.2s ease',
                                 textDecoration: 'none'
                              }}
                              onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.background = colors.textOnPrimario === '#FFFFFF' ? '#fff' : 'rgba(0,0,0,0.35)';
                              }}
                              onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.background = colors.textOnPrimario === '#FFFFFF' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.2)';
                              }}
                           >
                              <i className="fa fa-twitter"></i>
                           </Link>
                        </li>
                     )}
                     
                     {headerData.youtube !== "#" && (
                        <li>
                           <Link 
                              href={headerData.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-flex align-items-center justify-content-center"
                              title="YouTube"
                              style={{
                                 width: '32px',
                                 height: '32px',
                                 borderRadius: '50%',
                                 background: colors.textOnPrimario === '#FFFFFF' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.2)',
                                 color: colors.textOnPrimario === '#FFFFFF' ? '#FF0000' : colors.terciario,
                                 fontSize: '0.9rem',
                                 transition: 'transform 0.2s ease, background 0.2s ease',
                                 textDecoration: 'none'
                              }}
                              onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.background = colors.textOnPrimario === '#FFFFFF' ? '#fff' : 'rgba(0,0,0,0.35)';
                              }}
                              onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.background = colors.textOnPrimario === '#FFFFFF' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.2)';
                              }}
                           >
                              <i className="fa fa-youtube-play"></i>
                           </Link>
                        </li>
                     )}
                  </ul>
               </div>
            </div>
         </div>
      </header>
   );
};

export default HeaderTopOne;