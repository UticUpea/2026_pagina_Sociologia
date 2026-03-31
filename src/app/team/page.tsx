import Team from "@/components/inner-pages/teams/team";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Autoridades - Sociología UPEA",
  description: "Autoridades de la Carrera de Sociología - Universidad Pública de El Alto"
};

const page = () => {
  return (
    <Wrapper>
      <Team />
    </Wrapper>
  );
};

export default page;