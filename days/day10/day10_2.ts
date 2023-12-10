import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");

const b = Board.fromString(input);

let pipeParts: Set<string> = new Set();

markPipes();
removeNotInPipe();
const sb = scale();
Deno.writeTextFileSync("output2.txt", sb.toString());

markOutside();
Deno.writeTextFileSync("output3.txt", sb.toString());

const finalBoard = scaleBack();
Deno.writeTextFileSync("output4.txt", finalBoard.toString());
console.log(finalBoard.arr.filter((x) => x === ".").length);

function markPipes() {
	const directions = {
		"-": [
			[-1, 0],
			[1, 0],
		],
		"|": [
			[0, -1],
			[0, 1],
		],
		F: [
			[1, 0],
			[0, 1],
		],
		"7": [
			[-1, 0],
			[0, 1],
		],
		J: [
			[-1, 0],
			[0, -1],
		],
		L: [
			[1, 0],
			[0, -1],
		],
	};

	let [x, y] = b.find("S");
	let steps = 0;
	pipeParts.add(`${x};${y}`);

	// step 1
	let [x0, y0] = [x, y];
	x++;
	let c = b.get(x, y);
	pipeParts.add(`${x};${y}`);

	while (c !== "S") {
		const diffs = directions[c];
		let [dx, dy] = diffs.filter(
			([dxC, dyC]) => !(x + dxC === x0 && y + dyC === y0)
		)[0];
		x0 = x;
		y0 = y;
		x += dx;
		y += dy;
		pipeParts.add(`${x};${y}`);
		c = b.get(x, y);
	}
}

function removeNotInPipe() {
	b.mapAll((t, xc, yc) => (pipeParts.has(`${xc};${yc}`) ? t : "."));
}

function scale(): Board<string> {
	const transform = {
		L: Board.fromMatrix([
			[".", "x", "."],
			[".", "x", "x"],
			[".", ".", "."],
		]),
		J: Board.fromMatrix([
			[".", "x", "."],
			["x", "x", "."],
			[".", ".", "."],
		]),
		7: Board.fromMatrix([
			[".", ".", "."],
			["x", "x", "."],
			[".", "x", "."],
		]),
		F: Board.fromMatrix([
			[".", ".", "."],
			[".", "x", "x"],
			[".", "x", "."],
		]),
		"-": Board.fromMatrix([
			[".", ".", "."],
			["x", "x", "x"],
			[".", ".", "."],
		]),
		"|": Board.fromMatrix([
			[".", "x", "."],
			[".", "x", "."],
			[".", "x", "."],
		]),
		// S is "-" in input
		S: Board.fromMatrix([
			[".", ".", "."],
			["x", "x", "x"],
			[".", ".", "."],
		]),
		".": Board.fromMatrix([
			[".", ".", "."],
			[".", ".", "."],
			[".", ".", "."],
		]),
	};

	const b2 = Board.fromEmpty("R", b.width * 3, b.height * 3);
	for (let x = 0; x < b.width; x++) {
		for (let y = 0; y < b.height; y++) {
			const b0: Board<string> = transform[b.get(x, y)];
			for (let x0 = 0; x0 < b0.width; x0++) {
				for (let y0 = 0; y0 < b0.height; y0++) {
					b2.set(x * 3 + x0, y * 3 + y0, b0.get(x0, y0));
				}
			}
		}
	}

	if (b2.arr.some((x) => x === "R"))
		throw new Error("Scaling failed, R still exists");
	return b2;
}

function markOutside() {
	let poi: [number, number][] = [[0, 0]];
	let checked: Set<string> = new Set();

	while (poi.length > 0) {
		const [[x, y]] = poi.splice(0, 1);
		if (checked.has(`${x};${y}`)) continue;

		if (x < 0 || x >= sb.width || y < 0 || y >= sb.height) continue;
		if (sb.get(x, y) === "x") continue;

		poi.push([x + 1, y]);
		poi.push([x - 1, y]);
		poi.push([x, y + 1]);
		poi.push([x, y - 1]);

		sb.set(x, y, " ");
		checked.add(`${x};${y}`);
	}
}

function scaleBack(): Board<string> {
	const b3 = Board.fromEmpty("R", sb.width / 3, sb.height / 3);
	for (let x = 0; x < b.width; x++) {
		for (let y = 0; y < b.height; y++) {
			const vals = [
				sb.get(x * 3, y * 3),
				sb.get(x * 3 + 1, y * 3),
				sb.get(x * 3 + 2, y * 3),
				sb.get(x * 3, y * 3 + 1),
				sb.get(x * 3 + 1, y * 3 + 1),
				sb.get(x * 3 + 2, y * 3 + 1),
				sb.get(x * 3, y * 3 + 2),
				sb.get(x * 3 + 1, y * 3 + 2),
				sb.get(x * 3 + 2, y * 3 + 2),
			];

			let mapVal = "R";
			if (vals.some((v) => v === "x")) {
				mapVal = "x";
			} else if (vals.every((v) => v === ".")) {
				mapVal = ".";
			} else if (vals.every((v) => v === " ")) {
				mapVal = " ";
			}
			b3.set(x, y, mapVal);
		}
	}
	return b3;
}
