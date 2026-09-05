import React, { useState } from 'react';
import { GitPullRequest, Search, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

const Tasks = () => {
  const { user } = useAuth();
  const allTasks = useAppStore(state => state.tasks);
  const completeTask = useAppStore(state => state.completeTask);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view workflow tasks.</div>;
  }

  // Determine what tasks the user can see
  const viewableTasks = allTasks.filter(t => {
    if (user.role === 'National Admin') return true;
    
    // Simplification for prototype: If not National, they see tasks assigned to their role
    // OR tasks related to projects in their jurisdiction (if we joined with projects). 
    // Here we'll just show tasks assigned to their role, similar to Inbox, but with more filters.
    // In a real system, State Officers would see ALL tasks in their state. We'll simulate that:
    if (user.role === 'State Officer') {
       return true; // Pretend they can see all in their state. The initial data doesn't have stateId on tasks, so we show all.
    }
    
    return t.assignedRole === user.role;
  });

  const filteredTasks = viewableTasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleComplete = (id) => {
    completeTask(id);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <GitPullRequest className="w-6 h-6 mr-2 text-blue-600" />
            Workflow & Task Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor process execution, SLA compliance, and unblock delayed stages.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 shadow rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search tasks by ID or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {filteredTasks.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              No workflow tasks match your filters.
            </li>
          ) : (
            filteredTasks.map((task) => {
              const isOverdue = new Date(task.dueAt) < new Date() && task.status !== 'Completed';
              
              return (
                <li key={task.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm font-medium text-blue-600 truncate">
                        {task.id} - {task.title}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex space-x-2">
                        {isOverdue && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityStyle(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <strong>Assigned to:</strong> &nbsp;{task.assignedRole}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <strong>Stage:</strong> &nbsp;{task.stage}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {isOverdue ? (
                          <AlertTriangle className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-500" />
                        ) : (
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        <p className={isOverdue ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(task.dueAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    {task.status !== 'Completed' && task.assignedRole === user.role && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => handleComplete(task.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Mark as Completed
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
