import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ToasterHost from "./components/ToasterHost.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CandidateProfile from "./pages/CandidateProfile.jsx";
import CandidateApplications from "./pages/CandidateApplications.jsx";
import RecruiterJobs from "./pages/RecruiterJobs.jsx";
import RecruiterJobForm from "./pages/RecruiterJobForm.jsx";
import RecruiterApplicants from "./pages/RecruiterApplicants.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminJobs from "./pages/AdminJobs.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatbotWidget from "./components/ChatbotWidget.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="app-bg" />
      <Navbar />
      <ToasterHost />
      <ChatbotWidget />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Candidate */}
        <Route
          path="/candidate"
          element={
            <ProtectedRoute roles={["candidate"]}>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate/applications"
          element={
            <ProtectedRoute roles={["candidate"]}>
              <CandidateApplications />
            </ProtectedRoute>
          }
        />

        {/* Recruiter */}
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute roles={["recruiter", "admin"]}>
              <RecruiterJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/new"
          element={
            <ProtectedRoute roles={["recruiter", "admin"]}>
              <RecruiterJobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:id/edit"
          element={
            <ProtectedRoute roles={["recruiter", "admin"]}>
              <RecruiterJobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={
            <ProtectedRoute roles={["recruiter", "admin"]}>
              <RecruiterApplicants />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminJobs />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

