import Notify from './notification.js';

async function insertParagrah() {
	try {
		const response = await fetch("/scripts/data/paragraphs-and-greetings.json");
		if (!response.ok) {
			new Notify({
				message: "Something went wrong! Please refresh the page.",
				type: "warning",
				duration: 5000,
			});
		}

		const data = await response.json();
		const index = Math.floor(Math.random() * data.hero_paragraphs.length);
		let writeParagraph = new Typed('#hero-paragraph', {
			strings: [data.hero_paragraphs[index]],
			typeSpeed: 25,
		});

		setTimeout(() => {
			const greetIndex = Math.floor(Math.random() * data.greetings.length);
			new Notify({
				message: data.greetings[greetIndex],
				type: "info",
				duration: 6000,
			});
		}, 6000)
	} catch (error) {
		new Notify({
			message: "Something went wrong! Please refresh the page.",
			type: "warning",
			duration: 5000,
		});
	}
};

insertParagrah();