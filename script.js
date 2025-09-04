const converterForm = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const loader = document.getElementById("loader");

const fromSearch = document.getElementById("from-search");
const toSearch = document.getElementById("to-search");

const modeSwitch = document.getElementById("mode-switch");
const modeLabel = document.getElementById("mode-label");

let currencyList = [];

window.addEventListener("load", fetchCurrencies);
converterForm.addEventListener("submit", convertCurrency);

fromSearch.addEventListener("input", () => filterSelect(fromSearch, fromCurrency));
toSearch.addEventListener("input", () => filterSelect(toSearch, toCurrency));

modeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  modeLabel.textContent = document.body.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";
});

function filterSelect(input, select) {
  const filter = input.value.toUpperCase();
  const options = select.options;
  for (let i = 0; i < options.length; i++) {
    const txt = options[i].textContent || options[i].innerText;
    options[i].style.display = txt.toUpperCase().includes(filter) ? "" : "none";
  }
}

async function fetchCurrencies() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();

    currencyList = Object.keys(data.rates).sort();

    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

    currencyList.forEach(currency => {
      fromCurrency.add(new Option(currency, currency));
      toCurrency.add(new Option(currency, currency));
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
  } catch(err) {
    alert('Failed to load currencies. Please refresh.');
    console.error(err);
  }
}

async function convertCurrency(e) {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const fromCurrencyValue = fromCurrency.value.toUpperCase();
  const toCurrencyValue = toCurrency.value.toUpperCase();

  if (!currencyList.includes(fromCurrencyValue) || !currencyList.includes(toCurrencyValue)) {
    alert("Please select valid currencies from the list");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  loader.classList.remove('hidden');
  resultDiv.textContent = '';

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrencyValue}`);
    const data = await response.json();
    const rate = data.rates[toCurrencyValue];
    if (!rate) throw new Error("Currency not found");
    const convertedAmount = (amount * rate).toFixed(2);
    resultDiv.textContent = `${amount} ${fromCurrencyValue} = ${convertedAmount} ${toCurrencyValue}`;
  } catch(err) {
    resultDiv.textContent = 'Conversion failed. Check currency codes.';
    console.error(err);
  } finally {
    loader.classList.add('hidden');
  }
}
