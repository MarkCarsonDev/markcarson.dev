REPO_COUNT = 3
POPIN_DELAY = 350 // in milliseconds
POPIN_DELAY_FADE_FACTOR = 100

function getTimeSince(date) {
	const seconds = Math.floor((new Date() - date) / 1000);
	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " years ago";
	}
	interval = seconds / 2592000;
	if (interval > 2) {
		return Math.floor(interval) + " months ago";
	}
	interval = seconds / 86400;
	if (interval > 2) {
		return Math.floor(interval) + " days ago";
	}
	return "Today";
}

function delay(duration) {
	return new Promise(resolve => setTimeout(resolve, duration));
}
// Fetches the repositories for the given user
async function getRepos(user) {
	const repoResponse = await fetch(`https://api.github.com/users/${user}/repos`);
	return await repoResponse.json();
}

// Processes the repositories and returns only the recent ones
function getRecentRepos(repos) {
	// Sort the repositories by last push date in descending order
	repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
	// Get the REPO_COUNT most recently pushed repositories
	return repos.slice(0, REPO_COUNT);
}

// Handles the display logic for repositories or errors
async function displayRepos(recentRepos) {
	const reposParent = document.getElementById('repos-list');
	try {
		for (let i = 0; i < recentRepos.length; i++) {
			const repo = recentRepos[i];
			let repoElement = document.createElement('li');
			const timeSince = getTimeSince(new Date(repo.pushed_at));
			repoElement.innerHTML = `<a href="${repo.html_url}"><span class="underlined">${repo.name}</span> (${timeSince})</a>`;
			if (i === 0) {
				reposParent.replaceChild(repoElement, reposParent.getElementsByTagName('li')[0]);
			} else {
				reposParent.appendChild(repoElement);
			}
			await delay(POPIN_DELAY + (i * POPIN_DELAY_FADE_FACTOR));
		}
	} catch (error) {
		console.error(error);
		reposParent.getElementsByTagName('li')[0].innerHTML = "An error occurred.";
	}
}

// Wrapper function to call the refactored functions
async function getRecentProjects(user) {
	const repos = await getRepos(user);
		if (!Array.isArray(repos)) {
			// Handle rate limiting or other API errors
			const reposParent = document.getElementById('repos-list');
			reposParent.getElementsByTagName('li')[0].innerHTML = "Rate limited or API error";
			return;
		}
	const recentRepos = getRecentRepos(repos);
	await displayRepos(recentRepos);
}

getRecentProjects('MarkCarsonDev');

