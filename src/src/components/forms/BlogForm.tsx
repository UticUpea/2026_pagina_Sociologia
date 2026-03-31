/* "use client"
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

interface FormData {
   name: string;
   email: string;
   message: string;
}

const schema = yup
   .object({
      name: yup.string().required().label("Name"),
      email: yup.string().required().email().label("Email"),
      message: yup.string().required().label("Message"),
   })
   .required();

const BlogForm = () => {

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
   const onSubmit = (data: FormData) => {
      const notify = () => toast('Message Send successfully', { position: 'top-center' });
      notify();
      reset();
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="blog-comment-form">
         <div className="mb-3">
            <h3 className="mb-0">Leave a Reply</h3>
         </div>
         <div className="row">
            <div className="col-md-6">
               <div className="single-input-inner style-bg-border">
                  <input type="text" {...register("name")} placeholder="Name" />
                  <p className="form_error">{errors.name?.message}</p>
               </div>
            </div>
            <div className="col-md-6">
               <div className="single-input-inner style-bg-border">
                  <input type="text" {...register("email")} placeholder="Email" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="single-input-inner style-bg-border">
                  <textarea {...register("message")} placeholder="Message"></textarea>
                  <p className="form_error">{errors.message?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <button type='submit' className="ed-btn btn-base">Post Comment</button>
            </div>
         </div>
      </form >
   )
}

export default BlogForm
 */