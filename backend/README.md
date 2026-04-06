# Job Portal Backend (Node + Express + MongoDB)

## Start (local)
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set `MONGO_URI` + `JWT_SECRET`
4. `npm run dev`

## API
- `GET /api/health`
- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- **Users**
  - `PUT /api/users/me`
  - `POST /api/users/me/resume` (candidate; form-data `resume`)
- **Jobs**
  - `GET /api/jobs` (search/filter/pagination)
  - `GET /api/jobs/:id`
  - `GET /api/jobs/mine` (recruiter)
  - `POST /api/jobs` (recruiter/admin)
  - `PUT /api/jobs/:id` (recruiter/admin)
  - `DELETE /api/jobs/:id` (recruiter/admin)
- **Applications**
  - `POST /api/applications/apply/:jobId` (candidate)
  - `GET /api/applications/me` (candidate)
  - `GET /api/applications/job/:jobId` (recruiter/admin)
  - `PUT /api/applications/:id/status` (recruiter/admin)
- **Admin**
  - `GET /api/admin/analytics`
  - `GET /api/admin/users?role=recruiter|candidate|admin`
  - `POST /api/admin/users/:id/block`
  - `POST /api/admin/users/:id/unblock`
  - `POST /api/admin/jobs/:id/remove` (deactivate)

