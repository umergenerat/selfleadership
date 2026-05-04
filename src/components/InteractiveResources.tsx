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
    title: 'لعبة النظمات التفاعلية',
    type: 'لعبة تفاعلية',
    subject: 'الرياضيات',
    keywords: ['نظمات', 'معادلات', 'مجهولين'],
    icon: Gamepad2,
    color: 'from-blue-500 to-cyan-500',
    description: 'تطبيق تفاعلي يتيح لك حل النظمات ذات مجهولين باستخدام الرسم المبياني والتعويض لتبسيط المفهوم.'
  },
  {
    id: 2,
    title: 'Le Conditionnel Présent : Jeu Interactif',
    type: 'لعبة تعليمية',
    subject: 'اللغة الفرنسية',
    keywords: ['conditionnel', 'conjugaison', 'présent'],
    icon: PlayCircle,
    color: 'from-purple-500 to-indigo-500',
    description: 'تمارين تفاعلية لتعلم وتصريف الأفعال في الشرط الحاضر (Conditionnel Présent) بسهولة ومتعة.'
  },
  {
    id: 3,
    title: 'رحلة الأرقام الممتعة',
    type: 'لعبة تفاعلية',
    subject: 'الرياضيات',
    keywords: ['جمع', 'طرح', 'حساب', 'أرقام'],
    icon: Gamepad2,
    color: 'from-emerald-500 to-teal-500',
    description: 'لعبة تفاعلية لتعلم العمليات الحسابية الأساسية بطريقة ممتعة.'
  },
  {
    id: 4,
    title: 'استكشاف الفضاء والجاذبية',
    type: 'محاكاة',
    subject: 'الفيزياء',
    keywords: ['فضاء', 'كواكب', 'شمس', 'جاذبية', 'فيزياء'],
    icon: PlayCircle,
    color: 'from-orange-500 to-rose-500',
    description: 'محاكاة افتراضية لاستكشاف الكواكب والمجموعة الشمسية لتبسيط المفاهيم الفيزيائية.'
  },
  {
    id: 5,
    title: 'قصص الحروف والكلمات',
    type: 'قصة تفاعلية',
    subject: 'اللغة العربية',
    keywords: ['حروف', 'كلمات', 'إملاء', 'قراءة', 'تعبير'],
    icon: BookOpen,
    color: 'from-pink-500 to-rose-400',
    description: 'تعلم قراءة وتشكيل الكلمات وتحسين التعبير من خلال قصص مشوقة ومبسطة.'
  }
];

// Bank of all available exercises
const EXERCISES_BANK = [
  {
    id: 1,
    subject: 'الرياضيات',
    keywords: ['نظمات', 'مجهولين'],
    question: 'إذا كان x + y = 5 و x - y = 1، فما هي قيمة كل من x و y؟',
    options: ['x=2, y=3', 'x=3, y=2', 'x=4, y=1', 'x=1, y=4'],
    correctIndex: 1,
    explanation: 'بجمع المعادلتين نحصل على 2x = 6، إذن x = 3. وبتعويض x نجد y = 2.'
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
    keywords: ['جمع', 'طرح', 'حساب'],
    question: 'في معادلة من الدرجة الأولى: 2x - 4 = 0، ما هي قيمة x؟',
    options: ['1', '2', '4', '-2'],
    correctIndex: 1,
    explanation: '2x = 4 إذن x = 4/2 أي x = 2.'
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

  // Exercises State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
  }, [activeTab, filteredExercises]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setIsCorrect(index === filteredExercises[currentExerciseIndex].correctIndex);
  };

  const handleNextExercise = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setCurrentExerciseIndex(0); // Reset or show completion
    }
  };

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

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <div key={resource.id} className="glass p-6 group hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${resource.color}`} />
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
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
                    <p className="text-sm text-slate-400 leading-relaxed">{resource.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    <span>ابدأ الآن</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'exercises' && currentExercise && (
        <div className="glass p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-fuchsia-400" />
              تحدي المعرفة - {currentExercise.subject}
            </h3>
            <div className="text-sm font-medium text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full">
              السؤال {currentExerciseIndex + 1} من {filteredExercises.length}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-6">
              <h4 className="text-xl md:text-2xl font-medium text-white leading-relaxed text-center mb-8" dir="auto">
                {currentExercise.question}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentExercise.options.map((option, index) => {
                  let buttonStyle = "bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-slate-200";
                  let icon = null;

                  if (selectedAnswer !== null) {
                    if (index === currentExercise.correctIndex) {
                      buttonStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                      icon = <CheckCircle2 size={20} className="text-emerald-400" />;
                    } else if (selectedAnswer === index) {
                      buttonStyle = "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                      icon = <XCircle size={20} className="text-red-400" />;
                    } else {
                      buttonStyle = "bg-slate-800/30 border-slate-700/30 text-slate-500 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      dir="auto"
                      className={`relative w-full p-4 rounded-xl border-2 transition-all duration-300 font-bold text-lg flex items-center justify-between ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {icon && <span>{icon}</span>}
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
                    {isCorrect ? 'إجابة صحيحة!' : 'حاول مرة أخرى!'}
                  </p>
                  <p className="mt-2 text-sm opacity-90" dir="auto">{currentExercise.explanation}</p>
                </div>
              )}
            </div>

            {selectedAnswer !== null && (
              <div className="flex justify-center animate-in fade-in zoom-in duration-300">
                <button
                  onClick={handleNextExercise}
                  className="px-8 py-3 bg-fuchsia-500 hover:bg-fuchsia-400 text-white rounded-xl font-bold transition-colors shadow-lg shadow-fuchsia-500/25 flex items-center gap-2"
                >
                  {currentExerciseIndex < filteredExercises.length - 1 ? 'السؤال التالي' : 'إعادة المحاولة'}
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveResources;
