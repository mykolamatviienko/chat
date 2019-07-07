import 'babel-polyfill';
import _ from 'lodash';

import './../sass/styles.scss';

var logout = document.getElementById("logout");
var registerButton = document.getElementById("sign-up-button");
var signInButton = document.getElementById("sign-in-button");
var userListArea = document.getElementById("user-list");

signInButton.onclick = clickTheSignInButton;
registerButton.onclick = registration;

logout.onclick = function () {
    location.reload();
}

function clickTheSignInButton() {

    var newNickname = document.getElementById('nickname').value;

    var request = new XMLHttpRequest();
    request.open('GET', 'https://studentschat.herokuapp.com/users', true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Обработчик успещного ответа
            var response = request.responseText;
            //var userList = Response;
            var onlineNumber = 0;
            var userExists = false;

            JSON.parse(response).forEach(
                function (obj) {
                    console.log(obj);
                    if (obj.status == "active") {
                        onlineNumber += 1;
                    }
                    if (obj.username == newNickname) {
                        console.log("catched!");
                        userExists = true;
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

                }
            )
            if (userExists) {
                showMainFrame();
            } else {
                location.reload();
            }
            console.log(onlineNumber);
            document.getElementById("number-of-online-users").innerHTML = onlineNumber;


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


//-------------------------------------------------------


// const getHeader = () => {
//   const helloWebpack = _.join(['Hello', 'webpack!'], ' ');
//   console.log(helloWebpack);
//   const element = document.createElement('h1');

//   element.innerHTML = helloWebpack;

//   return element;
// };

// document.body.appendChild(getHeader());

// const o = {
//   foo: {
//     bar: null
//   }
// };

// console.log(o?.foo?.bar?.baz ?? 'default');
