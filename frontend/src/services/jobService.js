import { api } from "../utils/api.js";

export function fetchJobs(params) {
  return api.get("/jobs", { params }).then((r) => r.data);
}

export function fetchJobById(id) {
  return api.get(`/jobs/${id}`).then((r) => r.data.job);
}

export function fetchRecommendedJobs() {
  return api.get("/jobs/recommended").then((r) => r.data.jobs || []);
}

export function saveJobBookmark(jobId) {
  return api.post(`/users/me/saved-jobs/${jobId}`);
}

export function removeJobBookmark(jobId) {
  return api.delete(`/users/me/saved-jobs/${jobId}`);
}

export function fetchSavedJobs() {
  return api.get("/users/me/saved-jobs").then((r) => r.data.jobs || []);
}

export function fetchNotifications() {
  return api.get("/users/me/notifications").then((r) => r.data.notifications || []);
}

export function markNotificationRead(id) {
  return api.patch(`/users/me/notifications/${id}/read`);
}
