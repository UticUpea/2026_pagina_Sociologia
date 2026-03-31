/* SI LO USAMOS */
import Breadcrumb from "@/components/common/Breadcrumb"
import HeaderOne from "@/layouts/headers/HeaderOne"
import BlogDetailsArea from "./BlogDetailsArea"
import FooterOne from "@/layouts/footers/FooterOne"

const BlogDetails = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Ofertas Académicas" sub_title="Ofertas Académicas" />
         <BlogDetailsArea />
         <FooterOne />
      </>
   )
}

export default BlogDetails
