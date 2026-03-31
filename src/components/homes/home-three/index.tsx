import HeaderTwo from "@/layouts/headers/HeaderTwo"
import Banner from "./Banner"
import IntroArea from "./IntroArea"
import About from "./About"
import CourseArea from "./CourseArea"
import AboutTwo from "./AboutTwo"
import Counter from "./Counter"
import AboutThree from "./AboutThree"
import Testimonial from "./Testimonial"
import Team from "./Team"
import Faq from "./Faq"
import Brand from "./Brand"
import Blog from "../home-two/Blog"
import FooterTwo from "@/layouts/footers/FooterTwo"

import "../../../../public/assets/css/color.css"

const HomeThree = () => {
  return (
    <div className="home-3">
      <HeaderTwo />
      <Banner />
      <IntroArea />
      <About />
      <CourseArea />
      <AboutTwo />
      <Counter />
      <AboutThree />
      <Testimonial style={false} />
      <Team style={false} />
      <Faq />
      <Brand />
      <Blog style={true} />
      <FooterTwo />
    </div>
  )
}

export default HomeThree
