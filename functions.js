/**
 * @desc This function takes an infix expression and converts to a postfix expression
 *       using an array (operatorStack), that acts like a stack
 *
 *  @see "Postfix notation is a notation for writing arithmetic expressions
 *  in which the operands appear before their operators. There are no precedence
 *  rules to learn, and parentheses are never needed. Because of this simplicity,
 *  some popular hand-held calculators use postfix notation to avoid the complications
 *  of the multiple parentheses required in nontrivial infix expressions." -College of Staten Island
 * @param infixArray
 * @return postfix - array
 */
function infixToPostFix(infixArray) {
  // array acting as postfix expression
  let postFix = [];
  let operatorStack = [];
  for (let count = 0; count < infixArray.length; count++) {
    // count-th element
    let thisToken = infixArray[count];

    // always push numbers in postfix as operands are in the beginning
    // of the postfix expression
    if (isNumeric(thisToken)) postFix.push(thisToken);

    //Ommited steps c,d from notes
    if (isOperator(thisToken)) {
      // if this is the first operator of the infix expression then
      // push onto operator stack
      if (operatorStack.length == 0) operatorStack.push(thisToken);
      else {
        let stackToken = operatorStack[operatorStack.length - 1];

        //if thisToken has higher precedence then push it onto stack
        if (getPrecedence(stackToken) < getPrecedence(thisToken))
          operatorStack.push(thisToken);

        while (
          operatorStack.length > 0 &&
          getPrecedence(stackToken) >= getPrecedence(thisToken)
        ) {
          // if stackToken precedence is higher than thisToken then
          // pop it off the operatorStack and onto the postFix
          postFix.push(stackToken);
          operatorStack.pop();
          stackToken = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(thisToken);
      }
    }
  }
  while (operatorStack.length > 0) {
    // pop off rest of operator stack
    postFix.push(operatorStack.pop());
  }
  return postFix;
}

/**
 * @desc This functions takes the postfix expression and returns the evaluated product,
 *       using an operand stack
 * @param {*} postfixArray
 * @return float operandStack[0]
 */
function evalPostFix(postfixArray) {
  let operandStack = [];
  for (let count = 0; count < postfixArray.length; count++) {
    let thisToken = postfixArray[count];
    if (isNumeric(thisToken)) operandStack.push(thisToken);
    else if (isOperator(thisToken)) {
      let operand1, operand2;
      if (operandStack.length != 0) operand2 = operandStack.pop();
      if (operandStack.length != 0) operand1 = operandStack.pop();

      /**
       * @desc This is literally all of the logic behind the calculator
       */
      let result =
        thisToken == "+"
          ? operand1 + operand2
          : thisToken == "-"
          ? operand1 - operand2
          : thisToken == "*"
          ? operand1 * operand2
          : thisToken == "/"
          ? operand1 / operand2
          : thisToken == "%"
          ? operand1 % operand2
          : 0;
      console.log(result);
      operandStack.push(result);
    }
  }
  // There should only be one element left, the answer
  if (operandStack.length == 1) return operandStack[0];
  // Ya done goofed
  else {
    alert("error");
    return -1;
  }
}
// used in isOperator function
const operatorArray = ["+", "-", "*", "/", "=", "%"];

const isEmpty = (inArray) => inArray.length == 0;

const clickedButton = (eventClick) => eventClick.target.dataset;

// returns stringified version of array without commas
const toString = (inArray) => inArray.toString().replace(/,/g, "");

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

const isOperator = (n) => operatorArray.includes(n);

/**
 * @desc Takes an operator and determines its precedence based on PEMDAS
 *       Includes modulo even though no button exists for it
 * @param {string} char
 */
const getPrecedence = (char) => {
  if (char == "+" || char == "-") return 11;

  if (char == "*" || char == "/" || char == "%") return 12;

  return -1;
};
