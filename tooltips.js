document.addEventListener("DOMContentLoaded", function () {
	const tooltipElements = document.querySelectorAll("[data-tooltip]");

	tooltipElements.forEach((el) => {
		const tooltipText = el.getAttribute("data-tooltip");
		const tooltipDiv = document.createElement("div");
		tooltipDiv.className =
			"tooltip-div " + el.getAttribute("data-tooltip-classes");
		tooltipDiv.innerHTML = tooltipText;
		el.appendChild(tooltipDiv);
	});
});
