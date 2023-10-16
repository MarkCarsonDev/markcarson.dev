
let currentSubpage = 0;
let subpages = [];
const SUBPAGE_FADE_TIME = 200;

window.onload = function () {
	subpages = getSurfaceChildren("subpages");
	resumeFragment();
	initializeFlip("cycle", 1000);
	clearSubpages();
	loadSubpage(currentSubpage, clearPreviousPage = false, displayInstantly = true);

	if (mobileAndTabletCheck()) {
		console.log("I harbor strong feelings towards mobile css (but I guess tablets are okay...).")
	}
}

function initializeFlip(id, delay) {
	setTimeout(function () {
		flip_text(document.getElementById(id));
	}, delay);
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

function clearSubpages() {
	for (let i = 0; i < subpages.length; i++) {
		if (i != currentSubpage) {
			unloadSubpageElement(i);
		}
	}
}

function loadSubpage(index, clearPreviousPage = true, displayInstantly = false) {
	for (let i = 0; i < subpages.length; i++) {
		// Return if index is out of subpage range
		if (index > subpages.length - 1 || index < 0) return;

		// Return if the subpage is already loaded
		if (index == currentSubpage && !displayInstantly) return;

		if (i == index) {
			const subpageElement = document.getElementById(subpages[index]);

			subpageElement.style.transition = `opacity ${SUBPAGE_FADE_TIME} linear`;
			setTimeout(function () {
				subpageElement.style.display = "block";
			}, SUBPAGE_FADE_TIME);

			setTimeout(function () {
				subpageElement.style.opacity = "1";
			}, displayInstantly ? 0 : SUBPAGE_FADE_TIME * 2);
		} else if (i == currentSubpage && clearPreviousPage) {
			unloadSubpageElement(i);
		}
	}

	currentSubpage = index;
}

function unloadSubpageElement(index, hideInstantly = false) {
	const subpageElement = document.getElementById(subpages[index]);
	subpageFade = hideInstantly ? 0 : SUBPAGE_FADE_TIME

	subpageElement.style.transition = `opacity ${subpageFade} linear`;
	subpageElement.style.opacity = "0";
	setTimeout(function () {
		subpageElement.style.display = "none";
	}, subpageFade);
}


function getTransitionDuration(element) {
	return parseFloat(getComputedStyle(element).transitionDuration.substring(0,
		getComputedStyle(element).transitionDuration.indexOf("s")));
}

function resumeFragment() {
	// Check if the URL has the fragment '#resume'
	if (window.location.hash === '#resume') {
		// Find the element with ID 'resume' and click it
		const resumeElement = document.getElementById('resume');
		if (resumeElement) {
			resumeElement.click();
			}
		}
}



window.addEventListener('scroll', function() {
    //console.log('scrol', this.scrollTop);
});



function scrollDown() { loadSubpage(Math.min(currentSubpage + 1, subpages.length - 1)); }
function scrollUp() { loadSubpage(Math.max(currentSubpage - 1, 0)); }

let lastWheelUpdateTime = 0; // Stores the timestamp of the last wheel update

// Attach the wheel event listener to the window object
window.addEventListener('wheel', handleWheel);

/**
 * Function to handle the wheel event
 * @param {WheelEvent} event - The wheel event object
 */
function handleWheel(event) {
  // Get the vertical scroll delta
  const deltaY = event.deltaY;

  // Get the current timestamp
  const currentTime = Date.now();

  // If the scroll is not vertical, do nothing
  if (Math.abs(deltaY) < 10) {
    return;
  }

  // If the wheel hasn't been updated in 1200ms, continue
  if (currentTime - lastWheelUpdateTime >= 1200) {
    // Update the last wheel update time
    lastWheelUpdateTime = currentTime;

    // Check if the wheel was moved vertically
    if (deltaY !== 0) {
      if (deltaY > 0) {
		scrollDown();
      } else {
        scrollUp();
      }
    }
  }
}


// Get touchmove direction 
// https://stackoverflow.com/questions/13278087/determine-vertical-direction-of-a-touchmove
// Juan Herrera, 2014
var ts;
window.addEventListener('touchstart', function(e) {
    ts = e.touches[0].clientY;
});

window.addEventListener('touchmove', function(e) {
	if (e.touches.length > 1) {
		ts = null;
	}
});

window.addEventListener('touchend', function(e) {

	if (ts === null) return;
    var te = e.changedTouches[0].clientY;

	console.log(Math.abs(ts - te))

	// If scroll difference is more than x% of the screen height, scroll
	if (Math.abs(ts - te) < window.innerHeight * 0.11) {
		return;
	}

    if (ts > te) {
        scrollDown();
    } else if (ts < te ) {
        scrollUp();
    } else {
		return;
	}
});

// Attach the keydown event listener to the window object
window.addEventListener('keydown', handleKeyDown);

/**
 * Function to handle the keydown event
 * @param {KeyboardEvent} event - The keyboard event object
 */
function handleKeyDown(event) {
  // Switch based on the key pressed
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      // Scroll up logic
      scrollUp();
      break;
    case 'ArrowDown':
    case 's':
      // Scroll down logic
      scrollDown();
      break;
    default:
      // For other keys, do nothing
      break;
  }
}



  

function getSurfaceChildren(parentID) {
	// Fetch the parent element by its ID
	const parentElement = document.getElementById(parentID);

	// Get all the first-level children of the parent element
	const children = parentElement.children;

	// Initialize an empty array to store the IDs
	let childIDs = [];

	// Loop through each child element to get its ID
		for (let i = 0; i < children.length; i++) {
		// Get the ID of the i-th child element
		const childID = children[i].id;

		// Add the ID to the array
		childIDs.push(childID);
	}

	return childIDs;
}

window.mobileAndTabletCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };