# Wolves International — Enterprise Platform

A production-ready enterprise real estate platform built for UAE market, inspired by Provident Estate, Betterhomes, Metropolitan Premium Properties, and Bayut.

---

## Tech Stack

**Frontend:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · TanStack Query · Zustand · React Hook Form · Zod

**Backend:** Django 5 · Django REST Framework · JWT Auth · Celery · Redis · PostgreSQL / SQLite

---

## Project Structure

```
New Wolves/
├── frontend/          # Next.js 15 App
│   └── src/
│       ├── app/
│       │   ├── (website)/     # Public website pages
│       │   ├── (auth)/        # Login page
│       │   ├── admin/         # Admin panel
│       │   └── api/           # API routes (sitemap)
│       ├── components/        # Reusable components
│       ├── hooks/             # React Query hooks
│       ├── services/          # API service layer
│       ├── store/             # Zustand auth store
│       ├── types/             # TypeScript types
│       └── lib/               # Utilities
│
├── backend/           # Django REST API
│   ├── apps/
│   │   ├── users/             # Auth & user management
│   │   ├── properties/        # Property listings
│   │   ├── projects/          # Off-plan projects
│   │   ├── developers/        # Developer CMS
│   │   ├── communities/       # Community CMS
│   │   ├── agents/            # Agent management
│   │   ├── blogs/             # Blog CMS
│   │   ├── leads/             # Lead management
│   │   ├── seo/               # SEO management
│   │   ├── settings_app/      # Site settings
│   │   ├── testimonials/      # Testimonials
│   │   └── faqs/              # FAQs
│   └── config/                # Django settings, URLs, Celery
│
├── nginx/             # Nginx config
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Development)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data    # optional: populate realistic demo data
python manage.py runserver
```

> Requires Python 3.11–3.13. Pillow/psycopg2 do not ship prebuilt wheels for 3.14 yet.

Backend runs at: http://localhost:8000
API Docs: http://localhost:8000/api/v1/docs/
Django Admin: http://localhost:8000/admin/

### Demo Data

`python manage.py seed_demo_data` creates a superuser (`admin@wolvesintl.com` / `Admin@12345`), 8 communities, 5 developers, 8 agents, 40 properties, 10 off-plan projects, 10 blog posts, testimonials, FAQs, and site settings. It is idempotent — safe to re-run. Pass `--flush` to wipe and reseed.

### Running Tests

```bash
cd backend
python manage.py test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000
Admin Panel: http://localhost:3000/admin/dashboard

---

## API Endpoints

| Resource       | Endpoint                    |
|----------------|-----------------------------|
| Auth           | `/api/v1/auth/`             |
| Properties     | `/api/v1/properties/`       |
| Projects       | `/api/v1/projects/`         |
| Developers     | `/api/v1/developers/`       |
| Communities    | `/api/v1/communities/`      |
| Agents         | `/api/v1/agents/`           |
| Blogs          | `/api/v1/blogs/`            |
| Leads          | `/api/v1/leads/`            |
| SEO            | `/api/v1/seo/`              |
| Settings       | `/api/v1/settings/`         |
| Testimonials   | `/api/v1/testimonials/`     |
| FAQs           | `/api/v1/faqs/`             |

---

## User Roles

| Role        | Access                                      |
|-------------|---------------------------------------------|
| super_admin | Full access to everything                   |
| admin       | Full CMS + user management                  |
| marketing   | Blog, SEO, testimonials, FAQs               |
| sales       | Leads, properties (read), agents            |
| agent       | Own leads and properties                    |
| editor      | Properties, blogs, content                  |
| viewer      | Read-only dashboard                         |

---

## Production Deployment

### Backend (Docker)

```bash
cp backend/.env.production backend/.env
# Edit .env with your production values
docker-compose up -d --build
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### Frontend (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables from `vercel.json`
4. Deploy

---

## Environment Variables

### Backend (.env)
```
SECRET_KEY=
DEBUG=
DATABASE_URL=
CORS_ALLOWED_ORIGINS=
FRONTEND_URL=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
REDIS_URL=
USE_S3=False
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_MEDIA_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_WHATSAPP=
```

---

## Features

- ✅ Property listings with advanced filters, grid/list/map view
- ✅ Wishlist & compare properties (side-by-side, up to 4)
- ✅ Off-plan projects CMS
- ✅ Developer & community pages
- ✅ Agent profiles with reviews
- ✅ Blog CMS with categories & tags
- ✅ Lead management with CRM features
- ✅ Careers page with resume upload
- ✅ SEO management per page
- ✅ Redirect manager (301/302) enforced via Next.js middleware
- ✅ Site settings CMS
- ✅ JWT authentication with refresh tokens
- ✅ Forgot / reset password flow
- ✅ Role-based access control (7 roles)
- ✅ Admin dashboard with analytics
- ✅ Mortgage calculator
- ✅ WhatsApp integration
- ✅ Dynamic XML sitemap
- ✅ Robots.txt
- ✅ CSV export for leads
- ✅ Email notifications
- ✅ Seed/demo data command (idempotent)
- ✅ Backend unit tests (Django REST Framework `APITestCase`)
- ✅ Docker + Nginx production setup
- ✅ Vercel deployment ready
- ✅ AWS S3 ready (toggle via env)
- ✅ Celery + Redis ready
- ✅ PostgreSQL production / SQLite development
