"use client";
import MobileMenu from "./menu/MobileMenu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, CSSProperties, useCallback } from "react"; // ✅ Agregar useCallback
import NavMenu from "./menu/NavMenu";
import HeaderTopOne from "./menu/HeaderTopOne";
import UseSticky from "@/hooks/UseSticky";
import HeaderSearchbar from "./menu/HeaderSearchbar";

import logo_1 from "@/assets/img/logo-sociologia.png";
import logo_2 from "@/assets/img/logo-sociologia.png";

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;
const TARGET_COLOR_ID = process.env.NEXT_PUBLIC_COLOR_ID 
   ? parseInt(process.env.NEXT_PUBLIC_COLOR_ID, 10) 
   : 32;

const cleanUrl = (url: string | null | undefined): string => {
   return url?.toString().trim() || "";
};

const extractInstitutionalColors = (apiResponse: any) => {
   try {
      const descripcion = apiResponse?.Descripcion || apiResponse?.data || apiResponse;
      const colorScheme = descripcion?.colorinstitucion?.find(
         (c: any) => c.id_color === TARGET_COLOR_ID
      ) || descripcion?.colorinstitucion?.[0];
      
      if (!colorScheme) return null;
      
      return {
         id_color: colorScheme.id_color || TARGET_COLOR_ID,
         primario: (colorScheme.color_primario || '#FD1C0A').trim(),
         secundario: (colorScheme.color_secundario || '#FAB265').trim(),
         terciario: (colorScheme.color_terciario || '#050504').trim()
      };
   } catch (error) {
      console.error('Error extrayendo colores:', error);
      return null;
   }
};

const testImageLoad = (src: string): Promise<boolean> => {
   return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
   });
};

const buildLogoUrl = (
  logoPath: string | null | undefined,
  type: 'logo' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'logo'
): string => {
  if (!logoPath) return '';
  const cleanPath = logoPath.trim();
  if (cleanPath.startsWith('http')) return cleanPath;
  if (cleanPath.startsWith('/storage/')) return `${API_BASE_URL}${cleanPath}`;
  
  const typeFolders: Record<string, string> = {
    logo: '/storage/imagenes/logos/',
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

const getInstitucionHeaderData = async (institucionId: string) => {
   try {
      const url = `${API_BASE_URL}/api/v2/institucionesPrincipal/${institucionId}`;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
      
      const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      const data = await response.json();
      return { data, status: response.status, ok: response.ok };
   } catch (error) {
      console.error('[Service] Error:', error);
      throw error;
   }
};

const HeaderOne: React.FC<{ style?: any; style_2?: any }> = ({ style, style_2 }) => {
   const [isActive, setIsActive] = useState<boolean>(false);
   const { sticky } = UseSticky();
   const [isSearch, setIsSearch] = useState<boolean>(false);
   const [logoUrl, setLogoUrl] = useState<string | null>(null);
   const [logoLoaded, setLogoLoaded] = useState<boolean>(false);
   const [scrollY, setScrollY] = useState(0);
   const [colors, setColors] = useState({
      primario: '#FD1C0A',
      secundario: '#FAB265',
      terciario: '#050504'
   });

   const toggleMobileMenu = () => setIsActive(!isActive);

   useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   // ✅ applyCssVariables con useCallback - función estable
   const applyCssVariables = useCallback((colors: any) => {
      const root = document.documentElement;
      root.style.setProperty('--main-color', colors.primario);
      root.style.setProperty('--heading-color', colors.secundario);
      root.style.setProperty('--accent-color', colors.terciario);
   }, []); // ✅ Sin dependencias → función estable
   
   // ✅ applyDefaultColors con useCallback - función estable
   const applyDefaultColors = useCallback(() => {
      const defaultColors = { primario: '#FD1C0A', secundario: '#FAB265', terciario: '#050504' };
      setColors(defaultColors);
      applyCssVariables(defaultColors);
   }, [applyCssVariables]); // ✅ Solo depende de applyCssVariables (estable)

   // ✅ useEffect con dependencias explícitas - SOLUCIONA EL WARNING
   useEffect(() => {
      let isMounted = true;
      
      const fetchHeaderData = async () => {
         try {
            const response = await getInstitucionHeaderData(INSTITUCION_ID);
            
            if (response.status === 404) {
               if (isMounted) applyDefaultColors();
               return;
            }
            
            const descripcion = response.data?.Descripcion || response.data?.data || response.data;
            
            if (descripcion) {
               const extractedColors = extractInstitutionalColors(response.data);
               
               if (extractedColors && isMounted) {
                  setColors(extractedColors);
                  applyCssVariables(extractedColors);
                  
                  const logoFile = cleanUrl(descripcion.institucion_logo);
                  if (logoFile) {
                     const directLogoUrl = buildLogoUrl(logoFile, 'logo');
                     const canLoad = await testImageLoad(directLogoUrl);
                     
                     if (isMounted) {
                        if (canLoad) {
                           setLogoUrl(directLogoUrl);
                           setLogoLoaded(true);
                        } else {
                           setLogoUrl(null);
                           setLogoLoaded(false);
                        }
                     }
                  }
               } else {
                  if (isMounted) applyDefaultColors();
               }
            } else {
               if (isMounted) applyDefaultColors();
            }
         } catch (err: any) {
            console.error("Error HeaderOne:", err);
            if (isMounted) applyDefaultColors();
         }
      };

      fetchHeaderData();
      return () => { isMounted = false; };
   }, [applyDefaultColors, applyCssVariables]); // ✅ DEPENDENCIAS EXPLÍCITAS - SOLUCIONA EL WARNING

   const headerStyles = useMemo(() => {
      const isScrolled = sticky || scrollY > 50;
      
      return {
         navbar: {
            background: isScrolled 
               ? 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)'
               : 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
            backdropFilter: 'blur(15px)' as any,
            transition: 'all 0.4s ease',
            borderBottom: '1px solid rgba(250,178,101,0.2)',
            boxShadow: isScrolled ? '0 4px 20px rgba(253,28,10,0.3)' : '0 2px 15px rgba(0,0,0,0.3)',
            zIndex: 1000
         } as CSSProperties,
         logo: {
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
            transition: 'all 0.3s ease',
            transform: isScrolled ? 'scale(0.95)' : 'scale(1)'
         } as CSSProperties,
         mobileToggle: {
            background: '#FAB265',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
         } as CSSProperties,
         toggleIcon: {
            background: '#050504',
            width: '24px',
            height: '3px',
            borderRadius: '2px',
            transition: 'all 0.3s ease'
         } as CSSProperties,
         searchIcon: {
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '1.3rem',
            padding: '10px',
            borderRadius: '50%',
            background: 'rgba(250,178,101,0.2)',
            border: '2px solid rgba(250,178,101,0.4)',
            transition: 'all 0.3s ease',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
         } as CSSProperties,
         buttonPrimary: {
            background: 'linear-gradient(135deg, #FAB265 0%, #FFD700 100%)',
            color: '#050504',
            padding: '12px 28px',
            borderRadius: '25px',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 15px rgba(250,178,101,0.4)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
         } as CSSProperties,
         buttonSecondary: {
            background: 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '25px',
            fontWeight: 700,
            border: '2px solid rgba(250,178,101,0.6)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontSize: '11px',
            letterSpacing: '0.8px',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)' as any
         } as CSSProperties,
         buttonDesktop: {
            background: 'linear-gradient(135deg, #FD1C0A 0%, #CC1608 100%)',
            color: '#FFFFFF',
            padding: '14px 32px',
            borderRadius: '25px',
            fontWeight: 700,
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 6px 20px rgba(253,28,10,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '12px',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
         } as CSSProperties,
         mobileMenu: {
            background: 'linear-gradient(180deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
            backdropFilter: 'blur(30px)' as any,
            borderLeft: '3px solid #FAB265',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
            transition: 'transform 0.4s ease',
            zIndex: 1001
         } as CSSProperties,
         mobileOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 5, 4, 0.7)',
            backdropFilter: 'blur(8px)' as any,
            zIndex: 999,
            opacity: isActive ? 1 : 0,
            visibility: isActive ? 'visible' : 'hidden',
            transition: 'all 0.4s ease'
         } as CSSProperties
      };
   }, [sticky, scrollY, isActive]);

   return (
      <>
         {isActive && (
            <div 
               onClick={toggleMobileMenu}
               aria-hidden="true"
               style={headerStyles.mobileOverlay}
            />
         )}
         
         <div className="navbar-area">
            <HeaderTopOne />
            <MobileMenu />
            
            <nav
               className={`navbar navbar-area navbar-expand-lg ${style_2 ? "bg-white" : ""} ${style ? "navbar-area-2" : "navbar-area-1"} ${sticky ? "sticky-active" : ""}`}
               style={headerStyles.navbar}
            >
               <div className="container nav-container" style={{ position: 'relative', zIndex: 1 }}>
                  
                  <div className="responsive-mobile-menu">
                     <button
                        onClick={toggleMobileMenu}
                        className={`menu toggle-btn d-block d-lg-none ${isActive ? "open" : ""}`}
                        aria-expanded={isActive} 
                        aria-label="Toggle navigation"
                        style={headerStyles.mobileToggle}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1.05)';
                           e.currentTarget.style.boxShadow = '0 6px 16px rgba(250,178,101,0.5)';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1)';
                           e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }}
                     >
                        <span style={{...headerStyles.toggleIcon, transform: isActive ? 'rotate(45deg) translate(5px, 5px)' : 'none'}} />
                        <span style={{...headerStyles.toggleIcon, opacity: isActive ? 0 : 1}} />
                        <span style={{...headerStyles.toggleIcon, transform: isActive ? 'rotate(-45deg) translate(5px, -5px)' : 'none'}} />
                     </button>
                  </div>
                  
                  <div className="logo">
                     <Link href="/" style={{ display: 'inline-block' }}>
                        {logoUrl && logoLoaded ? (
                           <Image
                              src={logoUrl}
                              alt="Logo Sociología UPEA"
                              width={120}
                              height={36}
                              unoptimized={logoUrl.startsWith('http://') || logoUrl.startsWith('https://')}
                              style={{ 
                                 height: "36px",
                                 width: "auto",
                                 maxWidth: "120px",
                                 objectFit: "contain",
                                 ...headerStyles.logo
                              }}
                              onError={() => {
                                 setLogoUrl(null);
                                 setLogoLoaded(false);
                              }}
                              loading="eager"
                              priority
                           />
                        ) : (
                           <Image 
                              src={style ? logo_2 : logo_1} 
                              alt="Logo Sociología UPEA" 
                              width={120}
                              height={36}
                              style={{ 
                                 height: "36px",
                                 width: "auto",
                                 maxWidth: "120px",
                                 objectFit: "contain",
                                 ...headerStyles.logo
                              }}
                              loading="eager"
                              priority
                           />
                        )}
                     </Link>
                  </div>
                  
                  <div className="nav-right-part nav-right-part-mobile">
                     <Link
                        className="signin-btn"
                        href={cleanUrl("https://inscripcionessociologia.upea.bo/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={headerStyles.buttonPrimary}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.transform = 'translateY(-2px)';
                           e.currentTarget.style.boxShadow = '0 6px 20px rgba(250,178,101,0.5)';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.transform = 'translateY(0)';
                           e.currentTarget.style.boxShadow = '0 4px 15px rgba(250,178,101,0.4)';
                        }}
                     >
                        <i className="fa fa-graduation-cap"></i> Inscripciones
                     </Link>
                     
                     <Link
                        className="ed-btn btn-base"
                        href={cleanUrl("https://matriculacion.upea.bo/6e56c5c3766bda500b0c353c32bfa6d36fc48c6e")}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...headerStyles.buttonSecondary, marginLeft: '8px' }}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.transform = 'translateY(-2px)';
                           e.currentTarget.style.background = 'rgba(250,178,101,0.3)';
                           e.currentTarget.style.borderColor = '#FAB265';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.transform = 'translateY(0)';
                           e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                           e.currentTarget.style.borderColor = 'rgba(250,178,101,0.6)';
                        }}
                     >
                        <i className="fa fa-user"></i> M@E
                     </Link>
                     
                     <a 
                        onClick={() => setIsSearch(true)} 
                        style={headerStyles.searchIcon}
                        className="search-bar"
                        role="button"
                        aria-label="Buscar"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setIsSearch(true)}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1.1)';
                           e.currentTarget.style.background = 'rgba(250,178,101,0.3)';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1)';
                           e.currentTarget.style.background = 'rgba(250,178,101,0.2)';
                        }}
                     >
                        <i className="fa fa-search"></i>
                     </a>
                  </div>
                  
                  <div className={`collapse navbar-collapse ${isActive ? "sopen" : ""}`} id="edumint_main_menu">
                     <ul className="navbar-nav menu-open">
                        <NavMenu />
                     </ul>
                  </div>
                  
                  <div className={`nav-right-part nav-right-part-desktop d-none d-lg-flex align-items-center ${style ? "style-black" : ""}`}>
                     <Link
                        className="ed-btn btn-base"
                        href="/signup"
                        style={headerStyles.buttonDesktop}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.transform = 'translateY(-3px)';
                           e.currentTarget.style.boxShadow = '0 10px 28px rgba(253,28,10,0.5)';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.transform = 'translateY(0)';
                           e.currentTarget.style.boxShadow = '0 6px 20px rgba(253,28,10,0.4)';
                        }}
                     >
                        <i className="fa fa-sign-in"></i> INICIAR SESIÓN
                     </Link>
                     
                     <a 
                        onClick={() => setIsSearch(true)} 
                        style={{ ...headerStyles.searchIcon, fontSize: '1.35rem', marginLeft: '16px' }} 
                        className="search-bar"
                        role="button"
                        aria-label="Buscar"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setIsSearch(true)}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1.15)';
                           e.currentTarget.style.background = 'rgba(250,178,101,0.3)';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.transform = 'scale(1)';
                           e.currentTarget.style.background = 'rgba(250,178,101,0.2)';
                        }}
                     >
                        <i className="fa fa-search"></i>
                     </a>
                  </div>
               </div>
            </nav>
         </div>

         <HeaderSearchbar isSearch={isSearch} setIsSearch={setIsSearch} />
         
         <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&display=swap');
            * { font-family: 'Poppins', 'Montserrat', sans-serif !important; }
            .navbar-nav .dropdown-menu {
               display: none !important; position: absolute !important; top: 100% !important; left: 0 !important;
               min-width: 250px !important; background: linear-gradient(180deg, #050504 0%, #1a0505 100%) !important;
               border: 2px solid rgba(250,178,101,0.5) !important; border-radius: 12px !important;
               box-shadow: 0 12px 40px rgba(0,0,0,0.4) !important; padding: 12px 0 !important; margin-top: 8px !important; z-index: 1000 !important;
            }
            .navbar-nav .dropdown:hover .dropdown-menu { display: block !important; }
            .navbar-nav .dropdown-menu .dropdown-item {
               color: #FFFFFF !important; padding: 10px 20px !important; font-weight: 600 !important; transition: all 0.2s ease !important;
            }
            .navbar-nav .dropdown-menu .dropdown-item:hover { background: rgba(250,178,101,0.2) !important; color: #FAB265 !important; }
            .navbar-nav .nav-link {
               color: #FFFFFF !important; font-weight: 700 !important; font-size: 15px !important;
               padding: 12px 18px !important; border-radius: 10px !important; transition: all 0.3s ease !important;
            }
            .navbar-nav .nav-link:hover { color: #FAB265 !important; background: rgba(250,178,101,0.15) !important; }
            ::-webkit-scrollbar { width: 10px; }
            ::-webkit-scrollbar-track { background: #050504; }
            ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #FD1C0A, #FAB265); border-radius: 10px; }
         `}</style>
      </>
   );
};

export default HeaderOne;