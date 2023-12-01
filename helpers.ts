declare global {
	interface Array<T> {
		getNonNumbers<T>(): T[];
		hasOnlyNumbers(): boolean;
		sum(): number;
		numSort(): T[];
		mapToNumbers(): number[];
		groupsOf(n: number): [T][];
		take(n: number): T[];
	}
	interface Set<T> {
		intersection<T>(s: Set<T>): Set<T>;
	}
}
Array.prototype.sum = function () {
	if (!this.hasOnlyNumbers()) {
		throw new Error("sum(): Array has non numerical entries");
	}

	return this.reduce((x, y) => x + y, 0);
};
Array.prototype.numSort = function () {
	if (!this.hasOnlyNumbers()) {
		throw new Error("numSort(): Array has non numerical entries");
	}

	const copy = [...this];
	copy.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
	return copy;
};
Array.prototype.getNonNumbers = function () {
	return this.filter((x) => typeof x !== "number" || isNaN(x));
};
Array.prototype.hasOnlyNumbers = function () {
	return this.getNonNumbers().length == 0;
};
Array.prototype.mapToNumbers = function () {
	return this.map((x) => parseInt(x)).filter((x) => !isNaN(x));
};
Array.prototype.groupsOf = function <T>(n: number) {
	const a: [T][] = [];
	let mod = 0;
	let current: T[] = [];
	for (let i = 0; i < this.length; i++) {
		current.push(this[i]);
		if (++mod >= n) {
			a.push(current as [T]);
			mod = 0;
			current = [];
		}
	}
	return a;
};
Array.prototype.take = function (n: number) {
	return this.splice(0, n);
};
Set.prototype.intersection = function <T>(s: Set<T>): Set<T> {
	return new Set([...this].filter((x) => s.has(x)));
};
