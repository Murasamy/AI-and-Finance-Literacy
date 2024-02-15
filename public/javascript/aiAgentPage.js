document.addEventListener("DOMContentLoaded", main);

// get 20 latest AI logs each time click the button
async function GetLatest20(evt) {
    const response = await fetch('/api/aiLog');
    const data = await response.json();
    console.log(data);
    // <table class="table table-striped">
    //         <colgroup>
    //             <col style="width: 10%">
    //             <col style="width: 10%">
    //             <col style="width: 40%">
    //             <col style="width: 40%">
    //         </colgroup>
    //         <thead>
    //             <tr>
    //                 <th>Time</th>
    //                 <th>Model</th>
    //                 <th>Questions</th>
    //                 <th>Answers</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {{#each aiPaintPrompts}}
    //             <tr>
    //                 <td>{{this.time}}</td>
    //                 <td>{{this.modelName}}</td>
    //                 <td>{{this.userInput}}</td>
    //                 <td>{{aiOutput}}</td>
    //             </tr>
    //             {{/each}}
    //         </tbody>
    //     </table>
    const table = document.getElementById("aiLogTable");
    table.innerHTML = "";
    const colgroup = document.createElement("colgroup");
    const col1 = document.createElement("col");
    col1.style.width = "10%";
    const col2 = document.createElement("col");
    col2.style.width = "10%";
    const col3 = document.createElement("col");
    col3.style.width = "40%";
    const col4 = document.createElement("col");
    col4.style.width = "40%";
    colgroup.appendChild(col1);
    colgroup.appendChild(col2);
    colgroup.appendChild(col3);
    colgroup.appendChild(col4);
    table.appendChild(colgroup);
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.innerText = "Time";
    const th2 = document.createElement("th");
    th2.innerText = "Model";
    const th3 = document.createElement("th");
    th3.innerText = "Questions";
    const th4 = document.createElement("th");
    th4.innerText = "Answers";
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (let i = 0; i < data.length; i++) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = data[i].time;
        const td2 = document.createElement("td");
        td2.innerText = data[i].modelName;
        const td3 = document.createElement("td");
        td3.innerText = data[i].userInput;
        const td4 = document.createElement("td");
        td4.innerText = data[i].aiOutput;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}

async function main() {
    console.log("aiAgentPage.js loaded");
    GetLatest20();
}

