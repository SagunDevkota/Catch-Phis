import React, { useState } from 'react';
import Header from '../../../../layout/Header';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../../../util/Spinner';
import ErrorMessage from '../../../../util/ErrorMessage';
import { ToastUtil } from '../../../../util/ToastUtil';
import axios from 'axios';

const CorporateUserRegister = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [errors, setErrors] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors('');

    try {
      const body = {
        first_name,
        last_name,
        phone,
        email,
        role,
        password
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${serverUrl}/api/corporate/corporate/user/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        ToastUtil.displaySuccessToast('Registration Success!');
        navigate('/users/dashboard/corporate/admin');
      }
    } catch (error) {
      if (error.response && error.response.data.first_name) {
        setErrors('First Name: ' + error.response.data.first_name);
      } else if (error.response && error.response.data.last_name) {
        setErrors('Last Name: ' + error.response.data.last_name);
      } else if (error.response && error.response.data.email) {
        setErrors('Email: ' + error.response.data.email);
      } else if (error.response && error.response.data.phone) {
        setErrors('Phone: ' + error.response.data.phone);
      } else if (error.response && error.response.data.password) {
        setErrors('Email: ' + error.response.data.password);
      } else if (error.response && error.response.data.role) {
        setErrors('Role: ' + error.response.data.role);
      } else {
        setErrors('An error occurred. Please try again.');
      }
      ToastUtil.displayErrorToast('Registration Failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}

      <Header heading={'Corporate User Register'} color={'text-success'} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="m-2">
                <input
                  type="text"
                  value={first_name}
                  className="form-control"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="text"
                  value={last_name}
                  className="form-control"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="email"
                  value={email}
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="number"
                  value={phone}
                  className="form-control"
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="password"
                  value={password}
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="text"
                  value={role}
                  className="form-control"
                  placeholder="Role: admin / employee"
                  onChange={(e) => setRole((e.target.value).toLowerCase())}
                />
              </div>

              <div className="m-2">
                <Link
                  to={`/users/dashboard/corporate/admin`}
                  className="btn btn-warning m-1"
                >
                  <i className="bi bi-arrow-left-circle m-2"></i>Back
                </Link>
                <input
                  type="submit"
                  className="btn btn-success"
                  value="Register"
                />
              </div>
            </form>
          </div>
          <div className="col-sm-4">
            {errors && <ErrorMessage message={errors} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporateUserRegister;
