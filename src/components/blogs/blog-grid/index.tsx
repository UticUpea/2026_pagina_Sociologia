/* SI LO USAMOS */
import Breadcrumb from "@/components/common/Breadcrumb"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"
import BlogGridArea from "./BlogGridArea"

const BlogGrid = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Cursos" sub_title="Cursos" />
         <BlogGridArea />
         <FooterOne />
      </>
   )
}

export default BlogGrid
