import Notify from './notification.js';

// Select the root HTML element for theme toggling
const doc = document.querySelector("html");
const themeToggler = document.getElementById("theme-toggler");
const metaDarkTheme = document.createElement("meta");
metaDarkTheme.name = 'theme-color';
document.head.appendChild(metaDarkTheme);

// Function to apply the theme
const applyTheme = (theme) => {
	if (theme === "dark") {
		doc.classList.add("dark");
		metaDarkTheme.setAttribute('content', '#111827');
		themeToggler.innerHTML = `<i class="fas fa-sun fa-md"></i>`;
	} else {
		doc.classList.remove("dark");
		metaDarkTheme.setAttribute('content', '');
		themeToggler.innerHTML = `<i class="fas fa-moon fa-md"></i>`;
	}
};

// Check local storage for the theme preference on page load
const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || "light");

// Smooth scrolling functionality for horizontal scroll
const scrollWindow = document.getElementById("scroll-window");
const scrollAmount = 200; // Amount to scroll horizontally

document.getElementById("scroll-right").addEventListener("click", () => {
	scrollWindow.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

document.getElementById("scroll-left").addEventListener("click", () => {
	scrollWindow.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

// Function to scroll to a specific element
window.scrollToSlide = (e) => {
	e.preventDefault(); // Add parentheses to call the method
	let anchor = e.currentTarget;
	const selector = anchor.getAttribute("href"); // Fixed spelling
	const element = document.querySelector(selector); // Use the correct variable name

	if (element) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});
	} else {
		console.error("Element not found for selector:", selector);
	}
};

// Dropdown toggler functionality with animations
const dropDownToggler = document.getElementById("drop-down-toggler");
const dropDown = document.getElementById("drop-down");

function toggleDropDown() {
	let isOpen = !dropDown.classList.contains("hidden");
	if (isOpen) {
		dropDown.classList.add("animate__bounceOutUp");
		setTimeout(() => {
			dropDown.classList.add("hidden"); // Hide dropdown after animation
		}, 1000);
	} else {
		dropDown.classList.remove("hidden", "animate__bounceOutUp");
		dropDown.classList.add("animate__bounceInDown");
	}
};

dropDownToggler.addEventListener("click", toggleDropDown);

// Tilt effect for interactive elements
function handleTilt(event) {
	const card = event.currentTarget;
	const rect = card.getBoundingClientRect();

	// Calculate relative mouse position
	const x = (event.clientX - rect.left) / rect.width;
	const y = (event.clientY - rect.top) / rect.height;

	// Calculate tilt angles
	const tiltX = (y - 0.5) * 60; // Vertical tilt
	const tiltY = (x - 0.5) * -60; // Horizontal tilt

	// Apply tilt effect
	card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
};

function resetTilt(event) {
	const card = event.currentTarget;
	// Reset tilt effect
	card.style.transform = "rotateX(0) rotateY(0)";
};

// Clipboard API
function copyToClipboard(text) {
	navigator.clipboard.writeText(text)
		.then(() => {
			new Notify({
				message: `Text copied to clipboard: ${text}`,
				type: "success",
				duration: 5000,
			});
		})
		.catch(err => {
			new Notify({
				message: "Failed to copy text!",
				type: "error",
				duration: 5000,
			});
		});
};

// Web Share API: Sharing functionality
async function share(props = { text: "Nikhil Sharma", url: "https://Nikhil-sha.github.io/" }) {
	if (navigator.share) {
		await navigator.share({
				title: "Check this out!",
				text: props.text + ':',
				url: props.url,
			})
			.then(() => {
				new Notify({
					message: "Successfully shared!",
					type: "success",
					duration: 5000,
				});
			})
			.catch((error) => console.error("Error sharing:", error));
	} else {
		new Notify({
			message: "Your browser does not support the Web Share API.",
			type: "error",
			duration: 5000,
		});
		copyToClipboard("${props.text}: ${props.url}");
	}
};

const shareButtons = document.querySelectorAll(".share-button");
shareButtons.forEach(button => {
	button.addEventListener('click', () => {
		let text = button.dataset.shareText;
		let url = button.dataset.shareUrl;
		share({ text: text, url: url });
	})
});

async function loadProjects() {
	try {
		const response = await fetch('/scripts/data/projects.json');

		if (!response.ok) {
			new Notify({
				message: "Something went wrong! Please refresh the page.",
				type: "warning",
				duration: 5000,
			});
			return;
		}

		const projects = await response.json();

		projects.forEach(project => {
			const projectSection = document.createElement('section');
			projectSection.id = project.name;
			projectSection.dataset.label = 'Project';
			projectSection.className = 'slide snap-always snap-center shrink-0 w-full h-full flex justify-center items-center';

			projectSection.innerHTML = `
				<article class="flex flex-col items-center justify-center gap-4 px-8 group max-w-2xl">
					<figure class="perspective-container">
						<img src="${project.image}" alt="${project.title}" class="interactive-tilt w-full max-w-sm h-48 rounded-3xl object-cover shadow-md transition-transform duration-500" />
					</figure>
					<h3 class="text-center text-lg font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-100 transition-colors duration-300">
						${project.title}
					</h3>
					<p class="text-center text-sm text-gray-700 dark:text-gray-400 transition-colors duration-300">
						${project.description}
					</p>
					<div class="flex items-center justify-center gap-4 mt-4">
						<a href="${project.url}" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
							View
						</a>
						<button data-share-text="${project.title} by Nikhil Sharma" data-share-url="${project.url}" class="share-button w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-900 rounded-full shadow-md hover:bg-blue-600 hover:text-white dark:bg-gray-600 dark:hover:bg-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
							<i class="fas fa-share"></i>
						</button>
					</div>
   	</article>
   `;

			projectSection.querySelector("img").addEventListener("mousemove", handleTilt);
			projectSection.querySelector("img").addEventListener("mouseleave", resetTilt);
			projectSection.querySelector(".share-button").addEventListener('click', (e) => {
				let text = e.currentTarget.dataset.shareText;
				let url = e.currentTarget.dataset.shareUrl;
				share({ text: text, url: url });
			});
			// Append the section to the desired container
			document.getElementById("projects").insertAdjacentElement('afterend', projectSection);
		});
	} catch (error) {
		console.error('Error:', error);
	}
};

const faqQuestion = document.getElementById("faq-questions");
const faqAnswer = document.getElementById("faq-answer");

async function loadFAQ() {
	try {
		const response = await fetch('/scripts/data/faq.json');
		if (!response.ok) {
			new Notify({
				message: "Something went wrong! Please refresh the page.",
				type: "warning",
				duration: 5000,
			});
			return;
		}
		const faq = await response.json();

		// Loop through the key-value pairs in the object
		for (let question in faq) {
			const option = document.createElement("option");
			option.setAttribute("value", question);
			option.innerText = question;
			faqQuestion.appendChild(option);
		}

		let typed = new Typed('#faq-answer', {
			strings: ["Welcome! Please select an option below to proceed. Your selection will guide us in providing the best assistance."], // Start with an empty string
			typeSpeed: 25,
		});

		faqQuestion.addEventListener('change', function() {
			const selectedQuestion = faqQuestion.value;

			// Update the strings dynamically without destroying the instance
			typed.strings = [faq[selectedQuestion]]; // Set new strings
			typed.reset(); // Reset to start typing the new string
		});
	} catch (error) {
		console.error('Error:', error);
	}
};

// Theme toggler: Toggles between light and dark modes
themeToggler.addEventListener("click", () => {
	const isDark = doc.classList.toggle("dark");
	const theme = isDark ? "dark" : "light";
	localStorage.setItem("theme", theme);
	applyTheme(theme);
});

const tiltElems = document.querySelectorAll(".interactive-tilt");
tiltElems.forEach((element) => {
	element.addEventListener("mousemove", handleTilt);
	element.addEventListener("mouseleave", resetTilt);
});

// Add a "click" event listener to create a pointer bubble effect
window.addEventListener("click", (event) => {
	const pointerBubble = document.createElement("span");
	pointerBubble.classList = `
        fixed flex justify-center items-center 
        top-[${event.clientY}px] left-[${event.clientX}px] 
        w-6 h-6 border-2 border-blue-600 dark:border-blue-500 
        -translate-x-1/2 -translate-y-1/2 
        origin-bottom-right 
        rounded-full pointer-events-none animate-ping
 `;

	document.body.appendChild(pointerBubble);
	// Remove bubble after animation
	setTimeout(() => {
		pointerBubble.remove();
	}, 1000);
});

// Call the functions
loadProjects();
loadFAQ();