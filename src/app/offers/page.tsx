import type { Metadata } from "next";
import OfferArea from '@/components/offers/OfferArea';

export const metadata: Metadata = {
   title: 'Ofertas Académicas - Sociología UPEA',
   description: 'Ofertas académicas de la Carrera de Sociología',
};

export default function OffersPage() {
   return <OfferArea />;
}