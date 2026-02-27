import { useState, useEffect, useCallback } from "react";

// ─── Raw Directus types ───────────────────────────────────────────────────────

type RawAnswer = {
  id: number;
  answer_title: string;
};

type RawQuizQuestionAnswer = {
  id: number; // junction id
  quiz_question_answer_id: RawAnswer;
};

type RawQuestion = {
  id: number;
  question_title: string;
  answers: RawQuizQuestionAnswer[];
};

type RawQuizQuestion = {
  id: number; // junction id
  quiz_question_id: RawQuestion;
};

type RawQuiz = {
  id: number;
  type: "morning" | "noon" | "evening" | "night" | null;
  difficulty: "easy" | "medium" | "hard" | null;
  title: string | null;
  description: string | null;
  is_active: boolean | null;
  quiz_questions: RawQuizQuestion[];
};

// ─── App types ────────────────────────────────────────────────────────────────

export type QuizAnswer = {
  id: number; // quiz_question_answer.id
  text: string; // answer_title
};

export type QuizQuestion = {
  id: number; // quiz_question.id
  text: string; // question_title
  answers: QuizAnswer[];
};

export type Quiz = {
  id: number;
  type: "morning" | "noon" | "evening" | "night" | null;
  typeLabel: string;
  difficulty: "easy" | "medium" | "hard" | null;
  difficultyLabel: string;
  title: string;
  description: string;
  isActive: boolean;
  questions: QuizQuestion[];
};

// ─── Label maps ───────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  morning: "बिहानको क्विज",
  noon: "दिउँसोको क्विज",
  evening: "साँझको क्विज",
  night: "बेलुकाको क्विज",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "सजिलो",
  medium: "मध्यम",
  hard: "कठिन",
};

// ─── Transform ────────────────────────────────────────────────────────────────

function transformQuiz(raw: RawQuiz): Quiz {
  return {
    id: raw.id,
    type: raw.type,
    typeLabel: raw.type ? (TYPE_LABELS[raw.type] ?? raw.type) : "क्विज",
    difficulty: raw.difficulty,
    difficultyLabel: raw.difficulty
      ? (DIFFICULTY_LABELS[raw.difficulty] ?? raw.difficulty)
      : "मध्यम",
    title: raw.title ?? "क्विज",
    description: raw.description ?? "",
    isActive: raw.is_active ?? false,
    questions: (raw.quiz_questions ?? [])
      .filter((jq) => jq.quiz_question_id)
      .map((jq) => ({
        id: jq.quiz_question_id.id,
        text: jq.quiz_question_id.question_title,
        answers: (jq.quiz_question_id.answers ?? [])
          .filter((ja) => ja.quiz_question_answer_id)
          .map((ja) => ({
            id: ja.quiz_question_answer_id.id,
            text: ja.quiz_question_answer_id.answer_title,
          })),
      })),
  };
}

// ─── useQuizList — fetch all active quizzes for the landing page ──────────────

export function useQuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("/api/proxy/quizes", window.location.origin);
    url.searchParams.set(
      "fields",
      [
        "id",
        "type",
        "difficulty",
        "title",
        "description",
        "is_active",
        // M2M: quizes → junction → quiz_question
        "quiz_questions.id",
        "quiz_questions.quiz_question_id.id",
        "quiz_questions.quiz_question_id.question_title",
        // M2M: quiz_question → junction → quiz_question_answer
        "quiz_questions.quiz_question_id.answers.id",
        "quiz_questions.quiz_question_id.answers.quiz_question_answer_id.id",
        "quiz_questions.quiz_question_id.answers.quiz_question_answer_id.answer_title",
      ].join(","),
    );
    url.searchParams.set(
      "filter",
      JSON.stringify({ is_active: { _eq: true } }),
    );
    url.searchParams.set("sort", "id");

    fetch(url.toString())
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setQuizzes((json.data as RawQuiz[]).map(transformQuiz)))
      .catch((err) => {
        console.error("[useQuizList]", err);
        setError("क्विज लोड गर्न सकिएन।");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { quizzes, isLoading, error };
}

// ─── useQuizSubmission — POST answers + fetch leaderboard counts ──────────────

type AnswerPayload = {
  question: number; // quiz_question.id
  selected_answer: number; // quiz_question_answer.id
};

type LeaderboardEntry = {
  questionId: number;
  questionText: string;
  answers: {
    id: number;
    text: string;
    count: number;
    percentage: number;
  }[];
  topAnswerId: number;
  topAnswerText: string;
  topCount: number;
  topPercentage: number;
};

export function useQuizSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // POST to quiz_submission
  const submitAnswers = useCallback(
    async (quizId: number, answers: AnswerPayload[]) => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/proxy/quiz_submission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: quizId,
            answers: answers,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
      } catch (err) {
        console.error("[submitAnswers]", err);
        setSubmitError("जवाफ पेश गर्न सकिएन।");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  /**
   * Build leaderboard by fetching all submissions for a quiz,
   * then tallying answer counts per question in-memory.
   * (Directus has no aggregate on JSON fields, so we tally client-side)
   */
  const fetchLeaderboard = useCallback(async (quiz: Quiz) => {
    setIsLoadingLeaderboard(true);
    try {
      const url = new URL("/api/proxy/quiz_submission", window.location.origin);
      url.searchParams.set("fields", "answers");
      url.searchParams.set(
        "filter",
        JSON.stringify({ quiz: { _eq: quiz.id } }),
      );
      url.searchParams.set("limit", "-1");

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // json.data = [{ answers: [{question, selected_answer}, ...] }, ...]
      const submissions: { answers: AnswerPayload[] }[] = json.data;

      // Tally per question → per answer
      // Structure: Map<questionId, Map<answerId, count>>
      const tally = new Map<number, Map<number, number>>();
      for (const sub of submissions) {
        if (!Array.isArray(sub.answers)) continue;
        for (const a of sub.answers) {
          if (!tally.has(a.question)) tally.set(a.question, new Map());
          const qMap = tally.get(a.question)!;
          qMap.set(a.selected_answer, (qMap.get(a.selected_answer) ?? 0) + 1);
        }
      }

      const totalSubmissions = submissions.length || 1;

      // Build leaderboard entries in question order
      const entries: LeaderboardEntry[] = quiz.questions.map((q) => {
        const qTally = tally.get(q.id) ?? new Map();
        const answersWithCounts = q.answers.map((a) => {
          const count = qTally.get(a.id) ?? 0;
          return {
            id: a.id,
            text: a.text,
            count,
            percentage: Math.round((count / totalSubmissions) * 100),
          };
        });
        // Sort descending by count
        answersWithCounts.sort((a, b) => b.count - a.count);
        const top = answersWithCounts[0] ?? {
          id: 0,
          text: "—",
          count: 0,
          percentage: 0,
        };
        return {
          questionId: q.id,
          questionText: q.text,
          answers: answersWithCounts,
          topAnswerId: top.id,
          topAnswerText: top.text,
          topCount: top.count,
          topPercentage: top.percentage,
        };
      });

      setLeaderboard(entries);
    } catch (err) {
      console.error("[fetchLeaderboard]", err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  return {
    submitAnswers,
    isSubmitting,
    submitError,
    fetchLeaderboard,
    isLoadingLeaderboard,
    leaderboard,
  };
}
