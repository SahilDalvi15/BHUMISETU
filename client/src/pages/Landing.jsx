import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, ArrowRight, ShieldCheck, Map, Users, Target, CheckCircle2, TrendingUp, BarChart3, Database, Workflow, FileText } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="relative flex items-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-3 py-1.5 border border-gray-200 shadow-sm">
      <Globe className="w-4 h-4 text-emerald-700 mr-2" />
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="bg-transparent text-gray-900 text-sm font-semibold focus:outline-none cursor-pointer appearance-none pr-4"
      >
        <option value="en">English (EN)</option>
        <option value="hi">हिंदी (HI)</option>
        <option value="mr">मराठी (MR)</option>
      </select>
    </div>
  );
};

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      
      {/* 1. Government Context Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-1.5 px-4 text-[11px] sm:text-xs font-semibold flex flex-col sm:flex-row justify-between items-center z-50 relative text-gray-600 tracking-wide">
        <div className="flex items-center space-x-2">
          <span className="uppercase text-emerald-800 font-bold">{t('landing.govIndia')}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{t('landing.ministryRural')}</span>
          <span className="hidden sm:inline">•</span>
          <span>{t('landing.dolr')}</span>
        </div>
        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-amber-200">
            {t('landing.prototypeAlert')}
          </span>
        </div>
      </div>

      {/* 2. Main Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group cursor-pointer">
                <img 
                  className="h-12 w-auto border border-gray-200 shadow-sm p-1 rounded bg-white group-hover:shadow-md transition-shadow" 
                  src="/logo.jpg" 
                  alt="BhumiSetu Logo" 
                  onError={(e) => e.target.style.display='none'} 
                />
                <div className="ml-4 border-l-2 border-emerald-600 pl-4 py-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-none">
                    {t('landing.navTitle')}
                  </h1>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                    {t('landing.tagline')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <LanguageSwitcher />
              <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-emerald-700 transition-colors hidden sm:block">
                {t('landing.login')}
              </Link>
              <Link to="/dashboard" className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-emerald-700 hover:bg-emerald-800 transition-colors">
                {t('landing.enterPlatform')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section (White-First Design) */}
      <div className="relative bg-white overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pb-40 border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 mr-2" />
            National Digital Land System
          </span>
          
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[1.1]">
            {t('landing.heroTitle')}
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-500 md:text-xl leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/dashboard" className="px-8 py-4 border border-transparent text-base font-extrabold rounded-lg shadow-lg text-white bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-1 transition-all flex items-center group">
              {t('landing.enterPlatform')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Complete Land Acquisition Lifecycle */}
      <div className="py-24 bg-gray-50 border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase">{t('landing.lifecycleTitle')}</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">End-to-End Workflow Tracking</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {[
                { step: 1, title: t('landing.stage1'), icon: <FileText className="w-6 h-6" />, color: 'blue' },
                { step: 2, title: t('landing.stage2'), icon: <Map className="w-6 h-6" />, color: 'emerald' },
                { step: 3, title: t('landing.stage3'), icon: <CheckCircle2 className="w-6 h-6" />, color: 'amber' },
                { step: 4, title: t('landing.stage4'), icon: <Users className="w-6 h-6" />, color: 'purple' },
                { step: 5, title: t('landing.stage5'), icon: <Target className="w-6 h-6" />, color: 'green' }
              ].map((s) => (
                <div key={s.step} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all text-center group cursor-pointer">
                  <div className={`w-12 h-12 mx-auto bg-${s.color}-50 text-${s.color}-600 rounded-full flex items-center justify-center mb-4 border border-${s.color}-100 group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. One Platform, Every Stakeholder */}
      <div className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('landing.stakeholdersTitle')}</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Role-based access control ensuring every department sees precisely the data they need.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stakeholder 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.stakeholderNational')}</h3>
              <p className="text-gray-600 mb-6">{t('landing.stakeholderNationalDesc')}</p>
              <Link to="/dashboard" className="text-emerald-700 font-bold hover:underline flex items-center text-sm">
                View Command Center <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Stakeholder 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-6">
                <Workflow className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.stakeholderState')}</h3>
              <p className="text-gray-600 mb-6">{t('landing.stakeholderStateDesc')}</p>
              <Link to="/dashboard" className="text-blue-700 font-bold hover:underline flex items-center text-sm">
                View District Portal <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Stakeholder 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-amber-300 transition-colors">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.stakeholderRB')}</h3>
              <p className="text-gray-600 mb-6">{t('landing.stakeholderRBDesc')}</p>
              <Link to="/dashboard" className="text-amber-700 font-bold hover:underline flex items-center text-sm">
                View RB Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. USP / Intelligence */}
      <div className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-400 tracking-widest uppercase">{t('landing.uspTitle')}</h2>
            <p className="mt-2 text-3xl font-extrabold sm:text-4xl">Data-Driven Governance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full">
                <TrendingUp className="w-8 h-8 text-red-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{t('landing.uspRisk')}</h3>
                <p className="text-gray-400 text-sm">{t('landing.uspRiskDesc')}</p>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full">
                <Map className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{t('landing.uspGIS')}</h3>
                <p className="text-gray-400 text-sm">{t('landing.uspGISDesc')}</p>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full">
                <Database className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{t('landing.uspWhatIf')}</h3>
                <p className="text-gray-400 text-sm">{t('landing.uspWhatIfDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-10">
            <div className="flex items-center mb-6 md:mb-0">
              <img className="h-12 w-auto grayscale opacity-80 mix-blend-multiply" src="/logo.jpg" alt="Government Logo" onError={(e) => e.target.style.display='none'} />
              <div className="ml-4">
                <p className="text-base font-extrabold text-gray-900">{t('landing.govIndia')}</p>
                <p className="text-sm text-gray-500 font-medium">{t('landing.dolr')}</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                {t('landing.prototypeAlert')}
              </span>
              <p className="text-xs text-gray-500 font-medium max-w-xs ml-auto">
                {t('landing.disclaimer')}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} {t('landing.navTitle')}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-emerald-700">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-700">Terms of Service</a>
              <a href="#" className="hover:text-emerald-700">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
