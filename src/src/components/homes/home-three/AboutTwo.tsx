import Image from "next/image"
import Progress from "@/components/common/Progress";

import aboutThumb from "@/assets/img/about/4.png";

const AboutTwo = () => {
   return (
      <div className="about-area pd-top-100 pd-bottom-100" style={{ backgroundImage: `url(/assets/img/bg/2)` }}>
         <div className="container">
            <div className="about-area-inner">
               <div className="row">
                  <div className="col-lg-6 order-lg-12 align-self-center">
                     <Image src={aboutThumb} alt="img" />
                  </div>
                  <div className="col-lg-6 order-lg-1 align-self-center mt-4 mt-lg-0">
                     <div className="about-inner-wrap">
                        <div className="section-title mb-0">
                           <h6 className="sub-title style-btn">ABOUT US</h6>
                           <h2 className="title">1230+ Courses Online from Best Tutors</h2>
                           <p className="content">The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad</p>
                        </div>
                        <ul className="single-progress-inner mt-4 pt-2">
                           <li className="progress-item" id="progress-running-1">
                              <h6>Nullam est</h6>
                              <div className="progress-bg">
                                 <Progress finish={80} />
                              </div>
                           </li>
                           <li className="progress-item" id="progress-running-2">
                              <h6>Mattis dictum nunc</h6>
                              <div className="progress-bg">
                                 <Progress finish={60} />
                              </div>
                           </li>
                           <li className="progress-item" id="progress-running-3">
                              <h6>Malesuada dictum</h6>
                              <div className="progress-bg">
                                 <Progress finish={86} />
                              </div>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AboutTwo
