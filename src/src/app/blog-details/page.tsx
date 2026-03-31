import BlogDetails from "@/components/blogs/blog-details";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Sociología",
};
const page = () => {
   return (
      <Wrapper>
         <BlogDetails />
      </Wrapper>
   )
}

export default page