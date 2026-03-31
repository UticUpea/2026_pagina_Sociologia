/* NO LO USAMOS */
import Image, { StaticImageData } from "next/image";

import rcThumb_1 from "@/assets/img/widget/1.png";
import rcThumb_2 from "@/assets/img/widget/2.png";
import rcThumb_3 from "@/assets/img/widget/3.png";
import Link from "next/link";

interface DataType {
   id: number;
   thumb: StaticImageData;
   title: string;
   date: string;
}[];

const rc_data: DataType[] = [
   {
      id: 1,
      thumb: rcThumb_1,
      title: "Integer at faucibus urna. Nullam condtum",
      date: "11 October"
   },
   {
      id: 2,
      thumb: rcThumb_2,
      title: "Custom Platform for an Audit Insurance",
      date: "15 October"
   },
   {
      id: 3,
      thumb: rcThumb_3,
      title: "Famous app Developers and Designer",
      date: "20 October"
   },
];

const RcPost = () => {
   return (
      <div className="widget widget-recent-post">
         {/* <h4 className="widget-title">Recent News</h4> */}
         {/* <ul>
            {rc_data.map((item) => (
               <li key={item.id}>
                  <div className="media">
                     <div className="media-left">
                        <Image src={item.thumb} alt="blog" />
                     </div>
                     <div className="media-body align-self-center">
                        <h5 className="title"><Link href="/single-blog">{item.title}</Link></h5>
                        <div className="post-info"><i className="fa fa-calendar"></i><span>{item.date}</span></div>
                     </div>
                  </div>
               </li>
            ))}
         </ul> */}
      </div>
   )
}

export default RcPost
