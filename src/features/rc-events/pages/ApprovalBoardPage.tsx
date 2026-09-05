import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { ApprovalCard } from '../components/cards/ApprovalCard';
import { StatusBadge } from '../app/lib/StatusBadge';
import { ActionButton } from '../app/lib/ActionButton';
import type { Approval } from '../types';

interface ApprovalBoardPageProps {
  eventId: string;
}

export function ApprovalBoardPage({ eventId }: ApprovalBoardPageProps) {
  const { getApprovalsByEvent, updateApprovalStatus } = useAppData();
  const [filter, setFilter] = useState<string>('all');
  const [detailApproval, setDetailApproval] = useState<Approval | null>(null);
  const approvals = getApprovalsByEvent(eventId);

  const filteredApprovals = filter === 'all'
    ? approvals
    : approvals.filter((a) => a.status === filter);

  const handleApprove = (id: string) => {
    updateApprovalStatus(id, 'approved', 'Approved');
  };

  const handleReject = (id: string) => {
    const reason = window.prompt('Reason for rejection:');
    if (reason !== null) {
      updateApprovalStatus(id, 'rejected', reason || 'Rejected');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'all' ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          All ({approvals.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'pending' ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          Pending ({approvals.filter((a) => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'approved' ? 'bg-brand-primary text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          Approved ({approvals.filter((a) => a.status === 'approved').length})
        </button>
      </div>

      {detailApproval ? (
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">{detailApproval.title}</h3>
              <StatusBadge variant={detailApproval.status === 'approved' ? 'success' : detailApproval.status === 'rejected' ? 'error' : 'warning'}>
                {detailApproval.status}
              </StatusBadge>
            </div>
            <ActionButton variant="ghost" onClick={() => setDetailApproval(null)}>
              Back
            </ActionButton>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{detailApproval.description}</p>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requested by</span>
              <span className="font-medium">{detailApproval.requested_by.replace('user_', '').replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due</span>
              <span className="font-medium">{new Date(detailApproval.due_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium capitalize">{detailApproval.approval_type}</span>
            </div>
          </div>

          {detailApproval.metadata && (
            <div className="bg-muted rounded-lg p-3 mb-4">
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(detailApproval.metadata, null, 2)}</pre>
            </div>
          )}

          {detailApproval.status === 'pending' && (
            <div className="flex gap-2">
              <ActionButton variant="primary" onClick={() => handleApprove(detailApproval.id)} icon={<CheckCircle size={14} />}>
                Approve
              </ActionButton>
              <ActionButton variant="destructive" onClick={() => handleReject(detailApproval.id)} icon={<XCircle size={14} />}>
                Reject
              </ActionButton>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApprovals.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No approvals found</div>
          ) : (
            filteredApprovals.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={setDetailApproval}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
