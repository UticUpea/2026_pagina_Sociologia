"use client";
import React, { useEffect, useState } from 'react';
import HeaderOne from "@/layouts/headers/HeaderOne";
import Breadcrumb from "@/components/common/Breadcrumb";
import FooterOne from "@/layouts/footers/FooterOne";

// =============================================
// INTERFACES
// =============================================
interface InstitucionData {
   institucion_nombre: string;
   institucion_historia: string;
   institucion_mision: string;
   institucion_vision: string;
   institucion_objetivos: string;
   institucion_sobre_ins: string;
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
const cleanHtml = (html: string | null | undefined): string => {
   if (!html) return '';
   return html.replace(/<[^>]*>/g, '');
};

// =============================================
// COMPONENTE
// =============================================
const About: React.FC = () => {
   const [data, setData] = useState<InstitucionData | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [activeTab, setActiveTab] = useState<string>('historia');

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            console.log('🔄 [About] Cargando datos de Sociología...');
            
            const url = `${API_BASE_URL}/api/v2/institucionesPrincipal/${INSTITUCION_ID}`;
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${API_TOKEN}`
            };
            
            const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
            
            if (response.ok) {
               const result = await response.json();
               const institucionData = result?.Descripcion || result;
               
               console.log('✅ Datos cargados:', {
                  nombre: institucionData.institucion_nombre,
                  tieneHistoria: !!institucionData.institucion_historia
               });
               
               setData(institucionData);
            } else {
               console.error('Error API:', response.status);
            }
            
            setLoading(false);
         } catch (error) {
            console.error('Error crítico:', error);
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   if (loading) {
      return (
         <>
            <HeaderOne style_2={true} />
            <Breadcrumb title="Historia" sub_title="Historia" />
            <section className="about-area pd-top-120 pd-bottom-90">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                           <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">Cargando información...</p>
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
         <Breadcrumb title="Historia" sub_title="Historia" />
         
         <section className="about-area pd-top-120 pd-bottom-90">
            <div className="container">
               <div className="row justify-content-center mb-5">
                  <div className="col-lg-8 text-center">
                     <h6 className="sub-title" style={{ color: '#FD1C0A', fontWeight: 600 }}>
                        <i className="fa fa-book me-2"></i>INFORMACIÓN DE LA CARRERA
                     </h6>
                     <h2 className="title" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        {data?.institucion_nombre || 'SOCIOLOGÍA'}
                     </h2>
                  </div>
               </div>

               {/* Tabs */}
               <div className="row justify-content-center mb-5">
                  <div className="col-lg-8">
                     <div className="nav nav-tabs justify-content-center" style={{ borderBottom: 'none' }}>
                        <button
                           onClick={() => setActiveTab('historia')}
                           className={`nav-link px-4 py-2 me-2 ${activeTab === 'historia' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'historia' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'historia' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Historia
                        </button>
                        <button
                           onClick={() => setActiveTab('mision')}
                           className={`nav-link px-4 py-2 me-2 ${activeTab === 'mision' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'mision' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'mision' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Misión
                        </button>
                        <button
                           onClick={() => setActiveTab('vision')}
                           className={`nav-link px-4 py-2 me-2 ${activeTab === 'vision' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'vision' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'vision' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Visión
                        </button>
                        <button
                           onClick={() => setActiveTab('objetivos')}
                           className={`nav-link px-4 py-2 ${activeTab === 'objetivos' ? 'active' : ''}`}
                           style={{
                              background: activeTab === 'objetivos' ? '#FD1C0A' : '#f8f9fa',
                              color: activeTab === 'objetivos' ? '#fff' : '#212529',
                              border: 'none',
                              borderRadius: '8px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease'
                           }}
                        >
                           Objetivos
                        </button>
                     </div>
                  </div>
               </div>

               {/* Contenido */}
               <div className="row align-items-center">
                  <div className="col-lg-6 mb-4 mb-lg-0">
                     <div className="about-thumb" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <img
                           src="/assets/img/about/historia.jpg"
                           alt="Historia"
                           style={{ width: '100%', height: 'auto' }}
                           onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4=';
                           }}
                        />
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div className="about-content">
                        <h3 className="mb-4" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>
                           Carrera de Sociología
                        </h3>
                        
                        {activeTab === 'historia' && (
                           <div className="content-section">
                              <div 
                                 style={{ fontSize: '1rem', color: '#6c757d', lineHeight: '1.8' }}
                                 dangerouslySetInnerHTML={{ 
                                    __html: data?.institucion_historia || '<p>Cargando historia...</p>' 
                                 }}
                              />
                           </div>
                        )}
                        
                        {activeTab === 'mision' && (
                           <div className="content-section">
                              <div 
                                 style={{ fontSize: '1rem', color: '#6c757d', lineHeight: '1.8' }}
                                 dangerouslySetInnerHTML={{ 
                                    __html: data?.institucion_mision || '<p>Cargando misión...</p>' 
                                 }}
                              />
                           </div>
                        )}
                        
                        {activeTab === 'vision' && (
                           <div className="content-section">
                              <div 
                                 style={{ fontSize: '1rem', color: '#6c757d', lineHeight: '1.8' }}
                                 dangerouslySetInnerHTML={{ 
                                    __html: data?.institucion_vision || '<p>Cargando visión...</p>' 
                                 }}
                              />
                           </div>
                        )}
                        
                        {activeTab === 'objetivos' && (
                           <div className="content-section">
                              <div 
                                 style={{ fontSize: '1rem', color: '#6c757d', lineHeight: '1.8' }}
                                 dangerouslySetInnerHTML={{ 
                                    __html: data?.institucion_objetivos || data?.institucion_sobre_ins || '<p>Cargando objetivos...</p>' 
                                 }}
                              />
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </section>
         
         <FooterOne />
      </>
   );
};

export default About;