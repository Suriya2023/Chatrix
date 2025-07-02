import React, { useEffect } from 'react'
import { useTHEME_COLORStore } from './store/useThemeStore' // ✅ theme store
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkinAuth, isCheckingAuth,onlineUsers } = useAuthStore()
  const { theme } = useTHEME_COLORStore()

  console.log(onlineUsers)
  // ✅ theme apply to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkinAuth();
  }, [checkinAuth]);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex gap-2">
          {['red', 'orange', 'yellow', 'green', 'blue', 'purple'].map((color) => (
            <div key={color} className="group relative">
              <span className={`loading loading-bars loading-sm bg-${color}-500 z-10 relative`} />
              <div
                className={`absolute inset-0 -z-10 group-hover:bg-${color}-100 transition-colors duration-300 rounded`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
