const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passStrength = document.querySelector("[data-indicator]");
const passDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copy = document.querySelector("[data-copy]");
const copyButton = document.querySelector("[data-copy-button]");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const upperCase = document.querySelector("#uppercase");
const lowerCase = document.querySelector("#lowercase");
const digits = document.querySelector("#digits");
const specialCharacters = document.querySelector("#specialCharacters");
const generateBtn = document.querySelector(".generate-button");

const symbol = "!@#$%^&*()_+-=}{:?><[];',./~'";
let password = "";
let passwordLen = 10;
let checkCount = 0;

setIndicator("#ccc")

handleSlider();

// handle Slider
function handleSlider() {
  inputSlider.value = passwordLen;
  lengthDisplay.innerHTML = passwordLen;

  const max =inputSlider.max
  const min = inputSlider.min
  console.log(`max ${max} min ${min} ${(passwordLen-min)*100/(max-min)}`)

  inputSlider.style.backgroundSize= ((passwordLen-min)*100/(max-min))+"% 100%";
}

// Strength Check
function setIndicator(color) {
  passStrength.style.backgroundColor = color;
  passStrength.style.boxShadow=`0px 0px 15px 5px ${color}`
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSpecialChar() {
  const ranNum = getRandomInteger(0, symbol.length - 1);
  return symbol.charAt(ranNum);
}

// Strength Check
function strengthCheck() {
  let hasUpperCase = false;
  let hasLowerCase = false;
  let hasSpecialChar = false;
  let hasDigit = false;

  if (upperCase.checked) hasUpperCase = true;
  if (lowerCase.checked) hasLowerCase = true;
  if (specialCharacters.checked) hasSpecialChar = true;
  if (digits.checked) hasDigit = true;

  const strength = [
    hasDigit && hasSpecialChar && hasLowerCase && hasUpperCase && passwordLen >= 8,
    (hasDigit || hasSpecialChar) && (hasLowerCase || hasUpperCase) && passwordLen > 6,
  ];

  if (strength[0]) {
    setIndicator("green");
  } else if (strength[1]) {
    setIndicator("yellow");
  } else {
    setIndicator("red");
  }
}

// copy function

async function copyTxt() {
  try {
    await navigator.clipboard.writeText(passDisplay.value);
    copyMsg.innerHTML = "copied";
  } catch (e) {
    copyMsg.innerHTML = "failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 1200);
}


inputSlider.addEventListener("input", (e) => {
  passwordLen = e.target.value;
  handleSlider();
});


copyButton.addEventListener("click", (e) => {
  if (passDisplay.value.length > 0) copyTxt();

});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkBox) => {
    if (checkBox.checked) checkCount++;
  })

  if (checkCount > passwordLen) {
    passwordLen = checkCount;
    handleSlider();
  }
}



allCheckBox.forEach((checkBox) => {
  checkBox.addEventListener('change', handleCheckBoxChange)
  console.log(checkCount)
})


  // Generate Button

generateBtn.addEventListener('click',()=>{

  if(checkCount == 0)return;
  if (checkCount > passwordLen) {
    passwordLen = checkCount;
    handleSlider();
  }
  let funArr=[];

  password="";

  if(upperCase.checked)funArr.push(generateUpperCase);
  if(specialCharacters.checked)funArr.push(generateSpecialChar);
  if(lowerCase.checked)funArr.push(generateLowerCase);
  if(digits.checked)funArr.push(getRandomNumber);

  for(let i =0 ; i<funArr.length;i++){
    password+=funArr[i]();
  }


  // Remaining Addition

  for(let i=0;i<passwordLen-funArr.length;i++){
    let randomIdx = getRandomInteger(0,funArr.length-1);
    password+=funArr[randomIdx]();
  }
  password=shufflePassword(Array.from(password));
  passDisplay.value=password;

  strengthCheck();

})

function shufflePassword(array){
  let pass="";
  let n=array.length;
  for(let i=n-1;i>0;i--){
      let j = Math.floor(Math.random() * (i+1));
      let temp = array[i];
      array[i]=array[j];
      array[j]=temp;
  }
  array.forEach((e)=>{
    pass+=e;
  })
  return pass;

}


