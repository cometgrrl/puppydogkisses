const path = require("path");

function isFullUrl(url) {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
}

module.exports = function (eleventyConfig) {
	// Eleventy Image shortcode
	// Passthrough <img> shortcode (no preprocessing)
	eleventyConfig.addShortcode(
		"image",
		function imageShortcode(src, alt) {
			let finalSrc = src;
			if (!isFullUrl(src)) {
				if (src.startsWith("/img/")) {
					finalSrc = src;
				} else {
					const basename = path.basename(src);
					finalSrc = `/img/${basename}`;
				}
			}

			const altText = alt || "";
			return `<img src="${finalSrc}" alt="${altText}" loading="lazy" decoding="async">`;
		}
	);
};
