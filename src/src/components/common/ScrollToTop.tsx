/* si lo usamos */
"use client"
import UseSticky from "@/hooks/UseSticky";
import { useState, useEffect, useCallback } from "react";

const ScrollToTop = () => {
   const { sticky }: { sticky: boolean } = UseSticky();
   const [showScroll, setShowScroll] = useState(false);


   const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };


   const checkScrollTop = useCallback(() => {
      const scrollPosition = window.pageYOffset;

      if (!showScroll && scrollPosition > 400) {
         setShowScroll(true);
      } else if (showScroll && scrollPosition <= 400) {
         setShowScroll(false);
      }
   }, [showScroll]); 

   useEffect(() => {

      window.addEventListener("scroll", checkScrollTop);

      
      checkScrollTop();

      return () => {
         window.removeEventListener("scroll", checkScrollTop);
      };
   }, [checkScrollTop]); //

   return (
      <>
         <div
            onClick={scrollTop}
            className={`back-to-top ${sticky ? "active" : ""} ${showScroll ? "visible" : "hidden"}`}
            style={{ display: showScroll ? 'block' : 'none' }}
         >
            <span className="back-top">
               <i className="fa fa-angle-up"></i>
            </span>
         </div>
      </>
   )
}

export default ScrollToTop;