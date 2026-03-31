/* no lo usamos */
import Image from "next/image"
import Link from "next/link";

import commentThumb_1 from "@/assets/img/team/1.png";
import commentThumb_2 from "@/assets/img/team/2.png";
import commentThumb_3 from "@/assets/img/team/3.png";

const BlogComment = () => {
   return (
      <div className="blog-comment">
         {/* <div className="section-title style-small">
            <h3>Comments</h3>
         </div> */}
         {/* <div className="media">
            <Link href="#">
               <Image src={commentThumb_1} alt="comment" />
            </Link>
            <div className="media-body">
               <h5>
                  <Link href="#">Aaron Holmes</Link>
                  <span className="date">25 July 2020</span>
               </h5>
               <p>Proin ac quam et lectus vestibulum blandit. Nunc maximus nibh at placerat tincidunt. Nam sem lacus, ornare non ante sed, ultricies</p>
               <Link href="#">REPLY</Link>
            </div>
         </div> */}
         {/* <div className="media nesting">
            <Link href="#">
               <Image src={commentThumb_2} alt="comment" />
            </Link>
            <div className="media-body">
               <h5>
                  <Link href="#">Aaron Holmes</Link>
                  <span className="date">25 July 2020</span>
               </h5>
               <p>Proin ac quam et lectus vestibulum blandit. Nunc maximus nibh at placerat tincidunt. Nam sem lacus</p>
               <Link href="#">REPLY</Link>
            </div>
         </div> */}
         {/* <div className="media border-0">
            <Link href="#">
               <Image src={commentThumb_3} alt="comment" />
            </Link>
            <div className="media-body">
               <h5>
                  <Link href="#">Aaron Holmes</Link>
                  <span className="date">25 July 2020</span>
               </h5>
               <p>Proin ac quam et lectus vestibulum blandit. Nunc maximus nibh at placerat tincidunt. Nam sem lacus, ornare non ante sed, ultricies</p>
               <Link href="#">REPLY</Link>
            </div>
         </div> */}
      </div>
   )
}

export default BlogComment
