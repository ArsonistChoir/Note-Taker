const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = generateUniqueId();
  const notes = getNotes();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

function getNotes() {
  const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
  return JSON.parse(data) || [];
}

function saveNotes(notes) {
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
}

function generateUniqueId() {
  return Date.now().toString();
}

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);