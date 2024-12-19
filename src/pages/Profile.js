import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { fetchUserDetails, updateUserDetails, fetchStates, fetchCities, fetchCountries, logout } from './../Components/apis';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false); 

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      username: '',
      address: '',
      phone: '',
      bio: '',
      country: '',
      state: '',
      city: '',
      profile_img: null,
      banner_img: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values) => {
      const finalData = new FormData();
    
      // Add basic user data
      finalData.append('user_id', loggedInUser);
      finalData.append('name', values.name);
      finalData.append('email', values.email);
      finalData.append('username', values.username);
      finalData.append('address', values.address);
      finalData.append('phone', values.phone);
      finalData.append('bio', values.bio);
      finalData.append('country', values.country);
      finalData.append('state', values.state);
      finalData.append('city', values.city);
    
      // Add files if they exist
      if (values.profile_img) {
        finalData.append('profile_img', values.profile_img);
      }
      if (values.banner_img) {
        finalData.append('banner_img', values.banner_img);
      }
    
      try {
        setLoading(true);
        console.log('finalData', finalData)
        // Replace `updateUserDetails` with the appropriate API call for handling FormData
        const updatedData = await updateUserDetails(finalData);
        if (updatedData.status === 200) {
          alert('Profile updated successfully!');
          fetchUserData(loggedInUser);
        }
      } catch (error) {
        console.error('Error updating profile', error);
      } finally {
        setLoading(false);
      }
    },    
  });

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      const res = await fetchUserDetails(id);
      if (res.status === 200 && res.data) {
        const userData = res.data;

        // Fetch related dropdown data
        const countryData = await fetchCountries();
        setCountries(countryData.data || []);
        const stateData = await fetchStates(userData.country);
        setStates(stateData.data || []);
        const cityData = await fetchCities(userData.state);
        setCities(cityData.data || []);

        // Update formik values
        formik.setValues({
          ...formik.initialValues,
          ...userData,
        });
      }
    } catch (error) {
      console.error(error);
    } finally{
      
      setLoading(false)
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          fetchUserData(decodedToken.userId);
          setLoggedInUser(decodedToken.userId);
        }
      } catch (err) {
        console.error('Invalid token', err);
        logout();
      }
    } else {
      logout();
    }
  }, [token, navigate]);

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    formik.setFieldValue('country', countryId);
    formik.setFieldValue('state', '');
    formik.setFieldValue('city', '');

    setLoading(true); // Start loading
    const stateData = await fetchStates(countryId);
    setStates(stateData.data || []);
    setCities([]);
    setLoading(false); // End loading
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    formik.setFieldValue('state', stateId);
    formik.setFieldValue('city', '');

    setLoading(true); // Start loading
    const cityData = await fetchCities(stateId);
    setCities(cityData.data || []);
    setLoading(false); // End loading
  };

  return (
    <>
    {loading ? <h1>Loading, Please Wait...</h1> :
    (
      <div className='mb-1'>
      <div className='between'>
        <h1>Welcome, {formik.values.name}</h1>
        <button className='btn btn-danger btn-round-1' onClick={() => logout()}>Logout</button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-1 flex'>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p style={{ color: 'red' }}>{formik.errors.name}</p>
            )}
          </div>
          <div className='mb-1 flex'>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p style={{ color: 'red' }}>{formik.errors.email}</p>
            )}
          </div>
          <div className='mb-1 flex'>
            <label>username:</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <p style={{ color: 'red' }}>{formik.errors.username}</p>
            )}
          </div>
          <div className='mb-1 flex'>
            <label>Phone:</label>
            <input
              type="number"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p style={{ color: 'red' }}>{formik.errors.phone}</p>
            )}
          </div>
          <div className='mb-1 flex'>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && formik.errors.address && (
              <p style={{ color: 'red' }}>{formik.errors.address}</p>
            )}
          </div>
          <div className='mb-1 flex'>
            <label>Country:</label>
            <select
              name="country"
              value={formik.values.country}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-1 flex'>
            <label>State:</label>
            <select
              name="state"
              value={formik.values.state}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-1 flex'>
            <label>City:</label>
            <select
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
  
          <div className='mb-1 flex'>
            <label>Profile Image:</label>
           <input type='file' name='profile_img'
           onChange={(e)=>formik.setFieldValue('profile_img', e.target.files[0])}/>
          </div>
  
          <div className='mb-1 flex'>
            <label>Banner Image:</label>
           <input type='file' name='banner_img'
           onChange={(e)=>formik.setFieldValue('banner_img', e.target.files[0])}/>
          </div>
  
          <div className='mb-1 flex'>
            <label>Bio:</label>
            <textarea
            rows={2}
            columns={10}
              type="text"
              name="bio"
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.bio && formik.errors.bio && (
              <p style={{ color: 'red' }}>{formik.errors.bio}</p>
            )}
          </div>
  
          <button className='btn btn-success btn-round-1' type="submit">Update Profile</button>
        </form>
      </div>
    )}
    </>
  );
};

export default ProfilePage;
