class Note {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.timestamp = new Date().getTime();
  }

  updateContent(newContent) {
    this.content = newContent;
    this.updateTimestamp();
  }

  updateTitle(newTitle) {
    this.title = newTitle;
    this.updateTimestamp();
  }

  updateTimestamp() {
    this.timestamp = new Date().getTime();
  }
}

class NotesManager {
  constructor() {
    this.notes = [];
    this.loadFromLocalStorage();
  }

  addNote(note) {
    this.notes.push(note);
    this.saveToLocalStorage();
  }

  deleteNote(id) {
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveToLocalStorage();
  }

  updateNote(id, newTitle, newContent) {
    const note = this.notes.find(note => note.id === id);
    if (note) {
      note.updateTitle(newTitle);
      note.updateContent(newContent);
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  loadFromLocalStorage() {
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
      this.notes = storedNotes.map(note => new Note(note.id, note.title, note.content));
    }
  }
}

class UI {
  static displayNotes(notes) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    notes.forEach(note => {
      UI.addNoteToUI(note);
    });
  }

  static addNoteToUI(note) {
    const notesList = document.getElementById('notes-list');
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.setAttribute('data-id', note.id);

    noteElement.innerHTML = `
      <div>
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
      </div>
      <button class="delete-btn">Delete</button>
    `;

    notesList.appendChild(noteElement);
  }

  static updateNoteInUI(id, newTitle, newContent) {
    const noteElement = document.querySelector(`.note[data-id="${id}"]`);
    if (noteElement) {
      noteElement.querySelector('.note-title').textContent = newTitle;
      noteElement.querySelector('.note-content').textContent = newContent;
    }
  }

  static deleteNoteFromUI(id) {
    const noteElement = document.querySelector(`.note[data-id="${id}"]`);
    if (noteElement) {
      noteElement.remove();
    }
  }

  static clearInputFields() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const notesManager = new NotesManager();
  UI.displayNotes(notesManager.notes);

  document.getElementById('note-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title && content) {
      const note = new Note(Date.now().toString(), title, content);
      notesManager.addNote(note);
      UI.addNoteToUI(note);
      UI.clearInputFields();
    }
  });

  document.getElementById('notes-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const noteElement = e.target.closest('.note');
      const id = noteElement.getAttribute('data-id');
      notesManager.deleteNote(id);
      UI.deleteNoteFromUI(id);
    }
  });
});
