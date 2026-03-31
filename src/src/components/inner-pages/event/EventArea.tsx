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
// CONSTANTES
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_PRINCIPAL = "35"; // Sociología
const INSTITUCION_FALLBACK = "19"; // Agronomía

// =============================================
// UTILIDADES
// =============================================
const buildImageUrl = (fileName: string | null | undefined): string => {
   if (!fileName) return '/images/placeholder-event.jpg';
   const cleanName = fileName.trim();
   if (cleanName.startsWith('http')) return cleanName;
   if (cleanName.startsWith('/storage/')) return `${API_BASE_URL}${cleanName}`;
   return `/api/recurso?file=${encodeURIComponent(cleanName)}`;
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
// COMPONENTE PRINCIPAL
// =============================================
const EventArea: React.FC = () => {
   const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
   const [eventos, setEventos] = useState<Evento[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [dataSource, setDataSource] = useState<string>('');

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            console.log('🔄 [EventArea] === INICIANDO CARGA ===');
            
            // =============================================
            // INTENTAR ID 35 PRIMERO
            // =============================================
            console.log('📍 Paso 1: Intentando ID 35 (Sociología)...');
            let dataPrincipal = null;
            let tieneDatosPrincipal = false;
            
            try {
               const urlPrincipal = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_PRINCIPAL}/gacetaEventos`;
               const headers: HeadersInit = { 'Content-Type': 'application/json' };
               if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
               
               const responsePrincipal = await fetch(urlPrincipal, { 
                  method: 'GET', 
                  headers,
                  cache: 'no-store'
               });
               
               if (responsePrincipal.ok) {
                  dataPrincipal = await responsePrincipal.json();
                  tieneDatosPrincipal = (dataPrincipal.convocatorias?.length || 0) > 0 || 
                                       (dataPrincipal.upea_evento?.length || 0) > 0;
                  console.log('✅ ID 35 respondió:', { 
                     status: responsePrincipal.status,
                     tieneConvocatorias: dataPrincipal.convocatorias?.length || 0,
                     tieneEventos: dataPrincipal.upea_evento?.length || 0
                  });
               } else {
                  console.log(`⚠️ ID 35 retornó ${responsePrincipal.status} - Usando fallback`);
               }
            } catch (error) {
               console.error('❌ Error en ID 35:', error);
            }
            
            // =============================================
            // DECISIÓN: ¿Usar ID 35 o fallback?
            // =============================================
            if (tieneDatosPrincipal && dataPrincipal) {
               console.log('✅ USANDO ID 35 (Sociología) - TIENE DATOS');
               setConvocatorias(dataPrincipal.convocatorias || []);
               setEventos(dataPrincipal.upea_evento || []);
               setDataSource('Sociología (ID 35)');
               setLoading(false);
               return;
            }
            
            // =============================================
            // FALLBACK A ID 19
            // =============================================
            console.log('⚠️ ID 35 NO tiene datos - Intentando ID 19 (Agronomía)...');
            let dataFallback = null;
            
            try {
               const urlFallback = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_FALLBACK}/gacetaEventos`;
               const headers: HeadersInit = { 'Content-Type': 'application/json' };
               if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
               
               const responseFallback = await fetch(urlFallback, { 
                  method: 'GET', 
                  headers,
                  cache: 'no-store'
               });
               
               if (responseFallback.ok) {
                  dataFallback = await responseFallback.json();
                  console.log('✅ ID 19 respondió:', { 
                     status: responseFallback.status,
                     tieneConvocatorias: dataFallback.convocatorias?.length || 0,
                     tieneEventos: dataFallback.upea_evento?.length || 0
                  });
                  
                  setConvocatorias(dataFallback.convocatorias || []);
                  setEventos(dataFallback.upea_evento || []);
                  setDataSource('Agronomía (ID 19) - Fallback');
               } else {
                  console.error(`❌ ID 19 también falló: ${responseFallback.status}`);
                  setConvocatorias([]);
                  setEventos([]);
                  setDataSource('Sin datos disponibles');
               }
            } catch (error) {
               console.error('❌ Error en ID 19:', error);
               setConvocatorias([]);
               setEventos([]);
               setDataSource('Error de conexión');
            }
            
            setLoading(false);
            
         } catch (error) {
            console.error('❌ Error crítico:', error);
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
                     <p className="mt-3 text-muted">Cargando convocatorias y eventos...</p>
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
                  {dataSource && (
                     <p className="text-muted small mt-2">
                        <i className="fa fa-info-circle me-1"></i>
                        Fuente: {dataSource}
                     </p>
                  )}
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
                        <h5 className="text-warning mb-2">No hay convocatorias disponibles</h5>
                        <p className="mb-0 text-muted">
                           {dataSource === 'Sin datos disponibles' || dataSource === 'Error de conexión' 
                              ? 'No se pudieron cargar las convocatorias. Intente más tarde.'
                              : 'Las convocatorias se mostrarán aquí cuando estén disponibles.'}
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
                           {convocatorias.map((convocatoria) => (
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
                                          src={buildImageUrl(convocatoria.con_foto_portada)}
                                          alt={convocatoria.con_titulo}
                                          width={400}
                                          height={200}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          unoptimized={convocatoria.con_foto_portada?.startsWith('http')}
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
                           ))}
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
                           {eventos.map((evento) => (
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
                                          src={buildImageUrl(evento.evento_imagen)}
                                          alt={evento.evento_titulo}
                                          width={400}
                                          height={200}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          unoptimized={evento.evento_imagen?.startsWith('http')}
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
                           ))}
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