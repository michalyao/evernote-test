// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const converter = require('./converter');
const EvernoteClient = require('./evernote-adapter');
const _ = require('lodash');

const client = new EvernoteClient('S=s1:U=937a9:E=16252cc3284:C=15afb1b0380:P=1cd:A=en-devtoken:V=2:H=7110d1259eee40fdb73e702928dceb88');

// list all notebooks title
function listAllNotes() {
    let notebooks, noteMetas, notebookNames, promises = [];

    client.listNotebooks().then(allNotebooks => {
        notebooks = allNotebooks;
        notebookNames = allNotebooks.map(notebook => notebook.name);
        return vscode.window.showQuickPick(notebookNames);
    }).then(selected => {
        if (!selected) {
            throw "";
        }
        console.log(notebooks);
        let selectedNotebook = notebooks.find(notebook => notebook.name === selected);
        console.log(selectedNotebook);
        return client.listAllNoteMetadatas(selectedNotebook.guid);
    }).then(noteMetadatas => {
        console.log(noteMetadatas);
        noteMetas = noteMetadatas.notes;
        return vscode.window.showQuickPick(noteMetadatas.notes.map(note => note.title));
    }).then(selected => {
        if (!selected) {
            throw "";
        }
        let noteMeta = noteMetas.find(meta => meta.title === selected);
        return client.getNoteContent(noteMeta.guid);
    }).then(content => {
        console.log(content);
        
    }).catch(e => console.log(e));
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "code-extension" is now active!');

    // let updateNoteCmd = vscode.commands.registerCommand('extension.updateNote', updateNote);
    // let openDevPageCmd = vscode.commands.registerCommand('extension.openDevPage', openDevPage);


    // context.subscriptions.push(updateNoteCmd);
    // context.subscriptions.push(openDevPageCmd);

    // vscode.workspace.onWillSaveTextDocument(alertToUpdate);
    vscode.workspace.onDidSaveTextDocument(alertToUpdate);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let listAllNotesCmd = vscode.commands.registerCommand('extension.listAllnotes', listAllNotes);
    var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(listAllNotesCmd);

}
exports.activate = activate;
// getOneNoteContent
function getNoteByTitle(title) {
    let notebooks, noteMetas, notebookNames, promises, result;
    return client.listNotebooks().then(allNotebooks => {
        notebooks = allNotebooks;
        notebookNames = allNotebooks.map(notebook => notebook.name);
        promises = notebooks.map(notebook => client.listAllNoteMetadatas(notebook.guid))
        return Promise.all(promises);
    }).then(noteMetadatas => {
        let allNotes = _.flattenDeepnoteMetadatas.map(noteMetadata => noteMetadata.notes);
        let findNote = allNotes.find(note => note.title === title);
        return client.getNoteContent(findNote.guid);
    });
}
function alertToUpdate() {
    if (!showTips) {
        return;
    }

    let msg = "Saving to local won't sync the remote. Try Evernote: Update Note";
    let option = "Ignore";
    vscode.window.showWarningMessage(msg, option).then(result => {
        if (result === option) {
            showTips = false;
        }
    });
}

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;