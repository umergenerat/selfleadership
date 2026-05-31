import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Globe, Layout, Save, Book, Plus, X, Calendar as CalendarIcon, Users, GraduationCap, BookOpen, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2, Lock, RefreshCw } from 'lucide-react';
import { useApp, Peer, Teacher, ReadingConfig, UserCredentials } from '../context/AppContext';

export default function Settings({ onClose }: { onClose?: () => void }) {
  const { profile: globalProfile, preferences: globalPreferences, subjects: globalSubjects, peers: globalPeers, teachers: globalTeachers, readingConfig: globalReadingConfig, credentials: globalCredentials, setProfile, setPreferences, setSubjects, setPeers, setTeachers, setReadingConfig, setCredentials, resetData } = useApp();

  const [profile, setProfileState] = useState(globalProfile);
  const [preferences, setPreferencesState] = useState(globalPreferences);
  
  const [peers, setPeersState] = useState<Peer[]>(globalPeers);
  const [newPeerName, setNewPeerName] = useState('');
  const [newPeerContact, setNewPeerContact] = useState('');
  const [newPeerStrengths, setNewPeerStrengths] = useState<string[]>([]);

  const [teachers, setTeachersState] = useState<Teacher[]>(globalTeachers);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherContact, setNewTeacherContact] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  
  const updatePeer = (id: string, field: keyof Peer, value: any) => {
    setPeersState(peers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateTeacher = (id: string, field: keyof Teacher, value: any) => {
    setTeachersState(teachers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };
  
  const [subjects, setSubjectsState] = useState<string[]>(globalSubjects);
  const [newSubject, setNewSubject] = useState('');
  
  const { schedule: globalSchedule, setSchedule } = useApp();
  const [schedule, setScheduleState] = useState(globalSchedule);

  const [readingConfig, setReadingConfigState] = useState<ReadingConfig>(globalReadingConfig);

  // Derived max sessions
  const computedMax = readingConfig.weeksPerYear * readingConfig.sessionsPerWeek * readingConfig.dailyPeriods;

  // --- Credentials / Security ---
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [credMsg, setCredMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => setIsSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileState({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setPreferencesState({ ...preferences, [e.target.name]: value });
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjectsState([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjectsState(subjects.filter(s => s !== subjectToRemove));
  };

  const executeSave = () => {
    setProfile(profile);
    setPreferences(preferences);
    setSubjects(subjects);
    setSchedule(schedule);
    setPeers(peers);
    setTeachers(teachers);
    setReadingConfig(readingConfig);
    setIsSaved(true);
    setShowConfirm(false);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleCredentialsSave = () => {
    setCredMsg(null);
    if (currentPassword !== globalCredentials.password) {
      setCredMsg({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة.' });
      return;
    }
    const updatedUsername = newUsername.trim() || globalCredentials.username;
    if (newPassword && newPassword !== confirmPassword) {
      setCredMsg({ type: 'error', text: 'كلمة المرور الجديدة وتأكيدها غير متطابقتين.' });
      return;
    }
    if (newPassword && newPassword.length < 4) {
      setCredMsg({ type: 'error', text: 'يجب أن تتكوّن كلمة المرور من 4 أحرف على الأقل.' });
      return;
    }
    setCredentials({
      username: updatedUsername,
      password: newPassword || globalCredentials.password
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setNewUsername('');
    setCredMsg({ type: 'success', text: 'تم تحديث بيانات الاعتماد بنجاح.' });
    setTimeout(() => setCredMsg(null), 4000);
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    setIsSaved(true);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass bg-slate-900 border border-red-500/20 p-6 max-w-sm w-full rounded-2xl shadow-2xl">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <AlertCircle size={24} />
              تأكيد استعادة الافتراضيات
            </h3>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              هل أنت متأكد من رغبتك في مسح كافة التعديلات واستعادة الإعدادات الافتراضية؟ سيتم حذف كافة البيانات المسجلة.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium border border-white/10"
              >
                إلغاء
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold shadow-lg shadow-red-500/20"
              >
                تأكيد الاستعادة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="glass bg-slate-900 border border-white/20 p-6 max-w-sm w-full rounded-2xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">تأكيد الإعدادات</h3>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              هل أنت متأكد من حفظ التعديلات الجديدة؟ سيتم تطبيق هذا البرنامج والمواد الدراسية في كافة أرجاء التطبيق.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium border border-white/10"
              >
                إلغاء
              </button>
              <button 
                onClick={executeSave}
                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-bold shadow-lg shadow-emerald-500/20"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="text-emerald-400" />
            الإعدادات
          </h2>
          {isSaved && (
            <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium animate-pulse border border-emerald-500/30">
              تم الحفظ بنجاح
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Profile Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <User className="text-slate-400" size={20} />
              <h3 className="text-xl font-semibold text-white">المعلومات الشخصية</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">الاسم الكامل</label>
                 <input 
                   type="text" 
                   name="name"
                   value={profile.name}
                   onChange={handleProfileChange}
                   className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">رقم مسار</label>
                 <input 
                   type="text" 
                   name="id"
                   value={profile.id}
                   onChange={handleProfileChange}
                   className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">المستوى الدراسي والفوج</label>
                 <input 
                   type="text" 
                   name="level"
                   value={profile.level}
                   onChange={handleProfileChange}
                   className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">المؤسسة التعليمية</label>
                 <input 
                   type="text" 
                   name="school"
                   value={profile.school}
                   onChange={handleProfileChange}
                   className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-red-300 mb-1">حالة صحية خاصة (للعرض للطوارئ)</label>
                 <input 
                   type="text" 
                   name="healthAlert"
                   value={profile.healthAlert}
                   onChange={handleProfileChange}
                   className="w-full bg-red-900/20 border border-red-500/30 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-red-300/50"
                   placeholder="مثال: حساسية، ربو..."
                 />
               </div>
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                    <User size={14} className="text-emerald-400" />
                    رقم هاتف مستشار التوجيه
                 </label>
                 <input 
                   type="text" 
                   name="counselorPhone"
                   value={profile.counselorPhone || ''}
                   onChange={handleProfileChange}
                   className="w-full bg-slate-900/50 border border-emerald-500/30 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500 text-left"
                   placeholder="مثال: 212600000000"
                   dir="ltr"
                 />
                 <p className="text-[11px] text-slate-500 mt-1">هذا الرقم سيُستخدم للتواصل المباشر مع المستشار عبر الواتساب</p>
              </div>
            </div>
          </div>

          {/* Preferences Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <Layout className="text-slate-400" size={20} />
              <h3 className="text-xl font-semibold text-white">تفضيلات العرض والتطبيق</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                    <Globe size={16} className="text-slate-400" /> اللغة
                 </label>
                 <select 
                   name="language"
                   value={preferences.language}
                   onChange={handlePreferencesChange}
                   className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                 >
                   <option value="ar" className="bg-slate-900">العربية</option>
                   <option value="fr" className="bg-slate-900">Français</option>
                   <option value="en" className="bg-slate-900">English</option>
                 </select>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-slate-300 mb-1">السمة البصرية (المطهر)</label>
                 <select 
                   name="theme"
                   value={preferences.theme}
                   onChange={handlePreferencesChange}
                   className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                 >
                   <option value="frosted" className="bg-slate-900">الوضع الليلي (الزجاجي)</option>
                   <option value="light" className="bg-slate-900">الوضع النهاري</option>
                 </select>
              </div>

               <div className="pt-4 border-t border-white/5 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      name="notifications"
                      checked={preferences.notifications}
                      onChange={handlePreferencesChange}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${preferences.notifications ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.notifications ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="text-slate-300 font-medium">
                    تفعيل الإشعارات التحفيزية
                  </div>
                </label>

                <div className="pt-2"></div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={preferences.absenceAlerts?.enabled || false}
                      onChange={(e) => setPreferencesState({
                        ...preferences, 
                        absenceAlerts: { ...preferences.absenceAlerts, enabled: e.target.checked }
                      })}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${preferences.absenceAlerts?.enabled ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.absenceAlerts?.enabled ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="text-slate-300 font-medium">
                    تفعيل تنبيهات الغياب والانقطاع
                  </div>
                </label>

                {preferences.absenceAlerts?.enabled && (
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-red-500/20 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">بعد كم يوم من الانقطاع يتم التنبيه؟</label>
                      <input 
                        type="number" 
                        min="1"
                        max="30"
                        value={preferences.absenceAlerts?.thresholdDays || 2}
                        onChange={(e) => setPreferencesState({
                          ...preferences, 
                          absenceAlerts: { ...preferences.absenceAlerts, thresholdDays: parseInt(e.target.value) || 2 }
                        })}
                        className="w-full bg-slate-800/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">رقم الهاتف لتلقي التنبيه (واتساب/SMS)</label>
                      <input 
                        type="text" 
                        value={preferences.absenceAlerts?.phoneNumber || ''}
                        onChange={(e) => setPreferencesState({
                          ...preferences, 
                          absenceAlerts: { ...preferences.absenceAlerts, phoneNumber: e.target.value }
                        })}
                        className="w-full bg-slate-800/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all text-left"
                        dir="ltr"
                        placeholder="212600000000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">نص الرسالة</label>
                      <textarea 
                        value={preferences.absenceAlerts?.alertText || ''}
                        onChange={(e) => setPreferencesState({
                          ...preferences, 
                          absenceAlerts: { ...preferences.absenceAlerts, alertText: e.target.value }
                        })}
                        className="w-full bg-slate-800/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subjects Management */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-2 mt-8">
              <Book className="text-slate-400" size={20} />
              <h3 className="text-xl font-semibold text-white">المواد الدراسية المقررة</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 text-slate-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                    {subject}
                    <button 
                      onClick={() => handleRemoveSubject(subject)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="إضافة مادة جديدة..."
                  className="flex-1 bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubject();
                    }
                  }}
                />
                <button 
                  onClick={handleAddSubject}
                  disabled={!newSubject.trim()}
                  className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl border border-white/10 transition-colors disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Networks Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 border-t border-white/10 pt-8">
          
          {/* Peers Management */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <Users className="text-slate-400" size={20} />
              <h3 className="text-xl font-semibold text-white">إدارة شبكة الأقران المعتمدة</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                {peers.map((peer, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 relative group flex items-start justify-between">
                    <div className="flex-1 ml-4 space-y-1.5">
                      <input 
                        value={peer.name} 
                        onChange={(e) => updatePeer(peer.id, 'name', e.target.value)} 
                        className="w-full bg-transparent hover:bg-white/5 text-sm font-bold text-white focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 py-0.5 transition-colors"
                        placeholder="اسم الزميل"
                      />
                      <input 
                        value={peer.contactNumber} 
                        onChange={(e) => updatePeer(peer.id, 'contactNumber', e.target.value)} 
                        className="w-full bg-transparent hover:bg-white/5 text-xs text-slate-400 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 py-0.5 transition-colors text-left"
                        dir="ltr"
                        placeholder="رقم الواتساب"
                      />
                      <div className="flex flex-wrap gap-1 px-1">
                        {peer.strengths.map(s => <span key={s} className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">{s}</span>)}
                      </div>
                    </div>
                    <button 
                      onClick={() => setPeersState(peers.filter(p => p.id !== peer.id))}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="حذف"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 space-y-3">
                <h4 className="text-sm font-medium text-emerald-400">إضافة زميل مرجعي</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={newPeerName}
                    onChange={(e) => setNewPeerName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="bg-slate-900/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input 
                    type="text" 
                    value={newPeerContact}
                    onChange={(e) => setNewPeerContact(e.target.value)}
                    placeholder="رقم الواتساب"
                    className="bg-slate-900/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">نقاط القوة (المواد):</p>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (newPeerStrengths.includes(s)) {
                            setNewPeerStrengths(newPeerStrengths.filter(x => x !== s));
                          } else {
                            setNewPeerStrengths([...newPeerStrengths, s]);
                          }
                        }}
                        className={`text-xs px-2 py-1 rounded transition-colors ${newPeerStrengths.includes(s) ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (newPeerName && newPeerContact) {
                      setPeersState([...peers, { id: 'p' + Date.now(), name: newPeerName, contactNumber: newPeerContact, strengths: newPeerStrengths }]);
                      setNewPeerName('');
                      setNewPeerContact('');
                      setNewPeerStrengths([]);
                    }
                  }}
                  disabled={!newPeerName || !newPeerContact}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> إضافة للقائمة
                </button>
              </div>
            </div>
          </div>

          {/* Teachers Management */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <GraduationCap className="text-slate-400" size={20} />
              <h3 className="text-xl font-semibold text-white">إدارة شبكة الاستشارات الأكاديمية</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                {teachers.map((teacher, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 relative group flex items-start justify-between">
                    <div className="flex-1 ml-4 space-y-1.5">
                      <input 
                        value={teacher.name} 
                        onChange={(e) => updateTeacher(teacher.id, 'name', e.target.value)} 
                        className="w-full bg-transparent hover:bg-white/5 text-sm font-bold text-white focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 transition-colors"
                        placeholder="اسم الأستاذ"
                      />
                      <input 
                        value={teacher.contactNumber} 
                        onChange={(e) => updateTeacher(teacher.id, 'contactNumber', e.target.value)} 
                        className="w-full bg-transparent hover:bg-white/5 text-xs text-slate-400 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 transition-colors text-left"
                        dir="ltr"
                        placeholder="رقم الواتساب"
                      />
                      <div className="px-1 mt-1">
                        <select 
                          value={teacher.subject}
                          onChange={(e) => updateTeacher(teacher.id, 'subject', e.target.value)}
                          className="bg-transparent hover:bg-white/5 text-[10px] font-bold text-blue-400 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 transition-colors w-full"
                        >
                          {subjects.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                          {!subjects.includes(teacher.subject) && <option value={teacher.subject} className="bg-slate-900">{teacher.subject}</option>}
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={() => setTeachersState(teachers.filter(t => t.id !== teacher.id))}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="حذف"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 space-y-3">
                <h4 className="text-sm font-medium text-blue-400">إضافة مستشار أكاديمي</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="اسم الأستاذ"
                    className="bg-slate-900/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="text" 
                    value={newTeacherContact}
                    onChange={(e) => setNewTeacherContact(e.target.value)}
                    placeholder="رقم الواتساب"
                    className="bg-slate-900/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-2">المادة المدرسة:</p>
                  <select 
                    value={newTeacherSubject}
                    onChange={(e) => setNewTeacherSubject(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">اختر المادة...</option>
                    {subjects.map(s => (
                      <option key={s} value={s} className="bg-slate-900">{s}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => {
                    if (newTeacherName && newTeacherContact && newTeacherSubject) {
                      setTeachersState([...teachers, { id: 't' + Date.now(), name: newTeacherName, contactNumber: newTeacherContact, subject: newTeacherSubject }]);
                      setNewTeacherName('');
                      setNewTeacherContact('');
                      setNewTeacherSubject('');
                    }
                  }}
                  disabled={!newTeacherName || !newTeacherContact || !newTeacherSubject}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> إضافة للقائمة
                </button>
              </div>
            </div>
          </div>
          
        </div>

        {/* Schedule Management */}
        <div className="mt-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-slate-400" size={20} />
              <h3 className="text-xl font-semibold text-white">إدارة البرنامج الأسبوعي</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(schedule).map((day) => (
              <div key={day} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-emerald-400">{day}</h4>
                  <button 
                    onClick={() => {
                      const newSession = {
                        id: Math.random().toString(36).substr(2, 9),
                        subject: subjects[0] || 'مادة جديدة',
                        teacher: 'أستاذ',
                        time: '08:00 - 10:00',
                        status: 'present' as const
                      };
                      setScheduleState(prev => ({
                        ...prev,
                        [day]: [...prev[day], newSession]
                      }));
                    }}
                    className="text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} /> إضافة
                  </button>
                </div>
                
                <div className="space-y-3">
                  {schedule[day].length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-sm">لا توجد حصص</div>
                  ) : (
                    schedule[day].map((session, idx) => (
                      <div key={session.id} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 relative group">
                        <button
                          onClick={() => {
                            setScheduleState(prev => ({
                              ...prev,
                              [day]: prev[day].filter(s => s.id !== session.id)
                            }));
                          }}
                          className="absolute left-2 top-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                        
                        <select
                          value={session.subject}
                          onChange={(e) => {
                            const newSchedule = { ...schedule };
                            newSchedule[day][idx].subject = e.target.value;
                            setScheduleState(newSchedule);
                          }}
                          className="w-full bg-transparent text-white font-medium text-sm mb-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded"
                        >
                          {subjects.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                          {!subjects.includes(session.subject) && (
                            <option value={session.subject} className="bg-slate-900">{session.subject}</option>
                          )}
                        </select>
                        
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={session.time}
                            onChange={(e) => {
                              const newSchedule = { ...schedule };
                              newSchedule[day][idx].time = e.target.value;
                              setScheduleState(newSchedule);
                            }}
                            className="bg-transparent text-slate-400 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-1"
                            placeholder="الوقت"
                          />
                          <input 
                            type="text" 
                            value={session.teacher}
                            onChange={(e) => {
                              const newSchedule = { ...schedule };
                              newSchedule[day][idx].teacher = e.target.value;
                              setScheduleState(newSchedule);
                            }}
                            className="bg-transparent text-slate-400 text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-1"
                            placeholder="الأستاذ"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Security / Credentials Section ===== */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-2 mb-6">
            <ShieldCheck className="text-blue-400" size={20} />
            <h3 className="text-xl font-semibold text-white">الأمان وبيانات الاعتماد</h3>
          </div>

          {/* Current credentials display */}
          <div className="mb-6 flex items-center gap-4 bg-blue-500/8 border border-blue-500/20 rounded-2xl p-4">
            <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">اسم المستخدم الحالي</p>
              <p className="text-white font-bold text-base">{globalCredentials.username}</p>
            </div>
            <div className="mr-auto text-right">
              <p className="text-xs text-slate-500 mb-0.5">كلمة المرور</p>
              <p className="text-slate-400 text-sm tracking-widest">{'•'.repeat(globalCredentials.password.length)}</p>
            </div>
          </div>

          {/* Feedback message */}
          {credMsg && (
            <div
              className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm font-medium border ${
                credMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
              style={{ animation: 'fade-in-up 0.3s ease-out' }}
            >
              {credMsg.type === 'success'
                ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                : <AlertCircle size={18} className="text-red-400 shrink-0" />}
              {credMsg.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left column: username */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <User size={15} className="text-slate-400" />
                تغيير اسم المستخدم
              </h4>

              <div>
                <label className="block text-xs text-slate-500 mb-1">اسم المستخدم الجديد</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder={globalCredentials.username}
                  className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
                <p className="text-[11px] text-slate-600 mt-1">اتركه فارغاً للإبقاء على الاسم الحالي</p>
              </div>
            </div>

            {/* Right column: password */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Lock size={15} className="text-slate-400" />
                تغيير كلمة المرور
              </h4>

              {/* New password */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة مرور جديدة (4 أحرف على الأقل)"
                    className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">تأكيد كلمة المرور الجديدة</label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور"
                    className={`w-full bg-slate-900/50 border text-white rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-600 ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-500/50 focus:ring-red-500'
                        : confirmPassword && confirmPassword === newPassword && newPassword
                        ? 'border-emerald-500/50 focus:ring-emerald-500'
                        : 'border-white/10 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {confirmPassword && confirmPassword === newPassword && newPassword && (
                    <CheckCircle2 size={14} className="absolute left-9 top-1/2 -translate-y-1/2 text-emerald-400" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-600">اتركهما فارغتين للإبقاء على كلمة المرور الحالية</p>
            </div>
          </div>

          {/* Current password confirmation — always required */}
          <div className="mt-5 p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
            <label className="block text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <Lock size={15} />
              كلمة المرور الحالية (مطلوبة للتأكيد)
            </label>
            <div className="relative max-w-sm">
              <input
                type={showCurrentPwd ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="أدخل كلمة مرورك الحالية للمتابعة"
                className="w-full bg-slate-900/50 border border-amber-500/30 text-white rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleCredentialsSave}
              disabled={!currentPassword}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:cursor-not-allowed"
            >
              <ShieldCheck size={18} />
              حفظ بيانات الاعتماد
            </button>
          </div>
        </div>

        {/* Reading Config Section */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-2 mb-6">
            <BookOpen className="text-emerald-400" size={20} />
            <h3 className="text-xl font-semibold text-white">ضبط رزنامة حصص المطالعة</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weeks per year */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
              <p className="text-sm font-medium text-slate-300 mb-1">عدد أسابيع الموسم الدراسي</p>
              <p className="text-xs text-slate-500 mb-4">الافتراضي: 34 أسبوعاً</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReadingConfigState(c => ({ ...c, weeksPerYear: Math.max(1, c.weeksPerYear - 1) }))}
                  className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition-colors"
                >−</button>
                <span className="text-3xl font-black text-emerald-400 min-w-[3rem] text-center">
                  {readingConfig.weeksPerYear}
                </span>
                <button
                  onClick={() => setReadingConfigState(c => ({ ...c, weeksPerYear: Math.min(52, c.weeksPerYear + 1) }))}
                  className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg flex items-center justify-center transition-colors"
                >+</button>
              </div>
              <p className="text-xs text-slate-500 mt-3">النطاق: 1 – 52 أسبوعاً</p>
            </div>

            {/* Sessions per week */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
              <p className="text-sm font-medium text-slate-300 mb-1">حصص المطالعة في الأسبوع</p>
              <p className="text-xs text-slate-500 mb-4">اختر 5 أو 6 حصص</p>
              <div className="flex gap-2">
                {[5, 6].map(n => (
                  <button
                    key={n}
                    onClick={() => setReadingConfigState(c => ({ ...c, sessionsPerWeek: n }))}
                    className={`flex-1 py-3 rounded-xl font-black text-xl transition-all ${
                      readingConfig.sessionsPerWeek === n
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">حصة × أسبوع</p>
            </div>

            {/* Daily periods */}
            <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
              <p className="text-sm font-medium text-slate-300 mb-1">الفترات اليومية</p>
              <p className="text-xs text-slate-500 mb-4">صباحي / مسائي أو كليهما</p>
              <div className="flex gap-2">
                {[1, 2].map(n => (
                  <button
                    key={n}
                    onClick={() => setReadingConfigState(c => ({ ...c, dailyPeriods: n }))}
                    className={`flex-1 py-3 rounded-xl font-black text-lg transition-all ${
                      readingConfig.dailyPeriods === n
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {n === 1 ? 'فترة واحدة' : 'فترتان'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3">فترة في اليوم</p>
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-5 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">معادلة الحساب</p>
              <p className="text-base font-bold text-white mt-1">
                {readingConfig.weeksPerYear} أسبوع
                <span className="text-slate-400 mx-2">×</span>
                {readingConfig.sessionsPerWeek} حصص/أسبوع
                <span className="text-slate-400 mx-2">×</span>
                {readingConfig.dailyPeriods} فترة/يوم
                <span className="text-slate-400 mx-2">=</span>
                <span className="text-emerald-400 font-black text-xl">{computedMax}</span>
                <span className="text-slate-400 mr-1 text-base"> حصة مطالعة</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">إجمالي الحصص المقررة</p>
              <p className="text-4xl font-black text-emerald-400" style={{ textShadow: '0 0 20px rgba(16,185,129,0.4)' }}>{computedMax}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between gap-4 pt-6 border-t border-white/10">
           <button 
             onClick={() => setShowResetConfirm(true)}
             className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors w-full md:w-auto"
           >
             <RefreshCw size={20} />
             استعادة الإعدادات الافتراضية
           </button>
           <button 
             onClick={handleSave}
             className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm badge-glow w-full md:w-auto"
           >
             <Save size={20} />
             حفظ الإعدادات
           </button>
        </div>

      </div>
    </div>
  );
}
