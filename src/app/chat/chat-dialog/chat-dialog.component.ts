import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../chat.service';
import {Message} from '../message';
import {Origin} from '../origin';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit, AfterViewChecked {

  constructor(private chatService: ChatService) {
  }

  userInput: string;
  messages: Message[] = [];
  chipMessages: string[] = [];
  messageLoading = false;
  lastMessagesCount = 0;
  hide = false;

  @ViewChild('messagesContent', {read: ElementRef, static: false}) public messagesContent: ElementRef<any>;

  ngOnInit(): void {
    this.messages.push(new Message('¡Hola! Soy Max, el asistente virtual de REDYTEL.', Origin.SENT, false));
    this.messages.push(new Message('Por cuestiones de estadística, ¿es usted cliente nuestro?', Origin.SENT, false));
    this.chipMessages = ['Sí', 'No'];
  }

  sendUserInput() {
    if (this.userInput) {
      this.messages.push(new Message(this.userInput, Origin.REPLIES, false));
      this.messageLoading = true;
      this.chatService.callChatbotWithUserInput(this.userInput)
        .then(chatResponse => {
          console.log('¡Max ha respondido!');
          this.messageLoading = false;
          chatResponse.responses.forEach(response => {
            if (response) {
              if (response !== 'link') {
                this.messages.push(new Message(response, Origin.SENT, false));
              } else if (response === 'link') {
                this.messages.push(new Message(response, Origin.SENT, true, chatResponse.linkTitle, chatResponse.linkUrl));
              }
            } else {
              this.messages.push(new Message('En estos momentos no puedo atenderle.', Origin.SENT, false));
              this.messages.push(new Message('No dude en contactar con mis compañeros llamando al 987 414 444.', Origin.SENT, false));
            }
          });
          this.chipMessages = chatResponse.quickReplies;
        })
        .catch(error => {
          console.log('Error a la hora de recuperar la respuesta de Max:');
          console.log(error);
          this.messageLoading = false;
          this.messages.push(new Message('En estos momentos no puedo atenderle.', Origin.SENT, false));
          this.messages.push(new Message('No dude en contactar con mis compañeros llamando al 987 414 444.', Origin.SENT, false));
        });
      this.userInput = '';
      this.chipMessages = [];
    }
  }

  sendChipMsg(chip: string) {
    this.userInput = chip;
    this.chipMessages = [];
    this.sendUserInput();
  }

  public scrollBottom(): void {
    if (this.messagesContent.nativeElement.scrollHeight - this.messagesContent.nativeElement.scrollTop < window.innerHeight - 110) {
      this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;
    } else {
      this.messagesContent.nativeElement.scrollTop += window.innerHeight - 255;
    }
  }

  ngAfterViewChecked(): void {
    if (this.lastMessagesCount < this.messages.length) {
      this.scrollBottom();
    }
    this.lastMessagesCount = this.messages.length;
  }
}
