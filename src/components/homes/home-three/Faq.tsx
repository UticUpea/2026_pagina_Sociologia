"use client"
import faq_data from "@/data/FaqData";
import { useState } from "react";

const Faq = () => {
   const [openItemId, setOpenItemId] = useState(1); // Initially open the first item

   const toggleAccordion = (itemId: any) => {
      setOpenItemId((prevOpenItemId) =>
         prevOpenItemId === itemId ? null : itemId
      );
   };

   return (
      <div className="faq-area pd-top-120">
         <div className="container">
            <div className="row">
               <div className="col-lg-5">
                  <div className="about-area-inner">
                     <div className="section-title mb-0">
                        <h2 className="title mt-0">Do You Have Any Questions</h2>
                        <p className="content">
                           Have ipsum dolor sit amet, elitr, sed diam nonumy eirmod
                           tempor invidunt ut labore et dolore magna aliquyam erat, sed
                           diam voluptua. At vero eos et accusam et justo duo et ea
                           rebum.
                        </p>
                        <div className="row">
                           <div className="col-sm-6">
                              <ul className="single-list-wrap">
                                 <li className="single-list-inner style-check-box bg-light-green p-3 b-radius-5">
                                    <div className="media">
                                       <div className="media-left mr-0">
                                          <i className="fa fa-check"></i>
                                       </div>
                                       <div className="media-body">
                                          <h5>1200+</h5>
                                          <p>Learners & counting</p>
                                       </div>
                                    </div>
                                 </li>
                              </ul>
                           </div>
                           <div className="col-sm-6">
                              <ul className="single-list-wrap">
                                 <li className="single-list-inner style-check-box bg-light-green p-3 b-radius-5">
                                    <div className="media">
                                       <div className="media-left mr-0">
                                          <i className="fa fa-check"></i>
                                       </div>
                                       <div className="media-body">
                                          <h5>350+</h5>
                                          <p>Learners & counting</p>
                                       </div>
                                    </div>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-lg-7 mt-5 mt-lg-0">
                  <div id="accordion" className="accordion-area">
                     {faq_data
                        .filter((items) => items.page === "home_3")
                        .map((item) => (
                           <div key={item.id} className="card single-faq-inner">
                              <div className="card-header" id={`ff-${item.id}`}>
                                 <h5 className="mb-0">
                                    <button
                                       className={`btn-link ${openItemId === item.id ? "show" : "collapsed"
                                          }`}
                                       type="button"
                                       onClick={() => toggleAccordion(item.id)}
                                       aria-expanded={
                                          openItemId === item.id ? "true" : "false"
                                       }
                                       aria-controls={`collapse${item.id}`}
                                    >
                                       {item.question}
                                       <i className="fa fa-eye"></i>
                                    </button>
                                 </h5>
                              </div>
                              <div
                                 id={`collapse${item.id}`}
                                 className={`accordion-collapse collapse ${openItemId === item.id ? "show" : ""
                                    }`}
                                 aria-labelledby={`ff-${item.id}`}
                                 data-bs-parent="#accordion"
                              >
                                 <div className="card-body">{item.answer}</div>
                              </div>
                           </div>
                        ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Faq;
