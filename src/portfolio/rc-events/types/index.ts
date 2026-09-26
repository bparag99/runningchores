export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'admin' | 'vendor' | 'wedding_couple' | 'planner' | 'coordinator';
  organization_id: string;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  timezone: string;
}

export interface Event {
  id: string;
  organization_id: string;
  event_name: string;
  event_type: string;
  couple_name_1: string;
  couple_name_2: string;
  event_date: string;
  venue_name: string;
  venue_city: string;
  total_guests_expected: number;
  total_budget: number;
  currency: string;
  status: string;
  readiness_score: number;
  created_by: string;
  created_at: string;
}

export type TaskStatus = 'not_started' | 'in_progress' | 'pending_approval' | 'blocked' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  event_id: string;
  organization_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  assigned_to: string;
  vendor_id?: string;
  completed_at?: string;
  created_at: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Approval {
  id: string;
  event_id: string;
  organization_id: string;
  approval_type: string;
  title: string;
  description: string;
  requested_by: string;
  approver_id: string;
  status: ApprovalStatus;
  approval_date?: string;
  approval_comments?: string;
  due_date: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface Vendor {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  city: string;
  description: string;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
}

export type AssignmentStatus = 'assigned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface VendorAssignment {
  id: string;
  event_id: string;
  vendor_id: string;
  task_id: string;
  organization_id: string;
  assignment_scope: string;
  status: AssignmentStatus;
  confirmed_at?: string;
  start_date?: string;
  end_date?: string;
}

export type BudgetStatus = 'quoted' | 'approved' | 'paid' | 'overdue';

export interface BudgetItem {
  id: string;
  event_id: string;
  organization_id: string;
  category: string;
  vendor_id?: string;
  description: string;
  allocated_amount: number;
  estimated_amount: number;
  spent_amount: number;
  status: BudgetStatus;
  payment_date?: string;
}

export interface Notification {
  id: string;
  organization_id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  event_id: string;
  organization_id: string;
  user_id: string;
  message_text: string;
  ai_response: string;
  intent: string;
  created_at: string;
}
