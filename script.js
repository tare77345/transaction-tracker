
let transactions = [];

let editingIndex = null;


const descriptionElement = document.getElementById("description");
const amountElement = document.getElementById("amount");
const typeElement = document.getElementById("type");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");
const balanceElement = document.getElementById("balance");
const resetElement = document.getElementById("reset");
const formErrorElement = document.getElementById("form-error");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");



function onLoad() {

    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);

        renderTransactions();
        showValues();
    }

}
onLoad();

resetElement.addEventListener("click", function (event) {
    event.preventDefault();

    const confirmed = confirm("Are you sure you want to reset the tracker?");
    
    if(!confirmed) {
        return;
    }

    transactions = [];

    transactionForm.reset();

    editingIndex = null;

    submitButton.textContent = "Add Transaction";

    cancelButton.style.display = "none";

    localStorage.removeItem("transactions");

    formErrorElement.textContent = "";

    renderTransactions();
    showValues();
});

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const transaction = {
        description: descriptionElement.value.trim(),
        amount: Number(amountElement.value),
        type: typeElement.value
    };

    if (transaction.description === "" || transaction.amount <= 0) {

        formErrorElement.textContent =
            "Please enter a valid description and amount!";
        return;

    } else {
        if (editingIndex === null) {

            formErrorElement.textContent = "";

            transactions.push(transaction);
            localStorage.setItem("transactions", JSON.stringify(transactions));
            transactionForm.reset();

            renderTransactions();
            showValues();

        } else {
            transactions[editingIndex] = transaction;

            editingIndex = null;
            cancelButton.style.display = "none";

            submitButton.textContent = "Add Transaction";

            localStorage.setItem("transactions", JSON.stringify(transactions));
            transactionForm.reset();

            renderTransactions();
            showValues();
        }

    }

});

 cancelButton.addEventListener("click", function () {
            editingIndex = null;

            submitButton.textContent = "Add Transaction";

            cancelButton.style.display = "none";

            transactionForm.reset();
            
            formErrorElement.textContent = "";
});

function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction, index) {
        const createdLiElement = document.createElement("li");

        const sign = transaction.type === "income" ? "+" : "-";

        const descriptionSpan = document.createElement("span");
        const amountSpan = document.createElement("span");
        const typeSpan = document.createElement("span");

        descriptionSpan.classList.add("transaction-description");
        amountSpan.classList.add("transaction-amount");
        typeSpan.classList.add("transaction-type");

        if (transaction.type === "income") {
            amountSpan.classList.add("income");
        } else {
            amountSpan.classList.add("expense");
        }

        descriptionSpan.textContent = transaction.description;
        amountSpan.textContent = `${sign}${transaction.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        })}`;
        typeSpan.textContent = transaction.type;

        createdLiElement.appendChild(descriptionSpan);
        createdLiElement.appendChild(amountSpan);
        createdLiElement.appendChild(typeSpan);

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.dataset.index = index;

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.dataset.index = index;

       

        editButton.addEventListener("click", function () {
            const index = Number(editButton.dataset.index);

            editingIndex = index;
            submitButton.textContent = "Update Transaction";
            cancelButton.style.display = "inline-block";

            const transaction = transactions[index];

            descriptionElement.value = transaction.description;
            amountElement.value = transaction.amount;
            typeElement.value = transaction.type;

        });

        deleteButton.addEventListener("click", function () {

            const confirmed = confirm("Are you sure you want to delete this transaction?");

            if(!confirmed) {
                return;
            }

            const index = Number(deleteButton.dataset.index);

            transactions.splice(index, 1);

            localStorage.setItem("transactions", JSON.stringify(transactions));

            editingIndex = null;

            submitButton.textContent = "Add Transaction";

            cancelButton.style.display = "none";

            formErrorElement.textContent = "";

            transactionForm.reset();

            renderTransactions();
            showValues();

        });

        createdLiElement.appendChild(editButton);
        createdLiElement.appendChild(deleteButton);

        transactionList.appendChild(createdLiElement);

    });
}

function sumIncomes() {
    let income = 0;
    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        }
    });
    return income;
}

function sumExpenses() {
    let expense = 0;
    transactions.forEach(function (transaction) {
        if (transaction.type === "expense") {
            expense += transaction.amount;
        }
    });
    return expense;
}

function showValues() {
    const showIncome = sumIncomes();
    incomeElement.textContent = `${showIncome.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })}`;
    const showExpenses = sumExpenses();
    expensesElement.textContent = `${showExpenses.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })}`;
    const balance = showIncome - showExpenses;
    balanceElement.textContent = `${balance.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })}`;
}

