import {TestBed} from '@angular/core/testing';
import {DialogflowResponse} from './dialogflow-response';
import {DialogflowSimpleResponse} from './dialogflow-simple-response';

fdescribe('Dialogflow Simple response', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should convert dialogflowResponse to simple response', () => {
    console.log('---------- TEST SINGLE RESPONSE ----------');

    const dialogFlowResponse: DialogflowResponse = JSON.parse('{"fulfillmentMessages":[{"platform":"PLATFORM_UNSPECIFIED",' +
      '"text":{"text":["Bonjour! Je suis Maria, que puis-je faire pour vous?"]},' +
      '"message":"text"},{"platform":"PLATFORM_UNSPECIFIED",' +
      '"quickReplies":{"quickReplies":["Informations dossier"],"title":""},"message":"quickReplies"}],' +
      '"fulfillmentText":"(Webhook failed)",' +
      '"sessionId":"toto"}');

    const expectedDialogFlowSimpleResponse = new DialogflowSimpleResponse();
    expectedDialogFlowSimpleResponse.responses = ['Bonjour! Je suis Maria, que puis-je faire pour vous?'];
    expectedDialogFlowSimpleResponse.quickReplies = ['Informations dossier'];
    expectedDialogFlowSimpleResponse.errorResponse = '(Webhook failed)';
    console.log('expectedDialogFlowSimpleResponse');
    console.log(expectedDialogFlowSimpleResponse);

    const actualDialogFlowSimpleResponse = new DialogflowSimpleResponse().constructFromDialogFlowResponse(dialogFlowResponse);
    console.log('----- actualDialogFlowSimpleResponse -----');
    console.log(actualDialogFlowSimpleResponse);

    expect(actualDialogFlowSimpleResponse.responses).toEqual(expectedDialogFlowSimpleResponse.responses);
    expect(actualDialogFlowSimpleResponse.quickReplies).toEqual(expectedDialogFlowSimpleResponse.quickReplies);
    expect(actualDialogFlowSimpleResponse.errorResponse).toEqual(expectedDialogFlowSimpleResponse.errorResponse);
  });

  it('should convert dialogflowResponse to simple response when there are multiple responses', () => {
    console.log('---------- TEST MULTIPLE RESPONSES ----------');

    const dialogFlowResponse: DialogflowResponse = JSON.parse('{"fulfillmentMessages":[{"platform":"PLATFORM_UNSPECIFIED",' +
      '"text":{"text":["Auprès de quel sujet voulez vous vous renseigner?"]},"message":"text"},{"platform":"PLATFORM_UNSPECIFIED",' +
      '"text":{"text":["N\'hesitez pas à me poser des questions ou à appuyer sur l\'un des boutons ci-dessous."]},"message":"text"},' +
      '{"platform":"PLATFORM_UNSPECIFIED","quickReplies":{"quickReplies":' +
      '["TEXA","Justificatifs","Travaux de remise en état","Indemnisation"],"title":""},' +
      '"message":"quickReplies"}],"fulfillmentText":"(Webhook failed)","sessionId":"f3434f7d-bae5-4621-bf6d-898828bd748e"}');

    const expectedDialogFlowSimpleResponse = new DialogflowSimpleResponse();
    expectedDialogFlowSimpleResponse.responses = ['Auprès de quel sujet voulez vous vous renseigner?',
      'N\'hesitez pas à me poser des questions ou à appuyer sur l\'un des boutons ci-dessous.'];
    expectedDialogFlowSimpleResponse.quickReplies = ['TEXA', 'Justificatifs', 'Travaux de remise en état', 'Indemnisation'];
    expectedDialogFlowSimpleResponse.errorResponse = '(Webhook failed)';
    console.log('----- expectedDialogFlowSimpleResponse -----');
    console.log(expectedDialogFlowSimpleResponse);

    const actualDialogFlowSimpleResponse = new DialogflowSimpleResponse().constructFromDialogFlowResponse(dialogFlowResponse);
    console.log('----- actualDialogFlowSimpleResponse -----');
    console.log(actualDialogFlowSimpleResponse);

    expect(actualDialogFlowSimpleResponse.responses).toEqual(expectedDialogFlowSimpleResponse.responses);
    expect(actualDialogFlowSimpleResponse.quickReplies).toEqual(expectedDialogFlowSimpleResponse.quickReplies);
    expect(actualDialogFlowSimpleResponse.errorResponse).toEqual(expectedDialogFlowSimpleResponse.errorResponse);
  });

  it('should convert dialogflowResponse to simple response when there are links', () => {
    console.log('---------- TEST LINK ----------');

    const dialogFlowResponse: DialogflowResponse = JSON.parse('{"fulfillmentMessages":[{"platform":"PLATFORM_UNSPECIFIED",' +
      '"text":{"text":["D\'accord Celine, vous pouvez vous connecter avec le lien suivant:"]},"message":"text"},' +
      '{"platform":"PLATFORM_UNSPECIFIED","card":{"buttons":[{"text":"Mon dossier",' +
      '"postback":"https://mondossier-pp.texa.frsi/extranet-assure/index.html#/?ref=TX19095588&c=9d649cbb99"}],' +
      '"title":"Votre Espace Assuré","subtitle":"","imageUri":""},"message":"card"},{"platform":"PLATFORM_UNSPECIFIED",' +
      '"text":{"text":["Puis-je faire autre chose pour vous?"]},"message":"text"},' +
      '{"platform":"PLATFORM_UNSPECIFIED","quickReplies":{"quickReplies":["Informations dossier","Guide de l\'expertise"],"title":""},' +
      '"message":"quickReplies"}],"fulfillmentText":"(Webhook failed)","sessionId":"de822d46-cb9d-4072-aa53-e588bba6d805"}');

    const expectedDialogFlowSimpleResponse = new DialogflowSimpleResponse();
    expectedDialogFlowSimpleResponse.responses = ['D\'accord Celine, vous pouvez vous connecter avec le lien suivant:', 'link',
      'Puis-je faire autre chose pour vous?'];
    expectedDialogFlowSimpleResponse.linkTitle = 'Votre Espace Assuré';
    expectedDialogFlowSimpleResponse.linkUrl = 'https://mondossier-pp.texa.frsi/extranet-assure/index.html#/?ref=TX19095588&c=9d649cbb99';
    expectedDialogFlowSimpleResponse.quickReplies = ['Informations dossier', 'Guide de l\'expertise'];
    expectedDialogFlowSimpleResponse.errorResponse = '(Webhook failed)';
    console.log('----- expectedDialogFlowSimpleResponse -----');
    console.log(expectedDialogFlowSimpleResponse);

    const actualDialogFlowSimpleResponse = new DialogflowSimpleResponse().constructFromDialogFlowResponse(dialogFlowResponse);
    console.log('----- actualDialogFlowSimpleResponse -----');
    console.log(actualDialogFlowSimpleResponse);

    expect(actualDialogFlowSimpleResponse.responses).toEqual(expectedDialogFlowSimpleResponse.responses);
    expect(actualDialogFlowSimpleResponse.linkTitle).toEqual(expectedDialogFlowSimpleResponse.linkTitle);
    expect(actualDialogFlowSimpleResponse.linkUrl).toEqual(expectedDialogFlowSimpleResponse.linkUrl);
    expect(actualDialogFlowSimpleResponse.quickReplies).toEqual(expectedDialogFlowSimpleResponse.quickReplies);
    expect(actualDialogFlowSimpleResponse.errorResponse).toEqual(expectedDialogFlowSimpleResponse.errorResponse);
  });
});
