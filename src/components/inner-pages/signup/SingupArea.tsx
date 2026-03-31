import SinginForm from "@/components/forms/SinginForm"
import SingupForm from "@/components/forms/SingupForm"

const SingupArea = ({ style }: any) => {
   return (
      <div className="signup-page-area pd-top-120 pd-bottom-120">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7">
                  {style ? <SinginForm /> : <SingupForm />}
               </div>
            </div>
         </div>
      </div>
   )
}

export default SingupArea
