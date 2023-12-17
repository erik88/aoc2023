import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const bStr = Board.fromString(input);
const b = bStr.newFromMap((x) => parseInt(x));
//b.set(0, 0, 0);
const shortest = b.newFromMap((_) => [
	99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999,
	99999,
]);

// let poi = [[0, 0, 0]];

// while (poi.length > 0) {
// 	const [x, y, cost] = poi.take(1)[0];
// 	if (!b.isInside(x, y)) continue;

// 	const pathLen = cost + b.get(x, y);
// 	if (pathLen >= shortest.get(x, y)) continue;

// 	shortest.set(x, y, pathLen);

// 	poi.push([x - 1, y, pathLen]);
// 	poi.push([x + 1, y, pathLen]);
// 	poi.push([x, y - 1, pathLen]);
// 	poi.push([x, y + 1, pathLen]);
// }

//shortest (0,1,2) = x positive
//shortest (3,4,5) = x negative
//shortest (6,7,8) = y positive
//shortest (9,10,11) = y negative

// let poi = [[0, 0, -b.get(0, 0), 0, 0, 0]];
let poi: [number, number, number, number, number, number][] = [];
let currentBest = 999999;

// Setting an initial value for currentBest by going a staircase pattern: +x +y
// Turns out to be completely unneccessary, because the search is BFS which
// will always go down, right first, quickly finding a currentBest anyway
let cost = 0;
for (let i = 0; i < b.width - 1; i++) {
	evaluate(i, i + 1, cost, 0, 1, 1);
	cost += b.get(i, i + 1);
	evaluate(i + 1, i + 1, cost, 1, 0, 1);
	cost += b.get(i + 1, i + 1);
}
evaluate(1, 0, 0, 1, 0, 1);
console.log(currentBest);
//shortest.newFromMap((s) => s.allMin()[0]).print();
let i = 0;

// 870 too high
// 1468 way too high

while (poi.length > 0) {
	i = (i + 1) % 10_000_000;
	if (i === 0) console.log(currentBest);
	// Fun fact: Array.shift() and Array.slice() are _extremely_ slow
	const [x, y, cost, dirX, dirY, dirLen] = poi.pop();
	evaluate(x, y, cost, dirX, dirY, dirLen);
}

console.log(shortest.get(shortest.width - 1, shortest.height - 1).allMin()[0]);
console.log(currentBest);

//shortest.newFromMap((s) => s.allMin()[0]).print();

function evaluate(
	x: number,
	y: number,
	cost: number,
	dirX: number,
	dirY: number,
	dirLen: number
) {
	if (dirLen > 3) return;

	const pathLen = cost + b.get(x, y);
	const si = getShortestIndex(dirX, dirY, dirLen);
	if (pathLen > currentBest) return;
	const shortestItem = shortest.get(x, y);
	if (pathLen >= shortestItem[si]) return;

	shortestItem[si] = pathLen;
	if (x === b.width - 1 && y === b.height - 1) {
		currentBest = Math.min(pathLen, currentBest);
	}

	if (dirX !== 1 && b.isInside(x - 1, y)) {
		poi.push([x - 1, y, pathLen, -1, 0, dirX === -1 ? dirLen + 1 : 1]);
	}
	if (dirY !== 1 && b.isInside(x, y - 1)) {
		poi.push([x, y - 1, pathLen, 0, -1, dirY === -1 ? dirLen + 1 : 1]);
	}
	if (dirX !== -1 && b.isInside(x + 1, y)) {
		poi.push([x + 1, y, pathLen, 1, 0, dirX === 1 ? dirLen + 1 : 1]);
	}
	if (dirY !== -1 && b.isInside(x, y + 1)) {
		poi.push([x, y + 1, pathLen, 0, 1, dirY === 1 ? dirLen + 1 : 1]);
	}
}

//shortest (0,1,2) = x positive
//shortest (3,4,5) = x negative
//shortest (6,7,8) = y positive
//shortest (9,10,11) = y negative

function getShortestIndex(dirX: number, dirY: number, dirLen: number): number {
	if (dirX === 1) return dirLen - 1;
	if (dirX === -1) return dirLen + 2;
	if (dirY === 1) return dirLen + 5;
	if (dirY === -1) return dirLen + 8;
	throw new Error("No direction!");
}
