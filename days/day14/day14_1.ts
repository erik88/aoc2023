import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("input.txt");
// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

let b = Board.fromString(input);

const rocks = [];

for (let y = 0; y < b.height; y++) {
	for (let x = b.width - 1; x >= 0; x--) {
		moveIfRock(x, y);
	}
}

b.print();

for (let i = b.height - 1; i >= 0; i--) {
	const score = b.height - i;

	rocks.push(
		...b
			.getRow(i)
			.filter((x) => x === "O")
			.map((x) => score)
	);
}

console.log(rocks.sum());

function moveIfRock(x: number, y: number) {
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
