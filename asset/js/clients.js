
/* ========================================
   FIA'O - CLIENT MANAGEMENT
======================================== */

document.addEventListener("DOMContentLoaded", function () {

	/* ELEMENTOS HTML */

	const searchInput = document.getElementById("client-search");
	const filterButtons = document.querySelectorAll(".filter-pill");
	const tableRows = Array.from(
		document.querySelectorAll("#clients-table-body tr")
	);

	const emptyState = document.getElementById("empty-state");
	const feedback = document.getElementById("feedback");

	const themeToggle = document.getElementById("theme-toggle");
	const subThemeToggle = document.getElementById("sub-theme-toggle");
	const languageButton = document.getElementById("language-btn");
	const notificationsButton = document.getElementById("notifications-btn");
	const sendWhatsAppButton = document.getElementById("send-whatsapp-btn");

	const detailDialog = document.getElementById("detail-dialog");
	const closeDialogButton = document.getElementById("close-dialog");

	let activeFilter = "all";

	/* ========================================
	   BUSCADOR Y FILTROS
	======================================== */

	function filterClients() {
		const query = searchInput.value
			.trim()
			.toLocaleLowerCase();

		let visibleRows = 0;

		tableRows.forEach(function (row) {
			const name = row.dataset.name || "";
			const phone = row.dataset.phone || "";
			const status = row.dataset.status || "";

			const matchesSearch =
				name.includes(query) || phone.includes(query);

			const matchesFilter =
				activeFilter === "all" || status === activeFilter;

			const shouldShow = matchesSearch && matchesFilter;

			row.hidden = !shouldShow;

			if (shouldShow) {
				visibleRows++;
			}
		});

		emptyState.hidden = visibleRows !== 0;
	}

	searchInput.addEventListener("input", filterClients);

	filterButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			activeFilter = button.dataset.filter;

			filterButtons.forEach(function (filterButton) {
				filterButton.classList.toggle(
					"active",
					filterButton === button
				);
			});

			filterClients();
		});
	});

	/* ========================================
	   DETALLES DEL CLIENTE
	======================================== */

	tableRows.forEach(function (row) {
		const detailButton = row.querySelector(".detail-button");

		detailButton.addEventListener("click", function () {
			const name = row.dataset.name;
			const phone = row.dataset.phone;
			const purchases = row.dataset.purchases;
			const debt = Number(row.dataset.debt);
			const status = row.dataset.status;

			document.getElementById("detail-name").textContent =
				row.querySelector(".client-name-box h4").textContent;

			document.getElementById("detail-phone").textContent = phone;

			document.getElementById("detail-purchases").textContent =
				purchases + " purchases";

			document.getElementById("detail-debt").textContent =
				debt > 0 ? "B/. " + debt.toFixed(2) : "B/. 0.00";

			let statusText = "Pending";

			if (status === "ontime") {
				statusText = "On Time";
			} else if (status === "overdue") {
				statusText = "Overdue";
			}

			document.getElementById("detail-status").textContent =
				statusText;

			if (typeof detailDialog.showModal === "function") {
				detailDialog.showModal();
			} else {
				feedback.textContent =
					"Your browser does not support the details window.";
			}
		});
	});

	closeDialogButton.addEventListener("click", function () {
		detailDialog.close();
	});

	detailDialog.addEventListener("click", function (event) {
		if (event.target === detailDialog) {
			detailDialog.close();
		}
	});

	/* ========================================
	   MODO OSCURO
	======================================== */

	function toggleTheme() {
		document.body.classList.toggle("dark-mode");

		const darkModeEnabled =
			document.body.classList.contains("dark-mode");

		localStorage.setItem(
			"fiao-clients-theme",
			darkModeEnabled ? "dark" : "light"
		);

		updateThemeIcons(darkModeEnabled);
	}

	function updateThemeIcons(isDark) {
		const icons = [
			themeToggle.querySelector("i"),
			subThemeToggle.querySelector("i")
		];

		icons.forEach(function (icon) {
			if (!icon) return;

			icon.classList.toggle("fa-moon", !isDark);
			icon.classList.toggle("fa-sun", isDark);
			icon.classList.toggle("fa-regular", !isDark);
			icon.classList.toggle("fa-solid", isDark);
		});
	}

	const savedTheme = localStorage.getItem("fiao-clients-theme");

	if (savedTheme === "dark") {
		document.body.classList.add("dark-mode");
		updateThemeIcons(true);
	}

	themeToggle.addEventListener("click", toggleTheme);
	subThemeToggle.addEventListener("click", toggleTheme);

	/* ========================================
	   BOTÓN DE IDIOMA
	======================================== */

	languageButton.addEventListener("click", function () {
		feedback.textContent =
			"Language selector: English is currently displayed.";
	});

	/* ========================================
	   NOTIFICACIONES
	======================================== */

	notificationsButton.addEventListener("click", function () {
		feedback.textContent =
			"You have 2 demo notifications.";
	});

	/* ========================================
	   RECORDATORIO DE WHATSAPP
	======================================== */

	sendWhatsAppButton.addEventListener("click", function () {
		feedback.textContent =
			"Demo only: the reminder has not been sent. Connect WhatsApp to send a real message.";
	});

	/* ========================================
	   INICIALIZACIÓN
	======================================== */

	filterClients();

});
