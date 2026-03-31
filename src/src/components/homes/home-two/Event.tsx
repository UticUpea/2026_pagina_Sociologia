"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import eventThumb from "@/assets/img/other/events.png";

interface User {
   evento_id: number;
   evento_titulo: string;
   evento_imagen: string;
   evento_descripcion: string;
   evento_fecha: string;
   evento_hora: string;
   evento_lugar: string;
   // ✅ Propiedades alternativas por si la API devuelve otros nombres
   id?: number;
   titulo?: string;
   imagen?: string;
   descripcion?: string;
   fecha?: string;
   hora?: string;
   lugar?: string;
}

const Event = () => {
   // Función para limpiar HTML
   const cleanHtml = (html: string) => {
      if (!html) return '';
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
   };

   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            setLoading(true);
            
            // ✅ CONSUMIR TU API ROUTE (proxy seguro)
            // 🔁 AJUSTA este path según el endpoint real de tu nueva API para eventos
            // Posibles opciones:
            // - "institucion/35/gacetaEventos" ← Eventos/Gaceta (Carrera Sociología)
            const path = "institucion/35/gacetaEventos";
            
            console.log('🔄 Fetching eventos path:', path);
            
            const response = await fetch(`/api/institucion?path=${encodeURIComponent(path)}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
               },
               cache: "no-store",
            });

            console.log('📡 Status eventos:', response.status);

            if (!response.ok) {
               if (response.status === 404) {
                  setUsers([]);
                  setError(null);
                  return;
               }
               const errorData = await response.json().catch(() => ({}));
               console.error('❌ Error del servicio:', errorData);
               throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Datos de eventos recibidos:', data);
            
            // 🔁 Ajusta según la estructura real de tu respuesta
            const eventos = Array.isArray(data) 
               ? data 
               : data.eventos || data.data || data.gacetaEventos || [];
            
            setUsers(eventos);
            setError(null);
            
         } catch (error: any) {
            console.error("❌ Error fetching eventos:", error);
            setError("No se pudieron cargar los eventos. Intenta más tarde.");
         } finally {
            setLoading(false);
         }
      };

      fetchUsers();
   }, []);

   // ✅ Estado de Carga
   if (loading) {
      return (
         <div className="events-area pd-top-110 pd-bottom-120">
            <div className="container text-center">
               <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Cargando...</span>
               </div>
               <p className="mt-3">Cargando eventos...</p>
            </div>
         </div>
      );
   }

   // ✅ Estado de Error
   if (error) {
      return (
         <div className="events-area pd-top-110 pd-bottom-120">
            <div className="container">
               <div className="alert alert-danger text-center" role="alert">
                  ⚠️ {error}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="events-area pd-top-110 pd-bottom-120">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7 col-md-11">
                  <div className="section-title text-center">
                     <h6 className="sub-title double-line">EVENTOS</h6>
                     <h2 className="title">Eventos Institucionales</h2>
                  </div>
               </div>
            </div>
            <div className="row justify-content-center">
               <div className="col-lg-8">
                  <ul className="single-blog-list-wrap style-white" style={{ backgroundColor: `var(--heading-color)` }}>
                     {users.length > 0 ? (
                        users.map((user) => (
                           <li key={user.evento_id || user.id}>
                              <div className="media single-blog-list-inner style-white">
                                 <div className="media-left date">
                                    {/* ✅ Mostrar fecha formateada o ID como fallback */}
                                    {user.evento_fecha 
                                       ? new Date(user.evento_fecha).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' }).toUpperCase()
                                       : user.evento_id
                                    }
                                 </div>
                                 <div className="media-body details">
                                    <ul className="blog-meta">
                                       <li>
                                          <i className="fa fa-user"></i> 
                                          {user.evento_fecha || user.fecha || 'Sin fecha'}
                                       </li>
                                       <li>
                                          <i className="fa fa-folder-open-o"></i> 
                                          {user.evento_lugar || user.lugar || 'Sin lugar'}
                                       </li>
                                    </ul>
                                    <h5>
                                       <Link href={`/event-details/${user.evento_id || user.id}`}>
                                          {cleanHtml(user.evento_titulo || user.titulo || 'Sin título')}
                                       </Link>
                                    </h5>
                                    {/* ✅ NUEVO DOMINIO DE IMÁGENES */}
                                    <Image 
                                       src={`https://servicioadministrador.upea.bo/Eventos/${user.evento_imagen || user.imagen}`} 
                                       alt={user.evento_titulo || user.titulo || 'Evento'} 
                                       width={500} 
                                       height={300} 
                                       unoptimized 
                                       className="img-fluid mt-2"
                                    />
                                 </div>
                              </div>
                           </li>
                        ))
                     ) : (
                        <li className="text-center py-4">
                           <p className="text-muted mb-0">No hay eventos disponibles.</p>
                        </li>
                     )}
                  </ul>
               </div>
               {/* <div className="col-lg-4 align-self-center">
                  <div className="event-thumb">
                     <Image src={eventThumb} alt="img" />
                  </div>
               </div> */}
            </div>
         </div>
      </div>
   )
}

export default Event;
