import Breadcrumb from "@/components/common/Breadcrumb"
import HeaderOne from "@/layouts/headers/HeaderOne"
import EventDetailsArea from "./EventDetailsArea"
import FooterOne from "@/layouts/footers/FooterOne"

const EventDetails = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Event Single" sub_title="Event Single" />
         <EventDetailsArea />
         <FooterOne />
      </>
   )
}

export default EventDetails
