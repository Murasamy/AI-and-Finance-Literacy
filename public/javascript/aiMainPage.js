document.addEventListener("DOMContentLoaded", main);

async function handleUserInput(evt) {
    evt.preventDefault();

    document.getElementById('draftSubmitButton').innerHTML = `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    <span class="visually-hidden">Loading...</span>`;
    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;

    let userInput = document.getElementById('draftUserinput').value;

    if (userInput === '') {
        alert('Please enter your message');
        // end the handleUserInput function
        // enable the button and textArea
        document.getElementById('draftSubmitButton').innerHTML = 'Send';
        document.getElementById('draftSubmitButton').disabled = false;
        document.getElementById('draftUserinput').disabled = false;
        return;
    }

    document.getElementById('draftUserinput').value = ''; // clear the textArea
    // get user's nickname in the session
    
    await displayStringUser(userInput, 'Murasame');
    const model = 'AiChat'

    const AIOutput = "Test AI Output. Now it's getting longer and longer and longer and longer and longer and longer and longer and longer"; // AI's response (for now)

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

    await displayStringAI(AIOutput, 'AlphaZero');

    document.getElementById('draftSubmitButton').innerHTML = 'Send';
    document.getElementById('draftSubmitButton').disabled = false;
    document.getElementById('draftUserinput').disabled = false;
}

async function displayStringUser(str, userName) {
    // <li class="d-flex justify-content-between mb-4">
    //     <div class="card w-100">
    //         <div class="card-header d-flex justify-content-between p-3">
    //             <p class="fw-bold mb-0">userName appears here</p>
    //         </div>
    //         <div class="card-body">
    //             <p class="mb-0">
    //                 str appears here
    //             </p>
    //         </div>
    //     </div>
    //     <img src="/img/Murasame.jpeg" alt="avatar"
    //         class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60">
    // </li>
    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'mb-4');
    const card = document.createElement('div');
    card.classList.add('card', 'w-100');
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
    const p = document.createElement('p');
    p.classList.add('fw-bold', 'mb-0');
    p.textContent = userName;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const p2 = document.createElement('p');
    p2.classList.add('mb-0');
    p2.textContent = str;
    cardHeader.appendChild(p);
    cardBody.appendChild(p2);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    li.appendChild(card);
    const img = document.createElement('img');
    img.src = '/img/Murasame.jpeg';
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'ms-3', 'shadow-1-strong');
    img.width = '60';
    li.appendChild(img);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;
}

async function displayStringAI(str, modelName) {
    // if modelName is not provided, use the default model name: 'AlphaZero'
    if (!modelName) {
        modelName = 'AlphaZero';
    }
    // <li class="d-flex justify-content-between mb-4">
    //     <img src="/img/Murasame.jpeg" alt="avatar"
    //         class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
    //         <div class="card">
    //             <div class="card-header d-flex justify-content-between p-3">
    //                 <p class="fw-bold mb-0">modelName appears here</p>
    //             </div>
    //             <div class="card-body">
    //                 <p class="mb-0">
    //                     str appears here
    //                 </p>
    //             </div>
    //         </div>
    // </li>
    const li = document.createElement('li');
    li.classList.add('d-flex', 'mb-4');
    const img = document.createElement('img');
    img.src = '/img/Murasame.jpeg';
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    img.width = '60';
    const card = document.createElement('div');
    card.classList.add('card');
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
    const p = document.createElement('p');
    p.classList.add('fw-bold', 'mb-0');
    p.textContent = modelName;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const p2 = document.createElement('p');
    p2.classList.add('mb-0');
    p2.textContent = str;
    cardHeader.appendChild(p);
    cardBody.appendChild(p2);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    li.appendChild(img);
    li.appendChild(card);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;
    console.log('AiChat');
}

function getMostRecentModel() {
    let mostRecentModel = null;
    const modelSelectElements = document.querySelectorAll('.modelSelect');
    for (let i = 0; i < modelSelectElements.length; i++) {
        const modelSelectElement = modelSelectElements[i];
        if (modelSelectElement.classList.contains('clicked')) {
            const model = modelSelectElement.getAttribute('model');
            if (mostRecentModel === null || model > mostRecentModel) {
                mostRecentModel = model;
            }
        }
    }
    console.log('mostRecentModel:', mostRecentModel);
    if (mostRecentModel === null) {
        return 'model1';
    } else {
        return mostRecentModel;
    }
}

async function main() {
    console.log('draftMainPage.js loaded');
    const modelSelectElements = document.querySelectorAll('.modelSelect');
    let selectedElement = null;

    for (let i = 0; i < modelSelectElements.length; i++) {
        const modelSelectElement = modelSelectElements[i];
        modelSelectElement.addEventListener('click', function () {
            if (selectedElement !== null) {
                selectedElement.style.backgroundColor = '';
            }
            this.style.backgroundColor = '#eee';
            selectedElement = this;
        });
    }

    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;
    await displayStringAI('Hello and thank you for visiting our AI program. Please enter your question.', 'AlphaZero');
    // await displayStringUser('Hello and thank you for visiting our AI program. Please enter your question.', 'AlphaZero');

    document.getElementById('draftSubmitButton').disabled = false;
    document.getElementById('draftUserinput').disabled = false;
    const sendButton = document.getElementById('draftSubmitButton');
    sendButton.addEventListener('click', handleUserInput);
}