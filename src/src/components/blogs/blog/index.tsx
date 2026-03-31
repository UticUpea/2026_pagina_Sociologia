/* si lo usamos */
import Breadcrumb from "@/components/common/Breadcrumb"
import FooterOne from "@/layouts/footers/FooterOne"
import HeaderOne from "@/layouts/headers/HeaderOne"
import BlogArea from "./BlogArea"

const Blog = () => {
  return (
    <>
    <HeaderOne style_2={true} />
    <Breadcrumb title="Convocatorias" sub_title="Convocatorias" />
    <BlogArea />
    <FooterOne />
    </>
  )
}

export default Blog
