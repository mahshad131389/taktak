const url = "https://orimo.liara.run/api/";
const lead_url = "https://orimo.liara.run/campaigns/Ramak/fruit/";
let token = "d2aa7ca8fe558b3750e7c86b27e6d93d4e1c421f"

// const url = "http://127.0.0.1:8000/api/";
// const lead_url = "http://127.0.0.1:8000/campaigns/Ramak/fruit/";
// let token = "a20baaad9ffb7bdfd1141c08c457e2f1d9d4ee2c";

let playerPrevScore = null;
let playerId = null;
let playerGifts = null;
var sen3 = document.getElementById('sen3');
let replay = 2;
let playerName = null



function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    if (cookieValue === null) {
        console.error(`Cookie with name '${name}' not found.`);
    }
    return cookieValue;
}

async function sendSms() {
    let item = document.getElementById("getphoneinput");
    let name = document.getElementById("nameinput").value;

    let val = item.value
    if (name != null && name != "") {
        playerName = name
        if (val.length < 11) {
            alert("شماره تلفن باید 11 رقم باشد مثل(09120000000)");
        } else if ((val.length > 11)) {
            alert("شماره باید 11 رقم باشد . ");
        } else {
            let response = await fetch(`${url}campaigns/Ramak/fruit/send-sms/`, {
                method: "POST",
                body: JSON.stringify({
                    phone_number: val,
                    viral : viral,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": `Bearer ${token}`,
                }
            });
            let data = await response.json();
            // alert(response.status)
            alert(data["message"]);
            //document.getElementById("messages").innerText = data["message"];
            if (response.status == 200) {
                document.getElementById("submit_btn").style.display = "none";
                document.getElementById("phone_box").style.display = "none";
                document.getElementById("submit_btn_disabled").style.display = "block";
                item.disabled = true;
            }
            // } else {
            //     alert(data["message"])
            //     setInterval(function () {
            //         location.replace(`${lead_url}lead/${data['offer']}/?C=${data['customerID']}`)
            //     }, 1000);
            // }
        }        
    }else{
        alert("نام و نام خانوادگی را وارد کنید ")
    }

};


async function checkVerificationCode() {
    const phone_number = document.getElementById("getphoneinput").value;
    const code = document.getElementById("getcodeinput").value;
    let response = await fetch(`${url}campaigns/Ramak/fruit/check-code/`, {
        method: "POST",
        body: JSON.stringify({
            phone_number: phone_number,
            code: code,
            viral : viral,
            playerName:playerName,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${token}`,
        }
    });
    let data = await response.json();
    if (response.status == 200) {
        let prev_score = data["prev_score"];
        let player_id = data["player_id"]; 

        if (prev_score) 
            playerPrevScore = prev_score;
        // console.log(`player prev score is : ${playerPrevScore}`);

        if (player_id)
            playerId = player_id;
        // console.log(`player id is : ${player_id}`);
        displayGameForPlayer()
    } else {
        alert(data["message"]);
    }
};

// function displayGameForPlayer() {

    
//     sen3.style.display = 'none';
//     var game = document.getElementById("game");
//     game.style.display = "block";
//     var newIframe = document.createElement("iframe");
//     newIframe.src = "http://127.0.0.1:8000/static/game/index.html";
//     newIframe.id = "myIframe";
//     newIframe.classList.add("w-full");
//     newIframe.classList.add("h-full");
//     game.appendChild(newIframe);
    
// };

function displayGameForPlayer() {
    // Check if sen3 exists before trying to hide it
    const sen3 = document.getElementById('sen3');
    if (sen3) {
        sen3.style.display = 'none';
    }
    
    // Get game element and verify it exists
    const game = document.getElementById("game");
    if (!game) {
        console.error("Game container not found");
        return;
    }
    
    
    // Show game container
    game.style.display = "block";
    
    // Remove any existing iframe to prevent duplicates
    const existingIframe = document.getElementById("myIframe");
    if (existingIframe) {
        existingIframe.remove();
    }
    
    // Create and append new iframe
    const newIframe = document.createElement("iframe");
    newIframe.src = "./assets/game/index.html";
    newIframe.id = "myIframe";
    newIframe.classList.add("w-full", "h-full");  
    game.appendChild(newIframe);
}

function playagain() {
    console.log(`playerPrevScore = ${playerPrevScore} playerId ${playerId}`)
    console.log(replay);
    if (replay > 0 ) {
        if (playerPrevScore  && playerId ) {
            document.getElementById("leadrBoard").style.display='none';
            document.getElementById('myIframe').contentWindow.location.reload();
            replay -= 1;
        }
    }else{
        alert("فرصت شما به اتمام رسید برای بازی بیشتر بر روی اتمام بازی کلیک کنید و سپس  لینک اختصاصی  خود را برای دوستان بفرستید")
    }

}
async function endGame(score) {

    phone_number = document.getElementById("getphoneinput").value;
    let send_method = '';
    let send_url = '';

    if (playerPrevScore == null) {
        send_method = 'POST';
        send_url = `${url}campaigns/Ramak/fruit/create/`;
    } else {
        send_method = 'PUT';
        send_url = `${url}campaigns/Ramak/fruit/update/${playerId}/`;
    }

    let response = await fetch(send_url, {
        method: send_method,
        body: JSON.stringify({
            viral : viral,
            phone_number: phone_number,
            score: score,
            full_name: playerName,
           

        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${token}`
        }
    });
    let data = await response.json();
    console.log(data);
    if (response.status == 200 ||  response.status == 201) {
        let leadrBoard = document.getElementById("leadrBoard");
        
        player_id = data["player"]["id"];
        playerPrevScore = data['score'];
        
        if (player_id) {
            playerId = player_id;
            lead_url = lead_url.split('?')[0] + `?viral=${playerId}`;
        }
        // if (data["last_score"] != null) {
        //     document.getElementById("score_last").innerHTML = data["last_score"];             
     
            // var score = document.getElementById("score_new").innerHTML;
        document.getElementById("score_new").innerHTML = data['score'];
        document.getElementById("rank").innerHTML = data['leader_bord']["rank"];
        
        
        // console.log(lead_url)
        // leadrBoard.setAttribute("href", lead_url); 

        // let player_gifts = data["gifts"];
        document.getElementById("myIframe").style.zIndex = -10;
        leadrBoard.style.display = 'block';
        let modalcontent = `<div class="relative w-[360px] mx-auto h-[520px] bg-cover " >
        <img class="h-[500px]" src="./assets/images/leaderpic3.png" alt="">
        <div class="absolute top-[140px] right-4 bg-[#562A0F] w-[330px] mx-auto px-[2px] py-1 text-center rounded-md ">
        <p class="font-semibold text-yellow-400 mx-auto text-lg">تعداد شرکت کننده ها: ${data["leader_bord"]["players"]} نفر</p>
        `
        
        

        data["leader_bord"]["bestplayer"].forEach(i => {rank
            if (data["leader_bord"]["rank"] == i.index) {
                modalcontent += ` 

                <div class="w-80 my-2 p-3 text-[#562A0F] font-bold mx-auto text-lg flex justify-between  bg-[#A68153] items-center ">
                   <div class="flex w-1/6 justify-evenly items-center">
                       
                       <p class="font-semibold text-[#562A0F]">${i.index}</p>
                   </div>
                   <div class="flex w-2/6 justify-evenly items-center">
                       
                       <h6 class="font-AnjomanMax_SemiBold w-full"> ${i.name} </h6>
                   </div>
                   
                   <div class="flex justify-evenly items-center w-2/6">

                   <span class="" >امتیاز: ${i.score}</span>
                   </div>
                   <div class="flex justify-evenly items-center w-1/6">
                       <img class="w-10" src="./assets/images/${i.index}.png" alt="">
                   </div>   
               </div>
           ` 
            } else {
                modalcontent += ` 

                <div class="w-80 my-2 p-1 text-[#562A0F] font-bold mx-auto flex justify-between  bg-[#A68153] items-center ">
                   <div class="flex w-1/6 justify-evenly items-center">
                       <p class="font-semibold text-[#562A0F]">${i.index}</p>
                   </div>
                   <div class="flex w-2/6 justify-evenly items-center">
                       <h6 class="font-AnjomanMax_SemiBold w-full"> ${i.name} </h6>
                   </div>
                   <div class="flex justify-evenly items-center w-2/6">
                   <span class="" >امتیاز: ${i.score}</span>
                   </div>
                   <div class="flex justify-evenly items-center w-1/6">
                       <img class="w-10" src="./assets/images/${i.index}.png" alt="">
                   </div>   
               </div>
           ` 
            }

        });

        modalcontent += `<div class="w-full flex flex-col px-4">
                    <div class="w-2 h-2 mt-1 bg-[#A68153] rounded-lg"></div>
                    <div class="w-2 h-2 mt-1 bg-[#A68153] rounded-lg"></div>
                    <div class="w-2 h-2 mt-1 bg-[#A68153] rounded-lg"></div>
                </div>`
        data["leader_bord"]["pre_leaderboard"].forEach(i => {
            if (i.index != 1 && i.index != 2 != i.index !=3 ) {
                if (data["leader_bord"]["rank"] == i.index) {
                    modalcontent += `
                    <div class="w-80 my-2 px-1 py-2 text-[#562A0F] font-bold mx-auto flex justify-between  bg-[#c4ecb4] items-center border-2 border-yellow-700">
                    <div class="flex w-1/6 justify-evenly items-center">
                        <p class="font-semibold text-[#562A0F]">${i.index}</p>
                    </div>
                    <div class="flex w-2/6 justify-evenly items-center">
                        <h6 class="font-AnjomanMax_SemiBold w-full"> ${i.name} </h6>
                    </div>
                    <div class="flex justify-evenly items-center w-2/6">
                    <span class="" >امتیاز: ${i.score}</span>
                    </div>
                    <div class="flex justify-evenly items-center w-1/6">
                        <img class="w-5" src="./assets/images/adam.png" alt="">
                    </div>
                </div>` 
                } else {
                    modalcontent += `
                    <div class="w-80 my-2 p-1 text-[#562A0F] font-bold mx-auto flex justify-between  bg-[#A68153] items-center ">
                    <div class="flex w-1/6 justify-evenly items-center">
                        <p class="font-semibold text-[#562A0F]">${i.index}</p>
                    </div>
                    <div class="flex w-2/6 justify-evenly items-center">
                        <h6 class="font-AnjomanMax_SemiBold w-full"> ${i.name} </h6>
                    </div>
                    <div class="flex justify-evenly items-center w-2/6">
                    <span class="" >امتیاز: ${i.score}</span>
                    </div>
                    <div class="flex justify-evenly items-center w-1/6">
                        <img class="w-5" src="./assets/images/adam.png" alt="">
                    </div>
            </div>
            ` 
                }

            }

        });


        if (replay == 0 ) {
        modalcontent += ` </div></div>   
                <div class="w-[360px]  bg-cover h-56 max-2xl mx-auto pt-10 pr-4" style="background-image: url(./assets/images/leaderpic2.png);">
            <div class=" w-80 h-20 flex justify-center items-center">

                <p class="font-AnjomanMax_SemiBold tect-lg text-[#562A0F] [text-shadow:_0_4px_8px_#ffffff]  text-xl  leading-snug  font-extrabold">${replay} بار فرصت داری رتبه خودت و بهتر کنی</p>
            </div>
            <div class="w-full flex justify-evenly items-center mt-7">

               <button class="invisible w-44 h-20   rounded-lg font-AnjomanMax_SemiBold -mr-2 text-xl text-gray-300" type="button" >بازی مجدد</button>
                <button class="w-44 h-20  rounded-lg font-AnjomanMax_SemiBold  text-xl text-[#562A0F]" type="button" onclick="lastpage()">پایان بازی</button>
           
            </div>

        </div>` 
        // setIntervallastpage(lastpage(), 5000);
                
        }else{
            modalcontent +=  `  </div></div>       
            
                    <div class="w-[360px]  bg-cover h-56 max-2xl mx-auto pt-10 pr-4" style="background-image: url(./assets/images/leaderpic2.png);">
            <div class=" w-80 h-20 flex justify-center items-center">

                <p class="font-AnjomanMax_SemiBold tect-lg text-[#562A0F] [text-shadow:_0_4px_8px_#ffffff]  text-xl  leading-snug  font-extrabold">${replay} بار فرصت داری رتبه خودت و بهتر کنی</p>
            </div>
            <div class="w-full flex justify-evenly items-center mt-7">
                <button class="w-44 h-20   rounded-lg font-AnjomanMax_SemiBold -mr-2 text-xl text-[#562A0F]" type="button" onclick="playagain()">بازی مجدد</button>

              
                <button class="w-44 h-20  rounded-lg font-AnjomanMax_SemiBold  text-xl text-[#562A0F]" type="button" onclick="lastpage()">پایان بازی</button>
            </div>

        </div>
            
`     
        }

        leadrBoard.innerHTML =  modalcontent;
        // if(player_gifts){
        //     playerGifts = player_gifts;
        //     if (playerGifts[0] != null) {
        //         document.getElementById("first_gift").innerText = playerGifts[0];
        //         if (playerGifts[1] != null) {
        //             var second_gift = document.getElementById("second_gift")
        //             second_gift.innerText = playerGifts[1];
        //             second_gift.classList.add("bg-[#f794b3]","w-full", "rounded-xl", "p-1", "text-white", "flex",  "justify-center", "items-center");
        //         }
        //     }

        // }

    }};


function serveRequest(status){
    switch (status) {
        case '0':
            sendSms()
            break;
        case '1':

            checkVerificationCode()
            break;

        default:
            break;
    }
};

// function to auto copy text

// Function to copy text to clipboard



// Function to copy text to clipboard
function copyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
};


// Get the element to copy text from



// Get the copy button element
const copyButton = document.getElementById("copyButton");

// // Add a click event listener to the element
// a1.addEventListener("click", function () {
//     // Get the innerText of the element
//     const textToCopy = lead_url;

//     // Copy the text to clipboard
//     copyTextToClipboard(textToCopy);

//     // Notify the user that the text has been copied
//     alert("لینک کپی شد بفرست برای دوستات امتیاز بگیر");

// });

// Add a click event listener to the copy button (optional)
copyButton.addEventListener("click", function () {
    // Get the innerText of the element
    const textToCopy = lead_url;

    // Copy the text to clipboard
    copyTextToClipboard(textToCopy);

    // Notify the user that the text has been copied
    alert("لینک کپی شد بفرست برای دوستات امتیاز بگیر");
});