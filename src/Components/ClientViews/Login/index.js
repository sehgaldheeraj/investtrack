import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import './login.css';

const BASE_URI = 'https://api.emiratesearngrow.com' || 'http://localhost:4000';
// Define validation schema using Yup
const validationSchema = Yup.object({
  phone: Yup.string()
    .required('Phone number is required'),
  password: Yup.string()
    .required('Password is required'),
});
const adminEmail = 'mcxlivetraiding@gmail.com';
// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ setLoggedIn, setRole }) {
  // Use react-hook-form with Yup validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(BASE_URI+'/api/user/login', data);
      const { user, token } = response.data;
      // Store token in localStorage or context (optional)
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', user);
      
      if(user.email === adminEmail){
        setRole('admin');
      }
      else{
        setRole('user');
      }
      // Update logged-in state
      setLoggedIn(true);
    } catch (error) {
      // Handle error
      console.error(error.response?.data?.message || 'An error occurred');
      alert(error.response?.data?.message || 'An error occurred');
    }
  };


  return (
    <div className="login-form-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" type="text" {...register('phone')} />
          {errors.phone && <p className='error'>{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <p className='error'>{errors.password.message}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

