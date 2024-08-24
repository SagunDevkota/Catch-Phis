import './App.css';
import NavBar from './navbar/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './layout/Home';
import Login from './modules/users/components/Login';
import Register from './modules/users/components/Register';
import { ToastContainer } from 'react-toastify';
import Dashboard from './modules/dashboard/screens/Dashboard';
import ActivateAccount from './modules/users/components/ActivateAccount';
import DashboardProfileUpdate from './modules/dashboard/profile/DashboardProfileUpdate';
import CorporateRegister from './modules/dashboard/corporate/CorporateRegister';
import ActivateCorporate from './modules/dashboard/corporate/ActivateCorporate';
import CorporateUpdate from './modules/dashboard/corporate/CorporateUpdate';
import CorporateAdmin from './modules/dashboard/corporate/CorporateAdmin';
import CorporateUserRegister from './modules/dashboard/corporate/users/CorporateUserRegister';
import CorporateUserUpdate from './modules/dashboard/corporate/users/CorporateUserUpdate';
import Corporate from './modules/users/components/Corporate';
import CorporateUsers from './modules/users/components/CorporateUsers';
import DashboardStats from './modules/users/components/DashboardStats';
import Post from './modules/users/components/Post';
import Acl from './modules/users/components/Acl';
import Payment from './modules/users/components/Payment';
import Finish from './modules/users/components/Finish';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="App">
        <NavBar header="Catch Phis" color="bg-dark" />
        <Routes>
          <Route path={'/'} element={<Home />} />

          <Route path={'/users/register'} element={<Register />} />
          <Route path={'/users/activate'} element={<ActivateAccount />} />
          <Route path={'/users/login'} element={<Login />} />

          <Route path={'/users/dashboard'} element={<Dashboard />} />
          <Route
            path={'/users/dashboard/profile/edit/:id'}
            element={<DashboardProfileUpdate />}
          />

          <Route
            path={'/users/dashboard/corporate/register'}
            element={<CorporateRegister />}
          />
          <Route
            path={'/users/dashboard/corporate/activate'}
            element={<ActivateCorporate />}
          />
          <Route
            path={'/users/dashboard/corporate/edit/:id'}
            element={<CorporateUpdate />}
          />
          <Route
            path={'/users/dashboard/corporate/admin'}
            element={<CorporateAdmin />}
          />

          <Route
            path={'/users/dashboard/corporate/users'}
            element={<CorporateUserRegister />}
          />
          <Route
            path={'/users/dashboard/corporate/users/:id'}
            element={<CorporateUserUpdate />}
          />
          <Route path={'/users/corporate'} element={<Corporate />} />
          <Route path={'/users/corporate-user'} element={<CorporateUsers />} />
          <Route path={'/users/stats'} element={<DashboardStats />} />
          <Route path={'/users/post'} element={<Post />} />
          <Route path={'/users/payment'} element={<Payment />} />
          <Route path={'/users/finish'} element={<Finish />} />
          <Route path={'/users/acl'} element={<Acl />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
