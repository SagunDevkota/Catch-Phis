import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../../util/Spinner';
import ErrorMessage from '../../../util/ErrorMessage';
import Header from '../../../layout/Header';
import { ToastUtil } from '../../../util/ToastUtil';

const Corporate = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  
  const formRef = useRef(null); // Create a ref for the form

  const [corporates, setCorporates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const [formValues, setFormValues] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    subscribed: 'false',
    subscription_expires_at: ''
  });
  const [updateFormValues, setUpdateFormValues] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    subscribed: 'false',
    subscription_expires_at: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchCorporateDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrors('No token found. Please login.');
          navigate('/users/login');
          return;
        }

        const response = await axios.get(`${serverUrl}/api/corporate/corporate/detail/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.length > 0) {
          setCorporates(response.data);
        } else {
          setErrors('Corporate details not found.');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrors('Unauthorized access. Please login.');
          ToastUtil.displayErrorToast('Unauthorized access!');
          navigate('/users/login');
        } else {
          setErrors('Failed to fetch corporate details. Please try again.');
          ToastUtil.displayErrorToast('Failed to fetch details!');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCorporateDetails();
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

      if (!formValues.company_name || !formValues.contact_email || !formValues.contact_phone) {
        setErrors('Please fill in all required fields.');
        return;
      }

      if (formValues.subscribed === 'true' && !formValues.subscription_expires_at) {
        setErrors('Please provide subscription expiry date.');
        return;
      }

      const formattedExpiresAt = formValues.subscription_expires_at ? new Date(formValues.subscription_expires_at).toISOString().split('T')[0] : '';

      const postData = {
        company_name: formValues.company_name,
        contact_email: formValues.contact_email,
        contact_phone: formValues.contact_phone,
        subscribed: formValues.subscribed === 'true',
        subscription_expires_at: formattedExpiresAt,
      };

      console.log('Sending data:', postData);

      const response = await axios.post(`${serverUrl}/api/corporate/corporate/detail/`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      ToastUtil.displaySuccessToast('New corporate account created successfully!');
      navigate(`/corporates/${response.data.id}`);
    } catch (error) {
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.contact_phone?.[0] || error.response?.data?.subscription_expires_at?.[0] || 'Failed to create new corporate account. Please try again.';
      setErrors(errorMessage);
      ToastUtil.displayErrorToast(errorMessage);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editId) {
      setErrors('No record ID found. Please select a record to edit.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors('No token found. Please login.');
        navigate('/users/login');
        return;
      }

      if (!updateFormValues.company_name || !updateFormValues.contact_email || !updateFormValues.contact_phone) {
        setErrors('Please fill in all required fields.');
        return;
      }

      if (updateFormValues.subscribed === 'true' && !updateFormValues.subscription_expires_at) {
        setErrors('Please provide subscription expiry date.');
        return;
      }

      const formattedExpiresAt = updateFormValues.subscription_expires_at ? new Date(updateFormValues.subscription_expires_at).toISOString().split('T')[0] : '';

      const putData = {
        company_name: updateFormValues.company_name,
        contact_email: updateFormValues.contact_email,
        contact_phone: updateFormValues.contact_phone,
        subscribed: updateFormValues.subscribed === 'true',
        subscription_expires_at: formattedExpiresAt,
      };

      console.log('Updating data:', putData);

      const response = await axios.patch(`${serverUrl}/api/corporate/corporate/detail/${editId}/`, putData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      ToastUtil.displaySuccessToast('Corporate account updated successfully!');
      setIsEditing(false);
      setEditId(null);
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the form after update
    } catch (error) {
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.contact_phone?.[0] || error.response?.data?.subscription_expires_at?.[0] || 'Failed to update corporate account. Please try again.';
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

      await axios.delete(`${serverUrl}/api/corporate/corporate/detail/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      ToastUtil.displaySuccessToast('Corporate account deleted successfully!');
      setCorporates(corporates.filter(corporate => corporate.id !== id));
    } catch (error) {
      console.error('Error response:', error.response);
      const errorMessage = 'Failed to delete corporate account. Please try again.';
      setErrors(errorMessage);
      ToastUtil.displayErrorToast(errorMessage);
    }
  };

  const handleEditClick = (corporate) => {
    setUpdateFormValues({
      company_name: corporate.company_name,
      contact_email: corporate.contact_email,
      contact_phone: corporate.contact_phone,
      subscribed: corporate.subscribed ? 'true' : 'false',
      subscription_expires_at: corporate.subscription_expires_at ? new Date(corporate.subscription_expires_at).toISOString().split('T')[0] : '',
    });
    setEditId(corporate.id);
    setIsEditing(true);
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the form when editing
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setIsEditing(false);
    setUpdateFormValues({
      company_name: '',
      contact_email: '',
      contact_phone: '',
      subscribed: 'false',
      subscription_expires_at: '',
    });
  };

  return (
    <>
      {isLoading && <Spinner />}

      <Header heading={'Corporate Details'} color={'text-primary'} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-8">
            {errors ? (
              <ErrorMessage message={errors} />
            ) : (
              <>
                {corporates.length > 0 ? (
                  corporates.map((corporate) => (
                    <div key={corporate.id} className="card shadow-sm mb-4">
                      <div className="card-body">
                        <h3 className="card-title">{corporate.company_name}</h3>
                        <div className="card-text">
                          <p><strong>Contact Email:</strong> {corporate.contact_email}</p>
                          <p><strong>Contact Phone:</strong> {corporate.contact_phone}</p>
                          <p><strong>Created At:</strong> {new Date(corporate.created_at).toLocaleString()}</p>
                          <p><strong>Activated:</strong> <span className={corporate.activated ? 'text-success' : 'text-danger'}>{corporate.activated ? 'Yes' : 'No'}</span></p>
                          <p><strong>Subscribed:</strong> <span className={corporate.subscribed ? 'text-success' : 'text-danger'}>{corporate.subscribed ? 'Yes' : 'No'}</span></p>
                          {corporate.subscription_expires_at && <p><strong>Subscription Expires At:</strong> {new Date(corporate.subscription_expires_at).toLocaleDateString()}</p>}
                        </div>
                        <div className="d-flex justify-content-between">
                          <button className="btn btn-primary" onClick={() => handleEditClick(corporate)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => handleDelete(corporate.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No corporate details available.</p>
                )}
              </>
            )}
          </div>
          <div className="col-sm-4">
            {isCreating ? (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title">Create New Corporate Account</h4>
                  <form onSubmit={handleCreateSubmit}>
                    <div className="form-group mb-3">
                      <label htmlFor="company_name">Company Name</label>
                      <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        className="form-control"
                        value={formValues.company_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="contact_email">Contact Email</label>
                      <input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        className="form-control"
                        value={formValues.contact_email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="contact_phone">Contact Phone</label>
                      <input
                        type="text"
                        id="contact_phone"
                        name="contact_phone"
                        className="form-control"
                        value={formValues.contact_phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="subscribed">Subscribed</label>
                      <select
                        id="subscribed"
                        name="subscribed"
                        className="form-control"
                        value={formValues.subscribed}
                        onChange={handleInputChange}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    {formValues.subscribed === 'true' && (
                      <div className="form-group mb-3">
                        <label htmlFor="subscription_expires_at">Subscription Expires At</label>
                        <input
                          type="date"
                          id="subscription_expires_at"
                          name="subscription_expires_at"
                          className="form-control"
                          value={formValues.subscription_expires_at}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary">Create</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsCreating(false)}>Cancel</button>
                  </form>
                </div>
              </div>
            ) : isEditing ? (
              <div className="card shadow-sm" ref={formRef}> {/* Add ref here */}
                <div className="card-body">
                  <h4 className="card-title">Edit Corporate Account</h4>
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="form-group mb-3">
                      <label htmlFor="company_name">Company Name</label>
                      <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        className="form-control"
                        value={updateFormValues.company_name}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="contact_email">Contact Email</label>
                      <input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        className="form-control"
                        value={updateFormValues.contact_email}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="contact_phone">Contact Phone</label>
                      <input
                        type="text"
                        id="contact_phone"
                        name="contact_phone"
                        className="form-control"
                        value={updateFormValues.contact_phone}
                        onChange={handleUpdateInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="subscribed">Subscribed</label>
                      <select
                        id="subscribed"
                        name="subscribed"
                        className="form-control"
                        value={updateFormValues.subscribed}
                        onChange={handleUpdateInputChange}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    {updateFormValues.subscribed === 'true' && (
                      <div className="form-group mb-3">
                        <label htmlFor="subscription_expires_at">Subscription Expires At</label>
                        <input
                          type="date"
                          id="subscription_expires_at"
                          name="subscription_expires_at"
                          className="form-control"
                          value={updateFormValues.subscription_expires_at}
                          onChange={handleUpdateInputChange}
                        />
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary">Update</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
                  </form>
                </div>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleCreateClick}>Create New Corporate Account</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Corporate;
