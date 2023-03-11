"use strict";

//control buttons
const btnStart = document.getElementById('btn-start');
const showItemBtn = document.getElementById('next-item__btn');
const finalBtn = document.getElementById('final-page__btn');
const restartBtn = document.getElementById('restart-page__btn');
const btnDiv = document.querySelector('.btn-div');
//

//selectors
const topicSelector = document.querySelector('select[name="topic"]');
const difficultySelector = document.querySelector('select[name="difficulty"]');
const itemSelector = document.querySelector('input[name="item"]');
const timerSelector = document.querySelector('input[name="timer"]');
//

const mainDiv = document.getElementById('main');
//
let quizInfo = [],i=0,answer ='',topic,difficulty,item =5,timer=10,
answerItems,timeResultVal,resultItemArray =[],resultItem,quizItemDivs
//
//default
const conditionForAnswerItem = new Array(4).fill('quiz-item__answer')
itemSelector.value = item;
timerSelector.value = timer;
document.querySelector('.item-value').textContent = item;
document.querySelector('.timer-value').textContent = timer;
//
topicSelector.addEventListener('change',(e)=>{
    confirmingToStart(e.target.value);
    topic = e.target.value;
    configRequest(topic,difficulty,item,timer);
})

difficultySelector.addEventListener('change',(e)=>{
    confirmingToStart(e.target.value);
    difficulty = e.target.value;
    configRequest(topic,difficulty,item,timer);
})

itemSelector.addEventListener('input',(e)=>{
    confirmingToStart(e.target.value);
    item = e.target.value;
    document.querySelector('.item-value').textContent = e.target.value;
    configRequest(topic,difficulty,item,timer);
})

timerSelector.addEventListener('input',(e)=>{
    confirmingToStart(e.target.value);
    timer = e.target.value;
    document.querySelector('.timer-value').textContent = e.target.value;
    configRequest(topic,difficulty,item,timer);
})


function configRequest(a,b,c,d){
    if(a === '' || b === '' || c==='' || Number(c) < 5 ||
     Number(d) ===0 || a === undefined || b === undefined) {
        btnStart.disabled= true;
        return;
    }

    btnStart.disabled=false;
    quizData(a,b,c)
}

function confirmingToStart(val) {
    if( val === '') btnStart.disabled = true;
}

async function quizData(topicVal,difficultyVal,itemVal) {
    try{
        await fetch(`https://the-trivia-api.com/api/questions?categories=${topicVal}&limit=${itemVal}&region=PH&difficulty=${difficultyVal}`)
       .then(response => response.json())
       .then(data => {
       quizInfo = data
       });
    }
    catch(error) {
        if(error) quizData()
    }
  
}

async function showItem(){
    document.querySelector('.timer-indicator').textContent = timer;
    showItemBtn.disabled = true;
    pushedValArray(resultItem);

    if(i === 4) {
        showItemBtn.textContent = "Finish Quiz";
    }

    if(i === 5) {
        document.querySelector('.quiz-item__header').classList.add('hide');
        document.querySelectorAll('.quiz-item')
        .forEach(val => val.remove())
        toggleButtonsFinalPage();
    
        return;
    };
    
    const newQuizItem = await quizInfo;
    const answerSet = newQuizItem[i].incorrectAnswers.concat([newQuizItem[i].correctAnswer]).sort();    
    timerHandler(timer);
    enteredElementsForQuiz(i,newQuizItem,answerSet)
    
    const divQUiz = document.querySelectorAll('.quiz-item');
    
    pickAnswer(divQUiz,i,newQuizItem[i].correctAnswer,newQuizItem[i].question);
    
    i++;
    itemIndicatorHandler(i,newQuizItem.length);

    answerItems.forEach(val => val.className = 'quiz-item__answer')
}

function showItemHandler() {
    window.localStorage.clear()
    mainDiv.classList.add('hide')
    showItemBtn.classList.toggle('hide');
    btnStart.classList.toggle('hide');
    
    const headerElementFormat = `
    <div class="row justify-content-around align-items-center quiz-item__header">
        <p class="item-indicator col-auto"></p>
        <p class="timer-indicator col-auto"></p>
    </div>
    `

    const headerParent = creatingElement('div');
    headerParent.classList.add('container','col-8')
    headerParent.insertAdjacentHTML('afterbegin',headerElementFormat);
    appendBody(headerParent);

    showItem();
}

debugger;

function enteredElementsForQuiz(tabId,pulledDataQuiz,pulledAnswerSet){
    const quizDiv = creatingElement('div');
    quizDiv.classList.add('quiz-item','p-4','col-8','mx-auto')
    quizDiv.dataset.tab = tabId;

    const quizAnswerlist = creatingElement('ul');
    const questionTxt = creatingElement('h3');

    quizAnswerlist.className = 'quiz-item__answer-list';

    let txt = document.createTextNode(`${pulledDataQuiz[tabId].question}`)
    questionTxt.appendChild(txt);
    
    quizDiv.appendChild(questionTxt);
    quizDiv.appendChild(quizAnswerlist);
    appendBody(quizDiv);

    for (let a = 0; a < pulledAnswerSet.length; a++) {
        let answerItem = creatingElement('li');
       answerItem.textContent += pulledAnswerSet[a];
       answerItem.dataset.tab = a;
        quizAnswerlist.appendChild(answerItem);
    }
}

function pickAnswer(divItem,itemNo,correctAnswer,itemQuestion) {
    divItem.forEach(val => val.classList.add('hide'));
    divItem[itemNo].classList.remove('hide');

    answerItems = divItem[itemNo].querySelectorAll('li');
 
    let storeConfirmAnswer = {
        answerKey: itemNo +1,
        question: itemQuestion,
        confirmAnswer: false,
        answerContext:'',
        correctAnswer: correctAnswer
    }
    
    answerItems.forEach((val,i)=>{
       val.addEventListener('click',()=>{

        if(timeResultVal ===0) return;
        let confirmAnswer = val.textContent === correctAnswer;

        const copyConditionForAnswerItem = conditionForAnswerItem.map((value,index) => {
        return index === i ? 'quiz-item__answer-picked' : 'quiz-item__answer'
        })

        answerItems.forEach((val,indexVal) => val.className = copyConditionForAnswerItem[indexVal])

        storeConfirmAnswer = {
            answerKey: itemNo +1,
            question: itemQuestion,
            confirmAnswer: confirmAnswer,
            answerContext:val.textContent,
            correctAnswer: correctAnswer
        }
        return resultItem = storeConfirmAnswer
        
       })
    })

    return resultItem = storeConfirmAnswer

}


function timerHandler(timerVal) {
    
    const timerFunc = setInterval(()=>{
        --timerVal
        document.querySelector('.timer-indicator').textContent = timerVal;
    
        if(timerVal ===0) {
    
            showItemBtn.disabled = false;
            clearInterval(timerFunc);
        };
        return timeResultVal = timerVal

     },1000)

}


function finalPageHandler() {

    const finalScore = resultItemArray.filter(val => val.confirmAnswer === true)

    const resultBody = creatingElement('div');
    resultBody.className = 'result-body container mx-auto col-lg-10 px-3 py-4 justify-content-center';
    
    const arrayForItemScore = resultItemArray.map(val =>
         val.confirmAnswer=== true ? 'correct-item' : 'incorrect-item');

    let i = resultItemArray.length;
    while(i >0 ) {
        i--
        let resultContent = `
           <div>
           <hr>
            <h5 class="${arrayForItemScore[i]}">Item No: ${resultItemArray[i].answerKey}</h5>
            <p>Question: ${resultItemArray[i].question}</p>
            <p>Your Answer: ${resultItemArray[i].answerContext}</p>
            <p>Correct Answer: ${resultItemArray[i].correctAnswer}</p> 
           </div> 
        `
        
        resultBody.insertAdjacentHTML('afterbegin',resultContent)
    }   

    const scoreContainer = `
    <div class='mx-auto score-container text-center'>
        <h5> Your score: ${finalScore.length} / ${resultItemArray.length} </h5>
    </div>`

    resultBody.insertAdjacentHTML('afterbegin',scoreContainer)
    appendBody(resultBody);
}


function restartPageHandler() {
    resultItemArray.length = 0;
    resultItemArray = [];
    resultItem = '';
    toggleButtonsHide();
   
   if( document.querySelector('.result-body') ) {
    document.querySelector('.result-body').remove();
   }
    document.querySelector('.quiz-item__header').remove();
    mainDiv.classList.remove('hide');
    showItemBtn.textContent = "Show Item";
 
    configRequest(topic,difficulty,item,timer);

    showItemBtn.disabled = false;
    i = 0;
}

function toggleButtonsFinalPage() {
    showItemBtn.classList.toggle('hide');
    finalBtn.classList.toggle('hide');
    restartBtn.classList.toggle('hide');
}

function toggleButtonsHide() {
    btnStart.classList.toggle('hide');
    finalBtn.classList.toggle('hide');
    restartBtn.classList.toggle('hide');
}

//appending elements to the body
function appendBody(val) {
    document.body.appendChild(val);
}

//itemIndicator
function itemIndicatorHandler(a,b) {
    document.querySelector('.item-indicator').textContent = `${a} ${'of'} ${b} ${'Questions'}`;
 } 

 //array for results after the quiz
function pushedValArray(item) {
    if(item === undefined ||item === ''||item ==={}) return;
    resultItemArray.push(item);
}

//appending the header of the quizitem
function appendHeader(val) {
    document.querySelector('quiz-item').body.appendChild(val);
}
//building an element to serve in the html body
function creatingElement(val) {
    return document.createElement(val);
}

btnStart.addEventListener('click',showItemHandler);
showItemBtn.addEventListener('click',showItem);
finalBtn.addEventListener('click',finalPageHandler);
restartBtn.addEventListener('click',restartPageHandler)
