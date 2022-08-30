import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

let call;
let callClient;
let callAgent;
let tokenCredential;

const calleePhoneInput = document.getElementById("callee-phone-input");
const callerCountryInput = document.getElementById("caller-country-code-input");
const tokenCredentialInput = document.getElementById("token-credential-input");
const alternateIdInput = document.getElementById("alternate-callerid-input");
const callPhoneButton = document.getElementById("call-phone-button");
const hangUpPhoneButton = document.getElementById("hang-up-phone-button");
const createCallAgentButton = document.getElementById("create-call-agent-button");
const displayAlternateId = document.getElementById("alternate-id-display");

function disableCallAgentButton()
{
  createCallAgentButton.innerText = "Call Agent Created!"
  createCallAgentButton.disabled = true;
}

//'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmIxMzViMDM3LTUzZTktNDg2ZC05YWQwLTVkMWE5MTZjYjQ1OV8wMDAwMDAxMy0wODVmLTYzOTgtN2JmYS01NTNhMGQwMDg5MzkiLCJzY3AiOjE3OTIsImNzaSI6IjE2NTk2MTA0NDciLCJleHAiOjE2NTk2OTY4NDcsImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiJiMTM1YjAzNy01M2U5LTQ4NmQtOWFkMC01ZDFhOTE2Y2I0NTkiLCJpYXQiOjE2NTk2MTA0NDd9.u1GApXw5F8gGEIL7fu_BCqMaZeO625M97dV2hQ0wCZh5MozaLUHmXcEO80eGucYse5Tm6H_iM7D4YViRQsAJ23mLfadzzBENDqQ3kvOLQkx31j2fAWhq6pt4QPIAghiLgI5L_kKj2lULGG-LsWPUnY4yClr_4r1x01zcxDnNRqezu_Sgq-ErK7FuNjwqsVyM4pHWQeQkgCta7L4E4IhKmrJtzkVlmYprbSVSohGQsjeh_AJro5jm6xOvYtoVITonjGB-Ki5PdeCD-S9cKzWOZ-89mN1zAAUOYAoRwDD2snXgGUZozO87ozxbwNvCk3I5mCvkG8p1l7FratOkKYXvog'
callPhoneButton.addEventListener("click", () => {
  // start a call to phone
  const calleePhoneNumber = calleePhoneInput.value;
  const alternateId = alternateIdInput.value;

  console.log("Outgoing call");
  console.log("AlternateId:" + alternateId);
  console.log("calleePhoneNumber:" + calleePhoneNumber);

  call = callAgent.startCall(   //phoneNumber: phoneToCall
    [{id: calleePhoneNumber}], { alternateCallerId: {phoneNumber: alternateId} //'+18445776846' +18445776846, +18445777337, +18445782257
  }
  );
  // toggle button states
  hangUpPhoneButton.disabled = false;
  callPhoneButton.disabled = true;
});

hangUpPhoneButton.addEventListener("click", () => {
  // end the current call
  call.hangUp({
    forEveryone: true
  });

  // toggle button states
  hangUpPhoneButton.disabled = true;
  callPhoneButton.disabled = false;
});

createCallAgentButton.addEventListener("click", async() =>  {
  callClient = new CallClient();
  const country = callerCountryInput.value;
  const inputTokenCredential = tokenCredentialInput.value;

  const options  = {
    displayName : "MS-Emergency-test",
    emergencyCallOptions: {countryCode: country}
  };

  tokenCredential = new AzureCommunicationTokenCredential(inputTokenCredential);
  callAgent = await callClient.createCallAgent(tokenCredential,options);

  if(callAgent)
  {
    disableCallAgentButton();
  }

  callAgent.on('incomingCall', async (args) => {
  // accept the incoming call
  
  console.log("Incoming call");
  console.log("AlternateId:" + args.incomingCall.alternateId);
  displayAlternateId.value = args.incomingCall.alternateId;
  
  const call = await args.incomingCall.accept();
});
});


// Identity:8:acs:b135b037-53e9-486d-9ad0-5d1a916cb459_00000013-085f-6398-7bfa-553a0d008939
// AccessToken: eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmIxMzViMDM3LTUzZTktNDg2ZC05YWQwLTVkMWE5MTZjYjQ1OV8wMDAwMDAxMi1iMWNmLWRjMmMtOTgwNi0xMTNhMGQwMDJiNzgiLCJzY3AiOjE3OTIsImNzaSI6IjE2NTgxNTgyMDAiLCJleHAiOjE2NTgyNDQ2MDAsImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiJiMTM1YjAzNy01M2U5LTQ4NmQtOWFkMC01ZDFhOTE2Y2I0NTkiLCJpYXQiOjE2NTgxNTgyMDB9.wGQBYVXD-ILNXVeP98avCPGia3u0bh6HZhrFxPmuYPxfn_x3kIJJluUynhIrTQsKmxAzT24qj1YdDeRHlARsFH67V-gszBY96qEdf4fTuvPMD7S3O-BPbbNxRO8_D3it75hA9TGissDBniQcyF_l_HZKH302Mw3OaOuvT6FZXe86hl5bT-zx9kmMnGjffBk7il0bze6NxgbEqyF5XA9mLLGUlPj0GMxkB_3rA3XN-dU6GIgcWquE3nkka7LCWbuxuYUtVlUnwH3aujqeBqRVD2A5OHUPvZQN9eqt0Hh5VtQP-YC1ogcSlqaJ8nbSmxBmnWoqCI0SaiIgL6lNlxflLw
async function init() {
    callPhoneButton.disabled = false;      
}

init();