import React from 'react'
import EventArea from './EventArea'
import Breadcrumb from '@/components/common/Breadcrumb'
import HeaderOne from '@/layouts/headers/HeaderOne'
import FooterOne from '@/layouts/footers/FooterOne'

const Event = () => {
   return (
      <>
         <HeaderOne style_2={true} />
         <Breadcrumb title="Event" sub_title="Event" />
         <EventArea />
         <FooterOne />
      </>
   )
}

export default Event
