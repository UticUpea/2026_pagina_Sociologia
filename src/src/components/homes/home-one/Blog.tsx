/*Si usa REVISAR import blog_data from "@/data/BlogData"; */
import Image from "next/image";
import Link from "next/link";

interface DataType {
   id: number;
   date: JSX.Element;
   title: string;
}[];

const blog_sidebar: DataType[] = [
   {
      id: 1,
      date: (<><span>JAN elba</span> <br />20</>),
      title: "Duis pretium gravida enim maximus"
   },
   {
      id: 2,
      date: (<><span>JAN</span> <br />28</>),
      title: "Maecenas interdum lorem eleifend"
   },
   {
      id: 3,
      date: (<><span>FEB</span> <br /> 02</>),
      title: "Nunc scelerisque tincidunt elit."
   },
];

const Blog = () => {
   /* return (
      <div className="blog-area pd-top-80 pd-bottom-90">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7">
                  <div className="section-title text-center">
                     <h6 className="sub-title double-line">Latest News</h6>
                     <h2 className="title">Our Insights & Articles</h2>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-lg-4">
                  <ul className="single-blog-list-wrap mb-5 mb-lg-0">
                     {blog_sidebar.map((sidebar) => (
                        <li key={sidebar.id}>
                           <div className="media single-blog-list-inner">
                              <div className="media-left date">
                                 {sidebar.date}
                              </div>
                              <div className="media-body details">
                                 <ul className="blog-meta">
                                    <li><i className="fa fa-user"></i> BY ADMIN</li>
                                    <li><i className="fa fa-folder-open-o"></i> Air transport</li>
                                 </ul>
                                 <h5><Link href="/blog-details">{sidebar.title}</Link></h5>
                              </div>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="col-lg-8">
                  <div className="row justify-content-center">
                     {blog_data.filter((items) => items.page === "home_1").map((item) => (
                        <div key={item.id} className="col-md-6">
                           <div className="single-blog-inner">
                              <div className="thumb">
                                 <Image src={item.thumb} alt="img" />
                                 <span className="date">{item.date}</span>
                              </div>
                              <div className="details">
                                 <ul className="blog-meta">
                                    <li><i className="fa fa-user"></i> BY ADMIN</li>
                                    <li><i className="fa fa-folder-open-o"></i> Air transport</li>
                                 </ul>
                                 <h5><Link href="/blog-details">{item.title}</Link></h5>
                                 <Link className="read-more-text" href="/blog-details">READ MORE <i className="fa fa-angle-right"></i></Link>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   ) */
}

export default Blog
