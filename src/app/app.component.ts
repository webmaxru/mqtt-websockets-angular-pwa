import { Component } from '@angular/core';
import { MessageService }       from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})


export class AppComponent {

  messages = [];
  connection;
  messageContent = {
    topic: '/device01/temperature',
    message: '20C'
  };

  constructor(private messageService: MessageService) { }

  sendMessage() {
    this.messageService.sendMessage(this.messageContent);
    this.messageContent = {
      topic: '/device01/temperature',
      message: ''
    };
  }

  ngOnInit() {
    this.connection = this.messageService.getMessages().subscribe(messageContent => {
      this.messages.push(messageContent);
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
