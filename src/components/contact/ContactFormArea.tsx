/* si lo usamos revisar */
import Link from "next/link";
import ContactForm from "../forms/ContactForm";

const icons: string[] = ["fa fa-facebook", "fa fa-twitter", "fa fa-instagram", "fa fa-pinterest", "fa fa-linkedin",];

const ContactFormArea = () => {
   return (
      <div className="counter-area pd-bottom-120¿">
         {/* <div className="container">
            <div className="row">
               <div className="col-lg-4">
                  <div className="section-title mb-0">
                     <h6 className="sub-title right-line">Get in touch</h6>
                     <h2 className="title">Write Us a Message</h2>
                     <p className="content pb-3">The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax
                        quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, </p>
                     <ul className="social-media style-base pt-3">
                        {icons.map((icon, i) => (
                           <li key={i}>
                              <Link href="#"><i className={icon} aria-hidden="true"></i></Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
               <div className="col-lg-8 mt-5 mt-lg-0">
                  <ContactForm />
               </div>
            </div>
         </div> */}
      </div>
   )
}

export default ContactFormArea
