require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');

const app = express();
app.set('trust proxy', 1); // we run behind Nginx
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
  contentSecurityPolicy: { useDefaults: true, directives: { 'upgrade-insecure-requests': null } }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: 'auto', sameSite: 'lax', maxAge: 60 * 60 * 1000 }
}));

// Variables available in every view
app.use((req, res, next) => {
  res.locals.user = req.session.username || null;
  res.locals.errors = [];
  next();
});

app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.use(require('./routes/auth'));
app.use(require('./routes/notes'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use((req, res) => res.status(404).render('404', { title: 'Not found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => console.log(`Running on http://127.0.0.1:${PORT}`));
