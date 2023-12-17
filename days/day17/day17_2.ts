import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const bStr = Board.fromString(input);
const b = bStr.newFromMap((x) => parseInt(x));
const shortest = b.newFromMap((_) => [
	99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999,
	99999,
]);

//shortest (0,1,2) = x positive
//shortest (3,4,5) = x negative
//shortest (6,7,8) = y positive
//shortest (9,10,11) = y negative

let poi: [number, number, number, number, number, number][] = [];
let currentBest = 999999;
// NONE OF THIS IS NEEDED, BC. BFS with tendency towards +x and +y.
// A currentBest will quickly be found!

// let cost = 0;
// for (let i = 0; i < Math.ceil(b.width/4) - 1; i++) {
// 	evaluate(i, i + 1, cost, 0, 1, 1);
// 	cost += b.get(i, i + 1);
//     evaluate(i, i + 2, cost, 0, 1, 2);
// 	cost += b.get(i, i + 2);
//     evaluate(i, i + 3, cost, 0, 1, 3);
// 	cost += b.get(i, i + 3);
//     evaluate(i, i + 4, cost, 0, 1, 4);
// 	cost += b.get(i, i + 4);

// 	evaluate(i + 1, i + 1, cost, 1, 0, 1);
// 	cost += b.get(i + 1, i + 1);
//     evaluate(i + 1, i + 1, cost, 1, 0, 1);
// 	cost += b.get(i + 1, i + 1);
//     evaluate(i + 1, i + 1, cost, 1, 0, 1);
// 	cost += b.get(i + 1, i + 1);
//     evaluate(i + 1, i + 1, cost, 1, 0, 1);
// 	cost += b.get(i + 1, i + 1);
// }
evaluate(4, 0, b.get(1, 0) + b.get(2, 0) + b.get(3, 0), 1, 0, 4);
evaluate(0, 4, b.get(0, 1) + b.get(0, 2) + b.get(0, 3), 0, 1, 4);

console.log(currentBest);
shortest.newFromMap((s) => s.allMin()[0]).print();
let i = 0;

while (poi.length > 0) {
	i = (i + 1) % 10_000_000;
	if (i === 0) console.log(currentBest);
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
	if (dirLen > 10) return;

	const pathLen = cost + b.get(x, y);
	if (x === b.width - 1 && y === b.height - 1) {
		currentBest = Math.min(pathLen, currentBest);
	}

	if (dirLen < 4) {
		if (b.isInside(x + dirX, y + dirY))
			poi.push([x + dirX, y + dirY, pathLen, dirX, dirY, dirLen + 1]);
	} else {
		const si = getShortestIndex(dirX, dirY, dirLen);
		if (pathLen > currentBest) return;
		const shortestItem = shortest.get(x, y);
		if (pathLen >= shortestItem[si]) return;

		shortestItem[si] = pathLen;

		// Adding x+1, y+1 AFTER x-1, y-1 (to the end of the array) allows currentBest to converge quickly
		// (why did I do the manual starting path in part 1...?)
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
