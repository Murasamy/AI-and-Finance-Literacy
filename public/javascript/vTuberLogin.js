document.addEventListener("DOMContentLoaded", main);

async function main() {
    const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    };

    try {
        const response = await fetch('/admin/sendAccessToken', reqOptions);
        const data = await response.json();
        const access_token = data.access_token;
        console.log('access_token: ', access_token);
        // redirect to: https://hongqiplus.wengegroup.com/artificial_intelligence_anchor/thirdParty/login?appId=ichongqing&ticket=access_token，
        window.location.href = `https://hongqiplus.wengegroup.com/artificial_intelligence_anchor/thirdParty/login?appId=ichongqing&ticket=${access_token}`;
        // const invisibleA = document.getElementById("invisibleA");
        // invisibleA.href = `https://hongqiplus.wengegroup.com/artificial_intelligence_anchor/thirdParty/login?appId=ichongqing&ticket=${access_token}`;
        // invisibleA.click();
        // open a new window
        // window.open(`https://hongqiplus.wengegroup.com/artificial_intelligence_anchor/thirdParty/login?appId=ichongqing&ticket=${access_token}`); 
    

    }
    catch (err) {
        console.log('ERROR: ', err);
    }
}

