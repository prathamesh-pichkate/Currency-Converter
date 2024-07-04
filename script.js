const BaseURL = "https://v6.exchangerate-api.com/v6/9e81ce281c549b452b22f7d5/latest";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Include the countryList from the codes.js file

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        select.append(newOption);
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
    }

    select.addEventListener("change", (event) => {
        updateFlag(event.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtValue = amount.value;
    if (amtValue === "" || amtValue < 1) {
        amtValue = 1;
        amount.value = "1";
    }

    const URL = `${BaseURL}/${fromCurr.value}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rate: ${response.status}`);
        }
        let data = await response.json();
        console.log('Fetched data:', data); // Debugging line
        let rate = data.conversion_rates[toCurr.value];
        if (!rate) {
            throw new Error("Invalid currency conversion rate");
        }
        let finalAmount = amtValue * rate;

        msg.innerText = `${amtValue} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate";
        console.error('Error fetching exchange rate:', error); // Debugging line
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
