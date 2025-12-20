// Return the URL of the file with the most recent update time in its title (last argument of _ delimited before file extension)
function getUpdatedResume() {
	return fetch('https://api.github.com/repos/MarkCarsonDev/markcarson.dev/contents/downloads/resume')
		.then((response) => response.json())
		.then((data) => {
			let latestFile = null;
			let latestDate = null;

			for (let file of data) {
				const fileName = file.name;
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
			}

			if (latestFile) {
				const resumeLink = document.getElementById("resume");
				const resumeURL = "/downloads/resume/" + latestFile;
				resumeLink.href = resumeURL;
				return resumeURL;
			}
		})
		.catch((error) => {
			console.error("Error fetching updated resume:", error);
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
