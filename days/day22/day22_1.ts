import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const lines = input.split("\n");

const Aval = "A".charCodeAt(0);

const bricks: Brick[] = lines
	.map((l, i) => {
		const ls = l.split("~");
		function toVertex(s: string): Vertex {
			const v = s.split(",");
			return { x: parseInt(v[0]), y: parseInt(v[1]), z: parseInt(v[2]) };
		}
		return {
			v1: toVertex(ls[0]),
			v2: toVertex(ls[1]),
			restsOn: [],
			onTop: [],
			name: String.fromCharCode(Aval + i),
		};
	})
	.sortBy((b) => b.v1.z);

if (bricks.map(isPositiveltAligned).some((x) => !x)) {
	throw new Error("Not all bricks are positively aligned!");
} else {
	console.log("All bricks are positively aligned");
}

const maxX = bricks.allMax((b) => b.v2.x)[0].v2.x + 1;
const maxY = bricks.allMax((b) => b.v2.y)[0].v2.y + 1;
console.log("Size of grid: " + maxX, maxY);

const baseArr: (Brick | null)[] = new Array(maxX * maxY);
for (let i = 0; i < baseArr.length; i++) baseArr[i] = null;
const zMap = Board.fromArray(baseArr, maxX);

bricks.forEach((b, i) => (b.name = "" + i));

bricks.forEach((b) => {
	printBrick(b);
	const below: Brick[] = [];
	for (let x = b.v1.x; x <= b.v2.x; x++) {
		for (let y = b.v1.y; y <= b.v2.y; y++) {
			const brickBelow = zMap.get(x, y);
			if (brickBelow !== null) {
				below.push(brickBelow);
			}
		}
	}

	// Fuck me backwards 2h wasted on missing unique}
	const firstBelow = below.allMax((x) => x.v2.z).unique((x) => x.name);

	if (firstBelow.length > 0) {
		const newZ = firstBelow[0].v2.z + 1;
		firstBelow.forEach((fb) => {
			fb.onTop.push(b);
			b.restsOn.push(fb);
		});
		fallToZ(b, newZ);
	} else {
		fallToZ(b, 1);
	}

	printBrick(b);

	for (let x = b.v1.x; x <= b.v2.x; x++) {
		for (let y = b.v1.y; y <= b.v2.y; y++) {
			zMap.set(x, y, b);
		}
	}
	zMap.newFromMap((z) => z?.name ?? ".").print();
	console.log("    ");
	zMap.newFromMap((z) => z?.v2.z ?? ".").print();
	console.log("======");
});

function printBrick(b: Brick) {
	console.log(`${b.v1.x} ${b.v1.y} ${b.v1.z} ~ ${b.v2.x} ${b.v2.y} ${b.v2.z}`);
}

const freeBricks = bricks.filter((b) => {
	return b.onTop.every((b) => b.restsOn.length > 1);
});
console.log(freeBricks.length);

console.log("");

// 328 is too LOW
// 590 is too HIGH
// 398 is juuust right

function fallToZ(b: Brick, z: number) {
	if (b.v1.z < z) {
		throw new Error("Brick cannot fall up");
	}
	const diff = b.v1.z - z;
	b.v1.z -= diff;
	b.v2.z -= diff;
}

function isPositiveltAligned(b: Brick): boolean {
	return b.v1.x <= b.v2.x && b.v1.y <= b.v2.y && b.v1.z <= b.v2.z;
}

type Vertex = {
	x: number;
	y: number;
	z: number;
};

type Brick = {
	v1: Vertex;
	v2: Vertex;
	restsOn: Brick[];
	onTop: Brick[];
	name: string;
};
