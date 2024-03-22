document.addEventListener('DOMContentLoaded', main);

async function generateToken() {
    console.log('generateToken');
    event.preventDefault();

    // const username = document.getElementById('username').value;
    // if (username === ''), send alert
    const username = document.getElementById('username').value;
    const userType = document.getElementById('userType').value;
    const testCount = document.getElementById('testCount').value;
    if (username === '') {
        alert('Please enter a username');
        return;
    }

    const response = await fetch('/api/addAccessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            userType,
            testCount
        })
    });

    const data = await response.json();
    const {accessToken, message} = data;
    console.log(accessToken, message);
}

async function handleDelete(event) {
    event.preventDefault();
    const userId = event.target.value;

    const response = await fetch("/api/deleteUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
        }),
    });
}

function main() {
    document.getElementById('addUserPhoneBtn').addEventListener('click', generateToken);
    const deleteBtns = document.getElementsByClassName('deleteBtn');
    for (const btn of deleteBtns) {
        btn.addEventListener('click', handleDelete);
        console.log('deleteBtns', btn);
    }
}


    
