const EvernoteClient = require('./evernote-adapter');

const MarkdownIt = require('markdown-it');
const _ = require('lodash');
const converter = require('./converter')

const client = new EvernoteClient('S=s1:U=937a9:E=16252cc3284:C=15afb1b0380:P=1cd:A=en-devtoken:V=2:H=7110d1259eee40fdb73e702928dceb88');
const md = new MarkdownIt({
      html: true, // Enable HTML tags in source
      linkify: true, // Autoconvert URL-like text to links

      // Highlighter function. Should return escaped HTML,
      // or '' if the source string is not changed
      highlight(code, lang) {
        if (code.match(/^graph/) || code.match(/^sequenceDiagram/) || code.match(/^gantt/)) {
          return `<div class="mermaid">${code}</div>`
        }

        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(lang, code, true).value}</code></pre>`
          } catch (err) {
            // Ignore error
          }
        }

        return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`
      }
    })

// list all notebooks title
function listAllNotes() {
    let notebooks, noteMetas, notebookNames, promises = [];

    client.listNotebooks().then(allNotebooks => {
        notebooks = allNotebooks;
        notebookNames = allNotebooks.map(notebook => notebook.name);
        notebooks.forEach(notebook => promises.push(client.listAllNoteMetadatas(notebook.guid)))
        return Promise.all(promises);
    }).then(noteMetadatas => {
        noteMetadatas.forEach(noteMetadata => {
            noteMetadata.notes.forEach(note => console.log(note.title));
        })
    }
        ).catch(e => console.log(e));
}

listAllNotes()

// getOneNoteContent
function getNoteByTitle(title) {
    let notebooks, noteMetas, notebookNames, promises, result;
    return client.listNotebooks().then(allNotebooks => {
        notebooks = allNotebooks;
        notebookNames = allNotebooks.map(notebook => notebook.name);
        promises = notebooks.map(notebook => client.listAllNoteMetadatas(notebook.guid))
        return Promise.all(promises);
    }).then(noteMetadatas => {
        let allNoteMetadatas = noteMetadatas.map(noteMetadata => noteMetadata.notes);
        let allNotes = _.flattenDeep(allNoteMetadatas);
        let findNote = allNotes.find(note => note.title === title);
        return client.getNoteContent(findNote.guid);
    });
}

getNoteByTitle('Hello world!').then(content => console.log(converter.toMd(content)));

console.log(converter.toHtml('# Hello World!'))

// createnote and send note to evernote
