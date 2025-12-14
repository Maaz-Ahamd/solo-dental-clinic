import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientManager from './components/PatientManager';
import Appointments from './components/Appointments';
import Treatments from './components/Treatments';
import Payments from './components/Payments';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientManager />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
