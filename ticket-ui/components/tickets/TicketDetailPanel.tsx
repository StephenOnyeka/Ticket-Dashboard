'use client';

import React, { useState } from 'react';
import { useUpdateTicket, useAddComment } from '@/lib/hooks/useTickets';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge, ChannelBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import type { Ticket, TicketStatus, Comment } from '@/lib/types';

// ─────────────────────────────────────────────
//  Ticket Detail Panel
// ─────────────────────────────────────────────

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: '● Open' },
  { value: 'pending', label: '◐ Pending' },
  { value: 'closed', label: '○ Closed' },
];

function CommentBubble({ comment }: { comment: Comment }) {
  const isAgent = comment.authorRole === 'agent';
  return (
    <div className={`comment-bubble ${isAgent ? 'comment-agent' : 'comment-user'}`}>
      <div className="comment-header">
        <div className="comment-avatar" aria-hidden="true">
          {comment.authorName.slice(0, 2).toUpperCase()}
        </div>
        <div className="comment-meta">
          <span className="comment-author">{comment.authorName}</span>
          <span className="comment-role-badge">
            {isAgent ? '🛡 Agent' : '👤 User'}
          </span>
          <span className="comment-time">
            {new Date(comment.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      <p className="comment-body">{comment.body}</p>
    </div>
  );
}

interface TicketDetailPanelProps {
  ticket: Ticket | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function TicketDetailPanel({ ticket, isLoading, isError }: TicketDetailPanelProps) {
  const { isAgent } = useAuth();
  const { showToast } = useToast();
  const updateTicket = useUpdateTicket();
  const addComment = useAddComment();
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!ticket) return;
    const newStatus = e.target.value as TicketStatus;
    try {
      await updateTicket.mutateAsync({ id: ticket.id, payload: { status: newStatus } });
      showToast('success', `Status updated to "${newStatus}"`);
    } catch {
      showToast('error', 'Failed to update status');
    }
  }

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!ticket || !replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      await addComment.mutateAsync({ id: ticket.id, payload: { body: replyText.trim() } });
      showToast('success', 'Reply added successfully');
      setReplyText('');
    } catch {
      showToast('error', 'Failed to add reply');
    } finally {
      setIsSubmittingReply(false);
    }
  }

  if (isLoading) return <DetailSkeleton />;
  if (isError) {
    return (
      <div className="detail-error">
        <span aria-hidden="true">⚠</span>
        <p>Failed to load ticket details.</p>
      </div>
    );
  }
  if (!ticket) return null;

  return (
    <article className="ticket-detail" aria-label={`Ticket: ${ticket.title}`}>
      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-top">
          <span className="detail-ticket-id">#{ticket.id}</span>
          <div className="detail-badges">
            <StatusBadge status={ticket.status} />
            <ChannelBadge channel={ticket.channel} />
          </div>
        </div>
        <h2 className="detail-title">{ticket.title}</h2>
        <div className="detail-meta">
          <span>
            <strong>From:</strong> {ticket.userName} &lt;{ticket.userEmail}&gt;
          </span>
          <span>
            <strong>Created:</strong>{' '}
            {new Date(ticket.createdAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
          <span>
            <strong>Updated:</strong>{' '}
            {new Date(ticket.updatedAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
          {ticket.tags.length > 0 && (
            <span>
              <strong>Tags:</strong>{' '}
              {ticket.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </span>
          )}
        </div>
      </div>

      {/* Status changer (Agent only) */}
      {isAgent && (
        <div className="detail-status-changer">
          <label htmlFor="status-select" className="status-changer-label">Change Status</label>
          <select
            id="status-select"
            className="status-changer-select"
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={updateTicket.isPending}
            aria-label="Change ticket status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {updateTicket.isPending && (
            <span className="status-saving" aria-live="polite">Saving…</span>
          )}
        </div>
      )}

      {/* Original message */}
      <div className="detail-original-body">
        <div className="detail-body-label">Original Message</div>
        <p className="detail-body-text">{ticket.body}</p>
      </div>

      {/* Conversation thread */}
      {ticket.comments.length > 0 && (
        <section className="detail-thread" aria-label="Conversation thread">
          <h3 className="thread-title">
            Conversation ({ticket.comments.length})
          </h3>
          <div className="thread-list">
            {ticket.comments.map((comment) => (
              <CommentBubble key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      )}

      {/* Reply form (Agent only) */}
      {isAgent ? (
        <section className="detail-reply" aria-label="Add reply">
          <h3 className="reply-title">Add Reply</h3>
          <form onSubmit={handleSubmitReply} className="reply-form">
            <textarea
              id="reply-textarea"
              className="reply-textarea"
              placeholder="Type your reply to the customer…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              aria-label="Reply message"
              required
            />
            <div className="reply-footer">
              <span className="reply-hint">
                Replying as agent — this will be visible to the customer.
              </span>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmittingReply}
                disabled={!replyText.trim()}
              >
                Send Reply
              </Button>
            </div>
          </form>
        </section>
      ) : (
        <div className="detail-guest-notice" role="note">
          <span aria-hidden="true">🔒</span>
          <span>You are viewing as a guest. Only agents can reply or change status.</span>
        </div>
      )}
    </article>
  );
}
