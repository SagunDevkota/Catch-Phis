import React, { useState } from 'react';
import Header from '../../../layout/Header';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../../util/Spinner';
import ErrorMessage from '../../../util/ErrorMessage';
import { ToastUtil } from '../../../util/ToastUtil';
import axios from 'axios';

const Register = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [errors, setErrors] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors('');

    try {
      const body = {
        email,
        first_name: firstname,
        last_name: lastname,
        phone,
        password,
        account_type: accountType,
      };
      const response = await axios.post(`${serverUrl}/api/user/create/`, body);
      if(response.data) {
        localStorage.removeItem('token');
        ToastUtil.displaySuccessToast('Registration Success!');
        navigate('/users/activate');
      }
    } catch (error) {
      if (error.response && error.response.data.password) {
        setErrors('Password: ' + error.response.data.password.join('\n '));
      } else if (error.response && error.response.data.email) {
        setErrors(error.response.data.email.join('\n '));
      } else if (error.response && error.response.data.first_name) {
        setErrors('FirstName: ' + error.response.data.first_name.join('\n '));
      } else if (error.response && error.response.data.last_name) {
        setErrors('LastName: ' + error.response.data.last_name.join('\n '));
      } else if (error.response && error.response.data.phone) {
        setErrors('Phone: ' + error.response.data.phone.join('\n '));
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

      <Header heading={'Catch-Phis Register'} color={'text-success'} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-4">
            <form onSubmit={handleSubmit}>
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
                  type="text"
                  value={firstname}
                  className="form-control"
                  placeholder="First Name"
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="text"
                  value={lastname}
                  className="form-control"
                  placeholder="Last Name"
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="number"
                  value={phone}
                  className="form-control"
                  placeholder="Phone "
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
                <select
                  value={accountType}
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setAccountType(e.target.value)}
                  required
                >
                  <option value="">Select Account Type</option>
                  <option value="personal">Personal</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
              <div className="m-2">
                <input
                  type="submit"
                  className="btn btn-success"
                  value="Register"
                />
              </div>
            </form>
            <small>
              Have an account already?
              <Link
                to="/users/login"
                className="text-decoration-none fw-bold text-success"
              >
                Login
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

export default Register;
