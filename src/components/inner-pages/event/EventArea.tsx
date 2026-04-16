"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// =============================================
// INTERFACES
// =============================================
interface Convocatoria {
   idconvocatorias: number;
   con_foto_portada: string;
   con_titulo: string;
   con_descripcion: string;
   con_fecha_inicio: string;
   con_fecha_fin: string;
   tipo_conv_comun?: {
      tipo_conv_comun_titulo: string;
   };
}

interface Evento {
   evento_id: number;
   evento_titulo: string;
   evento_imagen: string;
   evento_descripcion: string;
   evento_fecha: string;
   evento_hora: string;
   evento_lugar: string;
   tipo_evento: string;
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

// =============================================
// UTILIDADES - Manejo Inteligente de Imágenes
// =============================================

/**
 * Construye URL completa para imágenes
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO o externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta según tipo
 */
const buildImageUrl = (
  imagePath: string | null | undefined,
  type: 'convocatoria' | 'evento' | 'curso' | 'gaceta' | 'autoridad' | 'portada' = 'convocatoria'
): string => {
  if (!imagePath) return '/images/placeholder-event.jpg';
  
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
    convocatoria: '/storage/imagenes/convocatorias/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/',
    portada: '/storage/imagenes/portadas/'
  };
  
  const folder = typeFolders[type] || '/storage/imagenes/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

const formatDate = (dateString: string): string => {
   if (!dateString) return 'Fecha no disponible';
   const date = new Date(dateString);
   return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   });
};

// =============================================
// COMPONENTE PRINCIPAL - SOLO SOCIOLOGÍA ✨
// =============================================
const EventArea: React.FC = () => {
   const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
   const [eventos, setEventos] = useState<Evento[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            console.log('🔄 [EventArea] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            // ✅ URL y headers con variables de entorno - SOLO SOCIOLOGÍA
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/gacetaEventos`;
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
               
               console.log('✅ [EventArea] Datos cargados:', {
                  convocatorias: data.convocatorias?.length || 0,
                  eventos: data.upea_evento?.length || 0
               });
               
               setConvocatorias(data.convocatorias || []);
               setEventos(data.upea_evento || []);
            } else {
               console.error('❌ Error API:', response.status);
               setError(`Error ${response.status} al cargar datos`);
               setConvocatorias([]);
               setEventos([]);
            }
            
            setLoading(false);
            
         } catch (error: any) {
            console.error('❌ Error crítico:', error?.message);
            setError(error?.message || 'Error de conexión con el servidor');
            setConvocatorias([]);
            setEventos([]);
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   // =============================================
   // RENDERIZADO
   // =============================================
   if (loading) {
      return (
         <section className="event-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                     </div>
                     <p className="mt-3 text-muted">
                        Conectando con: {API_BASE_URL}
                     </p>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="event-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div className="alert alert-warning text-center p-4" style={{ 
                        borderRadius: '12px',
                        background: '#fff3cd',
                        border: '2px solid #ffc107'
                     }}>
                        <i className="fa fa-exclamation-triangle fa-2x mb-3" style={{ color: '#856404' }}></i>
                        <h5 className="text-warning mb-2">Error al Cargar</h5>
                        <p className="mb-0 text-muted">{error}</p>
                        <p className="text-muted small mt-2">
                           API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                        </p>
                        <button 
                           onClick={() => window.location.reload()}
                           className="btn btn-warning btn-sm mt-3"
                        >
                           <i className="fa fa-refresh me-1"></i> Reintentar
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      );
   }

   const totalItems = convocatorias.length + eventos.length;

   return (
      <section className="event-area pd-top-120 pd-bottom-90">
         <div className="container">
            
            <div className="row justify-content-center mb-5">
               <div className="col-lg-7 text-center">
                  <h6 className="sub-title" style={{ color: '#FD1C0A', fontWeight: 600 }}>
                     <i className="fa fa-calendar me-2"></i>
                     CONVOCATORIAS Y EVENTOS
                  </h6>
                  <h2 className="title" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529' }}>
                     Últimas Publicaciones
                  </h2>
                  <p className="text-muted small mt-2">
                     <i className="fa fa-database me-1"></i>
                     API: {API_BASE_URL} | Institución: {INSTITUCION_ID}
                  </p>
               </div>
            </div>

            {totalItems === 0 ? (
               <div className="row justify-content-center">
                  <div className="col-lg-8">
                     <div className="alert alert-warning text-center p-4" style={{ 
                        borderRadius: '12px',
                        background: '#fff3cd',
                        border: '2px solid #ffc107'
                     }}>
                        <i className="fa fa-exclamation-triangle fa-2x mb-3" style={{ color: '#856404' }}></i>
                        <h5 className="text-warning mb-2">No hay publicaciones disponibles</h5>
                        <p className="mb-0 text-muted">
                           Las convocatorias y eventos se mostrarán aquí cuando estén disponibles.
                        </p>
                        <p className="text-muted small mt-2">
                           API: {API_BASE_URL} | ID: {INSTITUCION_ID}
                        </p>
                     </div>
                  </div>
               </div>
            ) : (
               <div>
                  {/* Convocatorias */}
                  {convocatorias.length > 0 && (
                     <div className="mb-5">
                        <h3 className="mb-4" style={{ 
                           fontSize: '1.5rem', 
                           fontWeight: 700, 
                           color: '#FD1C0A',
                           borderBottom: '3px solid #FD1C0A',
                           paddingBottom: '10px'
                        }}>
                           <i className="fa fa-file-text-o me-2"></i>
                           Convocatorias ({convocatorias.length})
                        </h3>
                        <div className="row justify-content-center g-4">
                           {convocatorias.map((convocatoria) => {
                              // ✅ Construir URL de imagen inteligente
                              const imageUrl = buildImageUrl(convocatoria.con_foto_portada, 'convocatoria');
                              
                              return (
                                 <div key={convocatoria.idconvocatorias} className="col-lg-4 col-md-6">
                                    <article className="event-card h-100" style={{
                                       borderRadius: '12px',
                                       overflow: 'hidden',
                                       boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                       background: '#fff',
                                       transition: 'transform 0.3s ease',
                                       border: '1px solid #e0e0e0'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                       <div style={{ width: '100%', height: '200px', background: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
                                          <Image
                                             src={imageUrl}
                                             alt={convocatoria.con_titulo}
                                             width={400}
                                             height={200}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                             // ✅ No optimizar si es URL externa (MinIO)
                                             unoptimized={imageUrl.startsWith('http')}
                                             onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/placeholder-event.jpg';
                                             }}
                                          />
                                          {convocatoria.tipo_conv_comun && (
                                             <span style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#FD1C0A',
                                                color: '#fff',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                             }}>
                                                {convocatoria.tipo_conv_comun.tipo_conv_comun_titulo}
                                             </span>
                                          )}
                                       </div>
                                       
                                       <div className="p-3">
                                          <h5 style={{ 
                                             fontSize: '1.1rem', 
                                             fontWeight: 700, 
                                             marginBottom: '0.75rem', 
                                             color: '#212529',
                                             lineHeight: '1.3'
                                          }}>
                                             {convocatoria.con_titulo}
                                          </h5>
                                          
                                          {convocatoria.con_descripcion && (
                                             <div 
                                                style={{ 
                                                   fontSize: '0.875rem', 
                                                   color: '#6c757d',
                                                   marginBottom: '1rem',
                                                   lineHeight: '1.5',
                                                   maxHeight: '60px',
                                                   overflow: 'hidden'
                                                }}
                                                dangerouslySetInnerHTML={{ 
                                                   __html: convocatoria.con_descripcion.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                                                }}
                                             />
                                          )}
                                          
                                          <div style={{ 
                                             fontSize: '0.85rem', 
                                             color: '#6c757d', 
                                             marginBottom: '0.5rem',
                                             padding: '8px',
                                             background: '#f8f9fa',
                                             borderRadius: '6px'
                                          }}>
                                             <i className="fa fa-calendar me-2" style={{ color: '#FD1C0A' }}></i>
                                             <strong>Inicio:</strong> {formatDate(convocatoria.con_fecha_inicio)}
                                          </div>
                                          
                                          {convocatoria.con_fecha_fin && (
                                             <div style={{ 
                                                fontSize: '0.85rem', 
                                                color: '#6c757d', 
                                                marginBottom: '1rem',
                                                padding: '8px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px'
                                             }}>
                                                <i className="fa fa-calendar-check-o me-2" style={{ color: '#28a745' }}></i>
                                                <strong>Fin:</strong> {formatDate(convocatoria.con_fecha_fin)}
                                             </div>
                                          )}
                                          
                                          <Link 
                                             href={`/event-details/${convocatoria.idconvocatorias}`}
                                             className="btn btn-primary btn-sm w-100"
                                             style={{ 
                                                borderRadius: '8px',
                                                background: '#FD1C0A',
                                                borderColor: '#FD1C0A',
                                                fontWeight: 600,
                                                padding: '10px'
                                             }}
                                          >
                                             Ver más detalles <i className="fa fa-arrow-right ms-1"></i>
                                          </Link>
                                       </div>
                                    </article>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  {/* Eventos */}
                  {eventos.length > 0 && (
                     <div className="mb-5">
                        <h3 className="mb-4" style={{ 
                           fontSize: '1.5rem', 
                           fontWeight: 700, 
                           color: '#FAB265',
                           borderBottom: '3px solid #FAB265',
                           paddingBottom: '10px'
                        }}>
                           <i className="fa fa-calendar me-2"></i>
                           Eventos ({eventos.length})
                        </h3>
                        <div className="row justify-content-center g-4">
                           {eventos.map((evento) => {
                              // ✅ Construir URL de imagen inteligente
                              const imageUrl = buildImageUrl(evento.evento_imagen, 'evento');
                              
                              return (
                                 <div key={evento.evento_id} className="col-lg-4 col-md-6">
                                    <article className="event-card h-100" style={{
                                       borderRadius: '12px',
                                       overflow: 'hidden',
                                       boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                       background: '#fff',
                                       transition: 'transform 0.3s ease',
                                       border: '1px solid #e0e0e0'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                       <div style={{ width: '100%', height: '200px', background: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
                                          <Image
                                             src={imageUrl}
                                             alt={evento.evento_titulo}
                                             width={400}
                                             height={200}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                             // ✅ No optimizar si es URL externa (MinIO)
                                             unoptimized={imageUrl.startsWith('http')}
                                             onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/placeholder-event.jpg';
                                             }}
                                          />
                                          <span style={{
                                             position: 'absolute',
                                             top: '10px',
                                             right: '10px',
                                             background: '#FAB265',
                                             color: '#000',
                                             padding: '6px 12px',
                                             borderRadius: '6px',
                                             fontSize: '0.75rem',
                                             fontWeight: 700,
                                             textTransform: 'uppercase',
                                             boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                          }}>
                                             Evento
                                          </span>
                                       </div>
                                       
                                       <div className="p-3">
                                          <h5 style={{ 
                                             fontSize: '1.1rem', 
                                             fontWeight: 700, 
                                             marginBottom: '0.75rem', 
                                             color: '#212529',
                                             lineHeight: '1.3'
                                          }}>
                                             {evento.evento_titulo}
                                          </h5>
                                          
                                          {evento.evento_descripcion && (
                                             <div 
                                                style={{ 
                                                   fontSize: '0.875rem', 
                                                   color: '#6c757d',
                                                   marginBottom: '1rem',
                                                   lineHeight: '1.5',
                                                   maxHeight: '60px',
                                                   overflow: 'hidden'
                                                }}
                                                dangerouslySetInnerHTML={{ 
                                                   __html: evento.evento_descripcion.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                                                }}
                                             />
                                          )}
                                          
                                          <div style={{ 
                                             fontSize: '0.85rem', 
                                             color: '#6c757d', 
                                             marginBottom: '0.5rem',
                                             padding: '8px',
                                             background: '#f8f9fa',
                                             borderRadius: '6px'
                                          }}>
                                             <i className="fa fa-calendar me-2" style={{ color: '#FD1C0A' }}></i>
                                             <strong>Fecha:</strong> {evento.evento_fecha}
                                          </div>
                                          
                                          {evento.evento_hora && (
                                             <div style={{ 
                                                fontSize: '0.85rem', 
                                                color: '#6c757d', 
                                                marginBottom: '0.5rem',
                                                padding: '8px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px'
                                             }}>
                                                <i className="fa fa-clock-o me-2" style={{ color: '#17a2b8' }}></i>
                                                <strong>Hora:</strong> {evento.evento_hora}
                                             </div>
                                          )}
                                          
                                          {evento.evento_lugar && (
                                             <div style={{ 
                                                fontSize: '0.85rem', 
                                                color: '#6c757d', 
                                                marginBottom: '1rem',
                                                padding: '8px',
                                                background: '#f8f9fa',
                                                borderRadius: '6px'
                                             }}>
                                                <i className="fa fa-map-marker me-2" style={{ color: '#dc3545' }}></i>
                                                <strong>Lugar:</strong> {evento.evento_lugar}
                                             </div>
                                          )}
                                          
                                          <Link 
                                             href={`/event-details/${evento.evento_id}`}
                                             className="btn btn-outline-primary btn-sm w-100"
                                             style={{ 
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                padding: '10px',
                                                borderColor: '#FAB265',
                                                color: '#FAB265'
                                             }}
                                          >
                                             Ver más detalles <i className="fa fa-arrow-right ms-1"></i>
                                          </Link>
                                       </div>
                                    </article>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </section>
   );
};

export default EventArea;