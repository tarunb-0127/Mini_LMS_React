import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Home';
import AdminLogin from './Pages/AdminLogin';
import AdminHome from './Pages/AdminHome';
import ManageUsers from './Pages/ManagerUsers';
import SetupPassword from './Pages/SetupPassword';
import LoginPage from './Pages/LoginPage';
import LearnerHome from './Pages/LearnerHome';
import TrainerHome from './Pages/TrainerHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* You can add more routes here later */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path='/admin-home' element={<AdminHome></AdminHome>}/>
        <Route path='/admin/users' element={<ManageUsers></ManageUsers>}/>
        <Route path="/reset-password" element={<SetupPassword />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path ="/learner/home" element={<LearnerHome></LearnerHome>}/>
        <Route path ="/trainer/home" element={<TrainerHome/>}/>

        
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
