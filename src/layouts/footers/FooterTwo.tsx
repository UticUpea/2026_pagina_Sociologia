import Image from "next/image";
import Link from "next/link"

import footerLogo from "@/assets/img/logo-3.png"

const course_data: string[] = ["Branding design", "Ui/Ux designing", "Make Elements", "Business", "Graphics design"];

const FooterTwo = () => {
   return (
      <footer className="footer-area footer-area-2 bg-gray">
         <div className="footer-top">
            <div className="container">
               <div className="row">
                  <div className="col-lg-3 col-md-6">
                     <div className="widget widget_about text-center">
                        <Link href="/"><Image src={footerLogo} alt="img" /></Link>
                        <div className="details">
                           <p>Edumint tetur sadipscing elitr tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
                           <ul className="social-media">
                              <li><Link href="#"><i className="fa fa-facebook"></i></Link></li>
                              <li><Link href="#"><i className="fa fa-twitter"></i></Link></li>
                              <li><Link href="#"><i className="fa fa-instagram"></i></Link></li>
                              <li><Link href="#"><i className="fa fa-pinterest"></i></Link></li>
                           </ul>
                        </div>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                     <div className="widget widget_contact">
                        <h4 className="widget-title">Contact Us</h4>
                        <ul className="details">
                           <li><i className="fa fa-map-marker"></i> 420 Love Sreet 133/2 Street NewYork</li>
                           <li><i className="fa fa-envelope"></i> info.contact@gmail.com</li>
                           <li><i className="fa fa-phone"></i> 012 345 678 9101</li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                     <div className="widget widget_blog_list">
                        <h4 className="widget-title">News & Blog</h4>
                        <ul>
                           <li>
                              <h6><Link href="/blog-details">Big Ideas Of Business Branding Info.</Link></h6>
                              <span className="date"><i className="fa fa-calendar"></i>December 7, 2023</span>
                           </li>
                           <li>
                              <h6><Link href="/blog-details">Ui/Ux Ideas Of Business Branding Info.</Link></h6>
                              <span className="date"><i className="fa fa-calendar"></i>December 7, 2023</span>
                           </li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                     <div className="widget widget_nav_menu">
                        <h4 className="widget-title">Course</h4>
                        <ul>
                           {course_data.map((list, i) => (
                              <li key={i}><Link href="/course">{list}</Link></li>
                           ))}                       </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="footer-bottom">
            <div className="container">
               <div className="row">
                  <div className="col-md-5 align-self-center">
                     <p>Copyright 2024 by edumint.com</p>
                  </div>
                  <div className="col-md-7 text-md-right align-self-center mt-md-0 mt-2">
                     <div className="widget_nav_menu">
                        <ul>
                           <li><Link href="/">Home</Link></li>
                           <li><Link href="/about">About Us</Link></li>
                           <li><Link href="/pricing">Our Pricing</Link></li>
                           <li><Link href="/blog">blog</Link></li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </footer>
   )
}

export default FooterTwo
