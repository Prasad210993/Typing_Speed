let randomText = document.querySelector('#randomText');
let result = document.querySelector('#result');
let textip = document.querySelector('#textip');
let btnDone = document.querySelector('#bnDone');
let refresh = document.querySelector("#refresh");
let cntTime = document.querySelector('.showTime');

let progress = document.querySelector('#showProgress');
let chart = document.querySelector('#chartContainer');
let close1 = document.querySelector('#close');
let pro = document.querySelector('#pro');
let textArea = document.querySelector('.textArea');
let resize = document.querySelector('.resize');

let startTime, endtime, completeTime, speed, wordLen, rText, data, sentence, ans, score;

var upVal=JSON.parse(localStorage.getItem('jsonArry')) || [];

let ySpeed = [];

let startMin = 1;
let t = startMin * 60;
let intervalID;

function updateCount() {
    const min = Math.floor(t / 60);
    let sec = t % 60;
    if (min != 0 || sec != 0) {
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

function accuracy(word) {
    // console.log(word);
    let num = 0;
    sentence = randomText.innerHTML;
    sentence = sentence.trim().split(' ').filter(char => char !== '');
    // console.log(sentence);
    for (let i = 0; i < word.length; i++) {
        if (word[i] === sentence[i]) {
            num++;
        }
    }
    return num;
}

function calculationTime() {
    let word1 = textip.value.trim();
    let wordLen1 = word1 === '' ? 0 : word1.split(' ');

    wordLen = accuracy(wordLen1);

    while (true) {
        if (wordLen1 < 1) {
            result.innerHTML = `You did not typed anything.. Try again..!`;
            break;
        }
        else {
            ans = Math.floor((wordLen / wordLen1.length) * 100);

            completeTime = Math.floor((endtime - startTime) / 1000);
            speed = Math.floor((wordLen / completeTime) * 60);

            result.innerHTML = `Your typing speed is ${speed} WPM and you wrote ${wordLen} correct word out of ${wordLen1.length} total words. Accuracy is ${ans}% & time taken ${completeTime} sec.`;

            score = { 'speed': speed, 'acu': ans };
            // localStorage.setItem('score',JSON.stringify(score));

            localS(score);
            // console.log(upVal.length);
            break;
        }
    }
}

// adding/updating localStorage value;
function localS(s) {
    upVal = JSON.parse(localStorage.getItem('jsonArry')) || [];
    console.log(upVal);
    window.upVal.push(score);

    let {'speed':s1,'acu':a} = score;
    ySpeed.push(s1);
    // console.log(ySpeed);

    localStorage.setItem('jsonArry', JSON.stringify(upVal));

}
// console.log(upVal.length);

const myFun = () => {
    let cnt = 1;
    let time = new Date()
    endtime = time.getTime();
    calculationTime();
    resetAll();
    startTime = 1;
    t = startMin * 60;
    cntTime.innerHTML = '--:--';
    btnDone.style.display = 'none';
    refresh.style.display = 'none';
    progress.style.display = 'block';
    textip.addEventListener('focus', () => {
        if(cnt===1){
            fetchRandomText();
            // console.log("wroking in side myFun",++cnt);
            progress.style.display = 'none';
            cnt = 0;
        }
    })
}

function refresh1() {
    startTime = 1;
    t = startMin * 60;
    cntTime.innerHTML = '--:--';
    clearInterval(intervalID);
    textip.value = "";
    fetchRandomText();
    console.log("wroking in side refresh1");
    btnDone.style.display = 'none';
}


const startTimer = () => {
    intervalID = setInterval(updateCount, 1000);
    let time = new Date()
    startTime = time.getTime();
}

// code for textarea is active
fetchRandomText();
// console.log("wroking before textArea ");
textip.addEventListener('focus', () => {
    // status1.innerText = 'Active';
    btnDone.style.display = 'block';
    refresh.style.display = 'block';
    startTimer();
    result.innerHTML = '';
})


progress.addEventListener('click', () => {
    let x = JSON.parse(localStorage.getItem('score'));
    // console.log(x.acu);
    textArea.style.display = 'none';
    progress.style.display = 'none';
    close1.style.display = 'block';
    re = document.querySelector('#reset');
    re.style.display = 'block';
    re.onclick = function () {
        localStorage.clear();
        pro.innerHTML = '';
    }
    close1.addEventListener('click', () => {
        window.location.reload();
    })
    chart.style.display='block';
    // chart.style.display='block';
    // pro.style.display='none';

    // showing accuracy and spped

    // for (let i = 0; i < upVal.length; i++) {
    //     const obj = upVal[i];
    //     const p = document.createElement('p');
    //     p.textContent = `speed is ${obj.speed} and Accurcy is ${obj.acu}.`;
    //     p.style.border = "1px solid red";
    //     pro.appendChild(p);
    // }
})



async function fetchRandomText() {
    try {
        const respones = await fetch('https://baconipsum.com/api/?type=meat-and-filler');
        data = await respones.json();
        rText = Math.floor(Math.random() * data.length);
        randomText.innerHTML = data[rText];
        // console.log("wroking in side fetchRandomText");
    }
    catch (error) {
        console.error('Fetch error:', error);
        randomText.textContent = 'Failed to fetch random text.'
    }
}

// var dataPoints = 
// console.log(upVal.length);

// Chart
window.onload = function () {

    var chartData = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Speeds"
        },
        data: [{
            type: "line",
            indexLabelFontSize: 16,
            dataPoints: []
        }]
    };
    // global upVal;
    console.log(upVal);
    for (let i = 0; i <window.upVal.length; i++) {
        const obj = upVal[i];
        chartData.data[0].dataPoints.push({ y: obj.acu });
    }

    var chart = new CanvasJS.Chart("chartContainer", chartData);
    chart.render();

}


// Only for fullscreen use
window.addEventListener('load',function(){
    if(window.innerWidth<1200){
        resize.style.display='block';
    }
    else{
        resize.style.display='none';
        
    }
})