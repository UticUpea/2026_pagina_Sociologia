import Breadcrumb from "@/components/common/Breadcrumb"
import HeaderOne from "@/layouts/headers/HeaderOne"
import TeamArea from "./TeamArea"
import FooterOne from "@/layouts/footers/FooterOne"
import Counter from "@/components/homes/home-one/Counter"
/* import Testimonial from "@/components/homes/home-three/Testimonial" */

const Team = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Instructor" sub_title="Instructor" />
         <TeamArea />
         {/* <Counter />
         <Testimonial /> */}
         <FooterOne />
      </>
   )
}

export default Team
