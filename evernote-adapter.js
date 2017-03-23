const Evernote = require('evernote');
export default class EvernoteClient {
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
}
