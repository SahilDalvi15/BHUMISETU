import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { Inbox as InboxIcon, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

const Inbox = () => {
  const { user } = useAuth();
  const allTasks = useAppStore(state => state.tasks);
  const [filter, setFilter] = useState('pending');

  // Filter based on role
  const myTasks = allTasks.filter(t => user && t.assignedRole === user.role);

  // Apply tab filters
  const displayTasks = myTasks.filter(t => {
    if (filter === 'completed') return t.status === 'Completed';
    
    // For pending/overdue logic, let's assume 'Pending' status means it's pending.
    // In a real app we'd compare dates. For mock data, let's mock the overdue logic if needed,
    // or just assume due date < now means overdue.
    const isOverdue = new Date(t.dueAt) < new Date();
    
    if (filter === 'overdue') return t.status !== 'Completed' && isOverdue;
    if (filter === 'pending') return t.status !== 'Completed' && !isOverdue;
    
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const overdueCount = myTasks.filter(t => t.status !== 'Completed' && new Date(t.dueAt) < new Date()).length;

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view tasks.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <InboxIcon className="w-6 h-6 mr-2 text-gov-green" />
            My Action Inbox
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tasks assigned to your role ({user?.role}) requiring verification or approval.
          </p>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button 
          onClick={() => setFilter('pending')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${filter === 'pending' ? 'border-gov-green text-gov-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Pending Actions
        </button>
        <button 
          onClick={() => setFilter('overdue')}
          className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${filter === 'overdue' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Overdue / Escalated
          {overdueCount > 0 && (
            <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">{overdueCount}</span>
          )}
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${filter === 'completed' ? 'border-gov-green text-gov-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Completed
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {displayTasks.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-200" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up!</h3>
              <p className="mt-1 text-sm text-gray-500">You have no tasks in this view.</p>
            </li>
          ) : (
            displayTasks.map((task) => {
              const isOverdue = new Date(task.dueAt) < new Date();
              return (
              <li key={task.id}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm font-medium text-gov-green truncate">
                        <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {task.id} - {task.entityType} ({task.stage})
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityBadge(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {task.title}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {isOverdue && task.status !== 'Completed' ? (
                          <AlertTriangle className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        <p className={isOverdue && task.status !== 'Completed' ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(task.dueAt).toLocaleDateString()}
                        </p>
                        <ChevronRight className="ml-4 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            )})
          )}
        </ul>
      </div>
    </div>
  );
};

export default Inbox;
