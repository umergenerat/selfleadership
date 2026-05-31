import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  BellRing,
  FileDown,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
  Sparkles,
  Gamepad2,
  Info,
  Compass,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import DifficultiesLab from './components/DifficultiesLab';
import ReadingJourney from './components/ReadingJourney';
import ProgressCurve from './components/ProgressCurve';
import InteractiveResources from './components/InteractiveResources';
import Guidance from './components/Guidance';
import UserGuide from './components/UserGuide';
import Settings from './components/Settings';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { useApp } from './context/AppContext';

type View = 'dashboard' | 'schedule' | 'difficulties' | 'reading' | 'progress' | 'resources' | 'orientation' | 'guide' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('raed_auth') === 'true');
  const [showLanding, setShowLanding] = useState(() => sessionStorage.getItem('raed_landing') !== 'false');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [viewHistory, setViewHistory] = useState<View[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAbsenceAlert, setShowAbsenceAlert] = useState(false);
  const { profile: student, toggleHealthAlert, credentials, preferences, setPreferences, t } = useApp();
  const healthAlert = student.healthAlertActive;

  // Persist auth and landing state
  React.useEffect(() => {
    sessionStorage.setItem('raed_auth', isAuthenticated.toString());
    sessionStorage.setItem('raed_landing', showLanding.toString());
  }, [isAuthenticated, showLanding]);

  // Handle browser close/refresh confirmation
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Absence tracking
  React.useEffect(() => {
    if (isAuthenticated && preferences.absenceAlerts?.enabled) {
      const lastDateStr = preferences.absenceAlerts.lastLoginDate;
      const threshold = preferences.absenceAlerts.thresholdDays || 2;
      
      if (lastDateStr) {
        const lastDate = new Date(lastDateStr);
        const today = new Date();
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays >= threshold) {
          setShowAbsenceAlert(true);
        } else if (diffDays > 0) {
          setPreferences(prev => ({
            ...prev,
            absenceAlerts: { ...prev.absenceAlerts, lastLoginDate: today.toISOString() }
          }));
        }
      } else {
        setPreferences(prev => ({
          ...prev,
          absenceAlerts: { ...prev.absenceAlerts, lastLoginDate: new Date().toISOString() }
        }));
      }
    }
  }, [isAuthenticated, preferences.absenceAlerts?.enabled]);

  React.useEffect(() => {
    if (preferences.theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
    document.documentElement.dir = preferences.language === 'ar' ? 'rtl' : 'ltr';
  }, [preferences.theme, preferences.language]);


  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <Login credentials={credentials} onLogin={() => setIsAuthenticated(true)} />;
  }

  const navigateTo = (view: View) => {
    if (view !== currentView) {
      setViewHistory(prev => [...prev, currentView]);
      setCurrentView(view);
    }
    setIsSidebarOpen(false);
  };

  const goBack = () => {
    if (viewHistory.length > 0) {
      const prevView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentView(prevView);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsAuthenticated(false);
    setShowLanding(true);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const views: Record<View, React.ReactNode> = {
    dashboard: <Dashboard />,
    schedule: <Schedule />,
    difficulties: <DifficultiesLab />,
    reading: <ReadingJourney />,
    progress: <ProgressCurve />,
    resources: <InteractiveResources />,
    orientation: <Guidance />,
    guide: <UserGuide />,
    settings: <Settings onClose={goBack} />
  };

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'schedule', label: t('schedule'), icon: CalendarDays },
    { id: 'difficulties', label: t('difficulties'), icon: Lightbulb },
    { id: 'resources', label: t('resources'), icon: Gamepad2 },
    { id: 'orientation', label: t('orientation'), icon: Compass },
    { id: 'reading', label: t('reading'), icon: BookOpen },
    { id: 'progress', label: t('progress'), icon: TrendingUp },
    { id: 'guide', label: t('guide'), icon: Info },
    { id: 'settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen w-full p-2 md:p-4 lg:p-6 gap-2 md:gap-4 lg:gap-6 text-white font-sans overflow-hidden" dir={preferences.language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-30 w-64 md:w-72 flex flex-col gap-4 lg:gap-6 shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 bg-[#0f172a] lg:bg-transparent p-4 lg:p-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="glass p-6 flex flex-col items-center gap-4 text-center mt-8 lg:mt-0 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-3 right-3 lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full p-[2px] relative avatar-no-invert"
            style={{ background: 'linear-gradient(135deg, #10b981, #0d9488, #10b981)', boxShadow: '0 0 25px rgba(16,185,129,0.35)' }}
          >
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-transparent" />
              <span className="text-3xl font-black text-emerald-400 relative z-10">{student.name.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-1 border-2 border-slate-900">
              <Sparkles size={10} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-white font-bold text-base">{student.name}</h2>
            <p className="text-emerald-400 text-xs mt-0.5 font-medium">{student.level}</p>
          </div>
        </div>

        <nav className="glass flex-1 py-3 overflow-y-auto flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id as View)}
                className={`w-full flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'text-emerald-400 nav-item-active' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
                style={isActive ? { width: 'calc(100% - 1rem)' } : {}}
              >
                <Icon size={19} className={isActive ? 'text-emerald-400' : ''} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="mr-auto w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
                )}
              </button>
            );
          })}
          
          <div className="mt-auto px-6 py-4 space-y-4">
              <button 
                onClick={handleExportPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 rounded-xl transition-colors text-sm"
              >
                <FileDown size={16} />
                <span>{t('export_pdf')}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-colors text-sm"
              >
                <LogOut size={16} />
                <span>{t('logout')}</span>
              </button>
             <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center">{student.school}</div>
             <div className="text-[10px] text-slate-500 tracking-widest text-center mt-2">{t('developed_by')} Aomar Ait Loutou</div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 lg:gap-6 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="glass px-4 md:px-8 py-4 flex justify-between items-center shrink-0" style={{ backdropFilter: 'blur(24px)' }}>
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Menu size={24} />
            </button>
            {viewHistory.length > 0 && (
              <button 
                onClick={goBack}
                className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
                title={t('back')}
              >
                <div className="bg-white/10 p-2 rounded-lg">
                  {preferences.language === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </div>
              </button>
            )}
            <div 
              className="bg-[#00a884] p-2.5 rounded-xl shrink-0 shadow-lg shadow-[#00a884]/20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowLanding(true)}
              title="العودة للصفحة الرئيسية"
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight">{t('app_title')}</h1>
              <p className="text-[10px] md:text-xs text-emerald-500/70 font-medium">Reading · Achieving · Evaluating · Developing</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Quick Health/Emergency Alert */}
            <button 
               onClick={toggleHealthAlert}
               className={`px-3 md:px-4 py-2 flex items-center gap-2 md:gap-3 transition-colors rounded-xl md:rounded-2xl ${
                 healthAlert ? 'alert-glass' : 'glass opacity-60 hover:opacity-100'
               }`}
            >
              <div className={`w-2 h-2 rounded-full ${healthAlert ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
              <div className="text-[10px] md:text-xs flex items-center gap-2">
                 <BellRing size={14} className={healthAlert ? 'text-red-400' : 'text-slate-300'} />
                 {healthAlert ? (
                   <>
                     <span className="text-red-400 font-bold hidden sm:block">{t('health_alert_active')}</span>
                     <span className="text-slate-300 hidden md:inline">{t('health_alert_msg')}</span>
                   </>
                 ) : (
                   <span className="text-slate-300 hidden sm:inline">{t('health_alert')}</span>
                 )}
              </div>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-20 md:pb-0" id="pdf-content-area">
          {healthAlert && (
            <div className="alert-glass mb-6 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-red-500/20 p-2 rounded-full shrink-0">
                <BellRing size={20} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-400 text-lg">تنبيه طارئ نشط!</h3>
                <p className="text-slate-300 mt-1 text-sm md:text-base">
                  تم تسجيل إشعار للقسم الإداري ولولي الأمر بخصوص وضعية طارئة. يرجى التوجه للإدارة.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    تم إرسال SMS لولي الأمر
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    تم إشعار الحراسة العامة
                  </span>
                </div>
              </div>
              <button 
                onClick={toggleHealthAlert}
                className="text-red-400 hover:bg-red-500/20 p-2 rounded-md transition-colors mt-2 sm:mt-0 whitespace-nowrap"
              >
                إلغاء التنبيه
              </button>
            </div>
          )}
          
          <div className="max-w-6xl mx-auto w-full pb-8">
            {views[currentView]}
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="glass max-w-md w-full p-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <LogOut size={32} className="text-red-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{t('exit_confirm_title')}</h3>
                  <p className="text-slate-400">{t('exit_confirm_msg')}</p>
                </div>
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    onClick={confirmLogout}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/25 transition-all"
                  >
                    {t('confirm')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Absence Alert Modal */}
        {showAbsenceAlert && preferences.absenceAlerts && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="glass max-w-md w-full p-8 border border-red-500/30 shadow-2xl animate-in fade-in zoom-in duration-300 relative">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">تنبيه تأخر عن المنصة</h3>
                  <p className="text-slate-300">
                    لقد تجاوزت المدة المسموحة للغياب عن المنصة ({preferences.absenceAlerts.thresholdDays} أيام).
                    يجب إرسال رسالة التنبيه للمسؤول لمتابعة تطورك.
                  </p>
                </div>
                <div className="flex gap-4 w-full flex-col mt-2">
                  <a 
                    href={`https://wa.me/${preferences.absenceAlerts.phoneNumber}?text=${encodeURIComponent(preferences.absenceAlerts.alertText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        absenceAlerts: { ...prev.absenceAlerts, lastLoginDate: new Date().toISOString() }
                      }));
                      setShowAbsenceAlert(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    إرسال عبر واتساب (WhatsApp)
                  </a>
                  <a 
                    href={`sms:${preferences.absenceAlerts.phoneNumber}?body=${encodeURIComponent(preferences.absenceAlerts.alertText)}`}
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        absenceAlerts: { ...prev.absenceAlerts, lastLoginDate: new Date().toISOString() }
                      }));
                      setShowAbsenceAlert(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 transition-all"
                  >
                    إرسال رسالة نصية (SMS)
                  </a>
                  <button 
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        absenceAlerts: { ...prev.absenceAlerts, lastLoginDate: new Date().toISOString() }
                      }));
                      setShowAbsenceAlert(false);
                    }}
                    className="mt-2 text-sm text-slate-400 hover:text-white underline transition-colors"
                  >
                    تخطي في الوقت الحالي
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

