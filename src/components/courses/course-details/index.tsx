import Breadcrumb from "@/components/common/Breadcrumb"
import FooterOne from "@/layouts/footers/FooterOne"
import HeaderOne from "@/layouts/headers/HeaderOne"
import CourseDetailsArea from "./CourseDetailsArea"

const CourseDetails = () => {
  return (
   <>
      <HeaderOne style_2={true} />
      <Breadcrumb title="Enlaces" sub_title="Enlaces" />
      <CourseDetailsArea />
      <FooterOne />
   </>
  )
}

export default CourseDetails
