import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastUtil } from '../../../util/ToastUtil';
import ErrorMessage from '../../../util/ErrorMessage';
import Spinner from '../../../util/Spinner';
import Header from '../../../layout/Header';
import axios from 'axios';

const DashboardProfileUpdate = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [state, setState] = useState({
    loading: false,
    error: '',
    user: {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      account_type: '',
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        setState({ ...state, loading: true });
        const response = await axios.get(`${serverUrl}/api/user/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          setState({
            ...state,
            user: response.data,
          });
        }
      } catch (err) {
        setState({
          ...state,
          loading: false,
          error: err.message,
        });
      }
    };
    fetchData();
  }, []);

  let { loading, error, user } = state;

  const updateUserinput = (event) => {
    setState({
      ...state,
      user: {
        ...state.user,
        [event.target.name]: event.target.value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `${serverUrl}/api/user/profile/`,
        state.user,
        header
      );
      if (response.data) {
        navigate('/users/dashboard');
        ToastUtil.displaySuccessToast('Profile updated');
      }
    } catch (error) {
      if (error.response.data.password) {
        setState({
          ...state,
          error: 'Check Password Field!',
        });
      }
      if (error.response.data.first_name) {
        setState({
          ...state,
          error: `First Name: ${error.response.data.first_name}`,
        });
      }
      if (error.response.data.last_name) {
        setState({
          ...state,
          error: `Last Name: ${error.response.data.last_name}`,
        });
      }
      if (error.response.data.email) {
        setState({
          ...state,
          error: `Email: ${error.response.data.email}`.join(', '),
        });
      }
      if (error.response.data.phone) {
        setState({
          ...state,
          error: `Phone: ${error.response.data.phone}`,
        });
      }
      ToastUtil.displayErrorToast('Profile Update Failed!');
    }
  };

  return (
    <>
      {loading && <Spinner />}

      <Header heading={'Catch-Phis Update Profile'} color={'text-success'} />

      {user && (
        <div className="container mt-5">
          <div className="row">
            <div className="col-sm-4">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="m-2">
                  <input
                    type="email"
                    value={user.email}
                    name={'email'}
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => updateUserinput(e)}
                  />
                </div>
                <div className="m-2">
                  <input
                    type="text"
                    value={user.first_name}
                    name={'first_name'}
                    className="form-control"
                    placeholder="First Name"
                    onChange={(e) => updateUserinput(e)}
                  />
                </div>
                <div className="m-2">
                  <input
                    type="text"
                    value={user.last_name}
                    name={'last_name'}
                    className="form-control"
                    placeholder="Last Name"
                    onChange={(e) => updateUserinput(e)}
                  />
                </div>
                <div className="m-2">
                  <input
                    type="number"
                    value={user.phone}
                    name={'phone'}
                    className="form-control"
                    placeholder="Phone "
                    onChange={(e) => updateUserinput(e)}
                  />
                </div>
                <div className="m-2">
                  <input
                    type="password"
                    value={user.password}
                    name={'password'}
                    className="form-control"
                    placeholder="Password"
                    onChange={(e) => updateUserinput(e)}
                  />
                </div>
                <div className="m-2">
                  <select
                    value={user.account_type}
                    name={'account_type'}
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => updateUserinput(e)}
                    required
                  >
                    <option value="">Select Account Type</option>
                    <option value="personal">Personal</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                <div className="m-2">
                  <Link to={`/users/dashboard`} className="btn btn-warning m-1">
                    <i className="bi bi-arrow-left-circle m-2"></i>Back
                  </Link>
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Update"
                  />
                </div>
              </form>
            </div>

            <div className="col-sm-4">
              {error && <ErrorMessage message={error} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DashboardProfileUpdate;
