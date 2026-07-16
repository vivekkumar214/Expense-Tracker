// ==========================================
// EXPENSE TRACKER - FINAL SCRIPT
// PART 1
// ==========================================

// ---------- SELECT ELEMENTS ----------

const form = document.getElementById("expenseForm");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

const transactionList = document.getElementById("transactionList");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const budget = document.getElementById("budget");
const budgetInput = document.getElementById("budgetInput");
const saveBudget = document.getElementById("saveBudget");
const budgetWarning = document.getElementById("budgetWarning");

const search = document.getElementById("search");
const filter = document.getElementById("filter");
const dateFilter = document.getElementById("dateFilter");

const exportCSV = document.getElementById("exportCSV");

const darkModeBtn = document.getElementById("darkModeBtn");

// ---------- CHARTS ----------

let pieChart = null;
let barChart = null;

// ---------- EDIT MODE ----------

let editIndex = -1;

// ---------- LOCAL STORAGE ----------

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let monthlyBudget =
Number(localStorage.getItem("budget")) || 0;

// ---------- FORMAT CURRENCY ----------

function formatCurrency(amount){

    return "₹" + Number(amount).toLocaleString("en-IN");

}

// ---------- LOAD BUDGET ----------

budget.innerText = formatCurrency(monthlyBudget);

// ---------- SAVE BUDGET ----------

saveBudget.addEventListener("click",()=>{

    monthlyBudget = Number(budgetInput.value);

    localStorage.setItem("budget",monthlyBudget);

    budget.innerText = formatCurrency(monthlyBudget);

    budgetInput.value="";

    updateSummary();

});

// ---------- SAVE DATA ----------

function saveData(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// ---------- FORM SUBMIT ----------

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const transaction={

        title:title.value,

        amount:Number(amount.value),

        type:type.value,

        category:category.value,

        date:date.value

    };

    if(editIndex===-1){

        transactions.push(transaction);

    }

    else{

        transactions[editIndex]=transaction;

        editIndex=-1;

    }

    saveData();

    displayTransactions();

    updateSummary();

    updateCharts();

    form.reset();

});
// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions(){

    transactionList.innerHTML = "";

    transactions.forEach((item,index)=>{

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${item.title}</td>

            <td>${formatCurrency(item.amount)}</td>

            <td>${item.category}</td>

            <td>${item.type}</td>

            <td>${item.date}</td>

            <td>

                <button class="edit-btn"
                onclick="editTransaction(${index})">

                    Edit

                </button>

                <button
                onclick="deleteTransaction(${index})">

                    Delete

                </button>

            </td>

        `;

        transactionList.appendChild(row);

    });

}

// ==========================================
// EDIT TRANSACTION
// ==========================================

function editTransaction(index){

    const item = transactions[index];

    title.value = item.title;

    amount.value = item.amount;

    type.value = item.type;

    category.value = item.category;

    date.value = item.date;

    editIndex = index;

}

// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(index){

    if(confirm("Delete this transaction?")){

        transactions.splice(index,1);

        saveData();

        displayTransactions();

        updateSummary();

        updateCharts();

    }

}

// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateSummary(){

    let totalIncome = 0;

    let totalExpense = 0;

    transactions.forEach(item=>{

        if(item.type==="Income"){

            totalIncome += item.amount;

        }

        else{

            totalExpense += item.amount;

        }

    });

    income.innerText = formatCurrency(totalIncome);

    expense.innerText = formatCurrency(totalExpense);

    balance.innerText =
    formatCurrency(totalIncome-totalExpense);

    // Budget Warning

    if(monthlyBudget>0 &&
       totalExpense>monthlyBudget){

        budgetWarning.innerText =
        "⚠ Budget Exceeded!";

    }

    else{

        budgetWarning.innerText="";

    }

}
// ==========================================
// SEARCH TRANSACTION
// ==========================================

search.addEventListener("keyup",()=>{

    const value = search.value.toLowerCase();

    const rows =
    document.querySelectorAll("#transactionList tr");

    rows.forEach(row=>{

        row.style.display =
        row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });

});

// ==========================================
// FILTER TRANSACTION
// ==========================================

filter.addEventListener("change",()=>{

    const rows =
    document.querySelectorAll("#transactionList tr");

    rows.forEach(row=>{

        if(filter.value==="All"){

            row.style.display="";

        }

        else if(row.children[3].innerText===filter.value){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

});

// ==========================================
// DATE FILTER
// ==========================================

dateFilter.addEventListener("change",()=>{

    const selectedDate = dateFilter.value;

    const rows =
    document.querySelectorAll("#transactionList tr");

    rows.forEach(row=>{

        if(selectedDate===""){

            row.style.display="";

        }

        else if(row.children[4].innerText===selectedDate){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

});

// ==========================================
// EXPORT CSV
// ==========================================

function downloadCSV(){

    let csv =
    "Title,Amount,Category,Type,Date\n";

    transactions.forEach(item=>{

        csv +=
`${item.title},${item.amount},${item.category},${item.type},${item.date}\n`;

    });

    const blob = new Blob([csv],{
        type:"text/csv"
    });

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "ExpenseTracker.csv";

    a.click();

    URL.revokeObjectURL(url);

}

exportCSV.addEventListener("click",downloadCSV);

// ==========================================
// DARK MODE
// ==========================================

if(localStorage.getItem("darkMode")==="ON"){

    document.body.classList.add("dark");

}

darkModeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("darkMode","ON");

    }

    else{

        localStorage.setItem("darkMode","OFF");

    }

});
// ==========================================
// CHARTS
// ==========================================

function updateCharts(){

    let food = 0;
    let travel = 0;
    let shopping = 0;
    let education = 0;
    let bills = 0;
    let medical = 0;
    let entertainment = 0;
    let other = 0;

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(item=>{

        if(item.type==="Income"){

            totalIncome += item.amount;

        }

        else{

            totalExpense += item.amount;

            switch(item.category){

                case "Food":
                    food += item.amount;
                    break;

                case "Travel":
                    travel += item.amount;
                    break;

                case "Shopping":
                    shopping += item.amount;
                    break;

                case "Education":
                    education += item.amount;
                    break;

                case "Bills":
                    bills += item.amount;
                    break;

                case "Medical":
                    medical += item.amount;
                    break;

                case "Entertainment":
                    entertainment += item.amount;
                    break;

                default:
                    other += item.amount;

            }

        }

    });

    // Destroy old charts

    if(pieChart){

        pieChart.destroy();

    }

    if(barChart){

        barChart.destroy();

    }

    // Pie Chart

    pieChart = new Chart(

        document.getElementById("pieChart"),

        {

            type:"pie",

            data:{

                labels:[
                    "Food",
                    "Travel",
                    "Shopping",
                    "Education",
                    "Bills",
                    "Medical",
                    "Entertainment",
                    "Other"
                ],

                datasets:[{

                    data:[
                        food,
                        travel,
                        shopping,
                        education,
                        bills,
                        medical,
                        entertainment,
                        other
                    ]

                }]

            }

        }

    );

    // Bar Chart

    barChart = new Chart(

        document.getElementById("barChart"),

        {

            type:"bar",

            data:{

                labels:[
                    "Income",
                    "Expense"
                ],

                datasets:[{

                    label:"Amount",

                    data:[
                        totalIncome,
                        totalExpense
                    ]

                }]

            }

        }

    );

}

// ==========================================
// INITIAL LOAD
// ==========================================

displayTransactions();

updateSummary();

updateCharts();