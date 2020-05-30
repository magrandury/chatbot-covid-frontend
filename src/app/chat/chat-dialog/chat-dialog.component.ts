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
    // tslint:disable-next-line:max-line-length
    this.messages.push(new Message('¡Hola! Soy Aurora y estaré encantada de ayudarle a resolver todas sus dudas sobre el COVID-19.', Origin.SENT, false));
  }

  sendUserInput() {
    if (this.userInput) {
      this.messages.push(new Message(this.userInput, Origin.REPLIES, false));
      this.messageLoading = true;
      this.chatService.callChatbotWithUserInput(this.userInput)
        .then(chatResponse => {
          console.log('¡Aurora ha respondido!');
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
              // tslint:disable-next-line:max-line-length
              this.messages.push(new Message('No dude en buscar la respuesta a sus preguntas en la página dedicada al COVID-19 del Ministerio de Sanidad.', Origin.SENT, false));
              // tslint:disable-next-line:max-line-length
              this.messages.push(new Message('https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/home.htm', Origin.SENT, true));
            }
          });
          this.chipMessages = chatResponse.quickReplies;
        })
        .catch(error => {
          console.log('Error a la hora de recuperar la respuesta de Aurora:');
          console.log(error);
          this.messageLoading = false;
          this.messages.push(new Message('En estos momentos no puedo atenderle.', Origin.SENT, false));
          // tslint:disable-next-line:max-line-length
          this.messages.push(new Message('No dude en buscar la respuesta a sus preguntas en la página dedicada al COVID-19 del Ministerio de Sanidad.', Origin.SENT, false));
          // tslint:disable-next-line:max-line-length
          this.messages.push(new Message('https://www.mscbs.gob.es/profesionales/saludPublica/ccayes/alertasActual/nCov-China/home.htm', Origin.SENT, true));
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
