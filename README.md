
## Get started
As part of this project, I am demonstrating react integration of [Push Chat](https://docs.push.org/developers/concepts/push-chat-for-web3). To run the project follow:
```
npm install
npm start
```

### Here is how anyone can integrate Push Chat
1. Install Push Chat SDK
```
npm install @pushprotocol/restapi@latest ethers@^5.6
```
2. Create the user PGP keys for the chat:
```
const user = await PushAPI.user.create({
  signer: signer, // ethers.js signer
  env: ENV.STAGING,
});
```
3. Fetch all chats of the user:
```
const user = await PushAPI.user.get({
  account: `eip155:userWalletAddress`,
  env: ENV.STAGING,
})

// need to decrypt the encryptedPvtKey to pass in the api using helper function
const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
  encryptedPGPPrivateKey: user.encryptedPrivateKey,
  signer: signer,
})

// Actual api
const response = await PushAPI.chat.chats({
  account: `eip155:userWalletAddress`,
  toDecrypt: true,
  pgpPrivateKey: pgpDecrpyptedPvtKey,
  env: ENV.STAGING,
})
```
4. Fetch the latest chat preview of the chat between user1 and user2:
```
// conversation hash are also called link inside chat messages
const conversationHash = await PushAPI.chat.conversationHash({
  account: 'eip155:user1WalletAddress',
  conversationId: 'eip155:user2WalletAddress' // receiver's address or chatId of a group
});
  
// actual api
const chatHistory = await PushAPI.chat.latest({
  threadhash: conversationHash.threadHash,
  account: 'eip155:user1WalletAddress',
  toDecrypt: true,
  pgpPrivateKey: decryptedPvtKey
});
```
