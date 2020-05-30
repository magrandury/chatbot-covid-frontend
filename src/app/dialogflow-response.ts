export interface DialogflowResponse {
  fulfillmentMessages: Array<
    {
      platform: string,
      message: string,
      text?: {
        text: Array<string>
      },
      quickReplies?: {
        quickReplies: Array<string>,
        title: string
      },
      card?: {
        buttons: Array<{
          text: string,
          postback: string
        }>,
        title: string,
        subtitle: string,
        imageUri: string
      }
    }>;

  fulfillmentText: string;

  sessionId: string;
}
