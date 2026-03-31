import Image from "next/image"
import Link from "next/link";

import eventThumb_1 from "@/assets/img/other/5.png";
import eventThumb_2 from "@/assets/img/other/6.png";
import icon_1 from "@/assets/img/icon/25.png";
import icon_2 from "@/assets/img/icon/26.png";
import icon_3 from "@/assets/img/icon/27.png";

const EventDetailsArea = () => {
   return (
      <div className="course-single-area pd-top-120 pd-bottom-110">
         <div className="container">
            <div className="row">
               <div className="col-lg-8 order-lg-12">
                  <div className="event-detaila-inner">
                     <div className="thumb mb-4">
                        <Image src={eventThumb_1} alt="img" />
                     </div>
                     <ul className="event-meta">
                        <li><i className="fa fa-clock-o"></i> 12:00 AM  To 11:59 PM</li>
                        <li><i className="fa fa-map-marker"></i> Melbourne, Australia</li>
                     </ul>
                     <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea</p>
                     <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem</p>
                     <div className="row pt-4 pb-4">
                        <div className="col-lg-5">
                           <div className="thumb mb-3 mb-lg-0">
                              <Image src={eventThumb_2} alt="img" />
                           </div>
                        </div>
                        <div className="col-lg-7 align-self-center">
                           <h6>Quality Control System</h6>
                           <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod</p>
                           <h6>Highly Professional Staff</h6>
                           <p className="mb-0">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod</p>
                        </div>
                     </div>
                     <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea</p>
                  </div>
               </div>
               <div className="col-lg-4 order-lg-1">
                  <div className="td-sidebar">
                     <div className="widget widget_event">
                        <h4 className="widget-title text-white">Event Info :</h4>
                        <ul>
                           <li><i className="fa fa-calendar"></i>Start Date: 12:00 AM</li>
                           <li><i className="fa fa-clock-o"></i>Start Time: May 08</li>
                           <li><i className="fa fa-calendar"></i>End Date: April 04</li>
                           <li><i className="fa fa-clock-o"></i>End Time: 11:59 PM</li>
                           <li><i className="fa fa-ticket"></i>Number of Participants: 10</li>
                           <li><i className="fa fa-map-marker"></i>Location: Melbourne, Australia</li>
                        </ul>
                     </div>
                     <div className="widget widget_catagory">
                        <h4 className="widget-title">Location</h4>
                        <div className="widget-g-map">
                           <iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d29208.601361499546!2d90.3598076!3d23.7803374!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1589109092857!5m2!1sen!2sbd"></iframe>
                        </div>
                     </div>
                     <div className="widget widget-contact">
                        <h4 className="widget-title">Get a Quote</h4>
                        <div className="single-input-inner style-right-icon">
                           <input type="text" placeholder="Full name" />
                           <Image src={icon_1} alt="img" />
                        </div>
                        <div className="single-input-inner style-right-icon">
                           <input type="text" placeholder="Email Address" />
                           <Image src={icon_2} alt="img" />
                        </div>
                        <div className="single-input-inner style-right-icon">
                           <textarea placeholder="Your Message"></textarea>
                           <Image src={icon_3} alt="img" />
                        </div>
                        <Link className="ed-btn btn-base" href="#">Send Message</Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default EventDetailsArea
