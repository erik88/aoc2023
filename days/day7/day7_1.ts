import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const input = Deno.readTextFileSync("input.txt");

const cardValues = "AKQJT98765432";

const lines = input.split("\n");

const plays = lines.map((x) => {
	return {
		hand: x.split(" ")[0],
		bid: parseInt(x.split(" ")[1]),
	};
});

plays.sort((a, b) => compareHandStrength(a.hand, b.hand));

console.log(plays.map((p, i) => (i + 1) * p.bid).sum());

console.log(isFullHouse("53533"));

function isFive(h: string) {
	const arr = h.split("");
	return arr.every((x) => x === arr[0]);
}

function isFour(h: string) {
	const map = h.split("").groupBy((x) => x);
	let ok = false;
	map.forEach((val, key) => {
		if (val.length === 4) {
			ok = true;
		}
	});
	return ok;
}

function isFullHouse(h: string) {
	const map = h.split("").groupBy((x) => x);
	const keyVal = [...map.entries()];

	return keyVal.length === 2 && keyVal[0][1].length * keyVal[1][1].length == 6;
}

function isThree(h: string) {
	const map = h.split("").groupBy((x) => x);
	const keyVal = [...map.entries()];

	return keyVal.some(([_, val]) => val.length === 3);
}

function isTwoPair(h: string) {
	const map = h.split("").groupBy((x) => x);
	const keyVal = [...map.entries()];

	return (
		keyVal.length === 3 &&
		keyVal[0][1].length * keyVal[1][1].length * keyVal[2][1].length === 4
	);
}

function isOnePair(h: string) {
	const map = h.split("").groupBy((x) => x);
	const keyVal = [...map.entries()];

	return keyVal.some(([_, val]) => val.length === 2);
}

function getCardValue(c: string) {
	return cardValues.length - cardValues.indexOf(c);
}

function getRelativeStrength(h: string) {
	let tests = [isFive, isFour, isFullHouse, isThree, isTwoPair, isOnePair];

	for (let i = 0; i < tests.length; i++) {
		if (tests[i](h)) {
			return tests.length - i;
		}
	}

	return 0;
}

function compareHandStrength(h1: string, h2: string) {
	const rel1 = getRelativeStrength(h1);
	const rel2 = getRelativeStrength(h2);

	if (rel1 < rel2) return -1;
	else if (rel1 > rel2) return 1;

	for (let i = 0; i < h1.length; i++) {
		const cv1 = getCardValue(h1.charAt(i));
		const cv2 = getCardValue(h2.charAt(i));

		if (cv1 < cv2) return -1;
		else if (cv1 > cv2) return 1;
	}
	return 0;
}
