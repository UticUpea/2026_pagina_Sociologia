import Breadcrumb from "@/components/common/Breadcrumb"
import FooterOne from "@/layouts/footers/FooterOne"
import HeaderOne from "@/layouts/headers/HeaderOne"
import PricingArea from "./PricingArea"

const Pricing = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Pricing" sub_title="Pricing" />
         <PricingArea />
         <FooterOne />
      </>
   )
}

export default Pricing
