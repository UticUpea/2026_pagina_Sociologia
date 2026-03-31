/* SI REVISAR */
import HeaderOne from "@/layouts/headers/HeaderOne"
import Banner from "./Banner"
import IntroArea from "./IntroArea"
import About from "./About"
import Counter from "./Counter"
import WorkArea from "./WorkArea"
import Blog from "./Blog"
import Contact from "./Contact"
import FooterOne from "@/layouts/footers/FooterOne"
import CourseArea from "./CourseArea"
import Testimonial from "./Testimonial"
import Team from "./Team"

const HomeOne = () => {
  return (
    <>
      <HeaderOne style={false} />
      <Banner />
      <IntroArea />
      <About />
      <CourseArea />
      {/* <Counter /> */}
      <WorkArea />
      <Testimonial />
      {/* <Team />
      <Blog />
      <Contact /> */}
      <FooterOne />
    </>
  )
}

export default HomeOne
