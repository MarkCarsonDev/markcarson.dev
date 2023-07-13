REPO_COUNT = 3

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

async function getRecentProjects(user) {
    try {
        const repoResponse = await fetch(`https://api.github.com/users/${user}/repos`);
        const repos = await repoResponse.json();

        const reposParent = document.getElementById(`projects-list`);

        if (repoResponse.status === 403) {
            reposParent.getElementsByTagName('li')[0].innerHTML = "Really? Rate limited? Just email me already...";
            return;
        }

        // Sort the repositories by last push date in descending order
        repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        // Get the 4 most recently pushed repositories
        let recentRepos = repos.slice(0, REPO_COUNT);

        // Update the HTML
        reposParent.removeChild(reposParent.getElementsByTagName('li')[0]);
        for (let i = 0; i < recentRepos.length; i++) {
            const repo = recentRepos[i];

            let repoElement = document.createElement('li');

            const timeSince = getTimeSince(new Date(repo.pushed_at));
            repoElement.innerHTML = `<a href="${repo.html_url}"><span class="underlined">${repo.name}</span> (${timeSince})</a>`;

            reposParent.appendChild(repoElement)
        }

    } catch (error) {
        console.error(error);
        const reposParent = document.getElementById(`projects-list`);
        reposParent.getElementsByTagName('li')[0].innerHTML = "Uh oh! Something made a fucky wucky! Sowwy! ;-;";
    }
}

getRecentProjects('MarkCarsonDev');
