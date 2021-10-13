// @ts-nocheck
'use strict';

const WIDTH = 20;
const HEIGHT = 16;

const container = document.querySelector('.container');
const board = document.querySelector('.board');

const heights = {};
let totalVolume = 0;
let isMouseDown = false;

for (let y = 0; y < HEIGHT; y++) {
	for (let x = 0; x < WIDTH; x++) {
		const square = document.createElement('div');
		square.classList.add('square');
		square.dataset.y = y;
		square.dataset.x = x;
		square.dataset.hasWater = 0;
		square.dataset.isColored = 0;
		if (y === 0) square.dataset.isColored = 1;
		board.append(square);

		heights[x] = 0;
		square.ondragstart = function () {
			return false;
		};
	}
}

board.addEventListener('mousedown', (event) => {
	isMouseDown = true;
	changeColor(event.target);
});

board.addEventListener('mouseup', () => (isMouseDown = false));
board.addEventListener('dragstart', () => false);

board.addEventListener('mousemove', (event) => {
	if (isMouseDown) {
		changeColor(event.target);
	}
});

container.addEventListener('mouseup', () => (isMouseDown = false));

function changeColor(element) {
	const [x, y] = [+element.getAttribute('data-x'), +element.getAttribute('data-y')];

	for (let i = y + 1; i < HEIGHT; i++) {
		document.querySelector(`div[data-y='${i}'][data-x='${x}']`).dataset.isColored = 0;
	}
	for (let i = y; i >= 0; i--) {
		document.querySelector(`div[data-y='${i}'][data-x='${x}']`).dataset.isColored = 1;
	}

	heights[x] = y;

	const [total, water] = calculatePool(Object.values(heights));
	addWater(water);
	document.querySelector('.totalVolume > span').innerHTML = total;
}

function addWater(water) {
	document.querySelectorAll('div[data-has-water="1"]').forEach((item) => (item.dataset.hasWater = 0));

	for (let items of water) {
		for (let i = items[1] + 1; i < items[1] + items[2] + 1; i++) {
			if (i > 0) document.querySelector(`div[data-y='${i}'][data-x='${items[0]}']`).dataset.hasWater = 1;
		}
	}
}

function calculatePool(height) {
	let maxLeft = height[0];
	let maxRight = height[height.length - 1];
	let left = 1;
	let right = height.length - 2;
	let total = 0;
	const water = [];

	while (left <= right) {
		if (maxLeft <= maxRight) {
			maxLeft = Math.max(maxLeft, height[left]);
			total += maxLeft - height[left];
			water.push([left, height[left], maxLeft - height[left]]);
			left += 1;
		} else {
			maxRight = Math.max(maxRight, height[right]);
			total += maxRight - height[right];
			water.push([right, height[right], maxRight - height[right]]);
			right -= 1;
		}
	}
	return [total, water];
}
