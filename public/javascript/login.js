document.addEventListener("DOMContentLoaded", main);

async function sendVerificationCode(event) {
    event.preventDefault();

    const phoneNumber = document.getElementById("phoneNumber").value;

    const warningMsg = document.getElementById("warningMsg");

    if (!phoneNumber) {
        warningMsg.innerText = "请输入手机号码";
        // remove the class 'invisible'
        warningMsg.classList.remove("invisible");
        warningMsg.style.display = "block";
        return;
    } else {
        // if the phone number is not empty, check the format of the phone number
        const reg = /^1[3456789]\d{9}$/;
        // length shoule be 11
        if (phoneNumber.length !== 11) {
            warningMsg.innerText = "手机号码格式错误";
            // remove the class 'invisible'
            warningMsg.classList.remove("invisible");
            warningMsg.style.display = "block";
            return;
        }
        // check the format of the phone number
        if (!reg.test(phoneNumber)) {
            warningMsg.innerText = "手机号码格式错误";
            // remove the class 'invisible'
            warningMsg.classList.remove("invisible");
            warningMsg.style.display = "block";
            return;
        }

        warningMsg.classList.add("invisible");
        warningMsg.style.display = "none";
    }

    // invalid the button
    // const sendVerificationBtn = document.getElementById("sendVerificationCode");
    // sendVerificationBtn.disabled = true;
    // phoneNumber.disabled = true;
    // // change the innerText of the button, as countdown 60s
    // sendVerificationBtn.innerText = "60秒后可重新发送";

    // // countdown 60s
    // let count = 60;
    // const timer = setInterval(() => {
    //     count--;
    //     sendVerificationBtn.innerText = count + "秒后可重新发送";
    //     if (count === 0) {
    //         clearInterval(timer);
    //         sendVerificationBtn.innerText = "发送验证码";
    //         sendVerificationBtn.disabled = false;
    //     }
    // }, 1000);

    // send the request to the server
    // console.log("phone:", phoneNumber);
    const requetOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber })
    };

    try {
        const response = await fetch("/postPhoneNumber", requetOptions);
        const data = await response.json();
        // console.log("data:", data);
        if (data.success) {
            // console.log("data:", data);
            // invalid the button
            const sendVerificationBtn = document.getElementById("sendVerificationCode");
            sendVerificationBtn.disabled = true;
            phoneNumber.disabled = true;
            // change the innerText of the button, as countdown 60s
            sendVerificationBtn.innerText = "60秒后可重新发送";

            // countdown 60s
            let count = 60;
            const timer = setInterval(() => {
                count--;
                sendVerificationBtn.innerText = count + "秒后可重新发送";
                if (count === 0) {
                    clearInterval(timer);
                    sendVerificationBtn.innerText = "发送验证码";
                    sendVerificationBtn.disabled = false;
                }
            }, 1000);

        } else {
            warningMsg.innerText = "手机号码未注册";
            // remove the class 'invisible'
            warningMsg.classList.remove("invisible");
            warningMsg.style.display = "block";

            const QRCodePopoverBtn = document.getElementById("displayQRCode");
            console.log(QRCodePopoverBtn)
            // click the QRCodePopoverBtn
            QRCodePopoverBtn.click();
        }
    }
    catch (err) {
        console.log("err:", err);
    }
}

// when user click '发送验证码', record the phone number in case user change the phone number
// the recorded phone number will change only when user click '发送验证码' again


async function checkVerificationCode(event) {
    event.preventDefault();
    const verificationCode = document.getElementById("verificationCode").value;
    const warningMsg = document.getElementById("warningMsg");
    const phoneNumber = document.getElementById("phoneNumber").value;

    if (!verificationCode) {
        if (!phoneNumber) {
            warningMsg.innerText = "请输入手机号码";
            // remove the class 'invisible'
            warningMsg.classList.remove("invisible");
            warningMsg.style.display = "block";
            return;
        } else {
            warningMsg.innerText = "请输入验证码";
            // remove the class 'invisible'
            warningMsg.classList.remove("invisible");
            warningMsg.style.display = "block";
        }
    } else {
        warningMsg.classList.add("invisible");
    }

    // send the request to the server
    // console.log("verificationCode:", verificationCode);
    const requetOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send phoneNumber and verificationCode to the server
        body: JSON.stringify({ phoneNumber, verificationCode })
    };

    let data = null;

    try {
        const response = await fetch("/checkVerificationCode", requetOptions);
        data = await response.json();
        // console.log("data:", data);
    } catch (err) {
        console.log("err:", err);
    }

    // console.log("data:", data);

    // if the verification code is correct, redirect to the main page
    if (data.success) {
        window.location.href = "/aiMainPageModel1";
    } else {
        warningMsg.innerText = "验证码错误";
        // remove the class 'invisible'
        warningMsg.classList.remove("invisible");
        warningMsg.style.display = "block";
    }

}

function main() {
    // get the button
    const sendVerificationBtn = document.getElementById("sendVerificationCode");
    // add event listener
    sendVerificationBtn.addEventListener("click", sendVerificationCode);

    const checkVerificationBtn = document.getElementById("checkVerificationCode");
    checkVerificationBtn.addEventListener("click", checkVerificationCode);
}


