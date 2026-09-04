import React, { useState } from 'react';
import { Map as MapIcon, Layers, Search, MapPin, Maximize2, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const GIS = () => {
  const { user } = useAuth();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Mock Parcels to click on the map
  const mockParcels = [
    { id: 'MH-THN-P045', area: 2.4, type: 'Agricultural', status: 'Land Identified', owner: 'Ramesh Patil', lat: 19.25, lng: 73.40, risk: 'LOW' },
    { id: 'MH-THN-P046', area: 1.2, type: 'Commercial', status: 'Notified', owner: 'Vikas Sharma', lat: 19.26, lng: 73.41, risk: 'MEDIUM', blocker: 'Valuation Dispute' },
    { id: 'MH-THN-P047', area: 5.0, type: 'Forest', status: 'Awarded', owner: 'State Govt', lat: 19.24, lng: 73.39, risk: 'HIGH', blocker: 'Clearance Pending' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapIcon className="w-6 h-6 mr-2 text-gov-green" />
            GIS Spatial Viewer & Parcel Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Interactive cadastral map integrated with real-time acquisition intelligence.
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white shadow rounded-lg border border-gray-200">
        
        {/* Left Side: The "Map" */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center border-r border-gray-200">
          
          {/* Map Controls Mock */}
          <div className="absolute top-4 left-4 bg-white shadow rounded-md p-2 flex flex-col space-y-2 z-10">
            <button className="p-2 text-gray-600 hover:text-gov-green hover:bg-gray-50 rounded"><Layers className="w-5 h-5" /></button>
            <button className="p-2 text-gray-600 hover:text-gov-green hover:bg-gray-50 rounded"><Search className="w-5 h-5" /></button>
            <button className="p-2 text-gray-600 hover:text-gov-green hover:bg-gray-50 rounded"><Maximize2 className="w-5 h-5" /></button>
          </div>

          {/* Map Grid Pattern (Stylistic Mock) */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          {/* Map Pins */}
          <div className="relative w-full h-full">
            {mockParcels.map((parcel, idx) => (
              <div 
                key={parcel.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform z-10"
                style={{ 
                  top: `${40 + (idx * 15)}%`, 
                  left: `${40 + (idx * 10)}%` 
                }}
                onClick={() => setSelectedParcel(parcel)}
              >
                <div className={`flex flex-col items-center ${selectedParcel?.id === parcel.id ? 'animate-bounce' : ''}`}>
                  <div className={`p-1.5 rounded text-xs font-bold text-white shadow mb-1 ${
                    parcel.risk === 'HIGH' ? 'bg-red-600' : parcel.risk === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gov-green'
                  }`}>
                    {parcel.id}
                  </div>
                  <MapPin className={`w-8 h-8 ${selectedParcel?.id === parcel.id ? 'text-blue-600' : 'text-gray-700'}`} fill="white" />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded shadow text-xs text-gray-500 font-mono">
            Lat: 19.25012 | Lng: 73.40192 • Bhuvan API Connected
          </div>
        </div>

        {/* Right Side: Parcel Details Panel */}
        <div className="w-96 bg-white overflow-y-auto">
          {selectedParcel ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedParcel.id}</h2>
                  <p className="text-sm text-gray-500 mt-1">Village: Murbad, Thane</p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  selectedParcel.risk === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {selectedParcel.risk} RISK
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Parcel Attributes</h3>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Area:</span><span className="font-medium">{selectedParcel.area} Hectares</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Type:</span><span className="font-medium">{selectedParcel.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Current Owner:</span><span className="font-medium">{selectedParcel.owner}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Acquisition Status</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gov-green h-2.5 rounded-full" style={{ width: selectedParcel.status === 'Land Identified' ? '25%' : selectedParcel.status === 'Notified' ? '50%' : '75%' }}></div>
                    </div>
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-1">{selectedParcel.status}</p>
                </div>

                {selectedParcel.blocker && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Active Blocker</p>
                      <p className="text-sm text-red-700">{selectedParcel.blocker}</p>
                    </div>
                  </div>
                )}

                {['Field Officer', 'District Officer'].includes(user?.role) && (
                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gov-green text-gov-green rounded hover:bg-green-50 transition-colors">
                      Log Field Verification
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400">
              <MapIcon className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm">Select a land parcel on the map to view detailed acquisition intelligence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GIS;
