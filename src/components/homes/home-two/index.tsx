import HeaderOne from "@/layouts/headers/HeaderOne"
import Banner from "../home-one/Banner"
import IntroArea from "../home-one/IntroArea"

import CourseArea from "../home-three/CourseArea"
import SpecialityArea from "./SpecialityArea"
import PricingArea from "@/components/inner-pages/pricing/PricingArea"
import Brand from "../home-three/Brand"

import Testimonial from "../home-three/Testimonial"

import FooterTwo from "@/layouts/footers/FooterTwo"

const HomeTwo = () => {
  return (
    <>
      <HeaderOne style={true} />
      <Banner />
      <IntroArea />
     
      <CourseArea />
      <SpecialityArea />
      <PricingArea />
      <Brand />
   
      <Testimonial />
     
      <FooterTwo />
    </>
  )
}

export default HomeTwo
