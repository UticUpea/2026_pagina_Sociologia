"use client"
import Link from "next/link";
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

interface FormData {
   name: string;
   email: string;
   password: string;
}

const SinginForm = () => {

   const schema = yup
      .object({
         name: yup.string().required().label("FName"),
         email: yup.string().required().email().label("Email"),
         password: yup.string().required().label("Password"),
      })
      .required();

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
   const onSubmit = (data: FormData) => {
      const notify = () => toast('Login successfully', { position: 'top-center' });
      notify();
      reset();
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="signin-inner">
         <div className="row">
            <div className="col-12">
               <div className="single-input-inner style-bg-border">
                  <input type="text" {...register("name")} placeholder="First Name" />
                  <p className="form_error">{errors.name?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="single-input-inner style-bg-border">
                  <input type="email" {...register("email")} placeholder="Email" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="single-input-inner style-bg-border">
                  <input type="password" {...register("password")} placeholder="Password" />
                  <p className="form_error">{errors.password?.message}</p>
               </div>
            </div>
            <div className="col-12 mb-4">
               <button type="submit" className="ed-btn btn-base w-100">Sing In</button>
            </div>
            <div className="col-12">
               <span>Forgottem Your Password </span>
               <Link href="/signup"><strong>Signup</strong></Link>
            </div>
         </div>
      </form>
   )
}

export default SinginForm;
