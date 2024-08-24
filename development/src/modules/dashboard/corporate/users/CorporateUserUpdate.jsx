import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ErrorMessage from '../../../../util/ErrorMessage';
import { ToastUtil } from '../../../../util/ToastUtil';
import Spinner from '../../../../util/Spinner';
import Header from '../../../../layout/Header';

const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

const CorporateUserUpdate = () => {
  const { id } = useParams();
  const [role, setRole] = useState('employee');
  const [isLoading, setIsLoading] = useState();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors('');

    try {
      const token = localStorage.getItem('token');
      const body = {
        role: role,
      };
      const response = await axios.put(
        `${serverUrl}/api/corporate/corporate/user/${id}/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        ToastUtil.displaySuccessToast('Role Updated!');
        navigate('/users/dashboard/corporate/admin');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors('Token: ' + error.response.data.error);
      } else {
        setErrors('An error occurred. Please try again.');
      }
      ToastUtil.displayErrorToast('Update Failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}

      <Header heading={'Catch-Phis Activate Account'} color={'text-success'} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="m-2">
                <select
                  value={role}
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="m-2">
                <Link
                  to={`/users/dashboard/corporate/admin`}
                  className="btn btn-warning m-2"
                >
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
            {errors && <ErrorMessage message={errors} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporateUserUpdate;
