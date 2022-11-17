// Currency buttons
const firstBtns = document.querySelectorAll(".i-have .currency");
const secondBtns = document.querySelectorAll(".i-want .currency");

// Input fields
const firstInput = document.querySelector(".i-have input");
const secondInput = document.querySelector(".i-want input");

// Info fields
const firstInfo = document.querySelector(".i-have .info");
const secondInfo = document.querySelector(".i-want .info");

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

// gozleme funksiyalari
const debouncedFromInput = debounce(() => convert("have", "want"), 800);
const debouncedToInput = debounce(() => convert("want", "have"), 800);


// birinci
firstBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    debouncedFromInput();
    firstBtns.forEach((button) => button.classList.remove("active"));
    if(!button.classList.contains("active")) {
      button.classList.add("active");
    }
  });
});

secondBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    debouncedFromInput();
    secondBtns.forEach((button) => button.classList.remove("active"));
    if(!button.classList.contains("active")) { 
      button.classList.add("active");
    }
  });
});

function convert(have, want) {
  const haveCurrency = document.querySelector(
    `.i-${have} .currency.active`
  ).id;

  const wantCurrency = document.querySelector(
    `.i-${want} .currency.active`
  ).id;

  let amount = have === "have" ? firstInput.value : secondInput.value;
  let online = navigator.onLine;
  if (online) {
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
    // popupEl.classList.replace("hide", "show");
  }
}

firstInput.addEventListener("keypress", (e) => {
  debouncedFromInput();
});

secondInput.addEventListener("keypress", () => {
  debouncedToInput();
});

