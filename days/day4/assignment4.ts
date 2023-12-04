import "/helpers/arrays.ts";
import "/helpers/sets.ts";

let input = Deno.readTextFileSync("input4.txt");

let lines = input.split("\n");

const copies = new Array<number>(lines.length);
copies.fill(1);

const matches = lines.map((l, currentLineIndex) => {
	const [winningStr, mineStr] = l.split(":")[1].split("|");
	const winning = extractNumbers(winningStr);
	const mine = extractNumbers(mineStr);

	const w = new Set(winning);
	const m = new Set(mine);

	const ok = w.intersection(m);

	for (let j = 0; j < copies[currentLineIndex]; j++) {
		for (
			let i = currentLineIndex + 1;
			i < currentLineIndex + 1 + ok.size;
			i++
		) {
			copies[i]++;
		}
	}

	return [...ok];
});

console.log(copies.sum());

// console.log(matches);
// const scores = matches.map((x) => {
// 	if (x.length === 0) return 0;
// 	return Math.pow(2, x.length - 1);
// });
// console.log(scores);
// console.log(scores.sum());

function extractNumbers(s: string): number[] {
	const matches = s.matchAll(/\d+/g);
	return [...matches].map((x) => parseInt(x[0]));
}
