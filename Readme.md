# Catch-Phis
## Overview
This project is a phishing detection system designed to identify and flag potential phishing attempts using a Django-based backend. The system leverages machine learning algorithms and various heuristics to analyze URLs for signs of phishing.

## Features
* URL Analysis: Detect phishing attempts by analyzing URL structures and features.
* Machine Learning Integration: Utilize trained models (SVC/XGBOOST) for phishing detection.
* User Dashboard: Provide an interface for users to view website interaction stats.
* Admin Interface: Manage and configure the system from a Django-powered admin panel.
* Corporate Account Management: Enable the creation of corporate accounts for centralized tracking and management of employee phishing detection statistics.
* Access Control List Management: Allow manual addition of domains to the Access Control List, enabling users to classify domains as either whitelisted or blacklisted.
* Verified Domains Repository: Maintain a monthly updated repository of verified domains to ensure an accurate and current list of legitimate domains.
* Payment Integration: Integrate Stripe payment gateway for corporate subscription management.

## Technologies Used
Django: For the backend framework.
Python: Programming language used for development.
Scikit-learn / xgboost : For machine learning algorithms.
PostgreSQL: Database for storing user data and analysis results.
React js: JavaScript library for building dynamic user interfaces.
Git/Github: Version control and repository management.
Rabbit Mq: Message broker for task communication.
Celery: For asynchronous task processing.
Redis: In-memory data structure store for caching.
Nginx: Reverse proxy server for handling requests.
Docker: Containerization for consistent development environments.

## Installation 
### Prerequisites
Python 3.10 or higher
pip (Python package installer)
Virtualenv (optional but recommended)

## Steps

1. Clone the repository
```
git clone https://github.com/SagunDevkota/Catch-Phis.git
cd Catch-Phis
```
2. Create a `.container.env` file inside the `Catch-Phis/backend` folder. This file will store environment variables for the containerized services:
```bash
touch backend/.container.env
```
```env
DJANGO_SETTINGS_MODULE=

POSTGRES_HOST=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=


RABBITMQ_DEFAULT_USER=
RABBITMQ_DEFAULT_PASS=
```

3. Create a `.env` file inside the `Catch-Phis/backend/app`directory. This file will store environment variables for the Django application:
```bash
touch backend/app/.env
```
```env
DJANGO_DEBUG=
SECRET_KEY=

CELERY_BROKER=
CELERY_BACKEND=

host=
email=
password=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

FINISH_URL=
```

4. Start the docker compose
```
docker-compose up
```

## Configuration
Update the base/production/test.py file for any configuration changes if required:

## Usage
1. Access the Application

Open your web browser and navigate to `http://127.0.0.1/` to interact with the phishing detection system.

2. Admin Panel

Access the Django admin panel at `http://127.0.0.1/admin/` to manage users, view logs, and configure the system.

3. API Endpoints
Open `http://127.0.0.1/api/docs/` for api documentation.

4. Database Debugging
Open `http://127.0.0.1/silk/` for database request (for test version).

5. Static Files
Open `http://127.0.0.1/static/` to serve django static Files


## Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [License](https://github.com/SagunDevkota/Catch-Phis?tab=MIT-1-ov-file#readme) file for details.

Contact
For any inquiries or issues, please contact [Email](mailto:sagundevyt@gmail.com)