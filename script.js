const chatContainer =
document.getElementById("chat-container");

const messageInput =
document.getElementById("message-input");

const sendBtn =
document.getElementById("send-btn");

const newChatBtn =
document.getElementById("new-chat-btn");

const languageSelect =
document.getElementById("language-select");

const ragToggle =
document.getElementById("rag-toggle");

const chatHistory =
document.getElementById("chat-history");

const uploadBtn =
document.getElementById("upload-btn");

const fileInput =
document.getElementById("file-input");

/* =========================
   STATE
========================= */

let selectedLanguage = "English";

let ragEnabled = true;

let chats =
JSON.parse(
localStorage.getItem("sarvam_chats")
) || [];

let currentChatId = null;

/* =========================
   SAVE
========================= */

function saveChats(){

localStorage.setItem(
"sarvam_chats",
JSON.stringify(chats)
);

}

/* =========================
   CREATE CHAT
========================= */

function createChat(){

const chatId =
Date.now().toString();

const newChat = {

id:chatId,

title:"New Chat",

messages:[]

};

chats.unshift(newChat);

currentChatId = chatId;

saveChats();

renderHistory();

renderChat();

}

newChatBtn.onclick = createChat;

/* =========================
   RENDER HISTORY
========================= */

function renderHistory(){

chatHistory.innerHTML = "";

chats.forEach(chat=>{

const div =
document.createElement("div");

div.className =
"chat-history-item";

div.innerText =
chat.title;

div.onclick = ()=>{

currentChatId =
chat.id;

renderChat();

};

chatHistory.appendChild(div);

});

}

/* =========================
   RENDER CHAT
========================= */

function renderChat(){

chatContainer.innerHTML = "";

const currentChat =
chats.find(
c=>c.id===currentChatId
);

if(!currentChat) return;

currentChat.messages.forEach(msg=>{

addMessageToUI(
msg.text,
msg.sender
);

});

}

/* =========================
   MESSAGE UI
========================= */

function addMessageToUI(
text,
sender
){

const wrapper =
document.createElement("div");

wrapper.className =
`message ${sender}`;

const avatar =
document.createElement("div");

avatar.className =
"avatar";

avatar.innerHTML =
sender==="user"
? "👤"
: "🧠";

const bubble =
document.createElement("div");

bubble.className =
"bubble";

bubble.innerText =
text;

wrapper.appendChild(avatar);

wrapper.appendChild(bubble);

chatContainer.appendChild(wrapper);

chatContainer.scrollTop =
chatContainer.scrollHeight;

}

/* =========================
   SEND MESSAGE
========================= */

async function sendMessage(){

const text =
messageInput.value.trim();

if(!text) return;

addMessageToUI(
text,
"user"
);

const currentChat =
chats.find(
c=>c.id===currentChatId
);

if(currentChat){

currentChat.messages.push({

text,
sender:"user"

});

if(currentChat.title==="New Chat"){

currentChat.title =
text.slice(0,30);

}

saveChats();

renderHistory();

}

messageInput.value = "";

try{

const response =
await fetch(
"http://localhost:3000/chat",
{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

message:text,

language:selectedLanguage,

useRag:ragEnabled

})

}
);

const data =
await response.json();

const botReply =
data.reply ||
"Something went wrong";

addMessageToUI(
botReply,
"bot"
);

if(currentChat){

currentChat.messages.push({

text:botReply,
sender:"bot"

});

saveChats();

}

}catch(err){

addMessageToUI(
"Server error",
"bot"
);

}

}

/* =========================
   EVENTS
========================= */

sendBtn.onclick =
sendMessage;

messageInput.addEventListener(
"keydown",
e=>{

if(e.key==="Enter"){

sendMessage();

}

}
);

/* =========================
   LANGUAGE
========================= */

if(languageSelect){

languageSelect.value =
selectedLanguage;

languageSelect.onchange = ()=>{

selectedLanguage =
languageSelect.value;

localStorage.setItem(
"selected_language",
selectedLanguage
);

};

}

/* =========================
   RAG TOGGLE
========================= */

if(ragToggle){

ragToggle.onchange = ()=>{

ragEnabled =
ragToggle.checked;

};

}

/* =========================
   FILE UPLOAD
========================= */

uploadBtn.onclick = ()=>{

fileInput.click();

};

fileInput.onchange = ()=>{

const file =
fileInput.files[0];

if(!file) return;

alert(
`Selected file: ${file.name}`
);

};

/* =========================
   INIT
========================= */

if(chats.length===0){

createChat();

}else{

currentChatId =
chats[0].id;

renderHistory();

renderChat();

}