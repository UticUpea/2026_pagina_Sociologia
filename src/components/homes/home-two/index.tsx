import HeaderOne from "@/layouts/headers/HeaderOne"
import Banner from "../home-one/Banner"
import IntroArea from "../home-one/IntroArea"
import About from "./About"
import CourseArea from "../home-three/CourseArea"
import SpecialityArea from "./SpecialityArea"
import PricingArea from "@/components/inner-pages/pricing/PricingArea"
import Brand from "../home-three/Brand"
import Event from "./Event"
import Testimonial from "../home-three/Testimonial"
import Blog from "./Blog"
import FooterTwo from "@/layouts/footers/FooterTwo"

const HomeTwo = () => {
  return (
    <>
      <HeaderOne style={true} />
      <Banner />
      <IntroArea />
      <About style={false} />
      <CourseArea />
      <SpecialityArea />
      <PricingArea />
      <Brand />
      <Event />
      <Testimonial />
      <Blog style={false} />
      <FooterTwo />
    </>
  )
}

export default HomeTwo
