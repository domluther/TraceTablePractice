(() => {
	const s = document.createElement("link").relList;
	if (s && s.supports && s.supports("modulepreload")) return;
	for (const f of document.querySelectorAll('link[rel="modulepreload"]')) o(f);
	new MutationObserver((f) => {
		for (const d of f)
			if (d.type === "childList")
				for (const y of d.addedNodes)
					y.tagName === "LINK" && y.rel === "modulepreload" && o(y);
	}).observe(document, { childList: !0, subtree: !0 });
	function c(f) {
		const d = {};
		return (
			f.integrity && (d.integrity = f.integrity),
			f.referrerPolicy && (d.referrerPolicy = f.referrerPolicy),
			f.crossOrigin === "use-credentials"
				? (d.credentials = "include")
				: f.crossOrigin === "anonymous"
					? (d.credentials = "omit")
					: (d.credentials = "same-origin"),
			d
		);
	}
	function o(f) {
		if (f.ep) return;
		f.ep = !0;
		const d = c(f);
		fetch(f.href, d);
	}
})();
function nv(i) {
	return i && i.__esModule && Object.hasOwn(i, "default") ? i.default : i;
}
var ts = { exports: {} },
	tu = {}; /**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ah;
function w0() {
	if (Ah) return tu;
	Ah = 1;
	var i = Symbol.for("react.transitional.element"),
		s = Symbol.for("react.fragment");
	function c(o, f, d) {
		var y = null;
		if (
			(d !== void 0 && (y = "" + d),
			f.key !== void 0 && (y = "" + f.key),
			"key" in f)
		) {
			d = {};
			for (var p in f) p !== "key" && (d[p] = f[p]);
		} else d = f;
		return (
			(f = d.ref),
			{ $$typeof: i, type: o, key: y, ref: f !== void 0 ? f : null, props: d }
		);
	}
	return (tu.Fragment = s), (tu.jsx = c), (tu.jsxs = c), tu;
}
var Oh;
function G0() {
	return Oh || ((Oh = 1), (ts.exports = w0())), ts.exports;
}
var Q = G0(),
	V0 = "Invariant failed";
function ul(i, s) {
	if (!i) throw new Error(V0);
}
const Ka = new WeakMap(),
	zi = new WeakMap(),
	Ci = { current: [] };
let es = !1,
	iu = 0;
const uu = new Set(),
	Mi = new Map();
function uv(i) {
	const s = Array.from(i).sort((c, o) =>
		c instanceof Ja && c.options.deps.includes(o)
			? 1
			: o instanceof Ja && o.options.deps.includes(c)
				? -1
				: 0,
	);
	for (const c of s) {
		if (Ci.current.includes(c)) continue;
		Ci.current.push(c), c.recompute();
		const o = zi.get(c);
		if (o)
			for (const f of o) {
				const d = Ka.get(f);
				d && uv(d);
			}
	}
}
function X0(i) {
	i.listeners.forEach((s) => s({ prevVal: i.prevState, currentVal: i.state }));
}
function Q0(i) {
	i.listeners.forEach((s) => s({ prevVal: i.prevState, currentVal: i.state }));
}
function iv(i) {
	if (
		(iu > 0 && !Mi.has(i) && Mi.set(i, i.prevState),
		uu.add(i),
		!(iu > 0) && !es)
	)
		try {
			for (es = !0; uu.size > 0; ) {
				const s = Array.from(uu);
				uu.clear();
				for (const c of s) {
					const o = Mi.get(c) ?? c.prevState;
					(c.prevState = o), X0(c);
				}
				for (const c of s) {
					const o = Ka.get(c);
					o && (Ci.current.push(c), uv(o));
				}
				for (const c of s) {
					const o = Ka.get(c);
					if (o) for (const f of o) Q0(f);
				}
			}
		} finally {
			(es = !1), (Ci.current = []), Mi.clear();
		}
}
function cu(i) {
	iu++;
	try {
		i();
	} finally {
		if ((iu--, iu === 0)) {
			const s = Array.from(uu)[0];
			s && iv(s);
		}
	}
}
function Z0(i) {
	return typeof i == "function";
}
class gs {
	constructor(s, c) {
		(this.listeners = new Set()),
			(this.subscribe = (o) => {
				var f, d;
				this.listeners.add(o);
				const y =
					(d = (f = this.options) == null ? void 0 : f.onSubscribe) == null
						? void 0
						: d.call(f, o, this);
				return () => {
					this.listeners.delete(o), y?.();
				};
			}),
			(this.prevState = s),
			(this.state = s),
			(this.options = c);
	}
	setState(s) {
		var c, o, f;
		(this.prevState = this.state),
			(c = this.options) != null && c.updateFn
				? (this.state = this.options.updateFn(this.prevState)(s))
				: Z0(s)
					? (this.state = s(this.prevState))
					: (this.state = s),
			(f = (o = this.options) == null ? void 0 : o.onUpdate) == null ||
				f.call(o),
			iv(this);
	}
}
class Ja {
	constructor(s) {
		(this.listeners = new Set()),
			(this._subscriptions = []),
			(this.lastSeenDepValues = []),
			(this.getDepVals = () => {
				const c = [],
					o = [];
				for (const f of this.options.deps) c.push(f.prevState), o.push(f.state);
				return (
					(this.lastSeenDepValues = o),
					{ prevDepVals: c, currDepVals: o, prevVal: this.prevState ?? void 0 }
				);
			}),
			(this.recompute = () => {
				var c, o;
				this.prevState = this.state;
				const {
					prevDepVals: f,
					currDepVals: d,
					prevVal: y,
				} = this.getDepVals();
				(this.state = this.options.fn({
					prevDepVals: f,
					currDepVals: d,
					prevVal: y,
				})),
					(o = (c = this.options).onUpdate) == null || o.call(c);
			}),
			(this.checkIfRecalculationNeededDeeply = () => {
				for (const d of this.options.deps)
					d instanceof Ja && d.checkIfRecalculationNeededDeeply();
				let c = !1;
				const o = this.lastSeenDepValues,
					{ currDepVals: f } = this.getDepVals();
				for (let d = 0; d < f.length; d++)
					if (f[d] !== o[d]) {
						c = !0;
						break;
					}
				c && this.recompute();
			}),
			(this.mount = () => (
				this.registerOnGraph(),
				this.checkIfRecalculationNeededDeeply(),
				() => {
					this.unregisterFromGraph();
					for (const c of this._subscriptions) c();
				}
			)),
			(this.subscribe = (c) => {
				var o, f;
				this.listeners.add(c);
				const d =
					(f = (o = this.options).onSubscribe) == null
						? void 0
						: f.call(o, c, this);
				return () => {
					this.listeners.delete(c), d?.();
				};
			}),
			(this.options = s),
			(this.state = s.fn({
				prevDepVals: void 0,
				prevVal: void 0,
				currDepVals: this.getDepVals().currDepVals,
			}));
	}
	registerOnGraph(s = this.options.deps) {
		for (const c of s)
			if (c instanceof Ja)
				c.registerOnGraph(), this.registerOnGraph(c.options.deps);
			else if (c instanceof gs) {
				let o = Ka.get(c);
				o || ((o = new Set()), Ka.set(c, o)), o.add(this);
				let f = zi.get(this);
				f || ((f = new Set()), zi.set(this, f)), f.add(c);
			}
	}
	unregisterFromGraph(s = this.options.deps) {
		for (const c of s)
			if (c instanceof Ja) this.unregisterFromGraph(c.options.deps);
			else if (c instanceof gs) {
				const o = Ka.get(c);
				o && o.delete(this);
				const f = zi.get(this);
				f && f.delete(c);
			}
	}
}
const Cl = "__TSR_index",
	xh = "popstate",
	zh = "beforeunload";
function cv(i) {
	let s = i.getLocation();
	const c = new Set(),
		o = (y) => {
			(s = i.getLocation()), c.forEach((p) => p({ location: s, action: y }));
		},
		f = (y) => {
			(i.notifyOnIndexChange ?? !0) ? o(y) : (s = i.getLocation());
		},
		d = async ({ task: y, navigateOpts: p, ...m }) => {
			var v, b;
			if (p?.ignoreBlocker ?? !1) {
				y();
				return;
			}
			const _ = ((v = i.getBlockers) == null ? void 0 : v.call(i)) ?? [],
				M = m.type === "PUSH" || m.type === "REPLACE";
			if (typeof document < "u" && _.length && M)
				for (const A of _) {
					const U = su(m.path, m.state);
					if (
						await A.blockerFn({
							currentLocation: s,
							nextLocation: U,
							action: m.type,
						})
					) {
						(b = i.onBlocked) == null || b.call(i);
						return;
					}
				}
			y();
		};
	return {
		get location() {
			return s;
		},
		get length() {
			return i.getLength();
		},
		subscribers: c,
		subscribe: (y) => (
			c.add(y),
			() => {
				c.delete(y);
			}
		),
		push: (y, p, m) => {
			const v = s.state[Cl];
			(p = ps(v + 1, p)),
				d({
					task: () => {
						i.pushState(y, p), o({ type: "PUSH" });
					},
					navigateOpts: m,
					type: "PUSH",
					path: y,
					state: p,
				});
		},
		replace: (y, p, m) => {
			const v = s.state[Cl];
			(p = ps(v, p)),
				d({
					task: () => {
						i.replaceState(y, p), o({ type: "REPLACE" });
					},
					navigateOpts: m,
					type: "REPLACE",
					path: y,
					state: p,
				});
		},
		go: (y, p) => {
			d({
				task: () => {
					i.go(y), f({ type: "GO", index: y });
				},
				navigateOpts: p,
				type: "GO",
			});
		},
		back: (y) => {
			d({
				task: () => {
					i.back(y?.ignoreBlocker ?? !1), f({ type: "BACK" });
				},
				navigateOpts: y,
				type: "BACK",
			});
		},
		forward: (y) => {
			d({
				task: () => {
					i.forward(y?.ignoreBlocker ?? !1), f({ type: "FORWARD" });
				},
				navigateOpts: y,
				type: "FORWARD",
			});
		},
		canGoBack: () => s.state[Cl] !== 0,
		createHref: (y) => i.createHref(y),
		block: (y) => {
			var p;
			if (!i.setBlockers) return () => {};
			const m = ((p = i.getBlockers) == null ? void 0 : p.call(i)) ?? [];
			return (
				i.setBlockers([...m, y]),
				() => {
					var v, b;
					const g = ((v = i.getBlockers) == null ? void 0 : v.call(i)) ?? [];
					(b = i.setBlockers) == null ||
						b.call(
							i,
							g.filter((_) => _ !== y),
						);
				}
			);
		},
		flush: () => {
			var y;
			return (y = i.flush) == null ? void 0 : y.call(i);
		},
		destroy: () => {
			var y;
			return (y = i.destroy) == null ? void 0 : y.call(i);
		},
		notify: o,
	};
}
function ps(i, s) {
	s || (s = {});
	const c = As();
	return { ...s, key: c, __TSR_key: c, [Cl]: i };
}
function K0(i) {
	var s, c;
	const o = typeof document < "u" ? window : void 0,
		f = o.history.pushState,
		d = o.history.replaceState;
	let y = [];
	const p = () => y,
		m = (Z) => (y = Z),
		v = (Z) => Z,
		b = () =>
			su(
				`${o.location.pathname}${o.location.search}${o.location.hash}`,
				o.history.state,
			);
	if (
		!((s = o.history.state) != null && s.__TSR_key) &&
		!((c = o.history.state) != null && c.key)
	) {
		const Z = As();
		o.history.replaceState({ [Cl]: 0, key: Z, __TSR_key: Z }, "");
	}
	let g = b(),
		_,
		M = !1,
		A = !1,
		U = !1,
		H = !1;
	const j = () => g;
	let nt, X;
	const J = () => {
			nt &&
				((ht._ignoreSubscribers = !0),
				(nt.isPush ? o.history.pushState : o.history.replaceState)(
					nt.state,
					"",
					nt.href,
				),
				(ht._ignoreSubscribers = !1),
				(nt = void 0),
				(X = void 0),
				(_ = void 0));
		},
		G = (Z, it, vt) => {
			const wt = v(it);
			X || (_ = g),
				(g = su(it, vt)),
				(nt = { href: wt, state: vt, isPush: nt?.isPush || Z === "push" }),
				X || (X = Promise.resolve().then(() => J()));
		},
		at = (Z) => {
			(g = b()), ht.notify({ type: Z });
		},
		et = async () => {
			if (A) {
				A = !1;
				return;
			}
			const Z = b(),
				it = Z.state[Cl] - g.state[Cl],
				vt = it === 1,
				wt = it === -1,
				zt = (!vt && !wt) || M;
			M = !1;
			const Lt = zt ? "GO" : wt ? "BACK" : "FORWARD",
				C = zt ? { type: "GO", index: it } : { type: wt ? "BACK" : "FORWARD" };
			if (U) U = !1;
			else {
				const Y = p();
				if (typeof document < "u" && Y.length) {
					for (const P of Y)
						if (
							await P.blockerFn({
								currentLocation: g,
								nextLocation: Z,
								action: Lt,
							})
						) {
							(A = !0), o.history.go(1), ht.notify(C);
							return;
						}
				}
			}
			(g = b()), ht.notify(C);
		},
		lt = (Z) => {
			if (H) {
				H = !1;
				return;
			}
			let it = !1;
			const vt = p();
			if (typeof document < "u" && vt.length)
				for (const wt of vt) {
					const zt = wt.enableBeforeUnload ?? !0;
					if (zt === !0) {
						it = !0;
						break;
					}
					if (typeof zt == "function" && zt() === !0) {
						it = !0;
						break;
					}
				}
			if (it) return Z.preventDefault(), (Z.returnValue = "");
		},
		ht = cv({
			getLocation: j,
			getLength: () => o.history.length,
			pushState: (Z, it) => G("push", Z, it),
			replaceState: (Z, it) => G("replace", Z, it),
			back: (Z) => (Z && (U = !0), (H = !0), o.history.back()),
			forward: (Z) => {
				Z && (U = !0), (H = !0), o.history.forward();
			},
			go: (Z) => {
				(M = !0), o.history.go(Z);
			},
			createHref: (Z) => v(Z),
			flush: J,
			destroy: () => {
				(o.history.pushState = f),
					(o.history.replaceState = d),
					o.removeEventListener(zh, lt, { capture: !0 }),
					o.removeEventListener(xh, et);
			},
			onBlocked: () => {
				_ && g !== _ && (g = _);
			},
			getBlockers: p,
			setBlockers: m,
			notifyOnIndexChange: !1,
		});
	return (
		o.addEventListener(zh, lt, { capture: !0 }),
		o.addEventListener(xh, et),
		(o.history.pushState = (...Z) => {
			const it = f.apply(o.history, Z);
			return ht._ignoreSubscribers || at("PUSH"), it;
		}),
		(o.history.replaceState = (...Z) => {
			const it = d.apply(o.history, Z);
			return ht._ignoreSubscribers || at("REPLACE"), it;
		}),
		ht
	);
}
function J0(i = { initialEntries: ["/"] }) {
	const s = i.initialEntries;
	let c = i.initialIndex
		? Math.min(Math.max(i.initialIndex, 0), s.length - 1)
		: s.length - 1;
	const o = s.map((d, y) => ps(y, void 0));
	return cv({
		getLocation: () => su(s[c], o[c]),
		getLength: () => s.length,
		pushState: (d, y) => {
			c < s.length - 1 && (s.splice(c + 1), o.splice(c + 1)),
				o.push(y),
				s.push(d),
				(c = Math.max(s.length - 1, 0));
		},
		replaceState: (d, y) => {
			(o[c] = y), (s[c] = d);
		},
		back: () => {
			c = Math.max(c - 1, 0);
		},
		forward: () => {
			c = Math.min(c + 1, s.length - 1);
		},
		go: (d) => {
			c = Math.min(Math.max(c + d, 0), s.length - 1);
		},
		createHref: (d) => d,
	});
}
function su(i, s) {
	const c = i.indexOf("#"),
		o = i.indexOf("?"),
		f = As();
	return {
		href: i,
		pathname: i.substring(
			0,
			c > 0 ? (o > 0 ? Math.min(c, o) : c) : o > 0 ? o : i.length,
		),
		hash: c > -1 ? i.substring(c) : "",
		search: o > -1 ? i.slice(o, c === -1 ? void 0 : c) : "",
		state: s || { [Cl]: 0, key: f, __TSR_key: f },
	};
}
function As() {
	return (Math.random() + 1).toString(36).substring(7);
}
function Ss(i) {
	return i[i.length - 1];
}
function k0(i) {
	return typeof i == "function";
}
function ta(i, s) {
	return k0(i) ? i(s) : i;
}
function Oe(i, s) {
	if (i === s) return i;
	const c = s,
		o = Uh(i) && Uh(c);
	if (o || (Dh(i) && Dh(c))) {
		const f = o ? i : Object.keys(i).concat(Object.getOwnPropertySymbols(i)),
			d = f.length,
			y = o ? c : Object.keys(c).concat(Object.getOwnPropertySymbols(c)),
			p = y.length,
			m = o ? [] : {};
		let v = 0;
		for (let b = 0; b < p; b++) {
			const g = o ? b : y[b];
			((!o && f.includes(g)) || o) && i[g] === void 0 && c[g] === void 0
				? ((m[g] = void 0), v++)
				: ((m[g] = Oe(i[g], c[g])), m[g] === i[g] && i[g] !== void 0 && v++);
		}
		return d === p && v === d ? i : m;
	}
	return c;
}
function Dh(i) {
	return (
		_s(i) && Object.getOwnPropertyNames(i).length === Object.keys(i).length
	);
}
function _s(i) {
	if (!Ch(i)) return !1;
	const s = i.constructor;
	if (typeof s > "u") return !0;
	const c = s.prototype;
	return !(!Ch(c) || !Object.hasOwn(c, "isPrototypeOf"));
}
function Ch(i) {
	return Object.prototype.toString.call(i) === "[object Object]";
}
function Uh(i) {
	return Array.isArray(i) && i.length === Object.keys(i).length;
}
function Lh(i, s) {
	let c = Object.keys(i);
	return s && (c = c.filter((o) => i[o] !== void 0)), c;
}
function ka(i, s, c) {
	if (i === s) return !0;
	if (typeof i != typeof s) return !1;
	if (_s(i) && _s(s)) {
		const o = c?.ignoreUndefined ?? !0,
			f = Lh(i, o),
			d = Lh(s, o);
		return !c?.partial && f.length !== d.length
			? !1
			: d.every((y) => ka(i[y], s[y], c));
	}
	return Array.isArray(i) && Array.isArray(s)
		? i.length !== s.length
			? !1
			: !i.some((o, f) => !ka(o, s[f], c))
		: !1;
}
function $a(i) {
	let s, c;
	const o = new Promise((f, d) => {
		(s = f), (c = d);
	});
	return (
		(o.status = "pending"),
		(o.resolve = (f) => {
			(o.status = "resolved"), (o.value = f), s(f), i?.(f);
		}),
		(o.reject = (f) => {
			(o.status = "rejected"), c(f);
		}),
		o
	);
}
function $0(i) {
	return typeof i?.message != "string"
		? !1
		: i.message.startsWith("Failed to fetch dynamically imported module") ||
				i.message.startsWith("error loading dynamically imported module") ||
				i.message.startsWith("Importing a module script failed");
}
function Ul(i) {
	return !!(i && typeof i == "object" && typeof i.then == "function");
}
const al = 0,
	la = 1,
	aa = 2,
	Pa = 3;
function nl(i) {
	return Os(i.filter((s) => s !== void 0).join("/"));
}
function Os(i) {
	return i.replace(/\/{2,}/g, "/");
}
function xs(i) {
	return i === "/" ? i : i.replace(/^\/{1,}/, "");
}
function Wa(i) {
	return i === "/" ? i : i.replace(/\/{1,}$/, "");
}
function ls(i) {
	return Wa(xs(i));
}
function Ui(i, s) {
	return i?.endsWith("/") && i !== "/" && i !== `${s}/` ? i.slice(0, -1) : i;
}
function P0(i, s, c) {
	return Ui(i, c) === Ui(s, c);
}
function W0(i) {
	const { type: s, value: c } = i;
	if (s === al) return c;
	const { prefixSegment: o, suffixSegment: f } = i;
	if (s === la) {
		const d = c.substring(1);
		if (o && f) return `${o}{$${d}}${f}`;
		if (o) return `${o}{$${d}}`;
		if (f) return `{$${d}}${f}`;
	}
	if (s === Pa) {
		const d = c.substring(1);
		return o && f
			? `${o}{-$${d}}${f}`
			: o
				? `${o}{-$${d}}`
				: f
					? `{-$${d}}${f}`
					: `{-$${d}}`;
	}
	if (s === aa) {
		if (o && f) return `${o}{$}${f}`;
		if (o) return `${o}{$}`;
		if (f) return `{$}${f}`;
	}
	return c;
}
function F0({
	basepath: i,
	base: s,
	to: c,
	trailingSlash: o = "never",
	caseSensitive: f,
	parseCache: d,
}) {
	var y;
	(s = Li(i, s, f)), (c = Li(i, c, f));
	let p = Fa(s, d).slice();
	const m = Fa(c, d);
	p.length > 1 && ((y = Ss(p)) == null ? void 0 : y.value) === "/" && p.pop();
	for (let g = 0, _ = m.length; g < _; g++) {
		const M = m[g],
			A = M.value;
		A === "/"
			? g
				? g === _ - 1 && p.push(M)
				: (p = [M])
			: A === ".."
				? p.pop()
				: A === "." || p.push(M);
	}
	p.length > 1 &&
		(Ss(p).value === "/"
			? o === "never" && p.pop()
			: o === "always" && p.push({ type: al, value: "/" }));
	const v = p.map(W0);
	return nl([i, ...v]);
}
const Fa = (i, s) => {
		if (!i) return [];
		const c = s?.get(i);
		if (c) return c;
		const o = ny(i);
		return s?.set(i, o), o;
	},
	I0 = /^\$.{1,}$/,
	ty = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/,
	ey = /^(.*?)\{-(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/,
	ly = /^\$$/,
	ay = /^(.*?)\{\$\}(.*)$/;
function ny(i) {
	i = Os(i);
	const s = [];
	if (
		(i.slice(0, 1) === "/" &&
			((i = i.substring(1)), s.push({ type: al, value: "/" })),
		!i)
	)
		return s;
	const c = i.split("/").filter(Boolean);
	return (
		s.push(
			...c.map((o) => {
				const f = o.match(ay);
				if (f) {
					const p = f[1],
						m = f[2];
					return {
						type: aa,
						value: "$",
						prefixSegment: p || void 0,
						suffixSegment: m || void 0,
					};
				}
				const d = o.match(ey);
				if (d) {
					const p = d[1],
						m = d[2],
						v = d[3];
					return {
						type: Pa,
						value: m,
						prefixSegment: p || void 0,
						suffixSegment: v || void 0,
					};
				}
				const y = o.match(ty);
				if (y) {
					const p = y[1],
						m = y[2],
						v = y[3];
					return {
						type: la,
						value: "" + m,
						prefixSegment: p || void 0,
						suffixSegment: v || void 0,
					};
				}
				if (I0.test(o)) {
					const p = o.substring(1);
					return {
						type: la,
						value: "$" + p,
						prefixSegment: void 0,
						suffixSegment: void 0,
					};
				}
				return ly.test(o)
					? {
							type: aa,
							value: "$",
							prefixSegment: void 0,
							suffixSegment: void 0,
						}
					: {
							type: al,
							value: o.includes("%25")
								? o
										.split("%25")
										.map((p) => decodeURI(p))
										.join("%25")
								: decodeURI(o),
						};
			}),
		),
		i.slice(-1) === "/" &&
			((i = i.substring(1)), s.push({ type: al, value: "/" })),
		s
	);
}
function Ai({
	path: i,
	params: s,
	leaveWildcards: c,
	leaveParams: o,
	decodeCharMap: f,
	parseCache: d,
}) {
	const y = Fa(i, d);
	function p(g) {
		const _ = s[g],
			M = typeof _ == "string";
		return g === "*" || g === "_splat"
			? M
				? encodeURI(_)
				: _
			: M
				? uy(_, f)
				: _;
	}
	let m = !1;
	const v = {},
		b = nl(
			y.map((g) => {
				if (g.type === al) return g.value;
				if (g.type === aa) {
					v._splat = s._splat;
					const _ = g.prefixSegment || "",
						M = g.suffixSegment || "";
					if (!("_splat" in s))
						return (
							(m = !0), c ? `${_}${g.value}${M}` : _ || M ? `${_}${M}` : void 0
						);
					const A = p("_splat");
					return c ? `${_}${g.value}${A ?? ""}${M}` : `${_}${A}${M}`;
				}
				if (g.type === la) {
					const _ = g.value.substring(1);
					!m && !(_ in s) && (m = !0), (v[_] = s[_]);
					const M = g.prefixSegment || "",
						A = g.suffixSegment || "";
					if (o) {
						const U = p(g.value);
						return `${M}${g.value}${U ?? ""}${A}`;
					}
					return `${M}${p(_) ?? "undefined"}${A}`;
				}
				if (g.type === Pa) {
					const _ = g.value.substring(1),
						M = g.prefixSegment || "",
						A = g.suffixSegment || "";
					if (!(_ in s) || s[_] == null)
						return c ? `${M}${_}${A}` : M || A ? `${M}${A}` : void 0;
					if (((v[_] = s[_]), o)) {
						const U = p(g.value);
						return `${M}${g.value}${U ?? ""}${A}`;
					}
					return c ? `${M}${_}${p(_) ?? ""}${A}` : `${M}${p(_) ?? ""}${A}`;
				}
				return g.value;
			}),
		);
	return { usedParams: v, interpolatedPath: b, isMissingParams: m };
}
function uy(i, s) {
	let c = encodeURIComponent(i);
	if (s) for (const [o, f] of s) c = c.replaceAll(o, f);
	return c;
}
function bs(i, s, c, o) {
	const f = iy(i, s, c, o);
	if (!(c.to && !f)) return f ?? {};
}
function Li(i, s, c = !1) {
	const o = c ? i : i.toLowerCase(),
		f = c ? s : s.toLowerCase();
	switch (!0) {
		case o === "/":
			return s;
		case f === o:
			return "";
		case s.length < i.length:
			return s;
		case f[o.length] !== "/":
			return s;
		case f.startsWith(o):
			return s.slice(i.length);
		default:
			return s;
	}
}
function iy(i, s, { to: c, fuzzy: o, caseSensitive: f }, d) {
	if (i !== "/" && !s.startsWith(i)) return;
	(s = Li(i, s, f)), (c = Li(i, `${c ?? "$"}`, f));
	const y = Fa(s.startsWith("/") ? s : `/${s}`, d),
		p = Fa(c.startsWith("/") ? c : `/${c}`, d),
		m = {};
	return cy(y, p, m, o, f) ? m : void 0;
}
function cy(i, s, c, o, f) {
	var d, y, p;
	let m = 0,
		v = 0;
	for (; m < i.length || v < s.length; ) {
		const b = i[m],
			g = s[v];
		if (g) {
			if (g.type === aa) {
				const _ = i.slice(m);
				let M;
				if (g.prefixSegment || g.suffixSegment) {
					if (!b) return !1;
					const A = g.prefixSegment || "",
						U = g.suffixSegment || "",
						H = b.value;
					if (
						("prefixSegment" in g && !H.startsWith(A)) ||
						("suffixSegment" in g &&
							!((d = i[i.length - 1]) != null && d.value.endsWith(U)))
					)
						return !1;
					let j = decodeURI(nl(_.map((nt) => nt.value)));
					A && j.startsWith(A) && (j = j.slice(A.length)),
						U && j.endsWith(U) && (j = j.slice(0, j.length - U.length)),
						(M = j);
				} else M = decodeURI(nl(_.map((A) => A.value)));
				return (c["*"] = M), (c._splat = M), !0;
			}
			if (g.type === al) {
				if (g.value === "/" && !b?.value) {
					v++;
					continue;
				}
				if (b) {
					if (f) {
						if (g.value !== b.value) return !1;
					} else if (g.value.toLowerCase() !== b.value.toLowerCase()) return !1;
					m++, v++;
					continue;
				} else return !1;
			}
			if (g.type === la) {
				if (!b || b.value === "/") return !1;
				let _ = "",
					M = !1;
				if (g.prefixSegment || g.suffixSegment) {
					const A = g.prefixSegment || "",
						U = g.suffixSegment || "",
						H = b.value;
					if ((A && !H.startsWith(A)) || (U && !H.endsWith(U))) return !1;
					let j = H;
					A && j.startsWith(A) && (j = j.slice(A.length)),
						U && j.endsWith(U) && (j = j.slice(0, j.length - U.length)),
						(_ = decodeURIComponent(j)),
						(M = !0);
				} else (_ = decodeURIComponent(b.value)), (M = !0);
				M && ((c[g.value.substring(1)] = _), m++), v++;
				continue;
			}
			if (g.type === Pa) {
				if (!b) {
					v++;
					continue;
				}
				if (b.value === "/") {
					v++;
					continue;
				}
				let _ = "",
					M = !1;
				if (g.prefixSegment || g.suffixSegment) {
					const A = g.prefixSegment || "",
						U = g.suffixSegment || "",
						H = b.value;
					if ((!A || H.startsWith(A)) && (!U || H.endsWith(U))) {
						let j = H;
						A && j.startsWith(A) && (j = j.slice(A.length)),
							U && j.endsWith(U) && (j = j.slice(0, j.length - U.length)),
							(_ = decodeURIComponent(j)),
							(M = !0);
					}
				} else {
					let A = !0;
					for (let U = v + 1; U < s.length; U++) {
						const H = s[U];
						if (H?.type === al && H.value === b.value) {
							A = !1;
							break;
						}
						if (H?.type === la || H?.type === aa) {
							i.length < s.length && (A = !1);
							break;
						}
					}
					A && ((_ = decodeURIComponent(b.value)), (M = !0));
				}
				M && ((c[g.value.substring(1)] = _), m++), v++;
				continue;
			}
		}
		if (m < i.length && v >= s.length)
			return (
				(c["**"] = nl(i.slice(m).map((_) => _.value))),
				!!o && ((y = s[s.length - 1]) == null ? void 0 : y.value) !== "/"
			);
		if (v < s.length && m >= i.length) {
			for (let _ = v; _ < s.length; _++)
				if (((p = s[_]) == null ? void 0 : p.type) !== Pa) return !1;
			break;
		}
		break;
	}
	return !0;
}
function Ge(i) {
	return !!i?.isNotFound;
}
function oy() {
	try {
		if (typeof window < "u" && typeof window.sessionStorage == "object")
			return window.sessionStorage;
	} catch {}
}
const Ni = "tsr-scroll-restoration-v1_3",
	sy = (i, s) => {
		let c;
		return (...o) => {
			c ||
				(c = setTimeout(() => {
					i(...o), (c = null);
				}, s));
		};
	};
function ry() {
	const i = oy();
	if (!i) return;
	const s = i.getItem(Ni);
	let c = s ? JSON.parse(s) : {};
	return {
		state: c,
		set: (o) => ((c = ta(o, c) || c), i.setItem(Ni, JSON.stringify(c))),
	};
}
const as = ry(),
	Rs = (i) => i.state.__TSR_key || i.href;
function fy(i) {
	const s = [];
	let c;
	for (; (c = i.parentNode); )
		s.push(
			`${i.tagName}:nth-child(${Array.prototype.indexOf.call(c.children, i) + 1})`,
		),
			(i = c);
	return `${s.reverse().join(" > ")}`.toLowerCase();
}
let Bi = !1;
function ov({
	storageKey: i,
	key: s,
	behavior: c,
	shouldScrollRestoration: o,
	scrollToTopSelectors: f,
	location: d,
}) {
	var y, p;
	let m;
	try {
		m = JSON.parse(sessionStorage.getItem(i) || "{}");
	} catch (g) {
		console.error(g);
		return;
	}
	const v = s || ((y = window.history.state) == null ? void 0 : y.key),
		b = m[v];
	Bi = !0;
	t: {
		if (o && b && Object.keys(b).length > 0) {
			for (const M in b) {
				const A = b[M];
				if (M === "window")
					window.scrollTo({ top: A.scrollY, left: A.scrollX, behavior: c });
				else if (M) {
					const U = document.querySelector(M);
					U && ((U.scrollLeft = A.scrollX), (U.scrollTop = A.scrollY));
				}
			}
			break t;
		}
		const g = (d ?? window.location).hash.split("#", 2)[1];
		if (g) {
			const M =
				((p = window.history.state) == null
					? void 0
					: p.__hashScrollIntoViewOptions) ?? !0;
			if (M) {
				const A = document.getElementById(g);
				A && A.scrollIntoView(M);
			}
			break t;
		}
		const _ = { top: 0, left: 0, behavior: c };
		if ((window.scrollTo(_), f))
			for (const M of f) {
				if (M === "window") continue;
				const A = typeof M == "function" ? M() : document.querySelector(M);
				A && A.scrollTo(_);
			}
	}
	Bi = !1;
}
function dy(i, s) {
	if (
		as === void 0 ||
		((i.options.scrollRestoration ?? !1) && (i.isScrollRestoring = !0),
		typeof document > "u" || i.isScrollRestorationSetup)
	)
		return;
	(i.isScrollRestorationSetup = !0), (Bi = !1);
	const o = i.options.getScrollRestorationKey || Rs;
	window.history.scrollRestoration = "manual";
	const f = (d) => {
		if (Bi || !i.isScrollRestoring) return;
		let y = "";
		if (d.target === document || d.target === window) y = "window";
		else {
			const m = d.target.getAttribute("data-scroll-restoration-id");
			m ? (y = `[data-scroll-restoration-id="${m}"]`) : (y = fy(d.target));
		}
		const p = o(i.state.location);
		as.set((m) => {
			const v = m[p] || (m[p] = {}),
				b = v[y] || (v[y] = {});
			if (y === "window")
				(b.scrollX = window.scrollX || 0), (b.scrollY = window.scrollY || 0);
			else if (y) {
				const g = document.querySelector(y);
				g && ((b.scrollX = g.scrollLeft || 0), (b.scrollY = g.scrollTop || 0));
			}
			return m;
		});
	};
	typeof document < "u" && document.addEventListener("scroll", sy(f, 100), !0),
		i.subscribe("onRendered", (d) => {
			const y = o(d.toLocation);
			if (!i.resetNextScroll) {
				i.resetNextScroll = !0;
				return;
			}
			ov({
				storageKey: Ni,
				key: y,
				behavior: i.options.scrollRestorationBehavior,
				shouldScrollRestoration: i.isScrollRestoring,
				scrollToTopSelectors: i.options.scrollToTopSelectors,
				location: i.history.location,
			}),
				i.isScrollRestoring && as.set((p) => (p[y] || (p[y] = {}), p));
		});
}
function hy(i) {
	if (typeof document < "u" && document.querySelector) {
		const s = i.state.location.state.__hashScrollIntoViewOptions ?? !0;
		if (s && i.state.location.hash !== "") {
			const c = document.getElementById(i.state.location.hash);
			c && c.scrollIntoView(s);
		}
	}
}
function vy(i, s = String) {
	const c = new URLSearchParams();
	for (const o in i) {
		const f = i[o];
		f !== void 0 && c.set(o, s(f));
	}
	return c.toString();
}
function ns(i) {
	return i
		? i === "false"
			? !1
			: i === "true"
				? !0
				: +i * 0 === 0 && +i + "" === i
					? +i
					: i
		: "";
}
function my(i) {
	const s = new URLSearchParams(i),
		c = {};
	for (const [o, f] of s.entries()) {
		const d = c[o];
		d == null
			? (c[o] = ns(f))
			: Array.isArray(d)
				? d.push(ns(f))
				: (c[o] = [d, ns(f)]);
	}
	return c;
}
const yy = py(JSON.parse),
	gy = Sy(JSON.stringify, JSON.parse);
function py(i) {
	return (s) => {
		s[0] === "?" && (s = s.substring(1));
		const c = my(s);
		for (const o in c) {
			const f = c[o];
			if (typeof f == "string")
				try {
					c[o] = i(f);
				} catch {}
		}
		return c;
	};
}
function Sy(i, s) {
	const c = typeof s == "function";
	function o(f) {
		if (typeof f == "object" && f !== null)
			try {
				return i(f);
			} catch {}
		else if (c && typeof f == "string")
			try {
				return s(f), i(f);
			} catch {}
		return f;
	}
	return (f) => {
		const d = vy(f, o);
		return d ? `?${d}` : "";
	};
}
const xe = "__root__";
function _y(i) {
	if (
		((i.statusCode = i.statusCode || i.code || 307),
		!i.reloadDocument && typeof i.href == "string")
	)
		try {
			new URL(i.href), (i.reloadDocument = !0);
		} catch {}
	const s = new Headers(i.headers || {});
	i.href && s.get("Location") === null && s.set("Location", i.href);
	const c = new Response(null, { status: i.statusCode, headers: s });
	if (((c.options = i), i.throw)) throw c;
	return c;
}
function we(i) {
	return i instanceof Response && !!i.options;
}
function by(i) {
	const s = new Map();
	let c, o;
	const f = (d) => {
		d.next &&
			(d.prev
				? ((d.prev.next = d.next),
					(d.next.prev = d.prev),
					(d.next = void 0),
					o && ((o.next = d), (d.prev = o)))
				: ((d.next.prev = void 0),
					(c = d.next),
					(d.next = void 0),
					o && ((d.prev = o), (o.next = d))),
			(o = d));
	};
	return {
		get(d) {
			const y = s.get(d);
			if (y) return f(y), y.value;
		},
		set(d, y) {
			if (s.size >= i && c) {
				const m = c;
				s.delete(m.key),
					m.next && ((c = m.next), (m.next.prev = void 0)),
					m === o && (o = void 0);
			}
			const p = s.get(d);
			if (p) (p.value = y), f(p);
			else {
				const m = { key: d, value: y, prev: o };
				o && (o.next = m), (o = m), c || (c = m), s.set(d, m);
			}
		},
	};
}
const Di = (i) => {
		var s;
		if (!i.rendered)
			return (i.rendered = !0), (s = i.onReady) == null ? void 0 : s.call(i);
	},
	qi = (i, s) =>
		!!(i.preload && !i.router.state.matches.some((c) => c.id === s)),
	sv = (i, s) => {
		var c;
		const o = i.router.routesById[s.routeId ?? ""] ?? i.router.routeTree;
		!o.options.notFoundComponent &&
			(c = i.router.options) != null &&
			c.defaultNotFoundComponent &&
			(o.options.notFoundComponent = i.router.options.defaultNotFoundComponent),
			ul(o.options.notFoundComponent);
		const f = i.matches.find((d) => d.routeId === o.id);
		ul(f, "Could not find match for route: " + o.id),
			i.updateMatch(f.id, (d) => ({
				...d,
				status: "notFound",
				error: s,
				isFetching: !1,
			})),
			s.routerCode === "BEFORE_LOAD" &&
				o.parentRoute &&
				((s.routeId = o.parentRoute.id), sv(i, s));
	},
	Dl = (i, s, c) => {
		var o, f, d;
		if (!(!we(c) && !Ge(c))) {
			if (we(c) && c.redirectHandled && !c.options.reloadDocument) throw c;
			if (s) {
				(o = s._nonReactive.beforeLoadPromise) == null || o.resolve(),
					(f = s._nonReactive.loaderPromise) == null || f.resolve(),
					(s._nonReactive.beforeLoadPromise = void 0),
					(s._nonReactive.loaderPromise = void 0);
				const y = we(c) ? "redirected" : "notFound";
				i.updateMatch(s.id, (p) => ({
					...p,
					status: y,
					isFetching: !1,
					error: c,
				})),
					Ge(c) && !c.routeId && (c.routeId = s.routeId),
					(d = s._nonReactive.loadPromise) == null || d.resolve();
			}
			throw we(c)
				? ((i.rendered = !0),
					(c.options._fromLocation = i.location),
					(c.redirectHandled = !0),
					(c = i.router.resolveRedirect(c)),
					c)
				: (sv(i, c), c);
		}
	},
	rv = (i, s) => {
		const c = i.router.getMatch(s);
		return !!(
			(!i.router.isServer && c._nonReactive.dehydrated) ||
			(i.router.isServer && c.ssr === !1)
		);
	},
	eu = (i, s, c, o) => {
		var f, d;
		const { id: y, routeId: p } = i.matches[s],
			m = i.router.looseRoutesById[p];
		if (c instanceof Promise) throw c;
		(c.routerCode = o),
			i.firstBadMatchIndex ?? (i.firstBadMatchIndex = s),
			Dl(i, i.router.getMatch(y), c);
		try {
			(d = (f = m.options).onError) == null || d.call(f, c);
		} catch (v) {
			(c = v), Dl(i, i.router.getMatch(y), c);
		}
		i.updateMatch(y, (v) => {
			var b, g;
			return (
				(b = v._nonReactive.beforeLoadPromise) == null || b.resolve(),
				(v._nonReactive.beforeLoadPromise = void 0),
				(g = v._nonReactive.loadPromise) == null || g.resolve(),
				{
					...v,
					error: c,
					status: "error",
					isFetching: !1,
					updatedAt: Date.now(),
					abortController: new AbortController(),
				}
			);
		});
	},
	Ry = (i, s, c, o) => {
		var f;
		const d = i.router.getMatch(s),
			y = (f = i.matches[c - 1]) == null ? void 0 : f.id,
			p = y ? i.router.getMatch(y) : void 0;
		if (i.router.isShell()) {
			d.ssr = s === xe;
			return;
		}
		if (p?.ssr === !1) {
			d.ssr = !1;
			return;
		}
		const m = (A) => (A === !0 && p?.ssr === "data-only" ? "data-only" : A),
			v = i.router.options.defaultSsr ?? !0;
		if (o.options.ssr === void 0) {
			d.ssr = m(v);
			return;
		}
		if (typeof o.options.ssr != "function") {
			d.ssr = m(o.options.ssr);
			return;
		}
		const { search: b, params: g } = d,
			_ = {
				search: Oi(b, d.searchError),
				params: Oi(g, d.paramsError),
				location: i.location,
				matches: i.matches.map((A) => ({
					index: A.index,
					pathname: A.pathname,
					fullPath: A.fullPath,
					staticData: A.staticData,
					id: A.id,
					routeId: A.routeId,
					search: Oi(A.search, A.searchError),
					params: Oi(A.params, A.paramsError),
					ssr: A.ssr,
				})),
			},
			M = o.options.ssr(_);
		if (Ul(M))
			return M.then((A) => {
				d.ssr = m(A ?? v);
			});
		d.ssr = m(M ?? v);
	},
	fv = (i, s, c, o) => {
		var f;
		if (o._nonReactive.pendingTimeout !== void 0) return;
		const d = c.options.pendingMs ?? i.router.options.defaultPendingMs;
		if (
			i.onReady &&
			!i.router.isServer &&
			!qi(i, s) &&
			(c.options.loader || c.options.beforeLoad || vv(c)) &&
			typeof d == "number" &&
			d !== 1 / 0 &&
			(c.options.pendingComponent ??
				((f = i.router.options) == null ? void 0 : f.defaultPendingComponent))
		) {
			const p = setTimeout(() => {
				Di(i);
			}, d);
			o._nonReactive.pendingTimeout = p;
		}
	},
	Ey = (i, s, c) => {
		const o = i.router.getMatch(s);
		if (!o._nonReactive.beforeLoadPromise && !o._nonReactive.loaderPromise)
			return;
		fv(i, s, c, o);
		const f = () => {
			const d = i.router.getMatch(s);
			d.preload &&
				(d.status === "redirected" || d.status === "notFound") &&
				Dl(i, d, d.error);
		};
		return o._nonReactive.beforeLoadPromise
			? o._nonReactive.beforeLoadPromise.then(f)
			: f();
	},
	Ty = (i, s, c, o) => {
		var f;
		const d = i.router.getMatch(s),
			y = d._nonReactive.loadPromise;
		d._nonReactive.loadPromise = $a(() => {
			y?.resolve();
		});
		const { paramsError: p, searchError: m } = d;
		p && eu(i, c, p, "PARSE_PARAMS"),
			m && eu(i, c, m, "VALIDATE_SEARCH"),
			fv(i, s, o, d);
		const v = new AbortController(),
			b = (f = i.matches[c - 1]) == null ? void 0 : f.id,
			g = b ? i.router.getMatch(b) : void 0,
			M = {
				...(g?.context ?? i.router.options.context ?? void 0),
				...d.__routeContext,
			};
		let A = !1;
		const U = () => {
				A ||
					((A = !0),
					i.updateMatch(s, (lt) => ({
						...lt,
						isFetching: "beforeLoad",
						fetchCount: lt.fetchCount + 1,
						abortController: v,
						context: M,
					})));
			},
			H = () => {
				var lt;
				(lt = d._nonReactive.beforeLoadPromise) == null || lt.resolve(),
					(d._nonReactive.beforeLoadPromise = void 0),
					i.updateMatch(s, (ht) => ({ ...ht, isFetching: !1 }));
			};
		if (!o.options.beforeLoad) {
			cu(() => {
				U(), H();
			});
			return;
		}
		d._nonReactive.beforeLoadPromise = $a();
		const { search: j, params: nt, cause: X } = d,
			J = qi(i, s),
			G = {
				search: j,
				abortController: v,
				params: nt,
				preload: J,
				context: M,
				location: i.location,
				navigate: (lt) =>
					i.router.navigate({ ...lt, _fromLocation: i.location }),
				buildLocation: i.router.buildLocation,
				cause: J ? "preload" : X,
				matches: i.matches,
			},
			at = (lt) => {
				if (lt === void 0) {
					cu(() => {
						U(), H();
					});
					return;
				}
				(we(lt) || Ge(lt)) && (U(), eu(i, c, lt, "BEFORE_LOAD")),
					cu(() => {
						U(),
							i.updateMatch(s, (ht) => ({
								...ht,
								__beforeLoadContext: lt,
								context: { ...ht.context, ...lt },
							})),
							H();
					});
			};
		let et;
		try {
			if (((et = o.options.beforeLoad(G)), Ul(et)))
				return (
					U(),
					et
						.catch((lt) => {
							eu(i, c, lt, "BEFORE_LOAD");
						})
						.then(at)
				);
		} catch (lt) {
			U(), eu(i, c, lt, "BEFORE_LOAD");
		}
		at(et);
	},
	My = (i, s) => {
		const { id: c, routeId: o } = i.matches[s],
			f = i.router.looseRoutesById[o],
			d = () => {
				if (i.router.isServer) {
					const m = Ry(i, c, s, f);
					if (Ul(m)) return m.then(y);
				}
				return y();
			},
			y = () => {
				if (rv(i, c)) return;
				const m = Ey(i, c, f);
				return Ul(m) ? m.then(p) : p();
			},
			p = () => Ty(i, c, s, f);
		return d();
	},
	ou = (i, s, c) => {
		var o, f, d, y, p, m;
		const v = i.router.getMatch(s);
		if (!v || (!c.options.head && !c.options.scripts && !c.options.headers))
			return;
		const b = {
			matches: i.matches,
			match: v,
			params: v.params,
			loaderData: v.loaderData,
		};
		return Promise.all([
			(f = (o = c.options).head) == null ? void 0 : f.call(o, b),
			(y = (d = c.options).scripts) == null ? void 0 : y.call(d, b),
			(m = (p = c.options).headers) == null ? void 0 : m.call(p, b),
		]).then(([g, _, M]) => {
			const A = g?.meta,
				U = g?.links,
				H = g?.scripts,
				j = g?.styles;
			return {
				meta: A,
				links: U,
				headScripts: H,
				headers: M,
				scripts: _,
				styles: j,
			};
		});
	},
	dv = (i, s, c, o) => {
		const f = i.matchPromises[c - 1],
			{
				params: d,
				loaderDeps: y,
				abortController: p,
				context: m,
				cause: v,
			} = i.router.getMatch(s),
			b = qi(i, s);
		return {
			params: d,
			deps: y,
			preload: !!b,
			parentMatchPromise: f,
			abortController: p,
			context: m,
			location: i.location,
			navigate: (g) => i.router.navigate({ ...g, _fromLocation: i.location }),
			cause: b ? "preload" : v,
			route: o,
		};
	},
	Nh = async (i, s, c, o) => {
		var f, d, y, p;
		try {
			const m = i.router.getMatch(s);
			try {
				(!i.router.isServer || m.ssr === !0) && hv(o);
				const v =
						(d = (f = o.options).loader) == null
							? void 0
							: d.call(f, dv(i, s, c, o)),
					b = o.options.loader && Ul(v);
				if (
					(!!(
						b ||
						o._lazyPromise ||
						o._componentsPromise ||
						o.options.head ||
						o.options.scripts ||
						o.options.headers ||
						m._nonReactive.minPendingPromise
					) && i.updateMatch(s, (U) => ({ ...U, isFetching: "loader" })),
					o.options.loader)
				) {
					const U = b ? await v : v;
					Dl(i, i.router.getMatch(s), U),
						U !== void 0 && i.updateMatch(s, (H) => ({ ...H, loaderData: U }));
				}
				o._lazyPromise && (await o._lazyPromise);
				const _ = ou(i, s, o),
					M = _ ? await _ : void 0,
					A = m._nonReactive.minPendingPromise;
				A && (await A),
					o._componentsPromise && (await o._componentsPromise),
					i.updateMatch(s, (U) => ({
						...U,
						error: void 0,
						status: "success",
						isFetching: !1,
						updatedAt: Date.now(),
						...M,
					}));
			} catch (v) {
				let b = v;
				const g = m._nonReactive.minPendingPromise;
				g && (await g), Dl(i, i.router.getMatch(s), v);
				try {
					(p = (y = o.options).onError) == null || p.call(y, v);
				} catch (A) {
					(b = A), Dl(i, i.router.getMatch(s), A);
				}
				const _ = ou(i, s, o),
					M = _ ? await _ : void 0;
				i.updateMatch(s, (A) => ({
					...A,
					error: b,
					status: "error",
					isFetching: !1,
					...M,
				}));
			}
		} catch (m) {
			const v = i.router.getMatch(s);
			if (v) {
				const b = ou(i, s, o);
				if (b) {
					const g = await b;
					i.updateMatch(s, (_) => ({ ..._, ...g }));
				}
				v._nonReactive.loaderPromise = void 0;
			}
			Dl(i, v, m);
		}
	},
	Ay = async (i, s) => {
		var c, o;
		const { id: f, routeId: d } = i.matches[s];
		let y = !1,
			p = !1;
		const m = i.router.looseRoutesById[d];
		if (rv(i, f)) {
			if (i.router.isServer) {
				const g = ou(i, f, m);
				if (g) {
					const _ = await g;
					i.updateMatch(f, (M) => ({ ...M, ..._ }));
				}
				return i.router.getMatch(f);
			}
		} else {
			const g = i.router.getMatch(f);
			if (g._nonReactive.loaderPromise) {
				if (g.status === "success" && !i.sync && !g.preload) return g;
				await g._nonReactive.loaderPromise;
				const _ = i.router.getMatch(f);
				_.error && Dl(i, _, _.error);
			} else {
				const _ = Date.now() - g.updatedAt,
					M = qi(i, f),
					A = M
						? (m.options.preloadStaleTime ??
							i.router.options.defaultPreloadStaleTime ??
							3e4)
						: (m.options.staleTime ?? i.router.options.defaultStaleTime ?? 0),
					U = m.options.shouldReload,
					H = typeof U == "function" ? U(dv(i, f, s, m)) : U,
					j = !!M && !i.router.state.matches.some((G) => G.id === f),
					nt = i.router.getMatch(f);
				(nt._nonReactive.loaderPromise = $a()),
					j !== nt.preload && i.updateMatch(f, (G) => ({ ...G, preload: j }));
				const { status: X, invalid: J } = nt;
				if (
					((y = X === "success" && (J || (H ?? _ > A))),
					!(M && m.options.preload === !1))
				)
					if (y && !i.sync)
						(p = !0),
							(async () => {
								var G, at;
								try {
									await Nh(i, f, s, m);
									const et = i.router.getMatch(f);
									(G = et._nonReactive.loaderPromise) == null || G.resolve(),
										(at = et._nonReactive.loadPromise) == null || at.resolve(),
										(et._nonReactive.loaderPromise = void 0);
								} catch (et) {
									we(et) && (await i.router.navigate(et.options));
								}
							})();
					else if (X !== "success" || (y && i.sync)) await Nh(i, f, s, m);
					else {
						const G = ou(i, f, m);
						if (G) {
							const at = await G;
							i.updateMatch(f, (et) => ({ ...et, ...at }));
						}
					}
			}
		}
		const v = i.router.getMatch(f);
		p ||
			((c = v._nonReactive.loaderPromise) == null || c.resolve(),
			(o = v._nonReactive.loadPromise) == null || o.resolve()),
			clearTimeout(v._nonReactive.pendingTimeout),
			(v._nonReactive.pendingTimeout = void 0),
			p || (v._nonReactive.loaderPromise = void 0),
			(v._nonReactive.dehydrated = void 0);
		const b = p ? v.isFetching : !1;
		return b !== v.isFetching || v.invalid !== !1
			? (i.updateMatch(f, (g) => ({ ...g, isFetching: b, invalid: !1 })),
				i.router.getMatch(f))
			: v;
	};
async function Bh(i) {
	const s = Object.assign(i, { matchPromises: [] });
	!s.router.isServer &&
		s.router.state.matches.some((c) => c._forcePending) &&
		Di(s);
	try {
		for (let f = 0; f < s.matches.length; f++) {
			const d = My(s, f);
			Ul(d) && (await d);
		}
		const c = s.firstBadMatchIndex ?? s.matches.length;
		for (let f = 0; f < c; f++) s.matchPromises.push(Ay(s, f));
		await Promise.all(s.matchPromises);
		const o = Di(s);
		Ul(o) && (await o);
	} catch (c) {
		if (Ge(c) && !s.preload) {
			const o = Di(s);
			throw (Ul(o) && (await o), c);
		}
		if (we(c)) throw c;
	}
	return s.matches;
}
async function hv(i) {
	if (
		(!i._lazyLoaded &&
			i._lazyPromise === void 0 &&
			(i.lazyFn
				? (i._lazyPromise = i.lazyFn().then((s) => {
						const { id: c, ...o } = s.options;
						Object.assign(i.options, o),
							(i._lazyLoaded = !0),
							(i._lazyPromise = void 0);
					}))
				: (i._lazyLoaded = !0)),
		!i._componentsLoaded && i._componentsPromise === void 0)
	) {
		const s = () => {
			var c;
			const o = [];
			for (const f of mv) {
				const d = (c = i.options[f]) == null ? void 0 : c.preload;
				d && o.push(d());
			}
			if (o.length)
				return Promise.all(o).then(() => {
					(i._componentsLoaded = !0), (i._componentsPromise = void 0);
				});
			(i._componentsLoaded = !0), (i._componentsPromise = void 0);
		};
		i._componentsPromise = i._lazyPromise ? i._lazyPromise.then(s) : s();
	}
	return i._componentsPromise;
}
function Oi(i, s) {
	return s ? { status: "error", error: s } : { status: "success", value: i };
}
function vv(i) {
	var s;
	for (const c of mv) if ((s = i.options[c]) != null && s.preload) return !0;
	return !1;
}
const mv = [
	"component",
	"errorComponent",
	"pendingComponent",
	"notFoundComponent",
];
function ea(i) {
	const s = i.resolvedLocation,
		c = i.location,
		o = s?.pathname !== c.pathname,
		f = s?.href !== c.href,
		d = s?.hash !== c.hash;
	return {
		fromLocation: s,
		toLocation: c,
		pathChanged: o,
		hrefChanged: f,
		hashChanged: d,
	};
}
class Oy {
	constructor(s) {
		(this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`),
			(this.resetNextScroll = !0),
			(this.shouldViewTransition = void 0),
			(this.isViewTransitionTypesSupported = void 0),
			(this.subscribers = new Set()),
			(this.isScrollRestoring = !1),
			(this.isScrollRestorationSetup = !1),
			(this.startTransition = (c) => c()),
			(this.update = (c) => {
				var o;
				c.notFoundRoute &&
					console.warn(
						"The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info.",
					);
				const f = this.options;
				(this.options = { ...this.options, ...c }),
					(this.isServer = this.options.isServer ?? typeof document > "u"),
					(this.pathParamsDecodeCharMap = this.options
						.pathParamsAllowedCharacters
						? new Map(
								this.options.pathParamsAllowedCharacters.map((d) => [
									encodeURIComponent(d),
									d,
								]),
							)
						: void 0),
					(!this.basepath || (c.basepath && c.basepath !== f.basepath)) &&
						(c.basepath === void 0 || c.basepath === "" || c.basepath === "/"
							? (this.basepath = "/")
							: (this.basepath = `/${ls(c.basepath)}`)),
					(!this.history ||
						(this.options.history && this.options.history !== this.history)) &&
						((this.history =
							this.options.history ??
							(this.isServer
								? J0({ initialEntries: [this.basepath || "/"] })
								: K0())),
						this.updateLatestLocation()),
					this.options.routeTree !== this.routeTree &&
						((this.routeTree = this.options.routeTree), this.buildRouteTree()),
					this.__store ||
						((this.__store = new gs(zy(this.latestLocation), {
							onUpdate: () => {
								this.__store.state = {
									...this.state,
									cachedMatches: this.state.cachedMatches.filter(
										(d) => !["redirected"].includes(d.status),
									),
								};
							},
						})),
						dy(this)),
					typeof window < "u" &&
						"CSS" in window &&
						typeof ((o = window.CSS) == null ? void 0 : o.supports) ==
							"function" &&
						(this.isViewTransitionTypesSupported = window.CSS.supports(
							"selector(:active-view-transition-type(a)",
						));
			}),
			(this.updateLatestLocation = () => {
				this.latestLocation = this.parseLocation(
					this.history.location,
					this.latestLocation,
				);
			}),
			(this.buildRouteTree = () => {
				const {
					routesById: c,
					routesByPath: o,
					flatRoutes: f,
				} = Hy({
					routeTree: this.routeTree,
					initRoute: (y, p) => {
						y.init({ originalIndex: p });
					},
				});
				(this.routesById = c), (this.routesByPath = o), (this.flatRoutes = f);
				const d = this.options.notFoundRoute;
				d &&
					(d.init({ originalIndex: 99999999999 }), (this.routesById[d.id] = d));
			}),
			(this.subscribe = (c, o) => {
				const f = { eventType: c, fn: o };
				return (
					this.subscribers.add(f),
					() => {
						this.subscribers.delete(f);
					}
				);
			}),
			(this.emit = (c) => {
				this.subscribers.forEach((o) => {
					o.eventType === c.type && o.fn(c);
				});
			}),
			(this.parseLocation = (c, o) => {
				const f = ({ pathname: m, search: v, hash: b, state: g }) => {
						const _ = this.options.parseSearch(v),
							M = this.options.stringifySearch(_);
						return {
							pathname: m,
							searchStr: M,
							search: Oe(o?.search, _),
							hash: b.split("#").reverse()[0] ?? "",
							href: `${m}${M}${b}`,
							state: Oe(o?.state, g),
						};
					},
					d = f(c),
					{ __tempLocation: y, __tempKey: p } = d.state;
				if (y && (!p || p === this.tempLocationKey)) {
					const m = f(y);
					return (
						(m.state.key = d.state.key),
						(m.state.__TSR_key = d.state.__TSR_key),
						delete m.state.__tempLocation,
						{ ...m, maskedLocation: d }
					);
				}
				return d;
			}),
			(this.resolvePathWithBase = (c, o) =>
				F0({
					basepath: this.basepath,
					base: c,
					to: Os(o),
					trailingSlash: this.options.trailingSlash,
					caseSensitive: this.options.caseSensitive,
					parseCache: this.parsePathnameCache,
				})),
			(this.matchRoutes = (c, o, f) =>
				typeof c == "string"
					? this.matchRoutesInternal({ pathname: c, search: o }, f)
					: this.matchRoutesInternal(c, o)),
			(this.parsePathnameCache = by(1e3)),
			(this.getMatchedRoutes = (c, o) =>
				qy({
					pathname: c,
					routePathname: o,
					basepath: this.basepath,
					caseSensitive: this.options.caseSensitive,
					routesByPath: this.routesByPath,
					routesById: this.routesById,
					flatRoutes: this.flatRoutes,
					parseCache: this.parsePathnameCache,
				})),
			(this.cancelMatch = (c) => {
				const o = this.getMatch(c);
				o &&
					(o.abortController.abort(),
					clearTimeout(o._nonReactive.pendingTimeout),
					(o._nonReactive.pendingTimeout = void 0));
			}),
			(this.cancelMatches = () => {
				var c;
				(c = this.state.pendingMatches) == null ||
					c.forEach((o) => {
						this.cancelMatch(o.id);
					});
			}),
			(this.buildLocation = (c) => {
				const o = (d = {}) => {
						var y, p;
						const m = d._fromLocation || this.latestLocation,
							v = this.matchRoutes(m, { _buildLocation: !0 }),
							b = Ss(v);
						let g = this.resolvePathWithBase(b.fullPath, ".");
						const _ = d.to
								? this.resolvePathWithBase(g, `${d.to}`)
								: this.resolvePathWithBase(g, "."),
							M = !!d.to && !qh(d.to.toString(), g) && !qh(_, g);
						d.unsafeRelative === "path"
							? (g = m.pathname)
							: M && d.from && (g = d.from),
							(g = this.resolvePathWithBase(g, "."));
						const A = b.search,
							U = { ...b.params },
							H = d.to
								? this.resolvePathWithBase(g, `${d.to}`)
								: this.resolvePathWithBase(g, "."),
							j =
								d.params === !1 || d.params === null
									? {}
									: (d.params ?? !0) === !0
										? U
										: Object.assign(U, ta(d.params, U)),
							nt = Ai({
								path: H,
								params: j,
								parseCache: this.parsePathnameCache,
							}).interpolatedPath,
							X = this.matchRoutes(nt, void 0, { _buildLocation: !0 }).map(
								(Z) => this.looseRoutesById[Z.routeId],
							);
						if (Object.keys(j).length > 0)
							for (const Z of X) {
								const it =
									((y = Z.options.params) == null ? void 0 : y.stringify) ??
									Z.options.stringifyParams;
								it && Object.assign(j, it(j));
							}
						const J = Ai({
							path: H,
							params: j,
							leaveWildcards: !1,
							leaveParams: c.leaveParams,
							decodeCharMap: this.pathParamsDecodeCharMap,
							parseCache: this.parsePathnameCache,
						}).interpolatedPath;
						let G = A;
						if (
							c._includeValidateSearch &&
							(p = this.options.search) != null &&
							p.strict
						) {
							const Z = {};
							X.forEach((it) => {
								if (it.options.validateSearch)
									try {
										Object.assign(
											Z,
											Es(it.options.validateSearch, { ...Z, ...G }),
										);
									} catch {}
							}),
								(G = Z);
						}
						(G = jy({
							search: G,
							dest: d,
							destRoutes: X,
							_includeValidateSearch: c._includeValidateSearch,
						})),
							(G = Oe(A, G));
						const at = this.options.stringifySearch(G),
							et =
								d.hash === !0 ? m.hash : d.hash ? ta(d.hash, m.hash) : void 0,
							lt = et ? `#${et}` : "";
						let ht =
							d.state === !0 ? m.state : d.state ? ta(d.state, m.state) : {};
						return (
							(ht = Oe(m.state, ht)),
							{
								pathname: J,
								search: G,
								searchStr: at,
								state: ht,
								hash: et ?? "",
								href: `${J}${at}${lt}`,
								unmaskOnReload: d.unmaskOnReload,
							}
						);
					},
					f = (d = {}, y) => {
						var p;
						const m = o(d);
						let v = y ? o(y) : void 0;
						if (!v) {
							let b = {};
							const g =
								(p = this.options.routeMasks) == null
									? void 0
									: p.find((_) => {
											const M = bs(
												this.basepath,
												m.pathname,
												{ to: _.from, caseSensitive: !1, fuzzy: !1 },
												this.parsePathnameCache,
											);
											return M ? ((b = M), !0) : !1;
										});
							if (g) {
								const { from: _, ...M } = g;
								(y = { from: c.from, ...M, params: b }), (v = o(y));
							}
						}
						if (v) {
							const b = o(y);
							m.maskedLocation = b;
						}
						return m;
					};
				return c.mask ? f(c, { from: c.from, ...c.mask }) : f(c);
			}),
			(this.commitLocation = ({
				viewTransition: c,
				ignoreBlocker: o,
				...f
			}) => {
				const d = () => {
						const m = [
							"key",
							"__TSR_key",
							"__TSR_index",
							"__hashScrollIntoViewOptions",
						];
						m.forEach((b) => {
							f.state[b] = this.latestLocation.state[b];
						});
						const v = ka(f.state, this.latestLocation.state);
						return (
							m.forEach((b) => {
								delete f.state[b];
							}),
							v
						);
					},
					y = this.latestLocation.href === f.href,
					p = this.commitLocationPromise;
				if (
					((this.commitLocationPromise = $a(() => {
						p?.resolve();
					})),
					y && d())
				)
					this.load();
				else {
					let { maskedLocation: m, hashScrollIntoView: v, ...b } = f;
					m &&
						((b = {
							...m,
							state: {
								...m.state,
								__tempKey: void 0,
								__tempLocation: {
									...b,
									search: b.searchStr,
									state: {
										...b.state,
										__tempKey: void 0,
										__tempLocation: void 0,
										__TSR_key: void 0,
										key: void 0,
									},
								},
							},
						}),
						(b.unmaskOnReload ?? this.options.unmaskOnReload ?? !1) &&
							(b.state.__tempKey = this.tempLocationKey)),
						(b.state.__hashScrollIntoViewOptions =
							v ?? this.options.defaultHashScrollIntoView ?? !0),
						(this.shouldViewTransition = c),
						this.history[f.replace ? "replace" : "push"](b.href, b.state, {
							ignoreBlocker: o,
						});
				}
				return (
					(this.resetNextScroll = f.resetScroll ?? !0),
					this.history.subscribers.size || this.load(),
					this.commitLocationPromise
				);
			}),
			(this.buildAndCommitLocation = ({
				replace: c,
				resetScroll: o,
				hashScrollIntoView: f,
				viewTransition: d,
				ignoreBlocker: y,
				href: p,
				...m
			} = {}) => {
				if (p) {
					const b = this.history.location.state.__TSR_index,
						g = su(p, { __TSR_index: c ? b : b + 1 });
					(m.to = g.pathname),
						(m.search = this.options.parseSearch(g.search)),
						(m.hash = g.hash.slice(1));
				}
				const v = this.buildLocation({ ...m, _includeValidateSearch: !0 });
				return this.commitLocation({
					...v,
					viewTransition: d,
					replace: c,
					resetScroll: o,
					hashScrollIntoView: f,
					ignoreBlocker: y,
				});
			}),
			(this.navigate = ({ to: c, reloadDocument: o, href: f, ...d }) => {
				if (!o && f)
					try {
						new URL(`${f}`), (o = !0);
					} catch {}
				if (o) {
					if (!f) {
						const y = this.buildLocation({ to: c, ...d });
						f = this.history.createHref(y.href);
					}
					return (
						d.replace ? window.location.replace(f) : (window.location.href = f),
						Promise.resolve()
					);
				}
				return this.buildAndCommitLocation({
					...d,
					href: f,
					to: c,
					_isNavigate: !0,
				});
			}),
			(this.beforeLoad = () => {
				if (
					(this.cancelMatches(), this.updateLatestLocation(), this.isServer)
				) {
					const o = this.buildLocation({
							to: this.latestLocation.pathname,
							search: !0,
							params: !0,
							hash: !0,
							state: !0,
							_includeValidateSearch: !0,
						}),
						f = (d) => {
							try {
								return encodeURI(decodeURI(d));
							} catch {
								return d;
							}
						};
					if (ls(f(this.latestLocation.href)) !== ls(f(o.href)))
						throw _y({ href: o.href });
				}
				const c = this.matchRoutes(this.latestLocation);
				this.__store.setState((o) => ({
					...o,
					status: "pending",
					statusCode: 200,
					isLoading: !0,
					location: this.latestLocation,
					pendingMatches: c,
					cachedMatches: o.cachedMatches.filter(
						(f) => !c.some((d) => d.id === f.id),
					),
				}));
			}),
			(this.load = async (c) => {
				let o, f, d;
				for (
					d = new Promise((y) => {
						this.startTransition(async () => {
							var p;
							try {
								this.beforeLoad();
								const m = this.latestLocation,
									v = this.state.resolvedLocation;
								this.state.redirect ||
									this.emit({
										type: "onBeforeNavigate",
										...ea({ resolvedLocation: v, location: m }),
									}),
									this.emit({
										type: "onBeforeLoad",
										...ea({ resolvedLocation: v, location: m }),
									}),
									await Bh({
										router: this,
										sync: c?.sync,
										matches: this.state.pendingMatches,
										location: m,
										updateMatch: this.updateMatch,
										onReady: async () => {
											this.startViewTransition(async () => {
												let b, g, _;
												cu(() => {
													this.__store.setState((M) => {
														const A = M.matches,
															U = M.pendingMatches || M.matches;
														return (
															(b = A.filter(
																(H) => !U.some((j) => j.id === H.id),
															)),
															(g = U.filter(
																(H) => !A.some((j) => j.id === H.id),
															)),
															(_ = A.filter((H) =>
																U.some((j) => j.id === H.id),
															)),
															{
																...M,
																isLoading: !1,
																loadedAt: Date.now(),
																matches: U,
																pendingMatches: void 0,
																cachedMatches: [
																	...M.cachedMatches,
																	...b.filter((H) => H.status !== "error"),
																],
															}
														);
													}),
														this.clearExpiredCache();
												}),
													[
														[b, "onLeave"],
														[g, "onEnter"],
														[_, "onStay"],
													].forEach(([M, A]) => {
														M.forEach((U) => {
															var H, j;
															(j = (H =
																this.looseRoutesById[U.routeId].options)[A]) ==
																null || j.call(H, U);
														});
													});
											});
										},
									});
							} catch (m) {
								we(m)
									? ((o = m),
										this.isServer ||
											this.navigate({
												...o.options,
												replace: !0,
												ignoreBlocker: !0,
											}))
									: Ge(m) && (f = m),
									this.__store.setState((v) => ({
										...v,
										statusCode: o
											? o.status
											: f
												? 404
												: v.matches.some((b) => b.status === "error")
													? 500
													: 200,
										redirect: o,
									}));
							}
							this.latestLoadPromise === d &&
								((p = this.commitLocationPromise) == null || p.resolve(),
								(this.latestLoadPromise = void 0),
								(this.commitLocationPromise = void 0)),
								y();
						});
					}),
						this.latestLoadPromise = d,
						await d;
					this.latestLoadPromise && d !== this.latestLoadPromise;
				)
					await this.latestLoadPromise;
				this.hasNotFoundMatch() &&
					this.__store.setState((y) => ({ ...y, statusCode: 404 }));
			}),
			(this.startViewTransition = (c) => {
				const o =
					this.shouldViewTransition ?? this.options.defaultViewTransition;
				if (
					(delete this.shouldViewTransition,
					o &&
						typeof document < "u" &&
						"startViewTransition" in document &&
						typeof document.startViewTransition == "function")
				) {
					let f;
					if (typeof o == "object" && this.isViewTransitionTypesSupported) {
						const d = this.latestLocation,
							y = this.state.resolvedLocation,
							p =
								typeof o.types == "function"
									? o.types(ea({ resolvedLocation: y, location: d }))
									: o.types;
						f = { update: c, types: p };
					} else f = c;
					document.startViewTransition(f);
				} else c();
			}),
			(this.updateMatch = (c, o) => {
				var f;
				const d =
					(f = this.state.pendingMatches) != null && f.some((y) => y.id === c)
						? "pendingMatches"
						: this.state.matches.some((y) => y.id === c)
							? "matches"
							: this.state.cachedMatches.some((y) => y.id === c)
								? "cachedMatches"
								: "";
				d &&
					this.__store.setState((y) => {
						var p;
						return {
							...y,
							[d]:
								(p = y[d]) == null
									? void 0
									: p.map((m) => (m.id === c ? o(m) : m)),
						};
					});
			}),
			(this.getMatch = (c) => {
				var o;
				const f = (d) => d.id === c;
				return (
					this.state.cachedMatches.find(f) ??
					((o = this.state.pendingMatches) == null ? void 0 : o.find(f)) ??
					this.state.matches.find(f)
				);
			}),
			(this.invalidate = (c) => {
				const o = (f) => {
					var d;
					return (((d = c?.filter) == null ? void 0 : d.call(c, f)) ?? !0)
						? {
								...f,
								invalid: !0,
								...(c?.forcePending || f.status === "error"
									? { status: "pending", error: void 0 }
									: void 0),
							}
						: f;
				};
				return (
					this.__store.setState((f) => {
						var d;
						return {
							...f,
							matches: f.matches.map(o),
							cachedMatches: f.cachedMatches.map(o),
							pendingMatches:
								(d = f.pendingMatches) == null ? void 0 : d.map(o),
						};
					}),
					(this.shouldViewTransition = !1),
					this.load({ sync: c?.sync })
				);
			}),
			(this.resolveRedirect = (c) => (
				c.options.href ||
					((c.options.href = this.buildLocation(c.options).href),
					c.headers.set("Location", c.options.href)),
				c.headers.get("Location") || c.headers.set("Location", c.options.href),
				c
			)),
			(this.clearCache = (c) => {
				const o = c?.filter;
				o !== void 0
					? this.__store.setState((f) => ({
							...f,
							cachedMatches: f.cachedMatches.filter((d) => !o(d)),
						}))
					: this.__store.setState((f) => ({ ...f, cachedMatches: [] }));
			}),
			(this.clearExpiredCache = () => {
				const c = (o) => {
					const f = this.looseRoutesById[o.routeId];
					if (!f.options.loader) return !0;
					const d =
						(o.preload
							? (f.options.preloadGcTime ?? this.options.defaultPreloadGcTime)
							: (f.options.gcTime ?? this.options.defaultGcTime)) ?? 300 * 1e3;
					return o.status === "error" ? !0 : Date.now() - o.updatedAt >= d;
				};
				this.clearCache({ filter: c });
			}),
			(this.loadRouteChunk = hv),
			(this.preloadRoute = async (c) => {
				const o = this.buildLocation(c);
				let f = this.matchRoutes(o, { throwOnError: !0, preload: !0, dest: c });
				const d = new Set(
						[...this.state.matches, ...(this.state.pendingMatches ?? [])].map(
							(p) => p.id,
						),
					),
					y = new Set([...d, ...this.state.cachedMatches.map((p) => p.id)]);
				cu(() => {
					f.forEach((p) => {
						y.has(p.id) ||
							this.__store.setState((m) => ({
								...m,
								cachedMatches: [...m.cachedMatches, p],
							}));
					});
				});
				try {
					return (
						(f = await Bh({
							router: this,
							matches: f,
							location: o,
							preload: !0,
							updateMatch: (p, m) => {
								d.has(p)
									? (f = f.map((v) => (v.id === p ? m(v) : v)))
									: this.updateMatch(p, m);
							},
						})),
						f
					);
				} catch (p) {
					if (we(p))
						return p.options.reloadDocument
							? void 0
							: await this.preloadRoute({ ...p.options, _fromLocation: o });
					Ge(p) || console.error(p);
					return;
				}
			}),
			(this.matchRoute = (c, o) => {
				const f = {
						...c,
						to: c.to ? this.resolvePathWithBase(c.from || "", c.to) : void 0,
						params: c.params || {},
						leaveParams: !0,
					},
					d = this.buildLocation(f);
				if (o?.pending && this.state.status !== "pending") return !1;
				const p = (o?.pending === void 0 ? !this.state.isLoading : o.pending)
						? this.latestLocation
						: this.state.resolvedLocation || this.state.location,
					m = bs(
						this.basepath,
						p.pathname,
						{ ...o, to: d.pathname },
						this.parsePathnameCache,
					);
				return !m || (c.params && !ka(m, c.params, { partial: !0 }))
					? !1
					: m && (o?.includeSearch ?? !0)
						? ka(p.search, d.search, { partial: !0 })
							? m
							: !1
						: m;
			}),
			(this.hasNotFoundMatch = () =>
				this.__store.state.matches.some(
					(c) => c.status === "notFound" || c.globalNotFound,
				)),
			this.update({
				defaultPreloadDelay: 50,
				defaultPendingMs: 1e3,
				defaultPendingMinMs: 500,
				context: void 0,
				...s,
				caseSensitive: s.caseSensitive ?? !1,
				notFoundMode: s.notFoundMode ?? "fuzzy",
				stringifySearch: s.stringifySearch ?? gy,
				parseSearch: s.parseSearch ?? yy,
			}),
			typeof document < "u" && (self.__TSR_ROUTER__ = this);
	}
	isShell() {
		return !!this.options.isShell;
	}
	isPrerendering() {
		return !!this.options.isPrerendering;
	}
	get state() {
		return this.__store.state;
	}
	get looseRoutesById() {
		return this.routesById;
	}
	matchRoutesInternal(s, c) {
		var o;
		const {
			foundRoute: f,
			matchedRoutes: d,
			routeParams: y,
		} = this.getMatchedRoutes(
			s.pathname,
			(o = c?.dest) == null ? void 0 : o.to,
		);
		let p = !1;
		(f ? f.path !== "/" && y["**"] : Wa(s.pathname)) &&
			(this.options.notFoundRoute
				? d.push(this.options.notFoundRoute)
				: (p = !0));
		const m = (() => {
				if (p) {
					if (this.options.notFoundMode !== "root")
						for (let _ = d.length - 1; _ >= 0; _--) {
							const M = d[_];
							if (M.children) return M.id;
						}
					return xe;
				}
			})(),
			v = d.map((_) => {
				var M;
				let A;
				const U =
					((M = _.options.params) == null ? void 0 : M.parse) ??
					_.options.parseParams;
				if (U)
					try {
						const H = U(y);
						Object.assign(y, H);
					} catch (H) {
						if (((A = new xy(H.message, { cause: H })), c?.throwOnError))
							throw A;
						return A;
					}
			}),
			b = [],
			g = (_) =>
				_?.id
					? (_.context ?? this.options.context ?? void 0)
					: (this.options.context ?? void 0);
		return (
			d.forEach((_, M) => {
				var A, U;
				const H = b[M - 1],
					[j, nt, X] = (() => {
						const zt = H?.search ?? s.search,
							Lt = H?._strictSearch ?? void 0;
						try {
							const C = Es(_.options.validateSearch, { ...zt }) ?? void 0;
							return [{ ...zt, ...C }, { ...Lt, ...C }, void 0];
						} catch (C) {
							let Y = C;
							if (
								(C instanceof Hi || (Y = new Hi(C.message, { cause: C })),
								c?.throwOnError)
							)
								throw Y;
							return [zt, {}, Y];
						}
					})(),
					J =
						((U = (A = _.options).loaderDeps) == null
							? void 0
							: U.call(A, { search: j })) ?? "",
					G = J ? JSON.stringify(J) : "",
					{ usedParams: at, interpolatedPath: et } = Ai({
						path: _.fullPath,
						params: y,
						decodeCharMap: this.pathParamsDecodeCharMap,
					}),
					lt =
						Ai({
							path: _.id,
							params: y,
							leaveWildcards: !0,
							decodeCharMap: this.pathParamsDecodeCharMap,
							parseCache: this.parsePathnameCache,
						}).interpolatedPath + G,
					ht = this.getMatch(lt),
					Z = this.state.matches.find((zt) => zt.routeId === _.id),
					it = Z ? "stay" : "enter";
				let vt;
				if (ht)
					vt = {
						...ht,
						cause: it,
						params: Z ? Oe(Z.params, y) : y,
						_strictParams: at,
						search: Oe(Z ? Z.search : ht.search, j),
						_strictSearch: nt,
					};
				else {
					const zt =
						_.options.loader || _.options.beforeLoad || _.lazyFn || vv(_)
							? "pending"
							: "success";
					vt = {
						id: lt,
						index: M,
						routeId: _.id,
						params: Z ? Oe(Z.params, y) : y,
						_strictParams: at,
						pathname: nl([this.basepath, et]),
						updatedAt: Date.now(),
						search: Z ? Oe(Z.search, j) : j,
						_strictSearch: nt,
						searchError: void 0,
						status: zt,
						isFetching: !1,
						error: void 0,
						paramsError: v[M],
						__routeContext: void 0,
						_nonReactive: { loadPromise: $a() },
						__beforeLoadContext: void 0,
						context: {},
						abortController: new AbortController(),
						fetchCount: 0,
						cause: it,
						loaderDeps: Z ? Oe(Z.loaderDeps, J) : J,
						invalid: !1,
						preload: !1,
						links: void 0,
						scripts: void 0,
						headScripts: void 0,
						meta: void 0,
						staticData: _.options.staticData || {},
						fullPath: _.fullPath,
					};
				}
				c?.preload || (vt.globalNotFound = m === _.id), (vt.searchError = X);
				const wt = g(H);
				(vt.context = {
					...wt,
					...vt.__routeContext,
					...vt.__beforeLoadContext,
				}),
					b.push(vt);
			}),
			b.forEach((_, M) => {
				const A = this.looseRoutesById[_.routeId];
				if (!this.getMatch(_.id) && c?._buildLocation !== !0) {
					const H = b[M - 1],
						j = g(H);
					if (A.options.context) {
						const nt = {
							deps: _.loaderDeps,
							params: _.params,
							context: j ?? {},
							location: s,
							navigate: (X) => this.navigate({ ...X, _fromLocation: s }),
							buildLocation: this.buildLocation,
							cause: _.cause,
							abortController: _.abortController,
							preload: !!_.preload,
							matches: b,
						};
						_.__routeContext = A.options.context(nt) ?? void 0;
					}
					_.context = { ...j, ..._.__routeContext, ..._.__beforeLoadContext };
				}
			}),
			b
		);
	}
}
class Hi extends Error {}
class xy extends Error {}
const Hh = (i) => (i.endsWith("/") && i.length > 1 ? i.slice(0, -1) : i);
function qh(i, s) {
	return Hh(i) === Hh(s);
}
function zy(i) {
	return {
		loadedAt: 0,
		isLoading: !1,
		isTransitioning: !1,
		status: "idle",
		resolvedLocation: void 0,
		location: i,
		matches: [],
		pendingMatches: [],
		cachedMatches: [],
		statusCode: 200,
	};
}
function Es(i, s) {
	if (i == null) return {};
	if ("~standard" in i) {
		const c = i["~standard"].validate(s);
		if (c instanceof Promise) throw new Hi("Async validation not supported");
		if (c.issues)
			throw new Hi(JSON.stringify(c.issues, void 0, 2), { cause: c });
		return c.value;
	}
	return "parse" in i ? i.parse(s) : typeof i == "function" ? i(s) : {};
}
const Dy = 0.5,
	Cy = 0.4,
	Uy = 0.25,
	Ly = 0.05,
	Ny = 0.02,
	By = 0.01,
	jh = 2e-4,
	Yh = 1e-4;
function wh(i, s) {
	return i.prefixSegment && i.suffixSegment
		? s + Ly + jh * i.prefixSegment.length + Yh * i.suffixSegment.length
		: i.prefixSegment
			? s + Ny + jh * i.prefixSegment.length
			: i.suffixSegment
				? s + By + Yh * i.suffixSegment.length
				: s;
}
function Hy({ routeTree: i, initRoute: s }) {
	const c = {},
		o = {},
		f = (m) => {
			m.forEach((v, b) => {
				s?.(v, b);
				const g = c[v.id];
				if (
					(ul(!g, `Duplicate routes found with id: ${String(v.id)}`),
					(c[v.id] = v),
					!v.isRoot && v.path)
				) {
					const M = Wa(v.fullPath);
					(!o[M] || v.fullPath.endsWith("/")) && (o[M] = v);
				}
				const _ = v.children;
				_?.length && f(_);
			});
		};
	f([i]);
	const d = [];
	Object.values(c).forEach((m, v) => {
		var b;
		if (m.isRoot || !m.path) return;
		const g = xs(m.fullPath);
		let _ = Fa(g),
			M = 0;
		for (
			;
			_.length > M + 1 && ((b = _[M]) == null ? void 0 : b.value) === "/";
		)
			M++;
		M > 0 && (_ = _.slice(M));
		let A = 0,
			U = !1;
		const H = _.map((j, nt) => {
			if (j.value === "/") return 0.75;
			let X;
			if (
				(j.type === la
					? (X = Dy)
					: j.type === Pa
						? ((X = Cy), A++)
						: j.type === aa && (X = Uy),
				X)
			) {
				for (let J = nt + 1; J < _.length; J++) {
					const G = _[J];
					if (G.type === al && G.value !== "/") return (U = !0), wh(j, X + 0.2);
				}
				return wh(j, X);
			}
			return 1;
		});
		d.push({
			child: m,
			trimmed: g,
			parsed: _,
			index: v,
			scores: H,
			optionalParamCount: A,
			hasStaticAfter: U,
		});
	});
	const p = d
		.sort((m, v) => {
			const b = Math.min(m.scores.length, v.scores.length);
			for (let g = 0; g < b; g++)
				if (m.scores[g] !== v.scores[g]) return v.scores[g] - m.scores[g];
			if (m.scores.length !== v.scores.length) {
				if (m.optionalParamCount !== v.optionalParamCount) {
					if (m.hasStaticAfter === v.hasStaticAfter)
						return m.optionalParamCount - v.optionalParamCount;
					if (m.hasStaticAfter && !v.hasStaticAfter) return -1;
					if (!m.hasStaticAfter && v.hasStaticAfter) return 1;
				}
				return v.scores.length - m.scores.length;
			}
			for (let g = 0; g < b; g++)
				if (m.parsed[g].value !== v.parsed[g].value)
					return m.parsed[g].value > v.parsed[g].value ? 1 : -1;
			return m.index - v.index;
		})
		.map((m, v) => ((m.child.rank = v), m.child));
	return { routesById: c, routesByPath: o, flatRoutes: p };
}
function qy({
	pathname: i,
	routePathname: s,
	basepath: c,
	caseSensitive: o,
	routesByPath: f,
	routesById: d,
	flatRoutes: y,
	parseCache: p,
}) {
	let m = {};
	const v = Wa(i),
		b = (A) => {
			var U;
			return bs(
				c,
				v,
				{
					to: A.fullPath,
					caseSensitive:
						((U = A.options) == null ? void 0 : U.caseSensitive) ?? o,
					fuzzy: !0,
				},
				p,
			);
		};
	let g = s !== void 0 ? f[s] : void 0;
	if (g) m = b(g);
	else {
		let A;
		for (const U of y) {
			const H = b(U);
			if (H)
				if (U.path !== "/" && H["**"])
					A || (A = { foundRoute: U, routeParams: H });
				else {
					(g = U), (m = H);
					break;
				}
		}
		!g && A && ((g = A.foundRoute), (m = A.routeParams));
	}
	let _ = g || d[xe];
	const M = [_];
	for (; _.parentRoute; ) (_ = _.parentRoute), M.push(_);
	return M.reverse(), { matchedRoutes: M, routeParams: m, foundRoute: g };
}
function jy({ search: i, dest: s, destRoutes: c, _includeValidateSearch: o }) {
	const f =
			c.reduce((p, m) => {
				var v;
				const b = [];
				if ("search" in m.options)
					(v = m.options.search) != null &&
						v.middlewares &&
						b.push(...m.options.search.middlewares);
				else if (m.options.preSearchFilters || m.options.postSearchFilters) {
					const g = ({ search: _, next: M }) => {
						let A = _;
						"preSearchFilters" in m.options &&
							m.options.preSearchFilters &&
							(A = m.options.preSearchFilters.reduce((H, j) => j(H), _));
						const U = M(A);
						return "postSearchFilters" in m.options &&
							m.options.postSearchFilters
							? m.options.postSearchFilters.reduce((H, j) => j(H), U)
							: U;
					};
					b.push(g);
				}
				if (o && m.options.validateSearch) {
					const g = ({ search: _, next: M }) => {
						const A = M(_);
						try {
							return { ...A, ...(Es(m.options.validateSearch, A) ?? void 0) };
						} catch {
							return A;
						}
					};
					b.push(g);
				}
				return p.concat(b);
			}, []) ?? [],
		d = ({ search: p }) =>
			s.search ? (s.search === !0 ? p : ta(s.search, p)) : {};
	f.push(d);
	const y = (p, m) => {
		if (p >= f.length) return m;
		const v = f[p];
		return v({ search: m, next: (g) => y(p + 1, g) });
	};
	return y(0, i);
}
const Yy = "Error preloading route! ☝️";
class yv {
	constructor(s) {
		if (
			((this.init = (c) => {
				var o, f;
				this.originalIndex = c.originalIndex;
				const d = this.options,
					y = !d?.path && !d?.id;
				(this.parentRoute =
					(f = (o = this.options).getParentRoute) == null ? void 0 : f.call(o)),
					y ? (this._path = xe) : this.parentRoute || ul(!1);
				let p = y ? xe : d?.path;
				p && p !== "/" && (p = xs(p));
				const m = d?.id || p;
				let v = y
					? xe
					: nl([this.parentRoute.id === xe ? "" : this.parentRoute.id, m]);
				p === xe && (p = "/"), v !== xe && (v = nl(["/", v]));
				const b = v === xe ? "/" : nl([this.parentRoute.fullPath, p]);
				(this._path = p), (this._id = v), (this._fullPath = b), (this._to = b);
			}),
			(this.clone = (c) => {
				(this._path = c._path),
					(this._id = c._id),
					(this._fullPath = c._fullPath),
					(this._to = c._to),
					(this.options.getParentRoute = c.options.getParentRoute),
					(this.children = c.children);
			}),
			(this.addChildren = (c) => this._addFileChildren(c)),
			(this._addFileChildren = (c) => (
				Array.isArray(c) && (this.children = c),
				typeof c == "object" &&
					c !== null &&
					(this.children = Object.values(c)),
				this
			)),
			(this._addFileTypes = () => this),
			(this.updateLoader = (c) => (Object.assign(this.options, c), this)),
			(this.update = (c) => (Object.assign(this.options, c), this)),
			(this.lazy = (c) => ((this.lazyFn = c), this)),
			(this.options = s || {}),
			(this.isRoot = !s?.getParentRoute),
			s?.id && s?.path)
		)
			throw new Error("Route cannot have both an 'id' and a 'path' option.");
	}
	get to() {
		return this._to;
	}
	get id() {
		return this._id;
	}
	get path() {
		return this._path;
	}
	get fullPath() {
		return this._fullPath;
	}
}
class wy extends yv {
	constructor(s) {
		super(s);
	}
}
var us = { exports: {} },
	ct = {}; /**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gh;
function Gy() {
	if (Gh) return ct;
	Gh = 1;
	var i = Symbol.for("react.transitional.element"),
		s = Symbol.for("react.portal"),
		c = Symbol.for("react.fragment"),
		o = Symbol.for("react.strict_mode"),
		f = Symbol.for("react.profiler"),
		d = Symbol.for("react.consumer"),
		y = Symbol.for("react.context"),
		p = Symbol.for("react.forward_ref"),
		m = Symbol.for("react.suspense"),
		v = Symbol.for("react.memo"),
		b = Symbol.for("react.lazy"),
		g = Symbol.iterator;
	function _(R) {
		return R === null || typeof R != "object"
			? null
			: ((R = (g && R[g]) || R["@@iterator"]),
				typeof R == "function" ? R : null);
	}
	var M = {
			isMounted: () => !1,
			enqueueForceUpdate: () => {},
			enqueueReplaceState: () => {},
			enqueueSetState: () => {},
		},
		A = Object.assign,
		U = {};
	function H(R, q, V) {
		(this.props = R),
			(this.context = q),
			(this.refs = U),
			(this.updater = V || M);
	}
	(H.prototype.isReactComponent = {}),
		(H.prototype.setState = function (R, q) {
			if (typeof R != "object" && typeof R != "function" && R != null)
				throw Error(
					"takes an object of state variables to update or a function which returns an object of state variables.",
				);
			this.updater.enqueueSetState(this, R, q, "setState");
		}),
		(H.prototype.forceUpdate = function (R) {
			this.updater.enqueueForceUpdate(this, R, "forceUpdate");
		});
	function j() {}
	j.prototype = H.prototype;
	function nt(R, q, V) {
		(this.props = R),
			(this.context = q),
			(this.refs = U),
			(this.updater = V || M);
	}
	var X = (nt.prototype = new j());
	(X.constructor = nt), A(X, H.prototype), (X.isPureReactComponent = !0);
	var J = Array.isArray,
		G = { H: null, A: null, T: null, S: null, V: null },
		at = Object.prototype.hasOwnProperty;
	function et(R, q, V, w, $, st) {
		return (
			(V = st.ref),
			{ $$typeof: i, type: R, key: q, ref: V !== void 0 ? V : null, props: st }
		);
	}
	function lt(R, q) {
		return et(R.type, q, void 0, void 0, void 0, R.props);
	}
	function ht(R) {
		return typeof R == "object" && R !== null && R.$$typeof === i;
	}
	function Z(R) {
		var q = { "=": "=0", ":": "=2" };
		return "$" + R.replace(/[=:]/g, (V) => q[V]);
	}
	var it = /\/+/g;
	function vt(R, q) {
		return typeof R == "object" && R !== null && R.key != null
			? Z("" + R.key)
			: q.toString(36);
	}
	function wt() {}
	function zt(R) {
		switch (R.status) {
			case "fulfilled":
				return R.value;
			case "rejected":
				throw R.reason;
			default:
				switch (
					(typeof R.status == "string"
						? R.then(wt, wt)
						: ((R.status = "pending"),
							R.then(
								(q) => {
									R.status === "pending" &&
										((R.status = "fulfilled"), (R.value = q));
								},
								(q) => {
									R.status === "pending" &&
										((R.status = "rejected"), (R.reason = q));
								},
							)),
					R.status)
				) {
					case "fulfilled":
						return R.value;
					case "rejected":
						throw R.reason;
				}
		}
		throw R;
	}
	function Lt(R, q, V, w, $) {
		var st = typeof R;
		(st === "undefined" || st === "boolean") && (R = null);
		var W = !1;
		if (R === null) W = !0;
		else
			switch (st) {
				case "bigint":
				case "string":
				case "number":
					W = !0;
					break;
				case "object":
					switch (R.$$typeof) {
						case i:
						case s:
							W = !0;
							break;
						case b:
							return (W = R._init), Lt(W(R._payload), q, V, w, $);
					}
			}
		if (W)
			return (
				($ = $(R)),
				(W = w === "" ? "." + vt(R, 0) : w),
				J($)
					? ((V = ""),
						W != null && (V = W.replace(it, "$&/") + "/"),
						Lt($, q, V, "", (me) => me))
					: $ != null &&
						(ht($) &&
							($ = lt(
								$,
								V +
									($.key == null || (R && R.key === $.key)
										? ""
										: ("" + $.key).replace(it, "$&/") + "/") +
									W,
							)),
						q.push($)),
				1
			);
		W = 0;
		var Zt = w === "" ? "." : w + ":";
		if (J(R))
			for (var gt = 0; gt < R.length; gt++)
				(w = R[gt]), (st = Zt + vt(w, gt)), (W += Lt(w, q, V, st, $));
		else if (((gt = _(R)), typeof gt == "function"))
			for (R = gt.call(R), gt = 0; !(w = R.next()).done; )
				(w = w.value), (st = Zt + vt(w, gt++)), (W += Lt(w, q, V, st, $));
		else if (st === "object") {
			if (typeof R.then == "function") return Lt(zt(R), q, V, w, $);
			throw (
				((q = String(R)),
				Error(
					"Objects are not valid as a React child (found: " +
						(q === "[object Object]"
							? "object with keys {" + Object.keys(R).join(", ") + "}"
							: q) +
						"). If you meant to render a collection of children, use an array instead.",
				))
			);
		}
		return W;
	}
	function C(R, q, V) {
		if (R == null) return R;
		var w = [],
			$ = 0;
		return Lt(R, w, "", "", (st) => q.call(V, st, $++)), w;
	}
	function Y(R) {
		if (R._status === -1) {
			var q = R._result;
			(q = q()),
				q.then(
					(V) => {
						(R._status === 0 || R._status === -1) &&
							((R._status = 1), (R._result = V));
					},
					(V) => {
						(R._status === 0 || R._status === -1) &&
							((R._status = 2), (R._result = V));
					},
				),
				R._status === -1 && ((R._status = 0), (R._result = q));
		}
		if (R._status === 1) return R._result.default;
		throw R._result;
	}
	var P =
		typeof reportError == "function"
			? reportError
			: (R) => {
					if (
						typeof window == "object" &&
						typeof window.ErrorEvent == "function"
					) {
						var q = new window.ErrorEvent("error", {
							bubbles: !0,
							cancelable: !0,
							message:
								typeof R == "object" &&
								R !== null &&
								typeof R.message == "string"
									? String(R.message)
									: String(R),
							error: R,
						});
						if (!window.dispatchEvent(q)) return;
					} else if (
						typeof process == "object" &&
						typeof process.emit == "function"
					) {
						process.emit("uncaughtException", R);
						return;
					}
					console.error(R);
				};
	function St() {}
	return (
		(ct.Children = {
			map: C,
			forEach: (R, q, V) => {
				C(
					R,
					function () {
						q.apply(this, arguments);
					},
					V,
				);
			},
			count: (R) => {
				var q = 0;
				return (
					C(R, () => {
						q++;
					}),
					q
				);
			},
			toArray: (R) => C(R, (q) => q) || [],
			only: (R) => {
				if (!ht(R))
					throw Error(
						"React.Children.only expected to receive a single React element child.",
					);
				return R;
			},
		}),
		(ct.Component = H),
		(ct.Fragment = c),
		(ct.Profiler = f),
		(ct.PureComponent = nt),
		(ct.StrictMode = o),
		(ct.Suspense = m),
		(ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = G),
		(ct.__COMPILER_RUNTIME = {
			__proto__: null,
			c: (R) => G.H.useMemoCache(R),
		}),
		(ct.cache = (R) => () => R.apply(null, arguments)),
		(ct.cloneElement = (R, q, V) => {
			if (R == null)
				throw Error(
					"The argument must be a React element, but you passed " + R + ".",
				);
			var w = A({}, R.props),
				$ = R.key,
				st = void 0;
			if (q != null)
				for (W in (q.ref !== void 0 && (st = void 0),
				q.key !== void 0 && ($ = "" + q.key),
				q))
					!at.call(q, W) ||
						W === "key" ||
						W === "__self" ||
						W === "__source" ||
						(W === "ref" && q.ref === void 0) ||
						(w[W] = q[W]);
			var W = arguments.length - 2;
			if (W === 1) w.children = V;
			else if (1 < W) {
				for (var Zt = Array(W), gt = 0; gt < W; gt++)
					Zt[gt] = arguments[gt + 2];
				w.children = Zt;
			}
			return et(R.type, $, void 0, void 0, st, w);
		}),
		(ct.createContext = (R) => (
			(R = {
				$$typeof: y,
				_currentValue: R,
				_currentValue2: R,
				_threadCount: 0,
				Provider: null,
				Consumer: null,
			}),
			(R.Provider = R),
			(R.Consumer = { $$typeof: d, _context: R }),
			R
		)),
		(ct.createElement = (R, q, V) => {
			var w,
				$ = {},
				st = null;
			if (q != null)
				for (w in (q.key !== void 0 && (st = "" + q.key), q))
					at.call(q, w) &&
						w !== "key" &&
						w !== "__self" &&
						w !== "__source" &&
						($[w] = q[w]);
			var W = arguments.length - 2;
			if (W === 1) $.children = V;
			else if (1 < W) {
				for (var Zt = Array(W), gt = 0; gt < W; gt++)
					Zt[gt] = arguments[gt + 2];
				$.children = Zt;
			}
			if (R && R.defaultProps)
				for (w in ((W = R.defaultProps), W)) $[w] === void 0 && ($[w] = W[w]);
			return et(R, st, void 0, void 0, null, $);
		}),
		(ct.createRef = () => ({ current: null })),
		(ct.forwardRef = (R) => ({ $$typeof: p, render: R })),
		(ct.isValidElement = ht),
		(ct.lazy = (R) => ({
			$$typeof: b,
			_payload: { _status: -1, _result: R },
			_init: Y,
		})),
		(ct.memo = (R, q) => ({
			$$typeof: v,
			type: R,
			compare: q === void 0 ? null : q,
		})),
		(ct.startTransition = (R) => {
			var q = G.T,
				V = {};
			G.T = V;
			try {
				var w = R(),
					$ = G.S;
				$ !== null && $(V, w),
					typeof w == "object" &&
						w !== null &&
						typeof w.then == "function" &&
						w.then(St, P);
			} catch (st) {
				P(st);
			} finally {
				G.T = q;
			}
		}),
		(ct.unstable_useCacheRefresh = () => G.H.useCacheRefresh()),
		(ct.use = (R) => G.H.use(R)),
		(ct.useActionState = (R, q, V) => G.H.useActionState(R, q, V)),
		(ct.useCallback = (R, q) => G.H.useCallback(R, q)),
		(ct.useContext = (R) => G.H.useContext(R)),
		(ct.useDebugValue = () => {}),
		(ct.useDeferredValue = (R, q) => G.H.useDeferredValue(R, q)),
		(ct.useEffect = (R, q, V) => {
			var w = G.H;
			if (typeof V == "function")
				throw Error(
					"useEffect CRUD overload is not enabled in this build of React.",
				);
			return w.useEffect(R, q);
		}),
		(ct.useId = () => G.H.useId()),
		(ct.useImperativeHandle = (R, q, V) => G.H.useImperativeHandle(R, q, V)),
		(ct.useInsertionEffect = (R, q) => G.H.useInsertionEffect(R, q)),
		(ct.useLayoutEffect = (R, q) => G.H.useLayoutEffect(R, q)),
		(ct.useMemo = (R, q) => G.H.useMemo(R, q)),
		(ct.useOptimistic = (R, q) => G.H.useOptimistic(R, q)),
		(ct.useReducer = (R, q, V) => G.H.useReducer(R, q, V)),
		(ct.useRef = (R) => G.H.useRef(R)),
		(ct.useState = (R) => G.H.useState(R)),
		(ct.useSyncExternalStore = (R, q, V) => G.H.useSyncExternalStore(R, q, V)),
		(ct.useTransition = () => G.H.useTransition()),
		(ct.version = "19.1.1"),
		ct
	);
}
var Vh;
function fu() {
	return Vh || ((Vh = 1), (us.exports = Gy())), us.exports;
}
var ut = fu();
const ru = nv(ut);
function zs(i) {
	const s = i.errorComponent ?? ji;
	return Q.jsx(Vy, {
		getResetKey: i.getResetKey,
		onCatch: i.onCatch,
		children: ({ error: c, reset: o }) =>
			c ? ut.createElement(s, { error: c, reset: o }) : i.children,
	});
}
class Vy extends ut.Component {
	constructor() {
		super(...arguments), (this.state = { error: null });
	}
	static getDerivedStateFromProps(s) {
		return { resetKey: s.getResetKey() };
	}
	static getDerivedStateFromError(s) {
		return { error: s };
	}
	reset() {
		this.setState({ error: null });
	}
	componentDidUpdate(s, c) {
		c.error && c.resetKey !== this.state.resetKey && this.reset();
	}
	componentDidCatch(s, c) {
		this.props.onCatch && this.props.onCatch(s, c);
	}
	render() {
		return this.props.children({
			error:
				this.state.resetKey !== this.props.getResetKey()
					? null
					: this.state.error,
			reset: () => {
				this.reset();
			},
		});
	}
}
function ji({ error: i }) {
	const [s, c] = ut.useState(!1);
	return Q.jsxs("div", {
		style: { padding: ".5rem", maxWidth: "100%" },
		children: [
			Q.jsxs("div", {
				style: { display: "flex", alignItems: "center", gap: ".5rem" },
				children: [
					Q.jsx("strong", {
						style: { fontSize: "1rem" },
						children: "Something went wrong!",
					}),
					Q.jsx("button", {
						style: {
							appearance: "none",
							fontSize: ".6em",
							border: "1px solid currentColor",
							padding: ".1rem .2rem",
							fontWeight: "bold",
							borderRadius: ".25rem",
						},
						onClick: () => c((o) => !o),
						children: s ? "Hide Error" : "Show Error",
					}),
				],
			}),
			Q.jsx("div", { style: { height: ".25rem" } }),
			s
				? Q.jsx("div", {
						children: Q.jsx("pre", {
							style: {
								fontSize: ".7em",
								border: "1px solid red",
								borderRadius: ".25rem",
								padding: ".3rem",
								color: "red",
								overflow: "auto",
							},
							children: i.message
								? Q.jsx("code", { children: i.message })
								: null,
						}),
					})
				: null,
		],
	});
}
function Xy({ children: i, fallback: s = null }) {
	return Qy()
		? Q.jsx(ru.Fragment, { children: i })
		: Q.jsx(ru.Fragment, { children: s });
}
function Qy() {
	return ru.useSyncExternalStore(
		Zy,
		() => !0,
		() => !1,
	);
}
function Zy() {
	return () => {};
}
var is = { exports: {} },
	cs = {},
	os = { exports: {} },
	ss = {}; /**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xh;
function Ky() {
	if (Xh) return ss;
	Xh = 1;
	var i = fu();
	function s(g, _) {
		return (g === _ && (g !== 0 || 1 / g === 1 / _)) || (g !== g && _ !== _);
	}
	var c = typeof Object.is == "function" ? Object.is : s,
		o = i.useState,
		f = i.useEffect,
		d = i.useLayoutEffect,
		y = i.useDebugValue;
	function p(g, _) {
		var M = _(),
			A = o({ inst: { value: M, getSnapshot: _ } }),
			U = A[0].inst,
			H = A[1];
		return (
			d(() => {
				(U.value = M), (U.getSnapshot = _), m(U) && H({ inst: U });
			}, [g, M, _]),
			f(
				() => (
					m(U) && H({ inst: U }),
					g(() => {
						m(U) && H({ inst: U });
					})
				),
				[g],
			),
			y(M),
			M
		);
	}
	function m(g) {
		var _ = g.getSnapshot;
		g = g.value;
		try {
			var M = _();
			return !c(g, M);
		} catch {
			return !0;
		}
	}
	function v(g, _) {
		return _();
	}
	var b =
		typeof window > "u" ||
		typeof window.document > "u" ||
		typeof window.document.createElement > "u"
			? v
			: p;
	return (
		(ss.useSyncExternalStore =
			i.useSyncExternalStore !== void 0 ? i.useSyncExternalStore : b),
		ss
	);
}
var Qh;
function Jy() {
	return Qh || ((Qh = 1), (os.exports = Ky())), os.exports;
} /**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Zh;
function ky() {
	if (Zh) return cs;
	Zh = 1;
	var i = fu(),
		s = Jy();
	function c(v, b) {
		return (v === b && (v !== 0 || 1 / v === 1 / b)) || (v !== v && b !== b);
	}
	var o = typeof Object.is == "function" ? Object.is : c,
		f = s.useSyncExternalStore,
		d = i.useRef,
		y = i.useEffect,
		p = i.useMemo,
		m = i.useDebugValue;
	return (
		(cs.useSyncExternalStoreWithSelector = (v, b, g, _, M) => {
			var A = d(null);
			if (A.current === null) {
				var U = { hasValue: !1, value: null };
				A.current = U;
			} else U = A.current;
			A = p(() => {
				function j(at) {
					if (!nt) {
						if (
							((nt = !0), (X = at), (at = _(at)), M !== void 0 && U.hasValue)
						) {
							var et = U.value;
							if (M(et, at)) return (J = et);
						}
						return (J = at);
					}
					if (((et = J), o(X, at))) return et;
					var lt = _(at);
					return M !== void 0 && M(et, lt)
						? ((X = at), et)
						: ((X = at), (J = lt));
				}
				var nt = !1,
					X,
					J,
					G = g === void 0 ? null : g;
				return [() => j(b()), G === null ? void 0 : () => j(G())];
			}, [b, g, _, M]);
			var H = f(v, A[0], A[1]);
			return (
				y(() => {
					(U.hasValue = !0), (U.value = H);
				}, [H]),
				m(H),
				H
			);
		}),
		cs
	);
}
var Kh;
function $y() {
	return Kh || ((Kh = 1), (is.exports = ky())), is.exports;
}
var Py = $y();
function Wy(i, s = (c) => c) {
	return Py.useSyncExternalStoreWithSelector(
		i.subscribe,
		() => i.state,
		() => i.state,
		s,
		Fy,
	);
}
function Fy(i, s) {
	if (Object.is(i, s)) return !0;
	if (typeof i != "object" || i === null || typeof s != "object" || s === null)
		return !1;
	if (i instanceof Map && s instanceof Map) {
		if (i.size !== s.size) return !1;
		for (const [o, f] of i) if (!s.has(o) || !Object.is(f, s.get(o))) return !1;
		return !0;
	}
	if (i instanceof Set && s instanceof Set) {
		if (i.size !== s.size) return !1;
		for (const o of i) if (!s.has(o)) return !1;
		return !0;
	}
	if (i instanceof Date && s instanceof Date)
		return i.getTime() === s.getTime();
	const c = Object.keys(i);
	if (c.length !== Object.keys(s).length) return !1;
	for (let o = 0; o < c.length; o++)
		if (!Object.hasOwn(s, c[o]) || !Object.is(i[c[o]], s[c[o]])) return !1;
	return !0;
}
const rs = ut.createContext(null);
function gv() {
	return typeof document > "u"
		? rs
		: window.__TSR_ROUTER_CONTEXT__
			? window.__TSR_ROUTER_CONTEXT__
			: ((window.__TSR_ROUTER_CONTEXT__ = rs), rs);
}
function De(i) {
	const s = ut.useContext(gv());
	return i?.warn, s;
}
function ue(i) {
	const s = De({ warn: i?.router === void 0 }),
		c = i?.router || s,
		o = ut.useRef(void 0);
	return Wy(c.__store, (f) => {
		if (i?.select) {
			if (i.structuralSharing ?? c.options.defaultStructuralSharing) {
				const d = Oe(o.current, i.select(f));
				return (o.current = d), d;
			}
			return i.select(f);
		}
		return f;
	});
}
const Yi = ut.createContext(void 0),
	Iy = ut.createContext(void 0);
function ze(i) {
	const s = ut.useContext(i.from ? Iy : Yi);
	return ue({
		select: (o) => {
			const f = o.matches.find((d) =>
				i.from ? i.from === d.routeId : d.id === s,
			);
			if (
				(ul(
					!((i.shouldThrow ?? !0) && !f),
					`Could not find ${i.from ? `an active match from "${i.from}"` : "a nearest match!"}`,
				),
				f !== void 0)
			)
				return i.select ? i.select(f) : f;
		},
		structuralSharing: i.structuralSharing,
	});
}
function Ds(i) {
	return ze({
		from: i.from,
		strict: i.strict,
		structuralSharing: i.structuralSharing,
		select: (s) => (i.select ? i.select(s.loaderData) : s.loaderData),
	});
}
function Cs(i) {
	const { select: s, ...c } = i;
	return ze({ ...c, select: (o) => (s ? s(o.loaderDeps) : o.loaderDeps) });
}
function Us(i) {
	return ze({
		from: i.from,
		strict: i.strict,
		shouldThrow: i.shouldThrow,
		structuralSharing: i.structuralSharing,
		select: (s) => (i.select ? i.select(s.params) : s.params),
	});
}
function Ls(i) {
	return ze({
		from: i.from,
		strict: i.strict,
		shouldThrow: i.shouldThrow,
		structuralSharing: i.structuralSharing,
		select: (s) => (i.select ? i.select(s.search) : s.search),
	});
}
function Ns(i) {
	const { navigate: s, state: c } = De(),
		o = ze({ strict: !1, select: (f) => f.index });
	return ut.useCallback(
		(f) => {
			const d = f.from ?? i?.from ?? c.matches[o].fullPath;
			return s({ ...f, from: d });
		},
		[i?.from, s],
	);
}
var fs = { exports: {} },
	Ft = {}; /**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Jh;
function tg() {
	if (Jh) return Ft;
	Jh = 1;
	var i = fu();
	function s(m) {
		var v = "https://react.dev/errors/" + m;
		if (1 < arguments.length) {
			v += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var b = 2; b < arguments.length; b++)
				v += "&args[]=" + encodeURIComponent(arguments[b]);
		}
		return (
			"Minified React error #" +
			m +
			"; visit " +
			v +
			" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
		);
	}
	function c() {}
	var o = {
			d: {
				f: c,
				r: () => {
					throw Error(s(522));
				},
				D: c,
				C: c,
				L: c,
				m: c,
				X: c,
				S: c,
				M: c,
			},
			p: 0,
			findDOMNode: null,
		},
		f = Symbol.for("react.portal");
	function d(m, v, b) {
		var g =
			3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: f,
			key: g == null ? null : "" + g,
			children: m,
			containerInfo: v,
			implementation: b,
		};
	}
	var y = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function p(m, v) {
		if (m === "font") return "";
		if (typeof v == "string") return v === "use-credentials" ? v : "";
	}
	return (
		(Ft.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o),
		(Ft.createPortal = (m, v) => {
			var b =
				2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
			if (!v || (v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11))
				throw Error(s(299));
			return d(m, v, null, b);
		}),
		(Ft.flushSync = (m) => {
			var v = y.T,
				b = o.p;
			try {
				if (((y.T = null), (o.p = 2), m)) return m();
			} finally {
				(y.T = v), (o.p = b), o.d.f();
			}
		}),
		(Ft.preconnect = (m, v) => {
			typeof m == "string" &&
				(v
					? ((v = v.crossOrigin),
						(v =
							typeof v == "string"
								? v === "use-credentials"
									? v
									: ""
								: void 0))
					: (v = null),
				o.d.C(m, v));
		}),
		(Ft.prefetchDNS = (m) => {
			typeof m == "string" && o.d.D(m);
		}),
		(Ft.preinit = (m, v) => {
			if (typeof m == "string" && v && typeof v.as == "string") {
				var b = v.as,
					g = p(b, v.crossOrigin),
					_ = typeof v.integrity == "string" ? v.integrity : void 0,
					M = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
				b === "style"
					? o.d.S(m, typeof v.precedence == "string" ? v.precedence : void 0, {
							crossOrigin: g,
							integrity: _,
							fetchPriority: M,
						})
					: b === "script" &&
						o.d.X(m, {
							crossOrigin: g,
							integrity: _,
							fetchPriority: M,
							nonce: typeof v.nonce == "string" ? v.nonce : void 0,
						});
			}
		}),
		(Ft.preinitModule = (m, v) => {
			if (typeof m == "string")
				if (typeof v == "object" && v !== null) {
					if (v.as == null || v.as === "script") {
						var b = p(v.as, v.crossOrigin);
						o.d.M(m, {
							crossOrigin: b,
							integrity: typeof v.integrity == "string" ? v.integrity : void 0,
							nonce: typeof v.nonce == "string" ? v.nonce : void 0,
						});
					}
				} else v == null && o.d.M(m);
		}),
		(Ft.preload = (m, v) => {
			if (
				typeof m == "string" &&
				typeof v == "object" &&
				v !== null &&
				typeof v.as == "string"
			) {
				var b = v.as,
					g = p(b, v.crossOrigin);
				o.d.L(m, b, {
					crossOrigin: g,
					integrity: typeof v.integrity == "string" ? v.integrity : void 0,
					nonce: typeof v.nonce == "string" ? v.nonce : void 0,
					type: typeof v.type == "string" ? v.type : void 0,
					fetchPriority:
						typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
					referrerPolicy:
						typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
					imageSrcSet:
						typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
					imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
					media: typeof v.media == "string" ? v.media : void 0,
				});
			}
		}),
		(Ft.preloadModule = (m, v) => {
			if (typeof m == "string")
				if (v) {
					var b = p(v.as, v.crossOrigin);
					o.d.m(m, {
						as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
						crossOrigin: b,
						integrity: typeof v.integrity == "string" ? v.integrity : void 0,
					});
				} else o.d.m(m);
		}),
		(Ft.requestFormReset = (m) => {
			o.d.r(m);
		}),
		(Ft.unstable_batchedUpdates = (m, v) => m(v)),
		(Ft.useFormState = (m, v, b) => y.H.useFormState(m, v, b)),
		(Ft.useFormStatus = () => y.H.useHostTransitionStatus()),
		(Ft.version = "19.1.1"),
		Ft
	);
}
var kh;
function pv() {
	if (kh) return fs.exports;
	kh = 1;
	function i() {
		if (
			!(
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
			)
		)
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
			} catch (s) {
				console.error(s);
			}
	}
	return i(), (fs.exports = tg()), fs.exports;
}
var eg = pv();
const xi = typeof window < "u" ? ut.useLayoutEffect : ut.useEffect;
function ds(i) {
	const s = ut.useRef({ value: i, prev: null }),
		c = s.current.value;
	return i !== c && (s.current = { value: i, prev: c }), s.current.prev;
}
function lg(i, s, c = {}, o = {}) {
	ut.useEffect(() => {
		if (!i.current || o.disabled || typeof IntersectionObserver != "function")
			return;
		const f = new IntersectionObserver(([d]) => {
			s(d);
		}, c);
		return (
			f.observe(i.current),
			() => {
				f.disconnect();
			}
		);
	}, [s, c, o.disabled, i]);
}
function ag(i) {
	const s = ut.useRef(null);
	return ut.useImperativeHandle(i, () => s.current, []), s;
}
function ng(i, s) {
	const c = De(),
		[o, f] = ut.useState(!1),
		d = ut.useRef(!1),
		y = ag(s),
		{
			activeProps: p,
			inactiveProps: m,
			activeOptions: v,
			to: b,
			preload: g,
			preloadDelay: _,
			hashScrollIntoView: M,
			replace: A,
			startTransition: U,
			resetScroll: H,
			viewTransition: j,
			children: nt,
			target: X,
			disabled: J,
			style: G,
			className: at,
			onClick: et,
			onFocus: lt,
			onMouseEnter: ht,
			onMouseLeave: Z,
			onTouchStart: it,
			ignoreBlocker: vt,
			params: wt,
			search: zt,
			hash: Lt,
			state: C,
			mask: Y,
			reloadDocument: P,
			unsafeRelative: St,
			from: R,
			_fromLocation: q,
			...V
		} = i,
		w = ut.useMemo(() => {
			try {
				return new URL(b), "external";
			} catch {}
			return "internal";
		}, [b]),
		$ = ue({ select: (Ot) => Ot.location.search, structuralSharing: !0 }),
		st = ze({ strict: !1, select: (Ot) => i.from ?? Ot.fullPath }),
		W = ut.useMemo(
			() => c.buildLocation({ ...i, from: st }),
			[
				c,
				$,
				i._fromLocation,
				st,
				i.hash,
				i.to,
				i.search,
				i.params,
				i.state,
				i.mask,
				i.unsafeRelative,
			],
		),
		Zt = w === "external",
		gt = i.reloadDocument || Zt ? !1 : (g ?? c.options.defaultPreload),
		me = _ ?? c.options.defaultPreloadDelay ?? 0,
		Ll = ue({
			select: (Ot) => {
				if (Zt) return !1;
				if (v?.exact) {
					if (!P0(Ot.location.pathname, W.pathname, c.basepath)) return !1;
				} else {
					const Kt = Ui(Ot.location.pathname, c.basepath),
						Ne = Ui(W.pathname, c.basepath);
					if (
						!(
							Kt.startsWith(Ne) &&
							(Kt.length === Ne.length || Kt[Ne.length] === "/")
						)
					)
						return !1;
				}
				return (v?.includeSearch ?? !0) &&
					!ka(Ot.location.search, W.search, {
						partial: !v?.exact,
						ignoreUndefined: !v?.explicitUndefined,
					})
					? !1
					: v?.includeHash
						? Ot.location.hash === W.hash
						: !0;
			},
		}),
		ye = ut.useCallback(() => {
			c.preloadRoute({ ...i, from: st }).catch((Ot) => {
				console.warn(Ot), console.warn(Yy);
			});
		}, [
			c,
			i.to,
			i._fromLocation,
			st,
			i.search,
			i.hash,
			i.params,
			i.state,
			i.mask,
			i.unsafeRelative,
			i.hashScrollIntoView,
			i.href,
			i.ignoreBlocker,
			i.reloadDocument,
			i.replace,
			i.resetScroll,
			i.viewTransition,
		]),
		Ia = ut.useCallback(
			(Ot) => {
				Ot?.isIntersecting && ye();
			},
			[ye],
		);
	if (
		(lg(y, Ia, sg, { disabled: !!J || gt !== "viewport" }),
		ut.useEffect(() => {
			d.current || (!J && gt === "render" && (ye(), (d.current = !0)));
		}, [J, ye, gt]),
		Zt)
	)
		return {
			...V,
			ref: y,
			type: w,
			href: b,
			...(nt && { children: nt }),
			...(X && { target: X }),
			...(J && { disabled: J }),
			...(G && { style: G }),
			...(at && { className: at }),
			...(et && { onClick: et }),
			...(lt && { onFocus: lt }),
			...(ht && { onMouseEnter: ht }),
			...(Z && { onMouseLeave: Z }),
			...(it && { onTouchStart: it }),
		};
	const tn = (Ot) => {
			if (
				!J &&
				!rg(Ot) &&
				!Ot.defaultPrevented &&
				(!X || X === "_self") &&
				Ot.button === 0
			) {
				Ot.preventDefault(),
					eg.flushSync(() => {
						f(!0);
					});
				const Kt = c.subscribe("onResolved", () => {
					Kt(), f(!1);
				});
				c.navigate({
					...i,
					from: st,
					replace: A,
					resetScroll: H,
					hashScrollIntoView: M,
					startTransition: U,
					viewTransition: j,
					ignoreBlocker: vt,
				});
			}
		},
		na = (Ot) => {
			J || (gt && ye());
		},
		wi = na,
		Gi = (Ot) => {
			if (!(J || !gt))
				if (!me) ye();
				else {
					const Kt = Ot.target;
					if (lu.has(Kt)) return;
					const Ne = setTimeout(() => {
						lu.delete(Kt), ye();
					}, me);
					lu.set(Kt, Ne);
				}
		},
		ge = (Ot) => {
			if (J || !gt || !me) return;
			const Kt = Ot.target,
				Ne = lu.get(Kt);
			Ne && (clearTimeout(Ne), lu.delete(Kt));
		},
		ua = Ll ? (ta(p, {}) ?? ug) : hs,
		Nl = Ll ? hs : (ta(m, {}) ?? hs),
		en = [at, ua.className, Nl.className].filter(Boolean).join(" "),
		Bl = (G || ua.style || Nl.style) && { ...G, ...ua.style, ...Nl.style };
	return {
		...V,
		...ua,
		...Nl,
		href: J
			? void 0
			: W.maskedLocation
				? c.history.createHref(W.maskedLocation.href)
				: c.history.createHref(W.href),
		ref: y,
		onClick: au([et, tn]),
		onFocus: au([lt, na]),
		onMouseEnter: au([ht, Gi]),
		onMouseLeave: au([Z, ge]),
		onTouchStart: au([it, wi]),
		disabled: !!J,
		target: X,
		...(Bl && { style: Bl }),
		...(en && { className: en }),
		...(J && ig),
		...(Ll && cg),
		...(o && og),
	};
}
const hs = {},
	ug = { className: "active" },
	ig = { role: "link", "aria-disabled": !0 },
	cg = { "data-status": "active", "aria-current": "page" },
	og = { "data-transitioning": "transitioning" },
	lu = new WeakMap(),
	sg = { rootMargin: "100px" },
	au = (i) => (s) => {
		i.filter(Boolean).forEach((c) => {
			s.defaultPrevented || c(s);
		});
	},
	Sv = ut.forwardRef((i, s) => {
		const { _asChild: c, ...o } = i,
			{ type: f, ref: d, ...y } = ng(o, s),
			p =
				typeof o.children == "function"
					? o.children({ isActive: y["data-status"] === "active" })
					: o.children;
		return (
			c === void 0 && delete y.disabled,
			ut.createElement(c || "a", { ...y, ref: d }, p)
		);
	});
function rg(i) {
	return !!(i.metaKey || i.altKey || i.ctrlKey || i.shiftKey);
}
const fg = class extends yv {
	constructor(s) {
		super(s),
			(this.useMatch = (c) =>
				ze({
					select: c?.select,
					from: this.id,
					structuralSharing: c?.structuralSharing,
				})),
			(this.useRouteContext = (c) =>
				ze({
					...c,
					from: this.id,
					select: (o) => (c?.select ? c.select(o.context) : o.context),
				})),
			(this.useSearch = (c) =>
				Ls({
					select: c?.select,
					structuralSharing: c?.structuralSharing,
					from: this.id,
				})),
			(this.useParams = (c) =>
				Us({
					select: c?.select,
					structuralSharing: c?.structuralSharing,
					from: this.id,
				})),
			(this.useLoaderDeps = (c) => Cs({ ...c, from: this.id })),
			(this.useLoaderData = (c) => Ds({ ...c, from: this.id })),
			(this.useNavigate = () => Ns({ from: this.fullPath })),
			(this.Link = ru.forwardRef((c, o) =>
				Q.jsx(Sv, { ref: o, from: this.fullPath, ...c }),
			)),
			(this.$$typeof = Symbol.for("react.memo"));
	}
};
function dg(i) {
	return new fg(i);
}
class hg extends wy {
	constructor(s) {
		super(s),
			(this.useMatch = (c) =>
				ze({
					select: c?.select,
					from: this.id,
					structuralSharing: c?.structuralSharing,
				})),
			(this.useRouteContext = (c) =>
				ze({
					...c,
					from: this.id,
					select: (o) => (c?.select ? c.select(o.context) : o.context),
				})),
			(this.useSearch = (c) =>
				Ls({
					select: c?.select,
					structuralSharing: c?.structuralSharing,
					from: this.id,
				})),
			(this.useParams = (c) =>
				Us({
					select: c?.select,
					structuralSharing: c?.structuralSharing,
					from: this.id,
				})),
			(this.useLoaderDeps = (c) => Cs({ ...c, from: this.id })),
			(this.useLoaderData = (c) => Ds({ ...c, from: this.id })),
			(this.useNavigate = () => Ns({ from: this.fullPath })),
			(this.Link = ru.forwardRef((c, o) =>
				Q.jsx(Sv, { ref: o, from: this.fullPath, ...c }),
			)),
			(this.$$typeof = Symbol.for("react.memo"));
	}
}
function vg(i) {
	return new hg(i);
}
function Ts(i) {
	return typeof i == "object"
		? new $h(i, { silent: !0 }).createRoute(i)
		: new $h(i, { silent: !0 }).createRoute;
}
class $h {
	constructor(s, c) {
		(this.path = s),
			(this.createRoute = (o) => {
				this.silent;
				const f = dg(o);
				return (f.isRoot = !1), f;
			}),
			(this.silent = c?.silent);
	}
}
class Ph {
	constructor(s) {
		(this.useMatch = (c) =>
			ze({
				select: c?.select,
				from: this.options.id,
				structuralSharing: c?.structuralSharing,
			})),
			(this.useRouteContext = (c) =>
				ze({
					from: this.options.id,
					select: (o) => (c?.select ? c.select(o.context) : o.context),
				})),
			(this.useSearch = (c) =>
				Ls({
					select: c?.select,
					structuralSharing: c?.structuralSharing,
					from: this.options.id,
				})),
			(this.useParams = (c) =>
				Us({
					select: c?.select,
					structuralSharing: c?.structuralSharing,
					from: this.options.id,
				})),
			(this.useLoaderDeps = (c) => Cs({ ...c, from: this.options.id })),
			(this.useLoaderData = (c) => Ds({ ...c, from: this.options.id })),
			(this.useNavigate = () => {
				const c = De();
				return Ns({ from: c.routesById[this.options.id].fullPath });
			}),
			(this.options = s),
			(this.$$typeof = Symbol.for("react.memo"));
	}
}
function Wh(i) {
	return typeof i == "object" ? new Ph(i) : (s) => new Ph({ id: i, ...s });
}
function mg(i, s) {
	let c, o, f, d;
	const y = () => (
			c ||
				(c = i()
					.then((m) => {
						(c = void 0), (o = m[s]);
					})
					.catch((m) => {
						if (
							((f = m),
							$0(f) &&
								f instanceof Error &&
								typeof window < "u" &&
								typeof sessionStorage < "u")
						) {
							const v = `tanstack_router_reload:${f.message}`;
							sessionStorage.getItem(v) ||
								(sessionStorage.setItem(v, "1"), (d = !0));
						}
					})),
			c
		),
		p = (v) => {
			if (d) throw (window.location.reload(), new Promise(() => {}));
			if (f) throw f;
			if (!o) throw y();
			return ut.createElement(o, v);
		};
	return (p.preload = y), p;
}
function yg() {
	const i = De(),
		s = ut.useRef({ router: i, mounted: !1 }),
		[c, o] = ut.useState(!1),
		{ hasPendingMatches: f, isLoading: d } = ue({
			select: (g) => ({
				isLoading: g.isLoading,
				hasPendingMatches: g.matches.some((_) => _.status === "pending"),
			}),
			structuralSharing: !0,
		}),
		y = ds(d),
		p = d || c || f,
		m = ds(p),
		v = d || f,
		b = ds(v);
	return (
		(i.startTransition = (g) => {
			o(!0),
				ut.startTransition(() => {
					g(), o(!1);
				});
		}),
		ut.useEffect(() => {
			const g = i.history.subscribe(i.load),
				_ = i.buildLocation({
					to: i.latestLocation.pathname,
					search: !0,
					params: !0,
					hash: !0,
					state: !0,
					_includeValidateSearch: !0,
				});
			return (
				Wa(i.latestLocation.href) !== Wa(_.href) &&
					i.commitLocation({ ..._, replace: !0 }),
				() => {
					g();
				}
			);
		}, [i, i.history]),
		xi(() => {
			if (
				(typeof window < "u" && i.ssr) ||
				(s.current.router === i && s.current.mounted)
			)
				return;
			(s.current = { router: i, mounted: !0 }),
				(async () => {
					try {
						await i.load();
					} catch (_) {
						console.error(_);
					}
				})();
		}, [i]),
		xi(() => {
			y && !d && i.emit({ type: "onLoad", ...ea(i.state) });
		}, [y, i, d]),
		xi(() => {
			b && !v && i.emit({ type: "onBeforeRouteMount", ...ea(i.state) });
		}, [v, b, i]),
		xi(() => {
			m &&
				!p &&
				(i.emit({ type: "onResolved", ...ea(i.state) }),
				i.__store.setState((g) => ({
					...g,
					status: "idle",
					resolvedLocation: g.location,
				})),
				hy(i));
		}, [p, m, i]),
		null
	);
}
function gg(i) {
	const s = ue({
		select: (c) => `not-found-${c.location.pathname}-${c.status}`,
	});
	return Q.jsx(zs, {
		getResetKey: () => s,
		onCatch: (c, o) => {
			var f;
			if (Ge(c)) (f = i.onCatch) == null || f.call(i, c, o);
			else throw c;
		},
		errorComponent: ({ error: c }) => {
			var o;
			if (Ge(c)) return (o = i.fallback) == null ? void 0 : o.call(i, c);
			throw c;
		},
		children: i.children,
	});
}
function pg() {
	return Q.jsx("p", { children: "Not Found" });
}
function Za(i) {
	return Q.jsx(Q.Fragment, { children: i.children });
}
function _v(i, s, c) {
	return s.options.notFoundComponent
		? Q.jsx(s.options.notFoundComponent, { data: c })
		: i.options.defaultNotFoundComponent
			? Q.jsx(i.options.defaultNotFoundComponent, { data: c })
			: Q.jsx(pg, {});
}
function Sg({ children: i }) {
	return typeof document < "u"
		? null
		: Q.jsx("script", {
				className: "$tsr",
				dangerouslySetInnerHTML: {
					__html: [i].filter(Boolean).join(`
`),
				},
			});
}
function _g() {
	const i = De(),
		c = (i.options.getScrollRestorationKey || Rs)(i.latestLocation),
		o = c !== Rs(i.latestLocation) ? c : void 0;
	if (!i.isScrollRestoring || !i.isServer) return null;
	const f = { storageKey: Ni, shouldScrollRestoration: !0 };
	return (
		o && (f.key = o),
		Q.jsx(Sg, { children: `(${ov.toString()})(${JSON.stringify(f)})` })
	);
}
const bv = ut.memo(({ matchId: s }) => {
	var c, o;
	const f = De(),
		d = ue({
			select: (X) => {
				const J = X.matches.find((G) => G.id === s);
				return (
					ul(J),
					{ routeId: J.routeId, ssr: J.ssr, _displayPending: J._displayPending }
				);
			},
			structuralSharing: !0,
		}),
		y = f.routesById[d.routeId],
		p = y.options.pendingComponent ?? f.options.defaultPendingComponent,
		m = p ? Q.jsx(p, {}) : null,
		v = y.options.errorComponent ?? f.options.defaultErrorComponent,
		b = y.options.onCatch ?? f.options.defaultOnCatch,
		g = y.isRoot
			? (y.options.notFoundComponent ??
				((c = f.options.notFoundRoute) == null ? void 0 : c.options.component))
			: y.options.notFoundComponent,
		_ = d.ssr === !1 || d.ssr === "data-only",
		M =
			(!y.isRoot || y.options.wrapInSuspense || _) &&
			(y.options.wrapInSuspense ??
				p ??
				(((o = y.options.errorComponent) == null ? void 0 : o.preload) || _))
				? ut.Suspense
				: Za,
		A = v ? zs : Za,
		U = g ? gg : Za,
		H = ue({ select: (X) => X.loadedAt }),
		j = ue({
			select: (X) => {
				var J;
				const G = X.matches.findIndex((at) => at.id === s);
				return (J = X.matches[G - 1]) == null ? void 0 : J.routeId;
			},
		}),
		nt = y.isRoot ? (y.options.shellComponent ?? Za) : Za;
	return Q.jsxs(nt, {
		children: [
			Q.jsx(Yi.Provider, {
				value: s,
				children: Q.jsx(M, {
					fallback: m,
					children: Q.jsx(A, {
						getResetKey: () => H,
						errorComponent: v || ji,
						onCatch: (X, J) => {
							if (Ge(X)) throw X;
							b?.(X, J);
						},
						children: Q.jsx(U, {
							fallback: (X) => {
								if (
									!g ||
									(X.routeId && X.routeId !== d.routeId) ||
									(!X.routeId && !y.isRoot)
								)
									throw X;
								return ut.createElement(g, X);
							},
							children:
								_ || d._displayPending
									? Q.jsx(Xy, {
											fallback: m,
											children: Q.jsx(Fh, { matchId: s }),
										})
									: Q.jsx(Fh, { matchId: s }),
						}),
					}),
				}),
			}),
			j === xe && f.options.scrollRestoration
				? Q.jsxs(Q.Fragment, { children: [Q.jsx(bg, {}), Q.jsx(_g, {})] })
				: null,
		],
	});
});
function bg() {
	const i = De(),
		s = ut.useRef(void 0);
	return Q.jsx(
		"script",
		{
			suppressHydrationWarning: !0,
			ref: (c) => {
				c &&
					(s.current === void 0 || s.current.href !== i.latestLocation.href) &&
					(i.emit({ type: "onRendered", ...ea(i.state) }),
					(s.current = i.latestLocation));
			},
		},
		i.latestLocation.state.__TSR_key,
	);
}
const Fh = ut.memo(({ matchId: s }) => {
		var c, o, f, d;
		const y = De(),
			{
				match: p,
				key: m,
				routeId: v,
			} = ue({
				select: (_) => {
					const M = _.matches.find((nt) => nt.id === s),
						A = M.routeId,
						U =
							y.routesById[A].options.remountDeps ??
							y.options.defaultRemountDeps,
						H = U?.({
							routeId: A,
							loaderDeps: M.loaderDeps,
							params: M._strictParams,
							search: M._strictSearch,
						});
					return {
						key: H ? JSON.stringify(H) : void 0,
						routeId: A,
						match: {
							id: M.id,
							status: M.status,
							error: M.error,
							_forcePending: M._forcePending,
							_displayPending: M._displayPending,
						},
					};
				},
				structuralSharing: !0,
			}),
			b = y.routesById[v],
			g = ut.useMemo(() => {
				const _ = b.options.component ?? y.options.defaultComponent;
				return _ ? Q.jsx(_, {}, m) : Q.jsx(Rv, {});
			}, [m, b.options.component, y.options.defaultComponent]);
		if (p._displayPending)
			throw (c = y.getMatch(p.id)) == null
				? void 0
				: c._nonReactive.displayPendingPromise;
		if (p._forcePending)
			throw (o = y.getMatch(p.id)) == null
				? void 0
				: o._nonReactive.minPendingPromise;
		if (p.status === "pending") {
			const _ = b.options.pendingMinMs ?? y.options.defaultPendingMinMs;
			if (_) {
				const M = y.getMatch(p.id);
				if (M && !M._nonReactive.minPendingPromise && !y.isServer) {
					const A = $a();
					(M._nonReactive.minPendingPromise = A),
						setTimeout(() => {
							A.resolve(), (M._nonReactive.minPendingPromise = void 0);
						}, _);
				}
			}
			throw (f = y.getMatch(p.id)) == null
				? void 0
				: f._nonReactive.loadPromise;
		}
		if (p.status === "notFound") return ul(Ge(p.error)), _v(y, b, p.error);
		if (p.status === "redirected")
			throw (
				(ul(we(p.error)),
				(d = y.getMatch(p.id)) == null ? void 0 : d._nonReactive.loadPromise)
			);
		if (p.status === "error") {
			if (y.isServer) {
				const _ =
					(b.options.errorComponent ?? y.options.defaultErrorComponent) || ji;
				return Q.jsx(_, {
					error: p.error,
					reset: void 0,
					info: { componentStack: "" },
				});
			}
			throw p.error;
		}
		return g;
	}),
	Rv = ut.memo(() => {
		const s = De(),
			c = ut.useContext(Yi),
			o = ue({
				select: (v) => {
					var b;
					return (b = v.matches.find((g) => g.id === c)) == null
						? void 0
						: b.routeId;
				},
			}),
			f = s.routesById[o],
			d = ue({
				select: (v) => {
					const g = v.matches.find((_) => _.id === c);
					return ul(g), g.globalNotFound;
				},
			}),
			y = ue({
				select: (v) => {
					var b;
					const g = v.matches,
						_ = g.findIndex((M) => M.id === c);
					return (b = g[_ + 1]) == null ? void 0 : b.id;
				},
			}),
			p = s.options.defaultPendingComponent
				? Q.jsx(s.options.defaultPendingComponent, {})
				: null;
		if (d) return _v(s, f, void 0);
		if (!y) return null;
		const m = Q.jsx(bv, { matchId: y });
		return c === xe ? Q.jsx(ut.Suspense, { fallback: p, children: m }) : m;
	});
function Rg() {
	const i = De(),
		s = i.options.defaultPendingComponent
			? Q.jsx(i.options.defaultPendingComponent, {})
			: null,
		c = i.isServer || (typeof document < "u" && i.ssr) ? Za : ut.Suspense,
		o = Q.jsxs(c, {
			fallback: s,
			children: [!i.isServer && Q.jsx(yg, {}), Q.jsx(Eg, {})],
		});
	return i.options.InnerWrap ? Q.jsx(i.options.InnerWrap, { children: o }) : o;
}
function Eg() {
	const i = De(),
		s = ue({
			select: (f) => {
				var d;
				return (d = f.matches[0]) == null ? void 0 : d.id;
			},
		}),
		c = ue({ select: (f) => f.loadedAt }),
		o = s ? Q.jsx(bv, { matchId: s }) : null;
	return Q.jsx(Yi.Provider, {
		value: s,
		children: i.options.disableGlobalCatchBoundary
			? o
			: Q.jsx(zs, {
					getResetKey: () => c,
					errorComponent: ji,
					onCatch: (f) => {
						f.message || f.toString();
					},
					children: o,
				}),
	});
}
const Tg = (i) => new Mg(i);
class Mg extends Oy {
	constructor(s) {
		super(s);
	}
}
typeof globalThis < "u"
	? ((globalThis.createFileRoute = Ts), (globalThis.createLazyFileRoute = Wh))
	: typeof window < "u" &&
		((window.createFileRoute = Ts), (window.createLazyFileRoute = Wh));
function Ag({ router: i, children: s, ...c }) {
	Object.keys(c).length > 0 &&
		i.update({
			...i.options,
			...c,
			context: { ...i.options.context, ...c.context },
		});
	const o = gv(),
		f = Q.jsx(o.Provider, { value: i, children: s });
	return i.options.Wrap ? Q.jsx(i.options.Wrap, { children: f }) : f;
}
function Og({ router: i, ...s }) {
	return Q.jsx(Ag, { router: i, ...s, children: Q.jsx(Rg, {}) });
}
var vs = { exports: {} },
	nu = {},
	ms = { exports: {} },
	ys = {}; /**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ih;
function xg() {
	return (
		Ih ||
			((Ih = 1),
			((i) => {
				function s(C, Y) {
					var P = C.length;
					C.push(Y);
					for (; 0 < P; ) {
						var St = (P - 1) >>> 1,
							R = C[St];
						if (0 < f(R, Y)) (C[St] = Y), (C[P] = R), (P = St);
						else break;
					}
				}
				function c(C) {
					return C.length === 0 ? null : C[0];
				}
				function o(C) {
					if (C.length === 0) return null;
					var Y = C[0],
						P = C.pop();
					if (P !== Y) {
						C[0] = P;
						for (var St = 0, R = C.length, q = R >>> 1; St < q; ) {
							var V = 2 * (St + 1) - 1,
								w = C[V],
								$ = V + 1,
								st = C[$];
							if (0 > f(w, P))
								$ < R && 0 > f(st, w)
									? ((C[St] = st), (C[$] = P), (St = $))
									: ((C[St] = w), (C[V] = P), (St = V));
							else if ($ < R && 0 > f(st, P))
								(C[St] = st), (C[$] = P), (St = $);
							else break;
						}
					}
					return Y;
				}
				function f(C, Y) {
					var P = C.sortIndex - Y.sortIndex;
					return P !== 0 ? P : C.id - Y.id;
				}
				if (
					((i.unstable_now = void 0),
					typeof performance == "object" &&
						typeof performance.now == "function")
				) {
					var d = performance;
					i.unstable_now = () => d.now();
				} else {
					var y = Date,
						p = y.now();
					i.unstable_now = () => y.now() - p;
				}
				var m = [],
					v = [],
					b = 1,
					g = null,
					_ = 3,
					M = !1,
					A = !1,
					U = !1,
					H = !1,
					j = typeof setTimeout == "function" ? setTimeout : null,
					nt = typeof clearTimeout == "function" ? clearTimeout : null,
					X = typeof setImmediate < "u" ? setImmediate : null;
				function J(C) {
					for (var Y = c(v); Y !== null; ) {
						if (Y.callback === null) o(v);
						else if (Y.startTime <= C)
							o(v), (Y.sortIndex = Y.expirationTime), s(m, Y);
						else break;
						Y = c(v);
					}
				}
				function G(C) {
					if (((U = !1), J(C), !A))
						if (c(m) !== null) (A = !0), at || ((at = !0), vt());
						else {
							var Y = c(v);
							Y !== null && Lt(G, Y.startTime - C);
						}
				}
				var at = !1,
					et = -1,
					lt = 5,
					ht = -1;
				function Z() {
					return H ? !0 : !(i.unstable_now() - ht < lt);
				}
				function it() {
					if (((H = !1), at)) {
						var C = i.unstable_now();
						ht = C;
						var Y = !0;
						try {
							t: {
								(A = !1), U && ((U = !1), nt(et), (et = -1)), (M = !0);
								var P = _;
								try {
									e: {
										for (
											J(C), g = c(m);
											g !== null && !(g.expirationTime > C && Z());
										) {
											var St = g.callback;
											if (typeof St == "function") {
												(g.callback = null), (_ = g.priorityLevel);
												var R = St(g.expirationTime <= C);
												if (((C = i.unstable_now()), typeof R == "function")) {
													(g.callback = R), J(C), (Y = !0);
													break e;
												}
												g === c(m) && o(m), J(C);
											} else o(m);
											g = c(m);
										}
										if (g !== null) Y = !0;
										else {
											var q = c(v);
											q !== null && Lt(G, q.startTime - C), (Y = !1);
										}
									}
									break t;
								} finally {
									(g = null), (_ = P), (M = !1);
								}
								Y = void 0;
							}
						} finally {
							Y ? vt() : (at = !1);
						}
					}
				}
				var vt;
				if (typeof X == "function")
					vt = () => {
						X(it);
					};
				else if (typeof MessageChannel < "u") {
					var wt = new MessageChannel(),
						zt = wt.port2;
					(wt.port1.onmessage = it),
						(vt = () => {
							zt.postMessage(null);
						});
				} else
					vt = () => {
						j(it, 0);
					};
				function Lt(C, Y) {
					et = j(() => {
						C(i.unstable_now());
					}, Y);
				}
				(i.unstable_IdlePriority = 5),
					(i.unstable_ImmediatePriority = 1),
					(i.unstable_LowPriority = 4),
					(i.unstable_NormalPriority = 3),
					(i.unstable_Profiling = null),
					(i.unstable_UserBlockingPriority = 2),
					(i.unstable_cancelCallback = (C) => {
						C.callback = null;
					}),
					(i.unstable_forceFrameRate = (C) => {
						0 > C || 125 < C
							? console.error(
									"forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
								)
							: (lt = 0 < C ? Math.floor(1e3 / C) : 5);
					}),
					(i.unstable_getCurrentPriorityLevel = () => _),
					(i.unstable_next = (C) => {
						switch (_) {
							case 1:
							case 2:
							case 3: {
								var Y = 3;
								break;
							}
							default:
								Y = _;
						}
						var P = _;
						_ = Y;
						try {
							return C();
						} finally {
							_ = P;
						}
					}),
					(i.unstable_requestPaint = () => {
						H = !0;
					}),
					(i.unstable_runWithPriority = (C, Y) => {
						switch (C) {
							case 1:
							case 2:
							case 3:
							case 4:
							case 5:
								break;
							default:
								C = 3;
						}
						var P = _;
						_ = C;
						try {
							return Y();
						} finally {
							_ = P;
						}
					}),
					(i.unstable_scheduleCallback = (C, Y, P) => {
						var St = i.unstable_now();
						switch (
							(typeof P == "object" && P !== null
								? ((P = P.delay),
									(P = typeof P == "number" && 0 < P ? St + P : St))
								: (P = St),
							C)
						) {
							case 1: {
								var R = -1;
								break;
							}
							case 2:
								R = 250;
								break;
							case 5:
								R = 1073741823;
								break;
							case 4:
								R = 1e4;
								break;
							default:
								R = 5e3;
						}
						return (
							(R = P + R),
							(C = {
								id: b++,
								callback: Y,
								priorityLevel: C,
								startTime: P,
								expirationTime: R,
								sortIndex: -1,
							}),
							P > St
								? ((C.sortIndex = P),
									s(v, C),
									c(m) === null &&
										C === c(v) &&
										(U ? (nt(et), (et = -1)) : (U = !0), Lt(G, P - St)))
								: ((C.sortIndex = R),
									s(m, C),
									A || M || ((A = !0), at || ((at = !0), vt()))),
							C
						);
					}),
					(i.unstable_shouldYield = Z),
					(i.unstable_wrapCallback = (C) => {
						var Y = _;
						return function () {
							var P = _;
							_ = Y;
							try {
								return C.apply(this, arguments);
							} finally {
								_ = P;
							}
						};
					});
			})(ys)),
		ys
	);
}
var tv;
function zg() {
	return tv || ((tv = 1), (ms.exports = xg())), ms.exports;
} /**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ev;
function Dg() {
	if (ev) return nu;
	ev = 1;
	var i = zg(),
		s = fu(),
		c = pv();
	function o(t) {
		var e = "https://react.dev/errors/" + t;
		if (1 < arguments.length) {
			e += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var l = 2; l < arguments.length; l++)
				e += "&args[]=" + encodeURIComponent(arguments[l]);
		}
		return (
			"Minified React error #" +
			t +
			"; visit " +
			e +
			" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
		);
	}
	function f(t) {
		return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
	}
	function d(t) {
		var e = t,
			l = t;
		if (t.alternate) for (; e.return; ) e = e.return;
		else {
			t = e;
			do (e = t), (e.flags & 4098) !== 0 && (l = e.return), (t = e.return);
			while (t);
		}
		return e.tag === 3 ? l : null;
	}
	function y(t) {
		if (t.tag === 13) {
			var e = t.memoizedState;
			if (
				(e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)),
				e !== null)
			)
				return e.dehydrated;
		}
		return null;
	}
	function p(t) {
		if (d(t) !== t) throw Error(o(188));
	}
	function m(t) {
		var e = t.alternate;
		if (!e) {
			if (((e = d(t)), e === null)) throw Error(o(188));
			return e !== t ? null : t;
		}
		for (var l = t, a = e; ; ) {
			var n = l.return;
			if (n === null) break;
			var u = n.alternate;
			if (u === null) {
				if (((a = n.return), a !== null)) {
					l = a;
					continue;
				}
				break;
			}
			if (n.child === u.child) {
				for (u = n.child; u; ) {
					if (u === l) return p(n), t;
					if (u === a) return p(n), e;
					u = u.sibling;
				}
				throw Error(o(188));
			}
			if (l.return !== a.return) (l = n), (a = u);
			else {
				for (var r = !1, h = n.child; h; ) {
					if (h === l) {
						(r = !0), (l = n), (a = u);
						break;
					}
					if (h === a) {
						(r = !0), (a = n), (l = u);
						break;
					}
					h = h.sibling;
				}
				if (!r) {
					for (h = u.child; h; ) {
						if (h === l) {
							(r = !0), (l = u), (a = n);
							break;
						}
						if (h === a) {
							(r = !0), (a = u), (l = n);
							break;
						}
						h = h.sibling;
					}
					if (!r) throw Error(o(189));
				}
			}
			if (l.alternate !== a) throw Error(o(190));
		}
		if (l.tag !== 3) throw Error(o(188));
		return l.stateNode.current === l ? t : e;
	}
	function v(t) {
		var e = t.tag;
		if (e === 5 || e === 26 || e === 27 || e === 6) return t;
		for (t = t.child; t !== null; ) {
			if (((e = v(t)), e !== null)) return e;
			t = t.sibling;
		}
		return null;
	}
	var b = Object.assign,
		g = Symbol.for("react.element"),
		_ = Symbol.for("react.transitional.element"),
		M = Symbol.for("react.portal"),
		A = Symbol.for("react.fragment"),
		U = Symbol.for("react.strict_mode"),
		H = Symbol.for("react.profiler"),
		j = Symbol.for("react.provider"),
		nt = Symbol.for("react.consumer"),
		X = Symbol.for("react.context"),
		J = Symbol.for("react.forward_ref"),
		G = Symbol.for("react.suspense"),
		at = Symbol.for("react.suspense_list"),
		et = Symbol.for("react.memo"),
		lt = Symbol.for("react.lazy"),
		ht = Symbol.for("react.activity"),
		Z = Symbol.for("react.memo_cache_sentinel"),
		it = Symbol.iterator;
	function vt(t) {
		return t === null || typeof t != "object"
			? null
			: ((t = (it && t[it]) || t["@@iterator"]),
				typeof t == "function" ? t : null);
	}
	var wt = Symbol.for("react.client.reference");
	function zt(t) {
		if (t == null) return null;
		if (typeof t == "function")
			return t.$$typeof === wt ? null : t.displayName || t.name || null;
		if (typeof t == "string") return t;
		switch (t) {
			case A:
				return "Fragment";
			case H:
				return "Profiler";
			case U:
				return "StrictMode";
			case G:
				return "Suspense";
			case at:
				return "SuspenseList";
			case ht:
				return "Activity";
		}
		if (typeof t == "object")
			switch (t.$$typeof) {
				case M:
					return "Portal";
				case X:
					return (t.displayName || "Context") + ".Provider";
				case nt:
					return (t._context.displayName || "Context") + ".Consumer";
				case J: {
					var e = t.render;
					return (
						(t = t.displayName),
						t ||
							((t = e.displayName || e.name || ""),
							(t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
						t
					);
				}
				case et:
					return (
						(e = t.displayName || null), e !== null ? e : zt(t.type) || "Memo"
					);
				case lt:
					(e = t._payload), (t = t._init);
					try {
						return zt(t(e));
					} catch {}
			}
		return null;
	}
	var Lt = Array.isArray,
		C = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
		Y = c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
		P = { pending: !1, data: null, method: null, action: null },
		St = [],
		R = -1;
	function q(t) {
		return { current: t };
	}
	function V(t) {
		0 > R || ((t.current = St[R]), (St[R] = null), R--);
	}
	function w(t, e) {
		R++, (St[R] = t.current), (t.current = e);
	}
	var $ = q(null),
		st = q(null),
		W = q(null),
		Zt = q(null);
	function gt(t, e) {
		switch ((w(W, e), w(st, t), w($, null), e.nodeType)) {
			case 9:
			case 11:
				t = (t = e.documentElement) && (t = t.namespaceURI) ? th(t) : 0;
				break;
			default:
				if (((t = e.tagName), (e = e.namespaceURI)))
					(e = th(e)), (t = eh(e, t));
				else
					switch (t) {
						case "svg":
							t = 1;
							break;
						case "math":
							t = 2;
							break;
						default:
							t = 0;
					}
		}
		V($), w($, t);
	}
	function me() {
		V($), V(st), V(W);
	}
	function Ll(t) {
		t.memoizedState !== null && w(Zt, t);
		var e = $.current,
			l = eh(e, t.type);
		e !== l && (w(st, t), w($, l));
	}
	function ye(t) {
		st.current === t && (V($), V(st)),
			Zt.current === t && (V(Zt), ($n._currentValue = P));
	}
	var Ia = Object.prototype.hasOwnProperty,
		tn = i.unstable_scheduleCallback,
		na = i.unstable_cancelCallback,
		wi = i.unstable_shouldYield,
		Gi = i.unstable_requestPaint,
		ge = i.unstable_now,
		ua = i.unstable_getCurrentPriorityLevel,
		Nl = i.unstable_ImmediatePriority,
		en = i.unstable_UserBlockingPriority,
		Bl = i.unstable_NormalPriority,
		Ot = i.unstable_LowPriority,
		Kt = i.unstable_IdlePriority,
		Ne = i.log,
		Bs = i.unstable_setDisableYieldValue,
		ln = null,
		ie = null;
	function il(t) {
		if (
			(typeof Ne == "function" && Bs(t),
			ie && typeof ie.setStrictMode == "function")
		)
			try {
				ie.setStrictMode(ln, t);
			} catch {}
	}
	var ce = Math.clz32 ? Math.clz32 : Av,
		Tv = Math.log,
		Mv = Math.LN2;
	function Av(t) {
		return (t >>>= 0), t === 0 ? 32 : (31 - ((Tv(t) / Mv) | 0)) | 0;
	}
	var du = 256,
		hu = 4194304;
	function Hl(t) {
		var e = t & 42;
		if (e !== 0) return e;
		switch (t & -t) {
			case 1:
				return 1;
			case 2:
				return 2;
			case 4:
				return 4;
			case 8:
				return 8;
			case 16:
				return 16;
			case 32:
				return 32;
			case 64:
				return 64;
			case 128:
				return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
				return t & 4194048;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				return t & 62914560;
			case 67108864:
				return 67108864;
			case 134217728:
				return 134217728;
			case 268435456:
				return 268435456;
			case 536870912:
				return 536870912;
			case 1073741824:
				return 0;
			default:
				return t;
		}
	}
	function vu(t, e, l) {
		var a = t.pendingLanes;
		if (a === 0) return 0;
		var n = 0,
			u = t.suspendedLanes,
			r = t.pingedLanes;
		t = t.warmLanes;
		var h = a & 134217727;
		return (
			h !== 0
				? ((a = h & ~u),
					a !== 0
						? (n = Hl(a))
						: ((r &= h),
							r !== 0
								? (n = Hl(r))
								: l || ((l = h & ~t), l !== 0 && (n = Hl(l)))))
				: ((h = a & ~u),
					h !== 0
						? (n = Hl(h))
						: r !== 0
							? (n = Hl(r))
							: l || ((l = a & ~t), l !== 0 && (n = Hl(l)))),
			n === 0
				? 0
				: e !== 0 &&
						e !== n &&
						(e & u) === 0 &&
						((u = n & -n),
						(l = e & -e),
						u >= l || (u === 32 && (l & 4194048) !== 0))
					? e
					: n
		);
	}
	function an(t, e) {
		return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
	}
	function Ov(t, e) {
		switch (t) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64:
				return e + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
				return e + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824:
				return -1;
			default:
				return -1;
		}
	}
	function Hs() {
		var t = du;
		return (du <<= 1), (du & 4194048) === 0 && (du = 256), t;
	}
	function qs() {
		var t = hu;
		return (hu <<= 1), (hu & 62914560) === 0 && (hu = 4194304), t;
	}
	function Vi(t) {
		for (var e = [], l = 0; 31 > l; l++) e.push(t);
		return e;
	}
	function nn(t, e) {
		(t.pendingLanes |= e),
			e !== 268435456 &&
				((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0));
	}
	function xv(t, e, l, a, n, u) {
		var r = t.pendingLanes;
		(t.pendingLanes = l),
			(t.suspendedLanes = 0),
			(t.pingedLanes = 0),
			(t.warmLanes = 0),
			(t.expiredLanes &= l),
			(t.entangledLanes &= l),
			(t.errorRecoveryDisabledLanes &= l),
			(t.shellSuspendCounter = 0);
		var h = t.entanglements,
			S = t.expirationTimes,
			x = t.hiddenUpdates;
		for (l = r & ~l; 0 < l; ) {
			var L = 31 - ce(l),
				B = 1 << L;
			(h[L] = 0), (S[L] = -1);
			var z = x[L];
			if (z !== null)
				for (x[L] = null, L = 0; L < z.length; L++) {
					var D = z[L];
					D !== null && (D.lane &= -536870913);
				}
			l &= ~B;
		}
		a !== 0 && js(t, a, 0),
			u !== 0 && n === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(r & ~e));
	}
	function js(t, e, l) {
		(t.pendingLanes |= e), (t.suspendedLanes &= ~e);
		var a = 31 - ce(e);
		(t.entangledLanes |= e),
			(t.entanglements[a] = t.entanglements[a] | 1073741824 | (l & 4194090));
	}
	function Ys(t, e) {
		var l = (t.entangledLanes |= e);
		for (t = t.entanglements; l; ) {
			var a = 31 - ce(l),
				n = 1 << a;
			(n & e) | (t[a] & e) && (t[a] |= e), (l &= ~n);
		}
	}
	function Xi(t) {
		switch (t) {
			case 2:
				t = 1;
				break;
			case 8:
				t = 4;
				break;
			case 32:
				t = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				t = 128;
				break;
			case 268435456:
				t = 134217728;
				break;
			default:
				t = 0;
		}
		return t;
	}
	function Qi(t) {
		return (
			(t &= -t),
			2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
		);
	}
	function ws() {
		var t = Y.p;
		return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : _h(t.type));
	}
	function zv(t, e) {
		var l = Y.p;
		try {
			return (Y.p = t), e();
		} finally {
			Y.p = l;
		}
	}
	var cl = Math.random().toString(36).slice(2),
		Pt = "__reactFiber$" + cl,
		te = "__reactProps$" + cl,
		ia = "__reactContainer$" + cl,
		Zi = "__reactEvents$" + cl,
		Dv = "__reactListeners$" + cl,
		Cv = "__reactHandles$" + cl,
		Gs = "__reactResources$" + cl,
		un = "__reactMarker$" + cl;
	function Ki(t) {
		delete t[Pt], delete t[te], delete t[Zi], delete t[Dv], delete t[Cv];
	}
	function ca(t) {
		var e = t[Pt];
		if (e) return e;
		for (var l = t.parentNode; l; ) {
			if ((e = l[ia] || l[Pt])) {
				if (
					((l = e.alternate),
					e.child !== null || (l !== null && l.child !== null))
				)
					for (t = uh(t); t !== null; ) {
						if ((l = t[Pt])) return l;
						t = uh(t);
					}
				return e;
			}
			(t = l), (l = t.parentNode);
		}
		return null;
	}
	function oa(t) {
		if ((t = t[Pt] || t[ia])) {
			var e = t.tag;
			if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3)
				return t;
		}
		return null;
	}
	function cn(t) {
		var e = t.tag;
		if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
		throw Error(o(33));
	}
	function sa(t) {
		var e = t[Gs];
		return (
			e ||
				(e = t[Gs] =
					{ hoistableStyles: new Map(), hoistableScripts: new Map() }),
			e
		);
	}
	function Gt(t) {
		t[un] = !0;
	}
	var Vs = new Set(),
		Xs = {};
	function ql(t, e) {
		ra(t, e), ra(t + "Capture", e);
	}
	function ra(t, e) {
		for (Xs[t] = e, t = 0; t < e.length; t++) Vs.add(e[t]);
	}
	var Uv =
			/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
		Qs = {},
		Zs = {};
	function Lv(t) {
		return Ia.call(Zs, t)
			? !0
			: Ia.call(Qs, t)
				? !1
				: Uv.test(t)
					? (Zs[t] = !0)
					: ((Qs[t] = !0), !1);
	}
	function mu(t, e, l) {
		if (Lv(e))
			if (l === null) t.removeAttribute(e);
			else {
				switch (typeof l) {
					case "undefined":
					case "function":
					case "symbol":
						t.removeAttribute(e);
						return;
					case "boolean": {
						var a = e.toLowerCase().slice(0, 5);
						if (a !== "data-" && a !== "aria-") {
							t.removeAttribute(e);
							return;
						}
					}
				}
				t.setAttribute(e, "" + l);
			}
	}
	function yu(t, e, l) {
		if (l === null) t.removeAttribute(e);
		else {
			switch (typeof l) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					t.removeAttribute(e);
					return;
			}
			t.setAttribute(e, "" + l);
		}
	}
	function Ve(t, e, l, a) {
		if (a === null) t.removeAttribute(l);
		else {
			switch (typeof a) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					t.removeAttribute(l);
					return;
			}
			t.setAttributeNS(e, l, "" + a);
		}
	}
	var Ji, Ks;
	function fa(t) {
		if (Ji === void 0)
			try {
				throw Error();
			} catch (l) {
				var e = l.stack.trim().match(/\n( *(at )?)/);
				(Ji = (e && e[1]) || ""),
					(Ks =
						-1 <
						l.stack.indexOf(`
    at`)
							? " (<anonymous>)"
							: -1 < l.stack.indexOf("@")
								? "@unknown:0:0"
								: "");
			}
		return (
			`
` +
			Ji +
			t +
			Ks
		);
	}
	var ki = !1;
	function $i(t, e) {
		if (!t || ki) return "";
		ki = !0;
		var l = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var a = {
				DetermineComponentFrameRoot: () => {
					try {
						if (e) {
							var B = () => {
								throw Error();
							};
							if (
								(Object.defineProperty(B.prototype, "props", {
									set: () => {
										throw Error();
									},
								}),
								typeof Reflect == "object" && Reflect.construct)
							) {
								try {
									Reflect.construct(B, []);
								} catch (D) {
									var z = D;
								}
								Reflect.construct(t, [], B);
							} else {
								try {
									B.call();
								} catch (D) {
									z = D;
								}
								t.call(B.prototype);
							}
						} else {
							try {
								throw Error();
							} catch (D) {
								z = D;
							}
							(B = t()) && typeof B.catch == "function" && B.catch(() => {});
						}
					} catch (D) {
						if (D && z && typeof D.stack == "string") return [D.stack, z.stack];
					}
					return [null, null];
				},
			};
			a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var n = Object.getOwnPropertyDescriptor(
				a.DetermineComponentFrameRoot,
				"name",
			);
			n &&
				n.configurable &&
				Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
					value: "DetermineComponentFrameRoot",
				});
			var u = a.DetermineComponentFrameRoot(),
				r = u[0],
				h = u[1];
			if (r && h) {
				var S = r.split(`
`),
					x = h.split(`
`);
				for (
					n = a = 0;
					a < S.length && !S[a].includes("DetermineComponentFrameRoot");
				)
					a++;
				for (; n < x.length && !x[n].includes("DetermineComponentFrameRoot"); )
					n++;
				if (a === S.length || n === x.length)
					for (
						a = S.length - 1, n = x.length - 1;
						1 <= a && 0 <= n && S[a] !== x[n];
					)
						n--;
				for (; 1 <= a && 0 <= n; a--, n--)
					if (S[a] !== x[n]) {
						if (a !== 1 || n !== 1)
							do
								if ((a--, n--, 0 > n || S[a] !== x[n])) {
									var L =
										`
` + S[a].replace(" at new ", " at ");
									return (
										t.displayName &&
											L.includes("<anonymous>") &&
											(L = L.replace("<anonymous>", t.displayName)),
										L
									);
								}
							while (1 <= a && 0 <= n);
						break;
					}
			}
		} finally {
			(ki = !1), (Error.prepareStackTrace = l);
		}
		return (l = t ? t.displayName || t.name : "") ? fa(l) : "";
	}
	function Nv(t) {
		switch (t.tag) {
			case 26:
			case 27:
			case 5:
				return fa(t.type);
			case 16:
				return fa("Lazy");
			case 13:
				return fa("Suspense");
			case 19:
				return fa("SuspenseList");
			case 0:
			case 15:
				return $i(t.type, !1);
			case 11:
				return $i(t.type.render, !1);
			case 1:
				return $i(t.type, !0);
			case 31:
				return fa("Activity");
			default:
				return "";
		}
	}
	function Js(t) {
		try {
			var e = "";
			do (e += Nv(t)), (t = t.return);
			while (t);
			return e;
		} catch (l) {
			return (
				`
Error generating stack: ` +
				l.message +
				`
` +
				l.stack
			);
		}
	}
	function pe(t) {
		switch (typeof t) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined":
				return t;
			case "object":
				return t;
			default:
				return "";
		}
	}
	function ks(t) {
		var e = t.type;
		return (
			(t = t.nodeName) &&
			t.toLowerCase() === "input" &&
			(e === "checkbox" || e === "radio")
		);
	}
	function Bv(t) {
		var e = ks(t) ? "checked" : "value",
			l = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
			a = "" + t[e];
		if (
			!Object.hasOwn(t, e) &&
			typeof l < "u" &&
			typeof l.get == "function" &&
			typeof l.set == "function"
		) {
			var n = l.get,
				u = l.set;
			return (
				Object.defineProperty(t, e, {
					configurable: !0,
					get: function () {
						return n.call(this);
					},
					set: function (r) {
						(a = "" + r), u.call(this, r);
					},
				}),
				Object.defineProperty(t, e, { enumerable: l.enumerable }),
				{
					getValue: () => a,
					setValue: (r) => {
						a = "" + r;
					},
					stopTracking: () => {
						(t._valueTracker = null), delete t[e];
					},
				}
			);
		}
	}
	function gu(t) {
		t._valueTracker || (t._valueTracker = Bv(t));
	}
	function $s(t) {
		if (!t) return !1;
		var e = t._valueTracker;
		if (!e) return !0;
		var l = e.getValue(),
			a = "";
		return (
			t && (a = ks(t) ? (t.checked ? "true" : "false") : t.value),
			(t = a),
			t !== l ? (e.setValue(t), !0) : !1
		);
	}
	function pu(t) {
		if (
			((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")
		)
			return null;
		try {
			return t.activeElement || t.body;
		} catch {
			return t.body;
		}
	}
	var Hv = /[\n"\\]/g;
	function Se(t) {
		return t.replace(Hv, (e) => "\\" + e.charCodeAt(0).toString(16) + " ");
	}
	function Pi(t, e, l, a, n, u, r, h) {
		(t.name = ""),
			r != null &&
			typeof r != "function" &&
			typeof r != "symbol" &&
			typeof r != "boolean"
				? (t.type = r)
				: t.removeAttribute("type"),
			e != null
				? r === "number"
					? ((e === 0 && t.value === "") || t.value != e) &&
						(t.value = "" + pe(e))
					: t.value !== "" + pe(e) && (t.value = "" + pe(e))
				: (r !== "submit" && r !== "reset") || t.removeAttribute("value"),
			e != null
				? Wi(t, r, pe(e))
				: l != null
					? Wi(t, r, pe(l))
					: a != null && t.removeAttribute("value"),
			n == null && u != null && (t.defaultChecked = !!u),
			n != null &&
				(t.checked = n && typeof n != "function" && typeof n != "symbol"),
			h != null &&
			typeof h != "function" &&
			typeof h != "symbol" &&
			typeof h != "boolean"
				? (t.name = "" + pe(h))
				: t.removeAttribute("name");
	}
	function Ps(t, e, l, a, n, u, r, h) {
		if (
			(u != null &&
				typeof u != "function" &&
				typeof u != "symbol" &&
				typeof u != "boolean" &&
				(t.type = u),
			e != null || l != null)
		) {
			if (!((u !== "submit" && u !== "reset") || e != null)) return;
			(l = l != null ? "" + pe(l) : ""),
				(e = e != null ? "" + pe(e) : l),
				h || e === t.value || (t.value = e),
				(t.defaultValue = e);
		}
		(a = a ?? n),
			(a = typeof a != "function" && typeof a != "symbol" && !!a),
			(t.checked = h ? t.checked : !!a),
			(t.defaultChecked = !!a),
			r != null &&
				typeof r != "function" &&
				typeof r != "symbol" &&
				typeof r != "boolean" &&
				(t.name = r);
	}
	function Wi(t, e, l) {
		(e === "number" && pu(t.ownerDocument) === t) ||
			t.defaultValue === "" + l ||
			(t.defaultValue = "" + l);
	}
	function da(t, e, l, a) {
		if (((t = t.options), e)) {
			e = {};
			for (var n = 0; n < l.length; n++) e["$" + l[n]] = !0;
			for (l = 0; l < t.length; l++)
				(n = Object.hasOwn(e, "$" + t[l].value)),
					t[l].selected !== n && (t[l].selected = n),
					n && a && (t[l].defaultSelected = !0);
		} else {
			for (l = "" + pe(l), e = null, n = 0; n < t.length; n++) {
				if (t[n].value === l) {
					(t[n].selected = !0), a && (t[n].defaultSelected = !0);
					return;
				}
				e !== null || t[n].disabled || (e = t[n]);
			}
			e !== null && (e.selected = !0);
		}
	}
	function Ws(t, e, l) {
		if (
			e != null &&
			((e = "" + pe(e)), e !== t.value && (t.value = e), l == null)
		) {
			t.defaultValue !== e && (t.defaultValue = e);
			return;
		}
		t.defaultValue = l != null ? "" + pe(l) : "";
	}
	function Fs(t, e, l, a) {
		if (e == null) {
			if (a != null) {
				if (l != null) throw Error(o(92));
				if (Lt(a)) {
					if (1 < a.length) throw Error(o(93));
					a = a[0];
				}
				l = a;
			}
			l == null && (l = ""), (e = l);
		}
		(l = pe(e)),
			(t.defaultValue = l),
			(a = t.textContent),
			a === l && a !== "" && a !== null && (t.value = a);
	}
	function ha(t, e) {
		if (e) {
			var l = t.firstChild;
			if (l && l === t.lastChild && l.nodeType === 3) {
				l.nodeValue = e;
				return;
			}
		}
		t.textContent = e;
	}
	var qv = new Set(
		"animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
			" ",
		),
	);
	function Is(t, e, l) {
		var a = e.indexOf("--") === 0;
		l == null || typeof l == "boolean" || l === ""
			? a
				? t.setProperty(e, "")
				: e === "float"
					? (t.cssFloat = "")
					: (t[e] = "")
			: a
				? t.setProperty(e, l)
				: typeof l != "number" || l === 0 || qv.has(e)
					? e === "float"
						? (t.cssFloat = l)
						: (t[e] = ("" + l).trim())
					: (t[e] = l + "px");
	}
	function tr(t, e, l) {
		if (e != null && typeof e != "object") throw Error(o(62));
		if (((t = t.style), l != null)) {
			for (var a in l)
				!Object.hasOwn(l, a) ||
					(e != null && Object.hasOwn(e, a)) ||
					(a.indexOf("--") === 0
						? t.setProperty(a, "")
						: a === "float"
							? (t.cssFloat = "")
							: (t[a] = ""));
			for (var n in e)
				(a = e[n]), Object.hasOwn(e, n) && l[n] !== a && Is(t, n, a);
		} else for (var u in e) Object.hasOwn(e, u) && Is(t, u, e[u]);
	}
	function Fi(t) {
		if (t.indexOf("-") === -1) return !1;
		switch (t) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph":
				return !1;
			default:
				return !0;
		}
	}
	var jv = new Map([
			["acceptCharset", "accept-charset"],
			["htmlFor", "for"],
			["httpEquiv", "http-equiv"],
			["crossOrigin", "crossorigin"],
			["accentHeight", "accent-height"],
			["alignmentBaseline", "alignment-baseline"],
			["arabicForm", "arabic-form"],
			["baselineShift", "baseline-shift"],
			["capHeight", "cap-height"],
			["clipPath", "clip-path"],
			["clipRule", "clip-rule"],
			["colorInterpolation", "color-interpolation"],
			["colorInterpolationFilters", "color-interpolation-filters"],
			["colorProfile", "color-profile"],
			["colorRendering", "color-rendering"],
			["dominantBaseline", "dominant-baseline"],
			["enableBackground", "enable-background"],
			["fillOpacity", "fill-opacity"],
			["fillRule", "fill-rule"],
			["floodColor", "flood-color"],
			["floodOpacity", "flood-opacity"],
			["fontFamily", "font-family"],
			["fontSize", "font-size"],
			["fontSizeAdjust", "font-size-adjust"],
			["fontStretch", "font-stretch"],
			["fontStyle", "font-style"],
			["fontVariant", "font-variant"],
			["fontWeight", "font-weight"],
			["glyphName", "glyph-name"],
			["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
			["glyphOrientationVertical", "glyph-orientation-vertical"],
			["horizAdvX", "horiz-adv-x"],
			["horizOriginX", "horiz-origin-x"],
			["imageRendering", "image-rendering"],
			["letterSpacing", "letter-spacing"],
			["lightingColor", "lighting-color"],
			["markerEnd", "marker-end"],
			["markerMid", "marker-mid"],
			["markerStart", "marker-start"],
			["overlinePosition", "overline-position"],
			["overlineThickness", "overline-thickness"],
			["paintOrder", "paint-order"],
			["panose-1", "panose-1"],
			["pointerEvents", "pointer-events"],
			["renderingIntent", "rendering-intent"],
			["shapeRendering", "shape-rendering"],
			["stopColor", "stop-color"],
			["stopOpacity", "stop-opacity"],
			["strikethroughPosition", "strikethrough-position"],
			["strikethroughThickness", "strikethrough-thickness"],
			["strokeDasharray", "stroke-dasharray"],
			["strokeDashoffset", "stroke-dashoffset"],
			["strokeLinecap", "stroke-linecap"],
			["strokeLinejoin", "stroke-linejoin"],
			["strokeMiterlimit", "stroke-miterlimit"],
			["strokeOpacity", "stroke-opacity"],
			["strokeWidth", "stroke-width"],
			["textAnchor", "text-anchor"],
			["textDecoration", "text-decoration"],
			["textRendering", "text-rendering"],
			["transformOrigin", "transform-origin"],
			["underlinePosition", "underline-position"],
			["underlineThickness", "underline-thickness"],
			["unicodeBidi", "unicode-bidi"],
			["unicodeRange", "unicode-range"],
			["unitsPerEm", "units-per-em"],
			["vAlphabetic", "v-alphabetic"],
			["vHanging", "v-hanging"],
			["vIdeographic", "v-ideographic"],
			["vMathematical", "v-mathematical"],
			["vectorEffect", "vector-effect"],
			["vertAdvY", "vert-adv-y"],
			["vertOriginX", "vert-origin-x"],
			["vertOriginY", "vert-origin-y"],
			["wordSpacing", "word-spacing"],
			["writingMode", "writing-mode"],
			["xmlnsXlink", "xmlns:xlink"],
			["xHeight", "x-height"],
		]),
		Yv =
			/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Su(t) {
		return Yv.test("" + t)
			? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
			: t;
	}
	var Ii = null;
	function tc(t) {
		return (
			(t = t.target || t.srcElement || window),
			t.correspondingUseElement && (t = t.correspondingUseElement),
			t.nodeType === 3 ? t.parentNode : t
		);
	}
	var va = null,
		ma = null;
	function er(t) {
		var e = oa(t);
		if (e && (t = e.stateNode)) {
			var l = t[te] || null;
			switch (((t = e.stateNode), e.type)) {
				case "input":
					if (
						(Pi(
							t,
							l.value,
							l.defaultValue,
							l.defaultValue,
							l.checked,
							l.defaultChecked,
							l.type,
							l.name,
						),
						(e = l.name),
						l.type === "radio" && e != null)
					) {
						for (l = t; l.parentNode; ) l = l.parentNode;
						for (
							l = l.querySelectorAll(
								'input[name="' + Se("" + e) + '"][type="radio"]',
							),
								e = 0;
							e < l.length;
							e++
						) {
							var a = l[e];
							if (a !== t && a.form === t.form) {
								var n = a[te] || null;
								if (!n) throw Error(o(90));
								Pi(
									a,
									n.value,
									n.defaultValue,
									n.defaultValue,
									n.checked,
									n.defaultChecked,
									n.type,
									n.name,
								);
							}
						}
						for (e = 0; e < l.length; e++)
							(a = l[e]), a.form === t.form && $s(a);
					}
					break;
				case "textarea":
					Ws(t, l.value, l.defaultValue);
					break;
				case "select":
					(e = l.value), e != null && da(t, !!l.multiple, e, !1);
			}
		}
	}
	var ec = !1;
	function lr(t, e, l) {
		if (ec) return t(e, l);
		ec = !0;
		try {
			var a = t(e);
			return a;
		} finally {
			if (
				((ec = !1),
				(va !== null || ma !== null) &&
					(ni(), va && ((e = va), (t = ma), (ma = va = null), er(e), t)))
			)
				for (e = 0; e < t.length; e++) er(t[e]);
		}
	}
	function on(t, e) {
		var l = t.stateNode;
		if (l === null) return null;
		var a = l[te] || null;
		if (a === null) return null;
		l = a[e];
		switch (e) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(a = !a.disabled) ||
					((t = t.type),
					(a = !(
						t === "button" ||
						t === "input" ||
						t === "select" ||
						t === "textarea"
					))),
					(t = !a);
				break;
			default:
				t = !1;
		}
		if (t) return null;
		if (l && typeof l != "function") throw Error(o(231, e, typeof l));
		return l;
	}
	var Xe = !(
			typeof window > "u" ||
			typeof window.document > "u" ||
			typeof window.document.createElement > "u"
		),
		lc = !1;
	if (Xe)
		try {
			var sn = {};
			Object.defineProperty(sn, "passive", {
				get: () => {
					lc = !0;
				},
			}),
				window.addEventListener("test", sn, sn),
				window.removeEventListener("test", sn, sn);
		} catch {
			lc = !1;
		}
	var ol = null,
		ac = null,
		_u = null;
	function ar() {
		if (_u) return _u;
		var t,
			e = ac,
			l = e.length,
			a,
			n = "value" in ol ? ol.value : ol.textContent,
			u = n.length;
		for (t = 0; t < l && e[t] === n[t]; t++);
		var r = l - t;
		for (a = 1; a <= r && e[l - a] === n[u - a]; a++);
		return (_u = n.slice(t, 1 < a ? 1 - a : void 0));
	}
	function bu(t) {
		var e = t.keyCode;
		return (
			"charCode" in t
				? ((t = t.charCode), t === 0 && e === 13 && (t = 13))
				: (t = e),
			t === 10 && (t = 13),
			32 <= t || t === 13 ? t : 0
		);
	}
	function Ru() {
		return !0;
	}
	function nr() {
		return !1;
	}
	function ee(t) {
		function e(l, a, n, u, r) {
			(this._reactName = l),
				(this._targetInst = n),
				(this.type = a),
				(this.nativeEvent = u),
				(this.target = r),
				(this.currentTarget = null);
			for (var h in t)
				Object.hasOwn(t, h) && ((l = t[h]), (this[h] = l ? l(u) : u[h]));
			return (
				(this.isDefaultPrevented = (
					u.defaultPrevented != null
						? u.defaultPrevented
						: u.returnValue === !1
				)
					? Ru
					: nr),
				(this.isPropagationStopped = nr),
				this
			);
		}
		return (
			b(e.prototype, {
				preventDefault: function () {
					this.defaultPrevented = !0;
					var l = this.nativeEvent;
					l &&
						(l.preventDefault
							? l.preventDefault()
							: typeof l.returnValue != "unknown" && (l.returnValue = !1),
						(this.isDefaultPrevented = Ru));
				},
				stopPropagation: function () {
					var l = this.nativeEvent;
					l &&
						(l.stopPropagation
							? l.stopPropagation()
							: typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0),
						(this.isPropagationStopped = Ru));
				},
				persist: () => {},
				isPersistent: Ru,
			}),
			e
		);
	}
	var jl = {
			eventPhase: 0,
			bubbles: 0,
			cancelable: 0,
			timeStamp: (t) => t.timeStamp || Date.now(),
			defaultPrevented: 0,
			isTrusted: 0,
		},
		Eu = ee(jl),
		rn = b({}, jl, { view: 0, detail: 0 }),
		wv = ee(rn),
		nc,
		uc,
		fn,
		Tu = b({}, rn, {
			screenX: 0,
			screenY: 0,
			clientX: 0,
			clientY: 0,
			pageX: 0,
			pageY: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			getModifierState: cc,
			button: 0,
			buttons: 0,
			relatedTarget: (t) =>
				t.relatedTarget === void 0
					? t.fromElement === t.srcElement
						? t.toElement
						: t.fromElement
					: t.relatedTarget,
			movementX: (t) =>
				"movementX" in t
					? t.movementX
					: (t !== fn &&
							(fn && t.type === "mousemove"
								? ((nc = t.screenX - fn.screenX), (uc = t.screenY - fn.screenY))
								: (uc = nc = 0),
							(fn = t)),
						nc),
			movementY: (t) => ("movementY" in t ? t.movementY : uc),
		}),
		ur = ee(Tu),
		Gv = b({}, Tu, { dataTransfer: 0 }),
		Vv = ee(Gv),
		Xv = b({}, rn, { relatedTarget: 0 }),
		ic = ee(Xv),
		Qv = b({}, jl, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
		Zv = ee(Qv),
		Kv = b({}, jl, {
			clipboardData: (t) =>
				"clipboardData" in t ? t.clipboardData : window.clipboardData,
		}),
		Jv = ee(Kv),
		kv = b({}, jl, { data: 0 }),
		ir = ee(kv),
		$v = {
			Esc: "Escape",
			Spacebar: " ",
			Left: "ArrowLeft",
			Up: "ArrowUp",
			Right: "ArrowRight",
			Down: "ArrowDown",
			Del: "Delete",
			Win: "OS",
			Menu: "ContextMenu",
			Apps: "ContextMenu",
			Scroll: "ScrollLock",
			MozPrintableKey: "Unidentified",
		},
		Pv = {
			8: "Backspace",
			9: "Tab",
			12: "Clear",
			13: "Enter",
			16: "Shift",
			17: "Control",
			18: "Alt",
			19: "Pause",
			20: "CapsLock",
			27: "Escape",
			32: " ",
			33: "PageUp",
			34: "PageDown",
			35: "End",
			36: "Home",
			37: "ArrowLeft",
			38: "ArrowUp",
			39: "ArrowRight",
			40: "ArrowDown",
			45: "Insert",
			46: "Delete",
			112: "F1",
			113: "F2",
			114: "F3",
			115: "F4",
			116: "F5",
			117: "F6",
			118: "F7",
			119: "F8",
			120: "F9",
			121: "F10",
			122: "F11",
			123: "F12",
			144: "NumLock",
			145: "ScrollLock",
			224: "Meta",
		},
		Wv = {
			Alt: "altKey",
			Control: "ctrlKey",
			Meta: "metaKey",
			Shift: "shiftKey",
		};
	function Fv(t) {
		var e = this.nativeEvent;
		return e.getModifierState
			? e.getModifierState(t)
			: (t = Wv[t])
				? !!e[t]
				: !1;
	}
	function cc() {
		return Fv;
	}
	var Iv = b({}, rn, {
			key: (t) => {
				if (t.key) {
					var e = $v[t.key] || t.key;
					if (e !== "Unidentified") return e;
				}
				return t.type === "keypress"
					? ((t = bu(t)), t === 13 ? "Enter" : String.fromCharCode(t))
					: t.type === "keydown" || t.type === "keyup"
						? Pv[t.keyCode] || "Unidentified"
						: "";
			},
			code: 0,
			location: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			repeat: 0,
			locale: 0,
			getModifierState: cc,
			charCode: (t) => (t.type === "keypress" ? bu(t) : 0),
			keyCode: (t) =>
				t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0,
			which: (t) =>
				t.type === "keypress"
					? bu(t)
					: t.type === "keydown" || t.type === "keyup"
						? t.keyCode
						: 0,
		}),
		tm = ee(Iv),
		em = b({}, Tu, {
			pointerId: 0,
			width: 0,
			height: 0,
			pressure: 0,
			tangentialPressure: 0,
			tiltX: 0,
			tiltY: 0,
			twist: 0,
			pointerType: 0,
			isPrimary: 0,
		}),
		cr = ee(em),
		lm = b({}, rn, {
			touches: 0,
			targetTouches: 0,
			changedTouches: 0,
			altKey: 0,
			metaKey: 0,
			ctrlKey: 0,
			shiftKey: 0,
			getModifierState: cc,
		}),
		am = ee(lm),
		nm = b({}, jl, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
		um = ee(nm),
		im = b({}, Tu, {
			deltaX: (t) =>
				"deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0,
			deltaY: (t) =>
				"deltaY" in t
					? t.deltaY
					: "wheelDeltaY" in t
						? -t.wheelDeltaY
						: "wheelDelta" in t
							? -t.wheelDelta
							: 0,
			deltaZ: 0,
			deltaMode: 0,
		}),
		cm = ee(im),
		om = b({}, jl, { newState: 0, oldState: 0 }),
		sm = ee(om),
		rm = [9, 13, 27, 32],
		oc = Xe && "CompositionEvent" in window,
		dn = null;
	Xe && "documentMode" in document && (dn = document.documentMode);
	var fm = Xe && "TextEvent" in window && !dn,
		or = Xe && (!oc || (dn && 8 < dn && 11 >= dn)),
		sr = " ",
		rr = !1;
	function fr(t, e) {
		switch (t) {
			case "keyup":
				return rm.indexOf(e.keyCode) !== -1;
			case "keydown":
				return e.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout":
				return !0;
			default:
				return !1;
		}
	}
	function dr(t) {
		return (t = t.detail), typeof t == "object" && "data" in t ? t.data : null;
	}
	var ya = !1;
	function dm(t, e) {
		switch (t) {
			case "compositionend":
				return dr(e);
			case "keypress":
				return e.which !== 32 ? null : ((rr = !0), sr);
			case "textInput":
				return (t = e.data), t === sr && rr ? null : t;
			default:
				return null;
		}
	}
	function hm(t, e) {
		if (ya)
			return t === "compositionend" || (!oc && fr(t, e))
				? ((t = ar()), (_u = ac = ol = null), (ya = !1), t)
				: null;
		switch (t) {
			case "paste":
				return null;
			case "keypress":
				if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
					if (e.char && 1 < e.char.length) return e.char;
					if (e.which) return String.fromCharCode(e.which);
				}
				return null;
			case "compositionend":
				return or && e.locale !== "ko" ? null : e.data;
			default:
				return null;
		}
	}
	var vm = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0,
	};
	function hr(t) {
		var e = t && t.nodeName && t.nodeName.toLowerCase();
		return e === "input" ? !!vm[t.type] : e === "textarea";
	}
	function vr(t, e, l, a) {
		va ? (ma ? ma.push(a) : (ma = [a])) : (va = a),
			(e = ri(e, "onChange")),
			0 < e.length &&
				((l = new Eu("onChange", "change", null, l, a)),
				t.push({ event: l, listeners: e }));
	}
	var hn = null,
		vn = null;
	function mm(t) {
		$d(t, 0);
	}
	function Mu(t) {
		var e = cn(t);
		if ($s(e)) return t;
	}
	function mr(t, e) {
		if (t === "change") return e;
	}
	var yr = !1;
	if (Xe) {
		var sc;
		if (Xe) {
			var rc = "oninput" in document;
			if (!rc) {
				var gr = document.createElement("div");
				gr.setAttribute("oninput", "return;"),
					(rc = typeof gr.oninput == "function");
			}
			sc = rc;
		} else sc = !1;
		yr = sc && (!document.documentMode || 9 < document.documentMode);
	}
	function pr() {
		hn && (hn.detachEvent("onpropertychange", Sr), (vn = hn = null));
	}
	function Sr(t) {
		if (t.propertyName === "value" && Mu(vn)) {
			var e = [];
			vr(e, vn, t, tc(t)), lr(mm, e);
		}
	}
	function ym(t, e, l) {
		t === "focusin"
			? (pr(), (hn = e), (vn = l), hn.attachEvent("onpropertychange", Sr))
			: t === "focusout" && pr();
	}
	function gm(t) {
		if (t === "selectionchange" || t === "keyup" || t === "keydown")
			return Mu(vn);
	}
	function pm(t, e) {
		if (t === "click") return Mu(e);
	}
	function Sm(t, e) {
		if (t === "input" || t === "change") return Mu(e);
	}
	function _m(t, e) {
		return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
	}
	var oe = typeof Object.is == "function" ? Object.is : _m;
	function mn(t, e) {
		if (oe(t, e)) return !0;
		if (
			typeof t != "object" ||
			t === null ||
			typeof e != "object" ||
			e === null
		)
			return !1;
		var l = Object.keys(t),
			a = Object.keys(e);
		if (l.length !== a.length) return !1;
		for (a = 0; a < l.length; a++) {
			var n = l[a];
			if (!Ia.call(e, n) || !oe(t[n], e[n])) return !1;
		}
		return !0;
	}
	function _r(t) {
		for (; t && t.firstChild; ) t = t.firstChild;
		return t;
	}
	function br(t, e) {
		var l = _r(t);
		t = 0;
		for (var a; l; ) {
			if (l.nodeType === 3) {
				if (((a = t + l.textContent.length), t <= e && a >= e))
					return { node: l, offset: e - t };
				t = a;
			}
			t: {
				for (; l; ) {
					if (l.nextSibling) {
						l = l.nextSibling;
						break t;
					}
					l = l.parentNode;
				}
				l = void 0;
			}
			l = _r(l);
		}
	}
	function Rr(t, e) {
		return t && e
			? t === e
				? !0
				: t && t.nodeType === 3
					? !1
					: e && e.nodeType === 3
						? Rr(t, e.parentNode)
						: "contains" in t
							? t.contains(e)
							: t.compareDocumentPosition
								? !!(t.compareDocumentPosition(e) & 16)
								: !1
			: !1;
	}
	function Er(t) {
		t =
			t != null &&
			t.ownerDocument != null &&
			t.ownerDocument.defaultView != null
				? t.ownerDocument.defaultView
				: window;
		for (var e = pu(t.document); e instanceof t.HTMLIFrameElement; ) {
			try {
				var l = typeof e.contentWindow.location.href == "string";
			} catch {
				l = !1;
			}
			if (l) t = e.contentWindow;
			else break;
			e = pu(t.document);
		}
		return e;
	}
	function fc(t) {
		var e = t && t.nodeName && t.nodeName.toLowerCase();
		return (
			e &&
			((e === "input" &&
				(t.type === "text" ||
					t.type === "search" ||
					t.type === "tel" ||
					t.type === "url" ||
					t.type === "password")) ||
				e === "textarea" ||
				t.contentEditable === "true")
		);
	}
	var bm = Xe && "documentMode" in document && 11 >= document.documentMode,
		ga = null,
		dc = null,
		yn = null,
		hc = !1;
	function Tr(t, e, l) {
		var a =
			l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
		hc ||
			ga == null ||
			ga !== pu(a) ||
			((a = ga),
			"selectionStart" in a && fc(a)
				? (a = { start: a.selectionStart, end: a.selectionEnd })
				: ((a = (
						(a.ownerDocument && a.ownerDocument.defaultView) ||
						window
					).getSelection()),
					(a = {
						anchorNode: a.anchorNode,
						anchorOffset: a.anchorOffset,
						focusNode: a.focusNode,
						focusOffset: a.focusOffset,
					})),
			(yn && mn(yn, a)) ||
				((yn = a),
				(a = ri(dc, "onSelect")),
				0 < a.length &&
					((e = new Eu("onSelect", "select", null, e, l)),
					t.push({ event: e, listeners: a }),
					(e.target = ga))));
	}
	function Yl(t, e) {
		var l = {};
		return (
			(l[t.toLowerCase()] = e.toLowerCase()),
			(l["Webkit" + t] = "webkit" + e),
			(l["Moz" + t] = "moz" + e),
			l
		);
	}
	var pa = {
			animationend: Yl("Animation", "AnimationEnd"),
			animationiteration: Yl("Animation", "AnimationIteration"),
			animationstart: Yl("Animation", "AnimationStart"),
			transitionrun: Yl("Transition", "TransitionRun"),
			transitionstart: Yl("Transition", "TransitionStart"),
			transitioncancel: Yl("Transition", "TransitionCancel"),
			transitionend: Yl("Transition", "TransitionEnd"),
		},
		vc = {},
		Mr = {};
	Xe &&
		((Mr = document.createElement("div").style),
		"AnimationEvent" in window ||
			(delete pa.animationend.animation,
			delete pa.animationiteration.animation,
			delete pa.animationstart.animation),
		"TransitionEvent" in window || delete pa.transitionend.transition);
	function wl(t) {
		if (vc[t]) return vc[t];
		if (!pa[t]) return t;
		var e = pa[t],
			l;
		for (l in e) if (Object.hasOwn(e, l) && l in Mr) return (vc[t] = e[l]);
		return t;
	}
	var Ar = wl("animationend"),
		Or = wl("animationiteration"),
		xr = wl("animationstart"),
		Rm = wl("transitionrun"),
		Em = wl("transitionstart"),
		Tm = wl("transitioncancel"),
		zr = wl("transitionend"),
		Dr = new Map(),
		mc =
			"abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
				" ",
			);
	mc.push("scrollEnd");
	function Ce(t, e) {
		Dr.set(t, e), ql(e, [t]);
	}
	var Cr = new WeakMap();
	function _e(t, e) {
		if (typeof t == "object" && t !== null) {
			var l = Cr.get(t);
			return l !== void 0
				? l
				: ((e = { value: t, source: e, stack: Js(e) }), Cr.set(t, e), e);
		}
		return { value: t, source: e, stack: Js(e) };
	}
	var be = [],
		Sa = 0,
		yc = 0;
	function Au() {
		for (var t = Sa, e = (yc = Sa = 0); e < t; ) {
			var l = be[e];
			be[e++] = null;
			var a = be[e];
			be[e++] = null;
			var n = be[e];
			be[e++] = null;
			var u = be[e];
			if (((be[e++] = null), a !== null && n !== null)) {
				var r = a.pending;
				r === null ? (n.next = n) : ((n.next = r.next), (r.next = n)),
					(a.pending = n);
			}
			u !== 0 && Ur(l, n, u);
		}
	}
	function Ou(t, e, l, a) {
		(be[Sa++] = t),
			(be[Sa++] = e),
			(be[Sa++] = l),
			(be[Sa++] = a),
			(yc |= a),
			(t.lanes |= a),
			(t = t.alternate),
			t !== null && (t.lanes |= a);
	}
	function gc(t, e, l, a) {
		return Ou(t, e, l, a), xu(t);
	}
	function _a(t, e) {
		return Ou(t, null, null, e), xu(t);
	}
	function Ur(t, e, l) {
		t.lanes |= l;
		var a = t.alternate;
		a !== null && (a.lanes |= l);
		for (var n = !1, u = t.return; u !== null; )
			(u.childLanes |= l),
				(a = u.alternate),
				a !== null && (a.childLanes |= l),
				u.tag === 22 &&
					((t = u.stateNode), t === null || t._visibility & 1 || (n = !0)),
				(t = u),
				(u = u.return);
		return t.tag === 3
			? ((u = t.stateNode),
				n &&
					e !== null &&
					((n = 31 - ce(l)),
					(t = u.hiddenUpdates),
					(a = t[n]),
					a === null ? (t[n] = [e]) : a.push(e),
					(e.lane = l | 536870912)),
				u)
			: null;
	}
	function xu(t) {
		if (50 < Gn) throw ((Gn = 0), (To = null), Error(o(185)));
		for (var e = t.return; e !== null; ) (t = e), (e = t.return);
		return t.tag === 3 ? t.stateNode : null;
	}
	var ba = {};
	function Mm(t, e, l, a) {
		(this.tag = t),
			(this.key = l),
			(this.sibling =
				this.child =
				this.return =
				this.stateNode =
				this.type =
				this.elementType =
					null),
			(this.index = 0),
			(this.refCleanup = this.ref = null),
			(this.pendingProps = e),
			(this.dependencies =
				this.memoizedState =
				this.updateQueue =
				this.memoizedProps =
					null),
			(this.mode = a),
			(this.subtreeFlags = this.flags = 0),
			(this.deletions = null),
			(this.childLanes = this.lanes = 0),
			(this.alternate = null);
	}
	function se(t, e, l, a) {
		return new Mm(t, e, l, a);
	}
	function pc(t) {
		return (t = t.prototype), !(!t || !t.isReactComponent);
	}
	function Qe(t, e) {
		var l = t.alternate;
		return (
			l === null
				? ((l = se(t.tag, e, t.key, t.mode)),
					(l.elementType = t.elementType),
					(l.type = t.type),
					(l.stateNode = t.stateNode),
					(l.alternate = t),
					(t.alternate = l))
				: ((l.pendingProps = e),
					(l.type = t.type),
					(l.flags = 0),
					(l.subtreeFlags = 0),
					(l.deletions = null)),
			(l.flags = t.flags & 65011712),
			(l.childLanes = t.childLanes),
			(l.lanes = t.lanes),
			(l.child = t.child),
			(l.memoizedProps = t.memoizedProps),
			(l.memoizedState = t.memoizedState),
			(l.updateQueue = t.updateQueue),
			(e = t.dependencies),
			(l.dependencies =
				e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
			(l.sibling = t.sibling),
			(l.index = t.index),
			(l.ref = t.ref),
			(l.refCleanup = t.refCleanup),
			l
		);
	}
	function Lr(t, e) {
		t.flags &= 65011714;
		var l = t.alternate;
		return (
			l === null
				? ((t.childLanes = 0),
					(t.lanes = e),
					(t.child = null),
					(t.subtreeFlags = 0),
					(t.memoizedProps = null),
					(t.memoizedState = null),
					(t.updateQueue = null),
					(t.dependencies = null),
					(t.stateNode = null))
				: ((t.childLanes = l.childLanes),
					(t.lanes = l.lanes),
					(t.child = l.child),
					(t.subtreeFlags = 0),
					(t.deletions = null),
					(t.memoizedProps = l.memoizedProps),
					(t.memoizedState = l.memoizedState),
					(t.updateQueue = l.updateQueue),
					(t.type = l.type),
					(e = l.dependencies),
					(t.dependencies =
						e === null
							? null
							: { lanes: e.lanes, firstContext: e.firstContext })),
			t
		);
	}
	function zu(t, e, l, a, n, u) {
		var r = 0;
		if (((a = t), typeof t == "function")) pc(t) && (r = 1);
		else if (typeof t == "string")
			r = O0(t, l, $.current)
				? 26
				: t === "html" || t === "head" || t === "body"
					? 27
					: 5;
		else
			t: switch (t) {
				case ht:
					return (t = se(31, l, e, n)), (t.elementType = ht), (t.lanes = u), t;
				case A:
					return Gl(l.children, n, u, e);
				case U:
					(r = 8), (n |= 24);
					break;
				case H:
					return (
						(t = se(12, l, e, n | 2)), (t.elementType = H), (t.lanes = u), t
					);
				case G:
					return (t = se(13, l, e, n)), (t.elementType = G), (t.lanes = u), t;
				case at:
					return (t = se(19, l, e, n)), (t.elementType = at), (t.lanes = u), t;
				default:
					if (typeof t == "object" && t !== null)
						switch (t.$$typeof) {
							case j:
							case X:
								r = 10;
								break t;
							case nt:
								r = 9;
								break t;
							case J:
								r = 11;
								break t;
							case et:
								r = 14;
								break t;
							case lt:
								(r = 16), (a = null);
								break t;
						}
					(r = 29),
						(l = Error(o(130, t === null ? "null" : typeof t, ""))),
						(a = null);
			}
		return (
			(e = se(r, l, e, n)), (e.elementType = t), (e.type = a), (e.lanes = u), e
		);
	}
	function Gl(t, e, l, a) {
		return (t = se(7, t, a, e)), (t.lanes = l), t;
	}
	function Sc(t, e, l) {
		return (t = se(6, t, null, e)), (t.lanes = l), t;
	}
	function _c(t, e, l) {
		return (
			(e = se(4, t.children !== null ? t.children : [], t.key, e)),
			(e.lanes = l),
			(e.stateNode = {
				containerInfo: t.containerInfo,
				pendingChildren: null,
				implementation: t.implementation,
			}),
			e
		);
	}
	var Ra = [],
		Ea = 0,
		Du = null,
		Cu = 0,
		Re = [],
		Ee = 0,
		Vl = null,
		Ze = 1,
		Ke = "";
	function Xl(t, e) {
		(Ra[Ea++] = Cu), (Ra[Ea++] = Du), (Du = t), (Cu = e);
	}
	function Nr(t, e, l) {
		(Re[Ee++] = Ze), (Re[Ee++] = Ke), (Re[Ee++] = Vl), (Vl = t);
		var a = Ze;
		t = Ke;
		var n = 32 - ce(a) - 1;
		(a &= ~(1 << n)), (l += 1);
		var u = 32 - ce(e) + n;
		if (30 < u) {
			var r = n - (n % 5);
			(u = (a & ((1 << r) - 1)).toString(32)),
				(a >>= r),
				(n -= r),
				(Ze = (1 << (32 - ce(e) + n)) | (l << n) | a),
				(Ke = u + t);
		} else (Ze = (1 << u) | (l << n) | a), (Ke = t);
	}
	function bc(t) {
		t.return !== null && (Xl(t, 1), Nr(t, 1, 0));
	}
	function Rc(t) {
		for (; t === Du; )
			(Du = Ra[--Ea]), (Ra[Ea] = null), (Cu = Ra[--Ea]), (Ra[Ea] = null);
		for (; t === Vl; )
			(Vl = Re[--Ee]),
				(Re[Ee] = null),
				(Ke = Re[--Ee]),
				(Re[Ee] = null),
				(Ze = Re[--Ee]),
				(Re[Ee] = null);
	}
	var It = null,
		Ct = null,
		pt = !1,
		Ql = null,
		Be = !1,
		Ec = Error(o(519));
	function Zl(t) {
		var e = Error(o(418, ""));
		throw (Sn(_e(e, t)), Ec);
	}
	function Br(t) {
		var e = t.stateNode,
			l = t.type,
			a = t.memoizedProps;
		switch (((e[Pt] = t), (e[te] = a), l)) {
			case "dialog":
				dt("cancel", e), dt("close", e);
				break;
			case "iframe":
			case "object":
			case "embed":
				dt("load", e);
				break;
			case "video":
			case "audio":
				for (l = 0; l < Xn.length; l++) dt(Xn[l], e);
				break;
			case "source":
				dt("error", e);
				break;
			case "img":
			case "image":
			case "link":
				dt("error", e), dt("load", e);
				break;
			case "details":
				dt("toggle", e);
				break;
			case "input":
				dt("invalid", e),
					Ps(
						e,
						a.value,
						a.defaultValue,
						a.checked,
						a.defaultChecked,
						a.type,
						a.name,
						!0,
					),
					gu(e);
				break;
			case "select":
				dt("invalid", e);
				break;
			case "textarea":
				dt("invalid", e), Fs(e, a.value, a.defaultValue, a.children), gu(e);
		}
		(l = a.children),
			(typeof l != "string" && typeof l != "number" && typeof l != "bigint") ||
			e.textContent === "" + l ||
			a.suppressHydrationWarning === !0 ||
			Id(e.textContent, l)
				? (a.popover != null && (dt("beforetoggle", e), dt("toggle", e)),
					a.onScroll != null && dt("scroll", e),
					a.onScrollEnd != null && dt("scrollend", e),
					a.onClick != null && (e.onclick = fi),
					(e = !0))
				: (e = !1),
			e || Zl(t);
	}
	function Hr(t) {
		for (It = t.return; It; )
			switch (It.tag) {
				case 5:
				case 13:
					Be = !1;
					return;
				case 27:
				case 3:
					Be = !0;
					return;
				default:
					It = It.return;
			}
	}
	function gn(t) {
		if (t !== It) return !1;
		if (!pt) return Hr(t), (pt = !0), !1;
		var e = t.tag,
			l;
		if (
			((l = e !== 3 && e !== 27) &&
				((l = e === 5) &&
					((l = t.type),
					(l =
						!(l !== "form" && l !== "button") || wo(t.type, t.memoizedProps))),
				(l = !l)),
			l && Ct && Zl(t),
			Hr(t),
			e === 13)
		) {
			if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
				throw Error(o(317));
			t: {
				for (t = t.nextSibling, e = 0; t; ) {
					if (t.nodeType === 8)
						if (((l = t.data), l === "/$")) {
							if (e === 0) {
								Ct = Le(t.nextSibling);
								break t;
							}
							e--;
						} else (l !== "$" && l !== "$!" && l !== "$?") || e++;
					t = t.nextSibling;
				}
				Ct = null;
			}
		} else
			e === 27
				? ((e = Ct), Tl(t.type) ? ((t = Qo), (Qo = null), (Ct = t)) : (Ct = e))
				: (Ct = It ? Le(t.stateNode.nextSibling) : null);
		return !0;
	}
	function pn() {
		(Ct = It = null), (pt = !1);
	}
	function qr() {
		var t = Ql;
		return (
			t !== null &&
				(ne === null ? (ne = t) : ne.push.apply(ne, t), (Ql = null)),
			t
		);
	}
	function Sn(t) {
		Ql === null ? (Ql = [t]) : Ql.push(t);
	}
	var Tc = q(null),
		Kl = null,
		Je = null;
	function sl(t, e, l) {
		w(Tc, e._currentValue), (e._currentValue = l);
	}
	function ke(t) {
		(t._currentValue = Tc.current), V(Tc);
	}
	function Mc(t, e, l) {
		for (; t !== null; ) {
			var a = t.alternate;
			if (
				((t.childLanes & e) !== e
					? ((t.childLanes |= e), a !== null && (a.childLanes |= e))
					: a !== null && (a.childLanes & e) !== e && (a.childLanes |= e),
				t === l)
			)
				break;
			t = t.return;
		}
	}
	function Ac(t, e, l, a) {
		var n = t.child;
		for (n !== null && (n.return = t); n !== null; ) {
			var u = n.dependencies;
			if (u !== null) {
				var r = n.child;
				u = u.firstContext;
				t: for (; u !== null; ) {
					var h = u;
					u = n;
					for (var S = 0; S < e.length; S++)
						if (h.context === e[S]) {
							(u.lanes |= l),
								(h = u.alternate),
								h !== null && (h.lanes |= l),
								Mc(u.return, l, t),
								a || (r = null);
							break t;
						}
					u = h.next;
				}
			} else if (n.tag === 18) {
				if (((r = n.return), r === null)) throw Error(o(341));
				(r.lanes |= l),
					(u = r.alternate),
					u !== null && (u.lanes |= l),
					Mc(r, l, t),
					(r = null);
			} else r = n.child;
			if (r !== null) r.return = n;
			else
				for (r = n; r !== null; ) {
					if (r === t) {
						r = null;
						break;
					}
					if (((n = r.sibling), n !== null)) {
						(n.return = r.return), (r = n);
						break;
					}
					r = r.return;
				}
			n = r;
		}
	}
	function _n(t, e, l, a) {
		t = null;
		for (var n = e, u = !1; n !== null; ) {
			if (!u) {
				if ((n.flags & 524288) !== 0) u = !0;
				else if ((n.flags & 262144) !== 0) break;
			}
			if (n.tag === 10) {
				var r = n.alternate;
				if (r === null) throw Error(o(387));
				if (((r = r.memoizedProps), r !== null)) {
					var h = n.type;
					oe(n.pendingProps.value, r.value) ||
						(t !== null ? t.push(h) : (t = [h]));
				}
			} else if (n === Zt.current) {
				if (((r = n.alternate), r === null)) throw Error(o(387));
				r.memoizedState.memoizedState !== n.memoizedState.memoizedState &&
					(t !== null ? t.push($n) : (t = [$n]));
			}
			n = n.return;
		}
		t !== null && Ac(e, t, l, a), (e.flags |= 262144);
	}
	function Uu(t) {
		for (t = t.firstContext; t !== null; ) {
			if (!oe(t.context._currentValue, t.memoizedValue)) return !0;
			t = t.next;
		}
		return !1;
	}
	function Jl(t) {
		(Kl = t),
			(Je = null),
			(t = t.dependencies),
			t !== null && (t.firstContext = null);
	}
	function Wt(t) {
		return jr(Kl, t);
	}
	function Lu(t, e) {
		return Kl === null && Jl(t), jr(t, e);
	}
	function jr(t, e) {
		var l = e._currentValue;
		if (((e = { context: e, memoizedValue: l, next: null }), Je === null)) {
			if (t === null) throw Error(o(308));
			(Je = e),
				(t.dependencies = { lanes: 0, firstContext: e }),
				(t.flags |= 524288);
		} else Je = Je.next = e;
		return l;
	}
	var Am =
			typeof AbortController < "u"
				? AbortController
				: function () {
						var t = [],
							e = (this.signal = {
								aborted: !1,
								addEventListener: (l, a) => {
									t.push(a);
								},
							});
						this.abort = () => {
							(e.aborted = !0), t.forEach((l) => l());
						};
					},
		Om = i.unstable_scheduleCallback,
		xm = i.unstable_NormalPriority,
		jt = {
			$$typeof: X,
			Consumer: null,
			Provider: null,
			_currentValue: null,
			_currentValue2: null,
			_threadCount: 0,
		};
	function Oc() {
		return { controller: new Am(), data: new Map(), refCount: 0 };
	}
	function bn(t) {
		t.refCount--,
			t.refCount === 0 &&
				Om(xm, () => {
					t.controller.abort();
				});
	}
	var Rn = null,
		xc = 0,
		Ta = 0,
		Ma = null;
	function zm(t, e) {
		if (Rn === null) {
			var l = (Rn = []);
			(xc = 0),
				(Ta = Co()),
				(Ma = {
					status: "pending",
					value: void 0,
					then: (a) => {
						l.push(a);
					},
				});
		}
		return xc++, e.then(Yr, Yr), e;
	}
	function Yr() {
		if (--xc === 0 && Rn !== null) {
			Ma !== null && (Ma.status = "fulfilled");
			var t = Rn;
			(Rn = null), (Ta = 0), (Ma = null);
			for (var e = 0; e < t.length; e++) (0, t[e])();
		}
	}
	function Dm(t, e) {
		var l = [],
			a = {
				status: "pending",
				value: null,
				reason: null,
				then: (n) => {
					l.push(n);
				},
			};
		return (
			t.then(
				() => {
					(a.status = "fulfilled"), (a.value = e);
					for (var n = 0; n < l.length; n++) (0, l[n])(e);
				},
				(n) => {
					for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
						(0, l[n])(void 0);
				},
			),
			a
		);
	}
	var wr = C.S;
	C.S = (t, e) => {
		typeof e == "object" &&
			e !== null &&
			typeof e.then == "function" &&
			zm(t, e),
			wr !== null && wr(t, e);
	};
	var kl = q(null);
	function zc() {
		var t = kl.current;
		return t !== null ? t : At.pooledCache;
	}
	function Nu(t, e) {
		e === null ? w(kl, kl.current) : w(kl, e.pool);
	}
	function Gr() {
		var t = zc();
		return t === null ? null : { parent: jt._currentValue, pool: t };
	}
	var En = Error(o(460)),
		Vr = Error(o(474)),
		Bu = Error(o(542)),
		Dc = { then: () => {} };
	function Xr(t) {
		return (t = t.status), t === "fulfilled" || t === "rejected";
	}
	function Hu() {}
	function Qr(t, e, l) {
		switch (
			((l = t[l]),
			l === void 0 ? t.push(e) : l !== e && (e.then(Hu, Hu), (e = l)),
			e.status)
		) {
			case "fulfilled":
				return e.value;
			case "rejected":
				throw ((t = e.reason), Kr(t), t);
			default:
				if (typeof e.status == "string") e.then(Hu, Hu);
				else {
					if (((t = At), t !== null && 100 < t.shellSuspendCounter))
						throw Error(o(482));
					(t = e),
						(t.status = "pending"),
						t.then(
							(a) => {
								if (e.status === "pending") {
									var n = e;
									(n.status = "fulfilled"), (n.value = a);
								}
							},
							(a) => {
								if (e.status === "pending") {
									var n = e;
									(n.status = "rejected"), (n.reason = a);
								}
							},
						);
				}
				switch (e.status) {
					case "fulfilled":
						return e.value;
					case "rejected":
						throw ((t = e.reason), Kr(t), t);
				}
				throw ((Tn = e), En);
		}
	}
	var Tn = null;
	function Zr() {
		if (Tn === null) throw Error(o(459));
		var t = Tn;
		return (Tn = null), t;
	}
	function Kr(t) {
		if (t === En || t === Bu) throw Error(o(483));
	}
	var rl = !1;
	function Cc(t) {
		t.updateQueue = {
			baseState: t.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: { pending: null, lanes: 0, hiddenCallbacks: null },
			callbacks: null,
		};
	}
	function Uc(t, e) {
		(t = t.updateQueue),
			e.updateQueue === t &&
				(e.updateQueue = {
					baseState: t.baseState,
					firstBaseUpdate: t.firstBaseUpdate,
					lastBaseUpdate: t.lastBaseUpdate,
					shared: t.shared,
					callbacks: null,
				});
	}
	function fl(t) {
		return { lane: t, tag: 0, payload: null, callback: null, next: null };
	}
	function dl(t, e, l) {
		var a = t.updateQueue;
		if (a === null) return null;
		if (((a = a.shared), (_t & 2) !== 0)) {
			var n = a.pending;
			return (
				n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
				(a.pending = e),
				(e = xu(t)),
				Ur(t, null, l),
				e
			);
		}
		return Ou(t, a, e, l), xu(t);
	}
	function Mn(t, e, l) {
		if (
			((e = e.updateQueue), e !== null && ((e = e.shared), (l & 4194048) !== 0))
		) {
			var a = e.lanes;
			(a &= t.pendingLanes), (l |= a), (e.lanes = l), Ys(t, l);
		}
	}
	function Lc(t, e) {
		var l = t.updateQueue,
			a = t.alternate;
		if (a !== null && ((a = a.updateQueue), l === a)) {
			var n = null,
				u = null;
			if (((l = l.firstBaseUpdate), l !== null)) {
				do {
					var r = {
						lane: l.lane,
						tag: l.tag,
						payload: l.payload,
						callback: null,
						next: null,
					};
					u === null ? (n = u = r) : (u = u.next = r), (l = l.next);
				} while (l !== null);
				u === null ? (n = u = e) : (u = u.next = e);
			} else n = u = e;
			(l = {
				baseState: a.baseState,
				firstBaseUpdate: n,
				lastBaseUpdate: u,
				shared: a.shared,
				callbacks: a.callbacks,
			}),
				(t.updateQueue = l);
			return;
		}
		(t = l.lastBaseUpdate),
			t === null ? (l.firstBaseUpdate = e) : (t.next = e),
			(l.lastBaseUpdate = e);
	}
	var Nc = !1;
	function An() {
		if (Nc) {
			var t = Ma;
			if (t !== null) throw t;
		}
	}
	function On(t, e, l, a) {
		Nc = !1;
		var n = t.updateQueue;
		rl = !1;
		var u = n.firstBaseUpdate,
			r = n.lastBaseUpdate,
			h = n.shared.pending;
		if (h !== null) {
			n.shared.pending = null;
			var S = h,
				x = S.next;
			(S.next = null), r === null ? (u = x) : (r.next = x), (r = S);
			var L = t.alternate;
			L !== null &&
				((L = L.updateQueue),
				(h = L.lastBaseUpdate),
				h !== r &&
					(h === null ? (L.firstBaseUpdate = x) : (h.next = x),
					(L.lastBaseUpdate = S)));
		}
		if (u !== null) {
			var B = n.baseState;
			(r = 0), (L = x = S = null), (h = u);
			do {
				var z = h.lane & -536870913,
					D = z !== h.lane;
				if (D ? (mt & z) === z : (a & z) === z) {
					z !== 0 && z === Ta && (Nc = !0),
						L !== null &&
							(L = L.next =
								{
									lane: 0,
									tag: h.tag,
									payload: h.payload,
									callback: null,
									next: null,
								});
					t: {
						var tt = t,
							F = h;
						z = e;
						var Tt = l;
						switch (F.tag) {
							case 1:
								if (((tt = F.payload), typeof tt == "function")) {
									B = tt.call(Tt, B, z);
									break t;
								}
								B = tt;
								break t;
							case 3:
								tt.flags = (tt.flags & -65537) | 128;
							case 0:
								if (
									((tt = F.payload),
									(z = typeof tt == "function" ? tt.call(Tt, B, z) : tt),
									z == null)
								)
									break t;
								B = b({}, B, z);
								break t;
							case 2:
								rl = !0;
						}
					}
					(z = h.callback),
						z !== null &&
							((t.flags |= 64),
							D && (t.flags |= 8192),
							(D = n.callbacks),
							D === null ? (n.callbacks = [z]) : D.push(z));
				} else
					(D = {
						lane: z,
						tag: h.tag,
						payload: h.payload,
						callback: h.callback,
						next: null,
					}),
						L === null ? ((x = L = D), (S = B)) : (L = L.next = D),
						(r |= z);
				if (((h = h.next), h === null)) {
					if (((h = n.shared.pending), h === null)) break;
					(D = h),
						(h = D.next),
						(D.next = null),
						(n.lastBaseUpdate = D),
						(n.shared.pending = null);
				}
			} while (!0);
			L === null && (S = B),
				(n.baseState = S),
				(n.firstBaseUpdate = x),
				(n.lastBaseUpdate = L),
				u === null && (n.shared.lanes = 0),
				(_l |= r),
				(t.lanes = r),
				(t.memoizedState = B);
		}
	}
	function Jr(t, e) {
		if (typeof t != "function") throw Error(o(191, t));
		t.call(e);
	}
	function kr(t, e) {
		var l = t.callbacks;
		if (l !== null)
			for (t.callbacks = null, t = 0; t < l.length; t++) Jr(l[t], e);
	}
	var Aa = q(null),
		qu = q(0);
	function $r(t, e) {
		(t = el), w(qu, t), w(Aa, e), (el = t | e.baseLanes);
	}
	function Bc() {
		w(qu, el), w(Aa, Aa.current);
	}
	function Hc() {
		(el = qu.current), V(Aa), V(qu);
	}
	var hl = 0,
		ot = null,
		Rt = null,
		Ht = null,
		ju = !1,
		Oa = !1,
		$l = !1,
		Yu = 0,
		xn = 0,
		xa = null,
		Cm = 0;
	function Nt() {
		throw Error(o(321));
	}
	function qc(t, e) {
		if (e === null) return !1;
		for (var l = 0; l < e.length && l < t.length; l++)
			if (!oe(t[l], e[l])) return !1;
		return !0;
	}
	function jc(t, e, l, a, n, u) {
		return (
			(hl = u),
			(ot = e),
			(e.memoizedState = null),
			(e.updateQueue = null),
			(e.lanes = 0),
			(C.H = t === null || t.memoizedState === null ? Lf : Nf),
			($l = !1),
			(u = l(a, n)),
			($l = !1),
			Oa && (u = Wr(e, l, a, n)),
			Pr(t),
			u
		);
	}
	function Pr(t) {
		C.H = Zu;
		var e = Rt !== null && Rt.next !== null;
		if (((hl = 0), (Ht = Rt = ot = null), (ju = !1), (xn = 0), (xa = null), e))
			throw Error(o(300));
		t === null ||
			Vt ||
			((t = t.dependencies), t !== null && Uu(t) && (Vt = !0));
	}
	function Wr(t, e, l, a) {
		ot = t;
		var n = 0;
		do {
			if ((Oa && (xa = null), (xn = 0), (Oa = !1), 25 <= n))
				throw Error(o(301));
			if (((n += 1), (Ht = Rt = null), t.updateQueue != null)) {
				var u = t.updateQueue;
				(u.lastEffect = null),
					(u.events = null),
					(u.stores = null),
					u.memoCache != null && (u.memoCache.index = 0);
			}
			(C.H = jm), (u = e(l, a));
		} while (Oa);
		return u;
	}
	function Um() {
		var t = C.H,
			e = t.useState()[0];
		return (
			(e = typeof e.then == "function" ? zn(e) : e),
			(t = t.useState()[0]),
			(Rt !== null ? Rt.memoizedState : null) !== t && (ot.flags |= 1024),
			e
		);
	}
	function Yc() {
		var t = Yu !== 0;
		return (Yu = 0), t;
	}
	function wc(t, e, l) {
		(e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~l);
	}
	function Gc(t) {
		if (ju) {
			for (t = t.memoizedState; t !== null; ) {
				var e = t.queue;
				e !== null && (e.pending = null), (t = t.next);
			}
			ju = !1;
		}
		(hl = 0), (Ht = Rt = ot = null), (Oa = !1), (xn = Yu = 0), (xa = null);
	}
	function le() {
		var t = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null,
		};
		return Ht === null ? (ot.memoizedState = Ht = t) : (Ht = Ht.next = t), Ht;
	}
	function qt() {
		if (Rt === null) {
			var t = ot.alternate;
			t = t !== null ? t.memoizedState : null;
		} else t = Rt.next;
		var e = Ht === null ? ot.memoizedState : Ht.next;
		if (e !== null) (Ht = e), (Rt = t);
		else {
			if (t === null)
				throw ot.alternate === null ? Error(o(467)) : Error(o(310));
			(Rt = t),
				(t = {
					memoizedState: Rt.memoizedState,
					baseState: Rt.baseState,
					baseQueue: Rt.baseQueue,
					queue: Rt.queue,
					next: null,
				}),
				Ht === null ? (ot.memoizedState = Ht = t) : (Ht = Ht.next = t);
		}
		return Ht;
	}
	function Vc() {
		return { lastEffect: null, events: null, stores: null, memoCache: null };
	}
	function zn(t) {
		var e = xn;
		return (
			(xn += 1),
			xa === null && (xa = []),
			(t = Qr(xa, t, e)),
			(e = ot),
			(Ht === null ? e.memoizedState : Ht.next) === null &&
				((e = e.alternate),
				(C.H = e === null || e.memoizedState === null ? Lf : Nf)),
			t
		);
	}
	function wu(t) {
		if (t !== null && typeof t == "object") {
			if (typeof t.then == "function") return zn(t);
			if (t.$$typeof === X) return Wt(t);
		}
		throw Error(o(438, String(t)));
	}
	function Xc(t) {
		var e = null,
			l = ot.updateQueue;
		if ((l !== null && (e = l.memoCache), e == null)) {
			var a = ot.alternate;
			a !== null &&
				((a = a.updateQueue),
				a !== null &&
					((a = a.memoCache),
					a != null &&
						(e = {
							data: a.data.map((n) => n.slice()),
							index: 0,
						})));
		}
		if (
			(e == null && (e = { data: [], index: 0 }),
			l === null && ((l = Vc()), (ot.updateQueue = l)),
			(l.memoCache = e),
			(l = e.data[e.index]),
			l === void 0)
		)
			for (l = e.data[e.index] = Array(t), a = 0; a < t; a++) l[a] = Z;
		return e.index++, l;
	}
	function $e(t, e) {
		return typeof e == "function" ? e(t) : e;
	}
	function Gu(t) {
		var e = qt();
		return Qc(e, Rt, t);
	}
	function Qc(t, e, l) {
		var a = t.queue;
		if (a === null) throw Error(o(311));
		a.lastRenderedReducer = l;
		var n = t.baseQueue,
			u = a.pending;
		if (u !== null) {
			if (n !== null) {
				var r = n.next;
				(n.next = u.next), (u.next = r);
			}
			(e.baseQueue = n = u), (a.pending = null);
		}
		if (((u = t.baseState), n === null)) t.memoizedState = u;
		else {
			e = n.next;
			var h = (r = null),
				S = null,
				x = e,
				L = !1;
			do {
				var B = x.lane & -536870913;
				if (B !== x.lane ? (mt & B) === B : (hl & B) === B) {
					var z = x.revertLane;
					if (z === 0)
						S !== null &&
							(S = S.next =
								{
									lane: 0,
									revertLane: 0,
									action: x.action,
									hasEagerState: x.hasEagerState,
									eagerState: x.eagerState,
									next: null,
								}),
							B === Ta && (L = !0);
					else if ((hl & z) === z) {
						(x = x.next), z === Ta && (L = !0);
						continue;
					} else
						(B = {
							lane: 0,
							revertLane: x.revertLane,
							action: x.action,
							hasEagerState: x.hasEagerState,
							eagerState: x.eagerState,
							next: null,
						}),
							S === null ? ((h = S = B), (r = u)) : (S = S.next = B),
							(ot.lanes |= z),
							(_l |= z);
					(B = x.action),
						$l && l(u, B),
						(u = x.hasEagerState ? x.eagerState : l(u, B));
				} else
					(z = {
						lane: B,
						revertLane: x.revertLane,
						action: x.action,
						hasEagerState: x.hasEagerState,
						eagerState: x.eagerState,
						next: null,
					}),
						S === null ? ((h = S = z), (r = u)) : (S = S.next = z),
						(ot.lanes |= B),
						(_l |= B);
				x = x.next;
			} while (x !== null && x !== e);
			if (
				(S === null ? (r = u) : (S.next = h),
				!oe(u, t.memoizedState) && ((Vt = !0), L && ((l = Ma), l !== null)))
			)
				throw l;
			(t.memoizedState = u),
				(t.baseState = r),
				(t.baseQueue = S),
				(a.lastRenderedState = u);
		}
		return n === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
	}
	function Zc(t) {
		var e = qt(),
			l = e.queue;
		if (l === null) throw Error(o(311));
		l.lastRenderedReducer = t;
		var a = l.dispatch,
			n = l.pending,
			u = e.memoizedState;
		if (n !== null) {
			l.pending = null;
			var r = (n = n.next);
			do (u = t(u, r.action)), (r = r.next);
			while (r !== n);
			oe(u, e.memoizedState) || (Vt = !0),
				(e.memoizedState = u),
				e.baseQueue === null && (e.baseState = u),
				(l.lastRenderedState = u);
		}
		return [u, a];
	}
	function Fr(t, e, l) {
		var a = ot,
			n = qt(),
			u = pt;
		if (u) {
			if (l === void 0) throw Error(o(407));
			l = l();
		} else l = e();
		var r = !oe((Rt || n).memoizedState, l);
		r && ((n.memoizedState = l), (Vt = !0)), (n = n.queue);
		var h = ef.bind(null, a, n, t);
		if (
			(Dn(2048, 8, h, [t]),
			n.getSnapshot !== e || r || (Ht !== null && Ht.memoizedState.tag & 1))
		) {
			if (
				((a.flags |= 2048),
				za(9, Vu(), tf.bind(null, a, n, l, e), null),
				At === null)
			)
				throw Error(o(349));
			u || (hl & 124) !== 0 || Ir(a, e, l);
		}
		return l;
	}
	function Ir(t, e, l) {
		(t.flags |= 16384),
			(t = { getSnapshot: e, value: l }),
			(e = ot.updateQueue),
			e === null
				? ((e = Vc()), (ot.updateQueue = e), (e.stores = [t]))
				: ((l = e.stores), l === null ? (e.stores = [t]) : l.push(t));
	}
	function tf(t, e, l, a) {
		(e.value = l), (e.getSnapshot = a), lf(e) && af(t);
	}
	function ef(t, e, l) {
		return l(() => {
			lf(e) && af(t);
		});
	}
	function lf(t) {
		var e = t.getSnapshot;
		t = t.value;
		try {
			var l = e();
			return !oe(t, l);
		} catch {
			return !0;
		}
	}
	function af(t) {
		var e = _a(t, 2);
		e !== null && ve(e, t, 2);
	}
	function Kc(t) {
		var e = le();
		if (typeof t == "function") {
			var l = t;
			if (((t = l()), $l)) {
				il(!0);
				try {
					l();
				} finally {
					il(!1);
				}
			}
		}
		return (
			(e.memoizedState = e.baseState = t),
			(e.queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: $e,
				lastRenderedState: t,
			}),
			e
		);
	}
	function nf(t, e, l, a) {
		return (t.baseState = l), Qc(t, Rt, typeof a == "function" ? a : $e);
	}
	function Lm(t, e, l, a, n) {
		if (Qu(t)) throw Error(o(485));
		if (((t = e.action), t !== null)) {
			var u = {
				payload: n,
				action: t,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: (r) => {
					u.listeners.push(r);
				},
			};
			C.T !== null ? l(!0) : (u.isTransition = !1),
				a(u),
				(l = e.pending),
				l === null
					? ((u.next = e.pending = u), uf(e, u))
					: ((u.next = l.next), (e.pending = l.next = u));
		}
	}
	function uf(t, e) {
		var l = e.action,
			a = e.payload,
			n = t.state;
		if (e.isTransition) {
			var u = C.T,
				r = {};
			C.T = r;
			try {
				var h = l(n, a),
					S = C.S;
				S !== null && S(r, h), cf(t, e, h);
			} catch (x) {
				Jc(t, e, x);
			} finally {
				C.T = u;
			}
		} else
			try {
				(u = l(n, a)), cf(t, e, u);
			} catch (x) {
				Jc(t, e, x);
			}
	}
	function cf(t, e, l) {
		l !== null && typeof l == "object" && typeof l.then == "function"
			? l.then(
					(a) => {
						of(t, e, a);
					},
					(a) => Jc(t, e, a),
				)
			: of(t, e, l);
	}
	function of(t, e, l) {
		(e.status = "fulfilled"),
			(e.value = l),
			sf(e),
			(t.state = l),
			(e = t.pending),
			e !== null &&
				((l = e.next),
				l === e ? (t.pending = null) : ((l = l.next), (e.next = l), uf(t, l)));
	}
	function Jc(t, e, l) {
		var a = t.pending;
		if (((t.pending = null), a !== null)) {
			a = a.next;
			do (e.status = "rejected"), (e.reason = l), sf(e), (e = e.next);
			while (e !== a);
		}
		t.action = null;
	}
	function sf(t) {
		t = t.listeners;
		for (var e = 0; e < t.length; e++) (0, t[e])();
	}
	function rf(t, e) {
		return e;
	}
	function ff(t, e) {
		if (pt) {
			var l = At.formState;
			if (l !== null) {
				t: {
					var a = ot;
					if (pt) {
						if (Ct) {
							e: {
								for (var n = Ct, u = Be; n.nodeType !== 8; ) {
									if (!u) {
										n = null;
										break e;
									}
									if (((n = Le(n.nextSibling)), n === null)) {
										n = null;
										break e;
									}
								}
								(u = n.data), (n = u === "F!" || u === "F" ? n : null);
							}
							if (n) {
								(Ct = Le(n.nextSibling)), (a = n.data === "F!");
								break t;
							}
						}
						Zl(a);
					}
					a = !1;
				}
				a && (e = l[0]);
			}
		}
		return (
			(l = le()),
			(l.memoizedState = l.baseState = e),
			(a = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: rf,
				lastRenderedState: e,
			}),
			(l.queue = a),
			(l = Df.bind(null, ot, a)),
			(a.dispatch = l),
			(a = Kc(!1)),
			(u = Fc.bind(null, ot, !1, a.queue)),
			(a = le()),
			(n = { state: e, dispatch: null, action: t, pending: null }),
			(a.queue = n),
			(l = Lm.bind(null, ot, n, u, l)),
			(n.dispatch = l),
			(a.memoizedState = t),
			[e, l, !1]
		);
	}
	function df(t) {
		var e = qt();
		return hf(e, Rt, t);
	}
	function hf(t, e, l) {
		if (
			((e = Qc(t, e, rf)[0]),
			(t = Gu($e)[0]),
			typeof e == "object" && e !== null && typeof e.then == "function")
		)
			try {
				var a = zn(e);
			} catch (r) {
				throw r === En ? Bu : r;
			}
		else a = e;
		e = qt();
		var n = e.queue,
			u = n.dispatch;
		return (
			l !== e.memoizedState &&
				((ot.flags |= 2048), za(9, Vu(), Nm.bind(null, n, l), null)),
			[a, u, t]
		);
	}
	function Nm(t, e) {
		t.action = e;
	}
	function vf(t) {
		var e = qt(),
			l = Rt;
		if (l !== null) return hf(e, l, t);
		qt(), (e = e.memoizedState), (l = qt());
		var a = l.queue.dispatch;
		return (l.memoizedState = t), [e, a, !1];
	}
	function za(t, e, l, a) {
		return (
			(t = { tag: t, create: l, deps: a, inst: e, next: null }),
			(e = ot.updateQueue),
			e === null && ((e = Vc()), (ot.updateQueue = e)),
			(l = e.lastEffect),
			l === null
				? (e.lastEffect = t.next = t)
				: ((a = l.next), (l.next = t), (t.next = a), (e.lastEffect = t)),
			t
		);
	}
	function Vu() {
		return { destroy: void 0, resource: void 0 };
	}
	function mf() {
		return qt().memoizedState;
	}
	function Xu(t, e, l, a) {
		var n = le();
		(a = a === void 0 ? null : a),
			(ot.flags |= t),
			(n.memoizedState = za(1 | e, Vu(), l, a));
	}
	function Dn(t, e, l, a) {
		var n = qt();
		a = a === void 0 ? null : a;
		var u = n.memoizedState.inst;
		Rt !== null && a !== null && qc(a, Rt.memoizedState.deps)
			? (n.memoizedState = za(e, u, l, a))
			: ((ot.flags |= t), (n.memoizedState = za(1 | e, u, l, a)));
	}
	function yf(t, e) {
		Xu(8390656, 8, t, e);
	}
	function gf(t, e) {
		Dn(2048, 8, t, e);
	}
	function pf(t, e) {
		return Dn(4, 2, t, e);
	}
	function Sf(t, e) {
		return Dn(4, 4, t, e);
	}
	function _f(t, e) {
		if (typeof e == "function") {
			t = t();
			var l = e(t);
			return () => {
				typeof l == "function" ? l() : e(null);
			};
		}
		if (e != null)
			return (
				(t = t()),
				(e.current = t),
				() => {
					e.current = null;
				}
			);
	}
	function bf(t, e, l) {
		(l = l != null ? l.concat([t]) : null), Dn(4, 4, _f.bind(null, e, t), l);
	}
	function kc() {}
	function Rf(t, e) {
		var l = qt();
		e = e === void 0 ? null : e;
		var a = l.memoizedState;
		return e !== null && qc(e, a[1]) ? a[0] : ((l.memoizedState = [t, e]), t);
	}
	function Ef(t, e) {
		var l = qt();
		e = e === void 0 ? null : e;
		var a = l.memoizedState;
		if (e !== null && qc(e, a[1])) return a[0];
		if (((a = t()), $l)) {
			il(!0);
			try {
				t();
			} finally {
				il(!1);
			}
		}
		return (l.memoizedState = [a, e]), a;
	}
	function $c(t, e, l) {
		return l === void 0 || (hl & 1073741824) !== 0
			? (t.memoizedState = e)
			: ((t.memoizedState = l), (t = Ad()), (ot.lanes |= t), (_l |= t), l);
	}
	function Tf(t, e, l, a) {
		return oe(l, e)
			? l
			: Aa.current !== null
				? ((t = $c(t, l, a)), oe(t, e) || (Vt = !0), t)
				: (hl & 42) === 0
					? ((Vt = !0), (t.memoizedState = l))
					: ((t = Ad()), (ot.lanes |= t), (_l |= t), e);
	}
	function Mf(t, e, l, a, n) {
		var u = Y.p;
		Y.p = u !== 0 && 8 > u ? u : 8;
		var r = C.T,
			h = {};
		(C.T = h), Fc(t, !1, e, l);
		try {
			var S = n(),
				x = C.S;
			if (
				(x !== null && x(h, S),
				S !== null && typeof S == "object" && typeof S.then == "function")
			) {
				var L = Dm(S, a);
				Cn(t, e, L, he(t));
			} else Cn(t, e, a, he(t));
		} catch (B) {
			Cn(t, e, { then: () => {}, status: "rejected", reason: B }, he());
		} finally {
			(Y.p = u), (C.T = r);
		}
	}
	function Bm() {}
	function Pc(t, e, l, a) {
		if (t.tag !== 5) throw Error(o(476));
		var n = Af(t).queue;
		Mf(t, n, e, P, l === null ? Bm : () => (Of(t), l(a)));
	}
	function Af(t) {
		var e = t.memoizedState;
		if (e !== null) return e;
		e = {
			memoizedState: P,
			baseState: P,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: $e,
				lastRenderedState: P,
			},
			next: null,
		};
		var l = {};
		return (
			(e.next = {
				memoizedState: l,
				baseState: l,
				baseQueue: null,
				queue: {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: $e,
					lastRenderedState: l,
				},
				next: null,
			}),
			(t.memoizedState = e),
			(t = t.alternate),
			t !== null && (t.memoizedState = e),
			e
		);
	}
	function Of(t) {
		var e = Af(t).next.queue;
		Cn(t, e, {}, he());
	}
	function Wc() {
		return Wt($n);
	}
	function xf() {
		return qt().memoizedState;
	}
	function zf() {
		return qt().memoizedState;
	}
	function Hm(t) {
		for (var e = t.return; e !== null; ) {
			switch (e.tag) {
				case 24:
				case 3: {
					var l = he();
					t = fl(l);
					var a = dl(e, t, l);
					a !== null && (ve(a, e, l), Mn(a, e, l)),
						(e = { cache: Oc() }),
						(t.payload = e);
					return;
				}
			}
			e = e.return;
		}
	}
	function qm(t, e, l) {
		var a = he();
		(l = {
			lane: a,
			revertLane: 0,
			action: l,
			hasEagerState: !1,
			eagerState: null,
			next: null,
		}),
			Qu(t)
				? Cf(e, l)
				: ((l = gc(t, e, l, a)), l !== null && (ve(l, t, a), Uf(l, e, a)));
	}
	function Df(t, e, l) {
		var a = he();
		Cn(t, e, l, a);
	}
	function Cn(t, e, l, a) {
		var n = {
			lane: a,
			revertLane: 0,
			action: l,
			hasEagerState: !1,
			eagerState: null,
			next: null,
		};
		if (Qu(t)) Cf(e, n);
		else {
			var u = t.alternate;
			if (
				t.lanes === 0 &&
				(u === null || u.lanes === 0) &&
				((u = e.lastRenderedReducer), u !== null)
			)
				try {
					var r = e.lastRenderedState,
						h = u(r, l);
					if (((n.hasEagerState = !0), (n.eagerState = h), oe(h, r)))
						return Ou(t, e, n, 0), At === null && Au(), !1;
				} catch {
				} finally {
				}
			if (((l = gc(t, e, n, a)), l !== null))
				return ve(l, t, a), Uf(l, e, a), !0;
		}
		return !1;
	}
	function Fc(t, e, l, a) {
		if (
			((a = {
				lane: 2,
				revertLane: Co(),
				action: a,
				hasEagerState: !1,
				eagerState: null,
				next: null,
			}),
			Qu(t))
		) {
			if (e) throw Error(o(479));
		} else (e = gc(t, l, a, 2)), e !== null && ve(e, t, 2);
	}
	function Qu(t) {
		var e = t.alternate;
		return t === ot || (e !== null && e === ot);
	}
	function Cf(t, e) {
		Oa = ju = !0;
		var l = t.pending;
		l === null ? (e.next = e) : ((e.next = l.next), (l.next = e)),
			(t.pending = e);
	}
	function Uf(t, e, l) {
		if ((l & 4194048) !== 0) {
			var a = e.lanes;
			(a &= t.pendingLanes), (l |= a), (e.lanes = l), Ys(t, l);
		}
	}
	var Zu = {
			readContext: Wt,
			use: wu,
			useCallback: Nt,
			useContext: Nt,
			useEffect: Nt,
			useImperativeHandle: Nt,
			useLayoutEffect: Nt,
			useInsertionEffect: Nt,
			useMemo: Nt,
			useReducer: Nt,
			useRef: Nt,
			useState: Nt,
			useDebugValue: Nt,
			useDeferredValue: Nt,
			useTransition: Nt,
			useSyncExternalStore: Nt,
			useId: Nt,
			useHostTransitionStatus: Nt,
			useFormState: Nt,
			useActionState: Nt,
			useOptimistic: Nt,
			useMemoCache: Nt,
			useCacheRefresh: Nt,
		},
		Lf = {
			readContext: Wt,
			use: wu,
			useCallback: (t, e) => (
				(le().memoizedState = [t, e === void 0 ? null : e]), t
			),
			useContext: Wt,
			useEffect: yf,
			useImperativeHandle: (t, e, l) => {
				(l = l != null ? l.concat([t]) : null),
					Xu(4194308, 4, _f.bind(null, e, t), l);
			},
			useLayoutEffect: (t, e) => Xu(4194308, 4, t, e),
			useInsertionEffect: (t, e) => {
				Xu(4, 2, t, e);
			},
			useMemo: (t, e) => {
				var l = le();
				e = e === void 0 ? null : e;
				var a = t();
				if ($l) {
					il(!0);
					try {
						t();
					} finally {
						il(!1);
					}
				}
				return (l.memoizedState = [a, e]), a;
			},
			useReducer: (t, e, l) => {
				var a = le();
				if (l !== void 0) {
					var n = l(e);
					if ($l) {
						il(!0);
						try {
							l(e);
						} finally {
							il(!1);
						}
					}
				} else n = e;
				return (
					(a.memoizedState = a.baseState = n),
					(t = {
						pending: null,
						lanes: 0,
						dispatch: null,
						lastRenderedReducer: t,
						lastRenderedState: n,
					}),
					(a.queue = t),
					(t = t.dispatch = qm.bind(null, ot, t)),
					[a.memoizedState, t]
				);
			},
			useRef: (t) => {
				var e = le();
				return (t = { current: t }), (e.memoizedState = t);
			},
			useState: (t) => {
				t = Kc(t);
				var e = t.queue,
					l = Df.bind(null, ot, e);
				return (e.dispatch = l), [t.memoizedState, l];
			},
			useDebugValue: kc,
			useDeferredValue: (t, e) => {
				var l = le();
				return $c(l, t, e);
			},
			useTransition: () => {
				var t = Kc(!1);
				return (
					(t = Mf.bind(null, ot, t.queue, !0, !1)),
					(le().memoizedState = t),
					[!1, t]
				);
			},
			useSyncExternalStore: (t, e, l) => {
				var a = ot,
					n = le();
				if (pt) {
					if (l === void 0) throw Error(o(407));
					l = l();
				} else {
					if (((l = e()), At === null)) throw Error(o(349));
					(mt & 124) !== 0 || Ir(a, e, l);
				}
				n.memoizedState = l;
				var u = { value: l, getSnapshot: e };
				return (
					(n.queue = u),
					yf(ef.bind(null, a, u, t), [t]),
					(a.flags |= 2048),
					za(9, Vu(), tf.bind(null, a, u, l, e), null),
					l
				);
			},
			useId: () => {
				var t = le(),
					e = At.identifierPrefix;
				if (pt) {
					var l = Ke,
						a = Ze;
					(l = (a & ~(1 << (32 - ce(a) - 1))).toString(32) + l),
						(e = "«" + e + "R" + l),
						(l = Yu++),
						0 < l && (e += "H" + l.toString(32)),
						(e += "»");
				} else (l = Cm++), (e = "«" + e + "r" + l.toString(32) + "»");
				return (t.memoizedState = e);
			},
			useHostTransitionStatus: Wc,
			useFormState: ff,
			useActionState: ff,
			useOptimistic: (t) => {
				var e = le();
				e.memoizedState = e.baseState = t;
				var l = {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: null,
					lastRenderedState: null,
				};
				return (
					(e.queue = l),
					(e = Fc.bind(null, ot, !0, l)),
					(l.dispatch = e),
					[t, e]
				);
			},
			useMemoCache: Xc,
			useCacheRefresh: () => (le().memoizedState = Hm.bind(null, ot)),
		},
		Nf = {
			readContext: Wt,
			use: wu,
			useCallback: Rf,
			useContext: Wt,
			useEffect: gf,
			useImperativeHandle: bf,
			useInsertionEffect: pf,
			useLayoutEffect: Sf,
			useMemo: Ef,
			useReducer: Gu,
			useRef: mf,
			useState: () => Gu($e),
			useDebugValue: kc,
			useDeferredValue: (t, e) => {
				var l = qt();
				return Tf(l, Rt.memoizedState, t, e);
			},
			useTransition: () => {
				var t = Gu($e)[0],
					e = qt().memoizedState;
				return [typeof t == "boolean" ? t : zn(t), e];
			},
			useSyncExternalStore: Fr,
			useId: xf,
			useHostTransitionStatus: Wc,
			useFormState: df,
			useActionState: df,
			useOptimistic: (t, e) => {
				var l = qt();
				return nf(l, Rt, t, e);
			},
			useMemoCache: Xc,
			useCacheRefresh: zf,
		},
		jm = {
			readContext: Wt,
			use: wu,
			useCallback: Rf,
			useContext: Wt,
			useEffect: gf,
			useImperativeHandle: bf,
			useInsertionEffect: pf,
			useLayoutEffect: Sf,
			useMemo: Ef,
			useReducer: Zc,
			useRef: mf,
			useState: () => Zc($e),
			useDebugValue: kc,
			useDeferredValue: (t, e) => {
				var l = qt();
				return Rt === null ? $c(l, t, e) : Tf(l, Rt.memoizedState, t, e);
			},
			useTransition: () => {
				var t = Zc($e)[0],
					e = qt().memoizedState;
				return [typeof t == "boolean" ? t : zn(t), e];
			},
			useSyncExternalStore: Fr,
			useId: xf,
			useHostTransitionStatus: Wc,
			useFormState: vf,
			useActionState: vf,
			useOptimistic: (t, e) => {
				var l = qt();
				return Rt !== null
					? nf(l, Rt, t, e)
					: ((l.baseState = t), [t, l.queue.dispatch]);
			},
			useMemoCache: Xc,
			useCacheRefresh: zf,
		},
		Da = null,
		Un = 0;
	function Ku(t) {
		var e = Un;
		return (Un += 1), Da === null && (Da = []), Qr(Da, t, e);
	}
	function Ln(t, e) {
		(e = e.props.ref), (t.ref = e !== void 0 ? e : null);
	}
	function Ju(t, e) {
		throw e.$$typeof === g
			? Error(o(525))
			: ((t = Object.prototype.toString.call(e)),
				Error(
					o(
						31,
						t === "[object Object]"
							? "object with keys {" + Object.keys(e).join(", ") + "}"
							: t,
					),
				));
	}
	function Bf(t) {
		var e = t._init;
		return e(t._payload);
	}
	function Hf(t) {
		function e(T, E) {
			if (t) {
				var O = T.deletions;
				O === null ? ((T.deletions = [E]), (T.flags |= 16)) : O.push(E);
			}
		}
		function l(T, E) {
			if (!t) return null;
			for (; E !== null; ) e(T, E), (E = E.sibling);
			return null;
		}
		function a(T) {
			for (var E = new Map(); T !== null; )
				T.key !== null ? E.set(T.key, T) : E.set(T.index, T), (T = T.sibling);
			return E;
		}
		function n(T, E) {
			return (T = Qe(T, E)), (T.index = 0), (T.sibling = null), T;
		}
		function u(T, E, O) {
			return (
				(T.index = O),
				t
					? ((O = T.alternate),
						O !== null
							? ((O = O.index), O < E ? ((T.flags |= 67108866), E) : O)
							: ((T.flags |= 67108866), E))
					: ((T.flags |= 1048576), E)
			);
		}
		function r(T) {
			return t && T.alternate === null && (T.flags |= 67108866), T;
		}
		function h(T, E, O, N) {
			return E === null || E.tag !== 6
				? ((E = Sc(O, T.mode, N)), (E.return = T), E)
				: ((E = n(E, O)), (E.return = T), E);
		}
		function S(T, E, O, N) {
			var K = O.type;
			return K === A
				? L(T, E, O.props.children, N, O.key)
				: E !== null &&
						(E.elementType === K ||
							(typeof K == "object" &&
								K !== null &&
								K.$$typeof === lt &&
								Bf(K) === E.type))
					? ((E = n(E, O.props)), Ln(E, O), (E.return = T), E)
					: ((E = zu(O.type, O.key, O.props, null, T.mode, N)),
						Ln(E, O),
						(E.return = T),
						E);
		}
		function x(T, E, O, N) {
			return E === null ||
				E.tag !== 4 ||
				E.stateNode.containerInfo !== O.containerInfo ||
				E.stateNode.implementation !== O.implementation
				? ((E = _c(O, T.mode, N)), (E.return = T), E)
				: ((E = n(E, O.children || [])), (E.return = T), E);
		}
		function L(T, E, O, N, K) {
			return E === null || E.tag !== 7
				? ((E = Gl(O, T.mode, N, K)), (E.return = T), E)
				: ((E = n(E, O)), (E.return = T), E);
		}
		function B(T, E, O) {
			if (
				(typeof E == "string" && E !== "") ||
				typeof E == "number" ||
				typeof E == "bigint"
			)
				return (E = Sc("" + E, T.mode, O)), (E.return = T), E;
			if (typeof E == "object" && E !== null) {
				switch (E.$$typeof) {
					case _:
						return (
							(O = zu(E.type, E.key, E.props, null, T.mode, O)),
							Ln(O, E),
							(O.return = T),
							O
						);
					case M:
						return (E = _c(E, T.mode, O)), (E.return = T), E;
					case lt: {
						var N = E._init;
						return (E = N(E._payload)), B(T, E, O);
					}
				}
				if (Lt(E) || vt(E))
					return (E = Gl(E, T.mode, O, null)), (E.return = T), E;
				if (typeof E.then == "function") return B(T, Ku(E), O);
				if (E.$$typeof === X) return B(T, Lu(T, E), O);
				Ju(T, E);
			}
			return null;
		}
		function z(T, E, O, N) {
			var K = E !== null ? E.key : null;
			if (
				(typeof O == "string" && O !== "") ||
				typeof O == "number" ||
				typeof O == "bigint"
			)
				return K !== null ? null : h(T, E, "" + O, N);
			if (typeof O == "object" && O !== null) {
				switch (O.$$typeof) {
					case _:
						return O.key === K ? S(T, E, O, N) : null;
					case M:
						return O.key === K ? x(T, E, O, N) : null;
					case lt:
						return (K = O._init), (O = K(O._payload)), z(T, E, O, N);
				}
				if (Lt(O) || vt(O)) return K !== null ? null : L(T, E, O, N, null);
				if (typeof O.then == "function") return z(T, E, Ku(O), N);
				if (O.$$typeof === X) return z(T, E, Lu(T, O), N);
				Ju(T, O);
			}
			return null;
		}
		function D(T, E, O, N, K) {
			if (
				(typeof N == "string" && N !== "") ||
				typeof N == "number" ||
				typeof N == "bigint"
			)
				return (T = T.get(O) || null), h(E, T, "" + N, K);
			if (typeof N == "object" && N !== null) {
				switch (N.$$typeof) {
					case _:
						return (
							(T = T.get(N.key === null ? O : N.key) || null), S(E, T, N, K)
						);
					case M:
						return (
							(T = T.get(N.key === null ? O : N.key) || null), x(E, T, N, K)
						);
					case lt: {
						var rt = N._init;
						return (N = rt(N._payload)), D(T, E, O, N, K);
					}
				}
				if (Lt(N) || vt(N)) return (T = T.get(O) || null), L(E, T, N, K, null);
				if (typeof N.then == "function") return D(T, E, O, Ku(N), K);
				if (N.$$typeof === X) return D(T, E, O, Lu(E, N), K);
				Ju(E, N);
			}
			return null;
		}
		function tt(T, E, O, N) {
			for (
				var K = null, rt = null, k = E, I = (E = 0), Qt = null;
				k !== null && I < O.length;
				I++
			) {
				k.index > I ? ((Qt = k), (k = null)) : (Qt = k.sibling);
				var yt = z(T, k, O[I], N);
				if (yt === null) {
					k === null && (k = Qt);
					break;
				}
				t && k && yt.alternate === null && e(T, k),
					(E = u(yt, E, I)),
					rt === null ? (K = yt) : (rt.sibling = yt),
					(rt = yt),
					(k = Qt);
			}
			if (I === O.length) return l(T, k), pt && Xl(T, I), K;
			if (k === null) {
				for (; I < O.length; I++)
					(k = B(T, O[I], N)),
						k !== null &&
							((E = u(k, E, I)),
							rt === null ? (K = k) : (rt.sibling = k),
							(rt = k));
				return pt && Xl(T, I), K;
			}
			for (k = a(k); I < O.length; I++)
				(Qt = D(k, T, I, O[I], N)),
					Qt !== null &&
						(t &&
							Qt.alternate !== null &&
							k.delete(Qt.key === null ? I : Qt.key),
						(E = u(Qt, E, I)),
						rt === null ? (K = Qt) : (rt.sibling = Qt),
						(rt = Qt));
			return t && k.forEach((zl) => e(T, zl)), pt && Xl(T, I), K;
		}
		function F(T, E, O, N) {
			if (O == null) throw Error(o(151));
			for (
				var K = null, rt = null, k = E, I = (E = 0), Qt = null, yt = O.next();
				k !== null && !yt.done;
				I++, yt = O.next()
			) {
				k.index > I ? ((Qt = k), (k = null)) : (Qt = k.sibling);
				var zl = z(T, k, yt.value, N);
				if (zl === null) {
					k === null && (k = Qt);
					break;
				}
				t && k && zl.alternate === null && e(T, k),
					(E = u(zl, E, I)),
					rt === null ? (K = zl) : (rt.sibling = zl),
					(rt = zl),
					(k = Qt);
			}
			if (yt.done) return l(T, k), pt && Xl(T, I), K;
			if (k === null) {
				for (; !yt.done; I++, yt = O.next())
					(yt = B(T, yt.value, N)),
						yt !== null &&
							((E = u(yt, E, I)),
							rt === null ? (K = yt) : (rt.sibling = yt),
							(rt = yt));
				return pt && Xl(T, I), K;
			}
			for (k = a(k); !yt.done; I++, yt = O.next())
				(yt = D(k, T, I, yt.value, N)),
					yt !== null &&
						(t &&
							yt.alternate !== null &&
							k.delete(yt.key === null ? I : yt.key),
						(E = u(yt, E, I)),
						rt === null ? (K = yt) : (rt.sibling = yt),
						(rt = yt));
			return t && k.forEach((Y0) => e(T, Y0)), pt && Xl(T, I), K;
		}
		function Tt(T, E, O, N) {
			if (
				(typeof O == "object" &&
					O !== null &&
					O.type === A &&
					O.key === null &&
					(O = O.props.children),
				typeof O == "object" && O !== null)
			) {
				switch (O.$$typeof) {
					case _:
						t: {
							for (var K = O.key; E !== null; ) {
								if (E.key === K) {
									if (((K = O.type), K === A)) {
										if (E.tag === 7) {
											l(T, E.sibling),
												(N = n(E, O.props.children)),
												(N.return = T),
												(T = N);
											break t;
										}
									} else if (
										E.elementType === K ||
										(typeof K == "object" &&
											K !== null &&
											K.$$typeof === lt &&
											Bf(K) === E.type)
									) {
										l(T, E.sibling),
											(N = n(E, O.props)),
											Ln(N, O),
											(N.return = T),
											(T = N);
										break t;
									}
									l(T, E);
									break;
								} else e(T, E);
								E = E.sibling;
							}
							O.type === A
								? ((N = Gl(O.props.children, T.mode, N, O.key)),
									(N.return = T),
									(T = N))
								: ((N = zu(O.type, O.key, O.props, null, T.mode, N)),
									Ln(N, O),
									(N.return = T),
									(T = N));
						}
						return r(T);
					case M:
						t: {
							for (K = O.key; E !== null; ) {
								if (E.key === K)
									if (
										E.tag === 4 &&
										E.stateNode.containerInfo === O.containerInfo &&
										E.stateNode.implementation === O.implementation
									) {
										l(T, E.sibling),
											(N = n(E, O.children || [])),
											(N.return = T),
											(T = N);
										break t;
									} else {
										l(T, E);
										break;
									}
								else e(T, E);
								E = E.sibling;
							}
							(N = _c(O, T.mode, N)), (N.return = T), (T = N);
						}
						return r(T);
					case lt:
						return (K = O._init), (O = K(O._payload)), Tt(T, E, O, N);
				}
				if (Lt(O)) return tt(T, E, O, N);
				if (vt(O)) {
					if (((K = vt(O)), typeof K != "function")) throw Error(o(150));
					return (O = K.call(O)), F(T, E, O, N);
				}
				if (typeof O.then == "function") return Tt(T, E, Ku(O), N);
				if (O.$$typeof === X) return Tt(T, E, Lu(T, O), N);
				Ju(T, O);
			}
			return (typeof O == "string" && O !== "") ||
				typeof O == "number" ||
				typeof O == "bigint"
				? ((O = "" + O),
					E !== null && E.tag === 6
						? (l(T, E.sibling), (N = n(E, O)), (N.return = T), (T = N))
						: (l(T, E), (N = Sc(O, T.mode, N)), (N.return = T), (T = N)),
					r(T))
				: l(T, E);
		}
		return (T, E, O, N) => {
			try {
				Un = 0;
				var K = Tt(T, E, O, N);
				return (Da = null), K;
			} catch (k) {
				if (k === En || k === Bu) throw k;
				var rt = se(29, k, null, T.mode);
				return (rt.lanes = N), (rt.return = T), rt;
			} finally {
			}
		};
	}
	var Ca = Hf(!0),
		qf = Hf(!1),
		Te = q(null),
		He = null;
	function vl(t) {
		var e = t.alternate;
		w(Yt, Yt.current & 1),
			w(Te, t),
			He === null &&
				(e === null || Aa.current !== null || e.memoizedState !== null) &&
				(He = t);
	}
	function jf(t) {
		if (t.tag === 22) {
			if ((w(Yt, Yt.current), w(Te, t), He === null)) {
				var e = t.alternate;
				e !== null && e.memoizedState !== null && (He = t);
			}
		} else ml();
	}
	function ml() {
		w(Yt, Yt.current), w(Te, Te.current);
	}
	function Pe(t) {
		V(Te), He === t && (He = null), V(Yt);
	}
	var Yt = q(0);
	function ku(t) {
		for (var e = t; e !== null; ) {
			if (e.tag === 13) {
				var l = e.memoizedState;
				if (
					l !== null &&
					((l = l.dehydrated), l === null || l.data === "$?" || Xo(l))
				)
					return e;
			} else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
				if ((e.flags & 128) !== 0) return e;
			} else if (e.child !== null) {
				(e.child.return = e), (e = e.child);
				continue;
			}
			if (e === t) break;
			for (; e.sibling === null; ) {
				if (e.return === null || e.return === t) return null;
				e = e.return;
			}
			(e.sibling.return = e.return), (e = e.sibling);
		}
		return null;
	}
	function Ic(t, e, l, a) {
		(e = t.memoizedState),
			(l = l(a, e)),
			(l = l == null ? e : b({}, e, l)),
			(t.memoizedState = l),
			t.lanes === 0 && (t.updateQueue.baseState = l);
	}
	var to = {
		enqueueSetState: (t, e, l) => {
			t = t._reactInternals;
			var a = he(),
				n = fl(a);
			(n.payload = e),
				l != null && (n.callback = l),
				(e = dl(t, n, a)),
				e !== null && (ve(e, t, a), Mn(e, t, a));
		},
		enqueueReplaceState: (t, e, l) => {
			t = t._reactInternals;
			var a = he(),
				n = fl(a);
			(n.tag = 1),
				(n.payload = e),
				l != null && (n.callback = l),
				(e = dl(t, n, a)),
				e !== null && (ve(e, t, a), Mn(e, t, a));
		},
		enqueueForceUpdate: (t, e) => {
			t = t._reactInternals;
			var l = he(),
				a = fl(l);
			(a.tag = 2),
				e != null && (a.callback = e),
				(e = dl(t, a, l)),
				e !== null && (ve(e, t, l), Mn(e, t, l));
		},
	};
	function Yf(t, e, l, a, n, u, r) {
		return (
			(t = t.stateNode),
			typeof t.shouldComponentUpdate == "function"
				? t.shouldComponentUpdate(a, u, r)
				: e.prototype && e.prototype.isPureReactComponent
					? !mn(l, a) || !mn(n, u)
					: !0
		);
	}
	function wf(t, e, l, a) {
		(t = e.state),
			typeof e.componentWillReceiveProps == "function" &&
				e.componentWillReceiveProps(l, a),
			typeof e.UNSAFE_componentWillReceiveProps == "function" &&
				e.UNSAFE_componentWillReceiveProps(l, a),
			e.state !== t && to.enqueueReplaceState(e, e.state, null);
	}
	function Pl(t, e) {
		var l = e;
		if ("ref" in e) {
			l = {};
			for (var a in e) a !== "ref" && (l[a] = e[a]);
		}
		if ((t = t.defaultProps)) {
			l === e && (l = b({}, l));
			for (var n in t) l[n] === void 0 && (l[n] = t[n]);
		}
		return l;
	}
	var $u =
		typeof reportError == "function"
			? reportError
			: (t) => {
					if (
						typeof window == "object" &&
						typeof window.ErrorEvent == "function"
					) {
						var e = new window.ErrorEvent("error", {
							bubbles: !0,
							cancelable: !0,
							message:
								typeof t == "object" &&
								t !== null &&
								typeof t.message == "string"
									? String(t.message)
									: String(t),
							error: t,
						});
						if (!window.dispatchEvent(e)) return;
					} else if (
						typeof process == "object" &&
						typeof process.emit == "function"
					) {
						process.emit("uncaughtException", t);
						return;
					}
					console.error(t);
				};
	function Gf(t) {
		$u(t);
	}
	function Vf(t) {
		console.error(t);
	}
	function Xf(t) {
		$u(t);
	}
	function Pu(t, e) {
		try {
			var l = t.onUncaughtError;
			l(e.value, { componentStack: e.stack });
		} catch (a) {
			setTimeout(() => {
				throw a;
			});
		}
	}
	function Qf(t, e, l) {
		try {
			var a = t.onCaughtError;
			a(l.value, {
				componentStack: l.stack,
				errorBoundary: e.tag === 1 ? e.stateNode : null,
			});
		} catch (n) {
			setTimeout(() => {
				throw n;
			});
		}
	}
	function eo(t, e, l) {
		return (
			(l = fl(l)),
			(l.tag = 3),
			(l.payload = { element: null }),
			(l.callback = () => {
				Pu(t, e);
			}),
			l
		);
	}
	function Zf(t) {
		return (t = fl(t)), (t.tag = 3), t;
	}
	function Kf(t, e, l, a) {
		var n = l.type.getDerivedStateFromError;
		if (typeof n == "function") {
			var u = a.value;
			(t.payload = () => n(u)),
				(t.callback = () => {
					Qf(e, l, a);
				});
		}
		var r = l.stateNode;
		r !== null &&
			typeof r.componentDidCatch == "function" &&
			(t.callback = function () {
				Qf(e, l, a),
					typeof n != "function" &&
						(bl === null ? (bl = new Set([this])) : bl.add(this));
				var h = a.stack;
				this.componentDidCatch(a.value, {
					componentStack: h !== null ? h : "",
				});
			});
	}
	function Ym(t, e, l, a, n) {
		if (
			((l.flags |= 32768),
			a !== null && typeof a == "object" && typeof a.then == "function")
		) {
			if (
				((e = l.alternate),
				e !== null && _n(e, l, n, !0),
				(l = Te.current),
				l !== null)
			) {
				switch (l.tag) {
					case 13:
						return (
							He === null ? Ao() : l.alternate === null && Ut === 0 && (Ut = 3),
							(l.flags &= -257),
							(l.flags |= 65536),
							(l.lanes = n),
							a === Dc
								? (l.flags |= 16384)
								: ((e = l.updateQueue),
									e === null ? (l.updateQueue = new Set([a])) : e.add(a),
									xo(t, a, n)),
							!1
						);
					case 22:
						return (
							(l.flags |= 65536),
							a === Dc
								? (l.flags |= 16384)
								: ((e = l.updateQueue),
									e === null
										? ((e = {
												transitions: null,
												markerInstances: null,
												retryQueue: new Set([a]),
											}),
											(l.updateQueue = e))
										: ((l = e.retryQueue),
											l === null ? (e.retryQueue = new Set([a])) : l.add(a)),
									xo(t, a, n)),
							!1
						);
				}
				throw Error(o(435, l.tag));
			}
			return xo(t, a, n), Ao(), !1;
		}
		if (pt)
			return (
				(e = Te.current),
				e !== null
					? ((e.flags & 65536) === 0 && (e.flags |= 256),
						(e.flags |= 65536),
						(e.lanes = n),
						a !== Ec && ((t = Error(o(422), { cause: a })), Sn(_e(t, l))))
					: (a !== Ec && ((e = Error(o(423), { cause: a })), Sn(_e(e, l))),
						(t = t.current.alternate),
						(t.flags |= 65536),
						(n &= -n),
						(t.lanes |= n),
						(a = _e(a, l)),
						(n = eo(t.stateNode, a, n)),
						Lc(t, n),
						Ut !== 4 && (Ut = 2)),
				!1
			);
		var u = Error(o(520), { cause: a });
		if (
			((u = _e(u, l)),
			wn === null ? (wn = [u]) : wn.push(u),
			Ut !== 4 && (Ut = 2),
			e === null)
		)
			return !0;
		(a = _e(a, l)), (l = e);
		do {
			switch (l.tag) {
				case 3:
					return (
						(l.flags |= 65536),
						(t = n & -n),
						(l.lanes |= t),
						(t = eo(l.stateNode, a, t)),
						Lc(l, t),
						!1
					);
				case 1:
					if (
						((e = l.type),
						(u = l.stateNode),
						(l.flags & 128) === 0 &&
							(typeof e.getDerivedStateFromError == "function" ||
								(u !== null &&
									typeof u.componentDidCatch == "function" &&
									(bl === null || !bl.has(u)))))
					)
						return (
							(l.flags |= 65536),
							(n &= -n),
							(l.lanes |= n),
							(n = Zf(n)),
							Kf(n, t, l, a),
							Lc(l, n),
							!1
						);
			}
			l = l.return;
		} while (l !== null);
		return !1;
	}
	var Jf = Error(o(461)),
		Vt = !1;
	function Jt(t, e, l, a) {
		e.child = t === null ? qf(e, null, l, a) : Ca(e, t.child, l, a);
	}
	function kf(t, e, l, a, n) {
		l = l.render;
		var u = e.ref;
		if ("ref" in a) {
			var r = {};
			for (var h in a) h !== "ref" && (r[h] = a[h]);
		} else r = a;
		return (
			Jl(e),
			(a = jc(t, e, l, r, u, n)),
			(h = Yc()),
			t !== null && !Vt
				? (wc(t, e, n), We(t, e, n))
				: (pt && h && bc(e), (e.flags |= 1), Jt(t, e, a, n), e.child)
		);
	}
	function $f(t, e, l, a, n) {
		if (t === null) {
			var u = l.type;
			return typeof u == "function" &&
				!pc(u) &&
				u.defaultProps === void 0 &&
				l.compare === null
				? ((e.tag = 15), (e.type = u), Pf(t, e, u, a, n))
				: ((t = zu(l.type, null, a, e, e.mode, n)),
					(t.ref = e.ref),
					(t.return = e),
					(e.child = t));
		}
		if (((u = t.child), !so(t, n))) {
			var r = u.memoizedProps;
			if (
				((l = l.compare), (l = l !== null ? l : mn), l(r, a) && t.ref === e.ref)
			)
				return We(t, e, n);
		}
		return (
			(e.flags |= 1),
			(t = Qe(u, a)),
			(t.ref = e.ref),
			(t.return = e),
			(e.child = t)
		);
	}
	function Pf(t, e, l, a, n) {
		if (t !== null) {
			var u = t.memoizedProps;
			if (mn(u, a) && t.ref === e.ref)
				if (((Vt = !1), (e.pendingProps = a = u), so(t, n)))
					(t.flags & 131072) !== 0 && (Vt = !0);
				else return (e.lanes = t.lanes), We(t, e, n);
		}
		return lo(t, e, l, a, n);
	}
	function Wf(t, e, l) {
		var a = e.pendingProps,
			n = a.children,
			u = t !== null ? t.memoizedState : null;
		if (a.mode === "hidden") {
			if ((e.flags & 128) !== 0) {
				if (((a = u !== null ? u.baseLanes | l : l), t !== null)) {
					for (n = e.child = t.child, u = 0; n !== null; )
						(u = u | n.lanes | n.childLanes), (n = n.sibling);
					e.childLanes = u & ~a;
				} else (e.childLanes = 0), (e.child = null);
				return Ff(t, e, a, l);
			}
			if ((l & 536870912) !== 0)
				(e.memoizedState = { baseLanes: 0, cachePool: null }),
					t !== null && Nu(e, u !== null ? u.cachePool : null),
					u !== null ? $r(e, u) : Bc(),
					jf(e);
			else
				return (
					(e.lanes = e.childLanes = 536870912),
					Ff(t, e, u !== null ? u.baseLanes | l : l, l)
				);
		} else
			u !== null
				? (Nu(e, u.cachePool), $r(e, u), ml(), (e.memoizedState = null))
				: (t !== null && Nu(e, null), Bc(), ml());
		return Jt(t, e, n, l), e.child;
	}
	function Ff(t, e, l, a) {
		var n = zc();
		return (
			(n = n === null ? null : { parent: jt._currentValue, pool: n }),
			(e.memoizedState = { baseLanes: l, cachePool: n }),
			t !== null && Nu(e, null),
			Bc(),
			jf(e),
			t !== null && _n(t, e, a, !0),
			null
		);
	}
	function Wu(t, e) {
		var l = e.ref;
		if (l === null) t !== null && t.ref !== null && (e.flags |= 4194816);
		else {
			if (typeof l != "function" && typeof l != "object") throw Error(o(284));
			(t === null || t.ref !== l) && (e.flags |= 4194816);
		}
	}
	function lo(t, e, l, a, n) {
		return (
			Jl(e),
			(l = jc(t, e, l, a, void 0, n)),
			(a = Yc()),
			t !== null && !Vt
				? (wc(t, e, n), We(t, e, n))
				: (pt && a && bc(e), (e.flags |= 1), Jt(t, e, l, n), e.child)
		);
	}
	function If(t, e, l, a, n, u) {
		return (
			Jl(e),
			(e.updateQueue = null),
			(l = Wr(e, a, l, n)),
			Pr(t),
			(a = Yc()),
			t !== null && !Vt
				? (wc(t, e, u), We(t, e, u))
				: (pt && a && bc(e), (e.flags |= 1), Jt(t, e, l, u), e.child)
		);
	}
	function td(t, e, l, a, n) {
		if ((Jl(e), e.stateNode === null)) {
			var u = ba,
				r = l.contextType;
			typeof r == "object" && r !== null && (u = Wt(r)),
				(u = new l(a, u)),
				(e.memoizedState =
					u.state !== null && u.state !== void 0 ? u.state : null),
				(u.updater = to),
				(e.stateNode = u),
				(u._reactInternals = e),
				(u = e.stateNode),
				(u.props = a),
				(u.state = e.memoizedState),
				(u.refs = {}),
				Cc(e),
				(r = l.contextType),
				(u.context = typeof r == "object" && r !== null ? Wt(r) : ba),
				(u.state = e.memoizedState),
				(r = l.getDerivedStateFromProps),
				typeof r == "function" && (Ic(e, l, r, a), (u.state = e.memoizedState)),
				typeof l.getDerivedStateFromProps == "function" ||
					typeof u.getSnapshotBeforeUpdate == "function" ||
					(typeof u.UNSAFE_componentWillMount != "function" &&
						typeof u.componentWillMount != "function") ||
					((r = u.state),
					typeof u.componentWillMount == "function" && u.componentWillMount(),
					typeof u.UNSAFE_componentWillMount == "function" &&
						u.UNSAFE_componentWillMount(),
					r !== u.state && to.enqueueReplaceState(u, u.state, null),
					On(e, a, u, n),
					An(),
					(u.state = e.memoizedState)),
				typeof u.componentDidMount == "function" && (e.flags |= 4194308),
				(a = !0);
		} else if (t === null) {
			u = e.stateNode;
			var h = e.memoizedProps,
				S = Pl(l, h);
			u.props = S;
			var x = u.context,
				L = l.contextType;
			(r = ba), typeof L == "object" && L !== null && (r = Wt(L));
			var B = l.getDerivedStateFromProps;
			(L =
				typeof B == "function" ||
				typeof u.getSnapshotBeforeUpdate == "function"),
				(h = e.pendingProps !== h),
				L ||
					(typeof u.UNSAFE_componentWillReceiveProps != "function" &&
						typeof u.componentWillReceiveProps != "function") ||
					((h || x !== r) && wf(e, u, a, r)),
				(rl = !1);
			var z = e.memoizedState;
			(u.state = z),
				On(e, a, u, n),
				An(),
				(x = e.memoizedState),
				h || z !== x || rl
					? (typeof B == "function" && (Ic(e, l, B, a), (x = e.memoizedState)),
						(S = rl || Yf(e, l, S, a, z, x, r))
							? (L ||
									(typeof u.UNSAFE_componentWillMount != "function" &&
										typeof u.componentWillMount != "function") ||
									(typeof u.componentWillMount == "function" &&
										u.componentWillMount(),
									typeof u.UNSAFE_componentWillMount == "function" &&
										u.UNSAFE_componentWillMount()),
								typeof u.componentDidMount == "function" &&
									(e.flags |= 4194308))
							: (typeof u.componentDidMount == "function" &&
									(e.flags |= 4194308),
								(e.memoizedProps = a),
								(e.memoizedState = x)),
						(u.props = a),
						(u.state = x),
						(u.context = r),
						(a = S))
					: (typeof u.componentDidMount == "function" && (e.flags |= 4194308),
						(a = !1));
		} else {
			(u = e.stateNode),
				Uc(t, e),
				(r = e.memoizedProps),
				(L = Pl(l, r)),
				(u.props = L),
				(B = e.pendingProps),
				(z = u.context),
				(x = l.contextType),
				(S = ba),
				typeof x == "object" && x !== null && (S = Wt(x)),
				(h = l.getDerivedStateFromProps),
				(x =
					typeof h == "function" ||
					typeof u.getSnapshotBeforeUpdate == "function") ||
					(typeof u.UNSAFE_componentWillReceiveProps != "function" &&
						typeof u.componentWillReceiveProps != "function") ||
					((r !== B || z !== S) && wf(e, u, a, S)),
				(rl = !1),
				(z = e.memoizedState),
				(u.state = z),
				On(e, a, u, n),
				An();
			var D = e.memoizedState;
			r !== B ||
			z !== D ||
			rl ||
			(t !== null && t.dependencies !== null && Uu(t.dependencies))
				? (typeof h == "function" && (Ic(e, l, h, a), (D = e.memoizedState)),
					(L =
						rl ||
						Yf(e, l, L, a, z, D, S) ||
						(t !== null && t.dependencies !== null && Uu(t.dependencies)))
						? (x ||
								(typeof u.UNSAFE_componentWillUpdate != "function" &&
									typeof u.componentWillUpdate != "function") ||
								(typeof u.componentWillUpdate == "function" &&
									u.componentWillUpdate(a, D, S),
								typeof u.UNSAFE_componentWillUpdate == "function" &&
									u.UNSAFE_componentWillUpdate(a, D, S)),
							typeof u.componentDidUpdate == "function" && (e.flags |= 4),
							typeof u.getSnapshotBeforeUpdate == "function" &&
								(e.flags |= 1024))
						: (typeof u.componentDidUpdate != "function" ||
								(r === t.memoizedProps && z === t.memoizedState) ||
								(e.flags |= 4),
							typeof u.getSnapshotBeforeUpdate != "function" ||
								(r === t.memoizedProps && z === t.memoizedState) ||
								(e.flags |= 1024),
							(e.memoizedProps = a),
							(e.memoizedState = D)),
					(u.props = a),
					(u.state = D),
					(u.context = S),
					(a = L))
				: (typeof u.componentDidUpdate != "function" ||
						(r === t.memoizedProps && z === t.memoizedState) ||
						(e.flags |= 4),
					typeof u.getSnapshotBeforeUpdate != "function" ||
						(r === t.memoizedProps && z === t.memoizedState) ||
						(e.flags |= 1024),
					(a = !1));
		}
		return (
			(u = a),
			Wu(t, e),
			(a = (e.flags & 128) !== 0),
			u || a
				? ((u = e.stateNode),
					(l =
						a && typeof l.getDerivedStateFromError != "function"
							? null
							: u.render()),
					(e.flags |= 1),
					t !== null && a
						? ((e.child = Ca(e, t.child, null, n)),
							(e.child = Ca(e, null, l, n)))
						: Jt(t, e, l, n),
					(e.memoizedState = u.state),
					(t = e.child))
				: (t = We(t, e, n)),
			t
		);
	}
	function ed(t, e, l, a) {
		return pn(), (e.flags |= 256), Jt(t, e, l, a), e.child;
	}
	var ao = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null,
	};
	function no(t) {
		return { baseLanes: t, cachePool: Gr() };
	}
	function uo(t, e, l) {
		return (t = t !== null ? t.childLanes & ~l : 0), e && (t |= Me), t;
	}
	function ld(t, e, l) {
		var a = e.pendingProps,
			n = !1,
			u = (e.flags & 128) !== 0,
			r;
		if (
			((r = u) ||
				(r =
					t !== null && t.memoizedState === null ? !1 : (Yt.current & 2) !== 0),
			r && ((n = !0), (e.flags &= -129)),
			(r = (e.flags & 32) !== 0),
			(e.flags &= -33),
			t === null)
		) {
			if (pt) {
				if ((n ? vl(e) : ml(), pt)) {
					var h = Ct,
						S;
					if ((S = h)) {
						t: {
							for (S = h, h = Be; S.nodeType !== 8; ) {
								if (!h) {
									h = null;
									break t;
								}
								if (((S = Le(S.nextSibling)), S === null)) {
									h = null;
									break t;
								}
							}
							h = S;
						}
						h !== null
							? ((e.memoizedState = {
									dehydrated: h,
									treeContext: Vl !== null ? { id: Ze, overflow: Ke } : null,
									retryLane: 536870912,
									hydrationErrors: null,
								}),
								(S = se(18, null, null, 0)),
								(S.stateNode = h),
								(S.return = e),
								(e.child = S),
								(It = e),
								(Ct = null),
								(S = !0))
							: (S = !1);
					}
					S || Zl(e);
				}
				if (
					((h = e.memoizedState),
					h !== null && ((h = h.dehydrated), h !== null))
				)
					return Xo(h) ? (e.lanes = 32) : (e.lanes = 536870912), null;
				Pe(e);
			}
			return (
				(h = a.children),
				(a = a.fallback),
				n
					? (ml(),
						(n = e.mode),
						(h = Fu({ mode: "hidden", children: h }, n)),
						(a = Gl(a, n, l, null)),
						(h.return = e),
						(a.return = e),
						(h.sibling = a),
						(e.child = h),
						(n = e.child),
						(n.memoizedState = no(l)),
						(n.childLanes = uo(t, r, l)),
						(e.memoizedState = ao),
						a)
					: (vl(e), io(e, h))
			);
		}
		if (
			((S = t.memoizedState), S !== null && ((h = S.dehydrated), h !== null))
		) {
			if (u)
				e.flags & 256
					? (vl(e), (e.flags &= -257), (e = co(t, e, l)))
					: e.memoizedState !== null
						? (ml(), (e.child = t.child), (e.flags |= 128), (e = null))
						: (ml(),
							(n = a.fallback),
							(h = e.mode),
							(a = Fu({ mode: "visible", children: a.children }, h)),
							(n = Gl(n, h, l, null)),
							(n.flags |= 2),
							(a.return = e),
							(n.return = e),
							(a.sibling = n),
							(e.child = a),
							Ca(e, t.child, null, l),
							(a = e.child),
							(a.memoizedState = no(l)),
							(a.childLanes = uo(t, r, l)),
							(e.memoizedState = ao),
							(e = n));
			else if ((vl(e), Xo(h))) {
				if (((r = h.nextSibling && h.nextSibling.dataset), r)) var x = r.dgst;
				(r = x),
					(a = Error(o(419))),
					(a.stack = ""),
					(a.digest = r),
					Sn({ value: a, source: null, stack: null }),
					(e = co(t, e, l));
			} else if (
				(Vt || _n(t, e, l, !1), (r = (l & t.childLanes) !== 0), Vt || r)
			) {
				if (
					((r = At),
					r !== null &&
						((a = l & -l),
						(a = (a & 42) !== 0 ? 1 : Xi(a)),
						(a = (a & (r.suspendedLanes | l)) !== 0 ? 0 : a),
						a !== 0 && a !== S.retryLane))
				)
					throw ((S.retryLane = a), _a(t, a), ve(r, t, a), Jf);
				h.data === "$?" || Ao(), (e = co(t, e, l));
			} else
				h.data === "$?"
					? ((e.flags |= 192), (e.child = t.child), (e = null))
					: ((t = S.treeContext),
						(Ct = Le(h.nextSibling)),
						(It = e),
						(pt = !0),
						(Ql = null),
						(Be = !1),
						t !== null &&
							((Re[Ee++] = Ze),
							(Re[Ee++] = Ke),
							(Re[Ee++] = Vl),
							(Ze = t.id),
							(Ke = t.overflow),
							(Vl = e)),
						(e = io(e, a.children)),
						(e.flags |= 4096));
			return e;
		}
		return n
			? (ml(),
				(n = a.fallback),
				(h = e.mode),
				(S = t.child),
				(x = S.sibling),
				(a = Qe(S, { mode: "hidden", children: a.children })),
				(a.subtreeFlags = S.subtreeFlags & 65011712),
				x !== null ? (n = Qe(x, n)) : ((n = Gl(n, h, l, null)), (n.flags |= 2)),
				(n.return = e),
				(a.return = e),
				(a.sibling = n),
				(e.child = a),
				(a = n),
				(n = e.child),
				(h = t.child.memoizedState),
				h === null
					? (h = no(l))
					: ((S = h.cachePool),
						S !== null
							? ((x = jt._currentValue),
								(S = S.parent !== x ? { parent: x, pool: x } : S))
							: (S = Gr()),
						(h = { baseLanes: h.baseLanes | l, cachePool: S })),
				(n.memoizedState = h),
				(n.childLanes = uo(t, r, l)),
				(e.memoizedState = ao),
				a)
			: (vl(e),
				(l = t.child),
				(t = l.sibling),
				(l = Qe(l, { mode: "visible", children: a.children })),
				(l.return = e),
				(l.sibling = null),
				t !== null &&
					((r = e.deletions),
					r === null ? ((e.deletions = [t]), (e.flags |= 16)) : r.push(t)),
				(e.child = l),
				(e.memoizedState = null),
				l);
	}
	function io(t, e) {
		return (
			(e = Fu({ mode: "visible", children: e }, t.mode)),
			(e.return = t),
			(t.child = e)
		);
	}
	function Fu(t, e) {
		return (
			(t = se(22, t, null, e)),
			(t.lanes = 0),
			(t.stateNode = {
				_visibility: 1,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null,
			}),
			t
		);
	}
	function co(t, e, l) {
		return (
			Ca(e, t.child, null, l),
			(t = io(e, e.pendingProps.children)),
			(t.flags |= 2),
			(e.memoizedState = null),
			t
		);
	}
	function ad(t, e, l) {
		t.lanes |= e;
		var a = t.alternate;
		a !== null && (a.lanes |= e), Mc(t.return, e, l);
	}
	function oo(t, e, l, a, n) {
		var u = t.memoizedState;
		u === null
			? (t.memoizedState = {
					isBackwards: e,
					rendering: null,
					renderingStartTime: 0,
					last: a,
					tail: l,
					tailMode: n,
				})
			: ((u.isBackwards = e),
				(u.rendering = null),
				(u.renderingStartTime = 0),
				(u.last = a),
				(u.tail = l),
				(u.tailMode = n));
	}
	function nd(t, e, l) {
		var a = e.pendingProps,
			n = a.revealOrder,
			u = a.tail;
		if ((Jt(t, e, a.children, l), (a = Yt.current), (a & 2) !== 0))
			(a = (a & 1) | 2), (e.flags |= 128);
		else {
			if (t !== null && (t.flags & 128) !== 0)
				t: for (t = e.child; t !== null; ) {
					if (t.tag === 13) t.memoizedState !== null && ad(t, l, e);
					else if (t.tag === 19) ad(t, l, e);
					else if (t.child !== null) {
						(t.child.return = t), (t = t.child);
						continue;
					}
					if (t === e) break;
					for (; t.sibling === null; ) {
						if (t.return === null || t.return === e) break t;
						t = t.return;
					}
					(t.sibling.return = t.return), (t = t.sibling);
				}
			a &= 1;
		}
		switch ((w(Yt, a), n)) {
			case "forwards":
				for (l = e.child, n = null; l !== null; )
					(t = l.alternate),
						t !== null && ku(t) === null && (n = l),
						(l = l.sibling);
				(l = n),
					l === null
						? ((n = e.child), (e.child = null))
						: ((n = l.sibling), (l.sibling = null)),
					oo(e, !1, n, l, u);
				break;
			case "backwards":
				for (l = null, n = e.child, e.child = null; n !== null; ) {
					if (((t = n.alternate), t !== null && ku(t) === null)) {
						e.child = n;
						break;
					}
					(t = n.sibling), (n.sibling = l), (l = n), (n = t);
				}
				oo(e, !0, l, null, u);
				break;
			case "together":
				oo(e, !1, null, null, void 0);
				break;
			default:
				e.memoizedState = null;
		}
		return e.child;
	}
	function We(t, e, l) {
		if (
			(t !== null && (e.dependencies = t.dependencies),
			(_l |= e.lanes),
			(l & e.childLanes) === 0)
		)
			if (t !== null) {
				if ((_n(t, e, l, !1), (l & e.childLanes) === 0)) return null;
			} else return null;
		if (t !== null && e.child !== t.child) throw Error(o(153));
		if (e.child !== null) {
			for (
				t = e.child, l = Qe(t, t.pendingProps), e.child = l, l.return = e;
				t.sibling !== null;
			)
				(t = t.sibling),
					(l = l.sibling = Qe(t, t.pendingProps)),
					(l.return = e);
			l.sibling = null;
		}
		return e.child;
	}
	function so(t, e) {
		return (t.lanes & e) !== 0
			? !0
			: ((t = t.dependencies), !!(t !== null && Uu(t)));
	}
	function wm(t, e, l) {
		switch (e.tag) {
			case 3:
				gt(e, e.stateNode.containerInfo),
					sl(e, jt, t.memoizedState.cache),
					pn();
				break;
			case 27:
			case 5:
				Ll(e);
				break;
			case 4:
				gt(e, e.stateNode.containerInfo);
				break;
			case 10:
				sl(e, e.type, e.memoizedProps.value);
				break;
			case 13: {
				var a = e.memoizedState;
				if (a !== null)
					return a.dehydrated !== null
						? (vl(e), (e.flags |= 128), null)
						: (l & e.child.childLanes) !== 0
							? ld(t, e, l)
							: (vl(e), (t = We(t, e, l)), t !== null ? t.sibling : null);
				vl(e);
				break;
			}
			case 19: {
				var n = (t.flags & 128) !== 0;
				if (
					((a = (l & e.childLanes) !== 0),
					a || (_n(t, e, l, !1), (a = (l & e.childLanes) !== 0)),
					n)
				) {
					if (a) return nd(t, e, l);
					e.flags |= 128;
				}
				if (
					((n = e.memoizedState),
					n !== null &&
						((n.rendering = null), (n.tail = null), (n.lastEffect = null)),
					w(Yt, Yt.current),
					a)
				)
					break;
				return null;
			}
			case 22:
			case 23:
				return (e.lanes = 0), Wf(t, e, l);
			case 24:
				sl(e, jt, t.memoizedState.cache);
		}
		return We(t, e, l);
	}
	function ud(t, e, l) {
		if (t !== null)
			if (t.memoizedProps !== e.pendingProps) Vt = !0;
			else {
				if (!so(t, l) && (e.flags & 128) === 0) return (Vt = !1), wm(t, e, l);
				Vt = (t.flags & 131072) !== 0;
			}
		else (Vt = !1), pt && (e.flags & 1048576) !== 0 && Nr(e, Cu, e.index);
		switch (((e.lanes = 0), e.tag)) {
			case 16:
				t: {
					t = e.pendingProps;
					var a = e.elementType,
						n = a._init;
					if (((a = n(a._payload)), (e.type = a), typeof a == "function"))
						pc(a)
							? ((t = Pl(a, t)), (e.tag = 1), (e = td(null, e, a, t, l)))
							: ((e.tag = 0), (e = lo(null, e, a, t, l)));
					else {
						if (a != null) {
							if (((n = a.$$typeof), n === J)) {
								(e.tag = 11), (e = kf(null, e, a, t, l));
								break t;
							} else if (n === et) {
								(e.tag = 14), (e = $f(null, e, a, t, l));
								break t;
							}
						}
						throw ((e = zt(a) || a), Error(o(306, e, "")));
					}
				}
				return e;
			case 0:
				return lo(t, e, e.type, e.pendingProps, l);
			case 1:
				return (a = e.type), (n = Pl(a, e.pendingProps)), td(t, e, a, n, l);
			case 3:
				t: {
					if ((gt(e, e.stateNode.containerInfo), t === null))
						throw Error(o(387));
					a = e.pendingProps;
					var u = e.memoizedState;
					(n = u.element), Uc(t, e), On(e, a, null, l);
					var r = e.memoizedState;
					if (
						((a = r.cache),
						sl(e, jt, a),
						a !== u.cache && Ac(e, [jt], l, !0),
						An(),
						(a = r.element),
						u.isDehydrated)
					)
						if (
							((u = { element: a, isDehydrated: !1, cache: r.cache }),
							(e.updateQueue.baseState = u),
							(e.memoizedState = u),
							e.flags & 256)
						) {
							e = ed(t, e, a, l);
							break t;
						} else if (a !== n) {
							(n = _e(Error(o(424)), e)), Sn(n), (e = ed(t, e, a, l));
							break t;
						} else {
							switch (((t = e.stateNode.containerInfo), t.nodeType)) {
								case 9:
									t = t.body;
									break;
								default:
									t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
							}
							for (
								Ct = Le(t.firstChild),
									It = e,
									pt = !0,
									Ql = null,
									Be = !0,
									l = qf(e, null, a, l),
									e.child = l;
								l;
							)
								(l.flags = (l.flags & -3) | 4096), (l = l.sibling);
						}
					else {
						if ((pn(), a === n)) {
							e = We(t, e, l);
							break t;
						}
						Jt(t, e, a, l);
					}
					e = e.child;
				}
				return e;
			case 26:
				return (
					Wu(t, e),
					t === null
						? (l = sh(e.type, null, e.pendingProps, null))
							? (e.memoizedState = l)
							: pt ||
								((l = e.type),
								(t = e.pendingProps),
								(a = di(W.current).createElement(l)),
								(a[Pt] = e),
								(a[te] = t),
								$t(a, l, t),
								Gt(a),
								(e.stateNode = a))
						: (e.memoizedState = sh(
								e.type,
								t.memoizedProps,
								e.pendingProps,
								t.memoizedState,
							)),
					null
				);
			case 27:
				return (
					Ll(e),
					t === null &&
						pt &&
						((a = e.stateNode = ih(e.type, e.pendingProps, W.current)),
						(It = e),
						(Be = !0),
						(n = Ct),
						Tl(e.type) ? ((Qo = n), (Ct = Le(a.firstChild))) : (Ct = n)),
					Jt(t, e, e.pendingProps.children, l),
					Wu(t, e),
					t === null && (e.flags |= 4194304),
					e.child
				);
			case 5:
				return (
					t === null &&
						pt &&
						((n = a = Ct) &&
							((a = v0(a, e.type, e.pendingProps, Be)),
							a !== null
								? ((e.stateNode = a),
									(It = e),
									(Ct = Le(a.firstChild)),
									(Be = !1),
									(n = !0))
								: (n = !1)),
						n || Zl(e)),
					Ll(e),
					(n = e.type),
					(u = e.pendingProps),
					(r = t !== null ? t.memoizedProps : null),
					(a = u.children),
					wo(n, u) ? (a = null) : r !== null && wo(n, r) && (e.flags |= 32),
					e.memoizedState !== null &&
						((n = jc(t, e, Um, null, null, l)), ($n._currentValue = n)),
					Wu(t, e),
					Jt(t, e, a, l),
					e.child
				);
			case 6:
				return (
					t === null &&
						pt &&
						((t = l = Ct) &&
							((l = m0(l, e.pendingProps, Be)),
							l !== null
								? ((e.stateNode = l), (It = e), (Ct = null), (t = !0))
								: (t = !1)),
						t || Zl(e)),
					null
				);
			case 13:
				return ld(t, e, l);
			case 4:
				return (
					gt(e, e.stateNode.containerInfo),
					(a = e.pendingProps),
					t === null ? (e.child = Ca(e, null, a, l)) : Jt(t, e, a, l),
					e.child
				);
			case 11:
				return kf(t, e, e.type, e.pendingProps, l);
			case 7:
				return Jt(t, e, e.pendingProps, l), e.child;
			case 8:
				return Jt(t, e, e.pendingProps.children, l), e.child;
			case 12:
				return Jt(t, e, e.pendingProps.children, l), e.child;
			case 10:
				return (
					(a = e.pendingProps),
					sl(e, e.type, a.value),
					Jt(t, e, a.children, l),
					e.child
				);
			case 9:
				return (
					(n = e.type._context),
					(a = e.pendingProps.children),
					Jl(e),
					(n = Wt(n)),
					(a = a(n)),
					(e.flags |= 1),
					Jt(t, e, a, l),
					e.child
				);
			case 14:
				return $f(t, e, e.type, e.pendingProps, l);
			case 15:
				return Pf(t, e, e.type, e.pendingProps, l);
			case 19:
				return nd(t, e, l);
			case 31:
				return (
					(a = e.pendingProps),
					(l = e.mode),
					(a = { mode: a.mode, children: a.children }),
					t === null
						? ((l = Fu(a, l)),
							(l.ref = e.ref),
							(e.child = l),
							(l.return = e),
							(e = l))
						: ((l = Qe(t.child, a)),
							(l.ref = e.ref),
							(e.child = l),
							(l.return = e),
							(e = l)),
					e
				);
			case 22:
				return Wf(t, e, l);
			case 24:
				return (
					Jl(e),
					(a = Wt(jt)),
					t === null
						? ((n = zc()),
							n === null &&
								((n = At),
								(u = Oc()),
								(n.pooledCache = u),
								u.refCount++,
								u !== null && (n.pooledCacheLanes |= l),
								(n = u)),
							(e.memoizedState = { parent: a, cache: n }),
							Cc(e),
							sl(e, jt, n))
						: ((t.lanes & l) !== 0 && (Uc(t, e), On(e, null, null, l), An()),
							(n = t.memoizedState),
							(u = e.memoizedState),
							n.parent !== a
								? ((n = { parent: a, cache: a }),
									(e.memoizedState = n),
									e.lanes === 0 &&
										(e.memoizedState = e.updateQueue.baseState = n),
									sl(e, jt, a))
								: ((a = u.cache),
									sl(e, jt, a),
									a !== n.cache && Ac(e, [jt], l, !0))),
					Jt(t, e, e.pendingProps.children, l),
					e.child
				);
			case 29:
				throw e.pendingProps;
		}
		throw Error(o(156, e.tag));
	}
	function Fe(t) {
		t.flags |= 4;
	}
	function id(t, e) {
		if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
			t.flags &= -16777217;
		else if (((t.flags |= 16777216), !vh(e))) {
			if (
				((e = Te.current),
				e !== null &&
					((mt & 4194048) === mt
						? He !== null
						: ((mt & 62914560) !== mt && (mt & 536870912) === 0) || e !== He))
			)
				throw ((Tn = Dc), Vr);
			t.flags |= 8192;
		}
	}
	function Iu(t, e) {
		e !== null && (t.flags |= 4),
			t.flags & 16384 &&
				((e = t.tag !== 22 ? qs() : 536870912), (t.lanes |= e), (Ba |= e));
	}
	function Nn(t, e) {
		if (!pt)
			switch (t.tailMode) {
				case "hidden":
					e = t.tail;
					for (var l = null; e !== null; )
						e.alternate !== null && (l = e), (e = e.sibling);
					l === null ? (t.tail = null) : (l.sibling = null);
					break;
				case "collapsed":
					l = t.tail;
					for (var a = null; l !== null; )
						l.alternate !== null && (a = l), (l = l.sibling);
					a === null
						? e || t.tail === null
							? (t.tail = null)
							: (t.tail.sibling = null)
						: (a.sibling = null);
			}
	}
	function Dt(t) {
		var e = t.alternate !== null && t.alternate.child === t.child,
			l = 0,
			a = 0;
		if (e)
			for (var n = t.child; n !== null; )
				(l |= n.lanes | n.childLanes),
					(a |= n.subtreeFlags & 65011712),
					(a |= n.flags & 65011712),
					(n.return = t),
					(n = n.sibling);
		else
			for (n = t.child; n !== null; )
				(l |= n.lanes | n.childLanes),
					(a |= n.subtreeFlags),
					(a |= n.flags),
					(n.return = t),
					(n = n.sibling);
		return (t.subtreeFlags |= a), (t.childLanes = l), e;
	}
	function Gm(t, e, l) {
		var a = e.pendingProps;
		switch ((Rc(e), e.tag)) {
			case 31:
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14:
				return Dt(e), null;
			case 1:
				return Dt(e), null;
			case 3:
				return (
					(l = e.stateNode),
					(a = null),
					t !== null && (a = t.memoizedState.cache),
					e.memoizedState.cache !== a && (e.flags |= 2048),
					ke(jt),
					me(),
					l.pendingContext &&
						((l.context = l.pendingContext), (l.pendingContext = null)),
					(t === null || t.child === null) &&
						(gn(e)
							? Fe(e)
							: t === null ||
								(t.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
								((e.flags |= 1024), qr())),
					Dt(e),
					null
				);
			case 26:
				return (
					(l = e.memoizedState),
					t === null
						? (Fe(e),
							l !== null ? (Dt(e), id(e, l)) : (Dt(e), (e.flags &= -16777217)))
						: l
							? l !== t.memoizedState
								? (Fe(e), Dt(e), id(e, l))
								: (Dt(e), (e.flags &= -16777217))
							: (t.memoizedProps !== a && Fe(e), Dt(e), (e.flags &= -16777217)),
					null
				);
			case 27: {
				ye(e), (l = W.current);
				var n = e.type;
				if (t !== null && e.stateNode != null) t.memoizedProps !== a && Fe(e);
				else {
					if (!a) {
						if (e.stateNode === null) throw Error(o(166));
						return Dt(e), null;
					}
					(t = $.current),
						gn(e) ? Br(e) : ((t = ih(n, a, l)), (e.stateNode = t), Fe(e));
				}
				return Dt(e), null;
			}
			case 5:
				if ((ye(e), (l = e.type), t !== null && e.stateNode != null))
					t.memoizedProps !== a && Fe(e);
				else {
					if (!a) {
						if (e.stateNode === null) throw Error(o(166));
						return Dt(e), null;
					}
					if (((t = $.current), gn(e))) Br(e);
					else {
						switch (((n = di(W.current)), t)) {
							case 1:
								t = n.createElementNS("http://www.w3.org/2000/svg", l);
								break;
							case 2:
								t = n.createElementNS("http://www.w3.org/1998/Math/MathML", l);
								break;
							default:
								switch (l) {
									case "svg":
										t = n.createElementNS("http://www.w3.org/2000/svg", l);
										break;
									case "math":
										t = n.createElementNS(
											"http://www.w3.org/1998/Math/MathML",
											l,
										);
										break;
									case "script":
										(t = n.createElement("div")),
											(t.innerHTML = "<script></script>"),
											(t = t.removeChild(t.firstChild));
										break;
									case "select":
										(t =
											typeof a.is == "string"
												? n.createElement("select", { is: a.is })
												: n.createElement("select")),
											a.multiple
												? (t.multiple = !0)
												: a.size && (t.size = a.size);
										break;
									default:
										t =
											typeof a.is == "string"
												? n.createElement(l, { is: a.is })
												: n.createElement(l);
								}
						}
						(t[Pt] = e), (t[te] = a);
						t: for (n = e.child; n !== null; ) {
							if (n.tag === 5 || n.tag === 6) t.appendChild(n.stateNode);
							else if (n.tag !== 4 && n.tag !== 27 && n.child !== null) {
								(n.child.return = n), (n = n.child);
								continue;
							}
							if (n === e) break;
							for (; n.sibling === null; ) {
								if (n.return === null || n.return === e) break t;
								n = n.return;
							}
							(n.sibling.return = n.return), (n = n.sibling);
						}
						e.stateNode = t;
						switch (($t(t, l, a), l)) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								t = !!a.autoFocus;
								break;
							case "img":
								t = !0;
								break;
							default:
								t = !1;
						}
						t && Fe(e);
					}
				}
				return Dt(e), (e.flags &= -16777217), null;
			case 6:
				if (t && e.stateNode != null) t.memoizedProps !== a && Fe(e);
				else {
					if (typeof a != "string" && e.stateNode === null) throw Error(o(166));
					if (((t = W.current), gn(e))) {
						if (
							((t = e.stateNode),
							(l = e.memoizedProps),
							(a = null),
							(n = It),
							n !== null)
						)
							switch (n.tag) {
								case 27:
								case 5:
									a = n.memoizedProps;
							}
						(t[Pt] = e),
							(t = !!(
								t.nodeValue === l ||
								(a !== null && a.suppressHydrationWarning === !0) ||
								Id(t.nodeValue, l)
							)),
							t || Zl(e);
					} else (t = di(t).createTextNode(a)), (t[Pt] = e), (e.stateNode = t);
				}
				return Dt(e), null;
			case 13:
				if (
					((a = e.memoizedState),
					t === null ||
						(t.memoizedState !== null && t.memoizedState.dehydrated !== null))
				) {
					if (((n = gn(e)), a !== null && a.dehydrated !== null)) {
						if (t === null) {
							if (!n) throw Error(o(318));
							if (
								((n = e.memoizedState),
								(n = n !== null ? n.dehydrated : null),
								!n)
							)
								throw Error(o(317));
							n[Pt] = e;
						} else
							pn(),
								(e.flags & 128) === 0 && (e.memoizedState = null),
								(e.flags |= 4);
						Dt(e), (n = !1);
					} else
						(n = qr()),
							t !== null &&
								t.memoizedState !== null &&
								(t.memoizedState.hydrationErrors = n),
							(n = !0);
					if (!n) return e.flags & 256 ? (Pe(e), e) : (Pe(e), null);
				}
				if ((Pe(e), (e.flags & 128) !== 0)) return (e.lanes = l), e;
				if (
					((l = a !== null), (t = t !== null && t.memoizedState !== null), l)
				) {
					(a = e.child),
						(n = null),
						a.alternate !== null &&
							a.alternate.memoizedState !== null &&
							a.alternate.memoizedState.cachePool !== null &&
							(n = a.alternate.memoizedState.cachePool.pool);
					var u = null;
					a.memoizedState !== null &&
						a.memoizedState.cachePool !== null &&
						(u = a.memoizedState.cachePool.pool),
						u !== n && (a.flags |= 2048);
				}
				return (
					l !== t && l && (e.child.flags |= 8192),
					Iu(e, e.updateQueue),
					Dt(e),
					null
				);
			case 4:
				return me(), t === null && Bo(e.stateNode.containerInfo), Dt(e), null;
			case 10:
				return ke(e.type), Dt(e), null;
			case 19:
				if ((V(Yt), (n = e.memoizedState), n === null)) return Dt(e), null;
				if (((a = (e.flags & 128) !== 0), (u = n.rendering), u === null))
					if (a) Nn(n, !1);
					else {
						if (Ut !== 0 || (t !== null && (t.flags & 128) !== 0))
							for (t = e.child; t !== null; ) {
								if (((u = ku(t)), u !== null)) {
									for (
										e.flags |= 128,
											Nn(n, !1),
											t = u.updateQueue,
											e.updateQueue = t,
											Iu(e, t),
											e.subtreeFlags = 0,
											t = l,
											l = e.child;
										l !== null;
									)
										Lr(l, t), (l = l.sibling);
									return w(Yt, (Yt.current & 1) | 2), e.child;
								}
								t = t.sibling;
							}
						n.tail !== null &&
							ge() > li &&
							((e.flags |= 128), (a = !0), Nn(n, !1), (e.lanes = 4194304));
					}
				else {
					if (!a)
						if (((t = ku(u)), t !== null)) {
							if (
								((e.flags |= 128),
								(a = !0),
								(t = t.updateQueue),
								(e.updateQueue = t),
								Iu(e, t),
								Nn(n, !0),
								n.tail === null &&
									n.tailMode === "hidden" &&
									!u.alternate &&
									!pt)
							)
								return Dt(e), null;
						} else
							2 * ge() - n.renderingStartTime > li &&
								l !== 536870912 &&
								((e.flags |= 128), (a = !0), Nn(n, !1), (e.lanes = 4194304));
					n.isBackwards
						? ((u.sibling = e.child), (e.child = u))
						: ((t = n.last),
							t !== null ? (t.sibling = u) : (e.child = u),
							(n.last = u));
				}
				return n.tail !== null
					? ((e = n.tail),
						(n.rendering = e),
						(n.tail = e.sibling),
						(n.renderingStartTime = ge()),
						(e.sibling = null),
						(t = Yt.current),
						w(Yt, a ? (t & 1) | 2 : t & 1),
						e)
					: (Dt(e), null);
			case 22:
			case 23:
				return (
					Pe(e),
					Hc(),
					(a = e.memoizedState !== null),
					t !== null
						? (t.memoizedState !== null) !== a && (e.flags |= 8192)
						: a && (e.flags |= 8192),
					a
						? (l & 536870912) !== 0 &&
							(e.flags & 128) === 0 &&
							(Dt(e), e.subtreeFlags & 6 && (e.flags |= 8192))
						: Dt(e),
					(l = e.updateQueue),
					l !== null && Iu(e, l.retryQueue),
					(l = null),
					t !== null &&
						t.memoizedState !== null &&
						t.memoizedState.cachePool !== null &&
						(l = t.memoizedState.cachePool.pool),
					(a = null),
					e.memoizedState !== null &&
						e.memoizedState.cachePool !== null &&
						(a = e.memoizedState.cachePool.pool),
					a !== l && (e.flags |= 2048),
					t !== null && V(kl),
					null
				);
			case 24:
				return (
					(l = null),
					t !== null && (l = t.memoizedState.cache),
					e.memoizedState.cache !== l && (e.flags |= 2048),
					ke(jt),
					Dt(e),
					null
				);
			case 25:
				return null;
			case 30:
				return null;
		}
		throw Error(o(156, e.tag));
	}
	function Vm(t, e) {
		switch ((Rc(e), e.tag)) {
			case 1:
				return (
					(t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
				);
			case 3:
				return (
					ke(jt),
					me(),
					(t = e.flags),
					(t & 65536) !== 0 && (t & 128) === 0
						? ((e.flags = (t & -65537) | 128), e)
						: null
				);
			case 26:
			case 27:
			case 5:
				return ye(e), null;
			case 13:
				if (
					(Pe(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)
				) {
					if (e.alternate === null) throw Error(o(340));
					pn();
				}
				return (
					(t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
				);
			case 19:
				return V(Yt), null;
			case 4:
				return me(), null;
			case 10:
				return ke(e.type), null;
			case 22:
			case 23:
				return (
					Pe(e),
					Hc(),
					t !== null && V(kl),
					(t = e.flags),
					t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
				);
			case 24:
				return ke(jt), null;
			case 25:
				return null;
			default:
				return null;
		}
	}
	function cd(t, e) {
		switch ((Rc(e), e.tag)) {
			case 3:
				ke(jt), me();
				break;
			case 26:
			case 27:
			case 5:
				ye(e);
				break;
			case 4:
				me();
				break;
			case 13:
				Pe(e);
				break;
			case 19:
				V(Yt);
				break;
			case 10:
				ke(e.type);
				break;
			case 22:
			case 23:
				Pe(e), Hc(), t !== null && V(kl);
				break;
			case 24:
				ke(jt);
		}
	}
	function Bn(t, e) {
		try {
			var l = e.updateQueue,
				a = l !== null ? l.lastEffect : null;
			if (a !== null) {
				var n = a.next;
				l = n;
				do {
					if ((l.tag & t) === t) {
						a = void 0;
						var u = l.create,
							r = l.inst;
						(a = u()), (r.destroy = a);
					}
					l = l.next;
				} while (l !== n);
			}
		} catch (h) {
			Mt(e, e.return, h);
		}
	}
	function yl(t, e, l) {
		try {
			var a = e.updateQueue,
				n = a !== null ? a.lastEffect : null;
			if (n !== null) {
				var u = n.next;
				a = u;
				do {
					if ((a.tag & t) === t) {
						var r = a.inst,
							h = r.destroy;
						if (h !== void 0) {
							(r.destroy = void 0), (n = e);
							var S = l,
								x = h;
							try {
								x();
							} catch (L) {
								Mt(n, S, L);
							}
						}
					}
					a = a.next;
				} while (a !== u);
			}
		} catch (L) {
			Mt(e, e.return, L);
		}
	}
	function od(t) {
		var e = t.updateQueue;
		if (e !== null) {
			var l = t.stateNode;
			try {
				kr(e, l);
			} catch (a) {
				Mt(t, t.return, a);
			}
		}
	}
	function sd(t, e, l) {
		(l.props = Pl(t.type, t.memoizedProps)), (l.state = t.memoizedState);
		try {
			l.componentWillUnmount();
		} catch (a) {
			Mt(t, e, a);
		}
	}
	function Hn(t, e) {
		try {
			var l = t.ref;
			if (l !== null) {
				switch (t.tag) {
					case 26:
					case 27:
					case 5: {
						var a = t.stateNode;
						break;
					}
					case 30:
						a = t.stateNode;
						break;
					default:
						a = t.stateNode;
				}
				typeof l == "function" ? (t.refCleanup = l(a)) : (l.current = a);
			}
		} catch (n) {
			Mt(t, e, n);
		}
	}
	function qe(t, e) {
		var l = t.ref,
			a = t.refCleanup;
		if (l !== null)
			if (typeof a == "function")
				try {
					a();
				} catch (n) {
					Mt(t, e, n);
				} finally {
					(t.refCleanup = null),
						(t = t.alternate),
						t != null && (t.refCleanup = null);
				}
			else if (typeof l == "function")
				try {
					l(null);
				} catch (n) {
					Mt(t, e, n);
				}
			else l.current = null;
	}
	function rd(t) {
		var e = t.type,
			l = t.memoizedProps,
			a = t.stateNode;
		try {
			switch (e) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					l.autoFocus && a.focus();
					break;
				case "img":
					l.src ? (a.src = l.src) : l.srcSet && (a.srcset = l.srcSet);
			}
		} catch (n) {
			Mt(t, t.return, n);
		}
	}
	function ro(t, e, l) {
		try {
			var a = t.stateNode;
			s0(a, t.type, l, e), (a[te] = e);
		} catch (n) {
			Mt(t, t.return, n);
		}
	}
	function fd(t) {
		return (
			t.tag === 5 ||
			t.tag === 3 ||
			t.tag === 26 ||
			(t.tag === 27 && Tl(t.type)) ||
			t.tag === 4
		);
	}
	function fo(t) {
		t: for (;;) {
			for (; t.sibling === null; ) {
				if (t.return === null || fd(t.return)) return null;
				t = t.return;
			}
			for (
				t.sibling.return = t.return, t = t.sibling;
				t.tag !== 5 && t.tag !== 6 && t.tag !== 18;
			) {
				if (
					(t.tag === 27 && Tl(t.type)) ||
					t.flags & 2 ||
					t.child === null ||
					t.tag === 4
				)
					continue t;
				(t.child.return = t), (t = t.child);
			}
			if (!(t.flags & 2)) return t.stateNode;
		}
	}
	function ho(t, e, l) {
		var a = t.tag;
		if (a === 5 || a === 6)
			(t = t.stateNode),
				e
					? (l.nodeType === 9
							? l.body
							: l.nodeName === "HTML"
								? l.ownerDocument.body
								: l
						).insertBefore(t, e)
					: ((e =
							l.nodeType === 9
								? l.body
								: l.nodeName === "HTML"
									? l.ownerDocument.body
									: l),
						e.appendChild(t),
						(l = l._reactRootContainer),
						l != null || e.onclick !== null || (e.onclick = fi));
		else if (
			a !== 4 &&
			(a === 27 && Tl(t.type) && ((l = t.stateNode), (e = null)),
			(t = t.child),
			t !== null)
		)
			for (ho(t, e, l), t = t.sibling; t !== null; )
				ho(t, e, l), (t = t.sibling);
	}
	function ti(t, e, l) {
		var a = t.tag;
		if (a === 5 || a === 6)
			(t = t.stateNode), e ? l.insertBefore(t, e) : l.appendChild(t);
		else if (
			a !== 4 &&
			(a === 27 && Tl(t.type) && (l = t.stateNode), (t = t.child), t !== null)
		)
			for (ti(t, e, l), t = t.sibling; t !== null; )
				ti(t, e, l), (t = t.sibling);
	}
	function dd(t) {
		var e = t.stateNode,
			l = t.memoizedProps;
		try {
			for (var a = t.type, n = e.attributes; n.length; )
				e.removeAttributeNode(n[0]);
			$t(e, a, l), (e[Pt] = t), (e[te] = l);
		} catch (u) {
			Mt(t, t.return, u);
		}
	}
	var Ie = !1,
		Bt = !1,
		vo = !1,
		hd = typeof WeakSet == "function" ? WeakSet : Set,
		Xt = null;
	function Xm(t, e) {
		if (((t = t.containerInfo), (jo = pi), (t = Er(t)), fc(t))) {
			if ("selectionStart" in t)
				var l = { start: t.selectionStart, end: t.selectionEnd };
			else
				t: {
					l = ((l = t.ownerDocument) && l.defaultView) || window;
					var a = l.getSelection && l.getSelection();
					if (a && a.rangeCount !== 0) {
						l = a.anchorNode;
						var n = a.anchorOffset,
							u = a.focusNode;
						a = a.focusOffset;
						try {
							l.nodeType, u.nodeType;
						} catch {
							l = null;
							break t;
						}
						var r = 0,
							h = -1,
							S = -1,
							x = 0,
							L = 0,
							B = t,
							z = null;
						e: for (;;) {
							for (
								var D;
								B !== l || (n !== 0 && B.nodeType !== 3) || (h = r + n),
									B !== u || (a !== 0 && B.nodeType !== 3) || (S = r + a),
									B.nodeType === 3 && (r += B.nodeValue.length),
									(D = B.firstChild) !== null;
							)
								(z = B), (B = D);
							for (;;) {
								if (B === t) break e;
								if (
									(z === l && ++x === n && (h = r),
									z === u && ++L === a && (S = r),
									(D = B.nextSibling) !== null)
								)
									break;
								(B = z), (z = B.parentNode);
							}
							B = D;
						}
						l = h === -1 || S === -1 ? null : { start: h, end: S };
					} else l = null;
				}
			l = l || { start: 0, end: 0 };
		} else l = null;
		for (
			Yo = { focusedElem: t, selectionRange: l }, pi = !1, Xt = e;
			Xt !== null;
		)
			if (
				((e = Xt), (t = e.child), (e.subtreeFlags & 1024) !== 0 && t !== null)
			)
				(t.return = e), (Xt = t);
			else
				for (; Xt !== null; ) {
					switch (((e = Xt), (u = e.alternate), (t = e.flags), e.tag)) {
						case 0:
							break;
						case 11:
						case 15:
							break;
						case 1:
							if ((t & 1024) !== 0 && u !== null) {
								(t = void 0),
									(l = e),
									(n = u.memoizedProps),
									(u = u.memoizedState),
									(a = l.stateNode);
								try {
									var tt = Pl(l.type, n, l.elementType === l.type);
									(t = a.getSnapshotBeforeUpdate(tt, u)),
										(a.__reactInternalSnapshotBeforeUpdate = t);
								} catch (F) {
									Mt(l, l.return, F);
								}
							}
							break;
						case 3:
							if ((t & 1024) !== 0) {
								if (
									((t = e.stateNode.containerInfo), (l = t.nodeType), l === 9)
								)
									Vo(t);
								else if (l === 1)
									switch (t.nodeName) {
										case "HEAD":
										case "HTML":
										case "BODY":
											Vo(t);
											break;
										default:
											t.textContent = "";
									}
							}
							break;
						case 5:
						case 26:
						case 27:
						case 6:
						case 4:
						case 17:
							break;
						default:
							if ((t & 1024) !== 0) throw Error(o(163));
					}
					if (((t = e.sibling), t !== null)) {
						(t.return = e.return), (Xt = t);
						break;
					}
					Xt = e.return;
				}
	}
	function vd(t, e, l) {
		var a = l.flags;
		switch (l.tag) {
			case 0:
			case 11:
			case 15:
				gl(t, l), a & 4 && Bn(5, l);
				break;
			case 1:
				if ((gl(t, l), a & 4))
					if (((t = l.stateNode), e === null))
						try {
							t.componentDidMount();
						} catch (r) {
							Mt(l, l.return, r);
						}
					else {
						var n = Pl(l.type, e.memoizedProps);
						e = e.memoizedState;
						try {
							t.componentDidUpdate(n, e, t.__reactInternalSnapshotBeforeUpdate);
						} catch (r) {
							Mt(l, l.return, r);
						}
					}
				a & 64 && od(l), a & 512 && Hn(l, l.return);
				break;
			case 3:
				if ((gl(t, l), a & 64 && ((t = l.updateQueue), t !== null))) {
					if (((e = null), l.child !== null))
						switch (l.child.tag) {
							case 27:
							case 5:
								e = l.child.stateNode;
								break;
							case 1:
								e = l.child.stateNode;
						}
					try {
						kr(t, e);
					} catch (r) {
						Mt(l, l.return, r);
					}
				}
				break;
			case 27:
				e === null && a & 4 && dd(l);
			case 26:
			case 5:
				gl(t, l), e === null && a & 4 && rd(l), a & 512 && Hn(l, l.return);
				break;
			case 12:
				gl(t, l);
				break;
			case 13:
				gl(t, l),
					a & 4 && gd(t, l),
					a & 64 &&
						((t = l.memoizedState),
						t !== null &&
							((t = t.dehydrated),
							t !== null && ((l = Fm.bind(null, l)), y0(t, l))));
				break;
			case 22:
				if (((a = l.memoizedState !== null || Ie), !a)) {
					(e = (e !== null && e.memoizedState !== null) || Bt), (n = Ie);
					var u = Bt;
					(Ie = a),
						(Bt = e) && !u ? pl(t, l, (l.subtreeFlags & 8772) !== 0) : gl(t, l),
						(Ie = n),
						(Bt = u);
				}
				break;
			case 30:
				break;
			default:
				gl(t, l);
		}
	}
	function md(t) {
		var e = t.alternate;
		e !== null && ((t.alternate = null), md(e)),
			(t.child = null),
			(t.deletions = null),
			(t.sibling = null),
			t.tag === 5 && ((e = t.stateNode), e !== null && Ki(e)),
			(t.stateNode = null),
			(t.return = null),
			(t.dependencies = null),
			(t.memoizedProps = null),
			(t.memoizedState = null),
			(t.pendingProps = null),
			(t.stateNode = null),
			(t.updateQueue = null);
	}
	var xt = null,
		ae = !1;
	function tl(t, e, l) {
		for (l = l.child; l !== null; ) yd(t, e, l), (l = l.sibling);
	}
	function yd(t, e, l) {
		if (ie && typeof ie.onCommitFiberUnmount == "function")
			try {
				ie.onCommitFiberUnmount(ln, l);
			} catch {}
		switch (l.tag) {
			case 26:
				Bt || qe(l, e),
					tl(t, e, l),
					l.memoizedState
						? l.memoizedState.count--
						: l.stateNode && ((l = l.stateNode), l.parentNode.removeChild(l));
				break;
			case 27: {
				Bt || qe(l, e);
				var a = xt,
					n = ae;
				Tl(l.type) && ((xt = l.stateNode), (ae = !1)),
					tl(t, e, l),
					Zn(l.stateNode),
					(xt = a),
					(ae = n);
				break;
			}
			case 5:
				Bt || qe(l, e);
			case 6:
				if (
					((a = xt),
					(n = ae),
					(xt = null),
					tl(t, e, l),
					(xt = a),
					(ae = n),
					xt !== null)
				)
					if (ae)
						try {
							(xt.nodeType === 9
								? xt.body
								: xt.nodeName === "HTML"
									? xt.ownerDocument.body
									: xt
							).removeChild(l.stateNode);
						} catch (u) {
							Mt(l, e, u);
						}
					else
						try {
							xt.removeChild(l.stateNode);
						} catch (u) {
							Mt(l, e, u);
						}
				break;
			case 18:
				xt !== null &&
					(ae
						? ((t = xt),
							nh(
								t.nodeType === 9
									? t.body
									: t.nodeName === "HTML"
										? t.ownerDocument.body
										: t,
								l.stateNode,
							),
							In(t))
						: nh(xt, l.stateNode));
				break;
			case 4:
				(a = xt),
					(n = ae),
					(xt = l.stateNode.containerInfo),
					(ae = !0),
					tl(t, e, l),
					(xt = a),
					(ae = n);
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Bt || yl(2, l, e), Bt || yl(4, l, e), tl(t, e, l);
				break;
			case 1:
				Bt ||
					(qe(l, e),
					(a = l.stateNode),
					typeof a.componentWillUnmount == "function" && sd(l, e, a)),
					tl(t, e, l);
				break;
			case 21:
				tl(t, e, l);
				break;
			case 22:
				(Bt = (a = Bt) || l.memoizedState !== null), tl(t, e, l), (Bt = a);
				break;
			default:
				tl(t, e, l);
		}
	}
	function gd(t, e) {
		if (
			e.memoizedState === null &&
			((t = e.alternate),
			t !== null &&
				((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
		)
			try {
				In(t);
			} catch (l) {
				Mt(e, e.return, l);
			}
	}
	function Qm(t) {
		switch (t.tag) {
			case 13:
			case 19: {
				var e = t.stateNode;
				return e === null && (e = t.stateNode = new hd()), e;
			}
			case 22:
				return (
					(t = t.stateNode),
					(e = t._retryCache),
					e === null && (e = t._retryCache = new hd()),
					e
				);
			default:
				throw Error(o(435, t.tag));
		}
	}
	function mo(t, e) {
		var l = Qm(t);
		e.forEach((a) => {
			var n = Im.bind(null, t, a);
			l.has(a) || (l.add(a), a.then(n, n));
		});
	}
	function re(t, e) {
		var l = e.deletions;
		if (l !== null)
			for (var a = 0; a < l.length; a++) {
				var n = l[a],
					u = t,
					r = e,
					h = r;
				t: for (; h !== null; ) {
					switch (h.tag) {
						case 27:
							if (Tl(h.type)) {
								(xt = h.stateNode), (ae = !1);
								break t;
							}
							break;
						case 5:
							(xt = h.stateNode), (ae = !1);
							break t;
						case 3:
						case 4:
							(xt = h.stateNode.containerInfo), (ae = !0);
							break t;
					}
					h = h.return;
				}
				if (xt === null) throw Error(o(160));
				yd(u, r, n),
					(xt = null),
					(ae = !1),
					(u = n.alternate),
					u !== null && (u.return = null),
					(n.return = null);
			}
		if (e.subtreeFlags & 13878)
			for (e = e.child; e !== null; ) pd(e, t), (e = e.sibling);
	}
	var Ue = null;
	function pd(t, e) {
		var l = t.alternate,
			a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				re(e, t),
					fe(t),
					a & 4 && (yl(3, t, t.return), Bn(3, t), yl(5, t, t.return));
				break;
			case 1:
				re(e, t),
					fe(t),
					a & 512 && (Bt || l === null || qe(l, l.return)),
					a & 64 &&
						Ie &&
						((t = t.updateQueue),
						t !== null &&
							((a = t.callbacks),
							a !== null &&
								((l = t.shared.hiddenCallbacks),
								(t.shared.hiddenCallbacks = l === null ? a : l.concat(a)))));
				break;
			case 26: {
				var n = Ue;
				if (
					(re(e, t),
					fe(t),
					a & 512 && (Bt || l === null || qe(l, l.return)),
					a & 4)
				) {
					var u = l !== null ? l.memoizedState : null;
					if (((a = t.memoizedState), l === null))
						if (a === null)
							if (t.stateNode === null) {
								t: {
									(a = t.type),
										(l = t.memoizedProps),
										(n = n.ownerDocument || n);
									e: switch (a) {
										case "title":
											(u = n.getElementsByTagName("title")[0]),
												(!u ||
													u[un] ||
													u[Pt] ||
													u.namespaceURI === "http://www.w3.org/2000/svg" ||
													u.hasAttribute("itemprop")) &&
													((u = n.createElement(a)),
													n.head.insertBefore(
														u,
														n.querySelector("head > title"),
													)),
												$t(u, a, l),
												(u[Pt] = t),
												Gt(u),
												(a = u);
											break t;
										case "link": {
											var r = dh("link", "href", n).get(a + (l.href || ""));
											if (r) {
												for (var h = 0; h < r.length; h++)
													if (
														((u = r[h]),
														u.getAttribute("href") ===
															(l.href == null || l.href === ""
																? null
																: l.href) &&
															u.getAttribute("rel") ===
																(l.rel == null ? null : l.rel) &&
															u.getAttribute("title") ===
																(l.title == null ? null : l.title) &&
															u.getAttribute("crossorigin") ===
																(l.crossOrigin == null ? null : l.crossOrigin))
													) {
														r.splice(h, 1);
														break e;
													}
											}
											(u = n.createElement(a)),
												$t(u, a, l),
												n.head.appendChild(u);
											break;
										}
										case "meta":
											if (
												(r = dh("meta", "content", n).get(
													a + (l.content || ""),
												))
											) {
												for (h = 0; h < r.length; h++)
													if (
														((u = r[h]),
														u.getAttribute("content") ===
															(l.content == null ? null : "" + l.content) &&
															u.getAttribute("name") ===
																(l.name == null ? null : l.name) &&
															u.getAttribute("property") ===
																(l.property == null ? null : l.property) &&
															u.getAttribute("http-equiv") ===
																(l.httpEquiv == null ? null : l.httpEquiv) &&
															u.getAttribute("charset") ===
																(l.charSet == null ? null : l.charSet))
													) {
														r.splice(h, 1);
														break e;
													}
											}
											(u = n.createElement(a)),
												$t(u, a, l),
												n.head.appendChild(u);
											break;
										default:
											throw Error(o(468, a));
									}
									(u[Pt] = t), Gt(u), (a = u);
								}
								t.stateNode = a;
							} else hh(n, t.type, t.stateNode);
						else t.stateNode = fh(n, a, t.memoizedProps);
					else
						u !== a
							? (u === null
									? l.stateNode !== null &&
										((l = l.stateNode), l.parentNode.removeChild(l))
									: u.count--,
								a === null
									? hh(n, t.type, t.stateNode)
									: fh(n, a, t.memoizedProps))
							: a === null &&
								t.stateNode !== null &&
								ro(t, t.memoizedProps, l.memoizedProps);
				}
				break;
			}
			case 27:
				re(e, t),
					fe(t),
					a & 512 && (Bt || l === null || qe(l, l.return)),
					l !== null && a & 4 && ro(t, t.memoizedProps, l.memoizedProps);
				break;
			case 5:
				if (
					(re(e, t),
					fe(t),
					a & 512 && (Bt || l === null || qe(l, l.return)),
					t.flags & 32)
				) {
					n = t.stateNode;
					try {
						ha(n, "");
					} catch (D) {
						Mt(t, t.return, D);
					}
				}
				a & 4 &&
					t.stateNode != null &&
					((n = t.memoizedProps), ro(t, n, l !== null ? l.memoizedProps : n)),
					a & 1024 && (vo = !0);
				break;
			case 6:
				if ((re(e, t), fe(t), a & 4)) {
					if (t.stateNode === null) throw Error(o(162));
					(a = t.memoizedProps), (l = t.stateNode);
					try {
						l.nodeValue = a;
					} catch (D) {
						Mt(t, t.return, D);
					}
				}
				break;
			case 3:
				if (
					((mi = null),
					(n = Ue),
					(Ue = hi(e.containerInfo)),
					re(e, t),
					(Ue = n),
					fe(t),
					a & 4 && l !== null && l.memoizedState.isDehydrated)
				)
					try {
						In(e.containerInfo);
					} catch (D) {
						Mt(t, t.return, D);
					}
				vo && ((vo = !1), Sd(t));
				break;
			case 4:
				(a = Ue),
					(Ue = hi(t.stateNode.containerInfo)),
					re(e, t),
					fe(t),
					(Ue = a);
				break;
			case 12:
				re(e, t), fe(t);
				break;
			case 13:
				re(e, t),
					fe(t),
					t.child.flags & 8192 &&
						(t.memoizedState !== null) !=
							(l !== null && l.memoizedState !== null) &&
						(bo = ge()),
					a & 4 &&
						((a = t.updateQueue),
						a !== null && ((t.updateQueue = null), mo(t, a)));
				break;
			case 22: {
				n = t.memoizedState !== null;
				var S = l !== null && l.memoizedState !== null,
					x = Ie,
					L = Bt;
				if (
					((Ie = x || n),
					(Bt = L || S),
					re(e, t),
					(Bt = L),
					(Ie = x),
					fe(t),
					a & 8192)
				)
					t: for (
						e = t.stateNode,
							e._visibility = n ? e._visibility & -2 : e._visibility | 1,
							n && (l === null || S || Ie || Bt || Wl(t)),
							l = null,
							e = t;
						;
					) {
						if (e.tag === 5 || e.tag === 26) {
							if (l === null) {
								S = l = e;
								try {
									if (((u = S.stateNode), n))
										(r = u.style),
											typeof r.setProperty == "function"
												? r.setProperty("display", "none", "important")
												: (r.display = "none");
									else {
										h = S.stateNode;
										var B = S.memoizedProps.style,
											z =
												B != null && Object.hasOwn(B, "display")
													? B.display
													: null;
										h.style.display =
											z == null || typeof z == "boolean" ? "" : ("" + z).trim();
									}
								} catch (D) {
									Mt(S, S.return, D);
								}
							}
						} else if (e.tag === 6) {
							if (l === null) {
								S = e;
								try {
									S.stateNode.nodeValue = n ? "" : S.memoizedProps;
								} catch (D) {
									Mt(S, S.return, D);
								}
							}
						} else if (
							((e.tag !== 22 && e.tag !== 23) ||
								e.memoizedState === null ||
								e === t) &&
							e.child !== null
						) {
							(e.child.return = e), (e = e.child);
							continue;
						}
						if (e === t) break;
						for (; e.sibling === null; ) {
							if (e.return === null || e.return === t) break t;
							l === e && (l = null), (e = e.return);
						}
						l === e && (l = null),
							(e.sibling.return = e.return),
							(e = e.sibling);
					}
				a & 4 &&
					((a = t.updateQueue),
					a !== null &&
						((l = a.retryQueue),
						l !== null && ((a.retryQueue = null), mo(t, l))));
				break;
			}
			case 19:
				re(e, t),
					fe(t),
					a & 4 &&
						((a = t.updateQueue),
						a !== null && ((t.updateQueue = null), mo(t, a)));
				break;
			case 30:
				break;
			case 21:
				break;
			default:
				re(e, t), fe(t);
		}
	}
	function fe(t) {
		var e = t.flags;
		if (e & 2) {
			try {
				for (var l, a = t.return; a !== null; ) {
					if (fd(a)) {
						l = a;
						break;
					}
					a = a.return;
				}
				if (l == null) throw Error(o(160));
				switch (l.tag) {
					case 27: {
						var n = l.stateNode,
							u = fo(t);
						ti(t, u, n);
						break;
					}
					case 5: {
						var r = l.stateNode;
						l.flags & 32 && (ha(r, ""), (l.flags &= -33));
						var h = fo(t);
						ti(t, h, r);
						break;
					}
					case 3:
					case 4: {
						var S = l.stateNode.containerInfo,
							x = fo(t);
						ho(t, x, S);
						break;
					}
					default:
						throw Error(o(161));
				}
			} catch (L) {
				Mt(t, t.return, L);
			}
			t.flags &= -3;
		}
		e & 4096 && (t.flags &= -4097);
	}
	function Sd(t) {
		if (t.subtreeFlags & 1024)
			for (t = t.child; t !== null; ) {
				var e = t;
				Sd(e),
					e.tag === 5 && e.flags & 1024 && e.stateNode.reset(),
					(t = t.sibling);
			}
	}
	function gl(t, e) {
		if (e.subtreeFlags & 8772)
			for (e = e.child; e !== null; ) vd(t, e.alternate, e), (e = e.sibling);
	}
	function Wl(t) {
		for (t = t.child; t !== null; ) {
			var e = t;
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					yl(4, e, e.return), Wl(e);
					break;
				case 1: {
					qe(e, e.return);
					var l = e.stateNode;
					typeof l.componentWillUnmount == "function" && sd(e, e.return, l),
						Wl(e);
					break;
				}
				case 27:
					Zn(e.stateNode);
				case 26:
				case 5:
					qe(e, e.return), Wl(e);
					break;
				case 22:
					e.memoizedState === null && Wl(e);
					break;
				case 30:
					Wl(e);
					break;
				default:
					Wl(e);
			}
			t = t.sibling;
		}
	}
	function pl(t, e, l) {
		for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
			var a = e.alternate,
				n = t,
				u = e,
				r = u.flags;
			switch (u.tag) {
				case 0:
				case 11:
				case 15:
					pl(n, u, l), Bn(4, u);
					break;
				case 1:
					if (
						(pl(n, u, l),
						(a = u),
						(n = a.stateNode),
						typeof n.componentDidMount == "function")
					)
						try {
							n.componentDidMount();
						} catch (x) {
							Mt(a, a.return, x);
						}
					if (((a = u), (n = a.updateQueue), n !== null)) {
						var h = a.stateNode;
						try {
							var S = n.shared.hiddenCallbacks;
							if (S !== null)
								for (n.shared.hiddenCallbacks = null, n = 0; n < S.length; n++)
									Jr(S[n], h);
						} catch (x) {
							Mt(a, a.return, x);
						}
					}
					l && r & 64 && od(u), Hn(u, u.return);
					break;
				case 27:
					dd(u);
				case 26:
				case 5:
					pl(n, u, l), l && a === null && r & 4 && rd(u), Hn(u, u.return);
					break;
				case 12:
					pl(n, u, l);
					break;
				case 13:
					pl(n, u, l), l && r & 4 && gd(n, u);
					break;
				case 22:
					u.memoizedState === null && pl(n, u, l), Hn(u, u.return);
					break;
				case 30:
					break;
				default:
					pl(n, u, l);
			}
			e = e.sibling;
		}
	}
	function yo(t, e) {
		var l = null;
		t !== null &&
			t.memoizedState !== null &&
			t.memoizedState.cachePool !== null &&
			(l = t.memoizedState.cachePool.pool),
			(t = null),
			e.memoizedState !== null &&
				e.memoizedState.cachePool !== null &&
				(t = e.memoizedState.cachePool.pool),
			t !== l && (t != null && t.refCount++, l != null && bn(l));
	}
	function go(t, e) {
		(t = null),
			e.alternate !== null && (t = e.alternate.memoizedState.cache),
			(e = e.memoizedState.cache),
			e !== t && (e.refCount++, t != null && bn(t));
	}
	function je(t, e, l, a) {
		if (e.subtreeFlags & 10256)
			for (e = e.child; e !== null; ) _d(t, e, l, a), (e = e.sibling);
	}
	function _d(t, e, l, a) {
		var n = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				je(t, e, l, a), n & 2048 && Bn(9, e);
				break;
			case 1:
				je(t, e, l, a);
				break;
			case 3:
				je(t, e, l, a),
					n & 2048 &&
						((t = null),
						e.alternate !== null && (t = e.alternate.memoizedState.cache),
						(e = e.memoizedState.cache),
						e !== t && (e.refCount++, t != null && bn(t)));
				break;
			case 12:
				if (n & 2048) {
					je(t, e, l, a), (t = e.stateNode);
					try {
						var u = e.memoizedProps,
							r = u.id,
							h = u.onPostCommit;
						typeof h == "function" &&
							h(
								r,
								e.alternate === null ? "mount" : "update",
								t.passiveEffectDuration,
								-0,
							);
					} catch (S) {
						Mt(e, e.return, S);
					}
				} else je(t, e, l, a);
				break;
			case 13:
				je(t, e, l, a);
				break;
			case 23:
				break;
			case 22:
				(u = e.stateNode),
					(r = e.alternate),
					e.memoizedState !== null
						? u._visibility & 2
							? je(t, e, l, a)
							: qn(t, e)
						: u._visibility & 2
							? je(t, e, l, a)
							: ((u._visibility |= 2),
								Ua(t, e, l, a, (e.subtreeFlags & 10256) !== 0)),
					n & 2048 && yo(r, e);
				break;
			case 24:
				je(t, e, l, a), n & 2048 && go(e.alternate, e);
				break;
			default:
				je(t, e, l, a);
		}
	}
	function Ua(t, e, l, a, n) {
		for (n = n && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null; ) {
			var u = t,
				r = e,
				h = l,
				S = a,
				x = r.flags;
			switch (r.tag) {
				case 0:
				case 11:
				case 15:
					Ua(u, r, h, S, n), Bn(8, r);
					break;
				case 23:
					break;
				case 22: {
					var L = r.stateNode;
					r.memoizedState !== null
						? L._visibility & 2
							? Ua(u, r, h, S, n)
							: qn(u, r)
						: ((L._visibility |= 2), Ua(u, r, h, S, n)),
						n && x & 2048 && yo(r.alternate, r);
					break;
				}
				case 24:
					Ua(u, r, h, S, n), n && x & 2048 && go(r.alternate, r);
					break;
				default:
					Ua(u, r, h, S, n);
			}
			e = e.sibling;
		}
	}
	function qn(t, e) {
		if (e.subtreeFlags & 10256)
			for (e = e.child; e !== null; ) {
				var l = t,
					a = e,
					n = a.flags;
				switch (a.tag) {
					case 22:
						qn(l, a), n & 2048 && yo(a.alternate, a);
						break;
					case 24:
						qn(l, a), n & 2048 && go(a.alternate, a);
						break;
					default:
						qn(l, a);
				}
				e = e.sibling;
			}
	}
	var jn = 8192;
	function La(t) {
		if (t.subtreeFlags & jn)
			for (t = t.child; t !== null; ) bd(t), (t = t.sibling);
	}
	function bd(t) {
		switch (t.tag) {
			case 26:
				La(t),
					t.flags & jn &&
						t.memoizedState !== null &&
						z0(Ue, t.memoizedState, t.memoizedProps);
				break;
			case 5:
				La(t);
				break;
			case 3:
			case 4: {
				var e = Ue;
				(Ue = hi(t.stateNode.containerInfo)), La(t), (Ue = e);
				break;
			}
			case 22:
				t.memoizedState === null &&
					((e = t.alternate),
					e !== null && e.memoizedState !== null
						? ((e = jn), (jn = 16777216), La(t), (jn = e))
						: La(t));
				break;
			default:
				La(t);
		}
	}
	function Rd(t) {
		var e = t.alternate;
		if (e !== null && ((t = e.child), t !== null)) {
			e.child = null;
			do (e = t.sibling), (t.sibling = null), (t = e);
			while (t !== null);
		}
	}
	function Yn(t) {
		var e = t.deletions;
		if ((t.flags & 16) !== 0) {
			if (e !== null)
				for (var l = 0; l < e.length; l++) {
					var a = e[l];
					(Xt = a), Td(a, t);
				}
			Rd(t);
		}
		if (t.subtreeFlags & 10256)
			for (t = t.child; t !== null; ) Ed(t), (t = t.sibling);
	}
	function Ed(t) {
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Yn(t), t.flags & 2048 && yl(9, t, t.return);
				break;
			case 3:
				Yn(t);
				break;
			case 12:
				Yn(t);
				break;
			case 22: {
				var e = t.stateNode;
				t.memoizedState !== null &&
				e._visibility & 2 &&
				(t.return === null || t.return.tag !== 13)
					? ((e._visibility &= -3), ei(t))
					: Yn(t);
				break;
			}
			default:
				Yn(t);
		}
	}
	function ei(t) {
		var e = t.deletions;
		if ((t.flags & 16) !== 0) {
			if (e !== null)
				for (var l = 0; l < e.length; l++) {
					var a = e[l];
					(Xt = a), Td(a, t);
				}
			Rd(t);
		}
		for (t = t.child; t !== null; ) {
			switch (((e = t), e.tag)) {
				case 0:
				case 11:
				case 15:
					yl(8, e, e.return), ei(e);
					break;
				case 22:
					(l = e.stateNode),
						l._visibility & 2 && ((l._visibility &= -3), ei(e));
					break;
				default:
					ei(e);
			}
			t = t.sibling;
		}
	}
	function Td(t, e) {
		for (; Xt !== null; ) {
			var l = Xt;
			switch (l.tag) {
				case 0:
				case 11:
				case 15:
					yl(8, l, e);
					break;
				case 23:
				case 22:
					if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
						var a = l.memoizedState.cachePool.pool;
						a != null && a.refCount++;
					}
					break;
				case 24:
					bn(l.memoizedState.cache);
			}
			if (((a = l.child), a !== null)) (a.return = l), (Xt = a);
			else
				for (l = t; Xt !== null; ) {
					a = Xt;
					var n = a.sibling,
						u = a.return;
					if ((md(a), a === l)) {
						Xt = null;
						break;
					}
					if (n !== null) {
						(n.return = u), (Xt = n);
						break;
					}
					Xt = u;
				}
		}
	}
	var Zm = {
			getCacheForType: (t) => {
				var e = Wt(jt),
					l = e.data.get(t);
				return l === void 0 && ((l = t()), e.data.set(t, l)), l;
			},
		},
		Km = typeof WeakMap == "function" ? WeakMap : Map,
		_t = 0,
		At = null,
		ft = null,
		mt = 0,
		bt = 0,
		de = null,
		Sl = !1,
		Na = !1,
		po = !1,
		el = 0,
		Ut = 0,
		_l = 0,
		Fl = 0,
		So = 0,
		Me = 0,
		Ba = 0,
		wn = null,
		ne = null,
		_o = !1,
		bo = 0,
		li = 1 / 0,
		ai = null,
		bl = null,
		kt = 0,
		Rl = null,
		Ha = null,
		qa = 0,
		Ro = 0,
		Eo = null,
		Md = null,
		Gn = 0,
		To = null;
	function he() {
		if ((_t & 2) !== 0 && mt !== 0) return mt & -mt;
		if (C.T !== null) {
			var t = Ta;
			return t !== 0 ? t : Co();
		}
		return ws();
	}
	function Ad() {
		Me === 0 && (Me = (mt & 536870912) === 0 || pt ? Hs() : 536870912);
		var t = Te.current;
		return t !== null && (t.flags |= 32), Me;
	}
	function ve(t, e, l) {
		((t === At && (bt === 2 || bt === 9)) || t.cancelPendingCommit !== null) &&
			(ja(t, 0), El(t, mt, Me, !1)),
			nn(t, l),
			((_t & 2) === 0 || t !== At) &&
				(t === At &&
					((_t & 2) === 0 && (Fl |= l), Ut === 4 && El(t, mt, Me, !1)),
				Ye(t));
	}
	function Od(t, e, l) {
		if ((_t & 6) !== 0) throw Error(o(327));
		var a = (!l && (e & 124) === 0 && (e & t.expiredLanes) === 0) || an(t, e),
			n = a ? $m(t, e) : Oo(t, e, !0),
			u = a;
		do {
			if (n === 0) {
				Na && !a && El(t, e, 0, !1);
				break;
			} else {
				if (((l = t.current.alternate), u && !Jm(l))) {
					(n = Oo(t, e, !1)), (u = !1);
					continue;
				}
				if (n === 2) {
					if (((u = e), t.errorRecoveryDisabledLanes & u)) var r = 0;
					else
						(r = t.pendingLanes & -536870913),
							(r = r !== 0 ? r : r & 536870912 ? 536870912 : 0);
					if (r !== 0) {
						e = r;
						t: {
							var h = t;
							n = wn;
							var S = h.current.memoizedState.isDehydrated;
							if ((S && (ja(h, r).flags |= 256), (r = Oo(h, r, !1)), r !== 2)) {
								if (po && !S) {
									(h.errorRecoveryDisabledLanes |= u), (Fl |= u), (n = 4);
									break t;
								}
								(u = ne),
									(ne = n),
									u !== null && (ne === null ? (ne = u) : ne.push.apply(ne, u));
							}
							n = r;
						}
						if (((u = !1), n !== 2)) continue;
					}
				}
				if (n === 1) {
					ja(t, 0), El(t, e, 0, !0);
					break;
				}
				t: {
					switch (((a = t), (u = n), u)) {
						case 0:
						case 1:
							throw Error(o(345));
						case 4:
							if ((e & 4194048) !== e) break;
						case 6:
							El(a, e, Me, !Sl);
							break t;
						case 2:
							ne = null;
							break;
						case 3:
						case 5:
							break;
						default:
							throw Error(o(329));
					}
					if ((e & 62914560) === e && ((n = bo + 300 - ge()), 10 < n)) {
						if ((El(a, e, Me, !Sl), vu(a, 0, !0) !== 0)) break t;
						a.timeoutHandle = lh(
							xd.bind(null, a, l, ne, ai, _o, e, Me, Fl, Ba, Sl, u, 2, -0, 0),
							n,
						);
						break t;
					}
					xd(a, l, ne, ai, _o, e, Me, Fl, Ba, Sl, u, 0, -0, 0);
				}
			}
			break;
		} while (!0);
		Ye(t);
	}
	function xd(t, e, l, a, n, u, r, h, S, x, L, B, z, D) {
		if (
			((t.timeoutHandle = -1),
			(B = e.subtreeFlags),
			(B & 8192 || (B & 16785408) === 16785408) &&
				((kn = { stylesheets: null, count: 0, unsuspend: x0 }),
				bd(e),
				(B = D0()),
				B !== null))
		) {
			(t.cancelPendingCommit = B(
				Bd.bind(null, t, e, u, l, a, n, r, h, S, L, 1, z, D),
			)),
				El(t, u, r, !x);
			return;
		}
		Bd(t, e, u, l, a, n, r, h, S);
	}
	function Jm(t) {
		for (var e = t; ; ) {
			var l = e.tag;
			if (
				(l === 0 || l === 11 || l === 15) &&
				e.flags & 16384 &&
				((l = e.updateQueue), l !== null && ((l = l.stores), l !== null))
			)
				for (var a = 0; a < l.length; a++) {
					var n = l[a],
						u = n.getSnapshot;
					n = n.value;
					try {
						if (!oe(u(), n)) return !1;
					} catch {
						return !1;
					}
				}
			if (((l = e.child), e.subtreeFlags & 16384 && l !== null))
				(l.return = e), (e = l);
			else {
				if (e === t) break;
				for (; e.sibling === null; ) {
					if (e.return === null || e.return === t) return !0;
					e = e.return;
				}
				(e.sibling.return = e.return), (e = e.sibling);
			}
		}
		return !0;
	}
	function El(t, e, l, a) {
		(e &= ~So),
			(e &= ~Fl),
			(t.suspendedLanes |= e),
			(t.pingedLanes &= ~e),
			a && (t.warmLanes |= e),
			(a = t.expirationTimes);
		for (var n = e; 0 < n; ) {
			var u = 31 - ce(n),
				r = 1 << u;
			(a[u] = -1), (n &= ~r);
		}
		l !== 0 && js(t, l, e);
	}
	function ni() {
		return (_t & 6) === 0 ? (Vn(0), !1) : !0;
	}
	function Mo() {
		if (ft !== null) {
			if (bt === 0) var t = ft.return;
			else (t = ft), (Je = Kl = null), Gc(t), (Da = null), (Un = 0), (t = ft);
			for (; t !== null; ) cd(t.alternate, t), (t = t.return);
			ft = null;
		}
	}
	function ja(t, e) {
		var l = t.timeoutHandle;
		l !== -1 && ((t.timeoutHandle = -1), f0(l)),
			(l = t.cancelPendingCommit),
			l !== null && ((t.cancelPendingCommit = null), l()),
			Mo(),
			(At = t),
			(ft = l = Qe(t.current, null)),
			(mt = e),
			(bt = 0),
			(de = null),
			(Sl = !1),
			(Na = an(t, e)),
			(po = !1),
			(Ba = Me = So = Fl = _l = Ut = 0),
			(ne = wn = null),
			(_o = !1),
			(e & 8) !== 0 && (e |= e & 32);
		var a = t.entangledLanes;
		if (a !== 0)
			for (t = t.entanglements, a &= e; 0 < a; ) {
				var n = 31 - ce(a),
					u = 1 << n;
				(e |= t[n]), (a &= ~u);
			}
		return (el = e), Au(), l;
	}
	function zd(t, e) {
		(ot = null),
			(C.H = Zu),
			e === En || e === Bu
				? ((e = Zr()), (bt = 3))
				: e === Vr
					? ((e = Zr()), (bt = 4))
					: (bt =
							e === Jf
								? 8
								: e !== null &&
										typeof e == "object" &&
										typeof e.then == "function"
									? 6
									: 1),
			(de = e),
			ft === null && ((Ut = 1), Pu(t, _e(e, t.current)));
	}
	function Dd() {
		var t = C.H;
		return (C.H = Zu), t === null ? Zu : t;
	}
	function Cd() {
		var t = C.A;
		return (C.A = Zm), t;
	}
	function Ao() {
		(Ut = 4),
			Sl || ((mt & 4194048) !== mt && Te.current !== null) || (Na = !0),
			((_l & 134217727) === 0 && (Fl & 134217727) === 0) ||
				At === null ||
				El(At, mt, Me, !1);
	}
	function Oo(t, e, l) {
		var a = _t;
		_t |= 2;
		var n = Dd(),
			u = Cd();
		(At !== t || mt !== e) && ((ai = null), ja(t, e)), (e = !1);
		var r = Ut;
		t: do
			try {
				if (bt !== 0 && ft !== null) {
					var h = ft,
						S = de;
					switch (bt) {
						case 8:
							Mo(), (r = 6);
							break t;
						case 3:
						case 2:
						case 9:
						case 6: {
							Te.current === null && (e = !0);
							var x = bt;
							if (((bt = 0), (de = null), Ya(t, h, S, x), l && Na)) {
								r = 0;
								break t;
							}
							break;
						}
						default:
							(x = bt), (bt = 0), (de = null), Ya(t, h, S, x);
					}
				}
				km(), (r = Ut);
				break;
			} catch (L) {
				zd(t, L);
			}
		while (!0);
		return (
			e && t.shellSuspendCounter++,
			(Je = Kl = null),
			(_t = a),
			(C.H = n),
			(C.A = u),
			ft === null && ((At = null), (mt = 0), Au()),
			r
		);
	}
	function km() {
		for (; ft !== null; ) Ud(ft);
	}
	function $m(t, e) {
		var l = _t;
		_t |= 2;
		var a = Dd(),
			n = Cd();
		At !== t || mt !== e
			? ((ai = null), (li = ge() + 500), ja(t, e))
			: (Na = an(t, e));
		t: do
			try {
				if (bt !== 0 && ft !== null) {
					e = ft;
					var u = de;
					e: switch (bt) {
						case 1:
							(bt = 0), (de = null), Ya(t, e, u, 1);
							break;
						case 2:
						case 9:
							if (Xr(u)) {
								(bt = 0), (de = null), Ld(e);
								break;
							}
							(e = () => {
								(bt !== 2 && bt !== 9) || At !== t || (bt = 7), Ye(t);
							}),
								u.then(e, e);
							break t;
						case 3:
							bt = 7;
							break t;
						case 4:
							bt = 5;
							break t;
						case 7:
							Xr(u)
								? ((bt = 0), (de = null), Ld(e))
								: ((bt = 0), (de = null), Ya(t, e, u, 7));
							break;
						case 5: {
							var r = null;
							switch (ft.tag) {
								case 26:
									r = ft.memoizedState;
								case 5:
								case 27: {
									var h = ft;
									if (!r || vh(r)) {
										(bt = 0), (de = null);
										var S = h.sibling;
										if (S !== null) ft = S;
										else {
											var x = h.return;
											x !== null ? ((ft = x), ui(x)) : (ft = null);
										}
										break e;
									}
								}
							}
							(bt = 0), (de = null), Ya(t, e, u, 5);
							break;
						}
						case 6:
							(bt = 0), (de = null), Ya(t, e, u, 6);
							break;
						case 8:
							Mo(), (Ut = 6);
							break t;
						default:
							throw Error(o(462));
					}
				}
				Pm();
				break;
			} catch (L) {
				zd(t, L);
			}
		while (!0);
		return (
			(Je = Kl = null),
			(C.H = a),
			(C.A = n),
			(_t = l),
			ft !== null ? 0 : ((At = null), (mt = 0), Au(), Ut)
		);
	}
	function Pm() {
		for (; ft !== null && !wi(); ) Ud(ft);
	}
	function Ud(t) {
		var e = ud(t.alternate, t, el);
		(t.memoizedProps = t.pendingProps), e === null ? ui(t) : (ft = e);
	}
	function Ld(t) {
		var e = t,
			l = e.alternate;
		switch (e.tag) {
			case 15:
			case 0:
				e = If(l, e, e.pendingProps, e.type, void 0, mt);
				break;
			case 11:
				e = If(l, e, e.pendingProps, e.type.render, e.ref, mt);
				break;
			case 5:
				Gc(e);
			default:
				cd(l, e), (e = ft = Lr(e, el)), (e = ud(l, e, el));
		}
		(t.memoizedProps = t.pendingProps), e === null ? ui(t) : (ft = e);
	}
	function Ya(t, e, l, a) {
		(Je = Kl = null), Gc(e), (Da = null), (Un = 0);
		var n = e.return;
		try {
			if (Ym(t, n, e, l, mt)) {
				(Ut = 1), Pu(t, _e(l, t.current)), (ft = null);
				return;
			}
		} catch (u) {
			if (n !== null) throw ((ft = n), u);
			(Ut = 1), Pu(t, _e(l, t.current)), (ft = null);
			return;
		}
		e.flags & 32768
			? (pt || a === 1
					? (t = !0)
					: Na || (mt & 536870912) !== 0
						? (t = !1)
						: ((Sl = t = !0),
							(a === 2 || a === 9 || a === 3 || a === 6) &&
								((a = Te.current),
								a !== null && a.tag === 13 && (a.flags |= 16384))),
				Nd(e, t))
			: ui(e);
	}
	function ui(t) {
		var e = t;
		do {
			if ((e.flags & 32768) !== 0) {
				Nd(e, Sl);
				return;
			}
			t = e.return;
			var l = Gm(e.alternate, e, el);
			if (l !== null) {
				ft = l;
				return;
			}
			if (((e = e.sibling), e !== null)) {
				ft = e;
				return;
			}
			ft = e = t;
		} while (e !== null);
		Ut === 0 && (Ut = 5);
	}
	function Nd(t, e) {
		do {
			var l = Vm(t.alternate, t);
			if (l !== null) {
				(l.flags &= 32767), (ft = l);
				return;
			}
			if (
				((l = t.return),
				l !== null &&
					((l.flags |= 32768), (l.subtreeFlags = 0), (l.deletions = null)),
				!e && ((t = t.sibling), t !== null))
			) {
				ft = t;
				return;
			}
			ft = t = l;
		} while (t !== null);
		(Ut = 6), (ft = null);
	}
	function Bd(t, e, l, a, n, u, r, h, S) {
		t.cancelPendingCommit = null;
		do ii();
		while (kt !== 0);
		if ((_t & 6) !== 0) throw Error(o(327));
		if (e !== null) {
			if (e === t.current) throw Error(o(177));
			if (
				((u = e.lanes | e.childLanes),
				(u |= yc),
				xv(t, l, u, r, h, S),
				t === At && ((ft = At = null), (mt = 0)),
				(Ha = e),
				(Rl = t),
				(qa = l),
				(Ro = u),
				(Eo = n),
				(Md = a),
				(e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
					? ((t.callbackNode = null),
						(t.callbackPriority = 0),
						t0(Bl, () => (wd(), null)))
					: ((t.callbackNode = null), (t.callbackPriority = 0)),
				(a = (e.flags & 13878) !== 0),
				(e.subtreeFlags & 13878) !== 0 || a)
			) {
				(a = C.T), (C.T = null), (n = Y.p), (Y.p = 2), (r = _t), (_t |= 4);
				try {
					Xm(t, e, l);
				} finally {
					(_t = r), (Y.p = n), (C.T = a);
				}
			}
			(kt = 1), Hd(), qd(), jd();
		}
	}
	function Hd() {
		if (kt === 1) {
			kt = 0;
			var t = Rl,
				e = Ha,
				l = (e.flags & 13878) !== 0;
			if ((e.subtreeFlags & 13878) !== 0 || l) {
				(l = C.T), (C.T = null);
				var a = Y.p;
				Y.p = 2;
				var n = _t;
				_t |= 4;
				try {
					pd(e, t);
					var u = Yo,
						r = Er(t.containerInfo),
						h = u.focusedElem,
						S = u.selectionRange;
					if (
						r !== h &&
						h &&
						h.ownerDocument &&
						Rr(h.ownerDocument.documentElement, h)
					) {
						if (S !== null && fc(h)) {
							var x = S.start,
								L = S.end;
							if ((L === void 0 && (L = x), "selectionStart" in h))
								(h.selectionStart = x),
									(h.selectionEnd = Math.min(L, h.value.length));
							else {
								var B = h.ownerDocument || document,
									z = (B && B.defaultView) || window;
								if (z.getSelection) {
									var D = z.getSelection(),
										tt = h.textContent.length,
										F = Math.min(S.start, tt),
										Tt = S.end === void 0 ? F : Math.min(S.end, tt);
									!D.extend && F > Tt && ((r = Tt), (Tt = F), (F = r));
									var T = br(h, F),
										E = br(h, Tt);
									if (
										T &&
										E &&
										(D.rangeCount !== 1 ||
											D.anchorNode !== T.node ||
											D.anchorOffset !== T.offset ||
											D.focusNode !== E.node ||
											D.focusOffset !== E.offset)
									) {
										var O = B.createRange();
										O.setStart(T.node, T.offset),
											D.removeAllRanges(),
											F > Tt
												? (D.addRange(O), D.extend(E.node, E.offset))
												: (O.setEnd(E.node, E.offset), D.addRange(O));
									}
								}
							}
						}
						for (B = [], D = h; (D = D.parentNode); )
							D.nodeType === 1 &&
								B.push({ element: D, left: D.scrollLeft, top: D.scrollTop });
						for (
							typeof h.focus == "function" && h.focus(), h = 0;
							h < B.length;
							h++
						) {
							var N = B[h];
							(N.element.scrollLeft = N.left), (N.element.scrollTop = N.top);
						}
					}
					(pi = !!jo), (Yo = jo = null);
				} finally {
					(_t = n), (Y.p = a), (C.T = l);
				}
			}
			(t.current = e), (kt = 2);
		}
	}
	function qd() {
		if (kt === 2) {
			kt = 0;
			var t = Rl,
				e = Ha,
				l = (e.flags & 8772) !== 0;
			if ((e.subtreeFlags & 8772) !== 0 || l) {
				(l = C.T), (C.T = null);
				var a = Y.p;
				Y.p = 2;
				var n = _t;
				_t |= 4;
				try {
					vd(t, e.alternate, e);
				} finally {
					(_t = n), (Y.p = a), (C.T = l);
				}
			}
			kt = 3;
		}
	}
	function jd() {
		if (kt === 4 || kt === 3) {
			(kt = 0), Gi();
			var t = Rl,
				e = Ha,
				l = qa,
				a = Md;
			(e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
				? (kt = 5)
				: ((kt = 0), (Ha = Rl = null), Yd(t, t.pendingLanes));
			var n = t.pendingLanes;
			if (
				(n === 0 && (bl = null),
				Qi(l),
				(e = e.stateNode),
				ie && typeof ie.onCommitFiberRoot == "function")
			)
				try {
					ie.onCommitFiberRoot(ln, e, void 0, (e.current.flags & 128) === 128);
				} catch {}
			if (a !== null) {
				(e = C.T), (n = Y.p), (Y.p = 2), (C.T = null);
				try {
					for (var u = t.onRecoverableError, r = 0; r < a.length; r++) {
						var h = a[r];
						u(h.value, { componentStack: h.stack });
					}
				} finally {
					(C.T = e), (Y.p = n);
				}
			}
			(qa & 3) !== 0 && ii(),
				Ye(t),
				(n = t.pendingLanes),
				(l & 4194090) !== 0 && (n & 42) !== 0
					? t === To
						? Gn++
						: ((Gn = 0), (To = t))
					: (Gn = 0),
				Vn(0);
		}
	}
	function Yd(t, e) {
		(t.pooledCacheLanes &= e) === 0 &&
			((e = t.pooledCache), e != null && ((t.pooledCache = null), bn(e)));
	}
	function ii(t) {
		return Hd(), qd(), jd(), wd();
	}
	function wd() {
		if (kt !== 5) return !1;
		var t = Rl,
			e = Ro;
		Ro = 0;
		var l = Qi(qa),
			a = C.T,
			n = Y.p;
		try {
			(Y.p = 32 > l ? 32 : l), (C.T = null), (l = Eo), (Eo = null);
			var u = Rl,
				r = qa;
			if (((kt = 0), (Ha = Rl = null), (qa = 0), (_t & 6) !== 0))
				throw Error(o(331));
			var h = _t;
			if (
				((_t |= 4),
				Ed(u.current),
				_d(u, u.current, r, l),
				(_t = h),
				Vn(0, !1),
				ie && typeof ie.onPostCommitFiberRoot == "function")
			)
				try {
					ie.onPostCommitFiberRoot(ln, u);
				} catch {}
			return !0;
		} finally {
			(Y.p = n), (C.T = a), Yd(t, e);
		}
	}
	function Gd(t, e, l) {
		(e = _e(l, e)),
			(e = eo(t.stateNode, e, 2)),
			(t = dl(t, e, 2)),
			t !== null && (nn(t, 2), Ye(t));
	}
	function Mt(t, e, l) {
		if (t.tag === 3) Gd(t, t, l);
		else
			for (; e !== null; ) {
				if (e.tag === 3) {
					Gd(e, t, l);
					break;
				} else if (e.tag === 1) {
					var a = e.stateNode;
					if (
						typeof e.type.getDerivedStateFromError == "function" ||
						(typeof a.componentDidCatch == "function" &&
							(bl === null || !bl.has(a)))
					) {
						(t = _e(l, t)),
							(l = Zf(2)),
							(a = dl(e, l, 2)),
							a !== null && (Kf(l, a, e, t), nn(a, 2), Ye(a));
						break;
					}
				}
				e = e.return;
			}
	}
	function xo(t, e, l) {
		var a = t.pingCache;
		if (a === null) {
			a = t.pingCache = new Km();
			var n = new Set();
			a.set(e, n);
		} else (n = a.get(e)), n === void 0 && ((n = new Set()), a.set(e, n));
		n.has(l) ||
			((po = !0), n.add(l), (t = Wm.bind(null, t, e, l)), e.then(t, t));
	}
	function Wm(t, e, l) {
		var a = t.pingCache;
		a !== null && a.delete(e),
			(t.pingedLanes |= t.suspendedLanes & l),
			(t.warmLanes &= ~l),
			At === t &&
				(mt & l) === l &&
				(Ut === 4 || (Ut === 3 && (mt & 62914560) === mt && 300 > ge() - bo)
					? (_t & 2) === 0 && ja(t, 0)
					: (So |= l),
				Ba === mt && (Ba = 0)),
			Ye(t);
	}
	function Vd(t, e) {
		e === 0 && (e = qs()), (t = _a(t, e)), t !== null && (nn(t, e), Ye(t));
	}
	function Fm(t) {
		var e = t.memoizedState,
			l = 0;
		e !== null && (l = e.retryLane), Vd(t, l);
	}
	function Im(t, e) {
		var l = 0;
		switch (t.tag) {
			case 13: {
				var a = t.stateNode,
					n = t.memoizedState;
				n !== null && (l = n.retryLane);
				break;
			}
			case 19:
				a = t.stateNode;
				break;
			case 22:
				a = t.stateNode._retryCache;
				break;
			default:
				throw Error(o(314));
		}
		a !== null && a.delete(e), Vd(t, l);
	}
	function t0(t, e) {
		return tn(t, e);
	}
	var ci = null,
		wa = null,
		zo = !1,
		oi = !1,
		Do = !1,
		Il = 0;
	function Ye(t) {
		t !== wa &&
			t.next === null &&
			(wa === null ? (ci = wa = t) : (wa = wa.next = t)),
			(oi = !0),
			zo || ((zo = !0), l0());
	}
	function Vn(t, e) {
		if (!Do && oi) {
			Do = !0;
			do
				for (var l = !1, a = ci; a !== null; ) {
					if (t !== 0) {
						var n = a.pendingLanes;
						if (n === 0) var u = 0;
						else {
							var r = a.suspendedLanes,
								h = a.pingedLanes;
							(u = (1 << (31 - ce(42 | t) + 1)) - 1),
								(u &= n & ~(r & ~h)),
								(u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0);
						}
						u !== 0 && ((l = !0), Kd(a, u));
					} else
						(u = mt),
							(u = vu(
								a,
								a === At ? u : 0,
								a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
							)),
							(u & 3) === 0 || an(a, u) || ((l = !0), Kd(a, u));
					a = a.next;
				}
			while (l);
			Do = !1;
		}
	}
	function e0() {
		Xd();
	}
	function Xd() {
		oi = zo = !1;
		var t = 0;
		Il !== 0 && (r0() && (t = Il), (Il = 0));
		for (var e = ge(), l = null, a = ci; a !== null; ) {
			var n = a.next,
				u = Qd(a, e);
			u === 0
				? ((a.next = null),
					l === null ? (ci = n) : (l.next = n),
					n === null && (wa = l))
				: ((l = a), (t !== 0 || (u & 3) !== 0) && (oi = !0)),
				(a = n);
		}
		Vn(t);
	}
	function Qd(t, e) {
		for (
			var l = t.suspendedLanes,
				a = t.pingedLanes,
				n = t.expirationTimes,
				u = t.pendingLanes & -62914561;
			0 < u;
		) {
			var r = 31 - ce(u),
				h = 1 << r,
				S = n[r];
			S === -1
				? ((h & l) === 0 || (h & a) !== 0) && (n[r] = Ov(h, e))
				: S <= e && (t.expiredLanes |= h),
				(u &= ~h);
		}
		if (
			((e = At),
			(l = mt),
			(l = vu(
				t,
				t === e ? l : 0,
				t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
			)),
			(a = t.callbackNode),
			l === 0 ||
				(t === e && (bt === 2 || bt === 9)) ||
				t.cancelPendingCommit !== null)
		)
			return (
				a !== null && a !== null && na(a),
				(t.callbackNode = null),
				(t.callbackPriority = 0)
			);
		if ((l & 3) === 0 || an(t, l)) {
			if (((e = l & -l), e === t.callbackPriority)) return e;
			switch ((a !== null && na(a), Qi(l))) {
				case 2:
				case 8:
					l = en;
					break;
				case 32:
					l = Bl;
					break;
				case 268435456:
					l = Kt;
					break;
				default:
					l = Bl;
			}
			return (
				(a = Zd.bind(null, t)),
				(l = tn(l, a)),
				(t.callbackPriority = e),
				(t.callbackNode = l),
				e
			);
		}
		return (
			a !== null && a !== null && na(a),
			(t.callbackPriority = 2),
			(t.callbackNode = null),
			2
		);
	}
	function Zd(t, e) {
		if (kt !== 0 && kt !== 5)
			return (t.callbackNode = null), (t.callbackPriority = 0), null;
		var l = t.callbackNode;
		if (ii() && t.callbackNode !== l) return null;
		var a = mt;
		return (
			(a = vu(
				t,
				t === At ? a : 0,
				t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
			)),
			a === 0
				? null
				: (Od(t, a, e),
					Qd(t, ge()),
					t.callbackNode != null && t.callbackNode === l
						? Zd.bind(null, t)
						: null)
		);
	}
	function Kd(t, e) {
		if (ii()) return null;
		Od(t, e, !0);
	}
	function l0() {
		d0(() => {
			(_t & 6) !== 0 ? tn(Nl, e0) : Xd();
		});
	}
	function Co() {
		return Il === 0 && (Il = Hs()), Il;
	}
	function Jd(t) {
		return t == null || typeof t == "symbol" || typeof t == "boolean"
			? null
			: typeof t == "function"
				? t
				: Su("" + t);
	}
	function kd(t, e) {
		var l = e.ownerDocument.createElement("input");
		return (
			(l.name = e.name),
			(l.value = e.value),
			t.id && l.setAttribute("form", t.id),
			e.parentNode.insertBefore(l, e),
			(t = new FormData(t)),
			l.parentNode.removeChild(l),
			t
		);
	}
	function a0(t, e, l, a, n) {
		if (e === "submit" && l && l.stateNode === n) {
			var u = Jd((n[te] || null).action),
				r = a.submitter;
			r &&
				((e = (e = r[te] || null)
					? Jd(e.formAction)
					: r.getAttribute("formAction")),
				e !== null && ((u = e), (r = null)));
			var h = new Eu("action", "action", null, a, n);
			t.push({
				event: h,
				listeners: [
					{
						instance: null,
						listener: () => {
							if (a.defaultPrevented) {
								if (Il !== 0) {
									var S = r ? kd(n, r) : new FormData(n);
									Pc(
										l,
										{ pending: !0, data: S, method: n.method, action: u },
										null,
										S,
									);
								}
							} else
								typeof u == "function" &&
									(h.preventDefault(),
									(S = r ? kd(n, r) : new FormData(n)),
									Pc(
										l,
										{ pending: !0, data: S, method: n.method, action: u },
										u,
										S,
									));
						},
						currentTarget: n,
					},
				],
			});
		}
	}
	for (var Uo = 0; Uo < mc.length; Uo++) {
		var Lo = mc[Uo],
			n0 = Lo.toLowerCase(),
			u0 = Lo[0].toUpperCase() + Lo.slice(1);
		Ce(n0, "on" + u0);
	}
	Ce(Ar, "onAnimationEnd"),
		Ce(Or, "onAnimationIteration"),
		Ce(xr, "onAnimationStart"),
		Ce("dblclick", "onDoubleClick"),
		Ce("focusin", "onFocus"),
		Ce("focusout", "onBlur"),
		Ce(Rm, "onTransitionRun"),
		Ce(Em, "onTransitionStart"),
		Ce(Tm, "onTransitionCancel"),
		Ce(zr, "onTransitionEnd"),
		ra("onMouseEnter", ["mouseout", "mouseover"]),
		ra("onMouseLeave", ["mouseout", "mouseover"]),
		ra("onPointerEnter", ["pointerout", "pointerover"]),
		ra("onPointerLeave", ["pointerout", "pointerover"]),
		ql(
			"onChange",
			"change click focusin focusout input keydown keyup selectionchange".split(
				" ",
			),
		),
		ql(
			"onSelect",
			"focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
				" ",
			),
		),
		ql("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
		ql(
			"onCompositionEnd",
			"compositionend focusout keydown keypress keyup mousedown".split(" "),
		),
		ql(
			"onCompositionStart",
			"compositionstart focusout keydown keypress keyup mousedown".split(" "),
		),
		ql(
			"onCompositionUpdate",
			"compositionupdate focusout keydown keypress keyup mousedown".split(" "),
		);
	var Xn =
			"abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
				" ",
			),
		i0 = new Set(
			"beforetoggle cancel close invalid load scroll scrollend toggle"
				.split(" ")
				.concat(Xn),
		);
	function $d(t, e) {
		e = (e & 4) !== 0;
		for (var l = 0; l < t.length; l++) {
			var a = t[l],
				n = a.event;
			a = a.listeners;
			t: {
				var u = void 0;
				if (e)
					for (var r = a.length - 1; 0 <= r; r--) {
						var h = a[r],
							S = h.instance,
							x = h.currentTarget;
						if (((h = h.listener), S !== u && n.isPropagationStopped()))
							break t;
						(u = h), (n.currentTarget = x);
						try {
							u(n);
						} catch (L) {
							$u(L);
						}
						(n.currentTarget = null), (u = S);
					}
				else
					for (r = 0; r < a.length; r++) {
						if (
							((h = a[r]),
							(S = h.instance),
							(x = h.currentTarget),
							(h = h.listener),
							S !== u && n.isPropagationStopped())
						)
							break t;
						(u = h), (n.currentTarget = x);
						try {
							u(n);
						} catch (L) {
							$u(L);
						}
						(n.currentTarget = null), (u = S);
					}
			}
		}
	}
	function dt(t, e) {
		var l = e[Zi];
		l === void 0 && (l = e[Zi] = new Set());
		var a = t + "__bubble";
		l.has(a) || (Pd(e, t, 2, !1), l.add(a));
	}
	function No(t, e, l) {
		var a = 0;
		e && (a |= 4), Pd(l, t, a, e);
	}
	var si = "_reactListening" + Math.random().toString(36).slice(2);
	function Bo(t) {
		if (!t[si]) {
			(t[si] = !0),
				Vs.forEach((l) => {
					l !== "selectionchange" && (i0.has(l) || No(l, !1, t), No(l, !0, t));
				});
			var e = t.nodeType === 9 ? t : t.ownerDocument;
			e === null || e[si] || ((e[si] = !0), No("selectionchange", !1, e));
		}
	}
	function Pd(t, e, l, a) {
		switch (_h(e)) {
			case 2: {
				var n = L0;
				break;
			}
			case 8:
				n = N0;
				break;
			default:
				n = $o;
		}
		(l = n.bind(null, e, l, t)),
			(n = void 0),
			!lc ||
				(e !== "touchstart" && e !== "touchmove" && e !== "wheel") ||
				(n = !0),
			a
				? n !== void 0
					? t.addEventListener(e, l, { capture: !0, passive: n })
					: t.addEventListener(e, l, !0)
				: n !== void 0
					? t.addEventListener(e, l, { passive: n })
					: t.addEventListener(e, l, !1);
	}
	function Ho(t, e, l, a, n) {
		var u = a;
		if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
			t: for (;;) {
				if (a === null) return;
				var r = a.tag;
				if (r === 3 || r === 4) {
					var h = a.stateNode.containerInfo;
					if (h === n) break;
					if (r === 4)
						for (r = a.return; r !== null; ) {
							var S = r.tag;
							if ((S === 3 || S === 4) && r.stateNode.containerInfo === n)
								return;
							r = r.return;
						}
					for (; h !== null; ) {
						if (((r = ca(h)), r === null)) return;
						if (((S = r.tag), S === 5 || S === 6 || S === 26 || S === 27)) {
							a = u = r;
							continue t;
						}
						h = h.parentNode;
					}
				}
				a = a.return;
			}
		lr(() => {
			var x = u,
				L = tc(l),
				B = [];
			t: {
				var z = Dr.get(t);
				if (z !== void 0) {
					var D = Eu,
						tt = t;
					switch (t) {
						case "keypress":
							if (bu(l) === 0) break t;
						case "keydown":
						case "keyup":
							D = tm;
							break;
						case "focusin":
							(tt = "focus"), (D = ic);
							break;
						case "focusout":
							(tt = "blur"), (D = ic);
							break;
						case "beforeblur":
						case "afterblur":
							D = ic;
							break;
						case "click":
							if (l.button === 2) break t;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							D = ur;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							D = Vv;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							D = am;
							break;
						case Ar:
						case Or:
						case xr:
							D = Zv;
							break;
						case zr:
							D = um;
							break;
						case "scroll":
						case "scrollend":
							D = wv;
							break;
						case "wheel":
							D = cm;
							break;
						case "copy":
						case "cut":
						case "paste":
							D = Jv;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							D = cr;
							break;
						case "toggle":
						case "beforetoggle":
							D = sm;
					}
					var F = (e & 4) !== 0,
						Tt = !F && (t === "scroll" || t === "scrollend"),
						T = F ? (z !== null ? z + "Capture" : null) : z;
					F = [];
					for (var E = x, O; E !== null; ) {
						var N = E;
						if (
							((O = N.stateNode),
							(N = N.tag),
							(N !== 5 && N !== 26 && N !== 27) ||
								O === null ||
								T === null ||
								((N = on(E, T)), N != null && F.push(Qn(E, N, O))),
							Tt)
						)
							break;
						E = E.return;
					}
					0 < F.length &&
						((z = new D(z, tt, null, l, L)),
						B.push({ event: z, listeners: F }));
				}
			}
			if ((e & 7) === 0) {
				t: {
					if (
						((z = t === "mouseover" || t === "pointerover"),
						(D = t === "mouseout" || t === "pointerout"),
						z &&
							l !== Ii &&
							(tt = l.relatedTarget || l.fromElement) &&
							(ca(tt) || tt[ia]))
					)
						break t;
					if (
						(D || z) &&
						((z =
							L.window === L
								? L
								: (z = L.ownerDocument)
									? z.defaultView || z.parentWindow
									: window),
						D
							? ((tt = l.relatedTarget || l.toElement),
								(D = x),
								(tt = tt ? ca(tt) : null),
								tt !== null &&
									((Tt = d(tt)),
									(F = tt.tag),
									tt !== Tt || (F !== 5 && F !== 27 && F !== 6)) &&
									(tt = null))
							: ((D = null), (tt = x)),
						D !== tt)
					) {
						if (
							((F = ur),
							(N = "onMouseLeave"),
							(T = "onMouseEnter"),
							(E = "mouse"),
							(t === "pointerout" || t === "pointerover") &&
								((F = cr),
								(N = "onPointerLeave"),
								(T = "onPointerEnter"),
								(E = "pointer")),
							(Tt = D == null ? z : cn(D)),
							(O = tt == null ? z : cn(tt)),
							(z = new F(N, E + "leave", D, l, L)),
							(z.target = Tt),
							(z.relatedTarget = O),
							(N = null),
							ca(L) === x &&
								((F = new F(T, E + "enter", tt, l, L)),
								(F.target = O),
								(F.relatedTarget = Tt),
								(N = F)),
							(Tt = N),
							D && tt)
						)
							e: {
								for (F = D, T = tt, E = 0, O = F; O; O = Ga(O)) E++;
								for (O = 0, N = T; N; N = Ga(N)) O++;
								for (; 0 < E - O; ) (F = Ga(F)), E--;
								for (; 0 < O - E; ) (T = Ga(T)), O--;
								for (; E--; ) {
									if (F === T || (T !== null && F === T.alternate)) break e;
									(F = Ga(F)), (T = Ga(T));
								}
								F = null;
							}
						else F = null;
						D !== null && Wd(B, z, D, F, !1),
							tt !== null && Tt !== null && Wd(B, Tt, tt, F, !0);
					}
				}
				t: {
					if (
						((z = x ? cn(x) : window),
						(D = z.nodeName && z.nodeName.toLowerCase()),
						D === "select" || (D === "input" && z.type === "file"))
					)
						var K = mr;
					else if (hr(z))
						if (yr) K = Sm;
						else {
							K = gm;
							var rt = ym;
						}
					else
						(D = z.nodeName),
							!D ||
							D.toLowerCase() !== "input" ||
							(z.type !== "checkbox" && z.type !== "radio")
								? x && Fi(x.elementType) && (K = mr)
								: (K = pm);
					if (K && (K = K(t, x))) {
						vr(B, K, l, L);
						break t;
					}
					rt && rt(t, z, x),
						t === "focusout" &&
							x &&
							z.type === "number" &&
							x.memoizedProps.value != null &&
							Wi(z, "number", z.value);
				}
				switch (((rt = x ? cn(x) : window), t)) {
					case "focusin":
						(hr(rt) || rt.contentEditable === "true") &&
							((ga = rt), (dc = x), (yn = null));
						break;
					case "focusout":
						yn = dc = ga = null;
						break;
					case "mousedown":
						hc = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						(hc = !1), Tr(B, l, L);
						break;
					case "selectionchange":
						if (bm) break;
					case "keydown":
					case "keyup":
						Tr(B, l, L);
				}
				var k;
				if (oc)
					t: {
						switch (t) {
							case "compositionstart": {
								var I = "onCompositionStart";
								break t;
							}
							case "compositionend":
								I = "onCompositionEnd";
								break t;
							case "compositionupdate":
								I = "onCompositionUpdate";
								break t;
						}
						I = void 0;
					}
				else
					ya
						? fr(t, l) && (I = "onCompositionEnd")
						: t === "keydown" &&
							l.keyCode === 229 &&
							(I = "onCompositionStart");
				I &&
					(or &&
						l.locale !== "ko" &&
						(ya || I !== "onCompositionStart"
							? I === "onCompositionEnd" && ya && (k = ar())
							: ((ol = L),
								(ac = "value" in ol ? ol.value : ol.textContent),
								(ya = !0))),
					(rt = ri(x, I)),
					0 < rt.length &&
						((I = new ir(I, t, null, l, L)),
						B.push({ event: I, listeners: rt }),
						k ? (I.data = k) : ((k = dr(l)), k !== null && (I.data = k)))),
					(k = fm ? dm(t, l) : hm(t, l)) &&
						((I = ri(x, "onBeforeInput")),
						0 < I.length &&
							((rt = new ir("onBeforeInput", "beforeinput", null, l, L)),
							B.push({ event: rt, listeners: I }),
							(rt.data = k))),
					a0(B, t, x, l, L);
			}
			$d(B, e);
		});
	}
	function Qn(t, e, l) {
		return { instance: t, listener: e, currentTarget: l };
	}
	function ri(t, e) {
		for (var l = e + "Capture", a = []; t !== null; ) {
			var n = t,
				u = n.stateNode;
			if (
				((n = n.tag),
				(n !== 5 && n !== 26 && n !== 27) ||
					u === null ||
					((n = on(t, l)),
					n != null && a.unshift(Qn(t, n, u)),
					(n = on(t, e)),
					n != null && a.push(Qn(t, n, u))),
				t.tag === 3)
			)
				return a;
			t = t.return;
		}
		return [];
	}
	function Ga(t) {
		if (t === null) return null;
		do t = t.return;
		while (t && t.tag !== 5 && t.tag !== 27);
		return t || null;
	}
	function Wd(t, e, l, a, n) {
		for (var u = e._reactName, r = []; l !== null && l !== a; ) {
			var h = l,
				S = h.alternate,
				x = h.stateNode;
			if (((h = h.tag), S !== null && S === a)) break;
			(h !== 5 && h !== 26 && h !== 27) ||
				x === null ||
				((S = x),
				n
					? ((x = on(l, u)), x != null && r.unshift(Qn(l, x, S)))
					: n || ((x = on(l, u)), x != null && r.push(Qn(l, x, S)))),
				(l = l.return);
		}
		r.length !== 0 && t.push({ event: e, listeners: r });
	}
	var c0 = /\r\n?/g,
		o0 = /\u0000|\uFFFD/g;
	function Fd(t) {
		return (typeof t == "string" ? t : "" + t)
			.replace(
				c0,
				`
`,
			)
			.replace(o0, "");
	}
	function Id(t, e) {
		return (e = Fd(e)), Fd(t) === e;
	}
	function fi() {}
	function Et(t, e, l, a, n, u) {
		switch (l) {
			case "children":
				typeof a == "string"
					? e === "body" || (e === "textarea" && a === "") || ha(t, a)
					: (typeof a == "number" || typeof a == "bigint") &&
						e !== "body" &&
						ha(t, "" + a);
				break;
			case "className":
				yu(t, "class", a);
				break;
			case "tabIndex":
				yu(t, "tabindex", a);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				yu(t, l, a);
				break;
			case "style":
				tr(t, a, u);
				break;
			case "data":
				if (e !== "object") {
					yu(t, "data", a);
					break;
				}
			case "src":
			case "href":
				if (a === "" && (e !== "a" || l !== "href")) {
					t.removeAttribute(l);
					break;
				}
				if (
					a == null ||
					typeof a == "function" ||
					typeof a == "symbol" ||
					typeof a == "boolean"
				) {
					t.removeAttribute(l);
					break;
				}
				(a = Su("" + a)), t.setAttribute(l, a);
				break;
			case "action":
			case "formAction":
				if (typeof a == "function") {
					t.setAttribute(
						l,
						"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
					);
					break;
				} else
					typeof u == "function" &&
						(l === "formAction"
							? (e !== "input" && Et(t, e, "name", n.name, n, null),
								Et(t, e, "formEncType", n.formEncType, n, null),
								Et(t, e, "formMethod", n.formMethod, n, null),
								Et(t, e, "formTarget", n.formTarget, n, null))
							: (Et(t, e, "encType", n.encType, n, null),
								Et(t, e, "method", n.method, n, null),
								Et(t, e, "target", n.target, n, null)));
				if (a == null || typeof a == "symbol" || typeof a == "boolean") {
					t.removeAttribute(l);
					break;
				}
				(a = Su("" + a)), t.setAttribute(l, a);
				break;
			case "onClick":
				a != null && (t.onclick = fi);
				break;
			case "onScroll":
				a != null && dt("scroll", t);
				break;
			case "onScrollEnd":
				a != null && dt("scrollend", t);
				break;
			case "dangerouslySetInnerHTML":
				if (a != null) {
					if (typeof a != "object" || !("__html" in a)) throw Error(o(61));
					if (((l = a.__html), l != null)) {
						if (n.children != null) throw Error(o(60));
						t.innerHTML = l;
					}
				}
				break;
			case "multiple":
				t.multiple = a && typeof a != "function" && typeof a != "symbol";
				break;
			case "muted":
				t.muted = a && typeof a != "function" && typeof a != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref":
				break;
			case "autoFocus":
				break;
			case "xlinkHref":
				if (
					a == null ||
					typeof a == "function" ||
					typeof a == "boolean" ||
					typeof a == "symbol"
				) {
					t.removeAttribute("xlink:href");
					break;
				}
				(l = Su("" + a)),
					t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", l);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				a != null && typeof a != "function" && typeof a != "symbol"
					? t.setAttribute(l, "" + a)
					: t.removeAttribute(l);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				a && typeof a != "function" && typeof a != "symbol"
					? t.setAttribute(l, "")
					: t.removeAttribute(l);
				break;
			case "capture":
			case "download":
				a === !0
					? t.setAttribute(l, "")
					: a !== !1 &&
							a != null &&
							typeof a != "function" &&
							typeof a != "symbol"
						? t.setAttribute(l, a)
						: t.removeAttribute(l);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				a != null &&
				typeof a != "function" &&
				typeof a != "symbol" &&
				!isNaN(a) &&
				1 <= a
					? t.setAttribute(l, a)
					: t.removeAttribute(l);
				break;
			case "rowSpan":
			case "start":
				a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
					? t.removeAttribute(l)
					: t.setAttribute(l, a);
				break;
			case "popover":
				dt("beforetoggle", t), dt("toggle", t), mu(t, "popover", a);
				break;
			case "xlinkActuate":
				Ve(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
				break;
			case "xlinkArcrole":
				Ve(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
				break;
			case "xlinkRole":
				Ve(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
				break;
			case "xlinkShow":
				Ve(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
				break;
			case "xlinkTitle":
				Ve(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
				break;
			case "xlinkType":
				Ve(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
				break;
			case "xmlBase":
				Ve(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
				break;
			case "xmlLang":
				Ve(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
				break;
			case "xmlSpace":
				Ve(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
				break;
			case "is":
				mu(t, "is", a);
				break;
			case "innerText":
			case "textContent":
				break;
			default:
				(!(2 < l.length) ||
					(l[0] !== "o" && l[0] !== "O") ||
					(l[1] !== "n" && l[1] !== "N")) &&
					((l = jv.get(l) || l), mu(t, l, a));
		}
	}
	function qo(t, e, l, a, n, u) {
		switch (l) {
			case "style":
				tr(t, a, u);
				break;
			case "dangerouslySetInnerHTML":
				if (a != null) {
					if (typeof a != "object" || !("__html" in a)) throw Error(o(61));
					if (((l = a.__html), l != null)) {
						if (n.children != null) throw Error(o(60));
						t.innerHTML = l;
					}
				}
				break;
			case "children":
				typeof a == "string"
					? ha(t, a)
					: (typeof a == "number" || typeof a == "bigint") && ha(t, "" + a);
				break;
			case "onScroll":
				a != null && dt("scroll", t);
				break;
			case "onScrollEnd":
				a != null && dt("scrollend", t);
				break;
			case "onClick":
				a != null && (t.onclick = fi);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref":
				break;
			case "innerText":
			case "textContent":
				break;
			default:
				if (!Object.hasOwn(Xs, l))
					t: {
						if (
							l[0] === "o" &&
							l[1] === "n" &&
							((n = l.endsWith("Capture")),
							(e = l.slice(2, n ? l.length - 7 : void 0)),
							(u = t[te] || null),
							(u = u != null ? u[l] : null),
							typeof u == "function" && t.removeEventListener(e, u, n),
							typeof a == "function")
						) {
							typeof u != "function" &&
								u !== null &&
								(l in t
									? (t[l] = null)
									: t.hasAttribute(l) && t.removeAttribute(l)),
								t.addEventListener(e, a, n);
							break t;
						}
						l in t
							? (t[l] = a)
							: a === !0
								? t.setAttribute(l, "")
								: mu(t, l, a);
					}
		}
	}
	function $t(t, e, l) {
		switch (e) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li":
				break;
			case "img": {
				dt("error", t), dt("load", t);
				var a = !1,
					n = !1,
					u;
				for (u in l)
					if (Object.hasOwn(l, u)) {
						var r = l[u];
						if (r != null)
							switch (u) {
								case "src":
									a = !0;
									break;
								case "srcSet":
									n = !0;
									break;
								case "children":
								case "dangerouslySetInnerHTML":
									throw Error(o(137, e));
								default:
									Et(t, e, u, r, l, null);
							}
					}
				n && Et(t, e, "srcSet", l.srcSet, l, null),
					a && Et(t, e, "src", l.src, l, null);
				return;
			}
			case "input": {
				dt("invalid", t);
				var h = (u = r = n = null),
					S = null,
					x = null;
				for (a in l)
					if (Object.hasOwn(l, a)) {
						var L = l[a];
						if (L != null)
							switch (a) {
								case "name":
									n = L;
									break;
								case "type":
									r = L;
									break;
								case "checked":
									S = L;
									break;
								case "defaultChecked":
									x = L;
									break;
								case "value":
									u = L;
									break;
								case "defaultValue":
									h = L;
									break;
								case "children":
								case "dangerouslySetInnerHTML":
									if (L != null) throw Error(o(137, e));
									break;
								default:
									Et(t, e, a, L, l, null);
							}
					}
				Ps(t, u, h, S, x, r, n, !1), gu(t);
				return;
			}
			case "select":
				dt("invalid", t), (a = r = u = null);
				for (n in l)
					if (Object.hasOwn(l, n) && ((h = l[n]), h != null))
						switch (n) {
							case "value":
								u = h;
								break;
							case "defaultValue":
								r = h;
								break;
							case "multiple":
								a = h;
							default:
								Et(t, e, n, h, l, null);
						}
				(e = u),
					(l = r),
					(t.multiple = !!a),
					e != null ? da(t, !!a, e, !1) : l != null && da(t, !!a, l, !0);
				return;
			case "textarea":
				dt("invalid", t), (u = n = a = null);
				for (r in l)
					if (Object.hasOwn(l, r) && ((h = l[r]), h != null))
						switch (r) {
							case "value":
								a = h;
								break;
							case "defaultValue":
								n = h;
								break;
							case "children":
								u = h;
								break;
							case "dangerouslySetInnerHTML":
								if (h != null) throw Error(o(91));
								break;
							default:
								Et(t, e, r, h, l, null);
						}
				Fs(t, a, n, u), gu(t);
				return;
			case "option":
				for (S in l)
					if (Object.hasOwn(l, S) && ((a = l[S]), a != null))
						switch (S) {
							case "selected":
								t.selected =
									a && typeof a != "function" && typeof a != "symbol";
								break;
							default:
								Et(t, e, S, a, l, null);
						}
				return;
			case "dialog":
				dt("beforetoggle", t), dt("toggle", t), dt("cancel", t), dt("close", t);
				break;
			case "iframe":
			case "object":
				dt("load", t);
				break;
			case "video":
			case "audio":
				for (a = 0; a < Xn.length; a++) dt(Xn[a], t);
				break;
			case "image":
				dt("error", t), dt("load", t);
				break;
			case "details":
				dt("toggle", t);
				break;
			case "embed":
			case "source":
			case "link":
				dt("error", t), dt("load", t);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (x in l)
					if (Object.hasOwn(l, x) && ((a = l[x]), a != null))
						switch (x) {
							case "children":
							case "dangerouslySetInnerHTML":
								throw Error(o(137, e));
							default:
								Et(t, e, x, a, l, null);
						}
				return;
			default:
				if (Fi(e)) {
					for (L in l)
						Object.hasOwn(l, L) &&
							((a = l[L]), a !== void 0 && qo(t, e, L, a, l, void 0));
					return;
				}
		}
		for (h in l)
			Object.hasOwn(l, h) && ((a = l[h]), a != null && Et(t, e, h, a, l, null));
	}
	function s0(t, e, l, a) {
		switch (e) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li":
				break;
			case "input": {
				var n = null,
					u = null,
					r = null,
					h = null,
					S = null,
					x = null,
					L = null;
				for (D in l) {
					var B = l[D];
					if (Object.hasOwn(l, D) && B != null)
						switch (D) {
							case "checked":
								break;
							case "value":
								break;
							case "defaultValue":
								S = B;
							default:
								Object.hasOwn(a, D) || Et(t, e, D, null, a, B);
						}
				}
				for (var z in a) {
					var D = a[z];
					if (((B = l[z]), Object.hasOwn(a, z) && (D != null || B != null)))
						switch (z) {
							case "type":
								u = D;
								break;
							case "name":
								n = D;
								break;
							case "checked":
								x = D;
								break;
							case "defaultChecked":
								L = D;
								break;
							case "value":
								r = D;
								break;
							case "defaultValue":
								h = D;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (D != null) throw Error(o(137, e));
								break;
							default:
								D !== B && Et(t, e, z, D, a, B);
						}
				}
				Pi(t, r, h, S, x, L, u, n);
				return;
			}
			case "select":
				D = r = h = z = null;
				for (u in l)
					if (((S = l[u]), Object.hasOwn(l, u) && S != null))
						switch (u) {
							case "value":
								break;
							case "multiple":
								D = S;
							default:
								Object.hasOwn(a, u) || Et(t, e, u, null, a, S);
						}
				for (n in a)
					if (
						((u = a[n]),
						(S = l[n]),
						Object.hasOwn(a, n) && (u != null || S != null))
					)
						switch (n) {
							case "value":
								z = u;
								break;
							case "defaultValue":
								h = u;
								break;
							case "multiple":
								r = u;
							default:
								u !== S && Et(t, e, n, u, a, S);
						}
				(e = h),
					(l = r),
					(a = D),
					z != null
						? da(t, !!l, z, !1)
						: !!a != !!l &&
							(e != null ? da(t, !!l, e, !0) : da(t, !!l, l ? [] : "", !1));
				return;
			case "textarea":
				D = z = null;
				for (h in l)
					if (
						((n = l[h]),
						Object.hasOwn(l, h) && n != null && !Object.hasOwn(a, h))
					)
						switch (h) {
							case "value":
								break;
							case "children":
								break;
							default:
								Et(t, e, h, null, a, n);
						}
				for (r in a)
					if (
						((n = a[r]),
						(u = l[r]),
						Object.hasOwn(a, r) && (n != null || u != null))
					)
						switch (r) {
							case "value":
								z = n;
								break;
							case "defaultValue":
								D = n;
								break;
							case "children":
								break;
							case "dangerouslySetInnerHTML":
								if (n != null) throw Error(o(91));
								break;
							default:
								n !== u && Et(t, e, r, n, a, u);
						}
				Ws(t, z, D);
				return;
			case "option":
				for (var tt in l)
					if (
						((z = l[tt]),
						Object.hasOwn(l, tt) && z != null && !Object.hasOwn(a, tt))
					)
						switch (tt) {
							case "selected":
								t.selected = !1;
								break;
							default:
								Et(t, e, tt, null, a, z);
						}
				for (S in a)
					if (
						((z = a[S]),
						(D = l[S]),
						Object.hasOwn(a, S) && z !== D && (z != null || D != null))
					)
						switch (S) {
							case "selected":
								t.selected =
									z && typeof z != "function" && typeof z != "symbol";
								break;
							default:
								Et(t, e, S, z, a, D);
						}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var F in l)
					(z = l[F]),
						Object.hasOwn(l, F) &&
							z != null &&
							!Object.hasOwn(a, F) &&
							Et(t, e, F, null, a, z);
				for (x in a)
					if (
						((z = a[x]),
						(D = l[x]),
						Object.hasOwn(a, x) && z !== D && (z != null || D != null))
					)
						switch (x) {
							case "children":
							case "dangerouslySetInnerHTML":
								if (z != null) throw Error(o(137, e));
								break;
							default:
								Et(t, e, x, z, a, D);
						}
				return;
			default:
				if (Fi(e)) {
					for (var Tt in l)
						(z = l[Tt]),
							Object.hasOwn(l, Tt) &&
								z !== void 0 &&
								!Object.hasOwn(a, Tt) &&
								qo(t, e, Tt, void 0, a, z);
					for (L in a)
						(z = a[L]),
							(D = l[L]),
							!Object.hasOwn(a, L) ||
								z === D ||
								(z === void 0 && D === void 0) ||
								qo(t, e, L, z, a, D);
					return;
				}
		}
		for (var T in l)
			(z = l[T]),
				Object.hasOwn(l, T) &&
					z != null &&
					!Object.hasOwn(a, T) &&
					Et(t, e, T, null, a, z);
		for (B in a)
			(z = a[B]),
				(D = l[B]),
				!Object.hasOwn(a, B) ||
					z === D ||
					(z == null && D == null) ||
					Et(t, e, B, z, a, D);
	}
	var jo = null,
		Yo = null;
	function di(t) {
		return t.nodeType === 9 ? t : t.ownerDocument;
	}
	function th(t) {
		switch (t) {
			case "http://www.w3.org/2000/svg":
				return 1;
			case "http://www.w3.org/1998/Math/MathML":
				return 2;
			default:
				return 0;
		}
	}
	function eh(t, e) {
		if (t === 0)
			switch (e) {
				case "svg":
					return 1;
				case "math":
					return 2;
				default:
					return 0;
			}
		return t === 1 && e === "foreignObject" ? 0 : t;
	}
	function wo(t, e) {
		return (
			t === "textarea" ||
			t === "noscript" ||
			typeof e.children == "string" ||
			typeof e.children == "number" ||
			typeof e.children == "bigint" ||
			(typeof e.dangerouslySetInnerHTML == "object" &&
				e.dangerouslySetInnerHTML !== null &&
				e.dangerouslySetInnerHTML.__html != null)
		);
	}
	var Go = null;
	function r0() {
		var t = window.event;
		return t && t.type === "popstate"
			? t === Go
				? !1
				: ((Go = t), !0)
			: ((Go = null), !1);
	}
	var lh = typeof setTimeout == "function" ? setTimeout : void 0,
		f0 = typeof clearTimeout == "function" ? clearTimeout : void 0,
		ah = typeof Promise == "function" ? Promise : void 0,
		d0 =
			typeof queueMicrotask == "function"
				? queueMicrotask
				: typeof ah < "u"
					? (t) => ah.resolve(null).then(t).catch(h0)
					: lh;
	function h0(t) {
		setTimeout(() => {
			throw t;
		});
	}
	function Tl(t) {
		return t === "head";
	}
	function nh(t, e) {
		var l = e,
			a = 0,
			n = 0;
		do {
			var u = l.nextSibling;
			if ((t.removeChild(l), u && u.nodeType === 8))
				if (((l = u.data), l === "/$")) {
					if (0 < a && 8 > a) {
						l = a;
						var r = t.ownerDocument;
						if ((l & 1 && Zn(r.documentElement), l & 2 && Zn(r.body), l & 4))
							for (l = r.head, Zn(l), r = l.firstChild; r; ) {
								var h = r.nextSibling,
									S = r.nodeName;
								r[un] ||
									S === "SCRIPT" ||
									S === "STYLE" ||
									(S === "LINK" && r.rel.toLowerCase() === "stylesheet") ||
									l.removeChild(r),
									(r = h);
							}
					}
					if (n === 0) {
						t.removeChild(u), In(e);
						return;
					}
					n--;
				} else
					l === "$" || l === "$?" || l === "$!"
						? n++
						: (a = l.charCodeAt(0) - 48);
			else a = 0;
			l = u;
		} while (l);
		In(e);
	}
	function Vo(t) {
		var e = t.firstChild;
		for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
			var l = e;
			switch (((e = e.nextSibling), l.nodeName)) {
				case "HTML":
				case "HEAD":
				case "BODY":
					Vo(l), Ki(l);
					continue;
				case "SCRIPT":
				case "STYLE":
					continue;
				case "LINK":
					if (l.rel.toLowerCase() === "stylesheet") continue;
			}
			t.removeChild(l);
		}
	}
	function v0(t, e, l, a) {
		for (; t.nodeType === 1; ) {
			var n = l;
			if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
				if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
			} else if (a) {
				if (!t[un])
					switch (e) {
						case "meta":
							if (!t.hasAttribute("itemprop")) break;
							return t;
						case "link":
							if (
								((u = t.getAttribute("rel")),
								u === "stylesheet" && t.hasAttribute("data-precedence"))
							)
								break;
							if (
								u !== n.rel ||
								t.getAttribute("href") !==
									(n.href == null || n.href === "" ? null : n.href) ||
								t.getAttribute("crossorigin") !==
									(n.crossOrigin == null ? null : n.crossOrigin) ||
								t.getAttribute("title") !== (n.title == null ? null : n.title)
							)
								break;
							return t;
						case "style":
							if (t.hasAttribute("data-precedence")) break;
							return t;
						case "script":
							if (
								((u = t.getAttribute("src")),
								(u !== (n.src == null ? null : n.src) ||
									t.getAttribute("type") !== (n.type == null ? null : n.type) ||
									t.getAttribute("crossorigin") !==
										(n.crossOrigin == null ? null : n.crossOrigin)) &&
									u &&
									t.hasAttribute("async") &&
									!t.hasAttribute("itemprop"))
							)
								break;
							return t;
						default:
							return t;
					}
			} else if (e === "input" && t.type === "hidden") {
				var u = n.name == null ? null : "" + n.name;
				if (n.type === "hidden" && t.getAttribute("name") === u) return t;
			} else return t;
			if (((t = Le(t.nextSibling)), t === null)) break;
		}
		return null;
	}
	function m0(t, e, l) {
		if (e === "") return null;
		for (; t.nodeType !== 3; )
			if (
				((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") &&
					!l) ||
				((t = Le(t.nextSibling)), t === null)
			)
				return null;
		return t;
	}
	function Xo(t) {
		return (
			t.data === "$!" ||
			(t.data === "$?" && t.ownerDocument.readyState === "complete")
		);
	}
	function y0(t, e) {
		var l = t.ownerDocument;
		if (t.data !== "$?" || l.readyState === "complete") e();
		else {
			var a = () => {
				e(), l.removeEventListener("DOMContentLoaded", a);
			};
			l.addEventListener("DOMContentLoaded", a), (t._reactRetry = a);
		}
	}
	function Le(t) {
		for (; t != null; t = t.nextSibling) {
			var e = t.nodeType;
			if (e === 1 || e === 3) break;
			if (e === 8) {
				if (
					((e = t.data),
					e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")
				)
					break;
				if (e === "/$") return null;
			}
		}
		return t;
	}
	var Qo = null;
	function uh(t) {
		t = t.previousSibling;
		for (var e = 0; t; ) {
			if (t.nodeType === 8) {
				var l = t.data;
				if (l === "$" || l === "$!" || l === "$?") {
					if (e === 0) return t;
					e--;
				} else l === "/$" && e++;
			}
			t = t.previousSibling;
		}
		return null;
	}
	function ih(t, e, l) {
		switch (((e = di(l)), t)) {
			case "html":
				if (((t = e.documentElement), !t)) throw Error(o(452));
				return t;
			case "head":
				if (((t = e.head), !t)) throw Error(o(453));
				return t;
			case "body":
				if (((t = e.body), !t)) throw Error(o(454));
				return t;
			default:
				throw Error(o(451));
		}
	}
	function Zn(t) {
		for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
		Ki(t);
	}
	var Ae = new Map(),
		ch = new Set();
	function hi(t) {
		return typeof t.getRootNode == "function"
			? t.getRootNode()
			: t.nodeType === 9
				? t
				: t.ownerDocument;
	}
	var ll = Y.d;
	Y.d = { f: g0, r: p0, D: S0, C: _0, L: b0, m: R0, X: T0, S: E0, M: M0 };
	function g0() {
		var t = ll.f(),
			e = ni();
		return t || e;
	}
	function p0(t) {
		var e = oa(t);
		e !== null && e.tag === 5 && e.type === "form" ? Of(e) : ll.r(t);
	}
	var Va = typeof document > "u" ? null : document;
	function oh(t, e, l) {
		var a = Va;
		if (a && typeof e == "string" && e) {
			var n = Se(e);
			(n = 'link[rel="' + t + '"][href="' + n + '"]'),
				typeof l == "string" && (n += '[crossorigin="' + l + '"]'),
				ch.has(n) ||
					(ch.add(n),
					(t = { rel: t, crossOrigin: l, href: e }),
					a.querySelector(n) === null &&
						((e = a.createElement("link")),
						$t(e, "link", t),
						Gt(e),
						a.head.appendChild(e)));
		}
	}
	function S0(t) {
		ll.D(t), oh("dns-prefetch", t, null);
	}
	function _0(t, e) {
		ll.C(t, e), oh("preconnect", t, e);
	}
	function b0(t, e, l) {
		ll.L(t, e, l);
		var a = Va;
		if (a && t && e) {
			var n = 'link[rel="preload"][as="' + Se(e) + '"]';
			e === "image" && l && l.imageSrcSet
				? ((n += '[imagesrcset="' + Se(l.imageSrcSet) + '"]'),
					typeof l.imageSizes == "string" &&
						(n += '[imagesizes="' + Se(l.imageSizes) + '"]'))
				: (n += '[href="' + Se(t) + '"]');
			var u = n;
			switch (e) {
				case "style":
					u = Xa(t);
					break;
				case "script":
					u = Qa(t);
			}
			Ae.has(u) ||
				((t = b(
					{
						rel: "preload",
						href: e === "image" && l && l.imageSrcSet ? void 0 : t,
						as: e,
					},
					l,
				)),
				Ae.set(u, t),
				a.querySelector(n) !== null ||
					(e === "style" && a.querySelector(Kn(u))) ||
					(e === "script" && a.querySelector(Jn(u))) ||
					((e = a.createElement("link")),
					$t(e, "link", t),
					Gt(e),
					a.head.appendChild(e)));
		}
	}
	function R0(t, e) {
		ll.m(t, e);
		var l = Va;
		if (l && t) {
			var a = e && typeof e.as == "string" ? e.as : "script",
				n =
					'link[rel="modulepreload"][as="' + Se(a) + '"][href="' + Se(t) + '"]',
				u = n;
			switch (a) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script":
					u = Qa(t);
			}
			if (
				!Ae.has(u) &&
				((t = b({ rel: "modulepreload", href: t }, e)),
				Ae.set(u, t),
				l.querySelector(n) === null)
			) {
				switch (a) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script":
						if (l.querySelector(Jn(u))) return;
				}
				(a = l.createElement("link")),
					$t(a, "link", t),
					Gt(a),
					l.head.appendChild(a);
			}
		}
	}
	function E0(t, e, l) {
		ll.S(t, e, l);
		var a = Va;
		if (a && t) {
			var n = sa(a).hoistableStyles,
				u = Xa(t);
			e = e || "default";
			var r = n.get(u);
			if (!r) {
				var h = { loading: 0, preload: null };
				if ((r = a.querySelector(Kn(u)))) h.loading = 5;
				else {
					(t = b({ rel: "stylesheet", href: t, "data-precedence": e }, l)),
						(l = Ae.get(u)) && Zo(t, l);
					var S = (r = a.createElement("link"));
					Gt(S),
						$t(S, "link", t),
						(S._p = new Promise((x, L) => {
							(S.onload = x), (S.onerror = L);
						})),
						S.addEventListener("load", () => {
							h.loading |= 1;
						}),
						S.addEventListener("error", () => {
							h.loading |= 2;
						}),
						(h.loading |= 4),
						vi(r, e, a);
				}
				(r = { type: "stylesheet", instance: r, count: 1, state: h }),
					n.set(u, r);
			}
		}
	}
	function T0(t, e) {
		ll.X(t, e);
		var l = Va;
		if (l && t) {
			var a = sa(l).hoistableScripts,
				n = Qa(t),
				u = a.get(n);
			u ||
				((u = l.querySelector(Jn(n))),
				u ||
					((t = b({ src: t, async: !0 }, e)),
					(e = Ae.get(n)) && Ko(t, e),
					(u = l.createElement("script")),
					Gt(u),
					$t(u, "link", t),
					l.head.appendChild(u)),
				(u = { type: "script", instance: u, count: 1, state: null }),
				a.set(n, u));
		}
	}
	function M0(t, e) {
		ll.M(t, e);
		var l = Va;
		if (l && t) {
			var a = sa(l).hoistableScripts,
				n = Qa(t),
				u = a.get(n);
			u ||
				((u = l.querySelector(Jn(n))),
				u ||
					((t = b({ src: t, async: !0, type: "module" }, e)),
					(e = Ae.get(n)) && Ko(t, e),
					(u = l.createElement("script")),
					Gt(u),
					$t(u, "link", t),
					l.head.appendChild(u)),
				(u = { type: "script", instance: u, count: 1, state: null }),
				a.set(n, u));
		}
	}
	function sh(t, e, l, a) {
		var n = (n = W.current) ? hi(n) : null;
		if (!n) throw Error(o(446));
		switch (t) {
			case "meta":
			case "title":
				return null;
			case "style":
				return typeof l.precedence == "string" && typeof l.href == "string"
					? ((e = Xa(l.href)),
						(l = sa(n).hoistableStyles),
						(a = l.get(e)),
						a ||
							((a = { type: "style", instance: null, count: 0, state: null }),
							l.set(e, a)),
						a)
					: { type: "void", instance: null, count: 0, state: null };
			case "link":
				if (
					l.rel === "stylesheet" &&
					typeof l.href == "string" &&
					typeof l.precedence == "string"
				) {
					t = Xa(l.href);
					var u = sa(n).hoistableStyles,
						r = u.get(t);
					if (
						(r ||
							((n = n.ownerDocument || n),
							(r = {
								type: "stylesheet",
								instance: null,
								count: 0,
								state: { loading: 0, preload: null },
							}),
							u.set(t, r),
							(u = n.querySelector(Kn(t))) &&
								!u._p &&
								((r.instance = u), (r.state.loading = 5)),
							Ae.has(t) ||
								((l = {
									rel: "preload",
									as: "style",
									href: l.href,
									crossOrigin: l.crossOrigin,
									integrity: l.integrity,
									media: l.media,
									hrefLang: l.hrefLang,
									referrerPolicy: l.referrerPolicy,
								}),
								Ae.set(t, l),
								u || A0(n, t, l, r.state))),
						e && a === null)
					)
						throw Error(o(528, ""));
					return r;
				}
				if (e && a !== null) throw Error(o(529, ""));
				return null;
			case "script":
				return (
					(e = l.async),
					(l = l.src),
					typeof l == "string" &&
					e &&
					typeof e != "function" &&
					typeof e != "symbol"
						? ((e = Qa(l)),
							(l = sa(n).hoistableScripts),
							(a = l.get(e)),
							a ||
								((a = {
									type: "script",
									instance: null,
									count: 0,
									state: null,
								}),
								l.set(e, a)),
							a)
						: { type: "void", instance: null, count: 0, state: null }
				);
			default:
				throw Error(o(444, t));
		}
	}
	function Xa(t) {
		return 'href="' + Se(t) + '"';
	}
	function Kn(t) {
		return 'link[rel="stylesheet"][' + t + "]";
	}
	function rh(t) {
		return b({}, t, { "data-precedence": t.precedence, precedence: null });
	}
	function A0(t, e, l, a) {
		t.querySelector('link[rel="preload"][as="style"][' + e + "]")
			? (a.loading = 1)
			: ((e = t.createElement("link")),
				(a.preload = e),
				e.addEventListener("load", () => (a.loading |= 1)),
				e.addEventListener("error", () => (a.loading |= 2)),
				$t(e, "link", l),
				Gt(e),
				t.head.appendChild(e));
	}
	function Qa(t) {
		return '[src="' + Se(t) + '"]';
	}
	function Jn(t) {
		return "script[async]" + t;
	}
	function fh(t, e, l) {
		if ((e.count++, e.instance === null))
			switch (e.type) {
				case "style": {
					var a = t.querySelector('style[data-href~="' + Se(l.href) + '"]');
					if (a) return (e.instance = a), Gt(a), a;
					var n = b({}, l, {
						"data-href": l.href,
						"data-precedence": l.precedence,
						href: null,
						precedence: null,
					});
					return (
						(a = (t.ownerDocument || t).createElement("style")),
						Gt(a),
						$t(a, "style", n),
						vi(a, l.precedence, t),
						(e.instance = a)
					);
				}
				case "stylesheet": {
					n = Xa(l.href);
					var u = t.querySelector(Kn(n));
					if (u) return (e.state.loading |= 4), (e.instance = u), Gt(u), u;
					(a = rh(l)),
						(n = Ae.get(n)) && Zo(a, n),
						(u = (t.ownerDocument || t).createElement("link")),
						Gt(u);
					var r = u;
					return (
						(r._p = new Promise((h, S) => {
							(r.onload = h), (r.onerror = S);
						})),
						$t(u, "link", a),
						(e.state.loading |= 4),
						vi(u, l.precedence, t),
						(e.instance = u)
					);
				}
				case "script":
					return (
						(u = Qa(l.src)),
						(n = t.querySelector(Jn(u)))
							? ((e.instance = n), Gt(n), n)
							: ((a = l),
								(n = Ae.get(u)) && ((a = b({}, l)), Ko(a, n)),
								(t = t.ownerDocument || t),
								(n = t.createElement("script")),
								Gt(n),
								$t(n, "link", a),
								t.head.appendChild(n),
								(e.instance = n))
					);
				case "void":
					return null;
				default:
					throw Error(o(443, e.type));
			}
		else
			e.type === "stylesheet" &&
				(e.state.loading & 4) === 0 &&
				((a = e.instance), (e.state.loading |= 4), vi(a, l.precedence, t));
		return e.instance;
	}
	function vi(t, e, l) {
		for (
			var a = l.querySelectorAll(
					'link[rel="stylesheet"][data-precedence],style[data-precedence]',
				),
				n = a.length ? a[a.length - 1] : null,
				u = n,
				r = 0;
			r < a.length;
			r++
		) {
			var h = a[r];
			if (h.dataset.precedence === e) u = h;
			else if (u !== n) break;
		}
		u
			? u.parentNode.insertBefore(t, u.nextSibling)
			: ((e = l.nodeType === 9 ? l.head : l), e.insertBefore(t, e.firstChild));
	}
	function Zo(t, e) {
		t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
			t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
			t.title == null && (t.title = e.title);
	}
	function Ko(t, e) {
		t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
			t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
			t.integrity == null && (t.integrity = e.integrity);
	}
	var mi = null;
	function dh(t, e, l) {
		if (mi === null) {
			var a = new Map(),
				n = (mi = new Map());
			n.set(l, a);
		} else (n = mi), (a = n.get(l)), a || ((a = new Map()), n.set(l, a));
		if (a.has(t)) return a;
		for (
			a.set(t, null), l = l.getElementsByTagName(t), n = 0;
			n < l.length;
			n++
		) {
			var u = l[n];
			if (
				!(
					u[un] ||
					u[Pt] ||
					(t === "link" && u.getAttribute("rel") === "stylesheet")
				) &&
				u.namespaceURI !== "http://www.w3.org/2000/svg"
			) {
				var r = u.getAttribute(e) || "";
				r = t + r;
				var h = a.get(r);
				h ? h.push(u) : a.set(r, [u]);
			}
		}
		return a;
	}
	function hh(t, e, l) {
		(t = t.ownerDocument || t),
			t.head.insertBefore(
				l,
				e === "title" ? t.querySelector("head > title") : null,
			);
	}
	function O0(t, e, l) {
		if (l === 1 || e.itemProp != null) return !1;
		switch (t) {
			case "meta":
			case "title":
				return !0;
			case "style":
				if (
					typeof e.precedence != "string" ||
					typeof e.href != "string" ||
					e.href === ""
				)
					break;
				return !0;
			case "link":
				if (
					typeof e.rel != "string" ||
					typeof e.href != "string" ||
					e.href === "" ||
					e.onLoad ||
					e.onError
				)
					break;
				switch (e.rel) {
					case "stylesheet":
						return (
							(t = e.disabled), typeof e.precedence == "string" && t == null
						);
					default:
						return !0;
				}
			case "script":
				if (
					e.async &&
					typeof e.async != "function" &&
					typeof e.async != "symbol" &&
					!e.onLoad &&
					!e.onError &&
					e.src &&
					typeof e.src == "string"
				)
					return !0;
		}
		return !1;
	}
	function vh(t) {
		return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
	}
	var kn = null;
	function x0() {}
	function z0(t, e, l) {
		if (kn === null) throw Error(o(475));
		var a = kn;
		if (
			e.type === "stylesheet" &&
			(typeof l.media != "string" || matchMedia(l.media).matches !== !1) &&
			(e.state.loading & 4) === 0
		) {
			if (e.instance === null) {
				var n = Xa(l.href),
					u = t.querySelector(Kn(n));
				if (u) {
					(t = u._p),
						t !== null &&
							typeof t == "object" &&
							typeof t.then == "function" &&
							(a.count++, (a = yi.bind(a)), t.then(a, a)),
						(e.state.loading |= 4),
						(e.instance = u),
						Gt(u);
					return;
				}
				(u = t.ownerDocument || t),
					(l = rh(l)),
					(n = Ae.get(n)) && Zo(l, n),
					(u = u.createElement("link")),
					Gt(u);
				var r = u;
				(r._p = new Promise((h, S) => {
					(r.onload = h), (r.onerror = S);
				})),
					$t(u, "link", l),
					(e.instance = u);
			}
			a.stylesheets === null && (a.stylesheets = new Map()),
				a.stylesheets.set(e, t),
				(t = e.state.preload) &&
					(e.state.loading & 3) === 0 &&
					(a.count++,
					(e = yi.bind(a)),
					t.addEventListener("load", e),
					t.addEventListener("error", e));
		}
	}
	function D0() {
		if (kn === null) throw Error(o(475));
		var t = kn;
		return (
			t.stylesheets && t.count === 0 && Jo(t, t.stylesheets),
			0 < t.count
				? (e) => {
						var l = setTimeout(() => {
							if ((t.stylesheets && Jo(t, t.stylesheets), t.unsuspend)) {
								var a = t.unsuspend;
								(t.unsuspend = null), a();
							}
						}, 6e4);
						return (
							(t.unsuspend = e),
							() => {
								(t.unsuspend = null), clearTimeout(l);
							}
						);
					}
				: null
		);
	}
	function yi() {
		if ((this.count--, this.count === 0)) {
			if (this.stylesheets) Jo(this, this.stylesheets);
			else if (this.unsuspend) {
				var t = this.unsuspend;
				(this.unsuspend = null), t();
			}
		}
	}
	var gi = null;
	function Jo(t, e) {
		(t.stylesheets = null),
			t.unsuspend !== null &&
				(t.count++,
				(gi = new Map()),
				e.forEach(C0, t),
				(gi = null),
				yi.call(t));
	}
	function C0(t, e) {
		if (!(e.state.loading & 4)) {
			var l = gi.get(t);
			if (l) var a = l.get(null);
			else {
				(l = new Map()), gi.set(t, l);
				for (
					var n = t.querySelectorAll(
							"link[data-precedence],style[data-precedence]",
						),
						u = 0;
					u < n.length;
					u++
				) {
					var r = n[u];
					(r.nodeName === "LINK" || r.getAttribute("media") !== "not all") &&
						(l.set(r.dataset.precedence, r), (a = r));
				}
				a && l.set(null, a);
			}
			(n = e.instance),
				(r = n.getAttribute("data-precedence")),
				(u = l.get(r) || a),
				u === a && l.set(null, n),
				l.set(r, n),
				this.count++,
				(a = yi.bind(this)),
				n.addEventListener("load", a),
				n.addEventListener("error", a),
				u
					? u.parentNode.insertBefore(n, u.nextSibling)
					: ((t = t.nodeType === 9 ? t.head : t),
						t.insertBefore(n, t.firstChild)),
				(e.state.loading |= 4);
		}
	}
	var $n = {
		$$typeof: X,
		Provider: null,
		Consumer: null,
		_currentValue: P,
		_currentValue2: P,
		_threadCount: 0,
	};
	function U0(t, e, l, a, n, u, r, h) {
		(this.tag = 1),
			(this.containerInfo = t),
			(this.pingCache = this.current = this.pendingChildren = null),
			(this.timeoutHandle = -1),
			(this.callbackNode =
				this.next =
				this.pendingContext =
				this.context =
				this.cancelPendingCommit =
					null),
			(this.callbackPriority = 0),
			(this.expirationTimes = Vi(-1)),
			(this.entangledLanes =
				this.shellSuspendCounter =
				this.errorRecoveryDisabledLanes =
				this.expiredLanes =
				this.warmLanes =
				this.pingedLanes =
				this.suspendedLanes =
				this.pendingLanes =
					0),
			(this.entanglements = Vi(0)),
			(this.hiddenUpdates = Vi(null)),
			(this.identifierPrefix = a),
			(this.onUncaughtError = n),
			(this.onCaughtError = u),
			(this.onRecoverableError = r),
			(this.pooledCache = null),
			(this.pooledCacheLanes = 0),
			(this.formState = h),
			(this.incompleteTransitions = new Map());
	}
	function mh(t, e, l, a, n, u, r, h, S, x, L, B) {
		return (
			(t = new U0(t, e, l, r, h, S, x, B)),
			(e = 1),
			u === !0 && (e |= 24),
			(u = se(3, null, null, e)),
			(t.current = u),
			(u.stateNode = t),
			(e = Oc()),
			e.refCount++,
			(t.pooledCache = e),
			e.refCount++,
			(u.memoizedState = { element: a, isDehydrated: l, cache: e }),
			Cc(u),
			t
		);
	}
	function yh(t) {
		return t ? ((t = ba), t) : ba;
	}
	function gh(t, e, l, a, n, u) {
		(n = yh(n)),
			a.context === null ? (a.context = n) : (a.pendingContext = n),
			(a = fl(e)),
			(a.payload = { element: l }),
			(u = u === void 0 ? null : u),
			u !== null && (a.callback = u),
			(l = dl(t, a, e)),
			l !== null && (ve(l, t, e), Mn(l, t, e));
	}
	function ph(t, e) {
		if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
			var l = t.retryLane;
			t.retryLane = l !== 0 && l < e ? l : e;
		}
	}
	function ko(t, e) {
		ph(t, e), (t = t.alternate) && ph(t, e);
	}
	function Sh(t) {
		if (t.tag === 13) {
			var e = _a(t, 67108864);
			e !== null && ve(e, t, 67108864), ko(t, 67108864);
		}
	}
	var pi = !0;
	function L0(t, e, l, a) {
		var n = C.T;
		C.T = null;
		var u = Y.p;
		try {
			(Y.p = 2), $o(t, e, l, a);
		} finally {
			(Y.p = u), (C.T = n);
		}
	}
	function N0(t, e, l, a) {
		var n = C.T;
		C.T = null;
		var u = Y.p;
		try {
			(Y.p = 8), $o(t, e, l, a);
		} finally {
			(Y.p = u), (C.T = n);
		}
	}
	function $o(t, e, l, a) {
		if (pi) {
			var n = Po(a);
			if (n === null) Ho(t, e, a, Si, l), bh(t, a);
			else if (H0(n, t, e, l, a)) a.stopPropagation();
			else if ((bh(t, a), e & 4 && -1 < B0.indexOf(t))) {
				for (; n !== null; ) {
					var u = oa(n);
					if (u !== null)
						switch (u.tag) {
							case 3:
								if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
									var r = Hl(u.pendingLanes);
									if (r !== 0) {
										var h = u;
										for (h.pendingLanes |= 2, h.entangledLanes |= 2; r; ) {
											var S = 1 << (31 - ce(r));
											(h.entanglements[1] |= S), (r &= ~S);
										}
										Ye(u), (_t & 6) === 0 && ((li = ge() + 500), Vn(0));
									}
								}
								break;
							case 13:
								(h = _a(u, 2)), h !== null && ve(h, u, 2), ni(), ko(u, 2);
						}
					if (((u = Po(a)), u === null && Ho(t, e, a, Si, l), u === n)) break;
					n = u;
				}
				n !== null && a.stopPropagation();
			} else Ho(t, e, a, null, l);
		}
	}
	function Po(t) {
		return (t = tc(t)), Wo(t);
	}
	var Si = null;
	function Wo(t) {
		if (((Si = null), (t = ca(t)), t !== null)) {
			var e = d(t);
			if (e === null) t = null;
			else {
				var l = e.tag;
				if (l === 13) {
					if (((t = y(e)), t !== null)) return t;
					t = null;
				} else if (l === 3) {
					if (e.stateNode.current.memoizedState.isDehydrated)
						return e.tag === 3 ? e.stateNode.containerInfo : null;
					t = null;
				} else e !== t && (t = null);
			}
		}
		return (Si = t), null;
	}
	function _h(t) {
		switch (t) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart":
				return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave":
				return 8;
			case "message":
				switch (ua()) {
					case Nl:
						return 2;
					case en:
						return 8;
					case Bl:
					case Ot:
						return 32;
					case Kt:
						return 268435456;
					default:
						return 32;
				}
			default:
				return 32;
		}
	}
	var Fo = !1,
		Ml = null,
		Al = null,
		Ol = null,
		Pn = new Map(),
		Wn = new Map(),
		xl = [],
		B0 =
			"mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
				" ",
			);
	function bh(t, e) {
		switch (t) {
			case "focusin":
			case "focusout":
				Ml = null;
				break;
			case "dragenter":
			case "dragleave":
				Al = null;
				break;
			case "mouseover":
			case "mouseout":
				Ol = null;
				break;
			case "pointerover":
			case "pointerout":
				Pn.delete(e.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture":
				Wn.delete(e.pointerId);
		}
	}
	function Fn(t, e, l, a, n, u) {
		return t === null || t.nativeEvent !== u
			? ((t = {
					blockedOn: e,
					domEventName: l,
					eventSystemFlags: a,
					nativeEvent: u,
					targetContainers: [n],
				}),
				e !== null && ((e = oa(e)), e !== null && Sh(e)),
				t)
			: ((t.eventSystemFlags |= a),
				(e = t.targetContainers),
				n !== null && e.indexOf(n) === -1 && e.push(n),
				t);
	}
	function H0(t, e, l, a, n) {
		switch (e) {
			case "focusin":
				return (Ml = Fn(Ml, t, e, l, a, n)), !0;
			case "dragenter":
				return (Al = Fn(Al, t, e, l, a, n)), !0;
			case "mouseover":
				return (Ol = Fn(Ol, t, e, l, a, n)), !0;
			case "pointerover": {
				var u = n.pointerId;
				return Pn.set(u, Fn(Pn.get(u) || null, t, e, l, a, n)), !0;
			}
			case "gotpointercapture":
				return (
					(u = n.pointerId), Wn.set(u, Fn(Wn.get(u) || null, t, e, l, a, n)), !0
				);
		}
		return !1;
	}
	function Rh(t) {
		var e = ca(t.target);
		if (e !== null) {
			var l = d(e);
			if (l !== null) {
				if (((e = l.tag), e === 13)) {
					if (((e = y(l)), e !== null)) {
						(t.blockedOn = e),
							zv(t.priority, () => {
								if (l.tag === 13) {
									var a = he();
									a = Xi(a);
									var n = _a(l, a);
									n !== null && ve(n, l, a), ko(l, a);
								}
							});
						return;
					}
				} else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
					t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
					return;
				}
			}
		}
		t.blockedOn = null;
	}
	function _i(t) {
		if (t.blockedOn !== null) return !1;
		for (var e = t.targetContainers; 0 < e.length; ) {
			var l = Po(t.nativeEvent);
			if (l === null) {
				l = t.nativeEvent;
				var a = new l.constructor(l.type, l);
				(Ii = a), l.target.dispatchEvent(a), (Ii = null);
			} else return (e = oa(l)), e !== null && Sh(e), (t.blockedOn = l), !1;
			e.shift();
		}
		return !0;
	}
	function Eh(t, e, l) {
		_i(t) && l.delete(e);
	}
	function q0() {
		(Fo = !1),
			Ml !== null && _i(Ml) && (Ml = null),
			Al !== null && _i(Al) && (Al = null),
			Ol !== null && _i(Ol) && (Ol = null),
			Pn.forEach(Eh),
			Wn.forEach(Eh);
	}
	function bi(t, e) {
		t.blockedOn === e &&
			((t.blockedOn = null),
			Fo ||
				((Fo = !0),
				i.unstable_scheduleCallback(i.unstable_NormalPriority, q0)));
	}
	var Ri = null;
	function Th(t) {
		Ri !== t &&
			((Ri = t),
			i.unstable_scheduleCallback(i.unstable_NormalPriority, () => {
				Ri === t && (Ri = null);
				for (var e = 0; e < t.length; e += 3) {
					var l = t[e],
						a = t[e + 1],
						n = t[e + 2];
					if (typeof a != "function") {
						if (Wo(a || l) === null) continue;
						break;
					}
					var u = oa(l);
					u !== null &&
						(t.splice(e, 3),
						(e -= 3),
						Pc(u, { pending: !0, data: n, method: l.method, action: a }, a, n));
				}
			}));
	}
	function In(t) {
		function e(S) {
			return bi(S, t);
		}
		Ml !== null && bi(Ml, t),
			Al !== null && bi(Al, t),
			Ol !== null && bi(Ol, t),
			Pn.forEach(e),
			Wn.forEach(e);
		for (var l = 0; l < xl.length; l++) {
			var a = xl[l];
			a.blockedOn === t && (a.blockedOn = null);
		}
		for (; 0 < xl.length && ((l = xl[0]), l.blockedOn === null); )
			Rh(l), l.blockedOn === null && xl.shift();
		if (((l = (t.ownerDocument || t).$$reactFormReplay), l != null))
			for (a = 0; a < l.length; a += 3) {
				var n = l[a],
					u = l[a + 1],
					r = n[te] || null;
				if (typeof u == "function") r || Th(l);
				else if (r) {
					var h = null;
					if (u && u.hasAttribute("formAction")) {
						if (((n = u), (r = u[te] || null))) h = r.formAction;
						else if (Wo(n) !== null) continue;
					} else h = r.action;
					typeof h == "function" ? (l[a + 1] = h) : (l.splice(a, 3), (a -= 3)),
						Th(l);
				}
			}
	}
	function Io(t) {
		this._internalRoot = t;
	}
	(Ei.prototype.render = Io.prototype.render =
		function (t) {
			var e = this._internalRoot;
			if (e === null) throw Error(o(409));
			var l = e.current,
				a = he();
			gh(l, a, t, e, null, null);
		}),
		(Ei.prototype.unmount = Io.prototype.unmount =
			function () {
				var t = this._internalRoot;
				if (t !== null) {
					this._internalRoot = null;
					var e = t.containerInfo;
					gh(t.current, 2, null, t, null, null), ni(), (e[ia] = null);
				}
			});
	function Ei(t) {
		this._internalRoot = t;
	}
	Ei.prototype.unstable_scheduleHydration = (t) => {
		if (t) {
			var e = ws();
			t = { blockedOn: null, target: t, priority: e };
			for (var l = 0; l < xl.length && e !== 0 && e < xl[l].priority; l++);
			xl.splice(l, 0, t), l === 0 && Rh(t);
		}
	};
	var Mh = s.version;
	if (Mh !== "19.1.1") throw Error(o(527, Mh, "19.1.1"));
	Y.findDOMNode = (t) => {
		var e = t._reactInternals;
		if (e === void 0)
			throw typeof t.render == "function"
				? Error(o(188))
				: ((t = Object.keys(t).join(",")), Error(o(268, t)));
		return (
			(t = m(e)),
			(t = t !== null ? v(t) : null),
			(t = t === null ? null : t.stateNode),
			t
		);
	};
	var j0 = {
		bundleType: 0,
		version: "19.1.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: C,
		reconcilerVersion: "19.1.1",
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Ti = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Ti.isDisabled && Ti.supportsFiber)
			try {
				(ln = Ti.inject(j0)), (ie = Ti);
			} catch {}
	}
	return (
		(nu.createRoot = (t, e) => {
			if (!f(t)) throw Error(o(299));
			var l = !1,
				a = "",
				n = Gf,
				u = Vf,
				r = Xf,
				h = null;
			return (
				e != null &&
					(e.unstable_strictMode === !0 && (l = !0),
					e.identifierPrefix !== void 0 && (a = e.identifierPrefix),
					e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
					e.onCaughtError !== void 0 && (u = e.onCaughtError),
					e.onRecoverableError !== void 0 && (r = e.onRecoverableError),
					e.unstable_transitionCallbacks !== void 0 &&
						(h = e.unstable_transitionCallbacks)),
				(e = mh(t, 1, !1, null, null, l, a, n, u, r, h, null)),
				(t[ia] = e.current),
				Bo(t),
				new Io(e)
			);
		}),
		(nu.hydrateRoot = (t, e, l) => {
			if (!f(t)) throw Error(o(299));
			var a = !1,
				n = "",
				u = Gf,
				r = Vf,
				h = Xf,
				S = null,
				x = null;
			return (
				l != null &&
					(l.unstable_strictMode === !0 && (a = !0),
					l.identifierPrefix !== void 0 && (n = l.identifierPrefix),
					l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
					l.onCaughtError !== void 0 && (r = l.onCaughtError),
					l.onRecoverableError !== void 0 && (h = l.onRecoverableError),
					l.unstable_transitionCallbacks !== void 0 &&
						(S = l.unstable_transitionCallbacks),
					l.formState !== void 0 && (x = l.formState)),
				(e = mh(t, 1, !0, e, l ?? null, a, n, u, r, h, S, x)),
				(e.context = yh(null)),
				(l = e.current),
				(a = he()),
				(a = Xi(a)),
				(n = fl(a)),
				(n.callback = null),
				dl(l, n, a),
				(l = a),
				(e.current.lanes = l),
				nn(e, l),
				Ye(e),
				(t[ia] = e.current),
				Bo(t),
				new Ei(e)
			);
		}),
		(nu.version = "19.1.1"),
		nu
	);
}
var lv;
function Cg() {
	if (lv) return vs.exports;
	lv = 1;
	function i() {
		if (
			!(
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
			)
		)
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
			} catch (s) {
				console.error(s);
			}
	}
	return i(), (vs.exports = Dg()), vs.exports;
}
var Ug = Cg();
const Lg = nv(Ug),
	Ng = "modulepreload",
	Bg = (i) => "/" + i,
	av = {},
	Hg = (s, c, o) => {
		let f = Promise.resolve();
		if (c && c.length > 0) {
			const m = (v) =>
				Promise.all(
					v.map((b) =>
						Promise.resolve(b).then(
							(g) => ({ status: "fulfilled", value: g }),
							(g) => ({ status: "rejected", reason: g }),
						),
					),
				);
			document.getElementsByTagName("link");
			const y = document.querySelector("meta[property=csp-nonce]"),
				p = y?.nonce || y?.getAttribute("nonce");
			f = m(
				c.map((v) => {
					if (((v = Bg(v)), v in av)) return;
					av[v] = !0;
					const b = v.endsWith(".css"),
						g = b ? '[rel="stylesheet"]' : "";
					if (document.querySelector(`link[href="${v}"]${g}`)) return;
					const _ = document.createElement("link");
					if (
						((_.rel = b ? "stylesheet" : Ng),
						b || (_.as = "script"),
						(_.crossOrigin = ""),
						(_.href = v),
						p && _.setAttribute("nonce", p),
						document.head.appendChild(_),
						b)
					)
						return new Promise((M, A) => {
							_.addEventListener("load", M),
								_.addEventListener("error", () =>
									A(new Error(`Unable to preload CSS for ${v}`)),
								);
						});
				}),
			);
		}
		function d(y) {
			const p = new Event("vite:preloadError", { cancelable: !0 });
			if (((p.payload = y), window.dispatchEvent(p), !p.defaultPrevented))
				throw y;
		}
		return f.then((y) => {
			for (const p of y || []) p.status === "rejected" && d(p.reason);
			return s().catch(d);
		});
	},
	qg = () => null;
function jg() {
	return Q.jsxs("footer", {
		className:
			"bg-gradient-to-r from-gray-700 to-gray-900 text-gray-200 text-center p-4 text-sm border-t border-gray-600",
		children: [
			"Copyright",
			" ",
			Q.jsx("a", {
				href: "https://mrluthercodes.netlify.app/",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "text-blue-300 hover:text-white underline",
				children: "Mr Luther",
			}),
			" ",
			"2025",
		],
	});
}
const Ev = vg({
		component: () =>
			Q.jsxs(Q.Fragment, {
				children: [
					Q.jsx("div", {
						className:
							"min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-5 flex flex-col justify-center items-center",
						children: Q.jsxs("div", {
							className:
								"max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden",
							children: [
								Q.jsx("main", { className: "p-0", children: Q.jsx(Rv, {}) }),
								Q.jsx(jg, {}),
							],
						}),
					}),
					Q.jsx(qg, {}),
				],
			}),
	}),
	Yg = () => Hg(() => import("./index-CZsu76kG.js"), []),
	wg = Ts("/")({ component: mg(Yg, "component") }),
	Gg = wg.update({ id: "/", path: "/", getParentRoute: () => Ev }),
	Vg = { IndexRoute: Gg },
	Xg = Ev._addFileChildren(Vg)._addFileTypes(),
	Qg = Tg({ routeTree: Xg }),
	Ms = document.getElementById("root");
if (!Ms) throw new Error("Root element not found");
Ms.innerHTML ||
	Lg.createRoot(Ms).render(
		Q.jsx(ut.StrictMode, { children: Q.jsx(Og, { router: Qg }) }),
	);
export { Q as j };
