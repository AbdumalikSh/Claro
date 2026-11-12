const users = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', password: 'demo123', role: 'client', country: 'Canada', visa: 'Skilled Worker Visa' },
  { id: 'c1', name: 'Sofia Bennett', email: 'sofia@claro.com', password: 'demo123', role: 'consultant' }
];

export function findUser(id) {
  return users.find((user) => user.id === String(id));
}

export function findByCredentials(email, password) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase() && user.password === password);
}

export function addUser({ name, email, password, role = 'client' }) {
  if (users.some((user) => user.email.toLowerCase() === String(email).toLowerCase())) return null;
  const user = { id: `u${Date.now()}`, name, email, password, role: role === 'consultant' ? 'consultant' : 'client' };
  users.push(user);
  return user;
}

export function publicUser({ password, ...user }) {
  return user;
}
