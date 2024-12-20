class Notify {
	constructor({ message, type = "info", duration = 3000 }) {
		this.message = message;
		this.type = type;
		this.duration = duration;

		this.render();
	}

	getTypeStyles() {
		switch (this.type) {
			case "success":
				return { colorPref: "bg-green-500 dark:bg-green-600 text-white", icon: "fa-check-circle"};
			case "error":
				return { colorPref: "bg-red-500 dark:bg-red-600 text-white", icon: "fa-times-circle"};
			case "warning":
				return { colorPref: "bg-yellow-500 dark:bg-yellow-600 text-black", icon: "fa-exclamation-circle"};
			case "info":
			default:
				return { colorPref: "bg-blue-500 dark:bg-blue-600 text-white", icon: "fa-info-circle"};
		}
	}

	render() {
		// Create notification element
		const { colorPref, icon } = this.getTypeStyles();
		const notification = document.createElement("div");
		notification.className = `
			w-fit px-4 py-3 rounded-2xl shadow-lg 
			${colorPref} flex flex-row gap-3 items-center 
			animate__animated animate__repeat-1 
			animate__fast animate__zoomInDown
    `;
		notification.innerHTML = `
			<span class="fas ${icon} fa-md"></span>
      <p class="text-sm font-medium leading-snug">${this.message}</p>
    `;

		// Append to the body
		document.getElementById("notification-container").prepend(notification);

		// Remove after duration
		setTimeout(() => {
			notification.classList.remove("animate__zoomInDown");
			notification.classList.add("animate__zoomOutUp");
			setTimeout(() => notification.remove(), 800); // Wait for fade-out
		}, this.duration);
	}
}

export default Notify;