/* revisar */
"use client"

import Image from "next/image"
import Link from "next/link"
import Slider from "react-slick"



const setting = {
   infinite: true,
   speed: 300,
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
         breakpoint: 992,
         settings: {
            slidesToShow: 2
         }
      },
      {
         breakpoint: 500,
         settings: {
            slidesToShow: 1
         }
      }
   ]
}

const Team = () => {
   /* return (
      <div className="team-area pd-top-110">
         <div className="container-fluid pl-4 pr-4">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7">
                  <div className="section-title text-center">
                     <h6 className="sub-title double-line">Meet Our Team</h6>
                     <h2 className="title">Our Creative Team</h2>
                  </div>
               </div>
            </div>
            <Slider {...setting} className="team-slider">
               {team_data.filter((items) => items.page === "home_1").map((item) => (
                  <div key={item.id} className="item">
                     <div className="single-team-inner position-relative">
                        <div className="thumb">
                           <Image src={item.thumb} alt="img" />
                           <div className="social-wrap">
                              <div className="social-wrap-inner">
                                 <Link className="social-share" href="#"><i className="fa fa-share-alt"></i></Link>
                                 <ul>
                                    <li><Link href="#"><i className="fa fa-facebook"></i></Link></li>
                                    <li><Link href="#"><i className="fa fa-twitter"></i></Link></li>
                                    <li><Link href="#"><i className="fa fa-pinterest"></i></Link></li>
                                    <li><Link href="#"><i className="fa fa-linkedin"></i></Link></li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                        <div className="details">
                           <h4><Link href="/team-details">Doris Jordan</Link></h4>
                           <span>Design Expert</span>
                        </div>
                     </div>
                  </div>
               ))}
            </Slider>
         </div>
      </div>
   ) */
}

export default Team
