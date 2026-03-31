import Gallery from "@/components/inner-pages/gallery";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Sociología",
};
const page = () => {
   return (
      <Wrapper>
         <Gallery />
      </Wrapper>
   )
}

export default page