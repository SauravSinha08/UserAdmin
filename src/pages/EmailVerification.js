import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { verifyEmail, verifyEmailOtp } from '../Components/apis';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location', location.state.email)

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    otp: Yup.string()
      .length(6, 'OTP must be exactly 6 characters')
      .required('OTP is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: location.state.email ||'',
      otp: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await verifyEmailOtp(values);

        if (response.status === 200) {
          alert('Email Verification Successful');
          navigate('/login'); // Redirect to login after successful verification
        } else {
          setFieldError('otp', 'Invalid OTP. Please try again.');
        }
      } catch (error) {
        setFieldError('otp', 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <h1>Email Verification</h1>
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
          <label>OTP:</label>
          <input
            type="text"
            name="otp"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
          {formik.touched.otp && formik.errors.otp ? (
            <p style={{ color: 'red' }}>{formik.errors.otp}</p>
          ) : null}

<div className='option'>
        <button className='btn btn-success btn-round-1' type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Verifying...' : 'Verify'}
        </button>
</div>
      </form>
    </div>
  );
};

export default EmailVerification;
