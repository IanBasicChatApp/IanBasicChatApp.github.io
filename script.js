import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";

import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
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
let auth = fbauth.getAuth(app);

const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("inputBox");
const enterUsernameButton = document.getElementById("enterUsernameButton");
const usernameInput = document.getElementById("usernameInput");
const clearChatsButton = document.getElementById("clearChats");

//const chatBoxDiv = document.getElementById("chatBox");
//chatBoxDiv.style.display = "none";
// const addListElement = document.querySelector("#testList");

let chatRef = rtdb.ref(db, "/Chats/general/messages");
//let memberRef = rtdb.ref(db, "/Chats/general/members");
//let currentChat = "general";
let username = "";
$("#app").hide();

// textInput.addEventListener("keypress", event => {
//   const keyName = event.key

//   if(event.key === "Enter"){
//     rtdb.push(chatRef,{
//     Message : textInput.value,
//     User : username
//   })
//   textInput.value = "";
//   }
// })

// enterUsernameButton.addEventListener('click', event => {
//   username = usernameInput.value;
//   var entryDiv = document.getElementById("usernameDiv");
//   entryDiv.style.display = "none";
//   chatBoxDiv.style.display = "block";

// })

clearChatsButton.addEventListener("click", (event) => {
  rtdb.set(chatRef, {});
  console.log("Trying to clear the chat history");
  var list = document.getElementById("supAltChat");
  list.innerHTML = "";
});

sendButton.addEventListener("click", (event) => {
  //let newChatRef = rtdb.ref(db, "/Chats/" + currentChat);
  //console.log("CURRENT AUTH: " + JSON.stringify(auth.currentUser));
  // rtdb.get(ianRef).then(ss => {
  //   alert(JSON.stringify(ss.val()));
  // })
  // let roleRef = rtdb.ref(db, "/users/");
  //   rtdb.get(roleRef).then(roles =>{
  //     console.log("THIS TEXT SHOULD APPEAR SOMEWHERE");
  //     console.log("The roles are: " + JSON.stringify(roles.val()));
  //   });

  rtdb.push(chatRef, {
    Message: textInput.value,
    User: auth.currentUser.displayName,
    UID: auth.currentUser.uid
  });
  textInput.value = "";
});

// rtdb.onChildAdded(chatRef, snapshot =>{
//   const newMessage = snapshot.val();
//   console.log(newMessage);
//   console.log("Full snapshot value: " + JSON.stringify(snapshot));
//   var node=document.createElement("LI");
//   var textnode=document.createTextNode(newMessage.User +" :  " + newMessage.Message);
//   node.appendChild(textnode);
//   //document.querySelector("ul").appendChild(node);
//   document.getElementById("chatList").appendChild(node);

// })

let renderUser = function (userObj) {
  //$("#app").html(JSON.stringify(userObj));
  $("#chatbox").append(`<button type="button" id="logout">Logout</button>`);
  $("#logout").on("click", () => {
    console.log("Logout clicked"); 
    fbauth.signOut(auth);
  });
};

fbauth.onAuthStateChanged(auth, (user) => {
   
  console.log("STATE CHANGED");
  if (!!user) {
    $("#loggedInAs").text("Logged in as: " + auth.currentUser.displayName);
    $("#login").hide();
    $("#app").show();
    renderUser(user);
    //$("#app").removeClass("d-none");
    let flagRef = rtdb.ref(db, "/flag");
    console.log("here");
    rtdb.onValue(flagRef, (ss) => {
      //alert(ss.val());
    });
  } else {
    $("#login").show();
    $("#app").hide();
    //$("#chatbox").html("");
    let cbox = document.getElementById("logout");
    cbox.remove();
  }
});

let rulesRef = rtdb.ref(db, "/rules");
rtdb.onValue(rulesRef, (ss) => {
  let rules = ss.val();
  if (!!rules) {
    $("#rules").html(rules);
  }
});

$("#createAccountButton").on("click", () => {
  let email = $("#userEmail").val();
  let p1 = $("#createPasswordInput").val();
  let p2 = $("#confirmPasswordInput").val();
  let username = $("#userNameInput").val();
  console.log("The username is: " + username);
  if (p1 != p2) {
    alert("Passwords don't match");
    return;
  }
  fbauth
    .createUserWithEmailAndPassword(auth, email, p1)
    .then((somedata) => {
      let uid = somedata.user.uid;
      let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
      let adminRoleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
      let memRef = rtdb.ref(db, `/Chats/general/members`);
      rtdb.set(userRoleRef, true);
      rtdb.set(adminRoleRef, false);

      rtdb.push(memRef, {
        memberID: uid
      });

      fbauth
        .updateProfile(somedata.user, {
          displayName: username,
          phoneNumber: null
        })
        .then(function () {
          console.log("created user: " + somedata.user.displayName);
        });
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

$("#loginButton").on("click", () => {
  let email = $("#logemail").val();
  let pwd = $("#logpass").val();
  fbauth
    .signInWithEmailAndPassword(auth, email, pwd)
    .then((somedata) => {
      console.log(somedata);
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

rtdb.onValue(chatRef, (ss) => {
  console.log("On Valuing");
  let chats = ss.val();
  console.log(JSON.stringify(chats));

  $("#alternateChatList").html("");
  $("#supAltChat").html("");

  Object.keys(chats).forEach(function (key) {
    //console.log(key, chats[key]);

    var $listElement = $("<li>", { "data-id": key });
    $listElement.text(`${chats[key].User} : ${chats[key].Message}`);
    //$listElement.attr("class", "clear");
    //listElement.attr("data-id") = key;
    //$listElement.click( function(){ //////
    //e.preventDefault();

    $listElement.html("");
    $listElement.text(`${chats[key].User} : ${chats[key].Message}`);

    //console.log("Clicked on message, ID: " + key);

    var $divdiv = $("<div>");

    var $textInput = $("<input>", { id: "inputBox" + key });
    $textInput.attr("placeholder", "Test");
    $textInput.attr("Id", key);

    $divdiv.append($textInput);
    // let roleRef = rtdb.ref(db, "/users/" + key);
    // rtdb.get(roleRef, (roles) =>{
    //   console.log("THIS TEXT SHOULD APPEAR SOMEWHERE");
    //   console.log("The roles are: " + JSON.stringify(roles.val()));
    // });

    //auth.currentUser.uid to load edit buttons
    //console.log("VALUES FOR BOOL: " + chats[key].UID + auth.currentUser.uid);
    //console.log("ADMIN BOOL: " + adminBool);
    //console.log(chats[key].UID === auth.currentUser.uid || adminBool === true);
    let roleRef = rtdb.ref(db, "/users/" + auth.currentUser.uid);
    let adminBool = false;
    //let userBool = false;
    rtdb
      .get(roleRef)
      .then((roles) => {
        adminBool = roles.val().roles.admin;
        //console.log("The value of the admin boolean is: " + adminBool);
      })
      .then((z) => {
        //console.log("INSIDE Z, ADMINBOOL: " + adminBool);
        if (chats[key].UID === auth.currentUser.uid || adminBool === true) {
          var $modifyChatButton = $("<button>", { id: "inputBox" + key });
          $modifyChatButton.text("Edit");
          $modifyChatButton.on("click", () => {
            $divdiv.show();
            let newRef = rtdb.child(chatRef, key); //PROBLEM HERE ORIGINAL: db, "/Chats/" + key
            //var chatDirectory = key + "/Message"
            //console.log(chatDirectory);
            let messageContent = {};
            if ($textInput.val() !== "") {
              messageContent.Message = $textInput.val();
              messageContent.User = auth.currentUser.displayName;
              messageContent.UID = auth.currentUser.uid;

              rtdb.update(
                newRef,
                //"Message":"12345"
                messageContent
              );
            }
          });
          $listElement.prepend($modifyChatButton);
        } //if statement
      });

    //$divdiv.append($modifyChatButton);

    $listElement.append($divdiv);
    $divdiv.hide();

    //});
    $("#supAltChat").append($listElement);

    // $("#alternateChatList").append(
    //   `<li data-id=${key}> ${chats[key].User} : ${chats[key].Message} </li>`
    // );
  });
});

$("#makeNewGroupButton").on("click", () => {
  $("#makeNewGroup").append(
    `<input type="text" id="mng" placeholder="Enter Group Name"></input>`
  );
  //console.log($("#mng").val());
  $("#mng").keypress((event) => {
    if (event.key === "Enter") {
      let newGroupName = $("#mng").val();
      console.log("The new group name is: " + newGroupName);

      let newMemberRef = rtdb.ref(db, "/Chats/" + newGroupName + "/members/");
      rtdb.push(newMemberRef, {
        memberID: auth.currentUser.uid,
        HMMM: "BEEPBOOP"
      });

      chatRef = rtdb.ref(db, "/Chats/" + newGroupName + "/messages/");

      var list = document.getElementById("supAltChat");
      list.innerHTML = "";
      dynamicChats();
      $("#mng").remove();
    }
  });
});

let groupRef = rtdb.ref(db, "/Chats/");
rtdb.onValue(groupRef, (gss) => {
  $("#serverList").html("");
  let groups = gss.val();
  console.log("GROUPS HERE: ");
  console.log(JSON.stringify(groups));

  Object.keys(groups).forEach(function (key) {
    console.log("Group Key Value: " + key);

    var $listElement = $("<li>");
    $listElement.text(key);
    $listElement.on("click", () =>{
      console.log("Group: " + key + " clicked!");
      
      chatRef = rtdb.ref(db, "/Chats/" + key + "/messages/");

      var list = document.getElementById("supAltChat");
      list.innerHTML = "";
      dynamicChats();
      
      $("#chatheader").text("Chat: " + key); 
    })
    
    $("#serverList").append($listElement);
  });
});
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
function dynamicChats() {
  rtdb.onValue(chatRef, (ss) => {
    console.log("On Valuing");
    let chats = ss.val();
    console.log(JSON.stringify(chats));

    $("#alternateChatList").html("");
    $("#supAltChat").html("");

    Object.keys(chats).forEach(function (key) {
      var $listElement = $("<li>", { "data-id": key });
      $listElement.text(`${chats[key].User} : ${chats[key].Message}`);

      $listElement.html("");
      $listElement.text(`${chats[key].User} : ${chats[key].Message}`);

      var $divdiv = $("<div>");

      var $textInput = $("<input>", { id: "inputBox" + key });
      $textInput.attr("placeholder", "Test");
      $textInput.attr("Id", key);

      $divdiv.append($textInput);
      let roleRef = rtdb.ref(db, "/users/" + auth.currentUser.uid);
      let adminBool = false;
      //let userBool = false;
      rtdb
        .get(roleRef)
        .then((roles) => {
          adminBool = roles.val().roles.admin;
          //console.log("The value of the admin boolean is: " + adminBool);
        })
        .then((z) => {
          //console.log("INSIDE Z, ADMINBOOL: " + adminBool);
          if (chats[key].UID === auth.currentUser.uid || adminBool === true) {
            var $modifyChatButton = $("<button>", { id: "inputBox" + key });
            $modifyChatButton.text("Edit");
            $modifyChatButton.on("click", () => {
              $divdiv.show();
              let newRef = rtdb.child(chatRef, key);
              let messageContent = {};
              if ($textInput.val() !== "") {
                messageContent.Message = $textInput.val();
                messageContent.User = auth.currentUser.displayName;
                messageContent.UID = auth.currentUser.uid;

                rtdb.update(newRef, messageContent);
              }
            });
            $listElement.prepend($modifyChatButton);
          } //if statement
        });

      $listElement.append($divdiv);
      $divdiv.hide();

      $("#supAltChat").append($listElement);
    });
  });
}