# TalentOrbit — Online Job Portal SaaS (MERN)

Production-style local MERN SaaS with **Admin**, **Recruiter**, and **Job Seeker** roles.

## Folder structure
```
/frontend   React + Tailwind + Vite
/backend    Node + Express + MongoDB + JWT + Multer
```

## Prereqs
- Node.js **LTS** (20/22 recommended)
- MongoDB running locally

## Run locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Key features
- **JWT auth + bcrypt hashing**
- **Role-based access control** (admin/recruiter/candidate)
- **Jobs**: create/edit/delete, search + filters + pagination
- **Applications**: apply, recruiter review, shortlist/reject
- **Resume upload**: local PDF upload via Multer
- **Admin**: analytics, user blocking, job deactivation

