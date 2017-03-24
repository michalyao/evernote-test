const Evernote = require('evernote');
const MAX_NOTE_COUNTS = 20;

class EvernoteClient {
    constructor(token) {
        if (!token) {
            throw new Error('missing develop token.');
        }
        const options = {
            consumerKey: 'yaoyao',
            consumerSecret: '479d155f6454e58b',
            sandbox: true,
            china: false,
            token
        };
        const client = new Evernote.Client(options);
        this.noteStore = client.getNoteStore('https://sandbox.evernote.com/shard/s1/notestore');
    }
    listNotebooks() {
        return this.noteStore.listNotebooks();
    }

    listAllNoteMetadatas(notebookGuid) {
        return this.noteStore.findNotesMetadata(
            {notebookGuid}, 0, MAX_NOTE_COUNTS, {includeTitle: true}
        )
    }

    getNoteContent(noteGuid) {
        return this.noteStore.getNoteContent(noteGuid);
    }

    updateNoteContentByTitle(noteGuid, title, content) {
        return this.noteStore.updateNote({guid, title, content});
    }

    createNotebook(title) {
        return this.noteStore.createNotebook({name: title});
    }

    createNote(title, notebookGuid) {
        return this.noteStore.createNote({title, notebookGuid});
    }
}
module.exports = EvernoteClient