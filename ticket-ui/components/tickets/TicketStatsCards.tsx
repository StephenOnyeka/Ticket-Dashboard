'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, TickCircle, CloseCircle } from 'iconsax-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'slate';
  isLoading: boolean;
}

const colorStyles = {
  indigo: 'from-indigo-500/10 to-indigo-600/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  emerald: 'from-emerald-500/10 to-emerald-600/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  amber: 'from-amber-500/10 to-amber-600/5 text-amber-600 dark:text-amber-400 border-amber-500/20',
  slate: 'from-slate-500/10 to-slate-600/5 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

function StatCard({ label, value, icon, colorScheme, isLoading }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`p-5 rounded-2xl border bg-gradient-to-br ${colorStyles[colorScheme]} bg-white dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex flex-col justify-between transition-colors duration-200`}
      role="region"
      aria-label={label}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 shadow-xs">{icon}</div>
      </div>
      <div className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        ) : (
          <span>{value}</span>
        )}
      </div>
    </motion.div>
  );
}

export function TicketStatsCardsDetailed({
  totalOpen,
  totalPending,
  totalClosed,
  totalAll,
  isLoading,
}: {
  totalOpen: number;
  totalPending: number;
  totalClosed: number;
  totalAll: number;
  isLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" role="region" aria-label="Ticket statistics">
      <StatCard label="Total Tickets" value={totalAll} icon={<Ticket size={22} variant="Bold" color="currentColor" />} colorScheme="indigo" isLoading={isLoading} />
      <StatCard label="Open Tickets" value={totalOpen} icon={<Clock size={22} variant="Bold" color="currentColor" />} colorScheme="emerald" isLoading={isLoading} />
      <StatCard label="Pending" value={totalPending} icon={<TickCircle size={22} variant="Bold" color="currentColor" />} colorScheme="amber" isLoading={isLoading} />
      <StatCard label="Closed" value={totalClosed} icon={<CloseCircle size={22} variant="Bold" color="currentColor" />} colorScheme="slate" isLoading={isLoading} />
    </div>
  );
}
