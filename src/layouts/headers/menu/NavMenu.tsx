"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

// =============================================
// INTERFACES
// =============================================
export interface SubMenuItem {
   link: string;
   title: string;
   orden?: number;
   visible?: boolean;
}

export interface MenuItem {
   id: number;
   title: string;
   link: string;
   has_dropdown: boolean;
   sub_menus?: SubMenuItem[];
   orden?: number;
   visible?: boolean;
}

export interface InstitucionData {
   institucion_id: number;
   institucion_nombre: string;
   institucion_logo: string;
   colorinstitucion?: Array<{
      id_color: number;
      color_primario: string;
      color_secundario: string;
      color_terciario: string;
   }>;
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
// MENÚ ESTÁTICO - SOLO PARA ESTRUCTURA INICIAL (FALLBACK)
// =============================================
const DEFAULT_MENU: MenuItem[] = [
   {
      id: 1,
      title: "Inicio",
      link: "/",
      has_dropdown: false,
      visible: true,
      orden: 1
   },
   {
      id: 3,
      title: "Carrera",
      link: "/about",
      has_dropdown: true,
      visible: true,
      orden: 2,
      sub_menus: [
         { link: "/about", title: "Nosotros", orden: 1, visible: true },
         { link: "/about#historia", title: "Historia", orden: 2, visible: true },
         { link: "/team", title: "Autoridades", orden: 3, visible: true },
         { link: "/contact", title: "Contacto", orden: 4, visible: true },
      ],
   },
   {
      id: 4,
      title: "Académico",
      link: "#",
      has_dropdown: true,
      visible: true,
      orden: 3,
      sub_menus: [
         { link: "/blog", title: "Convocatorias", orden: 1, visible: true },
         { link: "/course", title: "Gaceta Universitaria", orden: 2, visible: true },
         { link: "/blog-grid", title: "Cursos", orden: 3, visible: true },
         { link: "/offers", title: "Ofertas Académicas", orden: 4, visible: true },
         { link: "/services", title: "Servicios de Carrera", orden: 5, visible: true },
         { link: "/publicaciones", title: "Publicaciones", orden: 6, visible: true },
      ],
   },
   {
      id: 2,
      title: "Enlaces",
      link: "#",
      has_dropdown: true,
      visible: true,
      orden: 4,
      sub_menus: [
         { link: "https://virtualsociologia.upea.bo/", title: "Campus Virtual", orden: 1, visible: true },
         { link: "https://inscripcionessociologia.upea.bo/", title: "Inscripciones", orden: 2, visible: true },
         { link: "https://sociologia.upea.edu.bo/", title: "Página Web", orden: 3, visible: true },
      ],
   },
   {
      id: 5,
      title: "Contacto",
      link: "/contact",
      has_dropdown: false,
      visible: true,
      orden: 5
   },
];

// =============================================
// UTILIDADES - Manejo Inteligente de Imágenes y URLs
// =============================================

/**
 * Construye URL completa para imágenes del logo
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta de logos
 */
const buildLogoUrl = (
  logoPath: string | null | undefined
): string => {
  if (!logoPath) return '/assets/img/logo-sociologia.png';
  
  const cleanPath = logoPath.trim();
  
  // ✅ CASO 1: Ya es URL completa (MinIO o externo) → NO modificar
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // ✅ CASO 2: Ruta relativa /storage/... → Agregar API_BASE_URL
  if (cleanPath.startsWith('/storage/')) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  
  // ✅ CASO 3: UUID o filename → Construir URL con carpeta de logos
  return `${API_BASE_URL}/storage/imagenes/logos/${cleanPath}`;
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

const getContrastTextColor = (bgColor: string, preferDark: boolean = false): string => {
   const isLight = isLightColor(bgColor);
   if (preferDark && isLight) return '#000000';
   if (preferDark && !isLight) return '#FFFFFF';
   return isLight ? '#000000' : '#FFFFFF';
};

const getTextShadow = (textColor: string): string => {
   return isLightColor(textColor) 
      ? '0 1px 3px rgba(0, 0, 0, 0.4)' 
      : '0 1px 3px rgba(255, 255, 255, 0.3)';
};

const extractInstitutionalColors = (data: InstitucionData | null) => {
   if (!data?.colorinstitucion) return null;
   
   const colorScheme = data.colorinstitucion.find(
      (c) => c.id_color === TARGET_COLOR_ID
   ) || data.colorinstitucion[0];
   
   if (!colorScheme) return null;
   
   return {
      primario: colorScheme.color_primario || '#FD1C0A',
      secundario: colorScheme.color_secundario || '#FAB265',
      terciario: colorScheme.color_terciario || '#050504'
   };
};

// =============================================
// SERVICIOS - CON VARIABLES DE ENTORNO (SIN PROXY)
// =============================================

const getMenuData = async (institucionId: string): Promise<MenuItem[]> => {
   try {
      // ✅ URL directa con variables de entorno
      const url = `${API_BASE_URL}/api/v2/institucion/${institucionId}/menu`;
      
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
         const data = await response.json();
         const menu = Array.isArray(data) ? data : data.menu || data.data?.menu || data.menus || DEFAULT_MENU;
         
         const filtered = (menu as MenuItem[])
            .filter((item: MenuItem) => item.visible !== false)
            .sort((a, b) => (a.orden || 999) - (b.orden || 999))
            .map(item => ({
               ...item,
               sub_menus: item.sub_menus
                  ?.filter((sub: SubMenuItem) => sub.visible !== false)
                  .sort((a, b) => (a.orden || 999) - (b.orden || 999))
            }));
         
         return filtered;
      } else {
         console.warn(`⚠️ [NavMenu] Error ${response.status} cargando menú, usando fallback`);
         return DEFAULT_MENU;
      }
      
   } catch (error) {
      console.error('❌ [NavMenu] Error cargando menú:', error);
      return DEFAULT_MENU;
   }
};

const getInstitucionData = async (institucionId: string): Promise<InstitucionData | null> => {
   try {
      // ✅ URL directa con variables de entorno
      const url = `${API_BASE_URL}/api/v2/institucionesPrincipal/${institucionId}`;
      
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
         const data = result?.Descripcion || result;
         return data;
      }
      return null;
   } catch (error) {
      console.error('❌ [NavMenu] Error cargando institución:', error);
      return null;
   }
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const NavMenu: React.FC<{
   variant?: 'header' | 'footer';
   backgroundColor?: string;
   textColor?: string;
   hoverColor?: string;
   onLogoLoaded?: (logoUrl: string) => void;
}> = ({ 
   variant = 'header',
   backgroundColor = 'var(--heading-color, #050504)', 
   textColor, 
   hoverColor = 'var(--accent-color, #FAB265)',
   onLogoLoaded
}) => {
   
   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
   const [institutionData, setInstitutionData] = useState<InstitucionData | null>(null);
   const [logoUrl, setLogoUrl] = useState<string>('');
   const [navTitle, setNavTitle] = useState<string>("");
   const [colors, setColors] = useState({
      text: '#FFFFFF',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
      hover: hoverColor,
      active: '#FAB265',
      primario: '#FD1C0A',
      secundario: '#FAB265',
      terciario: '#050504'
   });
   
   const currentRoute = usePathname();

   useEffect(() => {
      let isMounted = true;
      
      const fetchData = async () => {
         try {
            console.log('🔄 [NavMenu] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            console.log('🎨 Color ID:', TARGET_COLOR_ID);
            
            const menu = await getMenuData(INSTITUCION_ID);
            const institucion = await getInstitucionData(INSTITUCION_ID);
            
            if (isMounted) {
               setMenuItems(menu);
               
               if (institucion) {
                  setInstitutionData(institucion);
                  
                  // ✅ Construir URL de logo inteligente
                  const logo = buildLogoUrl(institucion.institucion_logo);
                  console.log('🖼️ [NavMenu] Logo URL:', logo);
                  setLogoUrl(logo);
                  
                  if (onLogoLoaded) onLogoLoaded(logo);
                  
                  // ✅ Extraer colores institucionales
                  const institutionalColors = extractInstitutionalColors(institucion);
                  if (institutionalColors) {
                     setColors(prev => ({
                        ...prev,
                        ...institutionalColors,
                        text: textColor || getContrastTextColor(backgroundColor),
                        textShadow: getTextShadow(textColor || getContrastTextColor(backgroundColor)),
                        hover: hoverColor,
                        active: isLightColor(backgroundColor) ? institutionalColors.primario : institutionalColors.secundario
                     }));
                     
                     // Aplicar variables CSS globales
                     const root = document.documentElement;
                     root.style.setProperty('--main-color', institutionalColors.primario);
                     root.style.setProperty('--heading-color', institutionalColors.secundario);
                     root.style.setProperty('--accent-color', institutionalColors.terciario);
                  }
               } else {
                  const text = textColor || getContrastTextColor(backgroundColor);
                  setColors({
                     text,
                     textShadow: getTextShadow(text),
                     hover: hoverColor,
                     active: isLightColor(backgroundColor) ? '#FD1C0A' : '#FAB265',
                     primario: '#FD1C0A',
                     secundario: '#FAB265',
                     terciario: '#050504'
                  });
               }
            }
         } catch (error: any) {
            console.error('❌ [NavMenu] Error:', error?.message);
            if (isMounted) {
               setMenuItems(DEFAULT_MENU);
               const text = textColor || getContrastTextColor(backgroundColor);
               setColors({
                  text,
                  textShadow: getTextShadow(text),
                  hover: hoverColor,
                  active: isLightColor(backgroundColor) ? '#FD1C0A' : '#FAB265',
                  primario: '#FD1C0A',
                  secundario: '#FAB265',
                  terciario: '#050504'
               });
            }
         }
      };

      fetchData();
      return () => { isMounted = false; };
   }, [backgroundColor, textColor, hoverColor, onLogoLoaded]);

   const isMenuItemActive = (menuLink: string): boolean => {
      if (!menuLink || menuLink === '#') return false;
      const cleanLink = menuLink.split('#')[0];
      const cleanRoute = currentRoute?.split('#')[0] || '';
      return cleanRoute === cleanLink;
   };

   const isSubMenuItemActive = (subMenuLink: string): boolean => {
      if (!subMenuLink || subMenuLink === '#') return false;
      const cleanLink = subMenuLink.split('#')[0];
      const cleanRoute = currentRoute?.split('#')[0] || '';
      return cleanRoute === cleanLink;
   };

   const openMobileMenu = (menuTitle: string) => {
      setNavTitle(prev => prev === menuTitle ? "" : menuTitle);
   };

   // =============================================
   // ESTILOS VISUALES
   // =============================================
   const isFooter = variant === 'footer';
   
   const menuStyles = {
      container: isFooter ? {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         padding: '40px 0 20px',
         borderTop: '3px solid rgba(250,178,101,0.3)',
         marginTop: '60px'
      } : {},
      navItem: {
         position: 'relative' as const,
         margin: isFooter ? '0 8px' : '0 4px'
      },
      navLink: {
         color: '#FFFFFF',
         fontWeight: 600 as const,
         fontSize: isFooter ? '13px' : '14px',
         padding: isFooter ? '10px 14px' : '14px 18px',
         borderRadius: '10px',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         textDecoration: 'none' as const,
         display: 'flex',
         alignItems: 'center',
         gap: '6px',
         textShadow: '0 2px 8px rgba(0,0,0,0.5)',
         letterSpacing: '0.3px',
         position: 'relative' as const
      },
      navLinkHover: {
         color: '#FAB265',
         background: 'rgba(250,178,101,0.15)',
         transform: 'translateY(-2px)',
         boxShadow: '0 4px 12px rgba(250,178,101,0.2)'
      },
      navLinkActive: {
         color: '#FAB265',
         fontWeight: 700 as const,
         background: 'linear-gradient(135deg, rgba(250,178,101,0.2), rgba(253,28,10,0.2))',
         boxShadow: 'inset 0 2px 8px rgba(250,178,101,0.3)',
         textShadow: '0 0 20px rgba(250,178,101,0.8)'
      },
      navLinkIndicator: {
         content: '""',
         position: 'absolute' as const,
         bottom: '6px',
         left: '50%',
         transform: 'translateX(-50%) scaleX(0)',
         width: '60%',
         height: '3px',
         background: 'linear-gradient(90deg, #FAB265, #FD1C0A)',
         borderRadius: '2px',
         transition: 'transform 0.3s ease',
         boxShadow: '0 0 10px rgba(250,178,101,0.6)'
      },
      dropdownMenu: {
         background: 'linear-gradient(180deg, #050504 0%, #1a0505 100%)',
         borderRadius: '12px',
         boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
         padding: '12px 0',
         marginTop: '8px',
         minWidth: '260px',
         border: '2px solid rgba(250,178,101,0.5)',
         backdropFilter: 'blur(20px)',
         zIndex: 1000,
         opacity: 0,
         visibility: 'hidden' as const,
         transform: 'translateY(-10px)',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         position: 'absolute' as const,
         top: '100%',
         left: 0
      },
      dropdownMenuShow: {
         opacity: 1,
         visibility: 'visible' as const,
         transform: 'translateY(0)'
      },
      dropdownItem: {
         color: '#FFFFFF',
         padding: '10px 20px',
         fontSize: '14px',
         fontWeight: 500 as const,
         transition: 'all 0.2s ease',
         display: 'flex',
         alignItems: 'center',
         gap: '8px',
         borderRadius: '8px',
         margin: '4px 8px',
         borderLeft: '3px solid transparent'
      },
      dropdownItemHover: {
         background: 'rgba(250,178,101,0.2)',
         color: '#FAB265',
         borderLeftColor: '#FAB265',
         paddingLeft: '24px',
         transform: 'translateX(4px)'
      },
      dropdownItemActive: {
         background: 'rgba(250,178,101,0.25)',
         color: '#FAB265',
         fontWeight: 600 as const,
         borderLeftColor: '#FAB265'
      },
      externalIcon: {
         fontSize: '0.7rem',
         opacity: 0.7,
         marginLeft: 'auto'
      },
      mobileToggle: {
         fontSize: '0.7rem',
         transition: 'transform 0.3s ease',
         display: 'inline-block',
         color: '#FAB265',
         marginLeft: '4px'
      },
      footerTitle: isFooter ? {
         color: '#FAB265',
         fontSize: '1.1rem',
         fontWeight: 700,
         marginBottom: '20px',
         textTransform: 'uppercase' as const,
         letterSpacing: '2px',
         textShadow: '0 2px 10px rgba(0,0,0,0.5)'
      } : {}
   };

   // =============================================
   // RENDERIZADO - VERSIÓN FOOTER
   // =============================================
   if (isFooter) {
      return (
         <footer className="footer-nav" style={menuStyles.container}>
            <div className="container">
               <div className="text-center mb-4">
                  <h5 style={menuStyles.footerTitle}>
                     <i className="fa fa-bars me-2"></i>
                     MENÚ DE NAVEGACIÓN
                  </h5>
               </div>
               
               <ul className="nav justify-content-center flex-wrap" style={{ gap: '8px' }}>
                  {menuItems.map((menu) => {
                     const isActive = isMenuItemActive(menu.link);
                     
                     return (
                        <li 
                           key={menu.id} 
                           className={`nav-item ${isActive ? "active" : ""}`}
                           style={menuStyles.navItem}
                        >
                           <Link
                              href={menu.link}
                              className="nav-link"
                              style={{
                                 ...menuStyles.navLink,
                                 ...(isActive ? menuStyles.navLinkActive : {})
                              }}
                              data-active={isActive}
                              onMouseEnter={(e: any) => {
                                 if (!isActive) {
                                    Object.assign(e.currentTarget.style, menuStyles.navLinkHover);
                                 }
                              }}
                              onMouseLeave={(e: any) => {
                                 if (!isActive) {
                                    Object.assign(e.currentTarget.style, menuStyles.navLink);
                                 }
                              }}
                           >
                              {menu.title}
                              <span 
                                 style={{
                                    ...menuStyles.navLinkIndicator,
                                    transform: isActive 
                                       ? 'translateX(-50%) scaleX(1)' 
                                       : 'translateX(-50%) scaleX(0)'
                                 }}
                              />
                           </Link>
                        </li>
                     );
                  })}
               </ul>
               
               <div className="text-center mt-4 pt-3" style={{ 
                  borderTop: '1px solid rgba(250,178,101,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.85rem'
               }}>
                  © {new Date().getFullYear()} Sociología UPEA - Todos los derechos reservados
               </div>
            </div>
            
            <style jsx global>{`
               .footer-nav .nav-link {
                  font-family: 'Poppins', 'Montserrat', sans-serif !important;
               }
               .footer-nav .nav-link:hover {
                  color: #FAB265 !important;
               }
               .footer-nav .nav-link.active {
                  animation: glow 2s ease-in-out infinite alternate;
               }
               @keyframes glow {
                  from { text-shadow: 0 0 20px rgba(250,178,101,0.8); }
                  to { text-shadow: 0 0 30px rgba(250,178,101,1); }
               }
               
               /* Responsive Footer Nav */
               @media (max-width: 767px) {
                  .footer-nav {
                     padding: 30px 0 15px !important;
                  }
                  .footer-nav .nav {
                     flex-direction: column !important;
                     align-items: center !important;
                  }
                  .footer-nav .nav-link {
                     font-size: 12px !important;
                     padding: 8px 12px !important;
                     width: 100%;
                     justify-content: center;
                  }
                  .footer-nav .footerTitle {
                     font-size: 1rem !important;
                  }
               }
            `}</style>
         </footer>
      );
   }

   // =============================================
   // RENDERIZADO ORIGINAL - VERSIÓN HEADER
   // =============================================
   return (
      <>
         {menuItems.map((menu) => {
            const isActive = isMenuItemActive(menu.link) || 
               (menu.sub_menus?.some(sub => sub.link && isSubMenuItemActive(sub.link)));
            
            return (
               <li 
                  key={menu.id} 
                  className={`
                     ${menu.has_dropdown ? "menu-item-has-children" : ""}
                     ${isActive ? "active" : ""}
                  `.trim()}
                  style={menuStyles.navItem}
                  onMouseEnter={(e: any) => {
                     if (menu.has_dropdown && window.innerWidth >= 768) {
                        const dropdown = e.currentTarget.querySelector('.sub-menu');
                        if (dropdown) {
                           Object.assign(dropdown.style, menuStyles.dropdownMenuShow);
                        }
                     }
                  }}
                  onMouseLeave={(e: any) => {
                     if (menu.has_dropdown && window.innerWidth >= 768) {
                        const dropdown = e.currentTarget.querySelector('.sub-menu');
                        if (dropdown) {
                           Object.assign(dropdown.style, {
                              ...menuStyles.dropdownMenu,
                              opacity: 0,
                              visibility: 'hidden',
                              transform: 'translateY(-10px)'
                           });
                        }
                     }
                  }}
               >
                  <Link
                     href={menu.link}
                     className={`${menu.has_dropdown && navTitle === menu.title ? "show" : ""}`}
                     onClick={(e) => {
                        if (menu.has_dropdown) {
                           e.preventDefault();
                           openMobileMenu(menu.title);
                        }
                     }}
                     style={{
                        ...menuStyles.navLink,
                        ...(isActive ? menuStyles.navLinkActive : {})
                     }}
                     data-active={isActive}
                     onMouseEnter={(e: any) => {
                        if (!isActive) {
                           Object.assign(e.currentTarget.style, menuStyles.navLinkHover);
                        }
                     }}
                     onMouseLeave={(e: any) => {
                        if (!isActive) {
                           Object.assign(e.currentTarget.style, menuStyles.navLink);
                        }
                     }}
                  >
                     {menu.title}
                     {menu.has_dropdown && (
                        <span 
                           className="d-md-none" 
                           style={{
                              ...menuStyles.mobileToggle,
                              transform: navTitle === menu.title ? 'rotate(180deg)' : 'rotate(0)'
                           }}
                        >
                           ▼
                        </span>
                     )}
                     <span 
                        className="d-none d-md-block"
                        style={{
                           ...menuStyles.navLinkIndicator,
                           transform: isActive 
                              ? 'translateX(-50%) scaleX(1)' 
                              : 'translateX(-50%) scaleX(0)'
                        }}
                     />
                  </Link>
                  
                  {menu.has_dropdown && menu.sub_menus && (
                     <ul 
                        className={`sub-menu ${navTitle === menu.title ? "show" : ""}`}
                        style={{
                           ...menuStyles.dropdownMenu,
                           ...(navTitle === menu.title ? menuStyles.dropdownMenuShow : {})
                        }}
                     >
                        {menu.sub_menus.map((sub_m, i) => {
                           const subIsActive = sub_m.link && isSubMenuItemActive(sub_m.link);
                           const isExternal = sub_m.link?.startsWith('http');
                           
                           return (
                              <li 
                                 key={i} 
                                 className={subIsActive ? "active" : ""}
                              >
                                 <Link 
                                    href={sub_m.link}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    style={{
                                       ...menuStyles.dropdownItem,
                                       ...(subIsActive ? menuStyles.dropdownItemActive : {})
                                    }}
                                    onMouseEnter={(e: any) => {
                                       if (!subIsActive) {
                                          Object.assign(e.currentTarget.style, menuStyles.dropdownItemHover);
                                       }
                                    }}
                                    onMouseLeave={(e: any) => {
                                       if (!subIsActive) {
                                          Object.assign(e.currentTarget.style, menuStyles.dropdownItem);
                                       }
                                    }}
                                 >
                                    {sub_m.title}
                                    {isExternal && (
                                       <i 
                                          className="fa fa-external-link" 
                                          style={menuStyles.externalIcon}
                                       />
                                    )}
                                 </Link>
                              </li>
                           );
                        })}
                     </ul>
                  )}
               </li>
            );
         })}
         
         <style jsx global>{`
            .menu-item-has-children {
               position: relative;
            }
            .navbar-nav .nav-link {
               font-family: 'Poppins', 'Montserrat', sans-serif !important;
            }
            .sub-menu {
               list-style: none !important;
               margin: 0 !important;
               padding: 0 !important;
            }
            .sub-menu li {
               list-style: none !important;
            }
            .navbar-nav .nav-link.active {
               animation: glow 2s ease-in-out infinite alternate;
            }
            @keyframes glow {
               from {
                  text-shadow: 0 0 20px rgba(250,178,101,0.8), var(--text-shadow, 0 1px 3px rgba(0,0,0,0.4));
               }
               to {
                  text-shadow: 0 0 30px rgba(250,178,101,1), var(--text-shadow, 0 1px 3px rgba(0,0,0,0.4));
               }
            }
            .sub-menu {
               will-change: opacity, transform, visibility;
            }
            
            /* =============================================
               RESPONSIVE DESIGN - NAV MENU
               ============================================= */
            
            /* Tablet */
            @media (max-width: 991px) {
               .navbar-nav .nav-link {
                  font-size: 13px !important;
                  padding: 12px 14px !important;
               }
               
               .sub-menu {
                  position: static !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                  transform: none !important;
                  background: rgba(255,255,255,0.05) !important;
                  border: 1px solid rgba(250,178,101,0.3) !important;
                  margin-top: 8px !important;
                  box-shadow: none !important;
               }
               
               .sub-menu .dropdown-item {
                  padding: 8px 16px !important;
                  font-size: 13px !important;
               }
            }
            
            /* Móvil */
            @media (max-width: 767px) {
               .navbar-nav {
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 4px !important;
               }
               
               .navbar-nav .nav-item {
                  width: 100% !important;
                  margin: 0 !important;
               }
               
               .navbar-nav .nav-link {
                  font-size: 14px !important;
                  padding: 12px 16px !important;
                  justify-content: space-between !important;
                  width: 100% !important;
               }
               
               .navbar-nav .nav-link .d-md-none {
                  display: inline-block !important;
               }
               
               .navbar-nav .nav-link .d-none.d-md-block {
                  display: none !important;
               }
               
               /* Dropdown en móvil */
               .sub-menu {
                  position: static !important;
                  opacity: 1 !important;
                  visibility: visible !important;
                  transform: none !important;
                  background: rgba(255,255,255,0.05) !important;
                  border: 1px solid rgba(250,178,101,0.3) !important;
                  margin-top: 8px !important;
                  padding: 8px 0 !important;
                  box-shadow: none !important;
                  display: none;
               }
               
               .sub-menu.show {
                  display: block !important;
               }
               
               .sub-menu .dropdown-item {
                  padding: 10px 20px !important;
                  font-size: 13px !important;
                  margin: 2px 12px !important;
               }
               
               .sub-menu .dropdown-item .fa-external-link {
                  display: none !important;
               }
               
               /* Indicador activo */
               .nav-link span[style*="scaleX(1)"] {
                  display: none !important;
               }
            }
            
            /* Móvil pequeño */
            @media (max-width: 576px) {
               .navbar-nav .nav-link {
                  font-size: 13px !important;
                  padding: 10px 14px !important;
               }
               
               .sub-menu .dropdown-item {
                  padding: 8px 16px !important;
                  font-size: 12px !important;
               }
            }
         `}</style>
      </>
   );
};

export default NavMenu;