"use client"
import Image from "next/image"
import Link from "next/link"
import NavMenu from "./menu/NavMenu";
import UseSticky from "@/hooks/UseSticky"
import { useState } from "react";

import logo_1 from "@/assets/img/logo-2.png";

const HeaderTwo = () => {

   const [isActive, setIsActive] = useState<boolean>(false);
   const { sticky } = UseSticky();

   const toggleMobileMenu = () => {
      setIsActive(!isActive); // Toggle the isActive state
   };

   return (
      <div className="navbar-area">
         <nav className={`navbar navbar-area-3 navbar-area navbar-expand-lg ${sticky ? "sticky-active" : ""}`}>
            <div className="container nav-container">
               <div className="responsive-mobile-menu">
                  <button
                     onClick={toggleMobileMenu}
                     className={`menu toggle-btn d-block d-lg-none ${isActive ? "open" : ""}`} data-target="#edumint_main_menu"
                     aria-expanded="false" aria-label="Toggle navigation">
                     <span className="icon-left"></span>
                     <span className="icon-right"></span>
                  </button>
               </div>
               <div className="logo">
                  <Link href="/"><Image src={logo_1} alt="img" /></Link>
               </div>
               <div className="nav-right-part nav-right-part-mobile">
                  <Link className="btn btn-base" href="/signup">Sign Up</Link>
               </div>
               <div className={`collapse navbar-collapse ${isActive ? "sopen" : ""}`} id="edumint_main_menu">
                  <ul className="navbar-nav menu-open">
                     <NavMenu />
                  </ul>
               </div>
               <div className="nav-right-part nav-right-part-desktop style-black">
                  <div className="emt-phone-wrap" >
                     <div className="emt-phone">
                        <i className="fa fa-phone"></i>
                        <div className="phone-number align-self-center">
                           Call Us <br />
                           <span>860 -272 -9738</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </nav>
      </div>
   )
}

export default HeaderTwo
