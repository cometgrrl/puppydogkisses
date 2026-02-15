const path = require("path");
const Image = require("@11ty/eleventy-img");

function isFullUrl(url) {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

function resolveSourcePath(src, page) {
	if (src.startsWith("./") || src.startsWith("../")) {
		const pageDir = page && page.inputPath ? path.dirname(page.inputPath) : "content/blog";
		return path.resolve(pageDir, src);
	}

	if (src.startsWith("/img/")) {
		return path.resolve("content/blog", path.basename(src));
	}

	return path.resolve("content/blog", path.basename(src));
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addNunjucksAsyncShortcode(
		"image",
		async function imageShortcode(src, alt, sizes = "100vw", className = "") {
			const altText = alt || "";
			const attrs = {
				alt: altText,
				loading: "lazy",
				decoding: "async",
				sizes,
			};
			if (className) {
				attrs.class = className;
			}

			if (isFullUrl(src)) {
				return `<img src="${src}" alt="${altText}" loading="lazy" decoding="async"${className ? ` class="${className}"` : ""}>`;
			}

			const source = resolveSourcePath(src, this.page);
			const metadata = await Image(source, {
				widths: [360, 720, 1080],
				formats: ["webp", "jpeg"],
				urlPath: "/img/",
				outputDir: "_site/img/",
				sharpOptions: {
					jpeg: { quality: 76, mozjpeg: true },
					webp: { quality: 72 },
				},
			});

			return Image.generateHTML(metadata, attrs);
		}
	);
};
