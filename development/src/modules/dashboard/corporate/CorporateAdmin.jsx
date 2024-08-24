import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastUtil } from '../../../util/ToastUtil';
import ErrorMessage from '../../../util/ErrorMessage';
import Spinner from '../../../util/Spinner';

const CorporateAdmin = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        setIsLoading(true)
        const response = await axios.get(
          `${serverUrl}/api/corporate/corporate/user`,
          header
        );
        setUsers(response.data);
        setIsLoading(false)
      } catch (error) {
        setErrors('Error fetching users:', error);
      }
    };

    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const header = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(
          `${serverUrl}/api/predict/stats/?admin=true`,
          header
        );
        if (response.data.results) {
          setStats(response.data.results);
        } else {
          setStats(response.data);
        }
      } catch (error) {
        setErrors('No Stats Available');
      }
    };

    fetchUsers();
    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.delete(
        `${serverUrl}/api/corporate/corporate/user/${id}`,
        header
      );
      if (response.data) {
        window.location.reload();
        ToastUtil.displaySuccessToast('Corporate User Deleted');
      }
    } catch (error) {
      setErrors(error.data.detail);
      ToastUtil.displayErrorToast('Error deleting');
    }
  };

  return (
    <>
      {isLoading && <Spinner />}

      {errors && <ErrorMessage message={errors} />}

      <div>
        <h2 className="text-success">Corporate Users</h2>
        <div className="m-2">
          <Link to={`/users/dashboard`} className="btn btn-warning m-1">
            <i className="bi bi-arrow-left-circle"></i>Back
          </Link>
          <Link
            to="/users/dashboard/corporate/users"
            className="btn btn-success"
          >
            <i className="bi bi-add"></i> Add User
          </Link>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-sm-9">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.N</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Account type</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.corporate_details}</td>
                      <td>{user.user.email}</td>
                      <td>{user.user.account_type}</td>
                      <td>{user.role}</td>
                      <td>
                        <Link
                          to={`/users/dashboard/corporate/users/${user.id}`}
                          className="btn btn-primary btn-sm me-2"
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-success">Prediction Stats</h2>
      {stats &&
        stats.map((stat, index) => {
          return (
            <div className="container mt-3" key={index}>
              <div className="row align-items-center">
                <div className="col-sm-6">
                  <ul className="list-group">
                    <li className="list-group-item">
                      First Name:
                      <span className="fw-bold">{stat.user.first_name}</span>
                    </li>
                    <li className="list-group-item">
                      Last Name:
                      <span className="fw-bold">{stat.user.last_name}</span>
                    </li>
                    <li className="list-group-item">
                      Email:
                      <span className="fw-bold">{stat.user.email}</span>
                    </li>
                    <li className="list-group-item">
                      Legit:
                      <span className="fw-bold">{stat.legit}</span>
                    </li>
                    <li className="list-group-item">
                      Phishing:
                      <span className="fw-bold">{stat.total - stat.legit}</span>
                    </li>
                    <li className="list-group-item">
                      Total:
                      <span className="fw-bold">{stat.total} </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}

      {
        <div className="container m-3">
          <div className="row ms-6 pagination" >
            <div className="col-sm-12">
              <nav aria-label="...">
                <ul className="pagination">
                  <li className="page-item disabled">
                    <a className="page-link" href="/" tabIndex="-1">
                      Previous
                    </a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="/">
                      1
                    </a>
                  </li>
                  <li className="page-item ">
                    <a className="page-link disabled" href="/">
                      2
                    </a>
                  </li>
                  <li className="page-item disabled">
                    <a className="page-link" href="/">
                      3
                    </a>
                  </li>
                  <li className="page-item disabled">
                    <a className="page-link " href="/">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default CorporateAdmin;
