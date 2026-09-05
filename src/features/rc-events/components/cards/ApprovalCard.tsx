import { CalendarDays, User, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { StatusBadge } from '../../app/lib/StatusBadge';
import { ActionButton } from '../../app/lib/ActionButton';
import type { Approval } from '../../types';

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (approval: Approval) => void;
}

export function ApprovalCard({ approval, onApprove, onReject, onViewDetails }: ApprovalCardProps) {
  const isOverdue = approval.status === 'pending' && new Date(approval.due_date) < new Date();

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{approval.title}</h4>
            <StatusBadge variant={approval.status === 'approved' ? 'success' : approval.status === 'rejected' ? 'error' : 'warning'}>
              {approval.status}
            </StatusBadge>
          </div>
          <p className="text-xs text-muted-foreground">{approval.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <User size={12} />
          Requested by: {approval.requested_by === 'user_coordinator' ? 'Coordinator' : 'Planner'}
        </span>
        <span className={`flex items-center gap-1 ${isOverdue ? 'text-status-error font-semibold' : ''}`}>
          <CalendarDays size={12} />
          Due: {new Date(approval.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {isOverdue && ' (Overdue)'}
        </span>
      </div>

      {approval.status === 'pending' && (
        <div className="flex gap-2 pt-2 border-t border-border">
          <ActionButton variant="primary" onClick={() => onApprove(approval.id)} icon={<ThumbsUp size={14} />}>
            Approve
          </ActionButton>
          <ActionButton variant="destructive" onClick={() => onReject(approval.id)} icon={<ThumbsDown size={14} />}>
            Reject
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => onViewDetails(approval)} icon={<Eye size={14} />}>
            Details
          </ActionButton>
        </div>
      )}

      {approval.status !== 'pending' && approval.approval_comments && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground italic">"{approval.approval_comments}"</p>
        </div>
      )}
    </div>
  );
}
