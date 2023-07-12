window.onload = function () {
	pages = document.getElementsByClassName("page");
	loadPage("main");

	setTimeout(function () {
		flip_text(document.getElementById("cycle"));
	}, 1000);
}

function flip_text(t) {

	let time = getTransitionDuration(t) * 1000;
	let delay = parseFloat(t.dataset.delay);
	const states = JSON.parse(t.dataset.states);
	const avgStatesLength = states.reduce((a, b) => a + b.length, 0) / states.length;
	const maxStatesLength = Math.max(...states.map(x => x.length));

	let currentTextIndex = states.indexOf(t.textContent);

	t.style.transform = "scaleY(0)";
	t.style.transformOrigin = "top";


	setTimeout(function () {
		currentTextIndex = (currentTextIndex + 1 >= states.length) ? 0 : currentTextIndex + 1;
		t.textContent = states[currentTextIndex];

		t.style.padding = `0 ${(maxStatesLength - t.textContent.length) / 2 + 1}ch`
		t.style.transform = "scaleY(1)";
		t.style.transformOrigin = "bottom";
	}, time)

	setTimeout(function () {
		flip_text(t);
	}, delay)
}

function loadPage(pageName) {
	for (let i = 0; i < pages.length; i++) {
		pages[i].classList.remove("active-page");
		if (pages[i].id != pageName) {
			pages[i].classList.add("hidden");
		} else {
			// Load next page
			document.getElementById(pageName).classList.remove("hidden");
			document.getElementById(pageName).classList.add("active-page");
		}
	}
}

function getTransitionDuration(element) {
	return parseFloat(getComputedStyle(element).transitionDuration.substring(0,
		getComputedStyle(element).transitionDuration.indexOf("s")));
}
  
