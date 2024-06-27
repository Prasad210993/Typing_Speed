let randomText = document.querySelector('#randomText');
let result = document.querySelector('#result');
let textip = document.querySelector('#textip');
let btnDone = document.querySelector('#bnDone');
let refresh = document.querySelector("#refresh");
let cntTime = document.querySelector('.showTime');

let progress = document.querySelector('#showProgress');
let close1 = document.querySelector('#close');
let pro = document.querySelector('#pro');
let textArea = document.querySelector('.textArea');

let startTime, endtime, completeTime, speed, wordLen,rText,data,sentence,ans,score;

let startMin = 1;
let t = startMin * 60;
let intervalID;

function updateCount() {
    const min = Math.floor(t / 60);
    let sec = t % 60;
    if (min != 0 || sec != 0) {
        // if(sec<=5){
        //     sec.style.color("red");
        // }
        sec = sec < 1 ? '0' + sec : sec;
        cntTime.innerHTML = `${min}:${sec}`;
        t--;
    }
    else {
        clearInterval(intervalID);
        cntTime.innerHTML = '00:00';
        // alert("Done!")
        myFun();
        textip.blur();
        // if (status1.innerText == 'Active') {
        //     status1.innerText = 'Not Active';
        //     textip.blur();
        // }
    }
}


// let data = ["I don't want to have pasta for dinner, so I'll have to buy something else.",
//     "Our flight back to London from Spain was cancelled, so we had to stay an extra night.",
//     "I go to my swimming lessons every Wednesday afternoon.",
//     "I take the bus to school every morning."
// ]

function resetAll() {
    textip.value = "";
    completeTime = 0;
    speed = 0;
    
    randomText.innerHTML = "";
    clearInterval(intervalID);
}

function accuracy(word){
    // console.log(word);
    let num = 0;
    sentence = randomText.innerHTML;
    sentence = sentence.trim().split(' ').filter(char=> char !=='');
    // console.log(sentence);
    for (let i=0; i<word.length; i++){
        if(word[i]===sentence[i]){
            num++; 
        }
    }
    return num;
}

function calculationTime() {
    let word1 = textip.value.trim();
    let wordLen1 = word1===''? 0 : word1.split(' ');

    wordLen = accuracy(wordLen1);
    
    while(true){
        if(wordLen1<1){
            result.innerHTML = `You did not typed anything.. Try again..!`;
            break;
        }
        else{
            ans = Math.floor((wordLen/wordLen1.length)*100);
    
            completeTime = Math.floor((endtime - startTime) / 1000);
            speed = Math.floor((wordLen / completeTime) * 60);
    
            result.innerHTML = `Your typing speed is ${speed} WPM and you wrote ${wordLen} correct word out of ${wordLen1.length} total words. Accuracy is ${ans}% & time taken ${completeTime} sec.`;
        
            score = {'speed':speed,'acu':ans};
            localStorage.setItem('score',JSON.stringify(score));
        
            let x = JSON.parse(localStorage.getItem('score'));

            
            console.log(x);
            
            // console.log(x.acu);
            break;
        }
        
    }

}

const myFun = () => {
    let time = new Date()
    endtime = time.getTime();
    calculationTime();
    resetAll();
    startTime = 1;
    t = startMin * 60;
    cntTime.innerHTML = '--:--';
    btnDone.style.display = 'none';
    refresh.style.display = 'none';
    progress.style.display ='block';
    textip.addEventListener('focus', () => {
        fetchRandomText();
        progress.style.display ='none';
    })
}

function refresh1() {
    startTime = 1;
    t = startMin * 60;
    cntTime.innerHTML = '--:--';
    clearInterval(intervalID);
    textip.value = "";
    fetchRandomText();
    btnDone.style.display = 'none';
}

const showData = () => {
    fetchRandomText();
}

const startTimer = () => {
    intervalID = setInterval(updateCount, 1000);
    let time = new Date()
    startTime = time.getTime();
}

// code for textarea is active
fetchRandomText();
textip.addEventListener('focus', () => {
    // status1.innerText = 'Active';
    btnDone.style.display = 'block';
    refresh.style.display = 'block';
    startTimer();
    result.innerHTML = '';
})

// function open(){
//     //
// }

let jsonArry = [];

// jsonArry.push({speed,ans});

// let jsonStr = JSON.stringify(jsonArry);
// console.log(speed);


// // localStorage.setItem('score',JSON.stringify(score));

progress.addEventListener('click',()=>{
    let x = JSON.parse(localStorage.getItem('score'));
    // console.log(x.acu);
    textArea.style.display='none';
    close1.style.display='block';
    pro.innerHTML = `your speed is ${x.speed} and Accuracy is ${x.acu}.`;

})

async function fetchRandomText(){
    try{
        const respones = await fetch('https://baconipsum.com/api/?type=meat-and-filler');
        data = await respones.json();
        rText = Math.floor(Math.random() * data.length);
        randomText.innerHTML = data[rText];
    }
    catch(error){
        console.error('Fetch error:',error);
        randomText.textContent='Failed to fetch random text.'
    }
}


// adding eventlistner to btn so we can active textarea
// btn.addEventListener("click",function(){
//     switch(btn.innerText.toLowerCase()){
//         case 'start':
//             intervalID=setInterval(updateCount,1000);
//             let time = new Date()
//             startTime = time.getTime();
//             btn.innerText='done';
//             textip.disabled=false;
//             refresh.disabled=false;
//             result.innerHTML = '';
//             showData();
//             refresh1();
//             break;

//         case 'done':
//             btn.innerText='start';
//             textip.disabled=true;
//             refresh.disabled=true;
//             myFun();    
//             break;            
//     }     
// })


