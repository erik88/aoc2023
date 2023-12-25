import "/helpers/arrays.ts";
import "/helpers/sets.ts";

const TEST = false;
const MODE: "print-graph" | "calculate" = "print-graph";
const input = TEST
	? Deno.readTextFileSync("test.txt")
	: Deno.readTextFileSync("input.txt");

const preNodeMap = createPreNodes(input);
if (MODE === "print-graph") {
	printGraph(preNodeMap);
	Deno.exit(0);
}
const nodeMap = getNodes(preNodeMap);

deleteNode("fql");
deleteNode("vmt");
deleteNode("mfc");

// God damnit, I should have read better. Deleting EDGES, and not nodes!?
// I have a fucking book about this in my shelf :<

// Oh well, I have already commited to graphviz, so...
// it is clear from output that if the proper edges are removed,
// vmt and mfc will belong to "fkf" group ( count=2 )
// fql will belong to "sfm" group ( count=1 )

const c1 = getClusterSize("sfm") + 1;
const c2 = getClusterSize("fkf") + 2;

console.log(c1, c2);
console.log(c1 * c2);

// 548_981 is too LOW!

function deleteNode(name: string) {
	const n = nodeMap.get(name);
	if (!n) throw new Error("Trying to delete non-existing node " + name);
	nodeMap.delete(name);
	n.adjs.forEach((a) => {
		a.adjs = a.adjs.filter((x) => x.name !== name);
	});
}

function getClusterSize(name: string) {
	const startNode = nodeMap.get(name);
	if (!startNode) throw new Error("Could not find start node " + name);
	const explored: Set<string> = new Set();
	const poi: Node[] = [startNode];

	let count = 0;
	while (poi.length > 0) {
		const n = poi.pop() as Node;
		if (!explored.has(n.name)) {
			explored.add(n.name);
			count++;
			n.adjs.forEach((a) => {
				poi.push(a);
			});
		}
	}
	return count;
}

function printGraph(pnm: Map<string, PreNode>) {
	Deno.writeTextFileSync("gv.dot", toGraphviz());
	function toGraphviz(): string {
		let gv = "strict graph {\n";
		[...pnm].forEach(([_, pn]) => {
			pn.adjs.forEach((adsStr) => {
				gv += `${pn.name} -- ${adsStr}\n`;
			});
		});
		return gv + "}";
	}
}

function createPreNodes(input: string): Map<string, PreNode> {
	const map: Map<string, PreNode> = new Map();
	input.split("\n").map((l) => {
		const s = l.split(":");
		const pn: PreNode = {
			name: s[0],
			adjs: s[1].trim().split(" "),
		};
		map.set(pn.name, pn);
		pn.adjs.forEach((a) => {
			if (!map.has(a)) {
				map.set(a, { name: a, adjs: [] });
			}
		});
		return pn;
	});
	return map;
}

function getNodes(pnm: Map<string, PreNode>): Map<string, Node> {
	const nm: Map<string, Node> = new Map();
	pnm.forEach((pn) => {
		const n = getOrCreate(pn.name);

		for (let i = 0; i < pn.adjs.length; i++) {
			const strAdj = pn.adjs[i];
			const a = getOrCreate(strAdj);
			if (!n.adjs.find((ad) => ad.name === strAdj)) {
				n.adjs.push(a);
			}
			if (!a.adjs.find((ad) => ad.name === n.name)) {
				a.adjs.push(n);
			}
		}
	});

	return nm;

	function getOrCreate(name: string): Node {
		let n = nm.get(name);
		if (!n) {
			n = { name: name, adjs: [] };
			nm.set(n.name, n);
		}
		return n;
	}
}

type PreNode = {
	name: string;
	adjs: string[];
};

type Node = {
	name: string;
	adjs: Node[];
};
