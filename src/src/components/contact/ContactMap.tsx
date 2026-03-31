"use client";
import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://apiadministrador.upea.bo';
const API_TOKEN = '130143e7a5de4f3524cae21a8f333b85e82a9ac037f111d9d1fbad23edecccc1';
const INSTITUCION_ID = "35";

const ContactMap = () => {
   const [mapUrl, setMapUrl] = useState<string>('');
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchMap = async () => {
         try {
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${API_TOKEN}`
            };
            
            const response = await fetch(
               `${API_BASE_URL}/api/v2/institucionesPrincipal/${INSTITUCION_ID}`,
               { method: 'GET', headers }
            );
            
            if (response.ok) {
               const result = await response.json();
               const institucionData = result?.Descripcion || result;
               
               // Limpiar URL de espacios en blanco
               const cleanMapUrl = institucionData.institucion_api_google_map?.trim() || '';
               setMapUrl(cleanMapUrl);
            }
            
            setLoading(false);
         } catch (error) {
            console.error('Error loading map:', error);
            setLoading(false);
         }
      };

      fetchMap();
   }, []);

   if (loading) {
      return (
         <div className="contact-g-map">
            <div className="text-center p-5">
               <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
               </div>
               <p className="mt-3">Cargando mapa...</p>
            </div>
         </div>
      );
   }

   if (!mapUrl) {
      return (
         <div className="contact-g-map">
            <div className="alert alert-info text-center p-5">
               <i className="fa fa-map-marker me-2"></i>
               Mapa de ubicación no disponible
            </div>
         </div>
      );
   }

   return (
      <div className="contact-g-map">
         <iframe 
            src={mapUrl}
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Sociología UPEA"
         />
      </div>
   );
};

export default ContactMap;