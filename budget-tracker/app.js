document.addEventListener("DOMContentLoaded", () => {
  const addExpenseButton = document.getElementById("addExpenseButton");
  const addGainButton = document.getElementById("addGainButton");
  const expenseList = document.getElementById("expenseList");
  const expenseNameInput = document.getElementById("expenseName");
  const expenseCategoryInput = document.getElementById("expenseCategory");
  const expenseAmountInput = document.getElementById("expenseAmount");
  const gainNameInput = document.getElementById("gainName");
  const gainAmountInput = document.getElementById("gainAmount");
  const totalAmountDisplay = document.getElementById("totalAmount");
  const totalIncomeDisplay = document.getElementById("totalIncome");
  const netBalanceDisplay = document.getElementById("netBalance");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
  let totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  let totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
  let netBalance = totalIncome - totalExpense;

  totalAmountDisplay.textContent = totalExpense.toFixed(2);
  totalIncomeDisplay.textContent = totalIncome.toFixed(2);
  netBalanceDisplay.textContent = netBalance.toFixed(2);

  function renderExpensesAndIncomes() {
    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const expenseDiv = document.createElement("div");
      expenseDiv.classList.add(
        "bg-white",
        "text-gray-800",
        "p-4",
        "rounded-lg",
        "shadow-lg",
        "flex",
        "justify-between",
        "items-center",
        "transition-all",
        "duration-1000",
        "hover:bg-gradient-to-r",
        "hover:from-yellow-400",
        "hover:to-red-500",
        "hover:scale-105"
      );
      expenseDiv.innerHTML = `
                <div>
                    <p class="text-lg font-semibold">${expense.name}</p>
                    <p class="text-sm text-gray-600">Amount: $${expense.amount.toFixed(
                      2
                    )} - Category: ${expense.category}</p>
                </div>
                <button class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 remove-button" data-id="${
                  expense.id
                }">
                    Remove
                </button>
            `;
      expenseList.appendChild(expenseDiv);
    });

    incomes.forEach((income) => {
      const incomeDiv = document.createElement("div");
      incomeDiv.classList.add(
        "bg-white",
        "text-gray-800",
        "p-4",
        "rounded-lg",
        "shadow-lg",
        "flex",
        "justify-between",
        "items-center",
        "transition-all",
        "duration-1000",
        "hover:bg-gradient-to-r",
        "hover:from-green-400",
        "hover:to-teal-500",
        "hover:scale-105"
      );
      incomeDiv.innerHTML = `
                <div>
                    <p class="text-lg font-semibold">${income.name}</p>
                    <p class="text-sm text-gray-600">Amount: $${income.amount.toFixed(
                      2
                    )}</p>
                </div>
                <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 remove-button" data-id="${
                  income.id
                }">
                    Remove
                </button>
            `;
      expenseList.appendChild(incomeDiv);
    });

    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = parseInt(event.target.getAttribute("data-id"));
        if (event.target.classList.contains("bg-red-500")) {
          removeExpense(itemId);
        } else {
          removeIncome(itemId);
        }
      });
    });
  }

  function addExpense() {
    const expenseName = expenseNameInput.value.trim();
    const expenseCategory = expenseCategoryInput.value.trim();
    const expenseAmount = parseFloat(expenseAmountInput.value);

    if (
      !expenseName ||
      !expenseCategory ||
      isNaN(expenseAmount) ||
      expenseAmount <= 0
    ) {
      alert("Please enter a valid expense name, category, and amount.");
      return;
    }

    const expense = {
      id: Date.now(),
      name: expenseName,
      category: expenseCategory,
      amount: expenseAmount,
    };

    expenses.push(expense);
    totalExpense += expenseAmount;
    netBalance = totalIncome - totalExpense;

    localStorage.setItem("expenses", JSON.stringify(expenses));

    totalAmountDisplay.textContent = totalExpense.toFixed(2);
    netBalanceDisplay.textContent = netBalance.toFixed(2);

    expenseNameInput.value = "";
    expenseCategoryInput.value = "";
    expenseAmountInput.value = "";

    renderExpensesAndIncomes();
  }

  // Add Income Function
  function addIncome() {
    const gainName = gainNameInput.value.trim();
    const gainAmount = parseFloat(gainAmountInput.value);

    if (!gainName || isNaN(gainAmount) || gainAmount <= 0) {
      alert("Please enter a valid income name and amount.");
      return;
    }

    const income = {
      id: Date.now(),
      name: gainName,
      amount: gainAmount,
    };

    incomes.push(income);
    totalIncome += gainAmount;
    netBalance = totalIncome - totalExpense;

    localStorage.setItem("incomes", JSON.stringify(incomes));

    totalIncomeDisplay.textContent = totalIncome.toFixed(2);
    netBalanceDisplay.textContent = netBalance.toFixed(2);

    gainNameInput.value = "";
    gainAmountInput.value = "";

    renderExpensesAndIncomes();
  }

  function removeExpense(id) {
    const expenseIndex = expenses.findIndex((exp) => exp.id === id);
    if (expenseIndex !== -1) {
      totalExpense -= expenses[expenseIndex].amount;
      expenses.splice(expenseIndex, 1);

      localStorage.setItem("expenses", JSON.stringify(expenses));

      totalAmountDisplay.textContent = totalExpense.toFixed(2);
      netBalance = totalIncome - totalExpense;
      netBalanceDisplay.textContent = netBalance.toFixed(2);

      renderExpensesAndIncomes();
    }
  }

  function removeIncome(id) {
    const incomeIndex = incomes.findIndex((income) => income.id === id);
    if (incomeIndex !== -1) {
      totalIncome -= incomes[incomeIndex].amount;
      incomes.splice(incomeIndex, 1);

      localStorage.setItem("incomes", JSON.stringify(incomes));

      totalIncomeDisplay.textContent = totalIncome.toFixed(2);
      netBalance = totalIncome - totalExpense;
      netBalanceDisplay.textContent = netBalance.toFixed(2);

      renderExpensesAndIncomes();
    }
  }

  addExpenseButton.addEventListener("click", addExpense);
  addGainButton.addEventListener("click", addIncome);

  renderExpensesAndIncomes();
});
