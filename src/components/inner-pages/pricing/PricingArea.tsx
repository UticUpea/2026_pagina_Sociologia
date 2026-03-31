import pricing_data from "@/data/PricingData"
import Link from "next/link"

const PricingArea = () => {
   return (
      <div className="pricing-area pd-top-120 pd-bottom-90">
         <div className="container">
            <div className="row justify-content-center">
               {pricing_data.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                     <div className="single-pricing-inner-wrap">
                        <div className="single-pricing-inner">
                           <h6 className="title">{item.title}</h6>
                           <div className="price-area">
                              <span>${item.price} </span>
                              / month
                           </div>
                           <ul className="pricing-list">
                              {item.list_details.map((list, index) => (
                                 <li key={index} className={list.class_name}><i className={list.icon}></i>{list.list}</li>
                              ))}
                           </ul>
                           <Link className="ed-btn btn-base btn-radius w-100" href="#">GET STARTED</Link>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default PricingArea
