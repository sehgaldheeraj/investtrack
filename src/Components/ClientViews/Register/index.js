import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import './register.css'
const BASE_URI = process.env.REACT_APP_BASE_API || 'http://localhost:4000';
// Define validation schema using Yup
const validationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.number().typeError('Phone number must be a number').required('Phone number is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ setRegistered }) {
  // Use react-hook-form with Yup validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
        // Exclude confirmPassword from the data object
        const { confirmPassword, ...userData } = data;

        // Send data to the backend API
        const response = await axios.post(BASE_URI + '/api/user/signup', userData);

        // Handle the successful response
        console.log(response.data); // For debugging purposes
        if (response.data.userId) {
            alert('Signup successful!'); // Notify the user of successful signup
            setRegistered(true); // Trigger navigation to login or other actions
        } else {
            alert('Signup failed. Please try again.'); // Fallback alert if no userId is present
        }
    } catch (error) {
        // Handle errors here, e.g., display an error message
        if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message); // Display specific error message from the backend
        } else {
            alert('An unexpected error occurred. Please try again.'); // Display a generic error message
        }
    }
};


  return (
    <div className="register-form-container">
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" {...register('fullName')} />
          {errors.fullName && <p className='error'>{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p className='error'>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" {...register('phone')} />
          {errors.phone && <p className='error'>{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <p className='error'>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className='error'>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}


