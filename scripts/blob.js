const app = document.getElementById('app');
const blobThree = document.getElementById("blob-three");
const width = app.offsetWidth;
const height = app.offsetHeight;

function moveBlob(selector) {
	let blob = document.getElementById(selector);

	let x = 0;
	let y = 0;
	let angle = 0;

	x = Math.floor(Math.random() * width);
	y = Math.floor(Math.random() * height);
	angle = Math.floor(Math.random() * 360);

	blob.style.transform = `translateX(${x - 128}px) translateY(${y - 128}px) rotate(${angle}deg)`;
}

document.addEventListener("mousemove", (event) => {
	const blobRadius = 80; // Half of bubble's width/height
	const x = Math.max(blobRadius, Math.min(window.innerWidth - blobRadius, event.clientX));
	const y = Math.max(blobRadius, Math.min(window.innerHeight - blobRadius, event.clientY));

	// Move the bubble to the constrained mouse position
	blobThree.style.transform = `translate(${x - blobRadius}px, ${y - blobRadius}px)`;
});

setInterval(() => { moveBlob('blob-one') }, 8000);
setInterval(() => { moveBlob('blob-two') }, 8000);

moveBlob('blob-one');
moveBlob('blob-two');