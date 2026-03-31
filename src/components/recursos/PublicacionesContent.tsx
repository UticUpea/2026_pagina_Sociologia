"use client";
import React, { useEffect, useState } from 'react';
import HeaderOne from "@/layouts/headers/HeaderOne";
import Breadcrumb from "@/components/common/Breadcrumb";
import FooterOne from "@/layouts/footers/FooterOne";

// =============================================
// INTERFACES
// =============================================
interface LinkExterno {
   id_link: number;
   imagen: string;
   nombre: string;
   url_link: string;
   estado: number;
   tipo: string;
}

interface Publicacion {
   id?: number;
   titulo?: string;
   descripcion?: string;
   imagen?: string;
   fecha?: string;
   archivo?: string;
   [key: string]: any;
}

// =============================================
// CONSTANTES
// =============================================
const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35";

// =============================================
// UTILIDADES
// =============================================
const buildImageUrl = (fileName: string | null | undefined): string => {
   if (!fileName) return '/images/placeholder.jpg';
   const cleanName = fileName.trim();
   if (cleanName.startsWith('http')) return cleanName;
   if (cleanName.startsWith('/storage/')) return `${API_BASE_URL}${cleanName}`;
   return `${API_BASE_URL}/storage/imagenes/${fileName}`;
};

const formatDate = (dateString: string): string => {
   if (!dateString) return 'Fecha no disponible';
   return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   });
};

// =============================================
// COMPONENTE
// =============================================
const PublicacionesContent: React.FC = () => {
   const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
   const [linksExternos, setLinksExternos] = useState<LinkExterno[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchRecursos = async () => {
         try {
            setLoading(true);
            console.log('🔄 [Publicaciones] Cargando desde ID 35...');
            
            const url = `${API_BASE_URL}/api/v2/institucion/${INSTITUCION_ID}/recursos`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${API_TOKEN}`
            };
            
            const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
            
            if (response.ok) {
               const data = await response.json();
               console.log('✅ Recursos cargados:', {
                  publicaciones: data.upea_publicaciones?.length || 0,
                  links: data.linksExternoInterno?.length || 0
               });
               
               setPublicaciones(data.upea_publicaciones || []);
               setLinksExternos(data.linksExternoInterno || []);
            } else {
               console.error('Error API:', response.status);
            }
            
            setLoading(false);
         } catch (error) {
            console.error('Error crítico:', error);
            setLoading(false);
         }
      };

      fetchRecursos();
   }, []);

   if (loading) {
      return (
         <>
            <HeaderOne style_2={true} />
            <Breadcrumb title="Publicaciones" sub_title="Publicaciones" />
            <section className="publicaciones-area pd-top-120 pd-bottom-90">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">Cargando publicaciones...</p>
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
         <HeaderOne style_2={true} />
         <Breadcrumb title="Publicaciones" sub_title="Publicaciones" />
         
         <section className="publicaciones-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center mb-5">
                  <div className="col-lg-8 text-center">
                     <h6 className="sub-title" style={{ color: '#FD1C0A', fontWeight: 600 }}>
                        <i className="fa fa-book me-2"></i>RECURSOS Y PUBLICACIONES
                     </h6>
                     <h2 className="title" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Publicaciones de Sociología
                     </h2>
                  </div>
               </div>

               {linksExternos.length > 0 && (
                  <div className="mb-5">
                     <h3 className="mb-4" style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: '#FD1C0A', 
                        borderBottom: '3px solid #FD1C0A', 
                        paddingBottom: '10px' 
                     }}>
                        <i className="fa fa-external-link me-2"></i>Enlaces de Interés
                     </h3>
                     <div className="row g-4">
                        {linksExternos.map((link) => (
                           <div key={link.id_link} className="col-lg-4 col-md-6">
                              <a 
                                 href={link.url_link.trim()}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="card h-100"
                                 style={{ 
                                    borderRadius: '12px', 
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid #e0e0e0',
                                    textDecoration: 'none',
                                    transition: 'transform 0.3s ease'
                                 }}
                                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                 <div style={{ 
                                    width: '100%', 
                                    height: '150px', 
                                    background: '#f8f9fa', 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px'
                                 }}>
                                    <img
                                       src={buildImageUrl(link.imagen)}
                                       alt={link.nombre}
                                       style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                       onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ288L3RleHQ+PC9zdmc+';
                                       }}
                                    />
                                 </div>
                                 <div className="card-body p-4 text-center">
                                    <h5 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#212529', marginBottom: '0.5rem' }}>
                                       {link.nombre}
                                    </h5>
                                    <span style={{ 
                                       fontSize: '0.85rem', 
                                       color: '#FD1C0A',
                                       background: '#fff3cd',
                                       padding: '4px 12px',
                                       borderRadius: '4px',
                                       fontWeight: 600
                                    }}>
                                       {link.tipo}
                                    </span>
                                 </div>
                              </a>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {publicaciones.length > 0 ? (
                  <div>
                     <h3 className="mb-4" style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: '#FAB265', 
                        borderBottom: '3px solid #FAB265', 
                        paddingBottom: '10px' 
                     }}>
                        <i className="fa fa-file-text me-2"></i>Publicaciones ({publicaciones.length})
                     </h3>
                     <div className="row g-4">
                        {publicaciones.map((pub, index) => (
                           <div key={index} className="col-lg-4 col-md-6">
                              <article className="card h-100" style={{
                                 borderRadius: '12px',
                                 overflow: 'hidden',
                                 boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                 background: '#fff',
                                 border: '1px solid #e0e0e0',
                                 transition: 'transform 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                 {pub.imagen && (
                                    <div style={{ width: '100%', height: '200px', background: '#f8f9fa', overflow: 'hidden' }}>
                                       <img
                                          src={buildImageUrl(pub.imagen)}
                                          alt={pub.titulo || 'Publicación'}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                       />
                                    </div>
                                 )}
                                 <div className="card-body p-4">
                                    <h5 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#212529' }}>
                                       {pub.titulo || 'Sin título'}
                                    </h5>
                                    {pub.descripcion && (
                                       <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '1rem', lineHeight: '1.5' }}
                                          dangerouslySetInnerHTML={{ 
                                             __html: pub.descripcion.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                                          }}
                                       />
                                    )}
                                    {pub.fecha && (
                                       <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '1rem' }}>
                                          <i className="fa fa-calendar me-2" style={{ color: '#FD1C0A' }}></i>
                                          {formatDate(pub.fecha)}
                                       </div>
                                    )}
                                 </div>
                              </article>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <div className="alert alert-info text-center p-5" style={{ borderRadius: '12px', background: '#d1ecf1', border: '1px solid #bee5eb' }}>
                           <i className="fa fa-book fa-3x mb-3" style={{ color: '#17a2b8' }}></i>
                           <h5 className="text-info mb-3">No hay publicaciones disponibles</h5>
                           <p className="mb-0 text-muted">Las publicaciones de Sociología se mostrarán aquí cuando estén disponibles.</p>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </section>
         
         <FooterOne />
      </>
   );
};

export default PublicacionesContent;