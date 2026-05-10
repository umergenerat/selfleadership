import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AttendanceStatus = 'present' | 'partial' | 'late' | 'missed' | 'absent' | 'none';

export interface ReadingSession {
  id: string;
  title: string;
  type: 'homework' | 'free';
  date: string;
  duration: number; // in minutes
}

export interface Difficulty {
  id: string;
  subject: string;
  topic: string;
  status: 'processing' | 'active' | 'resolved';
  solution?: string;
  date: string;
  aiSuggestions?: string[];
  matchedPeers?: Peer[];
  matchedTeacher?: Teacher;
}

export interface ClassSession {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  status: AttendanceStatus;
}

export interface UserProfile {
  name: string;
  level: string;
  school: string;
  id: string;
  healthAlert: string;
  healthAlertActive: boolean;
  counselorPhone?: string;
}

export interface UserPreferences {
  language: string;
  theme: string;
  notifications: boolean;
}

// Reading quota configuration (academic year / term)
export interface ReadingConfig {
  weeksPerYear: number;      // e.g. 34
  sessionsPerWeek: number;   // 5 or 6
  dailyPeriods: number;      // 1 or 2 (morning / afternoon)
}

// Login credentials (stored in localStorage)
export interface UserCredentials {
  username: string;
  password: string;
}

export interface Contact {
  id: string;
  name: string;
  contactNumber: string;
}

export interface Peer extends Contact {
  strengths: string[];
}

export interface Teacher extends Contact {
  subject: string;
}

export type AssessmentType = 'التقويم التشخيصي' | 'الفرض 1' | 'الفرض 2' | 'الفرض 3';

export interface GradeEntry {
  name: AssessmentType;
  [subject: string]: any;
}

interface AppContextType {
  profile: UserProfile;
  preferences: UserPreferences;
  subjects: string[];
  schedule: Record<string, ClassSession[]>;
  peers: Peer[];
  teachers: Teacher[];
  readingSessions: ReadingSession[];
  difficulties: Difficulty[];
  grades: GradeEntry[];
  readingConfig: ReadingConfig;
  credentials: UserCredentials;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  setSubjects: React.Dispatch<React.SetStateAction<string[]>>;
  setSchedule: React.Dispatch<React.SetStateAction<Record<string, ClassSession[]>>>;
  setReadingSessions: React.Dispatch<React.SetStateAction<ReadingSession[]>>;
  setDifficulties: React.Dispatch<React.SetStateAction<Difficulty[]>>;
  setPeers: React.Dispatch<React.SetStateAction<Peer[]>>;
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  setGrades: React.Dispatch<React.SetStateAction<GradeEntry[]>>;
  setReadingConfig: React.Dispatch<React.SetStateAction<ReadingConfig>>;
  setCredentials: React.Dispatch<React.SetStateAction<UserCredentials>>;
  toggleHealthAlert: () => void;
  resetData: () => void;
  t: (key: string) => string;
}

const defaultSubjects = [
  'الرياضيات', 'اللغة العربية', 'اللغة الفرنسية', 'التربية الإسلامية', 
  'الاجتماعيات', 'علوم الحياة والأرض', 'الفيزياء', 'التربية البدنية'
];

const defaultSchedule: Record<string, ClassSession[]> = {
  'الإثنين': [],
  'الثلاثاء': [],
  'الأربعاء': [],
  'الخميس': [],
  'الجمعة': [],
  'السبت': []
};

const defaultPeers: Peer[] = [];

const defaultTeachers: Teacher[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  name: "عمر ايت لوتو",
  level: "السنة الثالثة إعدادي - فوج 4",
  school: "ثانوية المختار السوسي الإعدادية",
  id: "J123456789",
  healthAlert: "حساسية من مادة الغلوتين",
  healthAlertActive: false,
  counselorPhone: "212600000000"
};

const defaultPreferences: UserPreferences = {
  language: "ar",
  theme: "frosted",
  notifications: true
};

const defaultReadingConfig: ReadingConfig = {
  weeksPerYear: 34,
  sessionsPerWeek: 5,
  dailyPeriods: 2
};

const defaultCredentials: UserCredentials = {
  username: 'admin',
  password: 'J123456789'
};

const defaultReadingSessions: ReadingSession[] = [];

const defaultDifficulties: Difficulty[] = [];

const defaultGrades: GradeEntry[] = [];

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const loadData = () => {
    try {
      const saved = localStorage.getItem('self_leadership_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load data", e);
    }
    return null;
  };

  const savedData = loadData();

  const [profile, setProfile] = useState<UserProfile>(savedData?.profile || defaultProfile);
  const [preferences, setPreferences] = useState<UserPreferences>(savedData?.preferences || defaultPreferences);
  const [subjects, setSubjects] = useState<string[]>(savedData?.subjects || defaultSubjects);
  const [schedule, setSchedule] = useState<Record<string, ClassSession[]>>(savedData?.schedule || defaultSchedule);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>(savedData?.readingSessions || defaultReadingSessions);
  const [difficulties, setDifficulties] = useState<Difficulty[]>(savedData?.difficulties || defaultDifficulties);
  const [peers, setPeers] = useState<Peer[]>(savedData?.peers || defaultPeers);
  const [teachers, setTeachers] = useState<Teacher[]>(savedData?.teachers || defaultTeachers);
  const [grades, setGrades] = useState<GradeEntry[]>(savedData?.grades || defaultGrades);
  const [readingConfig, setReadingConfig] = useState<ReadingConfig>(savedData?.readingConfig || defaultReadingConfig);
  const [credentials, setCredentials] = useState<UserCredentials>(savedData?.credentials || defaultCredentials);

  React.useEffect(() => {
    localStorage.setItem('self_leadership_data', JSON.stringify({
      profile, preferences, subjects, schedule, readingSessions, difficulties, peers, teachers, grades, readingConfig, credentials
    }));
  }, [profile, preferences, subjects, schedule, readingSessions, difficulties, peers, teachers, grades, readingConfig, credentials]);

  const toggleHealthAlert = () => {
    setProfile(prev => ({ ...prev, healthAlertActive: !prev.healthAlertActive }));
  };

  const resetData = () => {
    localStorage.removeItem('self_leadership_data');
    setProfile(defaultProfile);
    setPreferences(defaultPreferences);
    setSubjects(defaultSubjects);
    setSchedule(defaultSchedule);
    setReadingSessions(defaultReadingSessions);
    setDifficulties(defaultDifficulties);
    setPeers(defaultPeers);
    setTeachers(defaultTeachers);
    setGrades(defaultGrades);
    setReadingConfig(defaultReadingConfig);
    setCredentials(defaultCredentials);
  };

  const t = (key: string): string => {
    const translations: Record<string, any> = {
      ar: {
        dashboard: 'لوحة القيادة',
        schedule: 'البرنامج والمواظبة',
        difficulties: 'مختبر التحديات',
        resources: 'المصادر التفاعلية',
        orientation: 'التوجيه التربوي',
        reading: 'رحلة المطالعة',
        progress: 'منحنى التطور',
        guide: 'دليل الاستخدام',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',
        export_pdf: 'تصدير الدفتر (PDF)',
        welcome: 'مرحباً بك في مسارك الذكي،',
        health_alert: 'تنبيه صحي/طارئ',
        health_alert_active: 'تنبيه صحي خاص:',
        health_alert_msg: 'حساسية معلنة نشطة',
        cancel_alert: 'إلغاء التنبيه',
        school: 'المؤسسة التعليمية',
        developed_by: 'تطوير: عمر أيت لوتو',
        enter_app: 'دخول التطبيق',
        install: 'تثبيت',
        share: 'مشاركة',
        app_title: 'رائد',
        app_subtitle: 'بوابة التطوير الذاتي والمطالعة الموجهة للمتعلم',
        exit_confirm_title: 'تأكيد الخروج',
        exit_confirm_msg: 'هل أنت متأكد من رغبتك في الخروج من التطبيق؟',
        confirm: 'تأكيد',
        cancel: 'إلغاء',
        back: 'رجوع'
      },
      fr: {
        dashboard: 'Tableau de bord',
        schedule: 'Emploi du temps',
        difficulties: 'Labo des défis',
        resources: 'Ressources interactives',
        orientation: 'Orientation',
        reading: 'Voyage de lecture',
        progress: 'Courbe de progrès',
        guide: 'Guide utilisateur',
        settings: 'Paramètres',
        logout: 'Déconnexion',
        export_pdf: 'Exporter PDF',
        welcome: 'Bienvenue dans votre parcours intelligent,',
        health_alert: 'Alerte Santé/Urgence',
        health_alert_active: 'Alerte Santé Spéciale:',
        health_alert_msg: 'Allergie déclarée active',
        cancel_alert: 'Annuler l\'alerte',
        school: 'Établissement',
        developed_by: 'Développé par: Aomar Ait Loutou',
        enter_app: 'Entrer dans l\'application',
        install: 'Installer',
        share: 'Partager',
        app_title: 'RAED',
        app_subtitle: 'Portail de développement personnel et lecture dirigée',
        exit_confirm_title: 'Confirmer la sortie',
        exit_confirm_msg: 'Êtes-vous sûr de vouloir quitter l\'application ?',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        back: 'Retour'
      },
      en: {
        dashboard: 'Dashboard',
        schedule: 'Schedule',
        difficulties: 'Challenges Lab',
        resources: 'Interactive Resources',
        orientation: 'Orientation',
        reading: 'Reading Journey',
        progress: 'Progress Curve',
        guide: 'User Guide',
        settings: 'Settings',
        logout: 'Logout',
        export_pdf: 'Export PDF',
        welcome: 'Welcome to your smart journey,',
        health_alert: 'Health/Emergency Alert',
        health_alert_active: 'Special Health Alert:',
        health_alert_msg: 'Active declared allergy',
        cancel_alert: 'Cancel Alert',
        school: 'School',
        developed_by: 'Developed by: Aomar Ait Loutou',
        enter_app: 'Enter App',
        install: 'Install',
        share: 'Share',
        app_title: 'RAED',
        app_subtitle: 'Self-Leadership Portal and Guided Reading',
        exit_confirm_title: 'Confirm Exit',
        exit_confirm_msg: 'Are you sure you want to exit the app?',
        confirm: 'Confirm',
        cancel: 'Cancel',
        back: 'Back'
      }
    };
    return translations[preferences.language]?.[key] || translations['ar']?.[key] || key;
  };

  return (
    <AppContext.Provider value={{
      profile, preferences, subjects, schedule, peers, teachers, readingSessions, difficulties, grades, readingConfig, credentials,
      setProfile, setPreferences, setSubjects, setSchedule, setReadingSessions, setDifficulties, setPeers, setTeachers, setGrades, setReadingConfig, setCredentials, toggleHealthAlert, resetData, t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
