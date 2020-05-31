import {DialogflowResponse} from './dialogflow-response';

export class DialogflowSimpleResponse {
  public responses: string[];
  public linkTitle: string;
  public linkUrl: string;
  public quickReplies: string[];
  public quickRepliesText: string[];
  public errorResponse: string;

  constructor() {
    this.responses = [];
    this.linkTitle = '';
    this.linkUrl = '';
    this.quickReplies = [];
    this.quickRepliesText = [];
    this.errorResponse = '';
  }

  constructFromDialogFlowResponse(dialogFlowResponse: DialogflowResponse): DialogflowSimpleResponse {
    console.log('----- dialogFlowResponse.fulfillmentMessages -----');
    console.log(dialogFlowResponse.fulfillmentMessages);
    dialogFlowResponse.fulfillmentMessages.forEach(fulfillmentMessage => {
      if (fulfillmentMessage.message === 'text') {
        console.log('----- text -----');
        this.responses.push(fulfillmentMessage.text.text[0]);
        console.log(this.responses);
      } else if (fulfillmentMessage.message === 'quickReplies') {
        console.log('----- quickReplies -----');
        fulfillmentMessage.quickReplies.quickReplies.forEach(quickReply => {
          if (fulfillmentMessage.quickReplies.quickReplies.indexOf(quickReply) % 2 === 0) {
            this.quickReplies.push(quickReply);
          } else {
            this.quickRepliesText.push(quickReply);
          }
        });
        console.log(this.quickReplies);
        console.log(this.quickRepliesText);
      } else if (fulfillmentMessage.message === 'card') {
        console.log('----- card -----');
        this.responses.push('link');
        this.linkTitle = fulfillmentMessage.card.title;
        this.linkUrl = fulfillmentMessage.card.buttons[0].postback;
        console.log(this.linkTitle + ': ' + this.linkUrl);
      }
    });
    this.errorResponse = dialogFlowResponse.fulfillmentText;
    return this;
  }
}
