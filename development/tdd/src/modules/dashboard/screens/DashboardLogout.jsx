import React from 'react';
import { ToastUtil } from '../../../util/ToastUtil';

const DashboardLogout = ({ logout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    ToastUtil.displayInfoToast('Logout success!');
  };

  return <>{handleLogout()}</>;
};

export default DashboardLogout;
