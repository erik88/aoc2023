import { Board } from "./helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const lines = input.split("\n");

interface Point {
	x: number;
	y: number;
}

function findPoints(): [Point[], number] {
	const first: Point = { x: 0, y: 0 };
	let x = 0;
	let y = 0;

	let totalDistance = 0;

	const points = lines.map((l) => {
		const s = l.split(" ");
		const lenStr = s[2].substring(2, 7);
		const dirStr = s[2].substring(7, 8);
		const length = parseLength(lenStr);

		if (dirStr === "3") {
			y -= length;
		} else if (dirStr === "1") {
			y += length;
		} else if (dirStr === "2") {
			x -= length;
		} else if (dirStr === "0") {
			x += length;
		} else {
			throw new Error("Unknown direction");
		}
		totalDistance += length;
		let p: Point;
		if (x === 0 && y === 0) {
			p = first;
		} else {
			p = {
				x,
				y,
			};
		}

		return p;
	});

	return [points, totalDistance];
}

function parseLength(s: string): number {
	return parseInt(s, 16);
}

const [points, totalDistance] = findPoints();

// I dedicate my thanks to wikipedia
// Trapezoid formula
let area = 0;
for (let i = 0; i < points.length; i++) {
	const i2 = (i + 1) % points.length;
	area += (points[i].x - points[i2].x) * (points[i].y + points[i2].y);
}
area /= 2;

// Pick's theorem. Once again, wikipedia. I <3 you.
// area = innerPoints + boundaryPoints/2 - 1
// boundaryPoints + innerPoints = area + boundaryPoints/2 + 1

console.log(area + totalDistance / 2 + 1);
