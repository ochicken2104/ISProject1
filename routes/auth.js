const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// ---------- Register ----------
router.get('/register', (req, res) => res.render('register', { title: 'Create account' }));

router.post('/register',
  body('username').trim().matches(/^[A-Za-z0-9_]{3,20}$/).withMessage('Username must be 3-20 letters, numbers or _'),
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters'),
  (req, res) => {
    const v = validationResult(req);
    if (!v.isEmpty()) {
      return res.status(400).render('register', { title: 'Create account', errors: v.array().map(e => e.msg) });
    }
    const { username, email, password } = req.body;
    try {
      const hash = bcrypt.hashSync(password, 12); // secure hashing
      db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run(username, email, hash);
      res.redirect('/login');
    } catch {
      res.status(400).render('register', { title: 'Create account', errors: ['Username or email is already taken'] });
    }
  });

// ---------- Login ----------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).render('login', { title: 'Log in', errors: ['Too many attempts. Try again in 15 minutes.'] })
});

router.get('/login', (req, res) => res.render('login', { title: 'Log in' }));

router.post('/login', loginLimiter,
  body('username').trim().notEmpty(),
  body('password').notEmpty(),
  (req, res) => {
    const u = db.prepare('SELECT * FROM users WHERE username = ?').get(req.body.username || '');
    if (!u || !bcrypt.compareSync(req.body.password || '', u.password_hash)) {
      return res.status(401).render('login', { title: 'Log in', errors: ['Invalid username or password'] });
    }
    req.session.regenerate(() => {
      req.session.userId = u.id;
      req.session.username = u.username;
      res.redirect('/dashboard');
    });
  });

router.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));

module.exports = router;
