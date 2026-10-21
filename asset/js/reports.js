
/* ========================================
   FIA'O REPORTS - JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", function () {

	/* ELEMENTOS */

	const startDate = document.getElementById("start-date");
	const endDate = document.getElementById("end-date");
	const customerFilter = document.getElementById("customer-filter");
	const applyFiltersButton = document.getElementById("apply-filters");

	const transactionRows = Array.from(
		document.querySelectorAll("#transactions-body tr")
	);

	const noTransactions = document.getElementById("no-transactions");
	const filterMessage = document.getElementById("filter-message");
	const pageMessage = document.getElementById("page-message");

	const themeToggle = document.getElementById("theme-toggle");
	const pdfButton = document.getElementById("export-pdf");
	const excelButton = document.getElementById("export-excel");

	const paginationButtons = document.querySelectorAll(".page-btn");

	let currentPage = 1;

	/* ========================================
	   FILTRAR TRANSACCIONES
	======================================== */

	function applyFilters() {
		const start = startDate.value;
		const end = endDate.value;
		const customer = customerFilter.value;

		if (start && end && start > end) {
			filterMessage.textContent =
				"The start date cannot be later than the end date.";
			return;
		}

		let visibleCount = 0;

		transactionRows.forEach(function (row) {
			const rowDate = row.dataset.date;
			const rowCustomer = row.dataset.customer;
			const rowStatus = row.dataset.status;

			const matchesStart = !start || rowDate >= start;
			const matchesEnd = !end || rowDate <= end;

			const matchesCustomer =
				customer === "all" ||
				rowCustomer === customer ||
				rowStatus === customer;

			const isVisible =
				matchesStart && matchesEnd && matchesCustomer;

			row.hidden = !isVisible;

			if (isVisible) {
				visibleCount++;
			}
		});

		noTransactions.hidden = visibleCount > 0;

		filterMessage.textContent =
			visibleCount + " transaction(s) found.";

		currentPage = 1;
		updatePagination();
	}

	applyFiltersButton.addEventListener("click", applyFilters);

	/* ========================================
	   PAGINACIÓN DE DEMOSTRACIÓN
	======================================== */

	function updatePagination() {
		paginationButtons.forEach(function (button) {
			const isActive = Number(button.dataset.page) === currentPage;

			button.classList.toggle("active", isActive);
			button.setAttribute("aria-current", isActive ? "page" : "false");
		});

		const visibleRows = transactionRows.filter(function (row) {
			return !row.hidden;
		});

		/*
		 * Los datos de ejemplo contienen tres transacciones.
		 * Los botones 2 y 3 muestran un aviso si no hay más datos.
		 */

		if (currentPage > 1 && visibleRows.length === 0) {
			pageMessage.textContent = "No transactions available on this page.";
		} else if (currentPage > 1) {
			pageMessage.textContent =
				"Demo pagination: additional transaction data is not connected yet.";
		} else {
			pageMessage.textContent = "";
		}
	}

	paginationButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			currentPage = Number(button.dataset.page);
			updatePagination();
		});
	});

	/* ========================================
	   MODO OSCURO
	======================================== */

	function updateThemeIcon() {
		const icon = themeToggle.querySelector("i");
		const darkMode = document.body.classList.contains("dark-mode");

		icon.classList.toggle("fa-moon", !darkMode);
		icon.classList.toggle("fa-sun", darkMode);
		icon.classList.toggle("fa-regular", !darkMode);
		icon.classList.toggle("fa-solid", darkMode);

		themeToggle.setAttribute(
			"aria-label",
			darkMode ? "Switch to light mode" : "Switch to dark mode"
		);
	}

	themeToggle.addEventListener("click", function () {
		document.body.classList.toggle("dark-mode");

		const theme = document.body.classList.contains("dark-mode")
			? "dark"
			: "light";

		try {
			localStorage.setItem("fiao-reports-theme", theme);
		} catch (error) {
			/* La página sigue funcionando si el almacenamiento está bloqueado. */
		}

		updateThemeIcon();
	});

	try {
		if (localStorage.getItem("fiao-reports-theme") === "dark") {
			document.body.classList.add("dark-mode");
		}
	} catch (error) {
		/* Se utiliza el tema claro por defecto. */
	}

	updateThemeIcon();

	/* ========================================
	   EXPORTAR CSV PARA EXCEL
	======================================== */

	function exportToExcel() {
		const visibleRows = transactionRows.filter(function (row) {
			return !row.hidden;
		});

		const headers = [
			"Customer Name",
			"Description",
			"Amount",
			"Date",
			"Status"
		];

		const csvRows = [headers];

		visibleRows.forEach(function (row) {
			const cells = Array.from(row.querySelectorAll("td"));

			csvRows.push(
				cells.map(function (cell) {
					return cell.textContent.trim();
				})
			);
		});

		if (csvRows.length === 1) {
			pageMessage.textContent =
				"There are no transactions to export.";
			return;
		}

		function escapeCSV(value) {
			return '"' + String(value).replace(/"/g, '""') + '"';
		}

		const csvContent = "\uFEFF" + csvRows
			.map(function (row) {
				return row.map(escapeCSV).join(",");
			})
			.join("\r\n");

		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8;"
		});

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.href = url;
		link.download = "fiao-reports.csv";

		document.body.appendChild(link);
		link.click();
		link.remove();

		URL.revokeObjectURL(url);

		pageMessage.textContent =
			"CSV file downloaded. You can open it in Excel.";
	}

	excelButton.addEventListener("click", exportToExcel);

	/* ========================================
	   EXPORTAR / IMPRIMIR PDF
	======================================== */

	pdfButton.addEventListener("click", function () {
		pageMessage.textContent =
			"Choose Save as PDF in the print window.";

		window.print();
	});

	/* ========================================
	   INICIALIZACIÓN
	======================================== */

	applyFilters();

});
