window.onload = function () {
	pages = document.getElementsByClassName("page");
	console.log(pages);
	loadPage("main");

	getRepos();

	setTimeout(function () {
		flip_text(document.getElementById("cycle"));
	}, 0);
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

$('html').bind('mousewheel DOMMouseScroll', function (e) {
	var delta = (e.originalEvent.wheelDelta || -e.originalEvent.detail);

	setTimeout(function () {
	if (delta < 0) {
	} else if (delta > 0) {
	}
	}, 100);
});




function getRepos() {
	let language_buttons = $("#languages_div .button_div")[0];
	let projects = document.getElementById("projects");

	$.get("https://api.github.com/users/MarkCarsonDev/repos", (data, status) => {
		var languages = []
		for (let i = 0; i < data.length; i++) {
			// Create language buttons
			if (data[i].language == "HTML" || data[i].language == "CSS") {
				data[i].language = "Front-End";
			}

			if (languages.indexOf(data[i].language) == -1) {
				languages.push(data[i].language)

				var lang_btn = document.createElement("button");
				lang_btn.className = "language_button " + data[i].language;
				lang_btn.addEventListener("click", function () {
					showLanguage(data[i].language);
				});
				lang_btn.innerHTML = data[i].language;
				language_buttons.appendChild(lang_btn);
			}

			var project = document.createElement("div");
			project.className = "project " + data[i].language;
			var project_title = document.createElement("h2");
			project_title.innerHTML = data[i].name;
			project_title.className = "project_title";
			var project_description = document.createElement("p");
			project_description.className = "project_description";
			project_description.innerHTML = data[i].description;
			var project_link = document.createElement("a");
			project_link.href = data[i].html_url;
			project_link.className = "project_link";
			project_link.target = "_blank";
			project_link.innerHTML = "View on GitHub";
			project.appendChild(project_title);
			project.appendChild(project_description);
			project.appendChild(project_link);
			projects.appendChild(project);
		}
	});
}

function showLanguage(language) {
	if ($('button.' + language).hasClass('active')) {
		$('button.language_button').removeClass('active');
		$(".project").removeClass('hidden');
	} else {
		$('button.language_button').removeClass('active');
		$('button.' + language).addClass('active');
		$(".project").addClass('hidden');
	}
	$('.' + language).removeClass('hidden');
}