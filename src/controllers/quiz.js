import { saveQuizResult } from "../services/quiz.js";

export const submitQuizResultController = async (req, res) => {
  const { score, total, timeSpent, answers } = req.body;

  const result = await saveQuizResult({
    score,
    total,
    timeSpent,
    answers,
  });

  res.status(201).json({
    status: 201,
    message: "Quiz result saved successfully!",
    data: result,
  });
};
