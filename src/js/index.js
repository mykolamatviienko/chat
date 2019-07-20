import 'babel-polyfill';
import _ from 'lodash';

import './../sass/styles.scss';

var logout = document.getElementById("logout");
var registerButton = document.getElementById("sign-up-button");
var signInButton = document.getElementById("sign-in-button");
var userListArea = document.getElementById("user-list");
var messageArea = document.getElementById("message-area-id");
var submitMessageButton = document.getElementById("submit-message-button");
var textAreaTap = document.getElementById("my-text-area");
var boldButton = document.getElementById("bold-letter-button-area-id");
var italicButton = document.getElementById("italic-letter-button-area-id");
var underlineButton = document.getElementById("underline-letter-button-area-id");
var minutes = 0;
var seconds = 0;

submitMessageButton.onclick = submitMessage;
signInButton.onclick = clickTheSignInButton;
registerButton.onclick = registration;
boldButton.onclick = clickBold;
italicButton.onclick = clickItalic;
underlineButton.onclick = clickUnderline;

logout.onclick = function () {
    location.reload();
}

//textAreaTap.onkeydown = countChars;
textAreaTap.onkeyup = countChars;

window.onload = clockStart();

function clickTheSignInButton() {

    var newNickname = document.getElementById('nickname').value;
    var onlineNumber = 0;
    var userExists = 0;

    var request = new XMLHttpRequest();
    request.open('GET', 'https://studentschat.herokuapp.com/users', true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Обработчик успещного ответа
            var response = request.responseText;
            var userList = Response;

            JSON.parse(response).forEach(
                function (obj) {
                    console.log(obj);

                    if (obj.status == "active") {
                        onlineNumber += 1;
                    }
                    if (obj.username == newNickname) {
                        console.log("catched!");
                        userExists = 1;
                    }
                    if (obj.username) {
                        var onlineUserDiv = document.createElement('div');
                        var onlineUserParagraph = document.createElement('p');

                        onlineUserDiv.className = "participant-nickname-row";

                        if (obj.status == 'active') {
                            onlineUserParagraph.className = "text-participant-nickname";
                        } else {
                            onlineUserParagraph.className = "text-participant-nickname afk";
                        }

                        onlineUserParagraph.innerHTML = obj.username;
                        onlineUserDiv.appendChild(onlineUserParagraph);
                        userListArea.appendChild(onlineUserDiv);
                    }
                    if (userExists == 1) {
                        showMainFrame();
                    } else {
                        location.reload();
                    }
                    console.log(onlineNumber);
                    document.getElementById("number-of-online-users").innerHTML = onlineNumber;
                }
            )
        } else {
            // Обработчик ответа в случае ошибки
        }
    };
    request.onerror = function () {
        // Обработчик ответа в случае неудачного соеденения
    };
    request.send();
}


function showMainFrame() {
    var temp = document.getElementById("main-frame");
    var temp2 = document.getElementById("modal-window");

    temp.classList.remove("blur-for-main-frame");
    temp2.classList.remove("is-visible");
}

function registration() {
    var request1 = new XMLHttpRequest();
    request1.open('POST', 'https://studentschat.herokuapp.com/users/register', true);

    request1.onload = function () {
        // Обработчик ответа в случае удачного соеденения
    };

    request1.onerror = function () {
        // Обработчик ответа в случае неудачного соеденения
    };
    request1.setRequestHeader('Content-Type', 'application/json');

    var newUser = {
        username: document.getElementById('nickname').value
    }

    request1.send(JSON.stringify(newUser));
}


var clickedLogo = document.getElementById("clicked-logo");

clickedLogo.onclick = refreshMessages;

function refreshMessages() {

    var request = new XMLHttpRequest();
    request.open('GET', 'https://studentschat.herokuapp.com/messages', true);

    request.onload = function () {
        var currentDate = null;
        if (request.status >= 200 && request.status < 400) {
            // Обработчик успещного ответа
            var response = request.responseText;
            JSON.parse(response).forEach(
                function (obj) {
                    //currentDate = obj.datetime.substr(0,10);
                    console.log(obj);
                    if (obj.user_id) {
                        if (currentDate != obj.datetime.substr(0, 10)) {
                            currentDate = obj.datetime.substr(0, 10);
                            var currentDateDiv = document.createElement('div');
                            currentDateDiv.className = "division-by-days";
                            currentDateDiv.innerHTML = currentDate;
                            messageArea.appendChild(currentDateDiv);
                        }
                        var companionMessageRow = document.createElement('div');
                        var senderNickname = document.createElement('div');
                        var nickname = document.createElement('p');
                        var justMessage = document.createElement('div');
                        var messageText = document.createElement('p');
                        var messageDate = document.createElement('div');

                        messageDate.className = "message-date";
                        messageText.className = "message-text";
                        justMessage.className = "just-message";
                        nickname.classList = "nickname";
                        senderNickname.classList = "sender-nickname";
                        companionMessageRow.classList = "message-row companion-message-row";

                        //window.currentDate = obj.datetime;
                        var myHours = obj.datetime.substr(11, 5);

                        messageText.innerHTML = obj.message;
                        justMessage.appendChild(messageText);
                        nickname.innerHTML = obj.user_id;
                        messageDate.innerHTML = myHours;
                        senderNickname.appendChild(nickname);
                        companionMessageRow.appendChild(senderNickname);
                        companionMessageRow.appendChild(messageDate);
                        companionMessageRow.appendChild(justMessage);
                        messageArea.appendChild(companionMessageRow);
                        companionMessageRow.scrollIntoView(true);
                    }

                }
            )

        } else {
            // Обработчик ответа в случае ошибки
        }
    };
    request.onerror = function () {
        // Обработчик ответа в случае неудачного соеденения
    };
    request.send();
}

function submitMessage() {

    var request2 = new XMLHttpRequest();
    request2.open('POST', 'https://studentschat.herokuapp.com/messages', true);

    request2.onload = function () {
        // Обработчик ответа в случае удачного соеденения
    };

    request2.onerror = function () {
        // Обработчик ответа в случае неудачного соеденения
    };
    request2.setRequestHeader('Content-Type', 'application/json');

    var newMessage = {
        datetime: new Date(),
        message: document.getElementById("my-text-area").value,
        user_id: "1122962595"
    }

    request2.send(JSON.stringify(newMessage));
    document.getElementById("my-text-area").value = "";
}

function countChars() {
    var total = document.getElementById("my-text-area").value.length;
    var letter = document.getElementById("my-text-area").value;
    var regexp1 = /\s/g;
    var reqexp2 = /[a-zа-яё]/ig;
    var reqexp3 = /[^\d\sa-zа-яё]/ig;
    var res1 = letter.match(regexp1);
    var res2 = letter.match(reqexp2);
    var res3 = letter.match(reqexp3);
    //debugger;
    if (res1 != null) {
        document.getElementById("casper-number-area-id").innerHTML = res1.length;
    } else {
        document.getElementById("casper-number-area-id").innerHTML = 0;
    }
    if (res2 != null) {
        document.getElementById("letters-number-area-id").innerHTML = res2.length;
    } else {
        document.getElementById("letters-number-area-id").innerHTML = 0;
    }
    if (res3 != null) {
        document.getElementById("signs-number-area-id").innerHTML = res3.length;
    } else {
        document.getElementById("signs-number-area-id").innerHTML = 0;
    }

    document.getElementById("total-number-area-id").innerHTML = total;

}

function clickBold() {
    document.getElementById("my-text-area").value += "<strong></strong>";
}

function clickItalic() {
    document.getElementById("my-text-area").value += "<i></i>";
}

function clickUnderline() {
    document.getElementById("my-text-area").value += "<u></u>";
}

function update() {
    var clock = document.getElementById('clock');

    var date = new Date();

    var hours = date.getHours();
    if (hours < 10) hours = '0' + hours;
    clock.children[0].innerHTML = hours;

    var minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    clock.children[1].innerHTML = minutes;

    var seconds = date.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    clock.children[2].innerHTML = seconds;
}

function clockStart() { // запустить часы
    setInterval(update, 1000);
    setInterval(updateOnline, 1000);
    update();
}

function updateOnline() {
    var counter = document.getElementById("time-online");

    seconds += 1;

    if (seconds == 60) {
        minutes += 1;
        seconds = 0;
    }

    counter.children[0].innerHTML = minutes;
    counter.children[1].innerHTML = seconds;
}