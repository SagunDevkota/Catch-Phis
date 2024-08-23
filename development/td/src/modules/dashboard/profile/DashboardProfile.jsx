import React, { useState, useEffect } from 'react';
import Spinner from '../../../util/Spinner';
import Header from '../../../layout/Header';
import ErrorMessage from '../../../util/ErrorMessage';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardProfile = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchData();
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
                  {data.is_active && (
                    <Link className="btn btn-success disabled">
                      <i className="bi bi-check-circle-fill"></i>
                    </Link>
                  )}

                  <Link
                    to={`/users/dashboard/profile/edit/${data.id}`}
                    className="btn btn-primary mt-1"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>
                  <button disabled className="btn btn-danger mt-1">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardProfile;
