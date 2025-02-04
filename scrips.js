import { loginTemp } from "./temps/login.js";
import { main } from "./temps/main.js";
import {
  makeGradeChart,
  makeSkillChart,
  makeAttChart,
} from "./temps/charts.js";
///////////////////////////////////////////
/////// copy this to the terminal/////////
///////// npm install chart.js ///////////
/////// a package for crating charts//////
//////////////////////////////////////////
const jwt = "https://adam-jerusalem.nd.edu/api/auth/signin";
const url = "https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql";
let tok;
//--------testing------------------
let progressArr = [];
let attempts;

let goProjectNames = [
  "go-reloaded",
  "ascii-art",
  "ascii-art-reverse",
  "ascii-art-color",
  "ascii-art-output",
  "ascii-art-fs",
  "ascii-art-justify",
  "ascii-art-web",
  "ascii-art-web-stylize",
  "ascii-art-web-dockerize",
  "ascii-art-web-exportfile",
  "groupie-tracker",
  "groupie-tracker-searchbar",
  "groupie-tracker-filters",
  "groupie-tracker-gelocalization",
  "groupie-tracker-visualizations",
  "lem-in",
  "forum",
  "forum-image-upload",
  "forum-authentication",
  "forum-moderation",
  "forum-advanced-features",
  "net-cat",
  "wget",
];

let jsProjectNames = [
  "make-your-game",
  "make-your-game-score-handling",
  "make-your-game-history",
  "make-your-game-different-maps",
  "real-time-forum",
  "real-time-forum-typing-in-progress",
  "graphql",
  "social-network",
  "social-network-cross-platform-appimage",
  "mini-framework",
  "bomberman-dom",
];

let allProjectNames = goProjectNames.concat(jsProjectNames);
let lengthOfProjectNames = allProjectNames.length;
//---------------------------------------------

function login() {
  document.body.innerHTML = loginTemp;
  // fetching the jwt for the user
  document.getElementById("loginB").addEventListener("click", function (press) {
    press.preventDefault();
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;


    const encodedCredentials = btoa(`${username}:${password}`);
    fetch(jwt, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      if (resp.ok) {
        tok = resp.json();
        tok.then((resolvedToken) => {
          tok = resolvedToken;
          getuserdata(resolvedToken);
        });
      } else {
        let invMsg = document.querySelector('#box p');
        if (invMsg){
          invMsg.remove()
        }
        let invalid = document.createElement('p')
        invalid.innerText = 'invalid username or password'
        invalid.style.color = 'rgb(246 0 0 / 100%)'
        let box = document.getElementById('box')
        let usename = document.getElementById("user");
        let pass = document.getElementById("pass");
        box.style.border = "2px solid rgb(246 0 0 / 20%)"
        usename.style.border = "2px solid rgb(246 0 0 / 20%)";
        pass.style.border = "2px solid rgb(246 0 0 / 20%)";
        box.appendChild(invalid)
      }
    });
  });
}

login();
function getuserdata(token) {
  let res = 0;
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
                user,{
                    id
                    login
                }
                    xp_view {
                    amount
                  }
            }`,
    }),
  })
    .then((resp) => resp.json())
    .then((user) => {
      res = user.data.xp_view.reduce((sum, item) => sum + item.amount, 0);
      res = res / 1000
      res= res.toFixed(0)
      mainPage(user.data.user[0].id, user.data.user[0].login, res);
    })
    .catch((err) => console.log(err, "err"));
  getSkills(token);
  getProgressData(token);
  attempts = getAttemptsData(token);
}

function mainPage(id, username, totalXp) {
  let am = 'KB'
      if (totalXp >= 1000){
        am = 'MB'
        totalXp = (totalXp / 1000).toFixed(2) 
        
      }; 
  ChangeCss("main.css");
  
  let logout = document.createElement("button");
  let logo = document.createElement("i");
  logo.className = "fa-solid fa-arrow-right-from-bracket";
  logo.id = "logout";
  logo.innerText = " logOut";
  logout.appendChild(logo);
  document.body.innerHTML = main;
  let uID = document.createElement("h1");
  uID.innerText = `${id} ${username} XP:${totalXp+am}`;
  document.getElementById("userinfo").appendChild(logout);
  document.getElementById("userinfo").appendChild(uID);
  logout.addEventListener("click", r);
}
function r() {
  location.reload();
}

function ChangeCss(name) {
  const oldcss = document.getElementById("dc");
  if (oldcss) {
    oldcss.remove();
  }
  let link = document.createElement("link");
  link.id = "dc";
  link.rel = "stylesheet";
  link.href = name;
  document.head.appendChild(link);
}

function getSkills(token) {
  let skills;
  let gradesPro;
  let attemptsMap;
  getProgressData(token);

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
    transaction(
      where: {
        type: { _ilike: "%skill%" }
      }
    ) {
      type
      amount
      objectId
      object {
        name
      }
      createdAt
      path
    }
  }`,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      skills = createAskillsMap(response.data.transaction);
      gradesPro = createAGradeMap(progressArr);
    });
    
    setTimeout(() => {
      makeSkillChart(skills);
      }, 100);
      setTimeout(() => {
        makeGradeChart(gradesPro);
        }, 300);
        setTimeout(() => {
        attemptsMap = createAttemptsMap(attempts);
        makeAttChart(attemptsMap);
      deTok();
    }, 600);
}
function createAskillsMap(data) {
  const skillMap = data.reduce((acc, obj) => {
    const { type, amount } = obj;
    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {});
  const sortedSkills = Object.entries(skillMap)
    .sort(([, a], [, b]) => b - a) 
    .slice(0, 5); 

  const topSkillsMap = Object.fromEntries(sortedSkills);

  return topSkillsMap;
}
function deTok() {
  tok = "";
}
function createAGradeMap(data) {
  console.log("🚀 ~ createAGradeMap ~ data:", data);
  const gradMap = data.reduce((acc, obj) => {
    const { object, grade } = obj;
    const type = object.name;
    acc[type] = (acc[type] || 0) + grade;
    return acc;
  }, {});
  return gradMap;
}
function createAttemptsMap(data) {
  console.log("🚀 ~ createAttemptsMap ~ data:", data);
  
  const attempts = data.reduce((acc, obj) => {
    const { object } = obj; 
    const name = object.name; 
    acc[name] = (acc[name] || 0) + 1; 
    return acc;
  }, {});


  const sortedAttempts = Object.entries(attempts)
    .sort(([, a], [, b]) => b - a) 
    .slice(0, 10); 

  const topAttempts = Object.fromEntries(sortedAttempts);

  console.log("🚀 ~ createAttemptsMap ~ topAttempts:", topAttempts);
  return topAttempts;
}
function getProgressData(token) {
  for (let i = lengthOfProjectNames - 1; i >= 0; i--) {
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer  ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
  progress (
    where: {
      object: { name: { _eq: "${allProjectNames[i]}" } }
    }
  ) {
    object {
      name
    }
    grade
    createdAt
    updatedAt
  }
}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["data"]["progress"].length != 0) {
          progressArr.push(response["data"]["progress"][0]);
        }
      });
  }
  return progressArr;
}
function getAttemptsData(token) {
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer  ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {     
  progress {
    object {
      name
    }
  }
}`,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      attempts = response.data.progress;
    });
}
