
document.addEventListener("DOMContentLoaded", main);

const model2img = {
    'model0': '/img/luhai.jpg',
    'model1': '/img/wenxin_logo.jpg',
    'model2': '/img/wenxin_logo.jpg',
    'model3': '/img/wenxin_logo.jpg',
    'model4': '/img/yayi_logo.jpg',
}

const model2Greetings = {
    'model1': '您好，我是文心一言的模型ERNIE Bot。我能够与人对话互动，回答问题，协助创作，高效便捷地帮助人们获取信息、知识和灵感。您可以问我: </br>',
    'model2': '您好，我是文心一言的模型ERNIE Bot Turbo。我能够与人对话互动，回答问题，协助创作，高效便捷地帮助人们获取信息、知识和灵感，且具有更快的响应速度。您可以问我: </br>',
    'model3': '您好，我是文心一言的模型BLOOMZ-7B。我是业内知名的大语言模型，由Hugging Face研发并开源，能够以46种语言和13种编程语言输出文本。您可以问我: </br>',
    'model4': '我是一个由中科闻歌算法团队训练的语言模型，中文名为雅意，英文名为YaYi。我的目标是帮助人类执行常见的自然语言处理任务，例如回答问题、提供建议、生成代码、聊天等。'
}

let messages = [];

async function handleUserInput(evt) {
    evt.preventDefault();

    let userInput = document.getElementById('draftUserinput').value;

    // if user's input is empty, which means only contains spaces, tabs, or newlines
    if (userInput.trim() === '') {
        // alert('Please enter your message');
        // end the handleUserInput function
        // enable the button and textArea
        // document.getElementById('draftSubmitButton').innerHTML = `<svg id="draftSendSvg" xmlns="http://www.w3.org/2000/svg"
        // style="width: 20px; height: 30px; color:#adb5bd" viewBox="0 0 16 16" fill="none" stroke-width="2"><path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path></svg>`;
        // document.getElementById('draftSubmitButton').disabled = false;
        // document.getElementById('draftUserinput').disabled = false;
        // emptify the textArea
        document.getElementById('draftUserinput').value = '';
        // set the rows of the textArea to 1
        document.getElementById('draftUserinput').rows = 1;
        // use placeholder to show the user that the input is empty
        // document.getElementById('draftUserinput').placeholder = '请输入问题';
        return;
    }

    // document.getElementById('draftSubmitButton').style.backgroundColor = 'transparent';
    // document.getElementById('draftSubmitButton').innerHTML = `<div class="spinner-grow" role="status">
    // <span class="sr-only">Loading...</span>
    // </div>`;

    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;

    document.getElementById('draftUserinput').value = ''; // clear the textArea
    document.getElementById('draftUserinput').rows = 1;


    await displayStringUser(userInput, '/');
    const model = await getMostRecentModel();
    // display spinner
    await displaySpinner(model);

    const AIOutput = await getAIResponse(userInput, model);
    // const AIOutput = AIOutputJson.answer;
    // const AIOutput = 'Test AI Output. Now it\'s getting longer and longer and longer and longer and longer and longer and longer and longer'; // AI's response (for now)
    // console.log('model:', model);
    // console.log('userInput:', userInput);
    // console.log('aiOutput:', AIOutput);
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: model, userInput: userInput, aiOutput: AIOutput }),
    };
    try {
        const response = await fetch('/api/aiLog', reqOptions);
        const data = await response.json();
    }
    catch (err) {
        // alert('error sending message', err)
        console.log('error sending message', err);
    }

    // remove spinner
    await removeSpinner();



    await displayStringAI(AIOutput, model);

    //     document.getElementById('draftSubmitButton').innerHTML = `<svg id="draftSendSvg" xmlns="http://www.w3.org/2000/svg"
    //     style="width: 20px; height: 30px; color: #adb5bd" viewBox="0 0 16 16" fill="none"
    //     stroke-width="2">
    //     <path
    //         d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
    //         fill="currentColor"></path>
    // </svg>`;
    document.getElementById('draftSubmitButton').disabled = false;
    document.getElementById('draftUserinput').disabled = false;
    document.getElementById('draftSubmitButton').style.backgroundColor = 'transparent';
    document.getElementById('draftSendSvg').style.color = '#adb5bd';
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
    li.classList.add('d-flex', 'justify-content-between', 'mb-4', 'mr-5', 'ml-5');
    const card = document.createElement('div');
    card.classList.add('card', 'w-100', 'mr-2', 'ml-5');
    // const cardHeader = document.createElement('div');
    // cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
    // const p = document.createElement('p');
    // p.classList.add('fw-bold', 'mb-0');
    // p.textContent = userName;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const p2 = document.createElement('p');
    p2.classList.add('mb-0');
    p2.innerHTML = str;
    // cardHeader.appendChild(p);
    cardBody.appendChild(p2);
    // card.appendChild(cardHeader);
    card.appendChild(cardBody);
    li.appendChild(card);
    const img = document.createElement('img');
    img.src = '/img/renwu.jpeg';
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'ms-3', 'shadow-1-strong');
    img.width = '60';
    li.appendChild(img);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;
}

async function getAIResponse(userInputQuestion, model) {
    // add to the first line of message array
    messages.push({
        "role": "user",
        "content": userInputQuestion
    });

    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages, model: model }),
    };

    try {
        // if model is model1, model2, model3, use fetch('/api/aiFetch', reqOptions);
        // else use fetch('/api/aiFetchYayi', reqOptions);
        if (model === 'model1' || model === 'model2' || model === 'model3') {
            const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const messagesJson = JSON.stringify(messages);
            // get random from 0 to 9, integer
            const randomInt = Math.floor(Math.random() * 10);
            console.log('randomInt:', randomInt);
            const response = await fetch('/api/aiFetch'+ randomInt + '/', reqOptions);
            const data = await response.json();
            messages.push({
                "role": "assistant",
                "content": data.answer
            });
            return data.answer;
        } else {
            const response = await fetch('/api/aiFetchYayi', reqOptions);
            const data = await response.json();
            // console.log('data:', data);
            messages.push({
                "role": "yayi",
                "content": data.answer
            });
            return data.answer;
        }
    }
    catch (err) {
        // alert('error sending message', err)
        console.log('error sending message', err);
    }
}

async function displaySpinner(model) {
    // <li class="mb-4 d-flex" id="tempSpinner">
    //     <img src="/img/Murasame.jpeg" alt="avatar"
    //         class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
    //         <div class="card ml-3">
    //             <div class="card-body">
    //                 <div class="spinner-grow" role="status">
    //                     <span class="sr-only">Loading...</span>
    //                 </div>
    //             </div>
    //         </div>
    // </li>
    const li = document.createElement('li');
    li.classList.add('mb-4', 'd-flex');
    li.id = 'tempSpinner';
    const img = document.createElement('img');
    if (model2img[model]) {
        img.src = model2img[model];
    } else {
        img.src = '/img/luhai.jpg';
    }
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    img.width = '60';
    li.appendChild(img);
    const card = document.createElement('div');
    card.classList.add('card', 'ml-3');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const spinner = document.createElement('div');
    spinner.classList.add('spinner-grow');
    spinner.role = 'status';
    const span = document.createElement('span');
    span.classList.add('sr-only');
    span.textContent = 'Loading...';
    spinner.appendChild(span);
    cardBody.appendChild(spinner);
    card.appendChild(cardBody);
    li.appendChild(card);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;
}

async function removeSpinner() {
    const spinner = document.getElementById('tempSpinner');
    spinner.remove();
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
    li.classList.add('d-flex', 'mb-4', 'mr-5', 'pr-5');
    const img = document.createElement('img');
    // check is modelName is in model2img
    const modelApplied = modelName
    if (model2img[modelApplied]) {
        img.src = model2img[modelApplied];
    } else {
        img.src = '/img/luhai.jpg';
    }
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    img.width = '60';
    const card = document.createElement('div');
    card.classList.add('card', 'ml-2', 'mr-5');
    // const cardHeader = document.createElement('div');
    // cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
    // const p = document.createElement('p');
    // p.classList.add('fw-bold', 'mb-0');
    // p.textContent = modelName;
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const p2 = document.createElement('p');
    p2.classList.add('mb-0');
    p2.innerHTML = str;
    // cardHeader.appendChild(p);
    cardBody.appendChild(p2);
    // card.appendChild(cardHeader);
    card.appendChild(cardBody);
    li.appendChild(img);
    li.appendChild(card);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;
}

async function displayGreetings(exampleQuestions, modelName) {
    // <li class="d-flex mb-4">
    //     <img src="/img/Murasame.jpeg" alt="avatar" //
    //         class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
    //         <div class="card">
    //             <div class="card-header d-flex justify-content-between p-3">
    //                 <p class="fw-bold mb-0">modelName appears here</p>
    //             </div>
    //             <div class="card-body">
    //                 <p class="mb-0">
    //                     str appears here
    //                 </p>
    //                 <a class="mb=0 primary d-block" href="example">question example 1</a>
    //                 <a class="mb=0 primary d-block" href="example">question example 2</a>
    //                 <a class="mb=0 primary d-block" href="example">question example 3</a>
    //             </div>
    //         </div>
    // </li>
    // 
    // remove all elements in the chat
    const chatBody = document.getElementById('draftChatBody');
    while (chatBody.firstChild) {
        chatBody.removeChild(chatBody.firstChild);
    }


    await displayStringAI("您好！欢迎光临2023中国国际智能产业博览会陆海国际新闻中心。您可以根据自己需求选择相应的人工智能模块体验。请您注意核查人工智能产生内容的真实性和合规性。陆海国际新闻中心和人工智能技术提供方不承担内容责任，不拥有相关内容的著作权。相关功能生产内容并发表，需要自行承担相关责任。您如果参与体验，即表示您已经知晓并同意上述要求。祝您体验愉快！", 'model0')

    const li = document.createElement('li');
    li.classList.add('d-flex', 'mb-4', 'mr-5', 'pr-5');
    const img = document.createElement('img');
    const modelApplied = await getMostRecentModel()
    if (model2img[modelApplied]) {
        img.src = model2img[modelApplied];
    } else {
        img.src = '/img/luhai.jpg';
    }
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    img.width = '60';

    const card = document.createElement('div');
    card.classList.add('card', 'ml-2', 'mr-5');
    // const cardHeader = document.createElement('div');
    // cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'p-3');
    // const p = document.createElement('p');
    // p.classList.add('fw-bold', 'mb-0');
    // p.textContent = 'AlphaZero';
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'ml-2');
    const p2 = document.createElement('p');
    p2.classList.add('mb-0');
    if (model2Greetings[modelName]) {
        p2.innerHTML = model2Greetings[modelName];
    } else {
        p2.innerHTML = 'Hello and thank you for visiting our AI program. Please enter your question. <br> You can ask me: <br>';
    }
    const a1 = document.createElement('a');
    a1.classList.add('mb=0', 'primary', 'd-block', 'exampleQuestion', 'mt-2');
    a1.href = 'example';
    a1.textContent = exampleQuestions[0].question;
    const a2 = document.createElement('a');
    a2.classList.add('mb=0', 'primary', 'd-block', 'exampleQuestion', 'mt-2');
    a2.href = 'example';
    a2.textContent = exampleQuestions[1].question;
    const a3 = document.createElement('a');
    a3.classList.add('mb=0', 'primary', 'd-block', 'exampleQuestion', 'mt-2');
    a3.href = 'example';
    a3.textContent = exampleQuestions[2].question;
    // cardHeader.appendChild(p);
    cardBody.appendChild(p2);
    cardBody.appendChild(a1);
    cardBody.appendChild(a2);
    cardBody.appendChild(a3);
    // card.appendChild(cardHeader);
    card.appendChild(cardBody);
    li.appendChild(img);
    li.appendChild(card);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;

    const exampleQuestion = document.getElementsByClassName('exampleQuestion');
    for (let i = 0; i < exampleQuestion.length; i++) {
        exampleQuestion[i].addEventListener('click', function (event) {
            event.preventDefault();
            draftUserinput.value = this.innerHTML;
            // click the send button
            draftSubmitButton.click();
        });
    }
}

async function getExampleQuestions(modelName) {
    const model = modelName || getMostRecentModel();
    // console.log('getExampleQuestions');
    // console.log('model:', model);
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: model }),
    };
    try {
        const response = await fetch('/api/getExampleQuestion', reqOptions);
        const data = await response.json();
        const question = data[0];
        // console.log('data:', data);
        if (question) {
            return data;
        } else {
            return [{ question: 'What is your name?' }, { question: 'How are you?' }, { question: 'What is your favorite color?' }]
        }
    }
    catch (err) {
        // alert('error sending message', err)
        console.log('error sending message', err);
    }
}

async function getMostRecentModel() {
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
    if (mostRecentModel === null) {
        console.log('no model selected, using 综合模型');
        return '综合模型';
    } else {
        return mostRecentModel;
    }
}

async function pressureTest(times) {
    const userInput = '你好';
    const model = 'model1';
    let t = 1;
    let fail = 0;
    // run the following function 100 times per second, until t === times
    setInterval(async function () {
        if (t < times) {
            console.log('t:', t);
            const AIOutput = await getAIResponse(userInput, model);
            messages = [];
            if (AIOutput === '服务忙，请稍后再试') {
                fail++;
            }
            await displayStringAI(AIOutput, '/');

            t++;
        }else{
            // stop loop
            clearInterval(this);
            console.log('fail:', fail);

        }
    }, 1000);
    // run the following function 100 times per second, until t === times
    // while (t < times) {
    //     console.log('t:', t);
    //     const AIOutput = await getAIResponse(userInput, model);
    //     messages = [];
    //     if (AIOutput === '服务忙，请稍后再试') {
    //         fail++;
    //     }
    //     await displayStringAI(AIOutput, '/');

    //     t++;
    // }
    // console.log('fail:', fail);

}

async function main() {
    const modelSelectElements = document.querySelectorAll('.modelSelect');
    const modelName = await getMostRecentModel();
    for (let i = 0; i < modelSelectElements.length; i++) {
        const modelSelectElement = modelSelectElements[i];
        modelSelectElement.addEventListener('click', async function (event) {
            event.preventDefault();
            const greetings = await getExampleQuestions(this.getAttribute('model'));
            displayGreetings(greetings, await getMostRecentModel());
        });
    }

    let selectedElement = null;

    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;

    // console.log('getExampleQuestions');
    const exampleQuestions = await getExampleQuestions();
    // console.log('exampleQuestion:', exampleQuestions);

    // await displayGreetings(exampleQuestions, modelName);

    for (let i = 0; i < modelSelectElements.length; i++) {
        const modelSelectElement = modelSelectElements[i];
        modelSelectElement.addEventListener('click', function () {
            if (selectedElement !== null) {
                selectedElement.style.backgroundColor = '';
            }
            this.style.backgroundColor = '#eee';
            selectedElement = this;
            // remove className clicked from all modelSelectElements
            for (let j = 0; j < modelSelectElements.length; j++) {
                modelSelectElements[j].classList.remove('clicked');
            }
            // add className clicked to the selected modelSelectElement
            this.classList.add('clicked');
            // emptify messages array
            messages = [];
        });
    }

    // click the first modelSelectElement
    modelSelectElements[0].click();

    // await displayStringUser('Hello and thank you for visiting our AI program. Please enter your question.', 'AlphaZero');


    const sendButton = document.getElementById('draftSubmitButton');
    sendButton.addEventListener('click', handleUserInput);

    const exampleQuestion = document.getElementsByClassName('exampleQuestion');
    for (let i = 0; i < exampleQuestion.length; i++) {
        exampleQuestion[i].addEventListener('click', function (event) {
            event.preventDefault();
            draftUserinput.value = this.innerHTML;
            // click the send button
            draftSubmitButton.click();
        });
    }

    draftUserinput.addEventListener('input', function (event) {
        if (draftUserinput.value.length > 0) {
            draftSubmitButton.style.backgroundColor = 'rgb(25, 195, 125)';
            draftSendSvg.style.color = 'white';
            // console.log(draftSendSvg);
        } else {
            draftSubmitButton.style.backgroundColor = 'transparent';
            draftSendSvg.style.color = 'rgb(173, 181, 189)';
            // console.log(draftSendSvg);
        }
    });

    document.getElementById('draftSubmitButton').disabled = false;
    document.getElementById('draftUserinput').disabled = false;

    console.log('pressureTest');
    pressureTest(100);
}
