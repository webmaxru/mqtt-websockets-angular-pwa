import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class MessageService {
  private url = 'ws://localhost:3001';
  private socket;

  sendMessage(message){
    this.socket.emit('deviceMessage', message);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('deviceMessage', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
