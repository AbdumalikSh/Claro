import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory demo data. Replace with MongoDB models when persistence is added.
const users = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', password: 'demo123', role: 'client', country: 'Canada', visa: 'Skilled Worker Visa' },
  { id: 'c1', name: 'Sofia Bennett', email: 'sofia@claro.com', password: 'demo123', role: 'consultant' }
];
const applications = [
  { id: 'a1', client: 'Alex Morgan', type: 'Skilled Worker Visa', country: 'Canada', status: 'In review', progress: 68, next: 'Proof of funds', due: 'Nov 18, 2026' },
  { id: 'a2', client: 'Priya Shah', type: 'Student Visa', country: 'United Kingdom', status: 'Awaiting documents', progress: 42, next: 'Academic transcript', due: 'Nov 20, 2026' },
  { id: 'a3', client: 'Daniel Kim', type: 'Visitor Visa', country: 'United States', status: 'Ready to submit', progress: 91, next: 'Final review', due: 'Nov 22, 2026' }
];
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role = 'client' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Please complete all fields.' });
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ error: 'An account with this email already exists.' });
  const user = { id: `u${Date.now()}`, name, email, password, role: role === 'consultant' ? 'consultant' : 'client' };
  users.push(user);
  res.status(201).json({ user: publicUser(user) });
});
app.post('/api/auth/login', (req, res) => {
  const user = users.find(u => u.email.toLowerCase() === String(req.body.email).toLowerCase() && u.password === req.body.password);
  if (!user) return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json({ user: publicUser(user) });
});
const publicUser = ({ password, ...user }) => user;
app.get('/api/applications', (req, res) => res.json(applications));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Claro API listening on http://localhost:${port}`));
