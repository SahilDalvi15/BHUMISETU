import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Proposals = () => {
  const { user } = useAuth();

  // Mock proposals for prototype
  const proposals = [
    { id: 'PROP-10293', title: 'Land Req for Highway Expansion NH-4', district: 'Thane', status: 'Under Verification', date: 'Oct 12, 2026' },
    { id: 'PROP-10290', title: 'Solar Park Setup Area', district: 'Pune', status: 'Clarification Required', date: 'Oct 10, 2026' },
    { id: 'PROP-10285', title: 'Water Irrigation Canal Network', district: 'Nashik', status: 'Approved', date: 'Sep 28, 2026' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Under Verification': return 'bg-blue-100 text-blue-800';
      case 'Clarification Required': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-gov-green" />
            Land Proposals
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Submit and track land requirement proposals from Requiring Bodies.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {['Land Requiring Body', 'Project Implementing Agency', 'National Admin'].includes(user?.role) && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none">
              <Plus className="w-4 h-4 mr-2" />
              Submit Proposal
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {proposals.map((prop) => (
            <li key={prop.id} className="hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gov-green truncate">{prop.id} - {prop.title}</p>
                  <p className="flex items-center text-sm text-gray-500 mt-1">
                    District: {prop.district} • Submitted: {prop.date}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(prop.status)}`}>
                    {prop.status}
                  </span>
                  <div className="mt-2 text-sm text-gray-500 flex items-center hover:text-gov-green cursor-pointer">
                    <Activity className="w-4 h-4 mr-1" /> View Tracking <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Proposals;
