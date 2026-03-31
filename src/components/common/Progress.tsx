/* no lo usamos */
"use client"
import React, { useState, useEffect, useRef } from 'react';

const Progress = ({
   duration = 4200,
   finish = 85,
}) => {
   const [isInViewport, setIsInViewport] = useState(false);
   const [percentage, setPercentage] = useState(0);
   const [displayedProgress, setDisplayedProgress] = useState(0);
   const progressRef = useRef(null);

   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            setIsInViewport(entry.isIntersecting);
         },
         {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
         }
      );

      const currentRef = progressRef.current; // <-- guardamos el ref actual
      if (currentRef) {
         observer.observe(currentRef);
      }

      return () => {
         if (currentRef) {
            observer.unobserve(currentRef);
         }
      };
   }, []);
   useEffect(() => {
      if (isInViewport && percentage <= finish) {
         const interval = duration / 100;

         const easeOutQuad = (t: any) => t * (2 - t);

         const increment = () => {
            setTimeout(() => {
               const newPercentage = percentage + 1;
               const newDisplayedProgress = Math.round(easeOutQuad(newPercentage / finish) * finish);
               setPercentage(newPercentage);
               setDisplayedProgress(newDisplayedProgress);
            }, interval);
         };

         increment();

         return () => {
            clearTimeout(interval);
         };
      }
   }, [isInViewport, percentage, duration, finish]);

   return (
      <>
         <div ref={progressRef} id="progress-1" className="progress-rate" data-pct={displayedProgress} style={{ width: `${displayedProgress}%` }}>
            <span className="progress-count-wrap progress-count counting" style={{ left: `${displayedProgress}%` }}>{displayedProgress}%</span>
         </div>
      </>
   );
};

export default Progress;
