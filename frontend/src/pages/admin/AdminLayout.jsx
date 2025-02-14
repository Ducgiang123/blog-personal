import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

const AdminLayout = () => {
  const [showNotification, setShowNotification] = useState(false); // Thêm state cho ô thông báo
  const { user } = useSelector((state) => state.auth);

  if (!user || (user.role !== 'quản trị viên' && user.role !== 'cộng tác viên')) {
    alert("VAI TRÒ CỦA BẠN KHÔNG CHO PHÉP TRUY CẬP TÍNH NĂNG NÀY!");
    return <Navigate to="" />;
}

  return (
      <div className={`container mx-auto flex flex-col md:flex-row gap-4 items-start justify-start ${showNotification ? 'bg-gray-800' : ''}`}>

      
      <header className='lg:w-1/5 sm:2/5 w-full'>
        <div className="admin-navigation">
          <AdminNavigation />
        </div>
      </header>
        <main className='p-8 bg-white w-full'>
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
