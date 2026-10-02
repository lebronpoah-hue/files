"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	let frame = document.getElementById("uv-frame");
	frame.style.display = "block";
	let wispUrl =
		(location.protocol === "https:" ? "wss" : "ws") +
		"://" +
		location.host +
		"/wisp/";
	if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [
			{ wisp: wispUrl },
		]);
	}
	frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});

// The Google Apps Script launcher passes a target as ?url=<encoded URL>.
// Validate it, fill the normal address field, then use the regular UV flow.
const launchTarget = new URLSearchParams(window.location.search).get("url");
if (launchTarget) {
	try {
		const targetUrl = new URL(launchTarget);
		if (!["http:", "https:"].includes(targetUrl.protocol)) {
			throw new Error("Only HTTP and HTTPS URLs are supported.");
		}
		address.value = targetUrl.href;
		form.requestSubmit();
	} catch (err) {
		error.textContent = "Could not open the supplied address.";
		errorCode.textContent = err.toString();
	}
}
