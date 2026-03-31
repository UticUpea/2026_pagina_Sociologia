"use client"
import Link from "next/link";
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

interface FormData {
   email: string;
   password: string;
}

const LoginForm = () => {

   const schema = yup
      .object({
         email: yup.string().required("El correo es obligatorio").email("Correo inválido"),
         password: yup.string().required("La contraseña es obligatoria"),
      })
      .required();

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });

   const onSubmit = (data: FormData) => {
      toast.success('Inicio de sesión exitoso', { position: 'top-center' });
      console.log("Datos enviados:", data);
      reset();
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="signin-inner">
         <div className="row">
            <div className="col-12">
               <div className="single-input-inner style-bg-border">
                  <input type="email" {...register("email")} placeholder="Correo electrónico" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="single-input-inner style-bg-border">
                  <input type="password" {...register("password")} placeholder="Contraseña" />
                  <p className="form_error">{errors.password?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="single-checkbox-inner">
                  <input type="checkbox" />
                  Recordarme en este dispositivo
               </div>
            </div>
            <div className="col-12 mb-4">
               <button type="submit" className="ed-btn btn-base w-100">INICIAR SESIÓN</button>
            </div>
            <div className="col-12 text-center">
               <span>¿No tienes una cuenta? </span>
               <Link href="/signup"><strong>Regístrate</strong></Link>
            </div>
         </div>
      </form>
   )
}

export default LoginForm;