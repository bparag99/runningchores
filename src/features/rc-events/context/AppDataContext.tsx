import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Task, Vendor, VendorAssignment, Approval, BudgetItem, Notification, ChatMessage } from '../types';
import tasksData from '../data/tasks.json';
import vendorsData from '../data/vendors.json';
import vendorAssignmentsData from '../data/vendorAssignments.json';
import approvalsData from '../data/approvals.json';
import budgetItemsData from '../data/budgetItems.json';
import notificationsData from '../data/notifications.json';
import chatMessagesData from '../data/chatMessages.json';

interface AppDataContextType {
  tasks: Task[];
  vendors: Vendor[];
  vendorAssignments: VendorAssignment[];
  approvals: Approval[];
  budgetItems: BudgetItem[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  getTasksByEvent: (eventId: string) => Task[];
  getApprovalsByEvent: (eventId: string) => Approval[];
  getVendorsByEvent: (eventId: string) => (Vendor & { assignment: VendorAssignment | undefined })[];
  getBudgetByEvent: (eventId: string) => BudgetItem[];
  getVendorById: (id: string) => Vendor | undefined;
  updateTaskStatus: (taskId: string, status: string) => void;
  updateApprovalStatus: (approvalId: string, status: string, comments?: string) => void;
  markNotificationRead: (notificationId: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  getUnreadNotifications: () => Notification[];
}

const AppDataContext = createContext<AppDataContextType>({} as AppDataContextType);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(tasksData as Task[]);
  const [vendors] = useState<Vendor[]>(vendorsData as Vendor[]);
  const [vendorAssignments] = useState<VendorAssignment[]>(vendorAssignmentsData as VendorAssignment[]);
  const [approvals, setApprovals] = useState<Approval[]>(approvalsData as Approval[]);
  const [budgetItems] = useState<BudgetItem[]>(budgetItemsData as BudgetItem[]);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData as Notification[]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(chatMessagesData as ChatMessage[]);

  const getTasksByEvent = useCallback(
    (eventId: string) => tasks.filter((t) => t.event_id === eventId),
    [tasks]
  );

  const getApprovalsByEvent = useCallback(
    (eventId: string) => approvals.filter((a) => a.event_id === eventId),
    [approvals]
  );

  const getVendorsByEvent = useCallback(
    (eventId: string) => {
      const assignments = vendorAssignments.filter((va) => va.event_id === eventId);
      return vendors
        .filter((v) => assignments.some((a) => a.vendor_id === v.id))
        .map((v) => ({
          ...v,
          assignment: assignments.find((a) => a.vendor_id === v.id),
        }));
    },
    [vendors, vendorAssignments]
  );

  const getBudgetByEvent = useCallback(
    (eventId: string) => budgetItems.filter((b) => b.event_id === eventId),
    [budgetItems]
  );

  const getVendorById = useCallback(
    (id: string) => vendors.find((v) => v.id === id),
    [vendors]
  );

  const updateTaskStatus = useCallback((taskId: string, status: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: status as Task['status'], completed_at: status === 'completed' ? new Date().toISOString() : t.completed_at }
          : t
      )
    );
  }, []);

  const updateApprovalStatus = useCallback((approvalId: string, status: string, comments?: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? { ...a, status: status as Approval['status'], approval_date: new Date().toISOString(), approval_comments: comments }
          : a
      )
    );
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const getUnreadNotifications = useCallback(
    () => notifications.filter((n) => !n.is_read),
    [notifications]
  );

  return (
    <AppDataContext.Provider
      value={{
        tasks, vendors, vendorAssignments, approvals, budgetItems, notifications, chatMessages,
        getTasksByEvent, getApprovalsByEvent, getVendorsByEvent, getBudgetByEvent, getVendorById,
        updateTaskStatus, updateApprovalStatus, markNotificationRead, addChatMessage, getUnreadNotifications,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);
