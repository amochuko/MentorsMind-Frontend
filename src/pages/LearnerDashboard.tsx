import React, { useEffect } from 'react';
import { useReminders } from '../hooks/useReminders';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { Widget } from '../components/dashboard/Widget';
import ReminderSettings from '../components/learner/ReminderSettings';
import UpcomingReminders from '../components/learner/UpcomingReminders';
import LearningRecommendations from '../components/learner/LearningRecommendations';
import SessionPrep from '../components/learner/SessionPrep';
import type { Session } from '../types';

// Mock sessions for demonstration
const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    learnerId: 'l1',
    learnerName: 'Emma',
    topic: 'React Design Patterns & Clean Code',
    startTime: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
    duration: 60,
    status: 'confirmed',
    price: 50,
    currency: 'XLM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 's2',
    learnerId: 'l1',
    learnerName: 'Emma',
    topic: 'Advanced TypeScript: Utility Types',
    startTime: new Date(Date.now() + 86400000 * 1.5).toISOString(), // 1.5 days from now
    duration: 45,
    status: 'pending',
    price: 40,
    currency: 'USDC',
  }
];

const LearnerDashboardContent: React.FC = () => {
  const { 
    settings, 
    upcomingReminders, 
    history, 
    updateSettings, 
    snoozeReminder, 
    dismissReminder,
    addCustomTime,
    removeCustomTime
  } = useReminders(MOCK_SESSIONS);

  const { setRole, setLoading, widgets } = useDashboard();

  useEffect(() => {
    setRole('learner');
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [setRole, setLoading]);

  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Learner Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            You have {MOCK_SESSIONS.length} upcoming sessions this week.
          </p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
             <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-500 font-bold">128</div>
             <div className="text-xs">
               <div className="font-bold text-gray-900 dark:text-white leading-none">XLM</div>
               <div className="text-gray-400 dark:text-gray-500">Balance</div>
             </div>
           </div>
        </div>
      </header>

      <DashboardGrid>
        {widgets.filter(w => w.visible).sort((a, b) => a.order - b.order).map(widget => (
          <Widget key={widget.id} config={widget}>
            {widget.id === 'stats' && (
              <UpcomingReminders 
                reminders={upcomingReminders}
                history={history}
                onSnooze={(id: string) => snoozeReminder(id)}
                onDismiss={(id: string) => dismissReminder(id)}
              />
            )}
            {widget.id === 'sessions' && <SessionPrep />}
            {widget.id === 'earnings' && (
               <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-2 text-white">Next Session Prep</h3>
                <p className="text-white/80 text-sm mb-4">Review tips to make the most of your time.</p>
                <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                  Prep Toolkit
                </button>
              </div>
            )}
            {widget.id === 'activity' && (
              <ReminderSettings 
                settings={settings}
                onUpdate={updateSettings}
                onAddCustomTime={addCustomTime}
                onRemoveCustomTime={removeCustomTime}
              />
            )}
          </Widget>
        ))}
      </DashboardGrid>

      <LearningRecommendations />
    </div>
  );
};

const LearnerDashboard: React.FC = () => (
  <DashboardLayout>
    <LearnerDashboardContent />
  </DashboardLayout>
);

export default LearnerDashboard;
