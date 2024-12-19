import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signupUser } from '../Components/apis';

const SignUp = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    role: Yup.string().oneOf(['0', '1', '2'], 'Invalid role').required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: '0',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await signupUser(values);
        navigate('/email-verification', { state: { email: values.email } });
      } catch (error) {
        setFieldError('general', 'Signup failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <h1>Signup</h1>
      {formik.errors.general && <p style={{ color: 'red' }}>{formik.errors.general}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-1 flex">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <p style={{ color: 'red' }}>{formik.errors.name}</p>
          ) : null}
        </div>

        <div className="mb-1 flex">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <p style={{ color: 'red' }}>{formik.errors.username}</p>
          ) : null}
        </div>

        <div className="mb-1 flex">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <p style={{ color: 'red' }}>{formik.errors.email}</p>
          ) : null}
        </div>

        <div className="mb-1 flex">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <p style={{ color: 'red' }}>{formik.errors.password}</p>
          ) : null}
        </div>

        <div className="mb-1 flex">
          <label>Role:</label>
          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="0">User</option>
            <option value="1">Creator</option>
            <option value="2">Studio</option>
          </select>
          {formik.touched.role && formik.errors.role ? (
            <p style={{ color: 'red' }}>{formik.errors.role}</p>
          ) : null}
        </div>

        <button className='btn btn-success btn-round-1' type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Signing Up...' : 'Signup'}
        </button>
      </form>
      <div className='flex option'>
        <p>Already have an account?</p>
        <button className='btn btn-primary btn-round-1' onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
};

export default SignUp;