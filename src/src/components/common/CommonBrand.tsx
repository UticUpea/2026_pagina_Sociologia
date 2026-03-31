/* NO LO USAMOS */
"use client"
import Image, { StaticImageData } from "next/image"
import Slider from "react-slick"

import brandImg_1 from "@/assets/img/institute/1.png"
import brandImg_2 from "@/assets/img/institute/2.png"
import brandImg_3 from "@/assets/img/institute/3.png"
import brandImg_4 from "@/assets/img/institute/4.png"
import brandImg_5 from "@/assets/img/institute/5.png"

const brand_data: StaticImageData[] = [brandImg_1, brandImg_2, brandImg_3, brandImg_4, brandImg_5, brandImg_3];

const setting = {
   dots: false,
   arrows: false,
   centerPadding: '0px',
   slidesToShow: 5,
   slidesToScroll: 1,
   autoplay: false,
   autoplaySpeed: 1500,
   responsive: [
      {
         breakpoint: 1200,
         settings: {
            slidesToShow: 5
         }
      },
      {
         breakpoint: 992,
         settings: {
            slidesToShow: 3
         }
      },
      {
         breakpoint: 576,
         settings: {
            slidesToShow: 2
         }
      }
   ]
}

const CommonBrand = () => {
   return (
      <Slider {...setting} className="institute-slider">
         {brand_data.map((brand, i) => (
            <div key={i} className="item"><Image src={brand} alt="" /></div>
         ))}
      </Slider>
   )
}

export default CommonBrand
