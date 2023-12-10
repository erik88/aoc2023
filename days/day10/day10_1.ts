import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");

const b = Board.fromString(input);

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

// step 1
let [x0, y0] = [x, y];
x++;
steps++;
let c = b.get(x, y);

while (c !== "S") {
	const diffs = directions[c];
	let [dx, dy] = diffs.filter(
		([dxC, dyC]) => !(x + dxC === x0 && y + dyC === y0)
	)[0];
	x0 = x;
	y0 = y;
	x += dx;
	y += dy;
	c = b.get(x, y);
	steps++;
}
console.log(steps);
