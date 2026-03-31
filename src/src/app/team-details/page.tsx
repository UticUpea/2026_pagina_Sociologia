import TeamDetails from "@/components/inner-pages/teams/team-details";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Sociología",
};
const page = () => {
   return (
      <Wrapper>
         <TeamDetails />
      </Wrapper>
   )
}

export default page