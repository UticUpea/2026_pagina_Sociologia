/* no lo usamos */
"use client"
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

interface FormData {
  name: string;
  phone: number;
  email: string;
  message: string;
}

const schema = yup
  .object({
    name: yup.string().required().label("Name"),
    phone: yup.number()
      .transform((originalValue, originalObject) => {
        // Convert empty string to NaN
        return originalObject && originalObject.phone === '' ? NaN : originalValue;
      })
      .typeError('Phone number is required')
      .required('Phone must be a number'),
    email: yup.string().required().email().label("Email"),
    message: yup.string().required().label("Message"),
  })
  .required();

const HomeContactForm = () => {

  const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
  const onSubmit = (data: FormData) => {
    const notify = () => toast('Message Send successfully', { position: 'top-center' });
    notify();
    reset();
  };

  /* return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form-inner mt-mn-200 style-shadow">
      <div className="section-title">
        <h2 className="title">Request A Quote</h2>
        <p>We will be happy to answer your questions.</p>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="single-input-inner">
            <input type="text" {...register("name")} placeholder="Full name" />
            <p className="form_error">{errors.name?.message}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="single-input-inner">
            <input type="number" {...register("phone")} placeholder="Phone Number" />
            <p className="form_error">{errors.phone?.message}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="single-input-inner">
            <input type="email" {...register("email")} placeholder="Email Address" />
            <p className="form_error">{errors.email?.message}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="single-input-inner">
            <input type="text" placeholder="Subject" />
          </div>
        </div>
        <div className="col-12">
          <div className="single-input-inner">
            <textarea {...register("message")} placeholder="Your Message"></textarea>
            <p className="form_error">{errors.name?.message}</p>
          </div>
        </div>
        <div className="col-sm-6 align-self-center">
          <div className="single-input-inner style-checkbox">
            <input type="checkbox" />
            Also subscribe us
          </div>
        </div>
        <div className="col-sm-6 text-sm-right">
          <button type="submit" className="ed-btn btn-base">Send Message</button>
        </div>
      </div>
    </form>
  ) */
}

export default HomeContactForm
