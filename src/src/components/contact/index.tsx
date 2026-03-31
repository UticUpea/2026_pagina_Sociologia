/* si lo usamos */
import HeaderOne from "@/layouts/headers/HeaderOne"
import Breadcrumb from "../common/Breadcrumb"
import FooterOne from "@/layouts/footers/FooterOne"
import ContactArea from "./ContactArea"
import ContactFormArea from "./ContactFormArea"
import ContactMap from "./ContactMap"

const Contact = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Contáctos" sub_title="Contáctos" />
         <ContactArea />
         <ContactFormArea />
         <ContactMap />
         <FooterOne />
      </>
   )
}

export default Contact
