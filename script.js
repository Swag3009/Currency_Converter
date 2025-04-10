const convertToList = document.getElementById("convertTo");
const convertedFromList = document.getElementById("convertedFrom");
const container = document.getElementsByClassName("container")[0];
const convertBtn = document.getElementById("convertBtn");
const output = document.getElementById("output");
//Fetching all the countries, code and flag
const fetchCountryDetails = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,currencies,flag",
    );
    if (!response.ok) {
      throw new Error("http error");
    }
    const data = await response.json();
    return data.map((item) => {
      let country = item.name.common;
      let code = Object.keys(item.currencies)[0];
      let flag = item.flag;
      return {
        country,
        code,
        flag,
      };
    });
  } catch (error) {
    throw "Error occured";
  }
};

//Function to create elements of option list
const createList = (countryData, elementAppendTo) => {
  const option = document.createElement("option");
  option.setAttribute("value", countryData.code);
  option.textContent = `${countryData.flag} ${countryData.code} - ${countryData.country}`;
  elementAppendTo.append(option);
};

//Displaying all country list
(async () => {
  try {
    const data = await fetchCountryDetails();
    data.forEach((country) => {
      createList(country, convertToList);
      createList(country, convertedFromList);
    });
  } catch (error) {
    console.error(error);
    container.style.display = "none";
    const errorMsg = document.createElement("h1");
    errorMsg.setAttribute("id", "errorMsg");
    errorMsg.textContent = "Something went wrong!";
    document.getElementById("errorMessage").append(errorMsg);
  }
})();

//Fetch exchange currency rate from api
const fetchExchangeCurrencyData = async () => {
  try {
    const response = await fetch(
      "https://v6.exchangerate-api.com/v6/7e7432c4eb86c8e4479b2f93/latest/USD",
    );
    if (!response.ok) {
      throw new Error("HTTP Error");
    }
    const data = await response.json();
    return data["conversion_rates"];
  } catch (error) {
    console.error(error.message);
    displayErrorMessage();
  }
};

//Display "Something went wrong" on the entire page
const displayErrorMessage = () => {
  const errorMsg = document.createElement("p");
  errorMsg.setAttribute("id", "errMsg");
  errorMsg.textContent = "An error occured, please try again later";
  container.append(errorMsg);
};

//On entering anything other than number display "Invalid Input"
const displayInvalidMsg = () => {
  const inputContainer = document.getElementsByClassName("amountContainer")[0];
  const invalidMsg = document.createElement("p");
  invalidMsg.setAttribute("id", "invalidMsg");
  invalidMsg.textContent = "Enter valid number";
  inputContainer.append(invalidMsg);
  output.textContent = "";
  return true;
};

//On entering right number remove already present "Invalid Input" message
const deleteInvalidMsg = () => {
  const invalidMsg = document.getElementById("invalidMsg");
  invalidMsg?.remove();
  return false;
};

//Calculate currency based on exchange rate
const calculation = (amount, fromCurrency, toCurrency, list) => {
  let fromRate = list[fromCurrency];
  let toRate = list[toCurrency];
  return amount * (toRate / fromRate);
};

//Display output after calculating
const displayOutput = async () => {
  try {
    const currencyData = await fetchExchangeCurrencyData();
    let isInvalidMsgVisible = false;
    convertBtn.addEventListener("click", (event) => {
      const amount = document.getElementById("amount").value;
      const fromCurrency = document.getElementById("convertTo").value;
      const toCurrency = document.getElementById("convertedFrom").value;
      if (currencyData && fromCurrency && toCurrency) {
        if (amount) {
          if (isInvalidMsgVisible) isInvalidMsgVisible = deleteInvalidMsg();
          let value = calculation(
            amount,
            fromCurrency,
            toCurrency,
            currencyData,
          );
          output.textContent = `${amount} ${fromCurrency} = ${value} ${toCurrency}`;
        } else {
          if (!isInvalidMsgVisible) isInvalidMsgVisible = displayInvalidMsg();
        }
      } else {
        throw "Data Error";
      }
    });
  } catch (error) {
    console.error(error);
    displayErrorMessage();
  }
};

displayOutput();
