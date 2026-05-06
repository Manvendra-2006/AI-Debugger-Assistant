import invokeGrokII from "../services/ai.service.js";
import debugData from "../models/Debug.js";

export default async function debugController(req, resp) {
  try {
    const { code } = req.body;

    if (!code) {
      return resp.status(400).json({ message: "Code not given" });
    }

    const debugCodeByAi = await invokeGrokII(code);

    if (!debugCodeByAi) {
      return resp.status(400).json({ message: "Code is not debugged by AI" });
    }

    const debugDataReport = await debugData.create({
      userId: req.user?.id,
      IncorrectCode: code,
      code: debugCodeByAi.correctedCode,
      issues: Array.isArray(debugCodeByAi.issues) ? debugCodeByAi.issues : [],
      fixes: Array.isArray(debugCodeByAi.fixes) ? debugCodeByAi.fixes : [],
      explanation: debugCodeByAi.explanation || '',
    });

    return resp.status(201).json({
      message: "Code debug successfully",
      issues: debugCodeByAi.issues,
      fixes: debugCodeByAi.fixes,
      correctedCode: debugCodeByAi.correctedCode,
      explanation: debugCodeByAi.explanation,
      data: debugDataReport,
    });
  } catch (error) {
    return resp.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export async function getUserDebugHistory(req, resp) {
  try {
    const history = await debugData
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return resp.status(200).json({
      message: "User debug history fetched successfully",
      history,
    });
  } catch (error) {
    return resp.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}


