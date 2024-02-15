document.addEventListener("DOMContentLoaded", main);

async function handleSend(evt) {
    evt.preventDefault();
    // disable the button and textarea, change the button text to "Sending..."]
    document.getElementById('aiPaintSubmitButton').innerHTML = `
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    <span class="visually-hidden">Loading...</span>`; // change the button text to "Loading..."
    document.getElementById('aiPaintSubmitButton').disabled = true;
    document.getElementById('aiPaintUserPrompt').disabled = true;
    // get the model selected and user's input prompt
    const model = document.getElementById('aiPaintModelSelect').value;
    const userInput = document.getElementById('aiPaintUserPrompt').value;
    document.getElementById('aiPaintUserPrompt').value = ''
    
    console.log('model:', model);
    console.log('userInput:', userInput);
    // send the model and user's input prompt to the server, and get the AI's output
    const aiOutput = await getAIPicture(userInput);
    // display the AI's output
    document.getElementById('questionMarkSvg').style.display = 'none';
    document.getElementById('aiPaintDisplay').src = aiOutput;
    document.getElementById('aiPaintDisplay').style.display = 'block';
    // display user's prompt
    document.getElementById('aiPaintUserPromptDisplay').textContent = userInput;
    // enable the button and textarea, change the button text to "Send"
    document.getElementById('aiPaintSubmitButton').innerHTML = '发送';
    document.getElementById('aiPaintSubmitButton').disabled = false;
    document.getElementById('aiPaintUserPrompt').disabled = false;
}

// intake the user's input prompt, and return the AI's output
async function getAIPicture(model, prompts) {
    const AIOutput = '/img/Murasame.jpeg'; // test only
    return AIOutput;
    //     return new Promise((resolve, reject) => {
    //         resolve(AIOutput);
    //     }); 
}

async function aiPaintEmplify(evt) {
    evt.preventDefault();
    // delete all the prompts in the textArea
    document.getElementById('aiPaintUserPrompt').value = '';
    // get the prompt from the button
}

async function getRandomPrompt(evt) {
    console.log('getRandomPrompt');
    evt.preventDefault();
    // use api: "api/aiPaintPrompts" to fetch 27 random prompts
    const prompts = await fetch('api/aiPaintPrompts');
    const promptsJson = await prompts.json();
    console.log('promptsJson:', promptsJson);
    // document.getElementById('PromptBtn1').textContent = promptsJson[0].title;
    // document.getElementById('PromptBtn1').setAttribute('data-content', promptsJson[0].prompts);
    // document.getElementById('PromptBtn2').textContent = promptsJson[1].title;
    // document.getElementById('PromptBtn2').setAttribute('data-content', promptsJson[1].prompts);
    // document.getElementById('PromptBtn3').textContent = promptsJson[2].title;
    // document.getElementById('PromptBtn3').setAttribute('data-content', promptsJson[2].prompts);
    // document.getElementById('PromptBtn4').textContent = promptsJson[3].title;
    // document.getElementById('PromptBtn4').setAttribute('data-content', promptsJson[3].prompts);
    // document.getElementById('PromptBtn5').textContent = promptsJson[4].title;
    // document.getElementById('PromptBtn5').setAttribute('data-content', promptsJson[4].prompts);
    // document.getElementById('PromptBtn6').textContent = promptsJson[5].title;
    // document.getElementById('PromptBtn6').setAttribute('data-content', promptsJson[5].prompts);
    // there are 27 prompts received, distribute them to 27 cards
    for (let i = 0; i < promptsJson.length; i++) {
        const cardId = `PromptBtn${i + 1}`;
        document.getElementById(cardId).textContent = promptsJson[i].title;
        document.getElementById(cardId).setAttribute('data-content', promptsJson[i].prompts);
    }
}


async function main() {
    console.log('aiPaintMainPage.js loaded');
    document.getElementById('aiPaintSubmitButton').addEventListener('click', handleSend);
    const submitButton = document.getElementById('aiPaintSubmitButton');
    const userPrompt = document.getElementById('aiPaintUserPrompt');
    const copyButtons = document.querySelectorAll('.copy-to-clipboard');

    copyButtons.forEach(button => {
        button.addEventListener('click', (evt) => {
            //  <button class="btn secondary copy-to-clicpboard" data-text="card5Prompt" relate="card5Prompt">copy</button>
            // get the relate id
            const text = button.getAttribute('data-content');
            console.log('text:', text);
            // use relate id to get the text content in the p with id = relateId
            // const text = document.getElementById(relateId).textContent;
            userPrompt.value = text;
        });
    });

    const randomPromptButton = document.getElementById('getRandomPromptsButton');
    randomPromptButton.addEventListener('click', getRandomPrompt);
    // when entering the page, get six random prompts by clicking the button
    randomPromptButton.click();
    const emptifyButton = document.getElementById('aiPaintEmplify');
    emptifyButton.addEventListener('click', aiPaintEmplify);
}