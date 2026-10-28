
/* =========================================
   FIA'O - DEBTS & PAYMENTS
   Archivo: asset/js/credit.js
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // CLIENTES
    const customers = {
        ramon: { name: "Ramón Batista", debt: 35, limit: 100 },
        carlos: { name: "Carlos Gómez", debt: 12.50, limit: 80 },
        ana: { name: "Ana Martínez", debt: 20, limit: 120 }
    };

    // ELEMENTOS HTML
    const customerSelect = document.getElementById("customerSelect");
    const customerName = document.getElementById("customerName");
    const currentDebt = document.getElementById("currentDebt");
    const creditLimit = document.getElementById("creditLimit");
    const limitLabel = document.getElementById("limitLabel");
    const progressFill = document.getElementById("progressFill");
    const usageLabel = document.getElementById("usageLabel");

    const blockingToggle = document.getElementById("blockingToggle");
    const toggleStatus = document.getElementById("toggleStatus");

    const paymentForm = document.getElementById("paymentForm");
    const paymentAmount = document.getElementById("paymentAmount");
    const formMessage = document.getElementById("formMessage");
    const markPaidButton = document.getElementById("markPaidButton");

    const historyList = document.getElementById("historyList");
    const historyButton = document.getElementById("historyButton");

    const activityButton = document.getElementById("activityButton");
    const activityMessage = document.getElementById("activityMessage");

    const languageButton = document.getElementById("languageButton");
    const themeButton = document.getElementById("themeButton");

    let automaticBlockingEnabled = true;

    // FORMATO DE DINERO
    function money(value) {
        return "B/. " + Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // CLIENTE SELECCIONADO
    function getSelectedCustomer() {
        return customers[customerSelect.value];
    }

    // ACTUALIZAR INFORMACIÓN DEL CLIENTE
    function updateCustomer() {
        const customer = getSelectedCustomer();

        if (!customer) return;

        customerName.textContent = customer.name;
        currentDebt.textContent = money(customer.debt);
        creditLimit.textContent = money(customer.limit);
        limitLabel.textContent = money(customer.limit);

        const percent = customer.limit > 0
            ? Math.min(100, Math.round((customer.debt / customer.limit) * 100))
            : 0;

        progressFill.style.width = percent + "%";
        usageLabel.textContent = percent + "% used";

        if (!automaticBlockingEnabled) {
            toggleStatus.textContent = "Automatic blocking is disabled.";
        } else if (customer.debt >= customer.limit) {
            toggleStatus.textContent = "This customer has reached the credit limit.";
        } else {
            toggleStatus.textContent = "Automatic blocking is enabled.";
        }
    }

    // AGREGAR MOVIMIENTO AL HISTORIAL
    function addHistoryItem(title, detail, amount, paid) {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-US", {
            month: "short"
        }).toUpperCase();

        const item = document.createElement("div");
        item.className = "history-item";

        const dateBadge = document.createElement("div");
        dateBadge.className = "date-badge";

        const dayText = document.createElement("b");
        dayText.textContent = day;

        const monthText = document.createElement("span");
        monthText.textContent = month;

        dateBadge.append(dayText, monthText);

        const icon = document.createElement("div");
        icon.className = "round-icon";
        icon.textContent = paid ? "💵" : "🛒";

        const description = document.createElement("div");
        description.className = "history-description";

        const titleText = document.createElement("b");
        titleText.textContent = title;

        const detailText = document.createElement("small");
        detailText.textContent = detail;

        description.append(titleText, detailText);

        const amountText = document.createElement("strong");
        amountText.className = paid ? "amount paid-amount" : "amount";
        amountText.textContent = (paid ? "−" : "") + money(amount);

        const status = document.createElement("span");
        status.className = paid ? "status paid" : "status pending";
        status.textContent = paid ? "Paid" : "Pending";

        item.append(dateBadge, icon, description, amountText, status);
        historyList.prepend(item);
    }

    // AGREGAR MOVIMIENTO A ACTIVIDAD RECIENTE
    function addActivity(name, detail, paid = true) {
        const activityCard = document.querySelector(".activity-card");

        const item = document.createElement("div");
        item.className = "activity-item";

        const icon = document.createElement("span");
        icon.className = "activity-icon";
        icon.textContent = paid ? "💵" : "🛒";

        const info = document.createElement("div");

        const nameText = document.createElement("b");
        nameText.textContent = name;

        const detailText = document.createElement("small");
        detailText.textContent = detail;

        info.append(nameText, detailText);

        const time = document.createElement("span");
        time.className = "activity-time";
        time.appendChild(document.createTextNode("Just now "));

        const dot = document.createElement("i");
        dot.className = paid ? "dot green" : "dot orange";
        time.appendChild(dot);

        item.append(icon, info, time);

        activityCard.insertBefore(item, activityButton);
    }

    // REGISTRAR UN PAGO
    function registerPayment(amount, payFullBalance = false) {
        const customer = getSelectedCustomer();

        if (!customer) return;

        if (customer.debt <= 0) {
            formMessage.textContent = "This customer has no outstanding debt.";
            return;
        }

        if (
            !payFullBalance &&
            (!Number.isFinite(amount) || amount <= 0)
        ) {
            formMessage.textContent = "Enter a valid payment amount.";
            paymentAmount.focus();
            return;
        }

        // EVITAR PAGOS SUPERIORES A LA DEUDA
        const appliedAmount = payFullBalance
            ? customer.debt
            : Math.min(amount, customer.debt);

        customer.debt = Math.max(
            0,
            Number((customer.debt - appliedAmount).toFixed(2))
        );

        updateCustomer();

        addHistoryItem(
            "Payment Received",
            "Abono · " + customer.name,
            appliedAmount,
            true
        );

        addActivity(
            customer.name,
            "Paid " + money(appliedAmount),
            true
        );

        if (customer.debt === 0) {
            formMessage.textContent =
                "Payment of " + money(appliedAmount) +
                " registered. " + customer.name +
                "'s balance is now paid.";
        } else {
            formMessage.textContent =
                "Payment of " + money(appliedAmount) +
                " registered for " + customer.name +
                ". Remaining debt: " + money(customer.debt) + ".";
        }

        paymentAmount.value = "";
    }

    // CAMBIAR CLIENTE
    customerSelect.addEventListener("change", () => {
        updateCustomer();
        formMessage.textContent = "";
    });

    // BLOQUEO AUTOMÁTICO
    blockingToggle.addEventListener("click", () => {
        automaticBlockingEnabled = !automaticBlockingEnabled;

        blockingToggle.classList.toggle(
            "active",
            automaticBlockingEnabled
        );

        blockingToggle.setAttribute(
            "aria-pressed",
            String(automaticBlockingEnabled)
        );

        updateCustomer();
    });

    // FORMULARIO DE PAGO
    paymentForm.addEventListener("submit", event => {
        event.preventDefault();

        const selectedType = document.querySelector(
            'input[name="paymentType"]:checked'
        );

        if (selectedType && selectedType.value === "full") {
            registerPayment(0, true);
            return;
        }

        registerPayment(Number(paymentAmount.value), false);
    });

    // MARCAR DEUDA COMPLETA COMO PAGADA
    markPaidButton.addEventListener("click", () => {
        registerPayment(0, true);
    });

    // MOSTRAR U OCULTAR HISTORIAL
    historyButton.addEventListener("click", () => {
        historyList.classList.toggle("expanded");

        historyButton.textContent =
            historyList.classList.contains("expanded")
                ? "Show Less ↑"
                : "View Full History →";
    });

    // ACTIVIDAD RECIENTE
    activityButton.addEventListener("click", () => {
        activityMessage.textContent =
            "Showing the latest customer transactions.";
    });

    // CAMBIAR INDICADOR DE IDIOMA
    languageButton.addEventListener("click", () => {
        languageButton.textContent =
            languageButton.textContent.includes("ES")
                ? "🌐 EN"
                : "🌐 ES";
    });

    // =========================================
    // MODO CLARO Y OSCURO
    // Utiliza la misma clave que la página Home
    // =========================================

    function applyTheme(theme) {
        const isDark = theme === "dark";

        document.body.classList.toggle("dark-mode", isDark);
        themeButton.textContent = isDark ? "☀" : "☾";
        themeButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    // CARGAR TEMA GUARDADO
    const savedTheme = localStorage.getItem("fiao-theme") || "light";
    applyTheme(savedTheme);

    // CAMBIAR TEMA Y GUARDAR PREFERENCIA
    themeButton.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-mode");
        const newTheme = isDark ? "dark" : "light";

        localStorage.setItem("fiao-theme", newTheme);
        applyTheme(newTheme);
    });

    // INICIALIZAR PÁGINA
    updateCustomer();

});
