POPIN_DELAY = 5 // in milliseconds
POPIN_DELAY_FADE_FACTOR = 5

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
        let projects = []

        for (let repo of repos) {
            desc = repo.description;
            if (desc == null) continue;
            // Get the last character of repo.description
            if (desc.charAt(desc.length - 1) == '*') {
                projects.push(repo);
            };
        };
        
        // Update the HTML
        //reposParent.removeChild(reposParent.getElementsByTagName('li')[0]);
        for (let i = 0; i < projects.length; i++) {
            const repo = projects[i];
            const contributorsResponse = await fetch(repo.contributors_url);
            const contributors = await contributorsResponse.json();
            let contributorsList = [];
            for (let contributor of contributors) {
                contributorsList.push(`<a class="contributor" href="https://github.com/${contributor.login}">${contributor.login}</a>`);
            }

            let repoElement = document.createElement('li');

            const timeSince = getTimeSince(new Date(repo.pushed_at));
            repoElement.innerHTML = `
                                <div class="showcase">
                                    <a href="${repo.html_url}">
                                        <span class="underlined">${repo.name}</span> (${timeSince})
                                    </a>
                                    <div class="contributors">
                                        ${contributorsList.length > 3 ? contributorsList.slice(0, 3).join(", ") + `, <a class="contributor" href="${repo.html_url}/graphs/contributors">et. al</a>`: contributorsList.join(", ")}
                                    </div>
                                    <p class="project-description">${repo.description.slice(0, -1)}</p>
                                </div>`;

            if (i == 0) {
                reposParent.replaceChild(repoElement, reposParent.getElementsByTagName('li')[0])
            } else {
                reposParent.appendChild(repoElement)
            }
            // Wait before fetching the next repo
            await delay(POPIN_DELAY + (i * POPIN_DELAY_FADE_FACTOR));
        }

    } catch (error) {
        console.error(error);
        const reposParent = document.getElementById(`projects-list`);
        reposParent.getElementsByTagName('li')[0].innerHTML = "Uh oh! Something made a f*cky wucky! Sowwy! ;-;";
    }
}

getRecentProjects('MarkCarsonDev');