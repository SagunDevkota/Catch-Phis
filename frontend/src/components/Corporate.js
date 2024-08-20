import React, { useEffect, useState } from 'react';
import './Corporate.css'; // Import the CSS file

const Corporate = () => {
    const [corporateData, setCorporateData] = useState([]);
    const [error, setError] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MTY2NDAxLCJpYXQiOjE3MjQxNjQzMDEsImp0aSI6ImQyNTc1NmQ0MmE5MzQ3MzViYmUyYmUwZGQ0MDNlYzFiIiwidXNlcl9pZCI6M30.6qZ5xWqiO1JteRgMz9wAZtyUO7fUx2MDGyXN36Lbc-c";

        fetch('http://127.0.0.1:8000/api/corporate/corporate/detail', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            setCorporateData(data);
        })
        .catch(error => {
            setError('There was an error fetching the data!');
            console.error('Error:', error);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MTY2NDAxLCJpYXQiOjE3MjQxNjQzMDEsImp0aSI6ImQyNTc1NmQ0MmE5MzQ3MzViYmUyYmUwZGQ0MDNlYzFiIiwidXNlcl9pZCI6M30.6qZ5xWqiO1JteRgMz9wAZtyUO7fUx2MDGyXN36Lbc-c";
        const postData = {
            company_name: companyName,
            contact_email: contactEmail,
            contact_phone: contactPhone
        };
    
        fetch('http://127.0.0.1:8000/api/corporate/corporate/detail/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    throw new Error(`Server Error: ${errorText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Post Response:', data);
            setCorporateData([...corporateData, data]);
            setCompanyName('');
            setContactEmail('');
            setContactPhone('');
            setLoading(false);
        })
        .catch(error => {
            setError(`There was an error submitting the data: ${error.message}`);
            console.error('Error:', error);
            setLoading(false);
        });
    };
    
    

    return (
        <div className="corporate-container">
            <h2 className="title">Corporate Information</h2>
            {error && <p className="error">{error}</p>}
            {loading ? (
                <p className="loading">Loading...</p>
            ) : (
                <>
                    {corporateData.length === 0 ? (
                        <p className="loading">Loading...</p>
                    ) : (
                        <div className="data-container">
                            {corporateData.map((item, index) => (
                                <div key={index} className="data-card">
                                    <h3 className="card-title">Company Details</h3>
                                    <p><strong>Name:</strong> {item.company_name || 'Not available'}</p>
                                    <p><strong>Email Address:</strong> {item.contact_email || 'Not available'}</p>
                                    <p><strong>Phone:</strong> {item.contact_phone || 'Not available'}</p>
                                    <p><strong>Activated:</strong> {item.activated ? 'Yes' : 'No'}</p>
                                    <p><strong>Created At:</strong> {item.created_at ? new Date(item.created_at).toLocaleString() : 'Not available'}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <form className="corporate-form" onSubmit={handleSubmit}>
                        <h3 className="form-title">Add New Corporate</h3>
                        <label>
                            Company Name:
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Contact Email:
                            <input
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Contact Phone:
                            <input
                                type="text"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit" disabled={loading}>Submit</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Corporate;
