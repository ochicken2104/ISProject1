const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();
const guard = (req, res, next) => (req.session.userId ? next() : res.redirect('/login'));

router.get('/dashboard', guard, (req, res) => {
  const notes = db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY id DESC').all(req.session.userId);
  const me = db.prepare('SELECT created_at FROM users WHERE id = ?').get(req.session.userId);
  res.render('dashboard', {
    title: 'Dashboard',
    notes,
    memberSince: (me.created_at || '').slice(0, 10),
    noteError: Boolean(req.query.e)
  });
});

router.post('/notes', guard, body('content').trim().isLength({ min: 1, max: 280 }), (req, res) => {
  if (!validationResult(req).isEmpty()) return res.redirect('/dashboard?e=1');
  db.prepare('INSERT INTO notes (user_id, content) VALUES (?, ?)').run(req.session.userId, req.body.content);
  res.redirect('/dashboard');
});

router.post('/notes/:id/delete', guard, (req, res) => {
  db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?').run(Number(req.params.id), req.session.userId);
  res.redirect('/dashboard');
});

module.exports = router;
