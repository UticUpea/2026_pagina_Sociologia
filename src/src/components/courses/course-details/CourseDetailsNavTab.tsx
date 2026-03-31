/* si lo usamos */
"use client"
import faq_data from "@/data/FaqData";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';

const tab_title: string[] = ["M@E", "INSCRIPCIONES", "CAMPUS VIRTUAL", "BIBLIOTECA",];

interface ContentType {
   desc_1: JSX.Element;
   list_1: string[];
   rating: {
      width: string;
      count: number;
   }[];
}
const tab_content: ContentType = {
   desc_1: (<>ENLACE pra el sistema de matriculación</>),
   list_1: ["Metus interdum metus", "Ligula cur maecenas", "Fringilla nulla", "Metus interdum metus", "Ligula cur maecenas", "Fringilla nulla",],
   rating: [{ width: "100%", count: 5 }, { width: "0%", count: 4 }, { width: "0%", count: 3 }, { width: "0%", count: 2 }, { width: "0%", count: 1 },],
}

const { desc_1, list_1, rating } = tab_content;

const CourseDetailsNavTab = () => {

   const [activeTab, setActiveTab] = useState(0);

   // Handle tab click event
   const handleTabClick = (index: any) => {
      setActiveTab(index);
   };

   const [openItemId, setOpenItemId] = useState(1); // Initially open the first item

   const toggleAccordion = (itemId: any) => {
      setOpenItemId((prevOpenItemId) =>
         prevOpenItemId === itemId ? null : itemId
      );
   };

   return (
      <>
         <div className="course-details-nav-tab text-center">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
               {tab_title.map((tab, index) => (
                  <li key={index} className="nav-item">
                     <a onClick={() => handleTabClick(index)} style={{ cursor: "pointer" }} className={activeTab === index ? 'nav-link active' : ' nav-link'} >{tab}</a>
                  </li>
               ))}
            </ul>
         </div>


         <div className="tab-content" id="myTabContent">
            <div className={`tab-pane fade ${activeTab === 0 ? 'show active' : ''}`}>

               <div className="col-lg-12 col-md-6">
                  <div className="single-intro-inner style-icon-bg bg-gray text-center">
                     <div className="">

                        <Image
                        style={{ width: '200px', height: '100px' }}
                           src="/assets/img/logo-maeupea.png"
                           alt="Icon"
                           width={300}
                           height={300}
                        />
                        <div className="intro-count"></div>
                     </div>
                     <div className="details">
                        <Link className="ed-btn btn-border-black b-animate-3" href="https://matriculacion.upea.bo/6e56c5c3766bda500b0c353c32bfa6d36fc48c6e">MATRICULACIÓN</Link>
                        <h5>SISTEMA DE MATRICULACIÓN</h5>
                        <p>Universidad Pública de El Alto</p>
                     </div>
                  </div>
               </div>

            </div>

            <div className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`}>
               <div className="course-details-content">
                  <div className="col-lg-12 col-md-6">
                     <div className="single-intro-inner style-icon-bg bg-gray text-center">
                        <div className="">
                           <Image
                           style={{ width: '200px', height: '100px' }}
                              src="/assets/img/logo-suyayupea.png"
                              alt="Icon"
                              width={300}
                              height={300}
                           />
                           <div className="intro-count"></div>
                        </div>
                        <div className="details">
                           <Link className="ed-btn btn-border-black b-animate-3" href="https://inscripcionessociologia.upea.bo/">INSCRIPCIONES</Link>
                           <h5>SISTEMA DE INSCRIPCIONES</h5>
                           <p>Ingresa al sistema de Inscripciones de la Carrera de Sociologia de La Universidad Publica de El Alto.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`}>
               <div className="course-details-content">
                  <div className="col-lg-12 col-md-6">
                     <div className="single-intro-inner style-icon-bg bg-gray text-center">
                        <div className="">
                           <Image
                           style={{ width: '100px', height: '100px' }}
                              src="/assets/img/logo-moodle.png"
                              alt="Icon"
                              width={300}
                              height={300}
                           />
                           <div className="intro-count"></div>
                        </div>
                        <div className="details">
                           <Link className="ed-btn btn-border-black b-animate-3" href="#">CAMPUS VIRTUAL</Link>
                           <h5>CAMPUS VIRTUAL</h5>
                           <p>Sistema de Campus Virtual para el contenido de las materias Adémicas.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className={`tab-pane fade ${activeTab === 3 ? 'show active' : ''}`}>

               <div className="row">
                  <div className="col-md-12 align-self-center text-center">
                     <div className="total-avarage-rating">
                        <div className="col-lg-12 col-md-6">
                           <div className="single-intro-inner style-icon-bg bg-gray text-center">
                              <div className="">
                                 <Image
                                 style={{ width: '200px', height: '80px' }}
                                    src="/assets/img/logo-koha.png"
                                    alt="Icon"
                                    width={300}
                                    height={300}
                                 />
                                 <div className="intro-count"></div>
                              </div>
                              <div className="details">
                                 <Link className="ed-btn btn-border-black b-animate-3" href="#">EXPLORAR</Link>
                                 <h5>BIBLIOTECA VIRTUAL</h5>
                                 {/* CORRECION DE HTML */}
                                 {/* <p>CARRERA DE SOCIOLOGIA "KHOA.</p> */}
                                 <p>CARRERA DE SOCIOLOGIA KHOA.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* <div className="col-md-8">
                        <ul>
                           {rating.map((rating, i) => (
                              <li key={i}>
                                 <Link href="#">
                                    <span className="counter-label"><i className="fa fa-star"></i>{rating.count}</span>
                                    <span className="progress-bar-inner">
                                       <span className="progress">
                                          <span className="progress-bar" style={{ width: rating.width }}></span>
                                       </span>
                                    </span>
                                    <span className="counter-count">{rating.width}</span>
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div> */}
               </div>

            </div>
         </div>
      </>
   )
}

export default CourseDetailsNavTab
