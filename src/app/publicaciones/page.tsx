import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Publicaciones - Sociología UPEA",
   description: "Publicaciones y recursos de la Carrera de Sociología"
};

// Componente cliente que consume la API
import PublicacionesContent from "../../components/recursos/PublicacionesContent";

const PublicacionesPage = () => {
   return (
      <Wrapper>
         <PublicacionesContent />
      </Wrapper>
   );
};

export default PublicacionesPage;