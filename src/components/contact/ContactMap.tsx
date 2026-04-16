"use client";
import { useEffect, useState } from 'react';

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID!;

// =============================================
// UTILIDADES - Manejo Inteligente de URLs
// =============================================

/**
 * Construye URL completa para recursos (imágenes, mapas, documentos)
 * ✅ URL completa (http/https) → Retorna tal cual (MinIO, Google Maps, externo)
 * ✅ Ruta relativa (/storage/...) → Agrega API_BASE_URL
 * ✅ UUID/filename → Agrega carpeta según tipo
 */
const buildResourceUrl = (
  resourcePath: string | null | undefined,
  type: 'mapa' | 'portada' | 'evento' | 'curso' | 'convocatoria' | 'gaceta' | 'autoridad' = 'mapa'
): string => {
  if (!resourcePath) return '';
  
  const cleanPath = resourcePath.trim();
  
  // ✅ CASO 1: Ya es URL completa (Google Maps, MinIO, YouTube, externo) → NO modificar
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // ✅ CASO 2: Ruta relativa /storage/... → Agregar API_BASE_URL
  if (cleanPath.startsWith('/storage/')) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  
  // ✅ CASO 3: UUID o filename → Construir URL con carpeta según tipo
  const typeFolders: Record<string, string> = {
    mapa: '/storage/mapas/',
    portada: '/storage/imagenes/portadas/',
    evento: '/storage/imagenes/eventos/',
    curso: '/storage/imagenes/cursos/',
    convocatoria: '/storage/imagenes/convocatorias/',
    gaceta: '/storage/imagenes/gacetas/',
    autoridad: '/storage/imagenes/autoridades/'
  };
  
  const folder = typeFolders[type] || '/storage/';
  return `${API_BASE_URL}${folder}${cleanPath}`;
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const ContactMap: React.FC = () => {
   const [mapUrl, setMapUrl] = useState<string>('');
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchMap = async () => {
         try {
            console.log('🔄 [ContactMap] API:', API_BASE_URL);
            console.log('📋 Institución ID:', INSTITUCION_ID);
            
            const headers: HeadersInit = { 
               'Content-Type': 'application/json',
               ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
            };
            
            const response = await fetch(
               `${API_BASE_URL}/api/v2/institucionesPrincipal/${INSTITUCION_ID}`,
               { method: 'GET', headers, cache: 'no-store' }
            );
            
            if (response.ok) {
               const result = await response.json();
               const institucionData = result?.Descripcion || result;
               
               // Limpiar URL de espacios en blanco
               const rawMapUrl = institucionData.institucion_api_google_map?.trim() || '';
               
               // ✅ Construir URL inteligente para el mapa
               const cleanMapUrl = buildResourceUrl(rawMapUrl, 'mapa');
               
               console.log('🗺️ [ContactMap] URL de mapa:', cleanMapUrl);
               setMapUrl(cleanMapUrl);
            } else {
               console.warn(`⚠️ [ContactMap] Error ${response.status}`);
            }
            
            setLoading(false);
         } catch (error) {
            console.error('❌ [ContactMap] Error cargando mapa:', error);
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
               <p className="mt-3 text-muted">
                  Conectando con: {API_BASE_URL}
               </p>
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
            <p className="text-muted small text-center">
               API: {API_BASE_URL} | ID: {INSTITUCION_ID}
            </p>
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