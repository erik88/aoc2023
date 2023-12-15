import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const items = input.split(",");

const labels: Label[] = items.map((s) => {
	let i = 0;
	let label = "";
	for (; i < s.length; i++) {
		const val = s.charCodeAt(i);
		if (!("a".charCodeAt(0) <= val && val <= "z".charCodeAt(0))) break;
		label += s.charAt(i);
	}
	const operation = s.charAt(i);
	i++;
	const rest = s.substring(i);
	const maybeFocalLength = parseInt(rest);
	const focalLength = isNaN(maybeFocalLength) ? null : maybeFocalLength;

	return {
		text: label,
		focalLength,
		operation,
	};
});

const boxes: Box[] = new Array(256);
for (let i = 0; i < boxes.length; i++) boxes[i] = { lenses: [] };
//boxes.fill(JSON.parse(JSON.stringify({ lenses: [] })));

labels.forEach((label) => {
	const box = boxes[getBox(label)];
	if (label.operation === "-") {
		box.lenses = box.lenses.filter((x) => x.text !== label.text);
	} else if (label.operation === "=") {
		const index = box.lenses.findIndex((x) => x.text === label.text);
		if (index === -1) {
			box.lenses.push(getLens(label));
		} else {
			box.lenses[index] = getLens(label);
		}
	} else {
		throw new Error("Unknown operation!");
	}
});

// console.log(boxes);
console.log(
	boxes
		.map((b, bi) =>
			b.lenses.map((l, li) => (bi + 1) * (li + 1) * l.focalLength).sum()
		)
		.sum()
);
console.log("");

interface Label {
	text: string;
	focalLength: number | null;
	operation: string;
}

interface Box {
	lenses: Lens[];
}

interface Lens {
	text: string;
	focalLength: number;
}

function getLens(l: Label): Lens {
	if (l.focalLength === null) {
		throw new Error("Cannot get lens with NaN as focal length");
	}
	return {
		text: l.text,
		focalLength: l.focalLength,
	};
}

function getBox(l: Label) {
	let hash = 0;
	for (let i = 0; i < l.text.length; i++) {
		hash += l.text.charCodeAt(i);
		hash *= 17;
		hash %= 256;
	}
	return hash;
}

// console.log(items.map((itm) => calcHash(itm)).sum());

// function calcHash(s: string) {
// 	let hash = 0;
// 	for (let i = 0; i < s.length; i++) {
// 		hash += s.charCodeAt(i);
// 		hash *= 17;
// 		hash %= 256;
// 	}
// 	return hash;
// }
