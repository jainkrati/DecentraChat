import logo from "./logo.svg";
import "./App.css";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";

export const CreateChatUser = async () => {
  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("succesful login with " + address);
    // const response = await PushAPI.user.create({
    //   account: "eip155:" + address,
    //   signer: signer,
    //   env: ENV.STAGING,
    // });
    // console.log(response);

    // test account 1
    const testAccount1 = "0x2C0a5B16b9C51ac466ee50baF95b6176Fb9f2b36";
    const user = await PushAPI.user.get({
      account: "eip155:" + testAccount1,
      env: ENV.STAGING,
    });

    console.log("GetUser successful: " + user);
    console.log("user.encryptedPrivateKey: " + user.encryptedPrivateKey);

    // need to decrypt the encryptedPvtKey to pass in the api using helper function
    const decryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
      env: ENV.STAGING,
    });

    console.log("decryptPGPKey successful: " + decryptedPvtKey);
    // // conversation hash between test account 1 and RA
    const conversationHash = await PushAPI.chat.conversationHash({
      account: "eip155:" + testAccount1,
      conversationId: "eip155:0x44AC194359fA44eCe6Cb2E53E8c90547BCCb95a0", // receiver's address or chatId of a group
    });
    console.log("conversationHash: " + conversationHash);

    // // actual api
    const chatHistory = await PushAPI.chat.latest({
      threadhash: conversationHash.threadHash,
      account: "eip155:" + testAccount1,
      toDecrypt: true,
      pgpPrivateKey: decryptedPvtKey,
    });
    console.log(chatHistory);
  } catch (err) {
    console.log(err);
  }
};

function App() {
  CreateChatUser();

  return (
    <div className="App">
      <header className="App-header">Push Chat Project</header>
      <div></div>
    </div>
  );
}

export default App;
