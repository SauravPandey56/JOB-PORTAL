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
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminJobs from "./pages/AdminJobs.jsx";
import AdminRecruiters from "./pages/AdminRecruiters.jsx";
import AdminApplications from "./pages/AdminApplications.jsx";
import AdminFeedback from "./pages/AdminFeedback.jsx";
import AdminReports from "./pages/AdminReports.jsx";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage.jsx";
import AdminModeration from "./pages/AdminModeration.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatbotWidget from "./components/ChatbotWidget.jsx";

export default function App() {
  return (
    <div className="app-shell-bg min-h-screen">
      <Navbar />
      <ToasterHost />
      <ChatbotWidget />
      <main id="main-content" className="outline-none" tabIndex={-1}>
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

        {/* Admin — nested layout + routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="recruiters" element={<AdminRecruiters />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </main>
    </div>
  );
}

