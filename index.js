/**
 * @desc This set of functions forms the logic behind
 *       interpreting click inputs into calculator logic
 * @author Dennis Pavlyuk
 * @date 12-19-19
 */

/**
 * @desc This array serves as the infix expression, as interpreted
 *       by the user's clicks
 */
let inputArray = [];

/**
 * @desc This variable serves as a reference to the output html element
 */
const output = document.getElementsByTagName("output")[0];

//Serves as a way to either input positive numbers or negative
let quantifier = 1;

//checks if number is coming after decimal point
let radix = false;

//if radix == true, then divisor is enabled to place
// fractional amounts after decimal point
let divisor = 10;

let longpress = false;

/**
 * @desc This event listener listens for a long press of
 *       the clear button to clear the whole input array
 */
document.addEventListener("long-press", (e) => {
  if (clickedButton(e)) {
    let dataSet = e.target.dataset;
    if (dataSet.operator) {
      let op = dataSet.operator;
      if (op == "c") {
        longpress = true;
        inputArray == [];
        setOutput(toString(inputArray));
      }
    }
  }
});

/**
 * @desc This event listener is the main show here
 * It listens for all click events.
 * Upon clicking it instanties the function with a
 * parameter of (e). e is an event.
 * @param event e - the click event
 */
document.addEventListener("click", (e) => {
  //clickedButton(event) == Does this click event's source
  // element correspond to a dataset attribute
  if (clickedButton(e)) {
    let dataSet = e.target.dataset;
    // if the dataset contains a number
    if (dataSet.number) {
      let numPress = parseInt(dataSet.number);
      processNumberButtonPush(numPress);
    }
    //if the dataset contains an operation
    else if (dataSet.operator) {
      let op = dataSet.operator;
      processOperatorButtonPush(op);
    }
  }
});

//-----------------------------------------------------------//
//Everything below this line faciliates the listener above this line

/**
 * @desc This processes the click of an operator button
 * @param string operator - single character which is a member of the set {+,-,/,*,=,c}
 * @return void
 */
const processOperatorButtonPush = (operator) => {
  // This call to the function resets radix to false and divisor to 10
  // Because if the previous number in the calculation contained a decimal point
  // Then those variables would have been changed to facilitate that and the assumed number,
  // after the operator may not need a decimal point yet
  resetRadixAndDivisor();

  /**
   * @desc THIS IS THE MOST IMPORTANT CALL IN THIS FUNCTION
   *       It takes the infix expression and takes it to functions
   *       that convert it to postfix expression and computes the postfix
   *       to a single number.
   */
  if (operator == "=") handleEqualsOperator();
  else if (isEmpty(inputArray)) {
    // if array is empty then we will allow the minus operator to negate the first number
    // "The negator"
    if (operator == "-") quantifier *= -1;
    else if (operator == ".") {
      let firstRadix = true;
      inputArray.push(0.0 * quantifier);
      handleRadix(firstRadix);
    }
  } else if (!isEmpty(inputArray)) {
    // if the most recently pushed element is a number
    if (isNumeric(inputArray[inputArray.length - 1])) {
      if (operator == ".") handleRadix();
      else {
        // if 'clear' button is pushed
        if (operator == "c") handleClear();
        //push operator to infix expression
        else inputArray.push(operator);
        // print to output
        setOutput(toString(inputArray));
      }
    }
    // if the last element in infix expression is an operator
    // then simply swap operators to new operator
    else {
      inputArray.pop();
      inputArray.push(operator);
      setOutput(toString(inputArray));
    }
  }
};

const processNumberButtonPush = (num) => {
  // if the infix expression is empty
  if (isEmpty(inputArray) || inputArray[0] == "-") {
    inputArray.push(num * quantifier);
    setOutput(toString(inputArray));
  } else if (
    isNumeric(inputArray[inputArray.length - 1]) ||
    inputArray[inputArray.length - 1] == "."
  )
    handleFurtherNumbersInput(num);
  else {
    //last element in array is operator
    inputArray.push(num);
    setOutput(toString(inputArray));
  }
};

const handleClear = () => {
  if (longpress) {
    longpress = false;
    inputArray = [];
  } else {
    let temp = inputArray[inputArray.length - 1].toString();
    // if number is last digit
    if (temp.length == 1) {
      // clear number, if we were use subsequent logic
      // in else statement then javascript would print
      // NaN because removing all element in an array
      // in javascript == not an array
      inputArray = [];
    } else {
      temp = temp.substr(0, temp.length - 1);
      inputArray[inputArray.length - 1] = parseFloat(temp);
    }
  }
};

/**
 * @desc This function takes a number and does logic to it based on where it is in the inputArray
 * @param {} num
 */
const handleFurtherNumbersInput = (num) => {
  // if there is a decimal point then all further number inputs are fractional
  if (radix) {
    if (inputArray[inputArray.length - 1] >= 0) {
      inputArray[inputArray.length - 1] =
        inputArray[inputArray.length - 1] + num / divisor;
      divisor = divisor * 10;
    } else {
      inputArray[inputArray.length - 1] =
        inputArray[inputArray.length - 1] - num / divisor;
      divisor = divisor * 10;
    }
  }
  // if last thing in array is number then add num to (lastThing * 10)
  else {
    inputArray[inputArray.length - 1] *= 10;
    inputArray[inputArray.length - 1] += num;
  }
  // print output
  setOutput(toString(inputArray));
};

const handleRadix = (first) => {
  radix = true;
  if (first) setOutput(".");
  //fakes the adding of a decimal point by just printing it to the screen
  else setOutput(toString(inputArray) + ".");
};

const handleEqualsOperator = () => {
  // if the infix expression is empty then a press of the '=' button
  // results in a printing of '0'
  if (isEmpty(inputArray)) inputArray.push(0);
  /**
   * @desc Take infix expression and convert to postfix.
   *       Take postfix expression and evaluate to single number
   *       Return single number as sole element of inputArray
   */ else inputArray = [evalPostFix(infixToPostFix(inputArray))];

  console.log(inputArray);
  // Print answer to output
  setOutput(toString(inputArray));
};

const resetRadixAndDivisor = () => {
  radix = false;
  divisor = 10;
};

const setOutput = (displayedNumbers) => {
  output.innerText = displayedNumbers;
};
