import BlogGrid from "@/components/blogs/blog-grid";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Sociología",
};
const page = () => {
   return (
      <Wrapper>
         <BlogGrid />
      </Wrapper>
   )
}

export default page