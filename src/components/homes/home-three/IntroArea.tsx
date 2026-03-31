"use client"
import intro_data from "@/data/IntroData"
import Image from "next/image"
import Link from "next/link"
import Slider from "react-slick"

const setting = {
   infinite: true,
   speed: 1500,
   slidesToShow: 4,
   slidesToScroll: 1,
   centerMode: true,
   centerPadding: '0',
   dots: false,
   arrows: false,
   autoplay: false,
   autoplaySpeed: 1500,
   responsive: [
      {
         breakpoint: 1200,
         settings: {
            slidesToShow: 3
         }
      },
      {
         breakpoint: 600,
         settings: {
            slidesToShow: 2
         }
      },
      {
         breakpoint: 480,
         settings: {
            slidesToShow: 1
         }
      }
   ]
}

const IntroArea = () => {
   return (
      <div className="intro-area intro-area--top">
         <div className="container">
            <Slider {...setting} className="intro-slider">
               {intro_data.filter((items) => items.page === "home_3").map((item) => (
                  <div key={item.id} className="item">
                     <div className={`single-intro-inner style-white ${item.item_bg} text-center`}>
                        <div className="thumb">
                           <Image src={item.icon} alt="img" />
                        </div>
                        <div className="details">
                           <h5>{item.title}</h5>
                           <Link className="read-more" href="/blog-details"><i className="fa fa-angle-right"></i></Link>
                        </div>
                     </div>
                  </div>
               ))}
            </Slider>
         </div>
      </div>
   )
}

export default IntroArea
