import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Spinner from '../../../util/Spinner';
import ErrorMessage from '../../../util/ErrorMessage';

const Finish = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  // Use React Router's useLocation hook to access the query parameters
  const location = useLocation();

  // Function to extract the session ID from the URL
  const getSessionIdFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('session_id');
  };

  useEffect(() => {
    const fetchSessionStatus = async () => {
      try {
        const sessionId = getSessionIdFromUrl(); // Extract the session ID from the URL
        const token = localStorage.getItem('token');
        const response = await axios.get(`${serverUrl}/api/payment/session-status/`, {
          params: { session_id: sessionId },
          headers: {
            Authorization: `Bearer ${token}`,
            'accept': '*/*',
          },
        });

        setStatus(response.data);
      } catch (err) {
        setError('Failed to retrieve session status.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionStatus();
  }, [serverUrl]);

  return (
    <div>
      <h2>Payment Status</h2>
      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}
      {status && (
        <div>
          <p>
      We appreciate your business! A confirmation email will be sent to <span id="customer-email"></span>.

      If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
    </p>
          {/* Add more fields based on the response structure */}
        </div>
      )}
    </div>
  );
};

export default Finish;
