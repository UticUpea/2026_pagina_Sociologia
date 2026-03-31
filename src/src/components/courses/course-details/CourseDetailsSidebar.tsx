/* si lo usamos */
import Image from "next/image"
import Link from "next/link";

import author from "@/assets/img/author/1.png";
import thumb from "@/assets/img/course/1.png";

const tags: JSX.Element[] = [
   (<><i className="fa fa-user"></i><span>Enrolled :</span> 1200 students</>),
   (<><i className="fa fa-clock-o"></i><span>Duration :</span> 2 hours</>),
   (<><i className="fa fa-clipboard"></i><span>Lectures :</span> 8</>),
   (<><i className="fa fa-clone"></i><span>Categories:</span> Technology</>),
   (<><i className="fa fa-tags"></i><span>Tags:</span> Android, JavaScript</>),
   (<><i className="fa fa-clipboard"></i><span>Instructor:</span> Ethan Dean</>),
];
const CourseDetailsSidebar = () => {
   return (
      <div className="col-lg-4">
         <div className="td-sidebar">
            <div className="widget widget_feature">
               <h4 className="widget-title">OTROS ENLACES</h4>
               <div className="price-wrap text-center">
                  <a className="ed-btn btn-base" href="/blog">CONVOCATORIAS</a>
                  <a className="ed-btn btn-base " href="/">PUBLICACIONES</a>
                  <a className="ed-btn btn-base " href="/blog-details">OFERTAS ACADÉMICAS</a>
                  <a className="ed-btn btn-base " href="#">EVENTOS</a>
                  <a className="ed-btn btn-base " href="/blog-grid">CURSOS</a>
               </div>
            </div>
            {/* <div className="widget widget_catagory">
               <h4 className="widget-title">Trending Course</h4>
               <div className="single-course-inner">
                  <div className="thumb">
                     <Image src={thumb} alt="img" />
                  </div>
                  <div className="details">
                     <div className="details-inner">
                        <div className="emt-user">
                           <span className="u-thumb"><Image src={author} alt="img" /></span>
                           <span className="align-self-center">Nancy Reyes</span>
                        </div>
                        <h6><Link href="/course-details">Fox nymphs grab quick-jived waltz. Brick quiz whangs</Link></h6>
                     </div>
                     <div className="emt-course-meta">
                        <div className="row">
                           <div className="col-6">
                              <div className="rating">
                                 <i className="fa fa-star"></i> 4.3
                                 <span>(23)</span>
                              </div>
                           </div>
                           <div className="col-6">
                              <div className="price text-right">
                                 Price: <span>$54.00</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div> */}
         </div>
      </div>
   )
}

export default CourseDetailsSidebar
