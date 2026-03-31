import Image, { StaticImageData } from "next/image";

import icon_1 from "@/assets/img/icon/28.png"
import icon_2 from "@/assets/img/icon/29.png"
import icon_3 from "@/assets/img/icon/30.png"
import Count from "@/components/common/Count";

interface DataType {
   id: number;
   icon: StaticImageData;
   count: number;
   title: string;
}[];

const counter_data: DataType[] = [
   {
      id: 1,
      icon: icon_1,
      count: 1200,
      title: "Learners & counting"
   },
   {
      id: 2,
      icon: icon_2,
      count: 320,
      title: "Total courses"
   },
   {
      id: 3,
      icon: icon_3,
      count: 1340,
      title: "Successful students"
   },
];

const Counter = () => {
   return (
      <div className="counter-area mg-top--50">
         <div className="container">
            <div className="row">
               {counter_data.map((item) => (
                  <div key={item.id} className="col-lg-4">
                     <div className="single-list-inner style-box-bg">
                        <div className="media">
                           <div className="media-left">
                              <Image src={item.icon} alt="img" />
                           </div>
                           <div className="media-body align-self-center">
                              <h5><span className="counter"><Count number={item.count} /></span>+</h5>
                              <p>{item.title}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Counter
