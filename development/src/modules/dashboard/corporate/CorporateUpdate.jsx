import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastUtil } from '../../../util/ToastUtil';
import ErrorMessage from '../../../util/ErrorMessage';
import Spinner from '../../../util/Spinner';
import Header from '../../../layout/Header';
import axios from 'axios';

const CorporateUpdate = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [state, setState] = useState({
    loading: false,
    error: '',
    user: {
      company_name: '',
      contact_email: '',
      contact_phone: '',
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        setState({ ...state, loading: true });
        const response = await axios.get(
          `${serverUrl}/api/corporate/corporate/detail/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data[0]) {
          setState({
            ...state,
            corporate: response.data[0],
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

  let { loading, error, corporate } = state;

  const updateUserinput = (event) => {
    setState({
      ...state,
      corporate: {
        ...state.corporate,
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

    const id = state.corporate.id;
    try {
      const response = await axios.put(
        `${serverUrl}/api/corporate/corporate/detail/${id}/`,
        state.corporate,
        header
      );
      if (response.data) {
        navigate('/users/dashboard');
        ToastUtil.displaySuccessToast('Company updated');
      }
    } catch (error) {
      if (error.response.data.company_name) {
        setState({
          ...state,
          error: 'Check Company name Field!',
        });
      }
      if (error.response.data.contact_email) {
        setState({
          ...state,
          error: `Email: ${error.response.data.contact_email}`,
        });
      }
      if (error.response.data.contact_phone) {
        setState({
          ...state,
          error: `Phone: ${error.response.data.contact_phone}`,
        });
      }
      ToastUtil.displayErrorToast('Corporate Update Failed!');
    }
  };

  return (
    <>
      {loading && <Spinner />}

      <Header heading={'Update Corporate'} color={'text-success'} />

      {corporate && (
        <div className="container mt-5">
          <div className="row">
            <div className="col-sm-4">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="m-2">
                  <input
                    type="text"
                    value={corporate.company_name}
                    name={'company_name'}
                    className="form-control"
                    placeholder="Company Name"
                    onChange={(e) => updateUserinput(e)}
                  />
                </div>
                <div className="m-2">
                  <input
                    type="email"
                    value={corporate.contact_email}
                    name={'contact_email'}
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => updateUserinput(e)}
                  />
                </div>
                <div className="m-2">
                  <input
                    type="number"
                    value={corporate.contact_phone}
                    name={'contact_phone'}
                    className="form-control"
                    placeholder="Phone "
                    onChange={(e) => updateUserinput(e)}
                  />
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
export default CorporateUpdate;
