import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ToasterHost from "./components/ToasterHost.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatbotWidget from "./components/ChatbotWidget.jsx";
import CandidateLayout from "./layouts/CandidateLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import MinimalBackground from "./components/MinimalBackground.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const Jobs = lazy(() => import("./pages/Jobs.jsx"));
const JobDetails = lazy(() => import("./pages/JobDetails.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const CandidateProfile = lazy(() => import("./pages/CandidateProfile.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const CandidateApplications = lazy(() => import("./pages/CandidateApplications.jsx"));
const CandidateSavedJobs = lazy(() => import("./pages/CandidateSavedJobs.jsx"));
const CandidateNotifications = lazy(() => import("./pages/CandidateNotifications.jsx"));
const RecruiterJobs = lazy(() => import("./pages/RecruiterJobs.jsx"));
const RecruiterJobForm = lazy(() => import("./pages/RecruiterJobForm.jsx"));
const RecruiterApplicants = lazy(() => import("./pages/RecruiterApplicants.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const AdminUsers = lazy(() => import("./pages/AdminUsers.jsx"));
const AdminJobs = lazy(() => import("./pages/AdminJobs.jsx"));
const AdminRecruiters = lazy(() => import("./pages/AdminRecruiters.jsx"));
const AdminApplications = lazy(() => import("./pages/AdminApplications.jsx"));
const AdminFeedback = lazy(() => import("./pages/AdminFeedback.jsx"));
const AdminReports = lazy(() => import("./pages/AdminReports.jsx"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage.jsx"));
const AdminModeration = lazy(() => import("./pages/AdminModeration.jsx"));
const AdminSettings = lazy(() => import("./pages/AdminSettings.jsx"));
const AdminCompanies = lazy(() => import("./pages/AdminCompanies.jsx"));
const AdminNotifications = lazy(() => import("./pages/AdminNotifications.jsx"));
const AdminActivityLogs = lazy(() => import("./pages/AdminActivityLogs.jsx"));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="animate-pulse rounded-2xl border border-slate-200 bg-white px-10 py-8 text-sm font-medium text-slate-500 shadow-card">
        Loading…
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="app-shell-bg min-h-screen">
      <MinimalBackground>
        {!isAdmin && <Navbar />}
        <ToasterHost />
        {!isAdmin && location.pathname !== "/" && <ChatbotWidget />}
        <main id="main-content" className="outline-none" tabIndex={-1}>
          <Suspense fallback={<PageFallback />}>
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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/candidate"
                element={
                  <ProtectedRoute roles={["candidate"]}>
                    <CandidateLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CandidateProfile />} />
                <Route path="applications" element={<CandidateApplications />} />
                <Route path="saved-jobs" element={<CandidateSavedJobs />} />
                <Route path="notifications" element={<CandidateNotifications />} />
              </Route>

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
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="moderation" element={<AdminModeration />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="activity-logs" element={<AdminActivityLogs />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </MinimalBackground>
    </div>
  );
}
