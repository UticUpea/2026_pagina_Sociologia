import Image from "next/image"
import Link from "next/link"

import bannerThumb from "@/assets/img/banner/3.png"

const Banner = () => {
   return (
      <div className="banner-area banner-area-3 bg-black">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-lg-5 col-md-10">
                  <div className="thumb b-animate-thumb">
                     <Image src={bannerThumb} alt="img" />
                  </div>
               </div>
               <div className="col-lg-7 align-self-center mt-5 mt-lg-0">
                  <div className="banner-inner style-white text-center text-lg-left">
                     <h6 className="b-animate-1 banner-btn">PLACE TO GROW</h6>
                     <h1 className="b-animate-2 title">We creating leaders for tomorrow</h1>
                     <Link className="ed-btn btn-base b-animate-3 btn-gap" href="/blog" style={{color:"#fff"}}>Get A Quote</Link>
                     <Link className="ed-btn btn-border-white b-animate-3" href="/blog">Read More</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Banner
