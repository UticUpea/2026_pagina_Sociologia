import type { Metadata } from "next";
import ServiceArea from '@/components/services/ServiceArea';

export const metadata: Metadata = {
   title: 'Servicios de Carrera - Sociología UPEA',
   description: 'Servicios disponibles para estudiantes de Sociología',
};

export default function ServicesPage() {
   return <ServiceArea />;
}