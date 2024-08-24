import React, { useState } from 'react';
import Header from '../../../layout/Header';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../../util/Spinner';
import ErrorMessage from '../../../util/ErrorMessage';
import { ToastUtil } from '../../../util/ToastUtil';
import axios from 'axios';

const CorporateRegister = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [errors, setErrors] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors('');

    try {
      const body = {
        company_name: companyName,
        contact_email: email,
        contact_phone: phone,
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${serverUrl}/api/corporate/corporate/detail/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        ToastUtil.displaySuccessToast('Registration Success!');
        navigate('/users/dashboard/corporate/activate');
      }
    } catch (error) {
      if (error.response && error.response.data.company_name) {
        setErrors(
          'Company Name: ' + error.response.data.company_name.join('\n ')
        );
      } else if (error.response && error.response.data.contact_email) {
        setErrors('Email: ' + error.response.data.contact_email.join('\n '));
      } else if (error.response && error.response.data.contact_phone) {
        setErrors('Phone: ' + error.response.data.contact_phone.join('\n '));
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

      <Header heading={'Corporate Register'} color={'text-success'} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="m-2">
                <input
                  type="text"
                  value={companyName}
                  className="form-control"
                  placeholder="Company Name"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="m-2">
                <input
                  type="email"
                  value={email}
                  className="form-control"
                  placeholder="Contact Email"
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
                <Link to={`/users/dashboard`} className="btn btn-warning m-1">
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

export default CorporateRegister;
