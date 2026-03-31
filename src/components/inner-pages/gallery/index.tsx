import Breadcrumb from "@/components/common/Breadcrumb"
import HeaderOne from "@/layouts/headers/HeaderOne"
import FooterOne from "@/layouts/footers/FooterOne"
/* import Testimonial from "@/components/homes/home-three/Testimonial" */
import GalleryArea from "./GalleryArea"

const Gallery = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Galeria" sub_title="Galeria" />
         <GalleryArea />
         {/* <Counter /> */}
         {/* <Testimonial /> */}
         <FooterOne />
      </>
   )
}

export default Gallery
