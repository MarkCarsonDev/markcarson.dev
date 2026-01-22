document.addEventListener("DOMContentLoaded", function () {
	const tooltipElements = document.querySelectorAll("[data-tooltip]");

	tooltipElements.forEach((el) => {
		const tooltipText = el.getAttribute("data-tooltip");
		const tooltipDiv = document.createElement("div");
		tooltipDiv.className =
			"tooltip-div " + el.getAttribute("data-tooltip-classes");
		tooltipDiv.innerHTML = tooltipText;
		if (el.getAttribute("data-tooltip-parent") != null) {
			document
				.querySelector(el.getAttribute("data-tooltip-parent"))
				.appendChild(tooltipDiv);
		} else {
			el.appendChild(tooltipDiv);
		}
	});

	// Enhanced tooltip hover handling to prevent gap issues
	tooltipElements.forEach((el) => {
		const parentContainer = el.getAttribute("data-tooltip-parent")
			? document.querySelector(el.getAttribute("data-tooltip-parent"))
			: el.parentElement;

		let hideTimeout;

		const showTooltip = () => {
			clearTimeout(hideTimeout);
			const tooltip = parentContainer.querySelector('.tooltip-div');
			if (tooltip) {
				tooltip.style.display = 'block';
			}
		};

		const hideTooltipDelayed = () => {
			hideTimeout = setTimeout(() => {
				const tooltip = parentContainer.querySelector('.tooltip-div');
				if (tooltip) {
					tooltip.style.display = 'none';
				}
			}, 100);
		};

		// Trigger element events
		el.addEventListener('mouseenter', showTooltip);
		el.addEventListener('mouseleave', hideTooltipDelayed);

		// Tooltip element events
		const tooltip = parentContainer.querySelector('.tooltip-div');
		if (tooltip) {
			tooltip.addEventListener('mouseenter', showTooltip);
			tooltip.addEventListener('mouseleave', hideTooltipDelayed);
		}
	});
});
