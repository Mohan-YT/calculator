let display = document.getElementById('inputBox')
let inputValue = '';
let calculationNum = '';
let outputVal = ''

//set the current input value
let setNum = (num)=>{
    inputValue +=num;
    updateVal();
}

//calculation output get into result
let equalNums = ()=>{
    try{
        let result = evalCalculation(inputValue);  //calculation in this function
        addHistory(inputValue,result)  // data send to history
        inputValue = result.toString();
        updateVal();
    }catch(err){
        inputValue = 'Error';
        updateVal();
    }
}

//display the values
let updateVal= ()=>{
    display.value = inputValue;
}

//delate one by one numbers
let delateNum = ()=>{
    inputValue = inputValue.slice(0,-1);
    updateVal();
}

//clear all numbers
let clearAllNum = ()=>{
    inputValue = inputValue.slice(0,0);
    updateVal()
}

//calculation 
//the values split the numbers and oprators 
const evalCalculation = (values) =>{
    // console.log(values)
    let valueTakes = values.match(/(\d+\.?\d*|\+|\-|\*|\%|\/)/g); //using split numbers also point numbers and oprators

///// //oprators set object type for highest value take first preference

    //example : in case all operators value is same that case : 2+3*2 = 10 it calculate ordery but its not correct
    //example : in case oprators have different values  that case : 2+3*2 = 8 it calculate first high value operator this is currect calculation

    let operators = {'+' : 1,
                    '-' : 1,
                    '*' : 2,
                    '%' : 2,
                    '/' : 2
                   };
    let numValues = [];  //used for store number values from input
    let opValues = [];  //used for operators from input

    let applyCalculation = ()=>{
        let current = numValues.pop(); //take last value from numValues
        let previous = numValues.pop(); //also taken last value but after current is take the last value from numValues
        let operate = opValues.pop();  //take last opValues
        switch(operate){
            case '+':
                numValues.push(previous + current);
                break;
        case '-':
                numValues.push(previous - current);
                break;
        case '*':
                numValues.push(previous * current);
                break;
        case '%':
                numValues.push(previous % current);
                break
        case '/':
                numValues.push(previous / current);
                break;
        default :
            throw new Error('Unknow Oprator')
        }
    }

    valueTakes.map((input) => { //use also for each
        if(!isNaN(input)){
            numValues.push(parseFloat(input));
        }else if(input in operators){
            //while check the condition one by one
            while(opValues.length && operators[opValues[opValues.length-1]] >= operators[input]){ //it use for high value oprators like (*,/,%) it take first preference in calculation example(2+3*3+2*1+3= 16)
                applyCalculation()  
            }
            opValues.push(input);
        }
    });

    while(opValues.length){
        applyCalculation()
    }

    return numValues[0]; //index of 0 th value returned
}

document.addEventListener("keydown", (event) => {
const key = event.key;
const button = document.querySelector(`.btn[data-key = "${key}"]`);

if(button){
    button.style.backgroundColor = '#8b8b8b';
    setTimeout(()=>{
        button.style.backgroundColor = ''; 
    },150)
}

    
// Handle numeric keys
if (!isNaN(key)) {
setNum(key); // If the key is a number, call setNum
}

// Handle operators
if (["+", "-", "*", "/", "%", "."].includes(key)) { //includes is check the array's specified key? true,false 
setNum(key); // If the key is an operator, call setOperator
}
else if (key === "Enter") { // Handle Enter key for "="
equalNums();
}
else if (key === "Backspace") {  // Handle Backspace for deleting one character
delateNum();
}
else if (key === "Delete" || key === 'Escape') {  // Handle "Escape" key for clearing all
clearAllNum();
}

});


//Mobile Device History
const historyBody = document.querySelector('.history-body')
const addHistory = (calculation,result)=>{
    let div = document.createElement('div');
    let p = document.createElement('p');
    p.textContent = calculation;
    let h5 = document.createElement('h5');
    h5.textContent = `= ${result}`
    div.appendChild(p);
    div.appendChild(h5);
    historyBody.append(div);
}

const historyDelate = ()=>{
    historyBody.textContent = '';
    historyShow()
}
const HistoryBox = document.querySelector('.history')
const historyShow = ()=>{
    HistoryBox.style.left === '-100%' ? HistoryBox.style.left = '0' : HistoryBox.style.left = '-100%'  
}