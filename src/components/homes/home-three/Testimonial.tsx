"use client"
import testi_data from "@/data/TestimonialData"
import Image from "next/image"
import Slider from "react-slick"

const setting = {
   infinite: true,
   speed: 1500,
   slidesToShow: 2,
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
            slidesToShow: 2
         }
      },
      {
         breakpoint: 600,
         settings: {
            slidesToShow: 1
         }
      },
   ]
}

const Testimonial = ({ style }: any) => {
   return (
      <div className={`testimonial-area ${style ? "pd-top-110 pd-bottom-120" : "pd-top-90 pd-bottom-110"}`}>
         {/* <div className="container">
            <Slider {...setting} className="testimonial-slider-3">
               {testi_data.filter((items) => items.page === "home_3").map((item) => (
                  <div key={item.id} className="item">
                     <div className="single-testimonial-inner">
                        <div className="media testimonial-author mb-4">
                           <div className="media-left">
                              <Image src={item.author_img} alt="img" />
                              <i className="fa fa-quote-left"></i>
                           </div>
                           <div className="media-body align-self-center">
                              <h6>{item.author_name}</h6>
                              <p>{item.designation}</p>
                           </div>
                        </div>
                        <span className="testimonial-quote"><i className="fa fa-quote-left"></i></span>
                        <p className="mb-0">{item.desc}DFGHKELBaaAAAAAAAAAAAAA</p>
                     </div>
                  </div>
               ))}
            </Slider>
         </div> */}
      </div>
   )
}

export default Testimonial
