// birinci ve ikinci qutudaki butonlar
const firstBtns = document.querySelectorAll(".i-have .currency");
const secondBtns = document.querySelectorAll(".i-want .currency");

// birinci ve ikinci qutudaki text yerleri
const firstInput = document.querySelector(".i-have input");
const secondInput = document.querySelector(".i-want input");

// birinci ve ikinci qutudaki info yerleri
const firstInfo = document.querySelector(".i-have .info");
const secondInfo = document.querySelector(".i-want .info");

// istifadeci mesaji
const userMessage = document.querySelector(".user-message");

// Requesti yazandan bir muddet sonra gondermek ucun gozletme funksiyasi
function debounce(func, delay = 250) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function convertvalue(have, want) {
  const haveCurrency = document.querySelector(
    `.i-${have} .currency.active`
  ).id;

  const wantCurrency = document.querySelector(
    `.i-${want} .currency.active`
  ).id;

  let amount = have === "have" ? firstInput.value : secondInput.value;
  let online = navigator.onLine;
  if (online) {
    userMessage.textContent = "";
    fetch(
      `https://api.exchangerate.host/latest?base=${haveCurrency}&symbols=${wantCurrency}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let rate = data.rates[wantCurrency];
        let total = rate * amount;

        if (have === "have") {
          secondInput.value = total.toPrecision(6);
        } else {
          firstInput.value = total.toPrecision(6);
        }

        firstInfo.textContent = `1 ${haveCurrency} = ${rate} ${wantCurrency}`;
        secondInfo.textContent = `1 ${wantCurrency} = ${(1 / rate).toPrecision(
          6
        )} ${haveCurrency}`;
      });
  } else {
    userMessage.textContent = "You are offline."
  }
}

// gozleme funksiyalari
const delayFirstInput = debounce(() => convertvalue("have", "want"), 800);
const delatSecondInput = debounce(() => convertvalue("want", "have"), 800);


// birinci qutudaki valyuta butonlari
firstBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    // requesti gozlet
    delayFirstInput();
    // click zamani diger butonlari deaktivasiya et
    firstBtns.forEach((button) => button.classList.remove("active"));
    // butonu sec
    if(!button.classList.contains("active")) {
      button.classList.add("active");
    }
  });
});

// ikinci qutudaki valyuta butonlari
secondBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    // requesti gozlet
    delayFirstInput();
    
    // click zamani diger butonlari deaktivasiya et
    secondBtns.forEach((button) => button.classList.remove("active"));
    // butonu sec
    if(!button.classList.contains("active")) { 
      button.classList.add("active");
    }
  });
});


// delay ile request gonder
firstInput.addEventListener("keypress", (e) => {
  delayFirstInput();
});

// delay ile request gonder
secondInput.addEventListener("keypress", () => {
  delatSecondInput();
});

