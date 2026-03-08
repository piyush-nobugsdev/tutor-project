
// ============================================
// DATABASE TYPES
// Save this as: src/types/database.ts
// ============================================

export type UserRole = 'parent' | 'tutor' | 'admin';

export type Subject = 'math' | 'science' | 'english' | 'social_studies' | 'hindi';

export type LocationType = 'online' | 'in_person' | 'both';

export type JobStatus = 'open' | 'closed' | 'filled';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type TestDifficulty = 'easy' | 'medium' | 'hard';

export type CorrectAnswer = 'a' | 'b' | 'c' | 'd';

// ============================================
// TABLE TYPES
// ============================================

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  grade_level: number;
  created_at: string;
}

export interface TutorQualification {
  id: string;
  tutor_id: string;
  subject: Subject;
  is_qualified: boolean;
  test_score: number | null;
  qualified_at: string | null;
  created_at: string;
}

export interface TestQuestion {
  id: string;
  subject: Subject;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: CorrectAnswer;
  difficulty: TestDifficulty | null;
  created_at: string;
}

export interface Job {
  id: string;
  parent_id: string;
  child_id: string;
  subject: string;
  grade_level: number;
  description: string;
  hours_per_week: number;
  budget_per_hour: number;
  is_negotiable: boolean;
  location_type: LocationType;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  tutor_id: string;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

// ============================================
// FORM INPUT TYPES (for creating records)
// ============================================

export interface CreateProfileInput {
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
}

export interface CreateChildInput {
  parent_id: string;
  name: string;
  grade_level: number;
}

export interface CreateJobInput {
  parent_id: string;
  child_id: string;
  subject: string;
  grade_level: number;
  description: string;
  hours_per_week: number;
  budget_per_hour: number;
  is_negotiable: boolean;
  location_type: LocationType;
}

export interface CreateApplicationInput {
  job_id: string;
  tutor_id: string;
  message?: string;
}

export interface SubmitTestInput {
  tutor_id: string;
  subject: Subject;
  answers: Record<string, CorrectAnswer>; // { question_id: selected_answer }
}

// ============================================
// VIEW TYPES (with joined data)
// ============================================

export interface JobWithDetails extends Job {
  parent: Profile;
  child: Child;
  application_count?: number;
}

export interface ApplicationWithDetails extends Application {
  job: Job;
  tutor: Profile;
  tutor_qualifications?: TutorQualification[];
}

export interface TutorWithQualifications extends Profile {
  qualifications: TutorQualification[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface TestResult {
  score: number;
  passed: boolean;
  correct_answers: number;
  total_questions: number;
  is_qualified: boolean;
}

export interface DashboardStats {
  total_jobs?: number;
  active_applications?: number;
  accepted_jobs?: number;
  total_children?: number;
}

// ============================================
// SUPABASE DATABASE TYPE (auto-generated pattern)
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at'>>;
      };
      children: {
        Row: Child;
        Insert: Omit<Child, 'id' | 'created_at'>;
        Update: Partial<Omit<Child, 'id' | 'parent_id' | 'created_at'>>;
      };
      tutor_qualifications: {
        Row: TutorQualification;
        Insert: Omit<TutorQualification, 'id' | 'created_at'>;
        Update: Partial<Omit<TutorQualification, 'id' | 'tutor_id' | 'created_at'>>;
      };
      test_questions: {
        Row: TestQuestion;
        Insert: Omit<TestQuestion, 'id' | 'created_at'>;
        Update: Partial<Omit<TestQuestion, 'id' | 'created_at'>>;
      };
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Job, 'id' | 'parent_id' | 'created_at'>>;
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Application, 'id' | 'job_id' | 'tutor_id' | 'created_at'>>;
      };
    };
  };
}
