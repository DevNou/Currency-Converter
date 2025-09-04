const converterForm = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const loader = document.getElementById("loader");

window.addEventListener("load", fetchCurrencies);
converterForm.addEventListener("submit", convertCurrency);

async function fetchCurrencies() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();
    const currencyOptions = Object.keys(data.rates);
    
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

    currencyOptions.forEach(currency => {
      const option1 = new Option(currency, currency);
      const option2 = new Option(currency, currency);
      fromCurrency.add(option1);
      toCurrency.add(option2);
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
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  if (!fromCurrencyValue || !toCurrencyValue) {
    alert("Please select both currencies");
    return;
  }

  loader.classList.remove('hidden');
  resultDiv.textContent = '';

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrencyValue}`);
    const data = await response.json();
    const rate = data.rates[toCurrencyValue];
    const convertedAmount = (amount * rate).toFixed(2);
    resultDiv.textContent = `${amount} ${fromCurrencyValue} = ${convertedAmount} ${toCurrencyValue}`;
  } catch(err) {
    resultDiv.textContent = 'Conversion failed. Try again.';
    console.error(err);
  } finally {
    loader.classList.add('hidden');
  }
}
