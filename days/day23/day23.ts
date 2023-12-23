import { Board } from "/helpers/board.ts";
import "/helpers/arrays.ts";
import "/helpers/sets.ts";

// ==============================================
const nodeNames =
	"0123456789abcdefghijklmnopqrstuvwxyzåäöABCDEFGHIJKLMNOPQRSTUVWXZÅÄÖ*~-_:;,|!@¤$%€&¥/{([)]=}?\\`±´'";
let nodeNameCount = 0;

function getNodeName(): string {
	return nodeNames.charAt(nodeNameCount++ % nodeNames.length);
}

// PART1 test should be 94
// PART1 real should be 2294
// PART2 test should be 154
// PART2 real...
// 4913 is too low
// 5466 is too low
// 6418 is CORRECT :D
const PART2 = true;
const VISITED = " ";
// ==============================================

// const input = Deno.readTextFileSync("test.txt");
const input = Deno.readTextFileSync("input.txt");

const b = Board.fromString(input);
if (PART2) {
	b.mapAll((t) => (t === "#" ? "#" : "."));
}

const [startNode, endNode] = getStartEndNodes();
const nodeMap = Board.fromEmpty<Node | null>(null, b.width, b.height);
nodeMap.set(startNode.x, startNode.y, startNode);
nodeMap.set(endNode.x, endNode.y, endNode);

b.set(startNode.x, startNode.y, VISITED);
buildGraphStartingAt([startNode.x, startNode.y + 1, "d", 1, !PART2, startNode]);

const nodeNameMap: Map<string, Node> = new Map();

nodeMap.forEach((n, x, y) => {
	if (n) {
		b.set(x, y, n.name);
		nodeNameMap.set(n.name, n);
	}
});
Deno.writeTextFileSync("output.txt", b.toString());

console.log(findBiggest());

function findBiggest() {
	let biggest = 0;
	const poi: [Node, number, Set<Node>][] = [];
	poi.push([startNode, 0, new Set([startNode])]);
	while (poi.length > 0) {
		const [node, len, visited] = poi.pop() as [Node, number, Set<Node>];
		if (node == endNode) {
			if (len > biggest) biggest = len;
			continue;
		}

		node.paths.forEach((p) => {
			const e = p.endpoint;
			if (!visited.has(e)) {
				poi.push([e, len + p.len, new Set([...visited, e])]);
			}
		});
	}
	return biggest;
}

function buildGraphStartingAt(
	start: [number, number, string, number, boolean, Node]
) {
	const poi: [number, number, string, number, boolean, Node][] = [];
	poi.push(start);

	while (poi.length > 0) {
		let [x, y, dir, len, oneWay, currNode] = poi.pop();

		const existingNode = nodeMap.get(x, y);
		if (existingNode) {
			currNode.paths.push({ endpoint: existingNode, len });
			if (!oneWay) {
				existingNode.paths.push({ endpoint: currNode, len });
				if (!PART2) throw new Error("One way was false...!?");
			} else {
				if (PART2) throw new Error("One way was true...!?");
			}
			continue;
		}

		const c = b.get(x, y);
		if (c === VISITED) {
			// We've already been here...
			continue;
		}

		b.set(x, y, VISITED);

		const rc = b.getOr(x + 1, y, "#");
		const lc = b.getOr(x - 1, y, "#");
		const uc = b.getOr(x, y - 1, "#");
		const dc = b.getOr(x, y + 1, "#");

		const r = rc !== "#" && dir !== "l";
		const l = lc !== "#" && dir !== "r";
		const u = uc !== "#" && dir !== "d";
		const d = dc !== "#" && dir !== "u";

		const connectingPaths = +r + +l + +u + +d;

		if (connectingPaths > 1) {
			// Graph is splitting, not previously visited
			const node: Node = { paths: [], name: getNodeName(), x, y };
			currNode.paths.push({ endpoint: node, len });
			nodeMap.set(x, y, node);
			if (!oneWay) {
				node.paths.push({ endpoint: currNode, len });
			}
			currNode = node;
			len = 0;
		}
		// Continue path
		if (r) {
			poi.push([x + 1, y, "r", len + 1, oneWay, currNode]);
		}
		if (l && lc != ">") {
			poi.push([x - 1, y, "l", len + 1, oneWay, currNode]);
		}
		if (u && uc != "v") {
			poi.push([x, y - 1, "u", len + 1, oneWay, currNode]);
		}
		if (d) {
			poi.push([x, y + 1, "d", len + 1, oneWay, currNode]);
		}
	}
}

function getStartEndNodes(): [Node, Node] {
	let x0 = 0;
	for (; x0 < b.width; x0++) {
		const p = b.get(x0, 0);
		if (p === ".") break;
	}
	if (x0 >= b.width) {
		throw new Error("Could not find starting point");
	}

	let x1 = 0;
	for (; x1 < b.width; x1++) {
		const p = b.get(x1, b.height - 1);
		if (p === ".") break;
	}
	if (x1 >= b.width) {
		throw new Error("Could not find ending point");
	}
	return [
		{ name: getNodeName(), paths: [], x: x0, y: 0 },
		{ name: "§", paths: [], x: x1, y: b.height - 1 },
	];
}

function printNode(nodeName: string) {
	console.log(
		nodeNameMap
			.get(nodeName)
			?.paths.map((p) => p.endpoint.name)
			.join(", ")
	);
}

type Node = {
	paths: Path[];
	name: string;
	x: number;
	y: number;
};

type Path = {
	len: number;
	endpoint: Node;
};
