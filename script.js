window.onload = function () {

	setTimeout(function () {
		increment_text(document.getElementById("cycle"))
	}, 3500);


	function increment_text(t) {

		let time = getTransitionDuration(t) * 1000;
		let delay = parseFloat(t.dataset.delay)
		const states = JSON.parse(t.dataset.states);

		let currentTextIndex = states.indexOf(t.textContent);

		t.style.transform = "scaleY(0)";
		t.style.transformOrigin = "top";


		setTimeout(function () {
			currentTextIndex = (currentTextIndex + 1 >= states.length) ? 0 : currentTextIndex + 1;
			t.textContent = states[currentTextIndex];

			t.style.transform = "scaleY(1)";
			t.style.transformOrigin = "bottom";
		}, time)

		setTimeout(function () {
			increment_text(t)
		}, delay)
	}

	function getTransitionDuration(element) {
		return parseFloat(getComputedStyle(element).transitionDuration.substring(0, getComputedStyle(element).transitionDuration.indexOf("s")))
	}

	function getWidth(element) {
		return parseFloat(getComputedStyle(element).width)
	}

}