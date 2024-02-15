const text = 'Hello and thank you for visiting our AI program. Please enter your question.';
document.addEventListener("DOMContentLoaded", main);

// get user's input in textArea and updated it to the chat box
async function handleUserInput(evt) {
    evt.preventDefault();
    // // disable the button and textArea
    // document.getElementById('draftSubmitButton').disabled = true   
    // change the button to loading snipper button
    // <button class="btn btn-primary" type="button" disabled>
    //     <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    //     <span class="visually-hidden">Loading...</span>
    // </button>
    document.getElementById('draftSubmitButton').innerHTML = `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    <span class="visually-hidden">Loading...</span>`;
    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;

    // get user's input
    let userInput = document.getElementById('draftUserinput').value;
    // check whether user input is empty
    if (userInput === '') {
        alert('Please enter your message');
        // end the handleUserInput function
        // enable the button and textArea
        document.getElementById('draftSubmitButton').innerHTML = 'Send';
        document.getElementById('draftSubmitButton').disabled = false;
        document.getElementById('draftUserinput').disabled = false;
        return;
    }
    console.log('userInput:', userInput);
    // update it as a child of draftChatBody

    // example of user's input
    // <div class="d-flex flex-row justify-content-end mb-4">
    //     <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;">
    //         <p class="small mb-0">User input appears here</p>
    //     </div>
    //     <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" alt="avatar 1"
    //         style="width: 45px; height: 100%;">
    // </div>
    document.getElementById('draftUserinput').value = ''; // clear the textArea
    await displayStringUser(userInput);
    const model = document.getElementById('draftModelSelect').value; // get the model name
    // send model, userInput to server, and get AI's response
    const AIOutput = "Test AI Output. Now it's getting longer and longer and longer and longer and longer and longer and longer and longer"; // AI's response (for now)

    // example of AI's response, following the example of AI's response
    // update it as a child of draftChatBody
    // <div class="d-flex flex-row justify-content-start mb-4">
    //     <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar 1"
    //         style="width: 45px; height: 100%;">
    //         <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
    //             <p class="small mb-0">AI's response appears here</p>
    //         </div>
    // </div>

    // send model, userInput, aiOutput to server to save it to the database
    console.log('model:', model);
    console.log('userInput:', userInput);
    console.log('aiOutput:', AIOutput);
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: model, userInput: userInput, aiOutput: AIOutput }),
    };
    try {
        const response = await fetch('/api/aiLog', reqOptions);
        const data = await response.json();
        console.log('data:', data);
    }
    catch (err) {
        alert('error sending message', err)
    }

    await displayStringAI(AIOutput); // display AI's response one character at a time

    // scroll to the bottom of the chat box
    // // enable the button and textArea
    // change the button back
    document.getElementById('draftSubmitButton').innerHTML = 'Send';
    document.getElementById('draftSubmitButton').disabled = false;
    document.getElementById('draftUserinput').disabled = false;
}


function displayGreetings(exampleQuestions) {
    
}

// display user's input in chat box
async function displayStringUser(str) {
    // <div class="d-flex flex-row justify-content-end mb-4">
    //     <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;">
    //         <p class="small mb-0">User input appears here</p>
    //     </div>
    //     <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" alt="avatar 1"
    //         style="width: 45px; height: 100%;">
    // </div>
    const draftChatBody = document.getElementById('draftChatBody');
    const userDiv = document.createElement('div');
    userDiv.className = 'd-flex flex-row justify-content-end mb-4';
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'p-3 me-3 border';
    userMessageDiv.style.borderRadius = '15px';
    userMessageDiv.style.backgroundColor = '#fbfbfb';
    userMessageDiv.style.maxWidth = '80%';
    const userMessageP = document.createElement('p');
    userMessageP.className = 'small mb-0';
    userMessageP.textContent = str;  // user's input
    // replace all the new line with <br>
    userMessageP.innerHTML = userMessageP.innerHTML.replace(/\n/g, '<br>');
    userMessageDiv.appendChild(userMessageP);
    userDiv.appendChild(userMessageDiv);
    const userAvatarImg = document.createElement('img');
    userAvatarImg.src = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp';
    userAvatarImg.alt = 'avatar 1';
    userAvatarImg.style.width = '45px';
    userAvatarImg.style.height = '100%';
    userDiv.appendChild(userAvatarImg);
    // update it as a child of draftChatBody
    draftChatBody.appendChild(userDiv);
    draftChatBody.scrollTop = draftChatBody.scrollHeight;

    return new Promise(resolve => {
        const delay = 0; // adjust delay as needed
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

// display AI's response one character at a time
async function displayStringAI(str) {
    console.log('displayStringAI', str);
    const draftChatBody = document.getElementById('draftChatBody');
    const AIDiv = document.createElement('div');
    AIDiv.className = 'd-flex flex-row justify-content-start mb-4';
    const AIAvatarImg = document.createElement('img');
    AIAvatarImg.src = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp';
    AIAvatarImg.alt = 'avatar 1';
    AIAvatarImg.style.width = '45px';
    AIAvatarImg.style.height = '100%';
    AIDiv.appendChild(AIAvatarImg);
    const AIMessageDiv = document.createElement('div');
    AIMessageDiv.className = 'p-3 ms-3';
    AIMessageDiv.style.borderRadius = '15px';
    AIMessageDiv.style.backgroundColor = 'rgba(57, 192, 237,.2)';
    AIMessageDiv.style.maxWidth = '80%';
    const AIMessageP = document.createElement('p');
    AIMessageP.className = 'small mb-0';
    // AIMessageP.textContent = str; // AI's response
    // display AI's response one character at a time
    let index = 0;
    for (let i = 0; i < str.length; i++) {
        setTimeout(() => {
            AIMessageP.textContent += str.charAt(i);
        }, i * 50);
    }
    // replace all the new line with <br>
    AIMessageP.innerHTML = AIMessageP.innerHTML.replace(/\n/g, '<br>');
    AIMessageDiv.appendChild(AIMessageP);
    AIDiv.appendChild(AIMessageDiv);
    // update it as a child of draftChatBody
    draftChatBody.appendChild(AIDiv);
    draftChatBody.scrollTop = draftChatBody.scrollHeight;

    return new Promise(resolve => {
        const delay = str.length * 50; // adjust delay as needed
        setTimeout(() => {
            resolve();
        }, delay);
    });
}


async function displayImgAI(img_src) {
    // <div class="d-flex flex-row justify-content-start mb-4">
    //     <img src="" alt="avatar 1"
    //         style="width: 45px; height: 100%;">
    //         <div class="ms-3" style="border-radius: 15px;">
    //             <div class="bg-image">
    //                 <img src="the path of the img we want to display"
    //                     style="border-radius: 15px;" alt="video">
    //                     <a href="#!">
    //                         <div class="mask"></div>
    //                     </a>
    //             </div>
    //         </div>
    // </div>
    const draftChatBody = document.getElementById('draftChatBody');
    const AIDiv = document.createElement('div');
    AIDiv.className = 'd-flex flex-row justify-content-start mb-4';
    const AIAvatarImg = document.createElement('img');
    AIAvatarImg.src = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp';
    AIAvatarImg.alt = 'avatar 1';
    AIAvatarImg.style.width = '45px';
    AIAvatarImg.style.height = '100%';
    AIDiv.appendChild(AIAvatarImg);
    const AIMessageDiv = document.createElement('div');
    AIMessageDiv.className = 'ms-3';
    AIMessageDiv.style.borderRadius = '15px';
    const AIMessageDiv2 = document.createElement('div');
    AIMessageDiv2.className = 'bg-image';
    const AIMessageImg = document.createElement('img');
    AIMessageImg.src = img_src;
    AIMessageImg.style.borderRadius = '15px';
    AIMessageImg.alt = 'video';
    const AIMessageA = document.createElement('a');
    AIMessageA.href = '#!';
    const AIMessageDiv3 = document.createElement('div');
    AIMessageDiv3.className = 'mask';
    AIMessageA.appendChild(AIMessageDiv3);
    AIMessageDiv2.appendChild(AIMessageImg);
    AIMessageDiv2.appendChild(AIMessageA);
    AIMessageDiv.appendChild(AIMessageDiv2);
    AIDiv.appendChild(AIMessageDiv);
    // scroll down if needed, and update it as a child of draftChatBody
    draftChatBody.appendChild(AIDiv);
    draftChatBody.scrollTop = draftChatBody.scrollHeight;
}

async function main() {
    console.log('draftMainPage.js loaded');
    // disable the button and textArea
    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;
    // display greetings
    // await displayStringAI('Hello and thank you for visiting our AI program. Please enter your question.');
    // display QR code
    // enable the button and textArea
    document.getElementById('draftSubmitButton').disabled = false;
    document.getElementById('draftUserinput').disabled = false;
    const sendButton = document.getElementById('draftSubmitButton');
    sendButton.addEventListener('click', handleUserInput);
}
