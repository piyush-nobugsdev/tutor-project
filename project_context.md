# Updated PROJECT CONTEXT — Tutor Platform

**Last updated:** 2026-03-05 (Current Session)

---

## 1. Project Overview

A **two-sided tutoring platform** connecting Parents with Tutors in India.

**Core Concept:**
- Parents post tutoring job requirements for their children
- Tutors must pass subject qualification tests to unlock job applications
- Parents review applications and accept tutors
- Simple, focused MVP - no payments, messaging, or scheduling in V1

**Key Features:**
- Role-based authentication (Parent OR Tutor per account)
- Parent: Create child profiles → Post jobs → Accept tutors
- Tutor: Pass qualification test → Browse jobs → Apply → Get hired
- Real-time dashboard showing jobs, applications, and active classes

---

## 2. Tech Stack (Finalized)

### Frontend / App
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**

### Backend (Server-side, no Express)
- **Next.js Server Components**
- **Next.js Server Actions** (for mutations)
- **Next.js Route Handlers** (`app/*/route.ts`)

### Auth & Database
- **Supabase**
  - Auth: OAuth (Google, GitHub) with forced account selection
  - PostgreSQL database
  - Row Level Security (RLS) enabled on all tables
  - Sessions via HTTP-only cookies

### Deployment
- **Vercel**
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. Core Architectural Rules

✅ Everything lives inside `/app` (App Router only, no `/pages` directory)  
✅ No Express or separate backend server  
✅ Server logic uses Server Components, Route Handlers, or Server Actions  
✅ Client components marked with `'use client'` directive  
✅ Database queries use Supabase client (server-side or browser-side)  
✅ RLS policies enforce data access control  

---

## 4. Current Folder Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page (role selection)
│   │
│   ├── auth/
│   │   ├── parent/page.tsx           # Parent OAuth page
│   │   ├── tutor/page.tsx            # Tutor OAuth page
│   │   ├── callback/route.ts         # OAuth callback handler
│   │   └── signout/route.ts          # Sign out handler
│   │
│   ├── onboarding/
│   │   └── page.tsx                  # Profile creation (new users)
│   │
│   └── dashboard/
│       ├── layout.tsx                # Shared dashboard layout (navbar, signout)
│       │
│       ├── parent/
│       │   ├── page.tsx              # Parent home dashboard
│       │   ├── children/page.tsx     # Manage child profiles (TODO)
│       │   ├── jobs/page.tsx         # Post & manage jobs (TODO)
│       │   └── classes/page.tsx      # View accepted tutors
│       │
│       └── tutor/
│           ├── page.tsx              # Tutor home dashboard
│           ├── test/page.tsx         # Take qualification test (TODO)
│           ├── jobs/page.tsx         # Browse & apply to jobs (TODO)
│           └── classes/page.tsx      # View accepted jobs
│
├── lib/
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       └── server.ts                 # Server Supabase client
│
├── types/
│   └── database.ts                   # TypeScript types (TODO)
│
├── proxy.ts (or middleware.ts)       # Route protection & role routing
│
└── PROJECT_CONTEXT.md                # This file
```

---

## 5. Authentication Flow (✅ COMPLETE & WORKING)

### User Journey:

1. **Landing Page (`/`)**
   - User clicks "Sign up as Parent" → `/auth/parent`
   - OR clicks "Sign up as Tutor" → `/auth/tutor`

2. **Auth Page (`/auth/parent` or `/auth/tutor`)**
   - Stores role in `localStorage.setItem('pending_role', 'parent')`
   - Initiates OAuth with `queryParams: { prompt: 'select_account' }` (forces account picker)
   - Redirects to Google/GitHub

3. **OAuth Callback (`/auth/callback`)**
   - Exchanges auth code for session
   - Checks if user has existing profile in database
   - **If profile exists:** Redirect to `/dashboard/{role}`
   - **If new user:** Redirect to `/onboarding`

4. **Onboarding (`/onboarding`)**
   - Reads `pending_role` from localStorage
   - Auto-creates profile with selected role
   - Redirects to `/dashboard/{role}`

5. **Middleware (`/proxy.ts`)**
   - Protects all `/dashboard/*` routes (requires auth)
   - Enforces role-based access (tutors can't access parent routes)
   - Redirects authenticated users from `/` and `/auth` to their dashboard

**Status:** ✅ Fully working on Vercel and localhost

---

## 6. Database Schema (✅ COMPLETE)

### Tables Created:

```sql
✅ profiles           # User accounts with role
✅ children           # Parent's kids
✅ tutor_qualifications  # Test results
✅ test_questions     # MCQ questions (10 math questions seeded)
✅ jobs               # Posted tutoring jobs
✅ applications       # Tutor applications to jobs
```

### RLS Policies:
- ✅ All tables have Row Level Security enabled
- ✅ Users can only access their own data
- ✅ Tutors can only see open jobs if qualified
- ✅ Parents can only see applications on their own jobs

---

## 7. User Roles & Permissions

### Parent
**Can:**
- ✅ Create child profiles (name, grade)
- ✅ Post tutoring jobs (subject, grade, description, budget, hours/week)
- ✅ View applications from tutors
- ✅ Accept/Reject applications
- ✅ View accepted tutors in "My Classes"

**Cannot:**
- ❌ Take qualification tests
- ❌ Apply to jobs
- ❌ Access tutor dashboard

---

### Tutor
**Can:**
- ✅ Take qualification test (Math only for MVP)
- ✅ Browse open jobs (only if qualified)
- ✅ Apply to jobs with optional message
- ✅ View own application status (pending/accepted/rejected)
- ✅ View accepted jobs in "My Classes"

**Cannot:**
- ❌ Create child profiles
- ❌ Post jobs
- ❌ Access parent dashboard

**Qualification Requirement:**
- Must score 70%+ on Math test (10 MCQs) to unlock job browsing
- Test can be retaken unlimited times

---

## 8. Complete User Flow (MVP Scope)

### 🔵 PARENT FLOW

#### **Step 1: Sign Up**
1. Lands on `/` → Clicks "Sign up as Parent"
2. OAuth with Google/GitHub → Profile created
3. Redirected to `/dashboard/parent`

#### **Step 2: Create Child Profile**
1. Clicks "Add Child Profile"
2. Fills form: Name (text), Grade (1-12)
3. Submits → Child saved to database
4. Child appears in list

**Database:**
```sql
INSERT INTO children (parent_id, name, grade_level)
VALUES (?, 'Raj', 10)
```

---

#### **Step 3: Post a Job**
1. Clicks "Post a Job"
2. Fills form:
   - Select child (dropdown)
   - Subject (Math/Science/English/Social Studies/Hindi)
   - Description ("Need help with trigonometry")
   - Hours per week (3)
   - Budget per hour (₹500)
   - Negotiable? (checkbox)
   - Location (Online/In-person/Both)
3. Submits → Job goes live with `status='open'`

**Database:**
```sql
INSERT INTO jobs (parent_id, child_id, subject, grade_level, description, hours_per_week, budget_per_hour, is_negotiable, location_type, status)
VALUES (?, ?, 'math', 10, 'Need help with trig', 3, 500, false, 'online', 'open')
```

---

#### **Step 4: View Applications**
1. Clicks on a job from "My Jobs"
2. Sees list of tutor applications:
   - Tutor name
   - Qualification badge ("✅ Qualified in Math")
   - Application message
   - "Accept" / "Reject" buttons

**Database:**
```sql
SELECT applications.*, profiles.full_name, tutor_qualifications.is_qualified
FROM applications
JOIN profiles ON applications.tutor_id = profiles.id
LEFT JOIN tutor_qualifications ON tutor_id = profiles.id AND subject = ?
WHERE job_id = ?
```

---

#### **Step 5: Accept a Tutor**
1. Clicks "Accept" on application
2. Confirmation dialog
3. Updates:
   - Application → `status='accepted'`
   - Job → `status='filled'`
   - All other applications → `status='rejected'`

**Database:**
```sql
UPDATE applications SET status = 'accepted' WHERE id = ?
UPDATE applications SET status = 'rejected' WHERE job_id = ? AND id != ?
UPDATE jobs SET status = 'filled' WHERE id = ?
```

---

#### **Step 6: View My Classes**
1. Clicks "My Classes"
2. Sees accepted tutoring arrangements:
   - Child name
   - Subject
   - Tutor name
   - Hours/week, Budget

**Database:**
```sql
SELECT jobs.*, children.name as child_name, profiles.full_name as tutor_name
FROM jobs
JOIN children ON jobs.child_id = children.id
JOIN applications ON jobs.id = applications.job_id
JOIN profiles ON applications.tutor_id = profiles.id
WHERE jobs.parent_id = ? AND applications.status = 'accepted'
```

---

### 🟢 TUTOR FLOW

#### **Step 1: Sign Up**
1. Lands on `/` → Clicks "Sign up as Tutor"
2. OAuth with Google/GitHub → Profile created
3. Redirected to `/dashboard/tutor`
4. Sees warning: "⚠️ Pass qualification test to apply to jobs"

---

#### **Step 2: Take Qualification Test**
1. Clicks "Take Qualification Test"
2. Sees "Math Test - 10 Questions"
3. Presented with 10 MCQs (one page, all visible)
4. Selects answers (radio buttons A/B/C/D)
5. Clicks "Submit Test"
6. Auto-graded:
   - Correct answers counted
   - Score = (correct / 10) × 100
   - Pass threshold: 70%
7. Result shown:
   - "✅ You scored 80%! You're qualified to teach Math"
   - OR "❌ You scored 60%. Need 70% to qualify. Try again?"

**Database (get questions):**
```sql
SELECT * FROM test_questions WHERE subject = 'math' LIMIT 10
```

**Database (save result):**
```sql
INSERT INTO tutor_qualifications (tutor_id, subject, is_qualified, test_score, qualified_at)
VALUES (?, 'math', true, 80, NOW())
ON CONFLICT (tutor_id, subject) DO UPDATE SET is_qualified = ?, test_score = ?, qualified_at = NOW()
```

---

#### **Step 3: Browse Jobs**
1. Clicks "Browse Jobs"
2. If NOT qualified → "Complete qualification test first"
3. If qualified → Sees list of open jobs:
   - Job title ("Grade 10 Math Tutor Needed")
   - Subject, Grade, Description
   - Hours/week, Budget/hour
   - "Apply" button

**Database:**
```sql
SELECT jobs.*, children.name as child_name, profiles.full_name as parent_name
FROM jobs
WHERE jobs.status = 'open'
AND EXISTS (
  SELECT 1 FROM tutor_qualifications
  WHERE tutor_id = ? AND is_qualified = TRUE
)
ORDER BY jobs.created_at DESC
```

---

#### **Step 4: Apply to Job**
1. Clicks "Apply" on a job
2. Modal/form opens:
   - Job details displayed
   - Optional message field: "Why are you a good fit?"
3. Clicks "Submit Application"
4. Application created with `status='pending'`

**Database:**
```sql
INSERT INTO applications (job_id, tutor_id, message, status)
VALUES (?, ?, 'I have 5 years experience...', 'pending')
```

**Constraint:** `UNIQUE(job_id, tutor_id)` prevents duplicate applications

---

#### **Step 5: View Applications**
1. Clicks "My Applications"
2. Sees list of submitted applications:
   - Job title, Subject, Grade
   - Parent name
   - Status: 🟡 Pending / 🟢 Accepted / 🔴 Rejected
   - Budget

**Database:**
```sql
SELECT applications.*, jobs.*, profiles.full_name as parent_name
FROM applications
JOIN jobs ON applications.job_id = jobs.id
JOIN profiles ON jobs.parent_id = profiles.id
WHERE applications.tutor_id = ?
ORDER BY applications.created_at DESC
```

---

#### **Step 6: View My Classes**
1. Clicks "My Classes"
2. Sees accepted jobs:
   - Child name, Subject, Grade
   - Parent name
   - Hours/week, Budget

**Database:**
```sql
SELECT jobs.*, children.name as child_name, profiles.full_name as parent_name
FROM applications
JOIN jobs ON applications.job_id = jobs.id
JOIN children ON jobs.child_id = children.id
JOIN profiles ON jobs.parent_id = profiles.id
WHERE applications.tutor_id = ? AND applications.status = 'accepted'
```

---

## 9. MVP Feature Scope

### ✅ Included in MVP

**Authentication:**
- OAuth sign-up (Google, GitHub)
- Role selection (Parent OR Tutor)
- Forced account selection on sign-in

**Parent Features:**
- Create child profiles
- Post tutoring jobs
- View tutor applications
- Accept/Reject tutors
- View active classes

**Tutor Features:**
- Take Math qualification test (10 MCQs)
- Browse open jobs (if qualified)
- Apply to jobs with message
- View application status
- View accepted jobs

**System:**
- Role-based dashboards
- Row Level Security
- Responsive design

---

### ❌ NOT in MVP (Future Enhancements)

- ❌ In-app messaging (use email exchange outside platform)
- ❌ Payment processing (handled offline)
- ❌ Calendar/scheduling (arranged offline)
- ❌ Reviews/ratings
- ❌ Multiple qualification tests (just Math for now)
- ❌ Email notifications
- ❌ Profile photos
- ❌ Search/filters (optional)
- ❌ Admin dashboard
- ❌ Multi-role support (one account = one role)

---

## 10. Current State — Checkpoint 2

### ✅ Completed

**Infrastructure:**
- Project initialized with Next.js 15 App Router
- Git repository connected to GitHub
- Deployed successfully on Vercel
- Supabase project created and connected
- Environment variables configured

**Authentication:**
- OAuth (Google + GitHub) fully working
- Role-based sign-up flow (separate pages for parent/tutor)
- Profile auto-creation on first login
- Role persistence in database
- Middleware-based route protection
- Force account selection on OAuth (`prompt: 'select_account'`)
- Sign-out functionality

**Database:**
- All 6 tables created with RLS policies
- 10 Math test questions seeded
- Indexes created for performance

**UI:**
- Landing page with role selection
- Auth pages for parent/tutor
- Onboarding page
- Dashboard layouts (parent/tutor)
- Empty state pages for all routes

---

### 🚧 In Progress / TODO

**Week 1 (Current):**
- [ ] Parent: Create child profile (Day 1-2)
- [ ] Parent: Post job form (Day 3-4)
- [ ] Tutor: Qualification test UI (Day 5-7)

**Week 2:**
- [ ] Tutor: Browse jobs page
- [ ] Tutor: Apply to job
- [ ] Parent: View applications
- [ ] Parent: Accept/Reject applications
- [ ] Both: My Classes page

**Week 3-4:**
- [ ] UI polish & responsive design
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Final testing & bug fixes

---

## 11. Design Decisions

### Single Role Per Account
- **Decision:** Each user account has ONE role (parent OR tutor)
- **Rationale:** Simplifies MVP, faster to ship
- **Workaround:** Users needing both roles create separate accounts
- **Future Enhancement:** Multi-role support with dashboard picker and roles array

### No Real-Time Features
- **Decision:** No live notifications, chat, or real-time updates
- **Rationale:** Reduces complexity, Supabase Realtime not needed for MVP
- **Workaround:** Users refresh page to see updates
- **Future Enhancement:** Supabase Realtime subscriptions

### One Qualification Test (Math Only)
- **Decision:** Only Math test available in MVP
- **Rationale:** Proves the concept, can add more subjects later
- **Workaround:** Tutors can only teach Math for now
- **Future Enhancement:** Tests for Science, English, etc.

---

## 12. Known Issues / Technical Debt

- [ ] ~~RLS policies need to be enabled~~ ✅ DONE
- [ ] Email notifications not implemented (future)
- [ ] No automated tests yet
- [ ] Rate limiting not configured
- [ ] No error tracking (Sentry, etc.)
- [ ] OAuth redirect URI error on production (needs Supabase config check)

---

## 13. Mandatory Working Rule

**At every meaningful checkpoint:**
1. Update this PROJECT_CONTEXT.md
2. Document:
   - What was completed
   - What changed
   - What is next
3. Commit to version control

**This file is the single source of truth for the project.**

---

## 14. Continuation Instruction

When resuming work in a new chat:

1. Paste this entire PROJECT_CONTEXT.md
2. State the next task explicitly

**Example:**
> "Continue building from this snapshot. Next task: Build the 'Create Child Profile' feature for parents."

---

## 15. Build Order (Next 2 Weeks)

### Week 1: Core Features
- **Day 1-2:** Parent - Create child profile (form + list)
- **Day 3-4:** Parent - Post job (form + validation)
- **Day 5-7:** Tutor - Qualification test (10 MCQs + grading)

### Week 2: Application Flow
- **Day 1-2:** Tutor - Browse jobs (list with filters)
- **Day 3-4:** Tutor - Apply to job (modal + form)
- **Day 5-6:** Parent - View & accept applications
- **Day 7:** Both - View "My Classes" (final feature)

### Week 3-4: Polish
- UI improvements
- Error handling
- Loading states
- Responsive design
- Final testing
- Demo video recording

---

**END OF PROJECT CONTEXT**

---