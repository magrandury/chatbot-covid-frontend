import {DialogflowResponse} from './dialogflow-response';

export class DialogflowSimpleResponse {
  public responses: string[];
  public linkTitle: string;
  public linkUrl: string;
  public quickReplies: string[];
  public errorResponse: string;

  constructor() {
    this.responses = [];
    this.linkTitle = '';
    this.linkUrl = '';
    this.quickReplies = [];
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
        this.quickReplies = fulfillmentMessage.quickReplies.quickReplies;
        console.log(this.quickReplies);
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
