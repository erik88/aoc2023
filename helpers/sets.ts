declare global {
	interface Set<T> {
		intersection<T>(s: Set<T>): Set<T>;
		minus<T>(s: Set<T>): Set<T>;
	}
}

Set.prototype.intersection = function <T>(s: Set<T>): Set<T> {
	return new Set([...this].filter((x) => s.has(x)));
};

Set.prototype.minus = function <T>(s: Set<T>): Set<T> {
	return new Set([...this].filter((x) => !s.has(x)));
};
