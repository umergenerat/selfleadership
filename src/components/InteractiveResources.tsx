import React, { useState, useMemo, useEffect } from 'react';
import { 
  PlayCircle, 
  Gamepad2, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Award,
  Lightbulb,
  ArrowRight,
  Puzzle,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Bank of all available resources
const RESOURCES_BANK = [
  {
    id: 1,
    title: 'حل النظمات / Résolution des systèmes',
    type: 'فيديو تفاعلي',
    subject: 'الرياضيات',
    keywords: ['نظمات', 'معادلات', 'مجهولين', 'système', 'équation'],
    icon: PlayCircle,
    color: 'from-blue-500 to-cyan-500',
    description: 'فيديو تعليمي مبسط يشرح طرق حل النظمات ذات مجهولين باستخدام التعويض والتأليفة الخطية.',
    url: 'https://www.youtube.com/embed/4K5H3sZ3nWg',
    source: 'YouTube'
  },
  {
    id: 2,
    title: 'Le Conditionnel Présent',
    type: 'فيديو تعليمي',
    subject: 'اللغة الفرنسية',
    keywords: ['conditionnel', 'conjugaison', 'présent'],
    icon: PlayCircle,
    color: 'from-purple-500 to-indigo-500',
    description: 'شرح مفصل ومبسط لقواعد تصريف الأفعال في الشرط الحاضر (Le conditionnel présent) مع أمثلة للتطبيق.',
    url: 'https://www.youtube.com/embed/q_G_gQYfudI',
    source: 'YouTube'
  },
  {
    id: 3,
    title: 'تحدي الحساب / PhET Arithmetic',
    type: 'لعبة تفاعلية مفتوحة المصدر',
    subject: 'الرياضيات',
    keywords: ['جمع', 'طرح', 'حساب', 'أرقام', 'calcul', 'nombres'],
    icon: Gamepad2,
    color: 'from-emerald-500 to-teal-500',
    description: 'لعبة تفاعلية مجانية من PhET (جامعة كولورادو) لتعلم وتدريب الدماغ على العمليات الحسابية الأساسية بسرعات مختلفة.',
    url: 'https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_all.html',
    source: 'PhET Interactive Simulations'
  },
  {
    id: 4,
    title: 'الجاذبية والأوربت / Gravity and Orbits',
    type: 'محاكاة علمية',
    subject: 'الفيزياء',
    keywords: ['فضاء', 'كواكب', 'شمس', 'جاذبية', 'فيزياء', 'gravité', 'espace', 'physique'],
    icon: Target,
    color: 'from-orange-500 to-rose-500',
    description: 'محاكاة تفاعلية مفتوحة المصدر لاستكشاف قوانين الجاذبية وحركة الكواكب والأقمار في المجموعة الشمسية.',
    url: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html?locale=ar',
    source: 'PhET Interactive Simulations'
  },
  {
    id: 5,
    title: 'قواعد الإملاء في اللغة العربية',
    type: 'فيديو تعليمي',
    subject: 'اللغة العربية',
    keywords: ['حروف', 'كلمات', 'إملاء', 'قراءة', 'تعبير', 'قواعد'],
    icon: BookOpen,
    color: 'from-pink-500 to-rose-400',
    description: 'درس مرئي يوضح أهم قواعد الإملاء وتصحيح الأخطاء الشائعة في الكتابة والتعبير باللغة العربية.',
    url: 'https://www.youtube.com/embed/Zf_2V7D_84g',
    source: 'YouTube'
  },
  {
    id: 6,
    title: 'GeoGebra: الآلة الحاسبة الرسومية',
    type: 'تطبيق تفاعلي',
    subject: 'الرياضيات',
    keywords: ['دوال', 'مبيان', 'هندسة', 'fonctions', 'graphique'],
    icon: Gamepad2,
    color: 'from-cyan-500 to-blue-600',
    description: 'تطبيق GeoGebra مفتوح المصدر لرسم الدوال الرياضية والمنحنيات وحل المعادلات بيانياً بشكل تفاعلي.',
    url: 'https://www.geogebra.org/classic/graphing',
    source: 'GeoGebra'
  }
];

// Bank of all available exercises
const EXERCISES_BANK = [
  {
    id: 1,
    subject: 'الرياضيات',
    keywords: ['نظمات', 'مجهولين', 'système', 'équation'],
    question: 'إذا كان x + y = 5 و x - y = 1، فما هي قيمة كل من x و y؟ \n Si x + y = 5 et x - y = 1, quelles sont les valeurs de x et y ?',
    options: ['x=2, y=3', 'x=3, y=2', 'x=4, y=1', 'x=1, y=4'],
    correctIndex: 1,
    explanation: 'بجمع المعادلتين نحصل على 2x = 6، إذن x = 3. وبتعويض x نجد y = 2. \n En additionnant les deux équations, on obtient 2x=6, donc x=3. En remplaçant x, on trouve y=2.'
  },
  {
    id: 2,
    subject: 'اللغة الفرنسية',
    keywords: ['conditionnel', 'conjugaison'],
    question: "Complétez : Si j'avais de l'argent, j'_____ une nouvelle voiture.",
    options: ['achetais', 'achèterai', 'achèterais', 'acheterait'],
    correctIndex: 2,
    explanation: "Après 'Si + Imparfait', on utilise le Conditionnel Présent (achèterais)."
  },
  {
    id: 3,
    subject: 'الرياضيات',
    keywords: ['جمع', 'طرح', 'حساب', 'équation', 'calcul'],
    question: 'في معادلة من الدرجة الأولى: 2x - 4 = 0، ما هي قيمة x؟ \n Dans l\'équation du 1er degré : 2x - 4 = 0, quelle est la valeur de x ?',
    options: ['1', '2', '4', '-2'],
    correctIndex: 1,
    explanation: '2x = 4 إذن x = 4/2 أي x = 2. \n 2x = 4 donc x = 4/2, soit x = 2.'
  },
  {
    id: 4,
    subject: 'اللغة العربية',
    keywords: ['إعراب', 'فاعل', 'مفعول'],
    question: 'في جملة "أكل الولد التفاحة"، ما هو إعراب كلمة "الولد"؟',
    options: ['مبتدأ', 'فاعل', 'مفعول به', 'خبر'],
    correctIndex: 1,
    explanation: '"الولد" هو الفاعل المرفوع بالضمة الظاهرة على آخره.'
  }
];

const InteractiveResources = () => {
  const { difficulties } = useApp();
  const [activeTab, setActiveTab] = useState<'resources' | 'exercises'>('resources');
  const [subjectFilter, setSubjectFilter] = useState<string>('الكل');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeGame, setActiveGame] = useState<number | null>(null);

  // Exercises State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Filter resources and exercises based on learner's difficulties
  const { filteredResources, filteredExercises, activeSubjects } = useMemo(() => {
    // If no difficulties are recorded, return all items
    if (!difficulties || difficulties.length === 0) {
      return { 
        filteredResources: RESOURCES_BANK, 
        filteredExercises: EXERCISES_BANK,
        activeSubjects: [] 
      };
    }

    // Filter difficulties to only active or processing ones
    const activeDifficulties = difficulties.filter(d => d.status === 'active' || d.status === 'processing');
    const difficultiesToUse = activeDifficulties.length > 0 ? activeDifficulties : difficulties;

    const difficultySubjects = Array.from(new Set(difficultiesToUse.map(d => d.subject)));
    const difficultyTopics = difficultiesToUse.map(d => d.topic.toLowerCase());

    const isMatch = (item: { subject: string, keywords: string[] }) => {
      if (difficultySubjects.includes(item.subject)) return true;
      for (const topic of difficultyTopics) {
        if (item.keywords.some(kw => topic.includes(kw.toLowerCase()))) return true;
      }
      return false;
    };

    const res = RESOURCES_BANK.filter(isMatch);
    const ex = EXERCISES_BANK.filter(isMatch);

    return {
      filteredResources: res.length > 0 ? res : RESOURCES_BANK,
      filteredExercises: ex.length > 0 ? ex : EXERCISES_BANK,
      activeSubjects: difficultySubjects
    };
  }, [difficulties]);

  // Reset exercise state when tab changes or exercises update
  useEffect(() => {
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResults(false);
    setAnsweredCount(0);
    setActiveGame(null);
  }, [activeTab, filteredExercises]);

  // Get unique subjects for filter
  const allSubjects = useMemo(() => {
    const subjects = Array.from(new Set(filteredResources.map(r => r.subject)));
    return ['الكل', ...subjects];
  }, [filteredResources]);

  const displayedResources = subjectFilter === 'الكل'
    ? filteredResources
    : filteredResources.filter(r => r.subject === subjectFilter);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === filteredExercises[currentExerciseIndex].correctIndex;
    setIsCorrect(correct);
    setAnsweredCount(prev => prev + 1);
    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handleNextExercise = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResults(false);
    setAnsweredCount(0);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  const currentExercise = filteredExercises[currentExerciseIndex];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Lightbulb className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">المصادر والدعم التفاعلي</h2>
                <p className="text-slate-400 mt-1">مصادر تعليمية وتمارين مقترحة خصيصاً لتجاوز صعوباتك</p>
              </div>
            </div>
            
            {activeSubjects.length > 0 && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <Target size={16} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-300">
                  تم التخصيص بناءً على: {activeSubjects.join('، ')}
                </span>
              </div>
            )}
          </div>

          <div className="flex bg-slate-800/50 p-1 rounded-xl w-fit mt-8 border border-slate-700/50">
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'resources' 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              المصادر التفاعلية
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'exercises' 
                  ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              تمارين مبسطة للتقييم
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'resources' && activeGame === null && (
        <div className="space-y-4">
          {/* Subject Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {allSubjects.map(subject => (
              <button
                key={subject}
                onClick={() => setSubjectFilter(subject)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  subjectFilter === subject
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-indigo-500/50 hover:text-indigo-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {displayedResources.map((resource) => {
              const Icon = resource.icon;
              const isExpanded = expandedCard === resource.id;
              return (
                <div
                  key={resource.id}
                  onClick={() => setExpandedCard(isExpanded ? null : resource.id)}
                  className={`glass p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isExpanded ? 'ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${resource.color}`} />
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-800/80 text-slate-300">
                          {resource.subject}
                        </span>
                        <span className="text-xs text-indigo-400 font-medium">
                          {resource.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                      <p className={`text-sm text-slate-400 leading-relaxed transition-all duration-300 ${
                        isExpanded ? '' : 'line-clamp-2'
                      }`}>{resource.description}</p>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Puzzle size={14} /> تفاعلي
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-500">مجاني</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGame(resource.id);
                        }}
                        className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r ${resource.color} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                        <span>عرض المحتوى</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'resources' && activeGame !== null && (
        <div className="glass p-6 md:p-8 animate-in fade-in zoom-in duration-500">
          {(() => {
            const resource = RESOURCES_BANK.find(r => r.id === activeGame);
            if (!resource) return null;
            const Icon = resource.icon;
            
            return (
              <div className="flex flex-col h-[700px]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-6 border-b border-slate-700/50 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center shadow-lg shrink-0`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-slate-400">{resource.subject}</span>
                        <span className="text-slate-600 hidden md:inline">•</span>
                        <span className="text-sm font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{resource.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-sm font-medium"
                    >
                      <ArrowRight size={16} className="-rotate-45" />
                      <span>فتح في نافذة جديدة</span>
                    </a>
                    <button 
                      onClick={() => setActiveGame(null)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      title="إغلاق"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-700/50 relative overflow-hidden group shadow-2xl">
                  {/* Iframe for the actual resource */}
                  <iframe 
                    src={resource.url}
                    className="absolute inset-0 w-full h-full border-0 bg-white"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={resource.title}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'exercises' && !showResults && currentExercise && (
        <div className="glass p-6 md:p-8 relative overflow-hidden">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-5%`,
                    backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5],
                    animation: `fall ${1 + Math.random()}s ease-in forwards`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Header with Score & Progress */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-fuchsia-400" />
              تحدي المعرفة - {currentExercise.subject}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">{score}/{filteredExercises.length}</span>
              </div>
              <div className="text-sm font-medium text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full">
                {currentExerciseIndex + 1} / {filteredExercises.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800/50 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentExerciseIndex + 1) / filteredExercises.length) * 100}%` }}
            />
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-6">
              <h4 className="text-xl md:text-2xl font-medium text-white leading-relaxed text-center mb-8 whitespace-pre-line" dir="auto">
                {currentExercise.question}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentExercise.options.map((option, index) => {
                  let btnClass = "bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-slate-200 hover:scale-[1.02]";
                  let icon = null;
                  let labelClass = "bg-slate-600/50 text-slate-300";

                  if (selectedAnswer !== null) {
                    if (index === currentExercise.correctIndex) {
                      btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.02]";
                      icon = <CheckCircle2 size={20} className="text-emerald-400" />;
                      labelClass = "bg-emerald-500/30 text-emerald-300";
                    } else if (selectedAnswer === index) {
                      btnClass = "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                      icon = <XCircle size={20} className="text-red-400" />;
                      labelClass = "bg-red-500/30 text-red-300";
                    } else {
                      btnClass = "bg-slate-800/30 border-slate-700/30 text-slate-500 opacity-50";
                      labelClass = "bg-slate-700/30 text-slate-600";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      dir="auto"
                      className={`relative w-full p-4 rounded-xl border-2 transition-all duration-300 font-bold text-lg flex items-center gap-3 ${btnClass}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 ${labelClass}`}>
                        {optionLabels[index]}
                      </span>
                      <span className="flex-1 text-right">{option}</span>
                      {icon && <span className="shrink-0">{icon}</span>}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className={`mt-8 p-4 rounded-xl border ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                } animate-in fade-in slide-in-from-bottom-2`}>
                  <p className="font-medium flex items-center gap-2">
                    {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {isCorrect ? '🎉 إجابة صحيحة! أحسنت' : '❌ إجابة خاطئة'}
                  </p>
                  <p className="mt-2 text-sm opacity-90 whitespace-pre-line" dir="auto">{currentExercise.explanation}</p>
                </div>
              )}
            </div>

            {selectedAnswer !== null && (
              <div className="flex justify-center animate-in fade-in zoom-in duration-300">
                <button
                  onClick={handleNextExercise}
                  className="px-8 py-3 bg-fuchsia-500 hover:bg-fuchsia-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-fuchsia-500/25 flex items-center gap-2 hover:scale-105"
                >
                  {currentExerciseIndex < filteredExercises.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Screen */}
      {activeTab === 'exercises' && showResults && (
        <div className="glass p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-2xl shadow-fuchsia-500/30">
            <Award className="text-white" size={48} />
          </div>
          <h3 className="text-3xl font-black text-white mb-2">تم إنهاء التحدي! 🎉</h3>
          <p className="text-slate-400 mb-8">لقد أجبت على جميع الأسئلة</p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400">{score}</div>
              <div className="text-sm text-slate-400 mt-1">إجابات صحيحة</div>
            </div>
            <div className="w-px h-16 bg-slate-700" />
            <div className="text-center">
              <div className="text-4xl font-black text-slate-300">{filteredExercises.length}</div>
              <div className="text-sm text-slate-400 mt-1">إجمالي الأسئلة</div>
            </div>
            <div className="w-px h-16 bg-slate-700" />
            <div className="text-center">
              <div className={`text-4xl font-black ${score / filteredExercises.length >= 0.7 ? 'text-emerald-400' : score / filteredExercises.length >= 0.4 ? 'text-amber-400' : 'text-red-400'}`}>
                {Math.round((score / filteredExercises.length) * 100)}%
              </div>
              <div className="text-sm text-slate-400 mt-1">النسبة</div>
            </div>
          </div>

          <p className={`text-lg font-bold mb-8 ${score / filteredExercises.length >= 0.7 ? 'text-emerald-400' : score / filteredExercises.length >= 0.4 ? 'text-amber-400' : 'text-red-400'}`}>
            {score / filteredExercises.length >= 0.7 ? '🌟 ممتاز! أداء رائع' : score / filteredExercises.length >= 0.4 ? '💪 جيد، واصل التحسن' : '📚 تحتاج مراجعة إضافية'}
          </p>

          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <span>إعادة المحاولة</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveResources;
