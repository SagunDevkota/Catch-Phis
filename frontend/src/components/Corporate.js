import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const Corporate = () => {
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/corporate/corporate/detail')
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the data!', error);
          });
      }, []);
    return (
        <div>
            <h2>corporate</h2>
            <p></p>
        </div>
    );
}

export default Corporate;