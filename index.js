import EvernoteClient from './evernote-adapter'

const client = new EvernoteClient('S=s1:U=937a9:E=16252cc3284:C=15afb1b0380:P=1cd:A=en-devtoken:V=2:H=7110d1259eee40fdb73e702928dceb88');

client.listNotebooks().then(notebooks => console.log(notebooks))