import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// DON'T TRUST IT, IT'S A TRAP!
// const input = Deno.readTextFileSync("test.txt");

const input = Deno.readTextFileSync("input.txt");

const inputHuge = scaleUp(input.replace("S", "."), 29);
const b = Board.fromString(inputHuge);

let possible: [number, number][] = [[(b.width - 1) / 2, (b.height - 1) / 2]];
console.log("Starting at", possible[0][0], possible[0][1]);
let newPossible: [number, number][] = [];

let steps = 0;
// 65 = 3691              87748  116720
// 65 + 131*2 = 91439    204468  116720
// 65 + 131*4 = 295907   321188  116720
// 65 + 131*6 = 617095   437908  116720
// 65 + 131*8 = 1055003  554628  116720
// 65 + 131*10= 1609631  671348  116720
// 65 + 131*12= 2280979  788068
// 65 + 131*14= 3069047
// i.e. its a f*ing 2nd degree equation.

// let's find the equation...
// ax^2 + bx + c = totalSquares
// a*12^2 + b*12 + c = 2280979
// a*10^2 + b*10 + c = 1609631
// a* 8^2 + b*8  + c = 1055003
//
// [144 12 1; 100 10 1; 64 8 1][a; b; c] = [2280979; 1609631; 1055003]
// [a; b; c] = inv([144 12 1; 100 10 1; 64 8 1])*[2280979; 1609631; 1055003]
// Hello Julia
// [a; b; c] = [14590.0; 14694.0; 3691.0]

// Edge of square
// 26501365 - 65 = 26501300
// Total squares in a row
// 26501300 / 131 = 202300

// So...
// 14590*202300^2 + 14482*202300 + 3585
console.log(14590n * (202300n * 202300n) + 14694n * 202300n + 3691n);

// 597102906361508 is too low :<
// 597102910812185 is too low :C
// 597102953699891 is just right...

// For part 1
// while (steps < 64) {
while (steps < 65 + 131 * 14) {
	newPossible = [];
	possible.forEach(([x, y]) => {
		tryAdd(x + 1, y);
		tryAdd(x, y + 1);
		tryAdd(x - 1, y);
		tryAdd(x, y - 1);
	});
	possible = newPossible;
	steps++;
}

function tryAdd(x: number, y: number) {
	if (!b.isInside(x, y)) return;
	if (b.get(x, y) !== ".") return;
	b.set(x, y, "O");

	newPossible.push([x, y]);
}

b.mapAll((t, x, y) => {
	if (t !== "O") return t;
	// For part 1
	// return (x + y) % 2 === 0 ? "O" : ".";
	return (x + y) % 2 === 1 ? "O" : ".";
});
console.log(b.arr.filter((x) => x == "O").length);
// Deno.writeTextFileSync("output.txt", b.toString());

function scaleUp(source: string, times: number) {
	const lines = source.split("\n");
	const newLines: string[] = [];

	for (const line of lines) {
		let newLine = "";
		for (let j = 0; j < times; j++) {
			newLine += line;
		}
		newLines.push(newLine);
	}

	const n = newLines.join("\n");
	const all = [];
	for (let j = 0; j < times; j++) {
		all.push(n);
	}

	return all.join("\n");
}
