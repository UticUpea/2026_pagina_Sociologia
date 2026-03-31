import Breadcrumb from '@/components/common/Breadcrumb'
import FooterOne from '@/layouts/footers/FooterOne'
import HeaderOne from '@/layouts/headers/HeaderOne'
import CourseArea from './CourseArea'

const Course = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Gaceta" sub_title="Gaceta" />
         <CourseArea />
         <FooterOne />
      </>
   )
}

export default Course
