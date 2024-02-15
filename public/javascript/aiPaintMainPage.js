// import { get } from "request";
// import { model } from "mongoose";

document.addEventListener("DOMContentLoaded", main);

// 这里设置模型的头像
const model2img = {
    'model0': '/img/luhai.jpg',
    '综合模型': '/img/wenxin_logo.jpg',
    '探索无限': '/img/wenxin_logo.jpg',
    '古风': '/img/wenxin_logo.jpg',
    '二次元': '/img/wenxin_logo.jpg',
    '写实风格': '/img/wenxin_logo.jpg',
    '浮世绘': '/img/wenxin_logo.jpg',
    'low poly': '/img/wenxin_logo.jpg',
    '未来主义': '/img/wenxin_logo.jpg',
    '像素风格': '/img/wenxin_logo.jpg',
    '概念艺术': '/img/wenxin_logo.jpg',
    '赛博朋克': '/img/wenxin_logo.jpg',
    '洛丽塔风格': '/img/wenxin_logo.jpg',
    '巴洛克风格': '/img/wenxin_logo.jpg',
    '超现实主义': '/img/wenxin_logo.jpg',
    '水彩画': '/img/wenxin_logo.jpg',
    '蒸汽波艺术': '/img/wenxin_logo.jpg',
    '油画': '/img/wenxin_logo.jpg',
    '卡通画': '/img/wenxin_logo.jpg',
}

// 这里设置模型的问好
const model2Greetings = {
    '综合模型': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '探索无限': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '古风': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '二次元': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '写实风格': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '浮世绘': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    'low poly': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '未来主义': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '像素风格': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '概念艺术': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '赛博朋克': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '洛丽塔风格': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '巴洛克风格': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '超现实主义': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '水彩画': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '蒸汽波艺术': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '油画': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
    '卡通画': '你好！欢迎使用百度AI作画模型。我是你的艺术创作助手，可以帮助你将脑海中的创意转化为美丽的画作。请问有什么需要我帮忙的吗？',
}

async function handleUserInput(evt) {
    evt.preventDefault();

    let userInput = document.getElementById('draftUserinput').value;

    // if user's input is empty, which means only contains spaces, tabs, or newlines
    if (userInput.trim() === '') {
        document.getElementById('draftUserinput').value = '';
        // set the rows of the textArea to 1
        document.getElementById('draftUserinput').rows = 1;
        // use placeholder to show the user that the input is empty
        document.getElementById('draftUserinput').placeholder = '请输入问题';
        return;
    }

    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;
    // disable element with className examplePrompts
    const examplePrompts = document.querySelectorAll('.examplePrompts');
    examplePrompts.forEach((element) => {
        element.disabled = true;
    });

    document.getElementById('draftUserinput').value = ''; // clear the textArea
    document.getElementById('draftUserinput').rows = 1;


    await displayStringUser(userInput, 'Murasame');
    const model = await getMostRecentModel();
    // display spinner
    await displaySpinner();

    const AIOutput = await getAIResponse(userInput, model);
    // const AIOutput = AIOutputJson.answer;
    // const AIOutput = 'Test AI Output. Now it\'s getting longer and longer and longer and longer and longer and longer and longer and longer'; // AI's response (for now)


    // remove spinner
    await removeSpinner();
    try {
        if (AIOutput === 'undefined') {
            displayStringAI('服务忙，请稍等一下哟', 'Murasame');
        } else {
            if (AIOutput['error']) {
                displayStringAI('服务忙，请稍等一下哟', 'Murasame');
            }
            else {
                imageAI = AIOutput['image'];
            }
        }
    } catch (error) {
        console.log(error);
        displayStringAI('服务忙，请稍等一下哟', 'Murasame');
    }

    await displayImageAI(imageAI, model);

    //     document.getElementById('draftSubmitButton').innerHTML = `<svg id="draftSendSvg" xmlns="http://www.w3.org/2000/svg"
    //     style="width: 20px; height: 30px; color: #adb5bd" viewBox="0 0 16 16" fill="none"
    //     stroke-width="2">
    //     <path
    //         d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
    //         fill="currentColor"></path>
    // </svg>`;
    document.getElementById('draftSubmitButton').disabled = false;
    document.getElementById('draftUserinput').disabled = false;
    examplePrompts.forEach((element) => {
        element.disabled = false;
    });
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
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const p2 = document.createElement('p');
    p2.classList.add('mb-0');
    p2.innerHTML = str;
    cardBody.appendChild(p2);
    card.appendChild(cardBody);
    li.appendChild(card);
    const img = document.createElement('img');
    img.src = '/img/renwu.jpeg';
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'ms-3', 'shadow-1-strong');
    img.width = '55';
    li.appendChild(img);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;
}

async function getAIResponse(userInputQuestion, model) {
    // console.log('getAIResponse called');
    // add to the first line of message array
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "text": userInputQuestion,
            "style": model,
            "type": "basic",
            "resolution": "1024*1024"
        }),
    };

    try {
        const response = await fetch('/api/aiPaint', reqOptions);
        const data = await response.json();

        // return {data.image, data.error};
        if (!data.error) {
            data.error = false;
        }
        console.log(data);
        return data;
    }

    catch (err) {
        alert('error sending message', err)
    }
}

async function displaySpinner(event) {
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
    img.src = '/img/wenxin_logo.jpg';
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    img.width = '55';
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
        // console.log(modelApplied);
        // console.log('model2img[modelApplied]', model2img[modelApplied]);
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

async function displayImageAI(image, modelName) {
    // if modelName is not provided, use the default model name: 'AlphaZero'
    if (!modelName) {
        modelName = 'AlphaZero';
    }
    // <li class="mb-4 d-flex" id="tempSpinner">
    //     <img src="/img/Murasame.jpeg" alt="avatar"
    //         class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="50">
    //         <div class="card ml-3">
    //             <div class="card-body">
    //                 <div class="bg-image">
    //                     <a href="https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex" target="_blank">
    //                         <img src="https://wenxin.baidu.com/younger/file/ERNIE-ViLG/9eb039cab103d587ed92f52477e2f4a0ex" style="border-radius: 15px; max-width: 500px;" alt="video">
    //                     </a>
    //                     <a href="#!">
    //                         <div class="mask"></div>
    //                     </a>
    //                 </div>
    //             </div>
    //         </div>
    // </li>
    const li = document.createElement('li');
    li.classList.add('mb-4', 'd-flex');
    const img = document.createElement('img');
    // check is modelName is in model2img
    const modelApplied = await getMostRecentModel()
    if (model2img[modelApplied]) {
        img.src = model2img[modelApplied];
    } else {
        img.src = '/img/Murasame.jpeg';
    }
    img.alt = 'avatar';
    img.classList.add('rounded-circle', 'd-flex', 'align-self-start', 'me-3', 'shadow-1-strong');
    img.width = '55';
    const card = document.createElement('div');
    card.classList.add('card', 'ml-3');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const div = document.createElement('div');
    div.classList.add('bg-image');
    const a = document.createElement('a');
    a.href = image;
    a.target = '_blank';
    const img2 = document.createElement('img');
    img2.src = image;
    img2.style.borderRadius = '15px';
    img2.style.maxWidth = '500px';
    img2.alt = 'image';
    const a2 = document.createElement('a');
    const div2 = document.createElement('div');
    div2.classList.add('mask');
    a2.appendChild(div2);
    a.appendChild(img2);
    div.appendChild(a);
    div.appendChild(a2);
    cardBody.appendChild(div);
    card.appendChild(cardBody);
    li.appendChild(img);
    li.appendChild(card);

    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;
}



async function displayGreetings(prompts, modelName) {
    // console.log('displayGreetings', prompts, modelName);
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
    //             </div>
    //         </div>
    // </li>
    // remove all elements in the chat
    const chatBody = document.getElementById('draftChatBody');
    while (chatBody.firstChild) {
        chatBody.removeChild(chatBody.firstChild);
    }

    // console.log('displayGreetings');
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
    img.width = '55';

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
    // cardHeader.appendChild(p);
    cardBody.appendChild(p2);
    // card.appendChild(cardHeader);
    card.appendChild(cardBody);
    li.appendChild(img);
    li.appendChild(card);
    document.getElementById('draftChatBody').appendChild(li);
    // scroll to the bottom of the chat
    document.getElementById('draftChatBody').scrollTop = document.getElementById('draftChatBody').scrollHeight;

    const examplePrompts = document.getElementsByClassName('examplePrompts');
    for (let i = 0; i < examplePrompts.length; i++) {
        examplePrompts[i].innerHTML = prompts[i].title;
        examplePrompts[i].setAttribute('data-content', prompts[i].prompts);

        examplePrompts[i].addEventListener('click', function (event) {
            event.preventDefault();
            //make the draftUserInput equals to the attribute data-content
            draftUserinput.value = this.getAttribute('data-content');
            // click the send button
            // draftSubmitButton.click();
            document.getElementById('draftSubmitButton').style.backgroundColor = 'rgb(25, 195, 125)';
            document.getElementById('draftSendSvg').style.color = 'white';

            let userinputHeight = document.getElementById('draftUserinput').scrollHeight;
            let textAreaHeight = document.getElementById('draftUserinput').clientHeight;

            while (userinputHeight > textAreaHeight) {
                if (document.getElementById('draftUserinput').rows <= 5) {
                    document.getElementById('draftUserinput').rows += 1;
                    textAreaHeight = document.getElementById('draftUserinput').clientHeight;
                } else {
                    break;
                }
            }
            while (userinputHeight < textAreaHeight) {
                if (document.getElementById('draftUserinput').rows > 1) {
                    document.getElementById('draftUserinput').rows -= 1;
                    textAreaHeight = document.getElementById('draftUserinput').clientHeight;
                } else {
                    break;
                }
            }
        });
    }
}

async function getExamplePrompts(modelName) {
    const model = modelName || getMostRecentModel();
    // console.log('getExampleQuestions');
    // console.log('model:', model);
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
    };
    try {
        const response = await fetch('/api/getAIPaintPrompts', reqOptions);
        const data = await response.json();
        return data;
    }
    catch (err) {
        alert('error sending message', err)
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
        console.log('no model selected, using model1');
        return '综合模型';
    } else {
        return mostRecentModel;
    }
}

async function main() {
    const modelSelectElements = document.querySelectorAll('.modelSelect');
    const modelName = await getMostRecentModel();
    for (let i = 0; i < modelSelectElements.length; i++) {
        const modelSelectElement = modelSelectElements[i];
        modelSelectElement.addEventListener('click', async function (event) {
            event.preventDefault();
            const prompts = await getExamplePrompts(this.getAttribute('model'));
            displayGreetings(prompts, await getMostRecentModel());
        });
    }

    let selectedElement = null;

    document.getElementById('draftSubmitButton').disabled = true;
    document.getElementById('draftUserinput').disabled = true;

    // console.log('getExampleQuestions');
    // const exampleQuestions = await getExampleQuestions();
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
        });
    }

    // click the first modelSelectElement
    modelSelectElements[0].click();

    // await displayStringUser('Hello and thank you for visiting our AI program. Please enter your question.', 'AlphaZero');


    const sendButton = document.getElementById('draftSubmitButton');
    sendButton.addEventListener('click', handleUserInput);

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
}
