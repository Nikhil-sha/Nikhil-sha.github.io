import './blob.js';

const label = document.getElementById("section-label");
const slidesContainer = document.getElementById("scroll-window"); // Parent container of the slides

// Track the currently visible slide with a label and its visibility state
let currentVisibleSlide = null;
let labelVisible = false; // Track if the label is visible

// Create an Intersection Observer
const observer = new IntersectionObserver(
	(entries) => {
		let mostVisibleSlide = null;
		let maxVisibility = 0;

		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const visibility = entry.intersectionRatio; // How much of the slide is visible
				if (visibility > maxVisibility && entry.target.getAttribute("data-label")) {
					mostVisibleSlide = entry.target;
					maxVisibility = visibility;
				}
			}
		});

		if (mostVisibleSlide) {
			const labelContent = mostVisibleSlide.getAttribute("data-label");

			// Show label if it's not already visible or if the content has changed
			if (!labelVisible || currentVisibleSlide !== mostVisibleSlide) {
				currentVisibleSlide = mostVisibleSlide;
				label.innerText = `# ${labelContent}`;
				label.classList.remove("hidden", "animate__zoomOut");
				label.classList.add("animate__zoomIn");
				labelVisible = true; // Mark label as visible
			}
		} else {
			// Hide the label if no slide is in view
			if (labelVisible) {
				label.classList.remove("animate__zoomIn");
				label.classList.add("animate__zoomOut");

				// Wait for the animation to finish before hiding
				label.addEventListener(
					"animationend",
					() => {
						if (!labelVisible) {
							label.classList.add("hidden");
						}
					}, { once: true }
				);

				labelVisible = false; // Mark label as not visible
				currentVisibleSlide = null; // Reset the visible slide
			}
		}
	},
	{
		threshold: 0.5, // Adjust as needed (50% of the slide needs to be visible)
	}
);

// Function to observe a single slide
function observeSlide(slide) {
	observer.observe(slide);
}

// Observe existing slides
document.querySelectorAll(".slide").forEach(observeSlide);

// Use a MutationObserver to observe dynamically added slides
const mutationObserver = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
			mutation.addedNodes.forEach((node) => {
				if (node.classList && node.classList.contains("slide")) {
					observeSlide(node); // Observe new slides
				}
			});
		}
	});
});

// Start observing the parent container for changes
mutationObserver.observe(slidesContainer, { childList: true });