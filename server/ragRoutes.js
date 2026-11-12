import express from "express";
import { answerFromVisaGuide, getVisaGuideStatus } from "./rag.js";
import { findUser } from "./authStore.js";

const router = express.Router();

function clientId(req) {
  const id = req.get("x-claro-user") || req.query.userId || req.body?.userId;
  const account = findUser(id);
  if (!account || account.role !== "client") throw new Error("The visa assistant is available to client accounts only. Please sign in again.");
  return account.id;
}

router.use((req, res, next) => {
  try {
    req.clientId = clientId(req);
    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

router.get("/status", async (_req, res) => {
  res.json(await getVisaGuideStatus());
});

router.post("/ask", async (req, res) => {
  try {
    res.json(await answerFromVisaGuide(req.body || {}));
  } catch (error) {
    const unavailable = /not been added|Ollama|local chat model|embedding/i.test(error.message || "");
    res.status(unavailable ? 503 : 400).json({ error: error.message || "Could not answer from the visa guide." });
  }
});

export default router;
