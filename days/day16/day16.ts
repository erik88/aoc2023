import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const b = Board.fromString(input);
let b2 = Board.fromEmpty(0, b.width, b.height);

let visited: Set<string> = new Set();

function beam([x, y]: [number, number], [xdir, ydir]: [number, number]) {
	if (!b.isInside(x, y)) return;
	if (xdir === 0 && ydir === 0) {
		throw new Error("xdir and ydir are both 0");
	}
	if (xdir !== 0 && ydir !== 0) {
		throw new Error("xdir and ydir both have values!");
	}
	const setKey = `${x},${y},${xdir},${ydir}`;
	if (visited.has(setKey)) {
		return;
	}

	visited.add(setKey);

	b2.map(x, y, (t) => t + 1);
	const char = b.get(x, y);
	if (char === ".") {
		beam([x + xdir, y + ydir], [xdir, ydir]);
	} else if (char === "-") {
		if (ydir !== 0) {
			beam([x + 1, y], [1, 0]);
			beam([x - 1, y], [-1, 0]);
		} else {
			beam([x + xdir, y + ydir], [xdir, ydir]);
		}
	} else if (char === "|") {
		if (xdir !== 0) {
			beam([x, y + 1], [0, 1]);
			beam([x, y - 1], [0, -1]);
		} else {
			beam([x + xdir, y + ydir], [xdir, ydir]);
		}
	} else if (char === "/") {
		const newXDir = -ydir;
		const newYDir = -xdir;
		beam([x + newXDir, y + newYDir], [newXDir, newYDir]);
	} else if (char === "\\") {
		const newXDir = ydir;
		const newYDir = xdir;
		beam([x + newXDir, y + newYDir], [newXDir, newYDir]);
	} else {
		throw new Error("Unexpected char: " + char);
	}
}

function energizeStartingAt(
	[x, y]: [number, number],
	dir: [number, number]
): number {
	b2 = Board.fromEmpty(0, b.width, b.height);
	visited = new Set();

	beam([x, y], dir);
	return b2.arr.map((x) => (x !== 0 ? 1 : 0)).sum();
}

let max = 0;
for (let x = 0; x < b.width; x++) {
	max = Math.max(max, energizeStartingAt([x, 0], [0, 1]));
	max = Math.max(max, energizeStartingAt([x, b.height - 1], [0, -1]));
}
for (let y = 0; y < b.height; y++) {
	max = Math.max(max, energizeStartingAt([0, y], [1, 0]));
	max = Math.max(max, energizeStartingAt([b.width - 1, y], [-1, 0]));
}

// part1
// beam([0, 0], [1, 0]);

console.log(max);
