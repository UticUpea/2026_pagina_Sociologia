/* no lo usamos */
import Link from "next/link";

const category: string[] = ["Tempor lorem interdum", "Auctor mattis lacus", "Dolor proin", "Pharetra amet"];

const Catagory = () => {
   return (
      <div className="widget widget_catagory">
         {/* <h4 className="widget-title">Catagory</h4>
         <ul className="catagory-items">
            {category.map((category, i) => (
               <li key={i}><Link href="#">{category}<i className="fa fa-caret-right"></i></Link></li>
            ))}
         </ul> */}
      </div>
   )
}

export default Catagory
