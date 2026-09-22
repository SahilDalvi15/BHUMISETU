import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, ShieldCheck, Map, Users, Target, CheckCircle2, TrendingUp, BarChart3, Database, Workflow, FileText, Mail, Phone, MapPin, Send, MessageSquare, Share2 } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="relative flex items-center bg-[#FFFFFF] hover:bg-[#F8FAFC] transition-colors rounded h-10 px-3 border border-[#CBD5E1] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
      <Globe className="w-4 h-4 text-[#13643B] mr-2" />
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="bg-transparent text-[#0F172A] text-sm font-semibold focus:outline-none cursor-pointer appearance-none pr-4"
      >
        <option value="en">English (EN)</option>
        <option value="hi">हिंदी (HI)</option>
        <option value="mr">मराठी (MR)</option>
      </select>
    </div>
  );
};

const Landing = () => {
  const { t, i18n } = useTranslation();
  
  // Hero Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      
      {/* 1. Government Context Bar (40px) */}
      <div className="bg-[#F1F5F9] border-b border-[#E2E8F0] h-10 px-4 flex justify-between items-center z-50 text-xs font-semibold text-[#334155] tracking-wide">
        <div className="flex items-center space-x-2">
          <span className="uppercase text-[#13643B] tracking-widest font-bold">{t('landing.govIndia')}</span>
          <span className="hidden sm:inline text-[#64748B]">•</span>
          <span className="hidden sm:inline">{t('landing.ministryRural')}</span>
          <span className="hidden sm:inline text-[#64748B]">•</span>
          <span>{t('landing.dolr')}</span>
        </div>
      </div>

      {/* 2. Main Navigation (Transparent Overlay) */}
      <nav className="absolute top-10 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center border-b border-white/10">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  className="h-10 w-auto p-1 rounded bg-white shadow-lg" 
                  src="/logo.jpg" 
                  alt="BhumiSetu Logo" 
                  onError={(e) => e.target.style.display='none'} 
                />
                <div className="ml-4 border-l-2 border-white/30 pl-4 py-1">
                  <h1 className="text-2xl font-bold tracking-tight text-white leading-none drop-shadow-md">
                    {t('landing.navTitle')}
                  </h1>
                  <p className="text-[11px] text-gray-300 font-semibold uppercase tracking-widest mt-1 drop-shadow-md">
                    {t('landing.tagline')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Glass Language Switcher */}
              <div className="relative flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors rounded-full h-10 px-4 border border-white/20">
                <Globe className="w-4 h-4 text-white mr-2" />
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer appearance-none pr-2 [&>option]:text-black"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
              
              <Link to="/login" className="text-sm font-semibold text-gray-200 hover:text-white transition-colors hidden sm:block drop-shadow-md">
                {t('landing.login')}
              </Link>
              <Link to="/dashboard" className="inline-flex items-center h-10 px-6 border border-white/20 text-sm font-bold rounded-full text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all">
                {t('landing.enterPlatform')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section (Cinematic Image Carousel) */}
      <div className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 z-0 bg-black">
          {heroImages.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt="Hero Background" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentImageIndex === idx ? 'opacity-70' : 'opacity-0'}`} 
            />
          ))}
          {/* Gradient Overlay for Text Readability - Tighter at top for Nav */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-transparent to-[#0F172A]/90 z-10" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/20 mb-8 uppercase tracking-widest shadow-lg">
            <ShieldCheck className="w-4 h-4 mr-2" />
            National Digital Land System
          </span>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
            {t('landing.heroTitle')}
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed font-medium drop-shadow-md">
            {t('landing.heroSubtitle')}
          </p>
          
          <div className="mt-12 flex justify-center gap-4">
            <Link to="/dashboard" className="h-14 px-8 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-lg font-bold flex items-center group shadow-2xl transition-all hover:scale-105 border border-white/20">
              {t('landing.enterPlatform')}
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Mock Logos at bottom (Fixed position inside container) */}
        <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center items-center space-x-10 opacity-70 text-white font-bold text-sm uppercase tracking-widest">
          <span className="flex flex-col items-center"><span className="text-[10px] text-gray-300 mb-2">Trusted By</span> NHAI</span>
          <span className="mt-5">MoRTH</span>
          <span className="mt-5">Indian Railways</span>
          <span className="mt-5">State Revenue Depts</span>
        </div>
      </div>

      {/* 4. Why Authorities Choose BHUMISETU (Split Layout) */}
      <div className="py-24 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Side: Headline, Paragraph, Stats */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight mb-6">
                Why National Authorities Choose BHUMISETU for Land Acquisition
              </h2>
              <p className="text-[#334155] text-lg mb-10 leading-relaxed">
                From initial proposal to final possession, we make tracking infrastructure projects transparent, secure, and data-driven with expert-crafted digital workflows.
              </p>
              
              <div className="flex justify-between items-center border-t border-[#E2E8F0] pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                    <Database className="w-6 h-6 text-[#13643B]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0F172A]">₹50k Cr+</h4>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider mt-1">Compensation</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                    <Map className="w-6 h-6 text-[#13643B]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0F172A]">10k+</h4>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider mt-1">Land Parcels</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-[#13643B]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0F172A]">4</h4>
                  <p className="text-xs text-[#64748B] uppercase tracking-wider mt-1">States Live</p>
                </div>
              </div>
            </div>
            
            {/* Right Side: Vertical Stacked Cards */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              {/* Card 1 */}
              <div className="flex items-center bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all shadow-sm">
                <div className="w-16 h-16 shrink-0 bg-[#0F172A] rounded-lg flex items-center justify-center text-white mr-6">
                  <Globe className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">National Command</h3>
                  <p className="text-sm text-[#475569] leading-snug">Real-time pan-India overview, budget utilization, and critical bottleneck tracking.</p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="flex items-center bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all shadow-sm">
                <div className="w-16 h-16 shrink-0 bg-[#334155] rounded-lg flex items-center justify-center text-white mr-6">
                  <Workflow className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">State & District Approvals</h3>
                  <p className="text-sm text-[#475569] leading-snug">Jurisdictional monitoring, multi-level workflow approvals, and delay tracking.</p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="flex items-center bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all shadow-sm">
                <div className="w-16 h-16 shrink-0 bg-[#64748B] rounded-lg flex items-center justify-center text-white mr-6">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">Requiring Body Portal</h3>
                  <p className="text-sm text-[#475569] leading-snug">Track land proposals, compensation disbursement, and physical acquisition progress.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Core Operational Platforms (Image Cards Layout) */}
      <div className="py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#F1F5F9] rounded-3xl p-10 md:p-16 border border-[#E2E8F0]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Core Operational Modules</h2>
              <p className="text-[#475569] text-sm max-w-md">From spatial mapping to direct benefit transfers, discover the engines powering BHUMISETU.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link to="/dashboard" className="px-6 py-2.5 bg-[#0F172A] text-white text-sm font-bold rounded-full hover:bg-[#334155] transition-colors">
                Explore Platform
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Image Card 1 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="/gis.jpg" alt="GIS Mapping" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-widest mb-2 border border-white/20">Spatial Data</span>
                <h3 className="text-lg font-bold leading-tight">GIS & Land<br/>Mapping</h3>
              </div>
            </div>
            
            {/* Image Card 2 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="/dbt.jpg" alt="Direct Benefit Transfer" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2 py-1 bg-[#10B981]/80 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-widest mb-2 border border-[#34D399]/30">Finance</span>
                <h3 className="text-lg font-bold leading-tight">Direct Benefit<br/>Transfer (DBT)</h3>
              </div>
            </div>
            
            {/* Image Card 3 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="/rr.jpg" alt="Rehabilitation" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-widest mb-2 border border-white/20">Social Impact</span>
                <h3 className="text-lg font-bold leading-tight">Rehabilitation<br/>& Resettlement</h3>
              </div>
            </div>
            
            {/* Image Card 4 */}
            <div className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="/legal.jpg" alt="Legal Clearances" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-widest mb-2 border border-white/20">Compliance</span>
                <h3 className="text-lg font-bold leading-tight">Statutory<br/>Clearances</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. USP / Intelligence */}
      <div className="py-24 bg-[#0F172A] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold text-[#8BD7A4] tracking-widest uppercase">{t('landing.uspTitle')}</h2>
            <p className="mt-2 text-2xl font-bold">Data-Driven Governance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155] h-full shadow-[0_1px_2px_0_rgba(0,0,0,0.5)]">
                <TrendingUp className="w-6 h-6 text-[#E65100] mb-4" />
                <h3 className="text-base font-bold mb-2">{t('landing.uspRisk')}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{t('landing.uspRiskDesc')}</p>
              </div>
            </div>
            <div>
              <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155] h-full shadow-[0_1px_2px_0_rgba(0,0,0,0.5)]">
                <Map className="w-6 h-6 text-[#8BD7A4] mb-4" />
                <h3 className="text-base font-bold mb-2">{t('landing.uspGIS')}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{t('landing.uspGISDesc')}</p>
              </div>
            </div>
            <div>
              <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155] h-full shadow-[0_1px_2px_0_rgba(0,0,0,0.5)]">
                <Database className="w-6 h-6 text-[#0284C7] mb-4" />
                <h3 className="text-base font-bold mb-2">{t('landing.uspWhatIf')}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{t('landing.uspWhatIfDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Footer (Immersive Background) */}
      <footer className="relative bg-gradient-to-b from-[#FFFFFF] via-[#05110B] to-[#05110B] text-gray-300 overflow-hidden pt-40 pb-12">
        {/* Background Silhouette */}
        <div className="absolute inset-0 z-0 flex items-end">
          <img 
            src="/footer_bg_forest.jpg" 
            alt="Footer Background" 
            className="w-full h-full object-cover object-bottom opacity-50"
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)', 
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)' 
            }} 
          />
          {/* Gradient to blend with content at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030906] via-[#05110B]/90 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Platform</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">National Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GIS Mapping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DBT Tracker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">R&R Modules</a></li>
              </ul>
            </div>
            
            {/* Column 2: Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Stakeholders</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Ministry of Rural Dev</a></li>
                <li><a href="#" className="hover:text-white transition-colors">NHAI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">State Governments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Citizens Portal</a></li>
              </ul>
            </div>
            
            {/* Column 3: Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-b border-white/20 pb-2 inline-block">Legal & Data</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
            
            {/* Column 4: Contact Info */}
            <div className="md:text-right">
              <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">BHUMISETU</h2>
              <ul className="space-y-4 text-sm font-medium inline-block text-left md:text-right">
                <li className="flex items-start md:justify-end gap-3">
                  <span>Department of Land Resources<br/>New Delhi, India 110001</span>
                  <MapPin className="w-5 h-5 shrink-0 opacity-70 mt-0.5 hidden md:block" />
                  <MapPin className="w-5 h-5 shrink-0 opacity-70 mt-0.5 md:hidden order-first" />
                </li>
                <li className="flex items-center md:justify-end gap-3">
                  <span>+91 11 2338 1234</span>
                  <Phone className="w-4 h-4 opacity-70 hidden md:block" />
                  <Phone className="w-4 h-4 opacity-70 md:hidden order-first" />
                </li>
                <li className="flex items-center md:justify-end gap-3">
                  <span>support@bhumisetu.gov.in</span>
                  <Mail className="w-4 h-4 opacity-70 hidden md:block" />
                  <Mail className="w-4 h-4 opacity-70 md:hidden order-first" />
                </li>
              </ul>
            </div>
            
          </div>
          
          {/* Bottom Bar: Social & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <p className="text-sm font-medium mb-4 md:mb-0 opacity-70">
              &copy; {new Date().getFullYear()} Government of India. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                <Mail className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                <MessageSquare className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all">
                <Share2 className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
