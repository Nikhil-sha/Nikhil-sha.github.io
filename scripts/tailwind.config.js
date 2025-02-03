tailwind.config = {
	darkMode: 'class',
	theme: {},
	plugins: [
		function({ addUtilities }) {
			addUtilities({
				'.rotate-3d-right': {
					transform: 'rotateX(30deg) rotateY(30deg) rotateZ(-15deg) scale(0.90)',
					transition: 'transform 0.5s ease',
				},
				'.rotate-3d-left': {
					transform: 'rotateX(-30deg) rotateY(30deg) rotateZ(15deg) scale(0.90)',
					transition: 'transform 0.5s ease',
				},
				'.perspective-container': {
					perspective: '1000px',
					transformStyle: 'preserve-3d',
				},
			});
  },
 ],
};