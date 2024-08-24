import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../../util/Spinner';
import ErrorMessage from '../../../util/ErrorMessage';
import Header from '../../../layout/Header';
import { ToastUtil } from '../../../util/ToastUtil';

const CorporateUsers = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;
  const navigate = useNavigate();
  
  const formRef = useRef(null); // Create a ref for the form

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [updateFormValues, setUpdateFormValues] = useState({
    role: 'employee',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchCorporateUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrors('No token found. Please login.');
          navigate('/users/login');
          return;
        }

        const response = await axios.get(`${serverUrl}/api/corporate/corporate/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.length > 0) {
          setUsers(response.data);
        } else {
          setErrors('Corporate users not found.');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrors('Unauthorized access. Please login.');
          ToastUtil.displayErrorToast('Unauthorized access!');
          navigate('/users/login');
        } else {
          setErrors('Failed to fetch corporate users. Please try again.');
          ToastUtil.displayErrorToast('Failed to fetch users!');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCorporateUsers();
  }, [serverUrl, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors('No token found. Please login.');
        navigate('/users/login');
        return;
      }

      if (!formValues.first_name || !formValues.last_name || !formValues.phone || !formValues.email || !formValues.password) {
        setErrors('Please fill in all required fields.');
        return;
      }

      const postData = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        phone: formValues.phone,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
      };

      console.log('Sending data:', postData);

      const response = await axios.post(`${serverUrl}/api/corporate/corporate/user/`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      ToastUtil.displaySuccessToast('Corporate user created successfully!');
      navigate(`/corporate-users/${response.data.id}`);
    } catch (error) {
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.email?.[0] || 'Failed to create corporate user. Please try again.';
      setErrors(errorMessage);
      ToastUtil.displayErrorToast(errorMessage);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editId) {
      setErrors('No user ID found. Please select a user to edit.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors('No token found. Please login.');
        navigate('/users/login');
        return;
      }

      const putData = {
        role: updateFormValues.role,
      };

      console.log('Updating data:', putData);

      await axios.put(`${serverUrl}/api/corporate/corporate/user/${editId}/`, putData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      ToastUtil.displaySuccessToast('Corporate user updated successfully!');
      setIsEditing(false);
      setEditId(null);
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the form after update
    } catch (error) {
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.role?.[0] || 'Failed to update corporate user. Please try again.';
      setErrors(errorMessage);
      ToastUtil.displayErrorToast(errorMessage);
    }
  };

  const handlePatchSubmit = async (e) => {
    e.preventDefault();

    if (!editId) {
      setErrors('No user ID found. Please select a user to edit.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors('No token found. Please login.');
        navigate('/users/login');
        return;
      }

      const patchData = {
        role: updateFormValues.role,
      };

      console.log('Updating data:', patchData);

      await axios.patch(`${serverUrl}/api/corporate/corporate/user/${editId}/`, patchData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      ToastUtil.displaySuccessToast('Corporate user role updated successfully!');
      setIsEditing(false);
      setEditId(null);
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the form after update
    } catch (error) {
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.role?.[0] || 'Failed to update corporate user role. Please try again.';
      setErrors(errorMessage);
      ToastUtil.displayErrorToast(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors('No token found. Please login.');
        navigate('/users/login');
        return;
      }

      await axios.delete(`${serverUrl}/api/corporate/corporate/user/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      ToastUtil.displaySuccessToast('Corporate user deleted successfully!');
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error response:', error.response);
      const errorMessage = 'Failed to delete corporate user. Please try again.';
      setErrors(errorMessage);
      ToastUtil.displayErrorToast(errorMessage);
    }
  };

  const handleEditClick = (user) => {
    setUpdateFormValues({
      role: user.role,
    });
    setEditId(user.id);
    setIsEditing(true);
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the form when editing
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setIsEditing(false);
    setFormValues({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
      role: 'employee',
    });
  };

  return (
    <>
      {isLoading && <Spinner />}

      <Header heading={'Corporate Users'} color={'text-primary'} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-8">
            {errors ? (
              <ErrorMessage message={errors} />
            ) : (
              <>
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="card shadow-sm mb-4">
                      <div className="card-body">
                        <h3 className="card-title">{user.user.email}</h3>
                        <div className="card-text">
                          <p><strong>Full Name:</strong> {user.user.first_name} {user.user.last_name}</p>
                          <p><strong>Email:</strong> {user.user.email}</p>
                          <p><strong>Phone:</strong> {user.user.phone}</p>
                          <p><strong>Role:</strong> {user.role}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <button className="btn btn-primary" onClick={() => handleEditClick(user)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No corporate users found.</p>
                )}
              </>
            )}
          </div>
          <div className="col-sm-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {isCreating || isEditing ? (
                  <>
                    <h5 className="card-title">{isCreating ? 'Create New User' : 'Update User'}</h5>
                    {errors && <ErrorMessage message={errors} />}
                    <form ref={formRef} onSubmit={isCreating ? handleCreateSubmit : handleUpdateSubmit}>
                      {isCreating && (
                        <>
                          <div className="mb-3">
                            <label htmlFor="first_name" className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="first_name"
                              name="first_name"
                              value={formValues.first_name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="last_name" className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="last_name"
                              name="last_name"
                              value={formValues.last_name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input
                              type="text"
                              className="form-control"
                              id="phone"
                              name="phone"
                              value={formValues.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={formValues.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              name="password"
                              value={formValues.password}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </>
                      )}
                      <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select
                          id="role"
                          name="role"
                          className="form-select"
                          value={isCreating ? formValues.role : updateFormValues.role}
                          onChange={isCreating ? handleInputChange : handleUpdateInputChange}
                          required
                        >
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        {isCreating ? 'Create User' : 'Update User'}
                      </button>
                    </form>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={handleCreateClick}>Create New User</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporateUsers;
