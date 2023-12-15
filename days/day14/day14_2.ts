import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

import { encodeHex } from "https://deno.land/std@0.207.0/encoding/hex.ts";

// const input = Deno.readTextFileSync("test.txt");
// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

let b = Board.fromString(input);

let m: Map<string, number> = new Map();

let stateCount = 0;
let cycleLength = 0;
let statesBeforeFirstCycle = 0;

while (true) {
	moveAllRocksUp();
	moveAllRocksLeft();
	moveAllRocksDown();
	moveAllRocksRight();
	stateCount++;
	const hStr = await hash(b.arr.join(""));
	if (m.has(hStr)) {
		const val = m.get(hStr) as number;
		cycleLength = stateCount - val;
		statesBeforeFirstCycle = val;
		console.log("Cycle " + stateCount + " is the same as " + val);
		console.log("Cycle length is " + cycleLength);
		console.log("Items before first cycle " + statesBeforeFirstCycle);
		break;
	}
	m.set(hStr, stateCount);
}

const cycleNo = (1_000_000_000 - statesBeforeFirstCycle) % cycleLength;
console.log("Should find for cycle no: " + cycleNo);
const stepsToVictory = cycleNo + statesBeforeFirstCycle;
console.log("...which is actual item: " + stepsToVictory);

// Start over...
b = Board.fromString(input);
for (let i = 0; i < stepsToVictory; i++) {
	moveAllRocksUp();
	moveAllRocksLeft();
	moveAllRocksDown();
	moveAllRocksRight();
}
console.log(calculateScore());

// 102512 is wrong

async function hash(str: string) {
	const messageBuffer = new TextEncoder().encode(str);

	const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
	return encodeHex(hashBuffer);
}

function calculateScore(): number {
	const rocks = [];
	for (let i = b.height - 1; i >= 0; i--) {
		const score = b.height - i;

		rocks.push(
			...b
				.getRow(i)
				.filter((x) => x === "O")
				.map((x) => score)
		);
	}
	return rocks.sum();
}

function moveAllRocksUp() {
	for (let y = 0; y < b.height; y++) {
		for (let x = b.width - 1; x >= 0; x--) {
			moveUpIfRock(x, y);
		}
	}
}

function moveAllRocksDown() {
	for (let y = b.height - 1; y >= 0; y--) {
		for (let x = b.width - 1; x >= 0; x--) {
			moveDownIfRock(x, y);
		}
	}
}

function moveAllRocksRight() {
	for (let y = 0; y < b.height; y++) {
		for (let x = b.width - 1; x >= 0; x--) {
			moveRightIfRock(x, y);
		}
	}
}

function moveAllRocksLeft() {
	for (let y = 0; y < b.height; y++) {
		for (let x = 0; x < b.width; x++) {
			moveLeftIfRock(x, y);
		}
	}
}

function moveUpIfRock(x: number, y: number) {
	let col = b.getColumn(x);
	if (col[y] !== "O") {
		return;
	}

	let newY = y;

	for (let i = y - 1; i >= 0; i--) {
		if (col[i] !== ".") {
			break;
		}
		newY = i;
	}

	if (newY !== y) {
		b.set(x, y, ".");
		b.set(x, newY, "O");
	}
}

function moveDownIfRock(x: number, y: number) {
	let col = b.getColumn(x);
	if (col[y] !== "O") {
		return;
	}

	let newY = y;

	for (let i = y + 1; i < b.height; i++) {
		if (col[i] !== ".") {
			break;
		}
		newY = i;
	}

	if (newY !== y) {
		b.set(x, y, ".");
		b.set(x, newY, "O");
	}
}

function moveRightIfRock(x: number, y: number) {
	let row = b.getRow(y);
	if (row[x] !== "O") {
		return;
	}

	let newX = x;

	for (let i = x + 1; i < b.width; i++) {
		if (row[i] !== ".") {
			break;
		}
		newX = i;
	}

	if (newX !== x) {
		b.set(x, y, ".");
		b.set(newX, y, "O");
	}
}

function moveLeftIfRock(x: number, y: number) {
	let row = b.getRow(y);
	if (row[x] !== "O") {
		return;
	}

	let newX = x;

	for (let i = x - 1; i >= 0; i--) {
		if (row[i] !== ".") {
			break;
		}
		newX = i;
	}

	if (newX !== x) {
		b.set(x, y, ".");
		b.set(newX, y, "O");
	}
}
