import express from "express";
import multer from "multer";
import { answerFromPdfs, ingestPdf, listDocuments } from "./rag.js";
import { findUser } from "./authStore.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")),
});
const parseUploads = (req, res, next) => upload.array("files", 10)(req, res, (error) => {
  if (error) return res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "Each PDF must be 20 MB or smaller." : error.message });
  next();
});

function clientId(req) {
  const id = req.get("x-claro-user") || req.query.userId || req.body?.userId;
  const account = findUser(id);
  if (!account || account.role !== "client") throw new Error("The PDF assistant is available to client accounts only. Please sign in again.");
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

router.get("/documents", async (req, res) => {
  try { res.json({ documents: await listDocuments(req.clientId) }); }
  catch (error) { res.status(400).json({ error: error.message }); }
});

router.post("/upload", parseUploads, async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "Choose one or more PDF files under 20 MB each." });
    const indexed = [];
    for (const file of files) indexed.push(await ingestPdf(req.clientId, file));
    res.status(201).json({ documents: indexed });
  } catch (error) { res.status(400).json({ error: error.message || "Could not index this PDF." }); }
});

router.post("/ask", async (req, res) => {
  try { res.json(await answerFromPdfs({ ...req.body, userId: req.clientId })); }
  catch (error) { res.status(400).json({ error: error.message || "Could not answer from your PDFs." }); }
});

export default router;
