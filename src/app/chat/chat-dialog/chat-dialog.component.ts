import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {ChatService} from '../../chat.service';
import {Message} from '../message';
import {Origin} from '../origin';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements AfterViewChecked {

  constructor(private chatService: ChatService) {
  }

  userInput: string;
  messages: Message[] = [];
  chipMessages: string[] = [];
  messageLoading = false;
  lastMessagesCount = 0;
  hide = false;

  @ViewChild('messagesContent', {read: ElementRef, static: false}) public messagesContent: ElementRef<any>;

  sendUserInput() {
    if (this.userInput) {
      this.messages.push(new Message(this.userInput, Origin.REPLIES, false));
      this.messageLoading = true;
      this.chatService.callChatbotWithUserInput(this.userInput)
        .then(chatResponse => {
          this.messageLoading = false;
          chatResponse.responses.forEach(response => {
            if (response) {
              if (response !== 'link') {
                this.messages.push(new Message(response, Origin.SENT, false));
              } else if (response === 'link') {
                this.messages.push(new Message(response, Origin.SENT, true, chatResponse.linkTitle, chatResponse.linkUrl));
              }
            } else {
              this.messages.push(new Message('Oups! Une erreur est survenue! Veuillez réessayer.', Origin.SENT, false));
            }
          });
          this.chipMessages = chatResponse.quickReplies;
        })
        .catch(error => {
          console.log('Une erreur est survenue lors de la récupération de la réponse de Maria: ');
          console.log(error);
          this.messageLoading = false;
          this.messages.push(new Message('Oups! Une erreur est survenue! Veuillez réessayer.', Origin.SENT, false));
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
    this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;
  }

  ngAfterViewChecked(): void {
    if (this.lastMessagesCount < this.messages.length) {
      this.scrollBottom();
    }
    this.lastMessagesCount = this.messages.length;
  }
}
