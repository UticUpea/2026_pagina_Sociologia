"use client";
import { useState } from "react";
import Link from "next/link";

const MobileMenu = () => {
   const [isOpen, setIsOpen] = useState(false);

   // Cuando NO está abierto → mostrar SOLO botón hamburguesa
   if (!isOpen) {
      return (
         <button
            onClick={() => setIsOpen(true)}
            style={{
               position: 'fixed',
               top: '80px',
               right: '20px',
               background: '#FAB265',
               border: '2px solid #FFFFFF',
               borderRadius: '10px',
               padding: '10px 14px',
               cursor: 'pointer',
               zIndex: 10000,
               display: 'flex',
               flexDirection: 'column',
               gap: '4px',
               boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
         >
            <span style={{ display: 'block', width: '22px', height: '3px', background: '#050504' }} />
            <span style={{ display: 'block', width: '22px', height: '3px', background: '#050504' }} />
            <span style={{ display: 'block', width: '22px', height: '3px', background: '#050504' }} />
         </button>
      );
   }

   // Cuando está abierto → mostrar menú completo
   return (
      <div style={{
         position: 'fixed',
         top: 0,
         left: 0,
         right: 0,
         bottom: 0,
         background: 'linear-gradient(180deg, #050504 0%, #1a0505 50%, #FD1C0A 100%)',
         zIndex: 9999,
         padding: '100px 20px 20px',
         overflowY: 'auto'
      }}>
         {/* Botón cerrar (X) */}
         <button
            onClick={() => setIsOpen(false)}
            style={{
               position: 'fixed',
               top: '85px',
               right: '20px',
               background: '#FD1C0A',
               border: '2px solid #FFFFFF',
               borderRadius: '50%',
               width: '36px',
               height: '36px',
               color: '#FFFFFF',
               fontSize: '20px',
               cursor: 'pointer',
               zIndex: 10000
            }}
         >
            ✕
         </button>
         
         {/* Opciones del menú */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '40px' }}>
            <Link href="/" onClick={() => setIsOpen(false)}
               style={{ color: '#FFFFFF', fontSize: '18px', padding: '15px', background: 'rgba(250,178,101,0.1)', borderRadius: '8px', textDecoration: 'none' }}>
               Inicio
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)}
               style={{ color: '#FFFFFF', fontSize: '18px', padding: '15px', background: 'rgba(250,178,101,0.1)', borderRadius: '8px', textDecoration: 'none' }}>
               Carrera
            </Link>
            <Link href="/blog" onClick={() => setIsOpen(false)}
               style={{ color: '#FFFFFF', fontSize: '18px', padding: '15px', background: 'rgba(250,178,101,0.1)', borderRadius: '8px', textDecoration: 'none' }}>
               Académico
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}
               style={{ color: '#FFFFFF', fontSize: '18px', padding: '15px', background: 'rgba(250,178,101,0.1)', borderRadius: '8px', textDecoration: 'none' }}>
               Contacto
            </Link>
         </div>
      </div>
   );
};

export default MobileMenu;