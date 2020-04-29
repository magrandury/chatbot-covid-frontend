import {dialogflow} from 'dialogflow';
import {uuid} from 'uuid';
import {DialogflowResponse} from './dialogflow-response';

export class DialogFlow {
  public projectId: string;
  public sessionClient: dialogflow.SessionsClient;

  constructor() {
    this.projectId = 'redytel-otyebo';
    // tslint:disable-next-line:max-line-length
    const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQD2evD+c0MrY4xE\nfc5DvV97hsBiScnzaSG3BkqoAboiUEJkimau9R9rKjg7nVUJmgDVhlM0wqeJhzwx\nCXQYCbEn/Ue6yhfVoqQIFUC2JU7omuUd/1j95yiuUe6MfmM8VvvHNuY42ztbUc51\nRg+4Tzs8XqZWw6g5kwBeCwfMmFiuq76SXLNk1nLdYOer4493J6JtUcVvVakrnwuv\nVogdmUp6aeLOLhvU/BJ6PAW/0abSkDHpkb4erq+sjlh+7SUBOCSaOrD8KcUZ+Q0w\nuID/6onYIrvugZsR/puJJx7Zw6AKuI/ZSD+6xrKioBTLHo8voo6XmNbcn5fSbKrB\nAoG98t4tAgMBAAECggEAAZPk4gQT3H29Ip0ZimZ2a4B/z8FAKS41mInSRYQJUHnq\nCuG16Y3JHzL8fCk0J6UUN0muU6qhTuiOMpQoaZT6TNK6uE/d2jC50xFrwh64BBYl\nvEzroWhu4rrEh6KxeOvnna1UyO1iUmHSK/8AT8I2E1tZvjlvZLrzqCZy7NTW0Htm\nvAt25ERy6J47ZbAJ7KD1uiS/oFfMuGk+SV/8vHTcl9+Ei4RnFFjwBuXJL3uXSVut\nAVVufpCag+KnUr3+fJ7veeGRsgqDMnXspgnNEaPeMZO6AIphhvOCCzd85bM6eo5k\ns4pWI8weCy1aNgHUA5oYe0Euu/421MulQSctnpxTowKBgQD+2ht1n8UFaVaVFI2a\ntY/0Rpx6+n9N+FnIyahTcPuKS+qVfaYFhVJ3a690uAYq1O/zRzo9Ys1ta9BhQoHP\nExDsKP7lVJd/gzggVKK33K6Lr7EaVw8XHsMhWOiIcFwleuCa/UxA5RddcEkGw9do\n4ufE8rdL23hur1gW9d4GrimdbwKBgQD3ly4Oo5oEJO1TjjiYgZY+G27yhkZMbPYc\n/VAozwkf2P6W1BKOEqCHUwLnhaSRr4lxlZCqiceUVpuqGltUVaNY5cOHi195yBwX\nS3yMJgTd2Sj2jvmlAY1A/i9C/3L24RW9XfHQ+/lFJoDs2wLJ47Mb0GnwzyTTsjLB\nEzFvSmcoIwKBgQDB/4WnpFd2JxmhomOowU0zxgyYENeXotW14swfuIHCZMfNxDf9\nO9/qyC5nyy3mrPF7X10WHYADK28Ummv2Fa1sGEjwidRJXLn84nB7RaIY80T9qAf0\nsZYYbHWWZvG+Fiujz+2b+MgweKkeXTY8wX1sjta5B/hFSXTlBYRd0XYcQQKBgQDw\n8A3B8TNQFR9e0GgDARhUGB4/pKuEdASM8XWwQMmAVIpr/LSRzU6qYf3RkBw2Kbx2\n7DV7v9iYYi/ZuQxnZW8wc2dz4A1pVXMAuFTbjaPuwAU86qXGDVyIgtM7P5uA5Elj\nnqhT1uEcifusgvSTwyHpT0fJL8uGt0Ls4OCajK0WQQKBgQCYzUSzHI7uI4K9gDih\ncE11emittt1jZgJkf0/aWXtBw/FvNp6v+yqxZxF/UgerRFfi4VW385JvCjY0WsYg\nDbxgfPcaA0c5yGx29THMJT1EQeE4PGylNb0ZMOplcRp+hvNLxoNFVo0TXOhGFjTP\nc6cpYX+bUfSNqulooqOUjtjxqQ==\n-----END PRIVATE KEY-----\n';
    const clientEmail = 'dialogflow-client-auth@redytel-otyebo.iam.gserviceaccount.com';
    const config = {
      credentials: {
        private_key: privateKey,
        client_email: clientEmail
      }
    };
    this.sessionClient = new dialogflow.SessionsClient(config);
  }

  public async callDialogflow(queryText: string, sessionId: string): Promise<DialogflowResponse> {
    if (!sessionId) {
      sessionId = uuid.v4();
    }
    // Define session path
    const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: queryText,
          languageCode: 'en-US'
        }
      }
    };
    try {
      const detectedIntent = await this.sessionClient.detectIntent(request);
      console.log('DialogFlow.callDialogflow: Detected ',  detectedIntent);
      if (detectedIntent[0] && detectedIntent[0].queryResult) {
        const queryResult = detectedIntent[0].queryResult;
        return {
          fulfillmentMessages : queryResult.fulfillmentMessages,
          fulfillmentText: queryResult.fulfillmentText,
          sessionId
        };
      } else {
        return {
          fulfillmentMessages: [{platform: 'ERROR', message: 'ERROR'}],
          fulfillmentText : 'no query result',
          sessionId: 'no query result'
        };
      }
    } catch (err) {
      console.error('DialogFlow.callDialogflow: ERROR ', err);
      throw err;
    }
  }
}


/*
// chat.service.ts:

constructor(private dialogflow: DialogFlow) {}
private sessionId = '';

public async callChatbotWithUserInput(queryText: string): Promise<DialogflowSimpleResponse> {
console.log('Function: callChabotWithUserInput');
try {
  console.log('Dentro del try, antes de await');
  // const dialogflowResponse = await this.http.post<DialogflowResponse>(
  //   'https://xog6iqpgu3.execute-api.us-east-2.amazonaws.com/PROD/dialogflow-client',
  //   {queryText, sessionId: this.sessionId}
  // ).toPromise();
  const dialogflowResponse = await this.dialogflow.callDialogflow(queryText, this.sessionId);
  console.log('Dentro del subscribe');
  console.log(dialogflowResponse);
  this.sessionId = dialogflowResponse.sessionId;
  return new DialogflowSimpleResponse().constructFromDialogFlowResponse(dialogflowResponse);
  // return dialogflowResponse;
} catch (error) {
  console.log('CATCH al hacer el POST');
  console.log(error);
}
}
*/

