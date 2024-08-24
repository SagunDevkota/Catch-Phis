import './App.css';
import NavBar from './navbar/NavBar'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './layout/Home'
import Login from './modules/users/components/Login';
import Register from './modules/users/components/Register';
import { ToastContainer } from 'react-toastify';
import Dashboard from './modules/dashboard/screens/Dashboard';
import ActivateAccount from './modules/users/components/ActivateAccount';
import DashboardProfileUpdate from './modules/dashboard/profile/DashboardProfileUpdate';

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
          <Route path={'/users/dashboard/profile/edit/:id'} element={<DashboardProfileUpdate />} />
          

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
