import React, { useState, useEffect } from 'react';
import Spinner from '../../../util/Spinner';
import ErrorMessage from '../../../util/ErrorMessage';
import axios from 'axios';

const Post = () => {
  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;
  const [url, setUrl] = useState('');
  const [favicon, setFavicon] = useState(0);
  const [hasTitle, setHasTitle] = useState(0);
  const [title, setTitle] = useState('');
  const [hasCopyrightInfo, setHasCopyrightInfo] = useState(0);
  const [hasSocialMediaLinks, setHasSocialMediaLinks] = useState(0);
  const [hasDescription, setHasDescription] = useState(0);
  const [hasExternalFormSubmit, setHasExternalFormSubmit] = useState(0);
  const [iframe, setIframe] = useState(0);
  const [hasHiddenField, setHasHiddenField] = useState(0);
  const [hasPasswordField, setHasPasswordField] = useState(0);
  const [noOfImages, setNoOfImages] = useState(0);
  const [noOfCss, setNoOfCss] = useState(0);
  const [noOfJs, setNoOfJs] = useState(0);
  const [noOfSelfRef, setNoOfSelfRef] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState('');
  const [extensionToken, setExtensionToken] = useState('');

  // Fetch profile data to get token and extensionToken
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token'); // Get token from local storage
      try {
        const response = await axios.get(`${serverUrl}/api/user/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setToken(token);
        setExtensionToken(response.data.extension_token); // Extract extension token
      } catch (err) {
        setError('Failed to fetch profile data.');
      }
    };

    fetchProfileData();
  }, [serverUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const validator = '455554'; // Replace with your actual validator string

    try {
      const response = await axios.post(
        `${serverUrl}/api/predict/predict/`,
        {
          url,
          favicon,
          has_title: hasTitle,
          title,
          has_copyright_info: hasCopyrightInfo,
          has_social_media_links: hasSocialMediaLinks,
          has_description: hasDescription,
          has_external_form_submit: hasExternalFormSubmit,
          iframe,
          has_hidden_field: hasHiddenField,
          has_password_field: hasPasswordField,
          no_of_images: noOfImages,
          no_of_css: noOfCss,
          no_of_js: noOfJs,
          no_of_self_ref: noOfSelfRef,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header with token
            'extension-token': extensionToken, // Use fetched extension token
            'validator': validator, // Ensure this is correct
          },
        }
      );
      setSuccess('Data submitted successfully!');
      setLoading(false);
    } catch (err) {
      const errorMsg = err.response && err.response.data
        ? err.response.data.detail || 'Something went wrong'
        : 'Something went wrong';
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Submit URL for Prediction</h2>
      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="url" className="form-label">
            URL
          </label>
          <input
            type="text"
            className="form-control"
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        {/* Repeat similar input fields for each required data point */}
        <div className="mb-3">
          <label htmlFor="favicon" className="form-label">
            Favicon
          </label>
          <input
            type="number"
            className="form-control"
            id="favicon"
            name="favicon"
            value={favicon}
            onChange={(e) => setFavicon(e.target.value)}
            required
          />
        </div>
        {/* Add other fields similarly */}
        <div className="mb-3">
          <label htmlFor="hasTitle" className="form-label">
            Has Title
          </label>
          <input
            type="number"
            className="form-control"
            id="hasTitle"
            name="hasTitle"
            value={hasTitle}
            onChange={(e) => setHasTitle(e.target.value)}
            required
          />
        </div>

        {/* Add more input fields for the remaining properties */}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Post;
