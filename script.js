import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";

import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAuU0UpA-mAY4nQe-7gc2NtLILTxKQEch0",
    authDomain: "classdemo-18e3c.firebaseapp.com",
    databaseURL: "https://classdemo-18e3c-default-rtdb.firebaseio.com",
    projectId: "classdemo-18e3c",
    storageBucket: "classdemo-18e3c.appspot.com",
    messagingSenderId: "961276923151",
    appId: "1:961276923151:web:7cf28544b2e6085cacc27a"
  };


const app = initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);

const sendButton = document.getElementById("sendButton"); 
const textInput = document.getElementById("inputBox"); 
const enterUsernameButton = document.getElementById("enterUsernameButton"); 
const usernameInput = document.getElementById("usernameInput"); 
const clearChatsButton = document.getElementById("clearChats"); 

const chatBoxDiv = document.getElementById("chatBox"); 
chatBoxDiv.style.display = "none"; 
// const addListElement = document.querySelector("#testList"); 

let chatRef = rtdb.ref(db, "/Chats"); 
let username = ""; 

textInput.addEventListener("keypress", event => {
  const keyName = event.key
  
  if(event.key === "Enter"){
    rtdb.push(chatRef,{
    Message : textInput.value,
    User : username
  })
  textInput.value = "";
  }
})

enterUsernameButton.addEventListener('click', event => {
  username = usernameInput.value; 
  var entryDiv = document.getElementById("usernameDiv"); 
  entryDiv.style.display = "none"; 
  chatBoxDiv.style.display = "block"; 
  
})

clearChatsButton.addEventListener('click', event => {
  rtdb.set(chatRef, {});
  console.log("Trying to clear the chat history"); 
  var list = document.getElementById("chatList"); 
  list.innerHTML = ""; 
});
                                  
                                  
sendButton.addEventListener('click', event => {
  rtdb.push(chatRef,{
    Message : textInput.value,
    User : username
  })
  textInput.value = ""; 
});

rtdb.onChildAdded(chatRef, snapshot =>{
  const newMessage = snapshot.val(); 
  console.log(newMessage); 
  var node=document.createElement("LI");
  var textnode=document.createTextNode(newMessage.User +" :  " + newMessage.Message);
  node.appendChild(textnode);
  document.querySelector("ul").appendChild(node);
})

//Initialize Firebase
// const app = initializeApp(firebaseConfig);

// let db = rtdb.getDatabase(app);
// let titleRef = rtdb.ref(db, "/");

//let peopleRef = rtdb.child(titleRef, "Name")
// rtdb.onValue(titleRef, ss=>{
//   alert(JSON.stringify(ss.val()));
// });

// let ianRef = rtdb.ref(db, "Level"); 
// rtdb.get(ianRef).then(ss => {
//   alert(JSON.stringify(ss.val())); 
// })

// var clickSend = function(){
//   console.log("Hello world"); 
// }

//This is nodeJs, I have no clue what I'm writing in 
// chatRef.on('child_added', snapshot =>{
//   const newMessage = snapshot.val(); 
//   console.log(newMessage); 
// })

// rtdb.set(titleRef, {
//   Name: "Ian",
//   Status: "Good"
// })

// rtdb.update(titleRef, {
//   Hair: {"Texture":"Curly", "Color":"Brown", "Length":"Medium"},
//   Eyes: "Green"
// })

// rtdb.update(rtdb.ref(db, "/Hair/"), {
//   Color: "Blonde",
//   Length: "Long"
// })

// rtdb.push(rtdb.ref(db, "/Status/"),{
//   Monday: "True",
//   Tuesday: "True" 
// })

// addListElement.addEventListener('click', event => {
//   alert("Hello"); 
//   var node=document.createElement("LI");
//   var textnode=document.createTextNode("SomeText");
//   node.appendChild(textnode);
//   document.querySelector("ul").appendChild(node);
// })

//How does the whole child thing work