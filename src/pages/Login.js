import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../Components/apis';

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if(token){
      navigate('/profile');
    }
  }, [token])
  

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must not exceed 50 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        console.log('values', values)
        const response = await loginUser(values);

        if (response.status === 200) {
          localStorage.setItem('token', response.token);
          alert('Login successful')
          navigate('/profile');
        } else {
          setFieldError('email', 'Invalid email or password');
        }
      } catch (error) {
        setFieldError('email', 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <h1>Login</h1>
      {/* {formik.errors.email && <p style={{ color: 'red' }}>{formik.errors.email}</p>} */}
      <form onSubmit={formik.handleSubmit}>
        <div className='mb-1 flex'>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
          {formik.touched.email && formik.errors.email ? (
            <p style={{ color: 'red' }}>{formik.errors.email}</p>
          ) : null}

        <div className='mb-1 flex'>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
          {formik.touched.password && formik.errors.password ? (
            <p style={{ color: 'red' }}>{formik.errors.password}</p>
          ) : null}

        <button className='btn btn-success btn-round-1' type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className='flex option'>
        <p>Don't have an account?</p>
        <button className='btn btn-primary btn-round-1' onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
