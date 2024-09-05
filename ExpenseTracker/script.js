let expenses = [];
let totalAmount = 0;
let chart;
let dailyChart;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const expenseCtx = document.getElementById('expenseChart').getContext('2d');
const dailyCtx = document.getElementById('dailyExpenseChart').getContext('2d');

function updateChart() {
    const categories = [...new Set(expenses.map(e => e.category))];
    const data = categories.map(cat =>
        expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    );

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(expenseCtx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: data,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function updateDailyChart() {
    const dailyExpenses = expenses.reduce((acc, { date, amount }) => {
        acc[date] = (acc[date] || 0) + amount;
        return acc;
    }, {});

    const labels = Object.keys(dailyExpenses);
    const data = Object.values(dailyExpenses);

    if (dailyChart) {
        dailyChart.destroy();
    }

    dailyChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Amount',
                data: data,
                backgroundColor: '#36a2eb',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    const newExpense = {category, amount, date};
    expenses.push(newExpense);

    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    const newRow = expensesTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');

    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        totalAmount -= newExpense.amount;
        totalAmountCell.textContent = totalAmount;
        expenses = expenses.filter(e => e !== newExpense);
        expensesTableBody.removeChild(newRow);
        updateChart();
        updateDailyChart();
    });

    categoryCell.textContent = newExpense.category;
    amountCell.textContent = newExpense.amount;
    dateCell.textContent = newExpense.date;
    deleteCell.appendChild(deleteBtn);

    updateChart();
    updateDailyChart();
});
