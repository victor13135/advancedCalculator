let keypad = document.getElementById("keypad");
let expressionDisplay = document.getElementById("expressionText");
let resultDisplay = document.getElementById("resultText")

let expression = "";
let firstOperandTemp = "";
let operation = "";
let secondOperandTemp = "";
let firstOperand = 0;
let secondOperand = 0;
let result = 0;
let finishedCalculation = false;
let emptyMemory = true;
let memoryRegister = 0;

function refreshExpressionDisplay () { expressionDisplay.innerHTML = expression; }
function refreshResultDisplay () { resultDisplay.innerHTML = result; }

function resetCalculator () {
    expression = "";
    firstOperandTemp = "";
    operation = ""
    secondOperandTemp = "";
    firstOperand = 0;
    secondOperand = 0;
    result = 0;
}
function calculateUnaryResult (operand, operation) {
    console.log(operation);
    let res = 0;
    if (operation == "reciprocity") {
        res = (1 / operand);        
    } else if (operation == "squareRoot") {
        res = Math.sqrt(operand);
    }
    res = String(res);
    res = res.slice(0,10);
    return res;
}
function printUnaryExpression (operand, operation) {
    if (operation == "reciprocity") {
        return `1 / ${operand} = `;
    } else if (operation == "squareRoot") {
        return `&#8730(${operand}) = `;
    }
}
function calculateBinaryResult (op1, op2, operation) {
    let res = 0;
    switch(operation) {
        case "+": res = op1 + op2; break;
        case "-": res = op1 - op2; break;
        case "*": res = op1 * op2; break;
        case "/": res = op1 / op2; break;
    }
    res = String(res);
    return res.slice(0,10);
}
function printBinaryExpression (op1, op2, operation) {
    switch(operation) {
        case "+": return `${op1} + ${op2} = `; break;
        case "-": return `${op1} - ${op2} = `; break;
        case "*": return `${op1} x ${op2} = `; break;
        case "/": return `${op1} / ${op2} = `; break;
    }
}

keypad.addEventListener("click", (event) => {
    if(event.target.tagName == "BUTTON") {
        if (event.target.classList.contains("memory")) {
            switch(event.target.id) {
                case "memoryClear":
                    emptyMemory = true;
                    memoryRegister = 0;
                    document.getElementById("memoryClear").classList.remove("memoryNotEmpty");
                    document.getElementById("memoryRecall").classList.remove("memoryNotEmpty");
                    break;
                case "memoryRecall":
                    if(!emptyMemory) {
                        if(operation.length > 0) {
                            secondOperand = memoryRegister;
                            secondOperandTemp = String(secondOperand);
                            if(secondOperand < 0) {
                                expression = firstOperandTemp + operation + "(" + secondOperandTemp + ")";
                            } else {
                                expression = firstOperandTemp + operation + secondOperandTemp;
                            }
                        } else {
                            firstOperand = memoryRegister;
                            firstOperandTemp = String(firstOperand);
                            expression = firstOperandTemp;
                        }
                        refreshResultDisplay();
                        refreshExpressionDisplay();
                    }
                    break;
                case "memoryStore":
                    if(firstOperand != 0) {
                        emptyMemory = false;
                        if(operation.length > 0 && secondOperand != 0) {
                            memoryRegister = result;
                        } else {
                            memoryRegister = firstOperand;
                            firstOperandTemp = String(firstOperand);
                            expression = firstOperandTemp;
                        }
                        document.getElementById("memoryClear").classList.add("memoryNotEmpty");
                        document.getElementById("memoryRecall").classList.add("memoryNotEmpty");
                        refreshExpressionDisplay();
                    }
                    console.log(firstOperand);
                    console.log(`u memoriji je vrednost ${memoryRegister}`);
                    break;
                case "memoryPlus": console.log("M+"); break;
                case "memoryMinus": console.log("M-"); break;
            }
        } else if (event.target.classList.contains("special")) {
            if(event.target.id == "clearAll") {
                resetCalculator();
                refreshExpressionDisplay();
                refreshResultDisplay();
            } else if (secondOperand != 0) {
                switch(event.target.id) {
                    case "backspace":
                        console.log(secondOperand, secondOperandTemp);
                        secondOperand = Math.trunc(secondOperand/10);
                        secondOperandTemp = String(secondOperand);
                        console.log(expression);
                        if (secondOperand < 0) {
                            secondOperandTemp = "(" + secondOperandTemp + ")";
                        } else {
                            secondOperandTemp = String(secondOperand);
                        }
                        console.log(secondOperand, secondOperandTemp);
                        expression = firstOperandTemp + operation + secondOperandTemp;
                        console.log(expression);
                        result = calculateBinaryResult(firstOperand, secondOperand, operation);
                        refreshResultDisplay();
                        refreshExpressionDisplay(); break;
                    case "clearEntry":
                        secondOperand = 0;
                        result = 0;
                        secondOperandTemp = String (secondOperand);
                        expression = firstOperandTemp + operation;
                        refreshResultDisplay();
                        refreshExpressionDisplay(); break;
                    case "plusMinus":
                        secondOperand *= -1;
                        secondOperandTemp = String(secondOperand);
                        if(secondOperand < 0) {
                            secondOperandTemp = "(" + secondOperandTemp + ")";
                        }
                        console.log(secondOperandTemp, secondOperand);
                        expression = firstOperandTemp + operation + secondOperandTemp;
                        result = calculateBinaryResult (firstOperand, secondOperand, operation);
                        refreshResultDisplay();
                        refreshExpressionDisplay();
                }
            } if (operation.length > 0) {
                switch(event.target.id) {
                    case "backspace":
                        operation = "";
                        expression = firstOperandTemp;
                        refreshExpressionDisplay(); break;
                }
            } else if (firstOperand != 0) {
                switch(event.target.id) {
                    case "backspace":
                        firstOperand = Math.trunc(firstOperand/10);
                        firstOperandTemp = String(firstOperand);
                        console.log(expression);
                        if (firstOperand < 0) {
                            firstOperandTemp = "(" + firstOperandTemp + ")";
                        }
                        expression = firstOperandTemp;
                        refreshExpressionDisplay(); break
                    case "clearEntry":
                        resetCalculator();
                        refreshResultDisplay();
                        refreshExpressionDisplay(); break;
                    case "plusMinus":
                        firstOperand *= -1;
                        firstOperandTemp = "(" + String(firstOperand) + ")";
                        expression = firstOperandTemp;
                        refreshExpressionDisplay();
                }
            }
        } else if (expression.length == 0) {
            if(event.target.classList.contains("number")) {
                firstOperandTemp += event.target.value;     // prvi operand - jedna cifra tipa string
                firstOperand = Number(firstOperandTemp);
                expression = firstOperandTemp;             // dodat prvi operand na string
                console.log("expression 0");
            } else if (event.target.classList.contains("binary")) {
                firstOperand = 0;
                firstOperandTemp = "0";
                operation = event.target.value;
                expression += firstOperandTemp + operation;
                console.log("expression 0, operation binary");
            } else if (event.target.classList.contains("unary")) {
                result = calculateUnaryResult(0, event.target.id);
                expression = printUnaryExpression(0, event.target.id);
                console.log(result);
                firstOperand = result;
                firstOperandTemp = toString(result);
                //expression=0;
                console.log("expression 0, operation unary");
            }
            refreshExpressionDisplay();
            console.log("poziv refresh sa 85");
            refreshResultDisplay();                                         // kraj bloka za prvo pritisnuto dugme!
        } else if (operation.length == 0) {
            console.log("operation length je 0");
            if(event.target.classList.contains("number")) {
                firstOperandTemp += event.target.value;     // prvi operand - jedna cifra tipa string
                console.log(firstOperandTemp)
                firstOperand = Number(firstOperandTemp);
                console.log(firstOperand);
                expression = firstOperandTemp;             // dodat prvi operand na string
                console.log("operation 0 dodajemo cifru na prvioperand");
                refreshExpressionDisplay();
            } else if (event.target.classList.contains("operation")) {
                if (event.target.classList.contains("unary")) {
                    operation = event.target.id;
                    console.log("operacija 0 unarna krece")
                    console.log(typeof firstOperand);
                    result = calculateUnaryResult(firstOperand, operation);
                    expression = printUnaryExpression(firstOperand, operation);
                    console.log(`prvi operand je ${firstOperand} a njegov tip je ${typeof firstOperand}`);
                    console.log(`operacija je ${operation}`);
                    console.log(`rezultat je ${result}`);
                    refreshExpressionDisplay();
                    console.log("poziv sa 107");
                    refreshResultDisplay();
                    
                } else if (event.target.classList.contains("binary")) {
                    operation = event.target.value;
                    expression += operation;
                    refreshExpressionDisplay();
                    console.log("poziv sa 112");
                } 
            }            
        } else if (secondOperand == 0) {
            if (event.target.classList.contains("operation")) {
                if (event.target.classList.contains("unary")) {
                    operation = event.target.id;
                    expression = printUnaryExpression(firstOperand, operation);
                    refreshExpressionDisplay()
                    result = calculateUnaryResult(firstOperand, operation);
                    refreshResultDisplay();
                    // izracunaj unarnu i osvezi prikaz
                } else if (event.target.classList.contains("binary")) {
                    operation = event.target.value;
                    expression = firstOperandTemp + operation;
                    console.log("poziv sa 136");
                    refreshExpressionDisplay();
                    refreshExpressionDisplay();
                }
            } else if (event.target.classList.contains("number")) {
                secondOperandTemp = event.target.value;
                secondOperand = Number (secondOperandTemp);
                expression += secondOperandTemp;
                result = calculateBinaryResult(firstOperand, secondOperand, operation);
                refreshExpressionDisplay();
                refreshResultDisplay();
            }
        } else if (secondOperandTemp.length > 0) {
            console.log("druga cifra drugog operanda");
            if(event.target.classList.contains("number")) {
                if(secondOperand > 0) {
                    secondOperandTemp += event.target.value;
                    secondOperand = Number(secondOperandTemp);
                    expression += event.target.value;
                } else {
                    let temp = secondOperandTemp.slice(1,secondOperandTemp.length-1);
                    secondOperandTemp = temp + event.target.value;
                    secondOperand = Number(secondOperandTemp);
                    secondOperandTemp = "(" + secondOperandTemp + ")";
                    expression = firstOperandTemp + operation + secondOperandTemp;
                }
                result = calculateBinaryResult(firstOperand, secondOperand, operation);
                refreshExpressionDisplay();
                refreshResultDisplay();
            } else if (event.target.id == "equals") {
                result = calculateBinaryResult(firstOperand, secondOperand, operation);
                // expression += "=";
                refreshExpressionDisplay();
                refreshResultDisplay();
                firstOperand = result;
                finishedCalculation=true;
            }
        }
    }
});

