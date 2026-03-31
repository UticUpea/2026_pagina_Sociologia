"use client";
import { useEffect, useState, useMemo } from "react";
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
   // Propiedades alternativas
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

interface InstitucionResponse {
   Descripcion?: InstitucionData;
   [key: string]: any;
}

// =============================================
// CONSTANTES - ID DE INSTITUCIÓN (NUEVO SERVIDOR)
// =============================================
const INSTITUCION_ID = "35"; // Sociología
const TARGET_COLOR_ID = 32;   // ✅ NUEVO: ID del esquema de colores a consumir

// =============================================
// UTILIDADES DE LIMPIEZA Y FORMATO
// =============================================

/**
 * Limpia URLs eliminando espacios en blanco
 */
const cleanUrl = (url: string | null | undefined): string => {
   if (!url) return "#";
   return url.toString().trim();
};

/**
 * Calcula si un color es claro u oscuro para determinar contraste
 * @param hex - Color en formato hex (#RRGGBB)
 * @returns true si el color es claro, false si es oscuro
 */
const isLightColor = (hex: string): boolean => {
   try {
      // Remover # si existe
      const clean = hex.replace('#', '');
      // Convertir a RGB
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      // Fórmula de luminosidad percibida
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
   } catch {
      return false; // Por defecto, asumir oscuro
   }
};

/**
 * Obtiene color de texto con alto contraste para un color de fondo dado
 * @param bgColor - Color de fondo en hex
 * @returns Color de texto: '#000000' para fondos claros, '#FFFFFF' para oscuros
 */
const getContrastTextColor = (bgColor: string): string => {
   return isLightColor(bgColor) ? '#000000' : '#FFFFFF';
};

// =============================================
// 🎨 NUEVO: Extraer colores institucionales buscando id_color: 32
// =============================================
const extractInstitutionalColors = (apiResponse: any) => {
   try {
      // Acceso seguro a la estructura de la API
      const descripcion = apiResponse?.Descripcion || apiResponse?.data || apiResponse;
      
      // ✅ Buscar esquema de colores por TARGET_COLOR_ID (32) o usar el primero disponible
      const colorScheme = descripcion?.colorinstitucion?.find(
         (c: ColorInstitucion) => c.id_color === TARGET_COLOR_ID
      ) || descripcion?.colorinstitucion?.[0];
      
      if (!colorScheme) {
         console.warn('⚠️ No se encontraron colores institucionales en la API');
         return null;
      }
      
      // Retornar colores limpios (sin espacios) y validados
      return {
         id_color: colorScheme.id_color || TARGET_COLOR_ID,
         primario: (colorScheme.color_primario || '#FD1C0A').trim(),
         secundario: (colorScheme.color_secundario || '#FAB265').trim(),
         terciario: (colorScheme.color_terciario || '#050504').trim()
      };
      
   } catch (error) {
      console.error('❌ Error extrayendo colores institucionales:', error);
      return null;
   }
};

// =============================================
// SERVICIO: Obtener datos de institución para header
// =============================================
const getInstitucionHeaderData = async (institucionId: string) => {
   try {
      const response = await fetch(
         `/api/institucion?path=institucionesPrincipal/${institucionId}`,
         {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
         }
      );
      
      const data = await response.json();
      
      console.log('[Service] Respuesta header:', {
         status: response.status,
         ok: response.ok,
         hasData: !!data
      });
      
      return {
         data,
         status: response.status,
         ok: response.ok
      };
      
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
      primario: '#FD1C0A',      // Rojo UPEA por defecto
      secundario: '#050504',    // Negro por defecto
      terciario: '#FAB265',     // Naranja por defecto
      textOnPrimario: '#FFFFFF', // Blanco sobre rojo (oscuro)
      textOnSecundario: '#FFFFFF' // Blanco sobre negro
   });

   // =============================================
   // CARGA DE DATOS - NUEVO SERVICIO API V2
   // =============================================
   useEffect(() => {
      let isMounted = true;
      
      const fetchHeaderData = async () => {
         try {
            setLoading(true);
            
            console.log(`🔄 [HeaderTop] Cargando datos para Sociología (ID: ${INSTITUCION_ID})...`);
            
            const response = await getInstitucionHeaderData(INSTITUCION_ID);
            
            console.log('📡 [HeaderTop] Respuesta completa:', response);
            
            // Manejar 404 como estado vacío (no error crítico)
            if (response.status === 404 || response.data?.statusCode === 404) {
               console.log('ℹ️ [HeaderTop] Sin datos disponibles (404 esperado)');
               if (isMounted) {
                  setInstitucion(null);
                  applyDefaultColors();
               }
               return;
            }
            
            // Extraer datos de la respuesta
            let datos: InstitucionData | null = null;
            if (response.data?.Descripcion && typeof response.data.Descripcion === 'object') {
               datos = response.data.Descripcion as InstitucionData;
            } else if (response.data?.institucion_id) {
               datos = response.data as InstitucionData;
            }
            
            if (isMounted) {
               if (datos) {
                  setInstitucion(datos);
                  
                  // ✅ MODIFICADO: Extraer colores institucionales buscando id_color: 32
                  const extractedColors = extractInstitutionalColors(response.data);
                  
                  if (extractedColors) {
                     // ✅ Calcular colores de texto con CONTRASTE ALTO para visibilidad
                     const textOnPrimario = getContrastTextColor(extractedColors.primario);
                     const textOnSecundario = getContrastTextColor(extractedColors.secundario);
                     
                     setColors({
                        primario: extractedColors.primario,
                        secundario: extractedColors.secundario,
                        terciario: extractedColors.terciario,
                        textOnPrimario,
                        textOnSecundario
                     });
                     
                     // Aplicar a CSS variables para uso global
                     applyCssVariables(extractedColors.primario, extractedColors.secundario, extractedColors.terciario, textOnPrimario, textOnSecundario);
                  } else {
                     applyDefaultColors();
                  }
                  console.log('✅ [HeaderTop] Datos y colores aplicados');
               } else {
                  console.warn('⚠️ [HeaderTop] No se encontraron datos válidos');
                  setInstitucion(null);
                  applyDefaultColors();
               }
            }
            
         } catch (err: any) {
            console.error("❌ [HeaderTop] Error cargando datos:", err);
            if (isMounted) {
               setInstitucion(null);
               applyDefaultColors(); // Fallback seguro
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchHeaderData();
      
      return () => { isMounted = false; };
      
   }, []);

   // =============================================
   // FUNCIONES DE ESTILOS
   // =============================================
   
   const applyCssVariables = (
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
      // ✅ Colores de texto con alto contraste para visibilidad
      root.style.setProperty('--text-on-main', textOnPrimario);
      root.style.setProperty('--text-on-heading', textOnSecundario);
      root.style.setProperty('--accent-color', terciario);
   };
   
   const applyDefaultColors = () => {
      // ✅ Colores por defecto de Sociología UPEA con contraste garantizado
      const primario = '#FD1C0A';   // Rojo UPEA (oscuro → texto blanco)
      const secundario = '#050504'; // Negro (oscuro → texto blanco)
      const terciario = '#FAB265';  // Naranja (claro → texto negro)
      
      setColors({
         primario,
         secundario,
         terciario,
         textOnPrimario: '#FFFFFF', // Blanco sobre rojo
         textOnSecundario: '#FFFFFF' // Blanco sobre negro
      });
      
      applyCssVariables(primario, secundario, terciario, '#FFFFFF', '#FFFFFF');
   };

   // =============================================
   // PREPARAR DATOS LIMPIOS (memoizado)
   // =============================================
   const headerData = useMemo(() => {
      if (!institucion) {
         // Fallback con datos por defecto de Sociología
         return {
            direccion: "Av. Sucre Z. Villa Esperanza, Campus UPEA",
            facebook: "https://www.facebook.com/Ingenieriadesistemasupeafuturo/  ",
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
   // RENDERIZADO PRINCIPAL
   // =============================================
   
   // Estado de carga minimalista (no bloqueante)
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
                     <small>Cargando información...</small>
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
            // ✅ Fondo con color primario institucional
            backgroundColor: colors.primario,
            // ✅ Texto con CONTRASTE ALTO para máxima visibilidad
            color: colors.textOnPrimario,
            // ✅ Sombra sutil para separación visual
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            // ✅ Padding cómodo para lectura
            padding: '8px 0',
            // ✅ Fuente legible
            fontSize: '0.9rem',
            fontWeight: 500,
            // ✅ Transición suave para cambios de tema
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
                              // ✅ Borde sutil para mejor legibilidad si el contraste no es perfecto
                              textShadow: colors.textOnPrimario === '#000000' 
                                 ? '0 1px 2px rgba(255,255,255,0.8)' 
                                 : '0 1px 2px rgba(0,0,0,0.6)'
                           }}
                        >
                           <i className="fa fa-map-marker" style={{ color: colors.terciario }}></i>
                           <span>{headerData.direccion}</span>
                        </span>
                     </li>
                     
                     {/* Teléfono si está disponible */}
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
                     
                     {/* Facebook */}
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
                                 // ✅ Fondo blanco para icono oscuro, o viceversa según contraste
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
                     
                     {/* Twitter / Telegram */}
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
                     
                     {/* YouTube */}
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