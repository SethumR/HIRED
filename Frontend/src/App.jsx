import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Homepage from './Pages/HomePage';
import Footer from './Components/Footer';
import ContactPage from './Pages/ContactPage'; 
import AboutUs from './Pages/AboutUs'; // Import the AboutUs page
import 'aos/dist/aos.css';
import Upgrade from './Pages/Upgrade';
import SignIn from './Pages/CreateAccount/Signin';
import Signup from './Pages/CreateAccount/SignupForm';
import Page from './Pages/CVUpload';
import Dashboard from './Pages/Dashboard/Candidate/CandidateDash';
import EditProfile from './Pages/Dashboard/Candidate/EditProfile';
import DashboardPage from './Pages/Dashboard/Company/CompanyDash';
import SignupC from './Pages/CreateAccountCompany/SignupForm';
import SignInCompany from './Pages/CreateAccountCompany/Signin';
import Interview from './Pages/Dashboard/Candidate/InterviewAI';
import JobRolesSetupPage from './Pages/Dashboard/Company/Jobrole';
import ReportsPerformancePage from'./Pages/Dashboard/Company/ReportPerformance';
import CandidatePerformancePage from'./Pages/Dashboard/Company/CandidatePerformance';
import CompanyProfilePage from'./Pages/Dashboard/Company/EditProfile';
import StartMock from './Pages/Dashboard/Candidate/Startmock';



const App = () => {
  return (
    <Router>
      <div className="bg-[#0a0b14] min-h-screen">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<AboutUs />} /> 
          <Route path="/contact" element={<ContactPage />} /> 
          <Route path="/signin" element={<SignIn/>} /> 
          <Route path="/signup" element={<Signup/>} /> 
          <Route path="/upgrade" element={<Upgrade/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>          
          <Route path="/editprofile" element={<EditProfile/>}/>  
          <Route path="/uploadcv" element={<Page/>}/>   
          <Route path="/companydashboard" element={<DashboardPage/>}/>
          <Route path="/signupcompany" element={<SignupC/>}/>
          <Route path="/signincompany" element={<SignInCompany/>}/>
          <Route path="/interview" element={<Interview/>}/>
          <Route path="/jobrolesetuppage" element={<JobRolesSetupPage/>}/>
          <Route path="/reportperformancepage" element={<ReportsPerformancePage/>}/>
          <Route path="/candidateperformancepage" element={<CandidatePerformancePage/>}/>
          <Route path="/companyprofilepage" element={<CompanyProfilePage/>}/>
          <Route path="/startmock" element={<StartMock/>}/>
          </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;