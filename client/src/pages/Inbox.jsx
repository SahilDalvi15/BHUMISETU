import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Inbox as InboxIcon, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

const Inbox = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchInboxTasks();
  }, [filter]);

  const fetchInboxTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // In real scenario we use the filter query param
      const res = await axios.get(`http://localhost:5000/api/workflows/inbox?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.data);
    } catch (err) {
      // Mock data for prototype
      const mockTasks = [
        { _id: '1', taskId: 'WF-1092', entityType: 'Proposal', stage: 'Under Verification', priority: 'High', dueDate: new Date(Date.now() + 86400000).toISOString(), isOverdue: false },
        { _id: '2', taskId: 'WF-1088', entityType: 'Notification', stage: 'Section 11 Draft Review', priority: 'Medium', dueDate: new Date(Date.now() - 86400000).toISOString(), isOverdue: true },
        { _id: '3', taskId: 'WF-1095', entityType: 'Compensation', stage: 'Assessment Approval', priority: 'Critical', dueDate: new Date(Date.now() + 172800000).toISOString(), isOverdue: false },
      ];
      setTasks(filter === 'overdue' ? mockTasks.filter(t => t.isOverdue) : mockTasks);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
          <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">1</span>
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
          {loading ? (
             <li className="px-6 py-12 flex justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-green"></div>
             </li>
          ) : tasks.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-200" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up!</h3>
              <p className="mt-1 text-sm text-gray-500">You have no tasks in this view.</p>
            </li>
          ) : (
            tasks.map((task) => (
              <li key={task._id}>
                <a href="#" className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm font-medium text-gov-green truncate">
                        <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {task.taskId} - {task.entityType} ({task.stage})
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
                          Requires action from: {user?.role}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {task.isOverdue ? (
                          <AlertTriangle className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        <p className={task.isOverdue ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <ChevronRight className="ml-4 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Inbox;
