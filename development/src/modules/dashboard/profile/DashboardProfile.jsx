import React, { useState, useEffect } from 'react';
import Spinner from '../../../util/Spinner';
import Header from '../../../layout/Header';
import ErrorMessage from '../../../util/ErrorMessage';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastUtil } from '../../../util/ToastUtil';

const DashboardProfile = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [data, setData] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState('');

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.delete(
        `${serverUrl}/api/corporate/corporate/detail/${id}`,
        header
      );
      if (response) {
        window.location.reload();
        ToastUtil.displaySuccessToast(
          'Corporate details deleted successfully.'
        );
      }
    } catch (error) {
      setError(error.data.detail);
      ErrorMessage('Error deleting corporate details:', error);
      ToastUtil.displayErrorToast('Error deleting corporate details.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${serverUrl}/api/user/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    const fetchCompanyData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${serverUrl}/api/corporate/corporate/detail/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompanyData(response.data);
        setLoading(false);
      } catch (err) {
        setError('No company found');
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${serverUrl}/api/corporate/corporate/user/me/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('User data(admin) not found');
        setLoading(false);
      }
    };

    fetchData();
    fetchCompanyData();
    fetchUserData();
  }, []);

  return (
    <>
      {loading && <Spinner />}

      {error && <ErrorMessage message={error} />}

      <Header heading={'User Profile'} color={'text-success'} />

      {data && (
        <>
          <div className="card shadow-lg mt-3">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-sm-3">
                  <img
                    src={
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4CRKPij6o2waFROp-89BCE8lEf96jLsndRQ&usqp=CAU'
                    }
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="col-sm-6 text-start">
                  <ul className="list-group">
                    <li className="list-group-item">
                      First Name:{' '}
                      <span className="fw-bold">{data.first_name}</span>
                    </li>
                    <li className="list-group-item">
                      Last Name:{' '}
                      <span className="fw-bold">{data.last_name}</span>
                    </li>

                    <li className="list-group-item">
                      Email: <span className="fw-bold">{data.email}</span>
                    </li>
                    <li className="list-group-item">
                      Phone: <span className="fw-bold">{data.phone}</span>
                    </li>
                    <li className="list-group-item">
                      Account Type:{' '}
                      <span className="fw-bold">{data.account_type}</span>
                    </li>
                    <li className="list-group-item">
                      Active Status:{' '}
                      <span className="fw-bold">
                        {data.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </li>
                    <li className="list-group-item">
                      Staff:{' '}
                      <span className="fw-bold">
                        {data.is_staff ? 'YES' : 'NO'}
                      </span>
                    </li>
                    <li className="list-group-item">
                      Super User:{' '}
                      <span className="fw-bold">
                        {data.is_superuser ? 'YES' : 'NO'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="col-sm-2 d-flex flex-column align-items-center justify-content-around">
                  <Link
                    to={`/users/dashboard/profile/edit/${data.id}`}
                    className="btn btn-primary mt-1"
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </Link>
                </div>
                <div className="container mt-2">
                  <div className="row">
                    <div className="col text-center">
                      {data.account_type === 'corporate' ? (
                        <Link
                          className="btn btn-dark m-2"
                          to={`/users/dashboard/corporate/register`}
                        >
                          <i className="bi bi-buildings m-1"></i>Register
                          Company
                        </Link>
                      ) : (
                        <></>
                      )}

                      {userData.role === 'admin' ? (
                        <Link
                          className="btn btn-info m-1"
                          to={`/users/dashboard/corporate/admin`}
                        >
                          <i className="bi bi-person-vcard m-1"></i>Admin Panel
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="container mt-3">
              <div className="row">
                <div className="col-sm-12 text-start">
                  <p className={`h3 text-success`}>Company Details</p>
                  <p className="fst-italic">
                    Discover the core information about our company, including
                    our mission, values, and the dedicated team behind our
                    innovative solutions. Learn more about our journey,
                    achievements, and how we're committed to shaping the future
                    of online security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {companyData.length > 0 ? (
            <>
              {' '}
              {companyData.map((data) => (
                <div className="card shadow-lg mt-3" key={data.created_at}>
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-sm-2"></div>
                      <div className="col-sm-4 text-start">
                        <ul className="list-group">
                          <li className="list-group-item">
                            Company Name:{' '}
                            <span className="fw-bold">{data.company_name}</span>
                          </li>

                          <li className="list-group-item">
                            Email:{' '}
                            <span className="fw-bold">
                              {data.contact_email}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Phone:{' '}
                            <span className="fw-bold">
                              {data.contact_phone}
                            </span>
                          </li>
                          <li className="list-group-item">
                            Activated:{' '}
                            <span className="fw-bold">
                              {data.activated ? 'YES' : 'NO'}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="col-sm-2 d-flex flex-column align-items-center justify-content-around">
                        <Link
                          to={`/users/dashboard/corporate/edit/${data.id}`}
                          className="btn btn-primary mt-1"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button className="btn btn-danger mt-1">
                          <i
                            className="bi bi-trash"
                            onClick={() => handleDelete(companyData[0].id)}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <p className="text-danger">No Company Found</p>
            </>
          )}
        </>
      )}
    </>
  );
};

export default DashboardProfile;
