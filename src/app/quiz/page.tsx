"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  AlertTriangle,
  Clock,
  ChevronRight,
  X,
  BarChart3,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  useQuizList,
  useQuizSubmission,
  type Quiz,
  type QuizQuestion,
} from "@/core/hooks/quiz/use-quiz";

// ─── Types ────────────────────────────────────────────────────────────────────

// Per-question answer tracking: questionId → selected answerId
type SelectedAnswers = Record<number, number>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuizPage() {
  // ── Data hooks ──
  const { quizzes, isLoading, error } = useQuizList();
  const {
    submitAnswers,
    isSubmitting,
    submitError,
    fetchLeaderboard,
    isLoadingLeaderboard,
    leaderboard,
  } = useQuizSubmission();

  // ── UI state ──
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  // const [showResults, setShowResults] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // ── Handlers ──

  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    // setShowResults(false);
    setShowLeaderboard(false);
  };

  const handleSelectAnswer = async (
    question: QuizQuestion,
    answerId: number,
  ) => {
    if (!selectedQuiz) return;

    const updatedAnswers: SelectedAnswers = {
      ...selectedAnswers,
      [question.id]: answerId,
    };
    setSelectedAnswers(updatedAnswers);

    const isLast = currentQuestion === selectedQuiz.questions.length - 1;

    if (!isLast) {
      setCurrentQuestion((q) => q + 1);
    } else {
      // Build submission payload
      const payload = Object.entries(updatedAnswers).map(([qId, aId]) => ({
        question: Number(qId),
        selected_answer: Number(aId),
      }));

      // Submit and immediately fetch leaderboard in parallel, then go straight to leaderboard
      await submitAnswers(selectedQuiz.id, payload);
      await fetchLeaderboard(selectedQuiz);
      // setShowResults(true);
      setShowLeaderboard(true);
    }
  };

  const handleShowLeaderboard = async () => {
    if (!selectedQuiz) return;
    await fetchLeaderboard(selectedQuiz);
    setShowLeaderboard(true);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    // setShowResults(false);
    setShowLeaderboard(false);
  };

  const progress = selectedQuiz
    ? ((currentQuestion + 1) / selectedQuiz.questions.length) * 100
    : 0;

  // ── Difficulty badge styling ──
  const difficultyClass = (d: string | null) => {
    if (d === "easy") return "bg-green-100 text-green-700";
    if (d === "hard") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: Leaderboard
  // ─────────────────────────────────────────────────────────────────────────────
  if (showLeaderboard && selectedQuiz) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <section className="py-10 flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Trophy size={28} className="text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    उत्तर लिडरबोर्ड
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {selectedQuiz.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <X size={20} className="text-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              प्रत्येक प्रश्नमा सबैभन्दा धेरै रोजिएको उत्तर र तिनको वितरण
            </p>

            {isLoadingLeaderboard ? (
              <div className="flex flex-col gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-5 animate-pulse"
                  >
                    <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="mb-3">
                        <div className="h-3 bg-muted rounded w-full mb-1" />
                        <div className="h-1.5 bg-muted rounded-full w-full" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {leaderboard.map((item, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-foreground">
                        {item.questionText}
                      </p>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {item.topCount.toLocaleString()} उत्तर
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {item.answers.map((ans, j) => (
                        <div key={ans.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-xs ${j === 0 ? "font-bold text-primary" : "text-muted-foreground"}`}
                              >
                                {ans.text}
                              </span>
                              <span
                                className={`text-xs font-bold ${j === 0 ? "text-primary" : "text-muted-foreground"}`}
                              >
                                {ans.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className={`${j === 0 ? "bg-primary" : "bg-muted-foreground/30"} h-1.5 rounded-full transition-all`}
                                style={{ width: `${ans.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 justify-center mt-8">
              {/* <button
                onClick={() => setShowLeaderboard(false)}
                className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                नतिजामा फर्कनुहोस्
              </button> */}
              <button
                onClick={resetQuiz}
                className="bg-muted text-foreground font-bold py-2.5 px-6 rounded-lg hover:bg-muted/80 transition-colors text-sm"
              >
                अर्को क्विज खेल्नुहोस्
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: Results
  // ─────────────────────────────────────────────────────────────────────────────
  // if (showResults && selectedQuiz) {
  //   // Summary: how many correct (answered all questions)
  //   const answeredCount = Object.keys(selectedAnswers).length;
  //   const totalCount = selectedQuiz.questions.length;

  //   return (
  //     <div className="flex flex-col min-h-screen bg-background">
  //       <Header />
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
  //         <button
  //           onClick={resetQuiz}
  //           className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
  //         >
  //           <ArrowLeft size={18} />
  //           सबै क्विजहरू हेर्नुहोस्
  //         </button>
  //       </div>

  //       <section className="py-10 flex-1">
  //         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
  //           <div className="text-center mb-10">
  //             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
  //               <Trophy size={36} className="text-primary" />
  //             </div>
  //             <h1 className="text-3xl font-bold text-foreground mb-2">
  //               क्विज सम्पन्न!
  //             </h1>
  //             <p className="text-muted-foreground">
  //               {selectedQuiz.title} — तपाईंले {answeredCount}/{totalCount}{" "}
  //               प्रश्नको उत्तर दिनुभयो
  //             </p>
  //             {isSubmitting && (
  //               <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-2">
  //                 <Loader2 size={12} className="animate-spin" />
  //                 जवाफ पेश हुँदैछ...
  //               </p>
  //             )}
  //             {submitError && (
  //               <p className="text-xs text-red-500 mt-2">{submitError}</p>
  //             )}
  //           </div>

  //           {/* Disclaimer */}
  //           <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-8 flex items-start gap-3">
  //             <AlertTriangle
  //               size={20}
  //               className="text-destructive flex-shrink-0 mt-0.5"
  //             />
  //             <p className="text-sm text-foreground">
  //               यो क्विजले निर्वाचनमा कुनै प्रभाव पार्दैन। यो केवल शैक्षिक
  //               उद्देश्यको लागि हो। कृपया प्रत्येक दलको पूर्ण घोषणापत्र अध्ययन
  //               गर्नुहोस्।
  //             </p>
  //           </div>

  //           {/* Answer review */}
  //           <div className="flex flex-col gap-4 mb-10">
  //             {selectedQuiz.questions.map((q, i) => {
  //               const chosenId = selectedAnswers[q.id];
  //               const chosenAnswer = q.answers.find((a) => a.id === chosenId);
  //               return (
  //                 <div
  //                   key={q.id}
  //                   className="bg-card rounded-xl p-5 border border-border"
  //                 >
  //                   <p className="text-xs font-semibold text-muted-foreground mb-1">
  //                     प्रश्न {i + 1}
  //                   </p>
  //                   <p className="font-bold text-foreground text-sm mb-3">
  //                     {q.text}
  //                   </p>
  //                   <div className="flex flex-wrap gap-2">
  //                     {q.answers.map((a) => (
  //                       <span
  //                         key={a.id}
  //                         className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
  //                           a.id === chosenId
  //                             ? "bg-primary text-primary-foreground"
  //                             : "bg-muted text-muted-foreground"
  //                         }`}
  //                       >
  //                         {a.text}
  //                       </span>
  //                     ))}
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </div>

  //           <div className="flex flex-wrap gap-4 justify-center">
  //             <button
  //               onClick={handleShowLeaderboard}
  //               disabled={isLoadingLeaderboard}
  //               className="bg-secondary text-secondary-foreground font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-colors text-sm flex items-center gap-2 disabled:opacity-60"
  //             >
  //               {isLoadingLeaderboard ? (
  //                 <Loader2 size={18} className="animate-spin" />
  //               ) : (
  //                 <BarChart3 size={18} />
  //               )}
  //               उत्तर लिडरबोर्ड हेर्नुहोस्
  //             </button>
  //             <button
  //               onClick={() => {
  //                 setCurrentQuestion(0);
  //                 setSelectedAnswers({});
  //                 setShowResults(false);
  //               }}
  //               className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors text-sm"
  //             >
  //               फेरि खेल्नुहोस्
  //             </button>
  //             <button
  //               onClick={resetQuiz}
  //               className="bg-muted text-foreground font-bold py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors text-sm"
  //             >
  //               अर्को क्विज खेल्नुहोस्
  //             </button>
  //           </div>
  //         </div>
  //       </section>
  //       <Footer />
  //     </div>
  //   );
  // }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: Quiz In-Progress
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion];

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            सबै क्विजहरू हेर्नुहोस्
          </button>
        </div>

        <section className="py-10 flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {selectedQuiz.title}
              </h1>
              <p className="text-muted-foreground text-sm mb-5">
                {selectedQuiz.description}
              </p>

              {/* Disclaimer */}
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mb-5 flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="text-destructive flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-foreground">
                  यो क्विजले निर्वाचनमा कुनै प्रभाव पार्दैन। यो केवल शैक्षिक
                  उद्देश्यको लागि हो।
                </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    प्रश्न {currentQuestion + 1} /{" "}
                    {selectedQuiz.questions.length}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question card */}
            {question && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  {question.text}
                </h2>
                <div className="flex flex-col gap-3">
                  {question.answers.map((answer) => (
                    <button
                      key={answer.id}
                      onClick={() => handleSelectAnswer(question, answer.id)}
                      className="w-full p-4 text-left bg-background border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200"
                    >
                      <p className="font-semibold text-foreground text-sm">
                        {answer.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                इमानदारीपूर्वक उत्तर दिनुहोस् - कुनै सही वा गलत उत्तर छैन।
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: Quiz Selection (Landing)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>

      <section className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              आजका क्विजहरू
            </h1>
          </div>
          <p className="text-muted-foreground">
            हरेक दिन ३-५ वटा नयाँ क्विजहरू - खेल्नुहोस् र आफ्नो ज्ञान परीक्षण
            गर्नुहोस्
          </p>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 mt-4 flex items-start gap-2">
            <AlertTriangle
              size={16}
              className="text-destructive flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-foreground">
              यी क्विजहरूले निर्वाचनमा कुनै प्रभाव पार्दैनन्। यो केवल शैक्षिक र
              मनोरञ्जनात्मक उद्देश्यको लागि हो।
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-28 bg-muted rounded-full" />
                    <div className="h-5 w-16 bg-muted rounded-full" />
                  </div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-1" />
                  <div className="h-4 bg-muted rounded w-4/5 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-muted rounded" />
                    <div className="h-5 w-5 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16 text-muted-foreground">
              <Trophy size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && quizzes.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Trophy size={48} className="mx-auto mb-3 opacity-30" />
              <p>आज कुनै क्विज उपलब्ध छैन। पछि फेरि आउनुहोस्।</p>
            </div>
          )}

          {/* Quiz cards */}
          {!isLoading && !error && quizzes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => handleSelectQuiz(quiz)}
                  className="bg-card border border-border rounded-xl p-6 text-left hover:border-primary hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Clock size={12} />
                      {quiz.typeLabel}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyClass(quiz.difficulty)}`}
                    >
                      {quiz.difficultyLabel}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {quiz.questions.length} प्रश्न
                    </span>
                    <ChevronRight
                      size={20}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
