import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map as MapIcon, Layers, Search, MapPin, Maximize2, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

const GIS = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedParcel, setSelectedParcel] = useState(null);
  
  const mockParcels = useAppStore(state => state.parcels);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapIcon className="w-6 h-6 mr-2 text-gov-green" />
            GIS {t("pages.gis.title")} & Parcel Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Interactive cadastral map integrated with real-time acquisition intelligence.
          </p>
        </div>
      </div>

      <div className="flex-1 relative bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        
        {/* The Full Width Map */}
        <MapContainer center={[19.25, 73.40]} zoom={10} className="w-full h-full z-0" zoomControl={false} attributionControl={false}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
          {mockParcels.map((parcel) => (
            <CircleMarker 
              key={parcel.id} 
              center={[parcel.lat, parcel.lng]}
              radius={7}
              pathOptions={{ 
                color: parcel.risk === 'HIGH' ? '#ef4444' : parcel.risk === 'MEDIUM' ? '#f59e0b' : '#10b981',
                fillColor: parcel.risk === 'HIGH' ? '#ef4444' : parcel.risk === 'MEDIUM' ? '#f59e0b' : '#10b981',
                fillOpacity: 0.9,
                weight: 2
              }}
              eventHandlers={{
                click: () => {
                  setSelectedParcel(parcel);
                },
              }}
            >
              <LeafletTooltip>
                <strong>{parcel.id}</strong><br/>
                Risk: {parcel.risk}
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Floating Quick Presets (Top Left) */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-[400] max-w-[calc(100%-3.5rem)] sm:max-w-none">
          <div className="bg-white/95 backdrop-blur-sm p-1 sm:p-1.5 rounded-lg shadow-md flex items-center border border-gray-100 gap-1 sm:space-x-1 overflow-x-auto no-scrollbar">
            <span className="hidden sm:inline text-xs font-bold text-gray-500 uppercase tracking-wider px-2 shrink-0">Quick Presets:</span>
            <button className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors whitespace-nowrap shrink-0">Mumbai-MMR</button>
            <button className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap shrink-0">Delhi NCR</button>
            <button className="hidden sm:inline-block px-3 py-1.5 text-[10px] sm:text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap shrink-0">Bengaluru Risk Corridor</button>
          </div>
        </div>

        {/* Map Controls Mock (Top Right, if no parcel selected) */}
        {!selectedParcel && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-1 sm:p-2 flex flex-col space-y-1 sm:space-y-2 z-[400] border border-gray-100">
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Layers className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Search className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <button className="p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          </div>
        )}

        <div className="absolute bottom-8 sm:bottom-6 left-2 sm:left-4 z-[400] bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-sm border border-gray-100 text-[10px] sm:text-xs text-gray-500 font-mono font-medium flex items-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mr-1.5 sm:mr-2 animate-pulse"></div>
          Bhuvan API Connected
        </div>

        {/* Right Side: Floating Parcel Details Panel */}
        {selectedParcel && (
          <div className="absolute top-14 sm:top-4 bottom-4 left-2 right-2 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 overflow-y-auto z-[500] animate-fade-in-up">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selectedParcel.id}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Village: Murbad, Thane</p>
                </div>
                <div className="flex flex-col items-end">
                  <button onClick={() => setSelectedParcel(null)} className="text-gray-400 hover:text-gray-600 mb-2 bg-gray-100 p-1 rounded-full">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className={`px-2 py-1 text-[9px] sm:text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    selectedParcel.risk === 'HIGH' ? 'bg-red-100 text-red-800' : 
                    selectedParcel.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedParcel.risk} RISK
                  </span>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-500 mb-2 sm:mb-3 uppercase tracking-wider">Parcel Attributes</h3>
                  <div className="bg-gray-50/50 p-3 sm:p-4 rounded-xl border border-gray-100 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center"><span className="text-gray-500">Area:</span><span className="font-bold text-gray-900">{selectedParcel.area} Hectares</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500">Type:</span><span className="font-bold text-gray-900">{selectedParcel.type}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500">Current Owner:</span><span className="font-bold text-gray-900 text-right max-w-[120px] truncate">{selectedParcel.owner}</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-500">Location:</span><span className="font-mono text-[10px] sm:text-xs text-gray-600">{selectedParcel.lat.toFixed(4)}, {selectedParcel.lng.toFixed(4)}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-500 mb-2 sm:mb-3 uppercase tracking-wider">Acquisition Status</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2">
                      <div className="bg-emerald-500 h-1.5 sm:h-2 rounded-full" style={{ width: selectedParcel.status === 'Land Identified' ? '25%' : selectedParcel.status === 'Notified' ? '50%' : '75%' }}></div>
                    </div>
                  </div>
                  <p className="text-right text-[10px] sm:text-xs font-bold text-emerald-600 mt-1.5 sm:mt-2">{selectedParcel.status}</p>
                </div>

                {selectedParcel.blocker && (
                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 sm:p-4 flex items-start">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3 shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-red-800">Active Blocker</p>
                      <p className="text-[10px] sm:text-xs text-red-700 mt-0.5 sm:mt-1 font-medium">{selectedParcel.blocker}</p>
                    </div>
                  </div>
                )}

                {['Field Verification Officer', 'District Officer', 'State Officer', 'National Admin'].includes(user?.role) && (
                  <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-100">
                    <Link to="/workflow/tasks" className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                      Log Field Verification
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GIS;
