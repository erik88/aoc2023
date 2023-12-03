declare global {
	interface Array<T> {
		getNonNumbers<T>(): T[];
		hasOnlyNumbers(): boolean;
		sum(): number;
		numSort(): T[];
		mapToNumbers(): number[];
		groupsOf(n: number): [T][];
		take(n: number): T[];
		sortBy(p: (t: T) => any): T[];
		groupBy<X>(p: (t: T) => X): Map<X, T[]>;
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
Array.prototype.sortBy = function <T>(p: (t: T) => any): T[] {
	const types = new Set(this.map((x) => typeof p(x)));
	if (types.size > 1) {
		throw new Error(
			"sortBy contained more than 1 type: " + [...types].join(", ")
		);
	}

	return [...this].sort((x, y) => {
		const a = p(x);
		const b = p(y);
		return a < b ? -1 : a > b ? 1 : 0;
	});
};
Array.prototype.groupBy = function <T, X>(p: (t: T) => X): Map<X, T[]> {
	return Map.groupBy(this, p);
};

Set.prototype.intersection = function <T>(s: Set<T>): Set<T> {
	return new Set([...this].filter((x) => s.has(x)));
};

export function isInt(x: string): boolean {
	return isNaN(parseInt(x));
}
