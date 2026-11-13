import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { addUser, findByCredentials, publicUser } from './authStore.js';

dotenv.config();
const { default: ragRoutes } = await import('./ragRoutes.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/rag', ragRoutes);

// In-memory demo data. Replace with MongoDB models when persistence is added.
const applications = [
  { id: 'a1', client: 'Alex Morgan', type: 'Skilled Worker Visa', country: 'Canada', status: 'In review', progress: 68, next: 'Proof of funds', due: 'Nov 18, 2026' },
  { id: 'a2', client: 'Priya Shah', type: 'Student Visa', country: 'United Kingdom', status: 'Awaiting documents', progress: 42, next: 'Academic transcript', due: 'Nov 20, 2026' },
  { id: 'a3', client: 'Daniel Kim', type: 'Visitor Visa', country: 'United States', status: 'Ready to submit', progress: 91, next: 'Final review', due: 'Nov 22, 2026' }
];
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role = 'client' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Please complete all fields.' });
  const user = addUser({ name, email, password, role });
  if (!user) return res.status(409).json({ error: 'An account with this email already exists.' });
  res.status(201).json({ user: publicUser(user) });
});
app.post('/api/auth/login', (req, res) => {
  const user = findByCredentials(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json({ user: publicUser(user) });
});
app.get('/api/applications', (req, res) => res.json(applications));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
const port = process.env.PORT || 3001;
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  app.listen(port, () => console.log(`Claro API listening on http://localhost:${port}`));
}

export default app;
