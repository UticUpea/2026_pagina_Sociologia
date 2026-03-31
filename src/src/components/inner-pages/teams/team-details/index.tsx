import Breadcrumb from "@/components/common/Breadcrumb"
import HeaderOne from "@/layouts/headers/HeaderOne"
import TeamDetailsArea from "./TeamDetailsArea"
import FooterOne from "@/layouts/footers/FooterOne"

const TeamDetails = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Instructor Details" sub_title="Instructor Details" />
         <TeamDetailsArea />
         <FooterOne />
      </>
   )
}

export default TeamDetails
