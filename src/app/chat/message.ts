import {Origin} from './origin';

export class Message {

  constructor(messageText: string, origin: Origin, link: boolean, linkTitle?: string, linkUrl?: string) {
    this.messageText = messageText;
    this.origin = origin;
    this.link = link;
    this.linkTitle = linkTitle;
    this.linkUrl = linkUrl;
  }

  public messageText: string;
  public origin: Origin;
  public link: boolean;
  public linkTitle: string;
  public linkUrl: string;

}
