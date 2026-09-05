import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import useAppStore from '../store/useAppStore';
import { CheckCircle2, AlertCircle, IndianRupee, FileText, X } from 'lucide-react';

const useLiveNotifications = (enabled = true) => {
  const projects = useAppStore(state => state.projects);
  const tasks = useAppStore(state => state.tasks);
  const alerts = useAppStore(state => state.alerts);

  useEffect(() => {
    if (!enabled) return;

    const CustomToast = ({ t, title, message, icon: Icon, colorClass, bgClass, borderClass }) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${borderClass}`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className={`h-10 w-10 rounded-full ${bgClass} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${colorClass}`} />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-gray-900">
                {title}
              </p>
              <p className="mt-1 text-sm text-gray-500 font-medium">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              toast.remove(t.id);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none cursor-pointer z-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );

    const generateNotification = () => {
      // Clear any existing toasts so they come one strictly after another
      toast.dismiss();

      const eventTypes = ['TASK_COMPLETED', 'NEW_ALERT', 'COMPENSATION_DISBURSED', 'PROPOSAL_SUBMITTED'];
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

      switch (type) {
        case 'TASK_COMPLETED':
          if (tasks.length > 0) {
            const task = tasks[Math.floor(Math.random() * tasks.length)];
            toast.custom((t) => (
              <CustomToast 
                t={t} 
                title="Workflow Update" 
                message={`Task "${task.title}" was just completed.`}
                icon={CheckCircle2}
                colorClass="text-emerald-500"
                bgClass="bg-emerald-50"
                borderClass="border-emerald-500"
              />
            ), { duration: 4000 });
          }
          break;
        
        case 'NEW_ALERT':
          if (alerts.length > 0) {
            const alert = alerts[Math.floor(Math.random() * alerts.length)];
            const isCritical = alert.severity === 'Critical';
            toast.custom((t) => (
              <CustomToast 
                t={t} 
                title={`${alert.severity} Risk Detected`} 
                message={`${alert.trigger} for ${alert.entityId}.`}
                icon={AlertCircle}
                colorClass={isCritical ? 'text-red-500' : 'text-amber-500'}
                bgClass={isCritical ? 'bg-red-50' : 'bg-amber-50'}
                borderClass={isCritical ? 'border-red-500' : 'border-amber-500'}
              />
            ), { duration: 6000 });
          }
          break;

        case 'COMPENSATION_DISBURSED':
          if (projects.length > 0) {
            const proj = projects[Math.floor(Math.random() * projects.length)];
            const amount = Math.floor(Math.random() * 50 + 10);
            toast.custom((t) => (
              <CustomToast 
                t={t} 
                title="Direct Benefit Transfer" 
                message={`₹${amount} Lakhs disbursed successfully for ${proj.name}.`}
                icon={IndianRupee}
                colorClass="text-blue-500"
                bgClass="bg-blue-50"
                borderClass="border-blue-500"
              />
            ), { duration: 5000 });
          }
          break;

        case 'PROPOSAL_SUBMITTED':
          toast.custom((t) => (
            <CustomToast 
              t={t} 
              title="New Proposal Received" 
              message="A Requiring Body has submitted a new land acquisition proposal."
              icon={FileText}
              colorClass="text-purple-500"
              bgClass="bg-purple-50"
              borderClass="border-purple-500"
            />
          ), { duration: 4000 });
          break;
          
        default:
          break;
      }
    };

    const interval = setInterval(() => {
      generateNotification();
    }, Math.floor(Math.random() * 5000) + 5000);

    return () => clearInterval(interval);
  }, [enabled, projects, tasks, alerts]);
};

export default useLiveNotifications;
