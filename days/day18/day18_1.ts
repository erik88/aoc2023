import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const lines = input.split("\n");

const instructions = lines.map((l) => {
	const s = l.split(" ");
	return {
		dir: s[0],
		len: parseInt(s[1]),
		color: s[2].substring(1, s[2].length - 1),
	};
});

let minX = 0;
let maxX = 0;
let minY = 0;
let maxY = 0;

function findDimensions() {
	let x = 0;
	let y = 0;

	instructions.forEach((ins) => {
		if (ins.dir === "U") {
			y -= ins.len;
		} else if (ins.dir === "D") {
			y += ins.len;
		} else if (ins.dir === "L") {
			x -= ins.len;
		} else if (ins.dir === "R") {
			x += ins.len;
		} else {
			throw new Error("Unknown direction");
		}

		minX = Math.min(x, minX);
		minY = Math.min(y, minY);
		maxY = Math.max(y, maxY);
		maxX = Math.max(x, maxX);
	});
	console.log(`${minX} -> ${maxX} ; ${minY} -> ${maxY} ; `);
}

findDimensions();

let b = Board.fromEmpty(".", maxX - minX + 1, maxY - minY + 1);

strokeOutline();
fillLand();

function strokeOutline() {
	let x = Math.abs(minX);
	let y = Math.abs(minY);

	b.set(x, y, "#");

	instructions.forEach((ins) => {
		let newX = x;
		let newY = y;
		if (ins.dir === "U") {
			newY = y - ins.len;
		} else if (ins.dir === "D") {
			newY = y + ins.len;
		} else if (ins.dir === "L") {
			newX = x - ins.len;
		} else if (ins.dir === "R") {
			newX = x + ins.len;
		}
		b.mapRange(x, y, newX, newY, (_) => "#");
		x = newX;
		y = newY;
	});

	Deno.writeTextFileSync("output.txt", b.toString());
}

function fillLand() {
	let poi: [number, number][] = [];
	for (let x = 0; x < b.width; x++) {
		poi.push([x, 0]);
		poi.push([x, b.height - 1]);
	}
	for (let y = 0; y < b.height; y++) {
		poi.push([0, y]);
		poi.push([b.width - 1, y]);
	}

	while (poi.length > 0) {
		const [x, y] = poi.pop();
		if (!b.isInside(x, y)) continue;
		if (!(b.get(x, y) === ".")) continue;
		b.set(x, y, " ");
		poi.push([x - 1, y]);
		poi.push([x, y - 1]);
		poi.push([x + 1, y]);
		poi.push([x, y + 1]);
	}

	Deno.writeTextFileSync("output2.txt", b.toString());
}

console.log(
	b.arr.filter((x) => x === ".").length + b.arr.filter((x) => x === "#").length
);

console.log("");
