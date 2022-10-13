// ==UserScript==
// @name                 Youtrack swimlane colors
// @namespace            http://tampermonkey.net/
// @version              1.00
// @description          Colorify your swimlanes by project id
// @author               jandolezal71
// @match                https://youtrack.seznam.net/agiles/*
// @run-at               document-end
// ==/UserScript==
(async () => {
	function waitForElm(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	function colorify () {
		const PROJECT_SEPARATOR = " > ";
		const SWIMLANE_DATA_SELECTOR = "yt-agile-board-swimlane__summary";

		const getRandomColor = () => Math.floor(Math.random()*16777215).toString(16);
		const setElementColor = (element, color) => element.style.color = `#${color}`;

		const colorByLaneProjectId = {};

		const swimlaneElements = $(`[data-test="${SWIMLANE_DATA_SELECTOR}"]`);


		Array.from(swimlaneElements).forEach((element) => {
			const projectId = element.innerText.split(PROJECT_SEPARATOR)[0];

			if (!projectId) {
				return;
			}

			const color = colorByLaneProjectId[projectId] || getRandomColor();

			colorByLaneProjectId[projectId] = color;

			setElementColor(element, color);
		});
	}

	const buttonToolbarElement = await waitForElm('[data-test="buttonToolbar"]');

	const colorifyButton = document.createElement("button");

	colorifyButton.innerHTML = "Colorify projects";
	colorifyButton.onclick = () => colorify();

	buttonToolbarElement.appendChild(colorifyButton);
})();
