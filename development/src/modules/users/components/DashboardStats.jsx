import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import Spinner from '../../../util/Spinner';
import Header from '../../../layout/Header';
import ErrorMessage from '../../../util/ErrorMessage';
import axios from 'axios';

// Register components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DashboardStats = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extensionToken, setExtensionToken] = useState(null);

  // Fetch user profile to get the extension token
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${serverUrl}/api/user/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExtensionToken(response.data.extension_token);
    } catch (err) {
      console.error('Error fetching user profile:', err.response || err.message);
      setError('Failed to fetch user profile');
      setLoading(false);
    }
  };

  // Fetch statistics data
  const fetchData = async (url = `${serverUrl}/api/predict/stats/`) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          extension_token: extensionToken,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error Response:', err.response || err.message);
      if (err.response && err.response.status === 500) {
        setError('Server error, please try again later.');
      } else if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data}`);
      } else {
        setError(err.message || 'Something went wrong');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserProfile();
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (extensionToken) {
      fetchData();
    }
  }, [extensionToken]);

  // Prepare data for charts
  const prepareChartData = () => {
    if (!data || !data.results) return null;
    const labels = data.results.map((_, index) => `Legit ${index + 1}`);
    const legitValues = data.results.map((result) => result.legit);
    const notLegitValues = data.results.map((result) => result.total - result.legit);
    const barData = {
      labels: ['Legit vs Phishing'],
      datasets: [
              {
                label: 'Legit',
                data: legitValues,
                backgroundColor: '#26972a', // Green for Legit
              },
              {
                      label: 'Phising',
                      data: notLegitValues,
                      backgroundColor: '#ef503f', // Red for Not Legit
                    },
        //   {
        //       label: ['Safe'],
        //       data: [legitValues, notLegitValues],
        //       backgroundColor: ['#36a2eb', '#ff6384'],
              
        //  },
       ],
      };

    const pieData = {
        labels: ['Legit', 'Phishing'],
        datasets: [
          {
              data: [legitValues, notLegitValues],
              backgroundColor: ['#26972a', '#ef503f'],
          },
        ],
      }
      return{
        "barData": barData,
        "pieData": pieData
      }

    // return {
    //   labels,
    //   datasets: [
    //     {
    //       label: 'Legit,',
    //       data: [legitValues, notLegitValues],
    //       backgroundColor: ['#4caf50','#f44336'], // Green for Legit
    //     },
    //     // {
    //     //   label: 'Not Legit',
    //     //   data: notLegitValues,
    //     //   backgroundColor: '#f44336', // Red for Not Legit
    //     // },
    //   ],
    // };
  };

  const chartData = prepareChartData();
  

  return (
    <>
      {loading && <Spinner />}

      {error && <ErrorMessage message={error} />}

      <Header heading={'Statistics'} color={'text-success'} />

      {data && (
        <div className="card shadow-lg mt-3">
          <div className="card-body">
            <h5 className="card-title">Statistics Overview</h5>
            <ul className="list-group">
              {/* <li className="list-group-item">
                Count: <span className="fw-bold">{data.count}</span>
              </li> */}
              {data.results.map((result, index) => (
                <li key={index} className="list-group-item">
                  <div>Legit: {result.legit}</div>
                  <div>Phishing: {result.total - result.legit}</div>
                  <div>Total: {result.total}</div>
                </li>
              ))}
            </ul>
            {chartData && (
              <div className="row mt-3">
                <div className="col-6">
                  <h6>Pie Chart</h6>
                  <div className="chart-container" style={{ width: '50%', margin: 'auto' }}>
                    <Pie data={chartData["pieData"]} />
                  </div>
                </div>
                <div className="col-6">
                  <h6>Bar Chart</h6>
                  <div className="chart-container">
                    <Bar data={chartData["barData"]} />
                  </div>
                </div>
              </div>
            )}
            {data.previous && (
              <button
                className="btn btn-primary mt-3"
                onClick={() => fetchData(data.previous)}
              >
                Previous
              </button>
            )}
            {data.next && (
              <button
                className="btn btn-primary mt-3"
                onClick={() => fetchData(data.next)}
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

export default DashboardStats;
