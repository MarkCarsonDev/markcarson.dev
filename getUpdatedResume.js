// Return the URL of the file with the most recent update time in its title (last argument of _ delimited before file extension)
function getUpdatedResume() {
	// Get all files in the downloads/resume directory
	const resumeDir = "/downloads/resume/";
	return fetchResumeURL(resumeDir + "index.html").catch((error) => {
		console.error("Error fetching updated resume:", error);
		return fetchResumeURL(resumeDir);
	});
}

function fetchResumeURL(url) {
	return fetch(url)
		.then((response) => response.text())
		.then((data) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(data, "text/html");
			const links = Array.from(doc.querySelectorAll("a"));
			let latestFile = null;
			let latestDate = null;
			links.forEach((link) => {
				const fileName = link.getAttribute("href");
				const match = fileName.match(/_(\d{6})\./);
				if (match) {
					const dateStr = match[1];
					const year = parseInt(dateStr.slice(0, 2)) + 2000;
					const month = parseInt(dateStr.slice(2, 4)) - 1;
					const day = parseInt(dateStr.slice(4, 6));
					const fileDate = new Date(year, month, day);
					if (!latestDate || fileDate > latestDate) {
						latestDate = fileDate;
						latestFile = fileName;
					}
				}
			});
			if (latestFile) {
				const resumeLink = document.getElementById("resume");
				resumeLink.href = "/downloads/resume/" + latestFile;
				return "/downloads/resume/" + latestFile;
			}
		})
		.catch((error) => {
			console.error("Error fetching fallback resume files:", error);
			throw error;
		});
}

// Call the function to update the resume link
getUpdatedResume();

// -- Bandaid solution until reverse proxy/SSSG is ready -- //
function openResume() {
	// Find the element with ID 'resume' and click it
	const resumeElement = document.getElementById("resume");
	if (resumeElement) {
		window.location.href = resumeElement.href;
		open(resumeElement.href, "_blank");
	}
}

// Support /#resume to redirect on already loaded page to the resume link
function resumeFragment() {
	// Check if the URL has the fragment '#resume'
	if (window.location.hash === "#resume") {
		openResume();
	}
}

function redirectResume() {
	if (window.location.hash === "#resume") {
		openResume();
	}
}

// Call the redirect function on page load
document.addEventListener("DOMContentLoaded", function () {
	redirectResume();
});
