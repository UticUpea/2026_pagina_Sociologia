"use client";
import intro_data from "@/data/IntroData";
import Image from "next/image";
import Link from "next/link";

// =============================================
// COMPONENTE - COLORES OSCUROS CON ÍCONOS ORIGINALES ✨
// =============================================
const IntroArea = () => {
   
   // =============================================
   // ESTILOS VISUALES - COLORES OSCUROS 🎨
   // =============================================
   const introStyles = {
      section: {
         background: 'linear-gradient(135deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         padding: '60px 0'
      },
      decorativeBg: {
         position: 'absolute' as const,
         top: '-100px',
         left: '-100px',
         width: '300px',
         height: '300px',
         background: 'radial-gradient(circle, rgba(250,178,101,0.12) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      decorativeBg2: {
         position: 'absolute' as const,
         bottom: '-80px',
         right: '-80px',
         width: '250px',
         height: '250px',
         background: 'radial-gradient(circle, rgba(253,28,10,0.12) 0%, transparent 70%)',
         borderRadius: '50%',
         zIndex: 0
      },
      content: {
         position: 'relative' as const,
         zIndex: 1
      },
      accreditationBox: {
         background: 'rgba(255,255,255,0.08)',
         borderRadius: '20px',
         padding: '40px 32px',
         height: '100%',
         display: 'flex',
         flexDirection: 'column' as const,
         justifyContent: 'center',
         border: '2px solid rgba(250,178,101,0.25)',
         backdropFilter: 'blur(15px)',
         boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      accreditationTitle: {
         color: '#FAB265',
         fontSize: '1.6rem',
         fontWeight: 800,
         marginBottom: '1.2rem',
         textTransform: 'uppercase',
         letterSpacing: '2px',
         display: 'inline-flex',
         alignItems: 'center',
         gap: '12px',
         textShadow: '0 2px 12px rgba(250,178,101,0.4)'
      },
      accreditationSubtitle: {
         color: 'rgba(255,255,255,0.9)',
         fontSize: '1rem',
         fontWeight: 500,
         lineHeight: 1.7,
         marginBottom: 0
      },
      card: {
         background: 'rgba(255,255,255,0.06)',
         borderRadius: '20px',
         padding: '40px 24px',
         height: '100%',
         display: 'flex',
         flexDirection: 'column' as const,
         alignItems: 'center',
         justifyContent: 'center',
         border: '2px solid rgba(250,178,101,0.2)',
         backdropFilter: 'blur(15px)',
         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
         position: 'relative' as const,
         overflow: 'hidden' as const,
         minHeight: '280px'
      },
      cardHover: {
         background: 'rgba(255,255,255,0.12)',
         borderColor: 'rgba(250,178,101,0.5)',
         transform: 'translateY(-10px)',
         boxShadow: '0 20px 48px rgba(250,178,101,0.25)'
      },
      cardIcon: {
         marginBottom: '1.5rem',
         position: 'relative' as const,
         zIndex: 1,
         transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
         // ÍCONOS ORIGINALES - SIN FONDO
         width: 'auto',
         height: 'auto',
         maxWidth: '80px',
         maxHeight: '80px'
      },
      cardIconHover: {
         transform: 'scale(1.15) rotate(5deg)'
      },
      cardTitle: {
         color: '#FFFFFF',
         fontSize: '1.15rem',
         fontWeight: 700,
         textAlign: 'center' as const,
         marginBottom: 0,
         position: 'relative' as const,
         zIndex: 1,
         lineHeight: 1.4,
         letterSpacing: '0.5px',
         textShadow: '0 2px 10px rgba(0,0,0,0.4)'
      },
      cardLink: {
         color: 'inherit',
         textDecoration: 'none',
         transition: 'color 0.3s ease'
      },
      badge: {
         position: 'absolute' as const,
         top: '20px',
         right: '20px',
         background: 'linear-gradient(135deg, #FAB265, #FFD700)',
         color: '#050504',
         padding: '6px 14px',
         borderRadius: '12px',
         fontSize: '0.7rem',
         fontWeight: 800,
         textTransform: 'uppercase',
         letterSpacing: '1.5px',
         boxShadow: '0 4px 12px rgba(250,178,101,0.4)',
         display: 'flex',
         alignItems: 'center',
         gap: '6px'
      }
   };

   return (
      <div className="intro-area intro-area--top" style={introStyles.section}>
         {/* Elementos decorativos de fondo */}
         <div style={introStyles.decorativeBg} />
         <div style={introStyles.decorativeBg2} />
         
         <div className="container" style={introStyles.content}>
            <div className="intro-area-inner intro-home-1">
               <div className="row no-gutters g-4">
                  
                  {/* Columna Izquierda: Acreditación */}
                  <div className="col-lg-4 text-lg-left text-center">
                     <div 
                        style={introStyles.accreditationBox}
                        onMouseEnter={(e: any) => {
                           e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                           e.currentTarget.style.borderColor = 'rgba(250,178,101,0.4)';
                           e.currentTarget.style.boxShadow = '0 12px 40px rgba(250,178,101,0.3)';
                        }}
                        onMouseLeave={(e: any) => {
                           e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                           e.currentTarget.style.borderColor = 'rgba(250,178,101,0.25)';
                           e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                        }}
                     >
                        {/* Badge CUB */}
                        <div style={introStyles.badge}>
                           <i className="fa fa-certificate"></i>
                           CUB
                        </div>
                        
                        <h3 style={introStyles.accreditationTitle}>
                           <i className="fa fa-award"></i>
                           CARRERA ACREDITADA
                        </h3>
                        
                        <p style={introStyles.accreditationSubtitle}>
                           Sociología reconocida por el Consejo de Acreditación de la Educación Superior
                        </p>
                     </div>
                  </div>
                  
                  {/* Columna Derecha: Tarjetas de Información */}
                  <div className="col-lg-8 align-self-center">
                     <ul className="row no-gutters g-4">
                        {intro_data.filter((items) => items.page === "home_1").map((item) => (
                           <li key={item.id} className="col-md-4">
                              <div 
                                 className="single-intro-inner style-white text-center"
                                 style={introStyles.card}
                                 onMouseEnter={(e: any) => {
                                    Object.assign(e.currentTarget.style, introStyles.cardHover);
                                    const icon = e.currentTarget.querySelector('.card-icon');
                                    if (icon) Object.assign(icon.style, introStyles.cardIconHover);
                                 }}
                                 onMouseLeave={(e: any) => {
                                    Object.assign(e.currentTarget.style, {
                                       background: 'rgba(255,255,255,0.06)',
                                       borderColor: 'rgba(250,178,101,0.2)',
                                       transform: 'translateY(0)',
                                       boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                                    });
                                    const icon = e.currentTarget.querySelector('.card-icon');
                                    if (icon) Object.assign(icon.style, { 
                                       transform: 'scale(1) rotate(0deg)'
                                    });
                                 }}
                              >
                                 {/* Ícono ORIGINAL - SIN FONDO CIRCULAR */}
                                 <div className="thumb card-icon" style={introStyles.cardIcon}>
                                    <Image 
                                       src={item.icon} 
                                       alt={item.title} 
                                       width={80}
                                       height={80}
                                       style={{ 
                                          // Sin filtros - Ícono original
                                          transition: 'filter 0.3s ease'
                                       }}
                                    />
                                 </div>
                                 
                                 {/* Título con Link */}
                                 <div className="details">
                                    <h5 style={introStyles.cardTitle}>
                                       <Link 
                                          className="b-animate-3" 
                                          href="/about"
                                          style={introStyles.cardLink}
                                          onMouseEnter={(e: any) => {
                                             e.currentTarget.style.color = '#FAB265';
                                             e.currentTarget.style.textShadow = '0 0 20px rgba(250,178,101,0.6)';
                                          }}
                                          onMouseLeave={(e: any) => {
                                             e.currentTarget.style.color = '#FFFFFF';
                                             e.currentTarget.style.textShadow = '0 2px 10px rgba(0,0,0,0.4)';
                                          }}
                                       >
                                          {item.title}
                                       </Link>
                                    </h5>
                                 </div>
                              </div>
                           </li>
                        ))}
                     </ul>
                  </div>
                  
               </div>
            </div>
         </div>
         
         {/* CSS Global para animaciones */}
         <style jsx global>{`
            @keyframes float {
               0%, 100% {
                  transform: translateY(0px);
               }
               50% {
                  transform: translateY(-10px);
               }
            }
            
            .intro-area .single-intro-inner {
               will-change: transform, box-shadow, background;
            }
            
            .intro-area .thumb img {
               transition: filter 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @media (max-width: 991px) {
               .intro-area {
                  padding: 50px 0 !important;
               }
            }
            
            @media (max-width: 767px) {
               .intro-area {
                  padding: 40px 0 !important;
               }
               .intro-title h3 {
                  font-size: 1.4rem !important;
               }
               .single-intro-inner {
                  min-height: 260px !important;
                  padding: 32px 20px !important;
               }
            }
         `}</style>
      </div>
   );
};

export default IntroArea;