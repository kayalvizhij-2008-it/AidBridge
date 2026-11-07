'use client';

import React, { useState } from 'react';
import {
  Building2,
  HeartPulse,
  Home,
  MapPin,
  Navigation,
  Shield,
  Layers,
  Filter,
  CheckCircle2,
  Info,
  Clock,
  Phone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PremiumButton } from '@/components/ui/PremiumButton';

export interface ProviderLocation {
  id: string;
  name: string;
  type: 'SHELTER' | 'HOSPITAL' | 'FOOD_BANK' | 'OUTREACH_ZONE';
  typeLabel: string;
  district: string;
  address: string;
  coordinates: { x: number; y: number }; // Percentage in grid (0-100)
  capacityTotal: number;
  capacityAvailable: number;
  capacityUnit: string;
  phone: string;
  hours: string;
  status: 'ONLINE' | 'LIMITED' | 'RESERVED';
  description: string;
  slaRate: string;
}

const PROVIDERS: ProviderLocation[] = [
  {
    id: 'prov-1',
    name: 'St. Jude Emergency Haven',
    type: 'SHELTER',
    typeLabel: 'Emergency Shelter',
    district: 'North District Zone 4',
    address: '420 Sanctuary Way, Northside',
    coordinates: { x: 28, y: 32 },
    capacityTotal: 40,
    capacityAvailable: 18,
    capacityUnit: 'Emergency Beds',
    phone: '+1 (555) 019-4820',
    hours: '24/7 Intake Available',
    status: 'ONLINE',
    description: 'Immediate crisis beds with warm meals, secure storage lockers, and onsite case manager triage.',
    slaRate: '98.4%',
  },
  {
    id: 'prov-2',
    name: 'Metropolitan General Hospital',
    type: 'HOSPITAL',
    typeLabel: 'Clinical Hospital',
    district: 'Civic Core & Healthcare Precinct',
    address: '100 Medical Center Blvd, Floor 1',
    coordinates: { x: 62, y: 44 },
    capacityTotal: 15,
    capacityAvailable: 4,
    capacityUnit: 'Clinical Beds',
    phone: '+1 (555) 014-9900',
    hours: '24/7 Acute Triage',
    status: 'LIMITED',
    description: 'Acute stabilization, wound dressings, psychiatric evaluation, and urgent care intake.',
    slaRate: '99.1%',
  },
  {
    id: 'prov-3',
    name: 'Hope Community Nutritional Center',
    type: 'FOOD_BANK',
    typeLabel: 'Nutrition & Rations',
    district: 'East Industrial Corridor',
    address: '88 Commerce Parkway, Bay 4',
    coordinates: { x: 74, y: 68 },
    capacityTotal: 300,
    capacityAvailable: 142,
    capacityUnit: 'Caloric Food Bundles',
    phone: '+1 (555) 012-3341',
    hours: '06:00 – 22:00 Daily',
    status: 'ONLINE',
    description: 'Fresh hot meals, shelf-stable emergency food boxes, and baby formula supplies.',
    slaRate: '97.8%',
  },
  {
    id: 'prov-4',
    name: 'Civic Plaza Outreach Station Alpha',
    type: 'OUTREACH_ZONE',
    typeLabel: 'Street Outreach Zone',
    district: 'Central Metro Transit Hub',
    address: 'Underground Concourse Gate 3',
    coordinates: { x: 44, y: 56 },
    capacityTotal: 8,
    capacityAvailable: 5,
    capacityUnit: 'Field Caseworkers',
    phone: '+1 (555) 018-7712',
    hours: 'Active Patrols: 08:00 – 00:00',
    status: 'ONLINE',
    description: 'Rapid intake, verbal consent recording, warm dry socks, and emergency referral coordination.',
    slaRate: '100%',
  },
  {
    id: 'prov-5',
    name: 'Riverside Transitional Sanctuary',
    type: 'SHELTER',
    typeLabel: 'Transitional Housing',
    district: 'South Riverfront Sector',
    address: '512 Riverview Avenue',
    coordinates: { x: 34, y: 76 },
    capacityTotal: 25,
    capacityAvailable: 7,
    capacityUnit: 'Transitional Rooms',
    phone: '+1 (555) 017-6623',
    hours: '09:00 – 21:00 Referrals Only',
    status: 'ONLINE',
    description: 'Medium-term stabilization housing with career retraining, mental health services, and welfare linkage.',
    slaRate: '96.5%',
  },
];

export function ServiceNetworkMap({ className = '' }: { className?: string }) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<ProviderLocation>(PROVIDERS[0]);

  const filteredProviders = PROVIDERS.filter(
    (p) => filterType === 'ALL' || p.type === filterType
  );

  return (
    <div className={`w-full rounded-2xl bg-white border border-[#E4E8E5] shadow-card overflow-hidden ${className}`}>
      {/* Top Header & Filter Controls */}
      <div className="p-5 border-b border-[#E4E8E5] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F5F3EC]/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#176B67] animate-pulse" />
            <h3 className="text-base font-bold text-[#182536] tracking-tight">
              Metropolitan Service Coverage & Capacity Map
            </h3>
            <Badge variant="champagne" className="text-[10px]">
              SYNTHETIC DEMO
            </Badge>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time geospatial synchronization across verified emergency shelters, clinics, and food distribution hubs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'All Services' },
            { id: 'SHELTER', label: 'Shelters' },
            { id: 'HOSPITAL', label: 'Hospitals' },
            { id: 'FOOD_BANK', label: 'Nutrition' },
            { id: 'OUTREACH_ZONE', label: 'Outreach' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === tab.id
                  ? 'bg-[#176B67] text-white shadow-sm'
                  : 'bg-white text-[#64748B] border border-[#E4E8E5] hover:bg-[#E8F3F0] hover:text-[#176B67]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left Interactive Canvas Map */}
        <div className="lg:col-span-8 relative bg-[#101D32] overflow-hidden select-none min-h-[380px] flex items-center justify-center">
          {/* Subtle Map Grid Background */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `linear-gradient(#35A99A 1px, transparent 1px), linear-gradient(90deg, #35A99A 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Simulated River / Geographic Feature */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0,220 C 180,180 320,310 500,260 S 800,320 1200,280"
              fill="none"
              stroke="#35A99A"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Simulated Active Referral Arcs */}
            <path
              d="M 280,160 Q 440,240 620,210"
              fill="none"
              stroke="#D8B77A"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* District Labels */}
          <span className="absolute top-6 left-8 text-[11px] font-mono text-[#F5F3EC]/40 uppercase tracking-widest pointer-events-none">
            Sector 1 • North District
          </span>
          <span className="absolute bottom-8 right-8 text-[11px] font-mono text-[#F5F3EC]/40 uppercase tracking-widest pointer-events-none">
            Sector 3 • South Riverbank
          </span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px] font-mono text-[#F5F3EC]/25 uppercase tracking-widest pointer-events-none">
            Civic Core Metro Zone
          </span>

          {/* Provider Pin Markers */}
          {filteredProviders.map((prov) => {
            const isSelected = selectedProvider.id === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => setSelectedProvider(prov)}
                style={{
                  left: `${prov.coordinates.x}%`,
                  top: `${prov.coordinates.y}%`,
                }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 z-20 focus:outline-none`}
                title={`${prov.name} (${prov.typeLabel})`}
              >
                {/* Ping animation when selected */}
                {isSelected && (
                  <span className="absolute w-12 h-12 rounded-full bg-[#35A99A]/30 animate-ping" />
                )}

                {/* Pin Container */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-lg transition-transform ${
                    isSelected
                      ? 'bg-[#176B67] border-[#D8B77A] text-white scale-110 z-30'
                      : 'bg-[#182B49] border-[#35A99A]/40 text-[#F5F3EC] hover:bg-[#176B67] hover:scale-105'
                  }`}
                >
                  {prov.type === 'SHELTER' && <Home className="w-3.5 h-3.5 text-[#D8B77A]" />}
                  {prov.type === 'HOSPITAL' && <HeartPulse className="w-3.5 h-3.5 text-[#35A99A]" />}
                  {prov.type === 'FOOD_BANK' && <Building2 className="w-3.5 h-3.5 text-[#D8B77A]" />}
                  {prov.type === 'OUTREACH_ZONE' && <MapPin className="w-3.5 h-3.5 text-[#35A99A]" />}
                  <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
                    {prov.name.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Privacy Safeguard Note Overlay on Map */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#101D32]/90 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-[11px] text-[#F5F3EC]/70 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#35A99A] shrink-0" />
            <span>
              <strong>Privacy Protection:</strong> Exact personal loci of individuals are strictly safeguarded and never exposed on public map layers.
            </span>
          </div>
        </div>

        {/* Right Selected Provider Dossier Panel */}
        <div className="lg:col-span-4 p-6 bg-white border-t lg:border-t-0 lg:border-l border-[#E4E8E5] flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <Badge
                  variant={
                    selectedProvider.type === 'SHELTER'
                      ? 'champagne'
                      : selectedProvider.type === 'HOSPITAL'
                      ? 'teal'
                      : 'default'
                  }
                >
                  {selectedProvider.typeLabel}
                </Badge>
                <span className="text-[11px] font-mono text-[#21845A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#21845A]" />
                  {selectedProvider.status}
                </span>
              </div>
              <h4 className="text-lg font-bold text-[#182536] leading-tight">
                {selectedProvider.name}
              </h4>
              <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-[#176B67]" />
                {selectedProvider.address}
              </p>
            </div>

            {/* Capacity Meter */}
            <div className="bg-[#E8F3F0] rounded-xl p-3.5 border border-[#176B67]/20">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#176B67] font-semibold">Live Available Capacity</span>
                <span className="font-mono font-bold text-[#101D32]">
                  {selectedProvider.capacityAvailable} / {selectedProvider.capacityTotal}{' '}
                  {selectedProvider.capacityUnit}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#176B67]/20">
                <div
                  className="bg-[#176B67] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(
                      10,
                      (selectedProvider.capacityAvailable / selectedProvider.capacityTotal) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Operational Specs */}
            <div className="space-y-2.5 text-xs text-[#182536]">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#176B67] shrink-0 mt-0.5" />
                <p className="text-[#64748B] leading-relaxed">
                  {selectedProvider.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Clock className="w-3.5 h-3.5 text-[#176B67]" />
                <span>{selectedProvider.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B]">
                <Phone className="w-3.5 h-3.5 text-[#176B67]" />
                <span>{selectedProvider.phone}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#E4E8E5] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
              <span>SLA Verification Rate:</span>
              <span className="font-bold text-[#176B67]">{selectedProvider.slaRate} Verified</span>
            </div>
            <PremiumButton
              href="/login"
              variant="primary"
              size="sm"
              withArrow
              className="w-full"
            >
              Route Referral to Provider
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceNetworkMap;
