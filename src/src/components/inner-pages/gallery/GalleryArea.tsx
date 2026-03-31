import gallery_data from "@/data/GalleryData"
import Image from "next/image"
import Link from "next/link"

const GalleryArea = () => {
   return (
      <div className="team-area pd-top-120 pd-bottom-90">
         <div className="container">
            <div className="row justify-content-center" >
               {gallery_data.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                     <div className="single-gallery-inner">
                        <div className="thumb">
                           <Image src={item.thumb} alt="img" />
                        </div>
                        <div className="details">
                           <span>{item.desc}</span>
                           <h4><Link href="#">{item.title}</Link></h4>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default GalleryArea
