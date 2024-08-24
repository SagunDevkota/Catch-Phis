import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../../util/Spinner';
import ErrorMessage from '../../../util/ErrorMessage';
import Header from '../../../layout/Header';

const Acl = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [domainType, setDomainType] = useState('whitelist');
  const [domain, setDomain] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchAclData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${serverUrl}/api/acl/acl/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
          params: {
            page: page,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ACL data:', err.response || err.message);
        if (err.response && err.response.status === 401) {
          setError('Unauthorized: Token is invalid or expired. Please log in again.');
        } else {
          setError('Failed to fetch ACL data.');
        }
        setLoading(false);
      }
    };

    fetchAclData();
  }, [serverUrl, page]);

  const handleAddAclEntry = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/acl/acl/`,
        {
          domain_type: domainType,
          domain: domain,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccessMessage('ACL entry added successfully.');
      setDomainType('whitelist');
      setDomain('');
      setData((prevData) => ({
        ...prevData,
        results: [response.data, ...prevData.results],
      }));
    } catch (err) {
      console.error('Error adding ACL entry:', err.response || err.message);
      setError('Failed to add ACL entry.');
    }
  };

  const handleDeleteAclEntry = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      await axios.delete(`${serverUrl}/api/acl/acl/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('ACL entry deleted successfully.');
      setData((prevData) => ({
        ...prevData,
        results: prevData.results.filter((entry) => entry.id !== id),
      }));
    } catch (err) {
      console.error('Error deleting ACL entry:', err.response || err.message);
      setError('Failed to delete ACL entry.');
    }
  };

  return (
    <>
      {loading && <Spinner />}

      {error && <ErrorMessage message={error} />}

      <Header heading={'ACL Management'} color={'text-success'} />

      <div className="card shadow-lg mt-3">
        <div className="card-body">
          <h5 className="card-title">Add New ACL Entry</h5>
          <form onSubmit={handleAddAclEntry}>
            <div className="mb-3">
              <label htmlFor="domainType" className="form-label">
                Domain Type
              </label>
              <select
                id="domainType"
                className="form-select"
                value={domainType}
                onChange={(e) => setDomainType(e.target.value)}
              >
                <option value="whitelist">Whitelist</option>
                <option value="blacklist">Blacklist</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="domain" className="form-label">
                Domain
              </label>
              <input
                type="text"
                className="form-control"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Add Entry
            </button>
          </form>
          {successMessage && (
            <div className="alert alert-success mt-3">
              {successMessage}
            </div>
          )}
        </div>
      </div>

      {data && (
        <div className="card shadow-lg mt-3">
          <div className="card-body">
            <h5 className="card-title">ACL Overview</h5>
            <ul className="list-group">
              <li className="list-group-item">
                Total Count: <span className="fw-bold">{data.count}</span>
              </li>
              {data.results.map((result) => (
                <li key={result.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div>Domain Type: {result.domain_type}</div>
                    <div>Domain: {result.domain}</div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteAclEntry(result.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            {data.previous && (
              <button
                className="btn btn-primary mt-3"
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
            )}
            {data.next && (
              <button
                className="btn btn-primary mt-3"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Acl;
