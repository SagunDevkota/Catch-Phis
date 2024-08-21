import React, { useState } from 'react';
import Header from '../../../layout/Header.js';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../../util/Spinner.js';
import ErrorMessage from '../../../util/ErrorMessage.js';
import { ToastUtil } from '../../../util/ToastUtil.js';
import axios from 'axios';

const Login = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [errors, setErrors] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors('');

    try {
      const response = await axios.post(`${serverUrl}/api/user/token/`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access);
      ToastUtil.displaySuccessToast('Login Success!');
      navigate('/users/dashboard');
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.detail);
        ToastUtil.displayErrorToast('Login Failed!');
      } else {
        setErrors('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}

      <Header heading={'Catch-Phis Login'} color={'text-success'} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="m-2">
                <input
                  type="email"
                  value={email}
                  className="form-control"
                  placeholder="Enter email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="password"
                  value={password}
                  className="form-control"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="submit"
                  className="btn btn-success"
                  value="Login"
                />
              </div>
            </form>
            <small>
              New to Catch-Phis?
              <Link
                to="/users/register"
                className="text-decoration-none fw-bold text-success"
              >
                Register
              </Link>
            </small>
          </div>
          <div className="col-sm-4">
            {errors && <ErrorMessage message={errors} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
