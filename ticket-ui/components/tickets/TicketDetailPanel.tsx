'use client';

import React, { useState } from 'react';
import { useUpdateTicket, useAddComment } from '@/lib/hooks/useTickets';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge, ChannelBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { Send2, ShieldSecurity, User, Danger, Lock } from 'iconsax-react';
import type { Ticket, TicketStatus, Comment } from '@/lib/types';

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
];

function CommentBubble({ comment }: { comment: Comment }) {
  const isAgent = comment.authorRole === 'agent';
  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      isAgent
        ? 'bg-indigo-500/5 dark:bg-indigo-950/20 border-indigo-500/20 text-slate-900 dark:text-white'
        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
            {comment.authorName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-bold">{comment.authorName}</span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isAgent ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}>
            {isAgent ? <ShieldSecurity size={10} variant="Linear" color="currentColor" /> : <User size={10} variant="Linear" color="currentColor" />}
            {isAgent ? 'Agent' : 'User'}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          {new Date(comment.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <p className="text-xs leading-relaxed whitespace-pre-wrap">{comment.body}</p>
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
      <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex flex-col items-center gap-2 text-center">
        <Danger size={32} variant="Linear" color="currentColor" />
        <p className="text-xs font-semibold">Failed to load ticket details.</p>
      </div>
    );
  }
  if (!ticket) return null;

  return (
    <article className="space-y-6" aria-label={`Ticket: ${ticket.title}`}>
      {/* Ticket Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
            #{ticket.id}
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <ChannelBadge channel={ticket.channel} />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">{ticket.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <div><strong className="text-slate-700 dark:text-slate-300">From:</strong> {ticket.userName} ({ticket.userEmail})</div>
          <div><strong className="text-slate-700 dark:text-slate-300">Created:</strong> {new Date(ticket.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
          <div><strong className="text-slate-700 dark:text-slate-300">Updated:</strong> {new Date(ticket.updatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
        </div>
      </div>

      {/* Agent Status Bar */}
      {isAgent && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <label htmlFor="status-select" className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">Change Status</label>
          <select
            id="status-select"
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={updateTicket.isPending}
            aria-label="Change ticket status"
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-500/30 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Original Message */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors duration-200">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Message</div>
        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{ticket.body}</p>
      </div>

      {/* Conversation Thread */}
      {ticket.comments.length > 0 && (
        <section className="space-y-4" aria-label="Conversation thread">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Conversation ({ticket.comments.length})
          </h3>
          <div className="space-y-3">
            {ticket.comments.map((comment) => (
              <CommentBubble key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      )}

      {/* Reply Form / Notice */}
      {isAgent ? (
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200" aria-label="Add reply">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Reply</h3>
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <textarea
              id="reply-textarea"
              placeholder="Type your reply to the customer…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              aria-label="Reply message"
              required
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Replying as agent — visible to customer</span>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmittingReply}
                disabled={!replyText.trim()}
              >
                <Send2 size={16} variant="Linear" color="currentColor" />
                <span>Send Reply</span>
              </Button>
            </div>
          </form>
        </section>
      ) : (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-medium" role="note">
          <Lock size={18} variant="Linear" color="currentColor" />
          <span>You are viewing as a guest. Only agents can reply or change ticket status.</span>
        </div>
      )}
    </article>
  );
}
