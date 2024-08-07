var hy = Object.defineProperty,
  py = Object.defineProperties;
var gy = Object.getOwnPropertyDescriptors;
var kd = Object.getOwnPropertySymbols;
var my = Object.prototype.hasOwnProperty,
  vy = Object.prototype.propertyIsEnumerable;
var Ld = (t, e, r) =>
    e in t
      ? hy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  m = (t, e) => {
    for (var r in (e ||= {})) my.call(e, r) && Ld(t, r, e[r]);
    if (kd) for (var r of kd(e)) vy.call(e, r) && Ld(t, r, e[r]);
    return t;
  },
  U = (t, e) => py(t, gy(e));
var io = (t, e, r) =>
  new Promise((n, i) => {
    var o = (c) => {
        try {
          a(r.next(c));
        } catch (u) {
          i(u);
        }
      },
      s = (c) => {
        try {
          a(r.throw(c));
        } catch (u) {
          i(u);
        }
      },
      a = (c) => (c.done ? n(c.value) : Promise.resolve(c.value).then(o, s));
    a((r = r.apply(t, e)).next());
  });
function yy(t, e) {
  return Object.is(t, e);
}
var de = null,
  oo = !1,
  so = 1,
  Ua = Symbol("SIGNAL");
function V(t) {
  let e = de;
  return (de = t), e;
}
var $a = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Vd(t) {
  if (oo) throw new Error("");
  if (de === null) return;
  de.consumerOnSignalRead(t);
  let e = de.nextProducerIndex++;
  if (
    (co(de), e < de.producerNode.length && de.producerNode[e] !== t && Qr(de))
  ) {
    let r = de.producerNode[e];
    ao(r, de.producerIndexOfThis[e]);
  }
  de.producerNode[e] !== t &&
    ((de.producerNode[e] = t),
    (de.producerIndexOfThis[e] = Qr(de) ? Hd(t, de, e) : 0)),
    (de.producerLastReadVersion[e] = t.version);
}
function Dy() {
  so++;
}
function Cy(t) {
  if (!(Qr(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === so)) {
    if (!t.producerMustRecompute(t) && !Ha(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = so);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = so);
  }
}
function jd(t) {
  if (t.liveConsumerNode === void 0) return;
  let e = oo;
  oo = !0;
  try {
    for (let r of t.liveConsumerNode) r.dirty || Ey(r);
  } finally {
    oo = e;
  }
}
function wy() {
  return de?.consumerAllowSignalWrites !== !1;
}
function Ey(t) {
  (t.dirty = !0), jd(t), t.consumerMarkedDirty?.(t);
}
function Bd(t) {
  return t && (t.nextProducerIndex = 0), V(t);
}
function Ud(t, e) {
  if (
    (V(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Qr(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        ao(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Ha(t) {
  co(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (Cy(r), n !== r.version)) return !0;
  }
  return !1;
}
function $d(t) {
  if ((co(t), Qr(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      ao(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Hd(t, e, r) {
  if ((zd(t), t.liveConsumerNode.length === 0 && Gd(t)))
    for (let n = 0; n < t.producerNode.length; n++)
      t.producerIndexOfThis[n] = Hd(t.producerNode[n], t, n);
  return t.liveConsumerIndexOfThis.push(r), t.liveConsumerNode.push(e) - 1;
}
function ao(t, e) {
  if ((zd(t), t.liveConsumerNode.length === 1 && Gd(t)))
    for (let n = 0; n < t.producerNode.length; n++)
      ao(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    co(i), (i.producerIndexOfThis[n] = e);
  }
}
function Qr(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function co(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function zd(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function Gd(t) {
  return t.producerNode !== void 0;
}
function _y() {
  throw new Error();
}
var Wd = _y;
function by() {
  Wd();
}
function qd(t) {
  Wd = t;
}
var Iy = null;
function Zd(t, e) {
  wy() || by(), t.equal(t.value, e) || ((t.value = e), My(t));
}
var Yd = U(m({}, $a), { equal: yy, value: void 0 });
function My(t) {
  t.version++, Dy(), jd(t), Iy?.();
}
function b(t) {
  return typeof t == "function";
}
function Gn(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var uo = Gn(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    },
);
function an(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var ee = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (b(n))
        try {
          n();
        } catch (o) {
          e = o instanceof uo ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Qd(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof uo ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new uo(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) Qd(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && an(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && an(r, e), e instanceof t && e._removeParent(this);
  }
};
ee.EMPTY = (() => {
  let t = new ee();
  return (t.closed = !0), t;
})();
var za = ee.EMPTY;
function lo(t) {
  return (
    t instanceof ee ||
    (t && "closed" in t && b(t.remove) && b(t.add) && b(t.unsubscribe))
  );
}
function Qd(t) {
  b(t) ? t() : t.unsubscribe();
}
var nt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Wn = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = Wn;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = Wn;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function fo(t) {
  Wn.setTimeout(() => {
    let { onUnhandledError: e } = nt;
    if (e) e(t);
    else throw t;
  });
}
function Kr() {}
var Kd = Ga("C", void 0, void 0);
function Jd(t) {
  return Ga("E", void 0, t);
}
function Xd(t) {
  return Ga("N", t, void 0);
}
function Ga(t, e, r) {
  return { kind: t, value: e, error: r };
}
var cn = null;
function qn(t) {
  if (nt.useDeprecatedSynchronousErrorHandling) {
    let e = !cn;
    if ((e && (cn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = cn;
      if (((cn = null), r)) throw n;
    }
  } else t();
}
function ef(t) {
  nt.useDeprecatedSynchronousErrorHandling &&
    cn &&
    ((cn.errorThrown = !0), (cn.error = t));
}
var un = class extends ee {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), lo(e) && e.add(this))
          : (this.destination = Ty);
    }
    static create(e, r, n) {
      return new Et(e, r, n);
    }
    next(e) {
      this.isStopped ? qa(Xd(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? qa(Jd(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? qa(Kd, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Sy = Function.prototype.bind;
function Wa(t, e) {
  return Sy.call(t, e);
}
var Za = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          ho(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          ho(n);
        }
      else ho(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          ho(r);
        }
    }
  },
  Et = class extends un {
    constructor(e, r, n) {
      super();
      let i;
      if (b(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && nt.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Wa(e.next, o),
              error: e.error && Wa(e.error, o),
              complete: e.complete && Wa(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Za(i);
    }
  };
function ho(t) {
  nt.useDeprecatedSynchronousErrorHandling ? ef(t) : fo(t);
}
function xy(t) {
  throw t;
}
function qa(t, e) {
  let { onStoppedNotification: r } = nt;
  r && Wn.setTimeout(() => r(t, e));
}
var Ty = { closed: !0, next: Kr, error: xy, complete: Kr };
var Zn = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function De(t) {
  return t;
}
function Ya(...t) {
  return Qa(t);
}
function Qa(t) {
  return t.length === 0
    ? De
    : t.length === 1
      ? t[0]
      : function (r) {
          return t.reduce((n, i) => i(n), r);
        };
}
var N = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = Ny(r) ? r : new Et(r, n, i);
      return (
        qn(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o),
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = tf(n)),
        new n((i, o) => {
          let s = new Et({
            next: (a) => {
              try {
                r(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [Zn]() {
      return this;
    }
    pipe(...r) {
      return Qa(r)(this);
    }
    toPromise(r) {
      return (
        (r = tf(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o),
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function tf(t) {
  var e;
  return (e = t ?? nt.Promise) !== null && e !== void 0 ? e : Promise;
}
function Ay(t) {
  return t && b(t.next) && b(t.error) && b(t.complete);
}
function Ny(t) {
  return (t && t instanceof un) || (Ay(t) && lo(t));
}
function Ka(t) {
  return b(t?.lift);
}
function O(t) {
  return (e) => {
    if (Ka(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function A(t, e, r, n, i) {
  return new Ja(t, e, r, n, i);
}
var Ja = class extends un {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Yn() {
  return O((t, e) => {
    let r = null;
    t._refCount++;
    let n = A(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var Pt = class extends N {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Ka(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new ee();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          A(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown(),
          ),
        ),
      ),
        e.closed && ((this._connection = null), (e = ee.EMPTY));
    }
    return e;
  }
  refCount() {
    return Yn()(this);
  }
};
var Qn = {
  schedule(t) {
    let e = requestAnimationFrame,
      r = cancelAnimationFrame,
      { delegate: n } = Qn;
    n && ((e = n.requestAnimationFrame), (r = n.cancelAnimationFrame));
    let i = e((o) => {
      (r = void 0), t(o);
    });
    return new ee(() => r?.(i));
  },
  requestAnimationFrame(...t) {
    let { delegate: e } = Qn;
    return (e?.requestAnimationFrame || requestAnimationFrame)(...t);
  },
  cancelAnimationFrame(...t) {
    let { delegate: e } = Qn;
    return (e?.cancelAnimationFrame || cancelAnimationFrame)(...t);
  },
  delegate: void 0,
};
var nf = Gn(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    },
);
var j = (() => {
    class t extends N {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new po(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new nf();
      }
      next(r) {
        qn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        qn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        qn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? za
          : ((this.currentObservers = null),
            o.push(r),
            new ee(() => {
              (this.currentObservers = null), an(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new N();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new po(e, r)), t;
  })(),
  po = class extends j {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : za;
    }
  };
var he = class extends j {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Jr = {
  now() {
    return (Jr.delegate || Date).now();
  },
  delegate: void 0,
};
var go = class extends j {
  constructor(e = 1 / 0, r = 1 / 0, n = Jr) {
    super(),
      (this._bufferSize = e),
      (this._windowTime = r),
      (this._timestampProvider = n),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = r === 1 / 0),
      (this._bufferSize = Math.max(1, e)),
      (this._windowTime = Math.max(1, r));
  }
  next(e) {
    let {
      isStopped: r,
      _buffer: n,
      _infiniteTimeWindow: i,
      _timestampProvider: o,
      _windowTime: s,
    } = this;
    r || (n.push(e), !i && n.push(o.now() + s)),
      this._trimBuffer(),
      super.next(e);
  }
  _subscribe(e) {
    this._throwIfClosed(), this._trimBuffer();
    let r = this._innerSubscribe(e),
      { _infiniteTimeWindow: n, _buffer: i } = this,
      o = i.slice();
    for (let s = 0; s < o.length && !e.closed; s += n ? 1 : 2) e.next(o[s]);
    return this._checkFinalizedStatuses(e), r;
  }
  _trimBuffer() {
    let {
        _bufferSize: e,
        _timestampProvider: r,
        _buffer: n,
        _infiniteTimeWindow: i,
      } = this,
      o = (i ? 1 : 2) * e;
    if ((e < 1 / 0 && o < n.length && n.splice(0, n.length - o), !i)) {
      let s = r.now(),
        a = 0;
      for (let c = 1; c < n.length && n[c] <= s; c += 2) a = c;
      a && n.splice(0, a + 1);
    }
  }
};
var mo = class extends ee {
  constructor(e, r) {
    super();
  }
  schedule(e, r = 0) {
    return this;
  }
};
var Xr = {
  setInterval(t, e, ...r) {
    let { delegate: n } = Xr;
    return n?.setInterval ? n.setInterval(t, e, ...r) : setInterval(t, e, ...r);
  },
  clearInterval(t) {
    let { delegate: e } = Xr;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Ft = class extends mo {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r), (this.pending = !1);
  }
  schedule(e, r = 0) {
    var n;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, r)),
      (this.pending = !0),
      (this.delay = r),
      (this.id =
        (n = this.id) !== null && n !== void 0
          ? n
          : this.requestAsyncId(o, this.id, r)),
      this
    );
  }
  requestAsyncId(e, r, n = 0) {
    return Xr.setInterval(e.flush.bind(e, this), n);
  }
  recycleAsyncId(e, r, n = 0) {
    if (n != null && this.delay === n && this.pending === !1) return r;
    r != null && Xr.clearInterval(r);
  }
  execute(e, r) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let n = this._execute(e, r);
    if (n) return n;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, r) {
    let n = !1,
      i;
    try {
      this.work(e);
    } catch (o) {
      (n = !0), (i = o || new Error("Scheduled action threw falsy error"));
    }
    if (n) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: r } = this,
        { actions: n } = r;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        an(n, this),
        e != null && (this.id = this.recycleAsyncId(r, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var Oy = 1,
  Xa,
  ec = {};
function rf(t) {
  return t in ec ? (delete ec[t], !0) : !1;
}
var of = {
  setImmediate(t) {
    let e = Oy++;
    return (
      (ec[e] = !0),
      Xa || (Xa = Promise.resolve()),
      Xa.then(() => rf(e) && t()),
      e
    );
  },
  clearImmediate(t) {
    rf(t);
  },
};
var { setImmediate: Ry, clearImmediate: Py } = of,
  ei = {
    setImmediate(...t) {
      let { delegate: e } = ei;
      return (e?.setImmediate || Ry)(...t);
    },
    clearImmediate(t) {
      let { delegate: e } = ei;
      return (e?.clearImmediate || Py)(t);
    },
    delegate: void 0,
  };
var vo = class extends Ft {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r);
  }
  requestAsyncId(e, r, n = 0) {
    return n !== null && n > 0
      ? super.requestAsyncId(e, r, n)
      : (e.actions.push(this),
        e._scheduled ||
          (e._scheduled = ei.setImmediate(e.flush.bind(e, void 0))));
  }
  recycleAsyncId(e, r, n = 0) {
    var i;
    if (n != null ? n > 0 : this.delay > 0)
      return super.recycleAsyncId(e, r, n);
    let { actions: o } = e;
    r != null &&
      ((i = o[o.length - 1]) === null || i === void 0 ? void 0 : i.id) !== r &&
      (ei.clearImmediate(r), e._scheduled === r && (e._scheduled = void 0));
  }
};
var Kn = class t {
  constructor(e, r = t.now) {
    (this.schedulerActionCtor = e), (this.now = r);
  }
  schedule(e, r = 0, n) {
    return new this.schedulerActionCtor(this, e).schedule(n, r);
  }
};
Kn.now = Jr.now;
var kt = class extends Kn {
  constructor(e, r = Kn.now) {
    super(e, r), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: r } = this;
    if (this._active) {
      r.push(e);
      return;
    }
    let n;
    this._active = !0;
    do if ((n = e.execute(e.state, e.delay))) break;
    while ((e = r.shift()));
    if (((this._active = !1), n)) {
      for (; (e = r.shift()); ) e.unsubscribe();
      throw n;
    }
  }
};
var yo = class extends kt {
  flush(e) {
    this._active = !0;
    let r = this._scheduled;
    this._scheduled = void 0;
    let { actions: n } = this,
      i;
    e = e || n.shift();
    do if ((i = e.execute(e.state, e.delay))) break;
    while ((e = n[0]) && e.id === r && n.shift());
    if (((this._active = !1), i)) {
      for (; (e = n[0]) && e.id === r && n.shift(); ) e.unsubscribe();
      throw i;
    }
  }
};
var tc = new yo(vo);
var nc = new kt(Ft),
  sf = nc;
var Do = class extends Ft {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r);
  }
  requestAsyncId(e, r, n = 0) {
    return n !== null && n > 0
      ? super.requestAsyncId(e, r, n)
      : (e.actions.push(this),
        e._scheduled ||
          (e._scheduled = Qn.requestAnimationFrame(() => e.flush(void 0))));
  }
  recycleAsyncId(e, r, n = 0) {
    var i;
    if (n != null ? n > 0 : this.delay > 0)
      return super.recycleAsyncId(e, r, n);
    let { actions: o } = e;
    r != null &&
      ((i = o[o.length - 1]) === null || i === void 0 ? void 0 : i.id) !== r &&
      (Qn.cancelAnimationFrame(r), (e._scheduled = void 0));
  }
};
var Co = class extends kt {
  flush(e) {
    this._active = !0;
    let r = this._scheduled;
    this._scheduled = void 0;
    let { actions: n } = this,
      i;
    e = e || n.shift();
    do if ((i = e.execute(e.state, e.delay))) break;
    while ((e = n[0]) && e.id === r && n.shift());
    if (((this._active = !1), i)) {
      for (; (e = n[0]) && e.id === r && n.shift(); ) e.unsubscribe();
      throw i;
    }
  }
};
var rc = new Co(Do);
var Le = new N((t) => t.complete());
function wo(t) {
  return t && b(t.schedule);
}
function af(t) {
  return t[t.length - 1];
}
function Eo(t) {
  return b(af(t)) ? t.pop() : void 0;
}
function Lt(t) {
  return wo(af(t)) ? t.pop() : void 0;
}
function uf(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(l) {
      try {
        u(n.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(n.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? o(l.value) : i(l.value).then(a, c);
    }
    u((n = n.apply(t, e || [])).next());
  });
}
function cf(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function ln(t) {
  return this instanceof ln ? ((this.v = t), this) : new ln(t);
}
function lf(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    a("next"),
    a("throw"),
    a("return", s),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(h) {
    return function (p) {
      return Promise.resolve(p).then(h, d);
    };
  }
  function a(h, p) {
    n[h] &&
      ((i[h] = function (y) {
        return new Promise(function (v, D) {
          o.push([h, y, v, D]) > 1 || c(h, y);
        });
      }),
      p && (i[h] = p(i[h])));
  }
  function c(h, p) {
    try {
      u(n[h](p));
    } catch (y) {
      f(o[0][3], y);
    }
  }
  function u(h) {
    h.value instanceof ln
      ? Promise.resolve(h.value.v).then(l, d)
      : f(o[0][2], h);
  }
  function l(h) {
    c("next", h);
  }
  function d(h) {
    c("throw", h);
  }
  function f(h, p) {
    h(p), o.shift(), o.length && c(o[0][0], o[0][1]);
  }
}
function df(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof cf == "function" ? cf(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[o](s)), i(a, c, s.done, s.value);
        });
      };
  }
  function i(o, s, a, c) {
    Promise.resolve(c).then(function (u) {
      o({ value: u, done: a });
    }, s);
  }
}
var Jn = (t) => t && typeof t.length == "number" && typeof t != "function";
function _o(t) {
  return b(t?.then);
}
function bo(t) {
  return b(t[Zn]);
}
function Io(t) {
  return Symbol.asyncIterator && b(t?.[Symbol.asyncIterator]);
}
function Mo(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Fy() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var So = Fy();
function xo(t) {
  return b(t?.[So]);
}
function To(t) {
  return lf(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield ln(r.read());
        if (i) return yield ln(void 0);
        yield yield ln(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function Ao(t) {
  return b(t?.getReader);
}
function Q(t) {
  if (t instanceof N) return t;
  if (t != null) {
    if (bo(t)) return ky(t);
    if (Jn(t)) return Ly(t);
    if (_o(t)) return Vy(t);
    if (Io(t)) return ff(t);
    if (xo(t)) return jy(t);
    if (Ao(t)) return By(t);
  }
  throw Mo(t);
}
function ky(t) {
  return new N((e) => {
    let r = t[Zn]();
    if (b(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function Ly(t) {
  return new N((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function Vy(t) {
  return new N((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r),
    ).then(null, fo);
  });
}
function jy(t) {
  return new N((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function ff(t) {
  return new N((e) => {
    Uy(t, e).catch((r) => e.error(r));
  });
}
function By(t) {
  return ff(To(t));
}
function Uy(t, e) {
  var r, n, i, o;
  return uf(this, void 0, void 0, function* () {
    try {
      for (r = df(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function xe(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function No(t, e = 0) {
  return O((r, n) => {
    r.subscribe(
      A(
        n,
        (i) => xe(n, t, () => n.next(i), e),
        () => xe(n, t, () => n.complete(), e),
        (i) => xe(n, t, () => n.error(i), e),
      ),
    );
  });
}
function Oo(t, e = 0) {
  return O((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function hf(t, e) {
  return Q(t).pipe(Oo(e), No(e));
}
function pf(t, e) {
  return Q(t).pipe(Oo(e), No(e));
}
function gf(t, e) {
  return new N((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function mf(t, e) {
  return new N((r) => {
    let n;
    return (
      xe(r, e, () => {
        (n = t[So]()),
          xe(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0,
          );
      }),
      () => b(n?.return) && n.return()
    );
  });
}
function Ro(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new N((r) => {
    xe(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      xe(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function vf(t, e) {
  return Ro(To(t), e);
}
function yf(t, e) {
  if (t != null) {
    if (bo(t)) return hf(t, e);
    if (Jn(t)) return gf(t, e);
    if (_o(t)) return pf(t, e);
    if (Io(t)) return Ro(t, e);
    if (xo(t)) return mf(t, e);
    if (Ao(t)) return vf(t, e);
  }
  throw Mo(t);
}
function ne(t, e) {
  return e ? yf(t, e) : Q(t);
}
function I(...t) {
  let e = Lt(t);
  return ne(t, e);
}
function Xn(t, e) {
  let r = b(t) ? t : () => t,
    n = (i) => i.error(r());
  return new N(e ? (i) => e.schedule(n, 0, i) : n);
}
function dn(t) {
  return !!t && (t instanceof N || (b(t.lift) && b(t.subscribe)));
}
var _t = Gn(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    },
);
function Df(t) {
  return t instanceof Date && !isNaN(t);
}
function x(t, e) {
  return O((r, n) => {
    let i = 0;
    r.subscribe(
      A(n, (o) => {
        n.next(t.call(e, o, i++));
      }),
    );
  });
}
var { isArray: $y } = Array;
function Hy(t, e) {
  return $y(e) ? t(...e) : t(e);
}
function er(t) {
  return x((e) => Hy(t, e));
}
var { isArray: zy } = Array,
  { getPrototypeOf: Gy, prototype: Wy, keys: qy } = Object;
function Po(t) {
  if (t.length === 1) {
    let e = t[0];
    if (zy(e)) return { args: e, keys: null };
    if (Zy(e)) {
      let r = qy(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Zy(t) {
  return t && typeof t == "object" && Gy(t) === Wy;
}
function Fo(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function ko(...t) {
  let e = Lt(t),
    r = Eo(t),
    { args: n, keys: i } = Po(t);
  if (n.length === 0) return ne([], e);
  let o = new N(Yy(n, e, i ? (s) => Fo(i, s) : De));
  return r ? o.pipe(er(r)) : o;
}
function Yy(t, e, r = De) {
  return (n) => {
    Cf(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          Cf(
            e,
            () => {
              let u = ne(t[c], e),
                l = !1;
              u.subscribe(
                A(
                  n,
                  (d) => {
                    (o[c] = d), l || ((l = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  },
                ),
              );
            },
            n,
          );
      },
      n,
    );
  };
}
function Cf(t, e, r) {
  t ? xe(r, t, e) : e();
}
function wf(t, e, r, n, i, o, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !c.length && !u && e.complete();
    },
    h = (y) => (u < n ? p(y) : c.push(y)),
    p = (y) => {
      o && e.next(y), u++;
      let v = !1;
      Q(r(y, l++)).subscribe(
        A(
          e,
          (D) => {
            i?.(D), o ? h(D) : e.next(D);
          },
          () => {
            v = !0;
          },
          void 0,
          () => {
            if (v)
              try {
                for (u--; c.length && u < n; ) {
                  let D = c.shift();
                  s ? xe(e, s, () => p(D)) : p(D);
                }
                f();
              } catch (D) {
                e.error(D);
              }
          },
        ),
      );
    };
  return (
    t.subscribe(
      A(e, h, () => {
        (d = !0), f();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function ie(t, e, r = 1 / 0) {
  return b(e)
    ? ie((n, i) => x((o, s) => e(n, o, i, s))(Q(t(n, i))), r)
    : (typeof e == "number" && (r = e), O((n, i) => wf(n, i, t, r)));
}
function ic(t = 1 / 0) {
  return ie(De, t);
}
function Ef() {
  return ic(1);
}
function tr(...t) {
  return Ef()(ne(t, Lt(t)));
}
function Lo(t) {
  return new N((e) => {
    Q(t()).subscribe(e);
  });
}
function oc(...t) {
  let e = Eo(t),
    { args: r, keys: n } = Po(t),
    i = new N((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        u = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        Q(r[l]).subscribe(
          A(
            o,
            (f) => {
              d || ((d = !0), u--), (a[l] = f);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (u || o.next(n ? Fo(n, a) : a), o.complete());
            },
          ),
        );
      }
    });
  return e ? i.pipe(er(e)) : i;
}
var Qy = ["addListener", "removeListener"],
  Ky = ["addEventListener", "removeEventListener"],
  Jy = ["on", "off"];
function nr(t, e, r, n) {
  if ((b(r) && ((n = r), (r = void 0)), n)) return nr(t, e, r).pipe(er(n));
  let [i, o] = tD(t)
    ? Ky.map((s) => (a) => t[s](e, a, r))
    : Xy(t)
      ? Qy.map(_f(t, e))
      : eD(t)
        ? Jy.map(_f(t, e))
        : [];
  if (!i && Jn(t)) return ie((s) => nr(s, e, r))(Q(t));
  if (!i) throw new TypeError("Invalid event target");
  return new N((s) => {
    let a = (...c) => s.next(1 < c.length ? c : c[0]);
    return i(a), () => o(a);
  });
}
function _f(t, e) {
  return (r) => (n) => t[r](e, n);
}
function Xy(t) {
  return b(t.addListener) && b(t.removeListener);
}
function eD(t) {
  return b(t.on) && b(t.off);
}
function tD(t) {
  return b(t.addEventListener) && b(t.removeEventListener);
}
function bf(t = 0, e, r = sf) {
  let n = -1;
  return (
    e != null && (wo(e) ? (r = e) : (n = e)),
    new N((i) => {
      let o = Df(t) ? +t - r.now() : t;
      o < 0 && (o = 0);
      let s = 0;
      return r.schedule(function () {
        i.closed ||
          (i.next(s++), 0 <= n ? this.schedule(void 0, n) : i.complete());
      }, o);
    })
  );
}
function Ce(t, e) {
  return O((r, n) => {
    let i = 0;
    r.subscribe(A(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function If(t) {
  return O((e, r) => {
    let n = !1,
      i = null,
      o = null,
      s = !1,
      a = () => {
        if ((o?.unsubscribe(), (o = null), n)) {
          n = !1;
          let u = i;
          (i = null), r.next(u);
        }
        s && r.complete();
      },
      c = () => {
        (o = null), s && r.complete();
      };
    e.subscribe(
      A(
        r,
        (u) => {
          (n = !0), (i = u), o || Q(t(u)).subscribe((o = A(r, a, c)));
        },
        () => {
          (s = !0), (!n || !o || o.closed) && r.complete();
        },
      ),
    );
  });
}
function ti(t, e = nc) {
  return If(() => bf(t, e));
}
function Vt(t) {
  return O((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      A(r, void 0, void 0, (s) => {
        (o = Q(t(s, Vt(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      }),
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function Mf(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      c = e,
      u = 0;
    o.subscribe(
      A(
        s,
        (l) => {
          let d = u++;
          (c = a ? t(c, l, d) : ((a = !0), l)), n && s.next(c);
        },
        i &&
          (() => {
            a && s.next(c), s.complete();
          }),
      ),
    );
  };
}
function jt(t, e) {
  return b(e) ? ie(t, e, 1) : ie(t, 1);
}
function Bt(t) {
  return O((e, r) => {
    let n = !1;
    e.subscribe(
      A(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        },
      ),
    );
  });
}
function qe(t) {
  return t <= 0
    ? () => Le
    : O((e, r) => {
        let n = 0;
        e.subscribe(
          A(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          }),
        );
      });
}
function sc(t) {
  return x(() => t);
}
function ac(t, e = De) {
  return (
    (t = t ?? nD),
    O((r, n) => {
      let i,
        o = !0;
      r.subscribe(
        A(n, (s) => {
          let a = e(s);
          (o || !t(i, a)) && ((o = !1), (i = a), n.next(s));
        }),
      );
    })
  );
}
function nD(t, e) {
  return t === e;
}
function Vo(t = rD) {
  return O((e, r) => {
    let n = !1;
    e.subscribe(
      A(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t())),
      ),
    );
  });
}
function rD() {
  return new _t();
}
function fn(t) {
  return O((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function ht(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? Ce((i, o) => t(i, o, n)) : De,
      qe(1),
      r ? Bt(e) : Vo(() => new _t()),
    );
}
function rr(t) {
  return t <= 0
    ? () => Le
    : O((e, r) => {
        let n = [];
        e.subscribe(
          A(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            },
          ),
        );
      });
}
function cc(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? Ce((i, o) => t(i, o, n)) : De,
      rr(1),
      r ? Bt(e) : Vo(() => new _t()),
    );
}
function uc() {
  return O((t, e) => {
    let r,
      n = !1;
    t.subscribe(
      A(e, (i) => {
        let o = r;
        (r = i), n && e.next([o, i]), (n = !0);
      }),
    );
  });
}
function lc(t, e) {
  return O(Mf(t, e, arguments.length >= 2, !0));
}
function Sf(t = {}) {
  let {
    connector: e = () => new j(),
    resetOnError: r = !0,
    resetOnComplete: n = !0,
    resetOnRefCountZero: i = !0,
  } = t;
  return (o) => {
    let s,
      a,
      c,
      u = 0,
      l = !1,
      d = !1,
      f = () => {
        a?.unsubscribe(), (a = void 0);
      },
      h = () => {
        f(), (s = c = void 0), (l = d = !1);
      },
      p = () => {
        let y = s;
        h(), y?.unsubscribe();
      };
    return O((y, v) => {
      u++, !d && !l && f();
      let D = (c = c ?? e());
      v.add(() => {
        u--, u === 0 && !d && !l && (a = dc(p, i));
      }),
        D.subscribe(v),
        !s &&
          u > 0 &&
          ((s = new Et({
            next: ($) => D.next($),
            error: ($) => {
              (d = !0), f(), (a = dc(h, r, $)), D.error($);
            },
            complete: () => {
              (l = !0), f(), (a = dc(h, n)), D.complete();
            },
          })),
          Q(y).subscribe(s));
    })(o);
  };
}
function dc(t, e, ...r) {
  if (e === !0) {
    t();
    return;
  }
  if (e === !1) return;
  let n = new Et({
    next: () => {
      n.unsubscribe(), t();
    },
  });
  return Q(e(...r)).subscribe(n);
}
function fc(t, e, r) {
  let n,
    i = !1;
  return (
    t && typeof t == "object"
      ? ({
          bufferSize: n = 1 / 0,
          windowTime: e = 1 / 0,
          refCount: i = !1,
          scheduler: r,
        } = t)
      : (n = t ?? 1 / 0),
    Sf({
      connector: () => new go(n, e, r),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: i,
    })
  );
}
function ir(...t) {
  let e = Lt(t);
  return O((r, n) => {
    (e ? tr(t, r, e) : tr(t, r)).subscribe(n);
  });
}
function we(t, e) {
  return O((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      A(
        n,
        (c) => {
          i?.unsubscribe();
          let u = 0,
            l = o++;
          Q(t(c, l)).subscribe(
            (i = A(
              n,
              (d) => n.next(e ? e(c, d, l, u++) : d),
              () => {
                (i = null), a();
              },
            )),
          );
        },
        () => {
          (s = !0), a();
        },
      ),
    );
  });
}
function rt(t) {
  return O((e, r) => {
    Q(t).subscribe(A(r, () => r.complete(), Kr)), !r.closed && e.subscribe(r);
  });
}
function fe(t, e, r) {
  let n = b(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? O((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          A(
            o,
            (c) => {
              var u;
              (u = n.next) === null || u === void 0 || u.call(n, c), o.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = n.complete) === null || c === void 0 || c.call(n),
                o.complete();
            },
            (c) => {
              var u;
              (a = !1),
                (u = n.error) === null || u === void 0 || u.call(n, c),
                o.error(c);
            },
            () => {
              var c, u;
              a && ((c = n.unsubscribe) === null || c === void 0 || c.call(n)),
                (u = n.finalize) === null || u === void 0 || u.call(n);
            },
          ),
        );
      })
    : De;
}
var ph = "https://g.co/ng/security#xss",
  w = class extends Error {
    constructor(e, r) {
      super(vs(e, r)), (this.code = e);
    }
  };
function vs(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var gh = Symbol("InputSignalNode#UNSET"),
  iD = U(m({}, Yd), {
    transformFn: void 0,
    applyValueToInputSignal(t, e) {
      Zd(t, e);
    },
  });
function mh(t, e) {
  let r = Object.create(iD);
  (r.value = t), (r.transformFn = e?.transform);
  function n() {
    if ((Vd(r), r.value === gh)) throw new w(-950, !1);
    return r.value;
  }
  return (n[Ua] = r), n;
}
function pi(t) {
  return { toString: t }.toString();
}
var jo = "__parameters__";
function oD(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function Nu(t, e, r) {
  return pi(() => {
    let n = oD(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(c, u, l) {
        let d = c.hasOwnProperty(jo)
          ? c[jo]
          : Object.defineProperty(c, jo, { value: [] })[jo];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), c;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var gn = globalThis;
function K(t) {
  for (let e in t) if (t[e] === K) return e;
  throw Error("Could not find renamed property on target object.");
}
function sD(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function Ae(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(Ae).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function xf(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
      ? t
      : t + " " + e;
}
var aD = K({ __forward_ref__: K });
function qt(t) {
  return (
    (t.__forward_ref__ = qt),
    (t.toString = function () {
      return Ae(this());
    }),
    t
  );
}
function Ee(t) {
  return vh(t) ? t() : t;
}
function vh(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(aD) && t.__forward_ref__ === qt
  );
}
function E(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function be(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function ys(t) {
  return Tf(t, Dh) || Tf(t, Ch);
}
function yh(t) {
  return ys(t) !== null;
}
function Tf(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function cD(t) {
  let e = t && (t[Dh] || t[Ch]);
  return e || null;
}
function Af(t) {
  return t && (t.hasOwnProperty(Nf) || t.hasOwnProperty(uD)) ? t[Nf] : null;
}
var Dh = K({ ɵprov: K }),
  Nf = K({ ɵinj: K }),
  Ch = K({ ngInjectableDef: K }),
  uD = K({ ngInjectorDef: K }),
  C = class {
    constructor(e, r) {
      (this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = E({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function wh(t) {
  return t && !!t.ɵproviders;
}
var lD = K({ ɵcmp: K }),
  dD = K({ ɵdir: K }),
  fD = K({ ɵpipe: K }),
  hD = K({ ɵmod: K }),
  Zo = K({ ɵfac: K }),
  ni = K({ __NG_ELEMENT_ID__: K }),
  Of = K({ __NG_ENV_ID__: K });
function ri(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function pD(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
      ? t.type.name || t.type.toString()
      : ri(t);
}
function gD(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new w(-200, t);
}
function Ou(t, e) {
  throw new w(-201, !1);
}
var F = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(F || {}),
  Ac;
function Eh() {
  return Ac;
}
function Te(t) {
  let e = Ac;
  return (Ac = t), e;
}
function _h(t, e, r) {
  let n = ys(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & F.Optional) return null;
  if (e !== void 0) return e;
  Ou(t, "Injector");
}
var mD = {},
  ii = mD,
  Nc = "__NG_DI_FLAG__",
  Yo = "ngTempTokenPath",
  vD = "ngTokenPath",
  yD = /\n/gm,
  DD = "\u0275",
  Rf = "__source",
  ur;
function CD() {
  return ur;
}
function Ut(t) {
  let e = ur;
  return (ur = t), e;
}
function wD(t, e = F.Default) {
  if (ur === void 0) throw new w(-203, !1);
  return ur === null
    ? _h(t, void 0, e)
    : ur.get(t, e & F.Optional ? null : void 0, e);
}
function _(t, e = F.Default) {
  return (Eh() || wD)(Ee(t), e);
}
function g(t, e = F.Default) {
  return _(t, Ds(e));
}
function Ds(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Oc(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = Ee(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new w(900, !1);
      let i,
        o = F.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          c = ED(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(_(i, o));
    } else e.push(_(n));
  }
  return e;
}
function Ru(t, e) {
  return (t[Nc] = e), (t.prototype[Nc] = e), t;
}
function ED(t) {
  return t[Nc];
}
function _D(t, e, r, n) {
  let i = t[Yo];
  throw (
    (e[Rf] && i.unshift(e[Rf]),
    (t.message = bD(
      `
` + t.message,
      i,
      r,
      n,
    )),
    (t[vD] = i),
    (t[Yo] = null),
    t)
  );
}
function bD(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == DD
      ? t.slice(2)
      : t;
  let i = Ae(e);
  if (Array.isArray(e)) i = e.map(Ae).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : Ae(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    yD,
    `
  `,
  )}`;
}
var bh = Ru(
    Nu("Inject", (t) => ({ token: t })),
    -1,
  ),
  gi = Ru(Nu("Optional"), 8);
var Ih = Ru(Nu("SkipSelf"), 4);
function vn(t, e) {
  let r = t.hasOwnProperty(Zo);
  return r ? t[Zo] : null;
}
function ID(t, e, r) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; n++) {
    let i = t[n],
      o = e[n];
    if ((r && ((i = r(i)), (o = r(o))), o !== i)) return !1;
  }
  return !0;
}
function MD(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function Pu(t, e) {
  t.forEach((r) => (Array.isArray(r) ? Pu(r, e) : e(r)));
}
function Mh(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function Qo(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function SD(t, e) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(e);
  return r;
}
function xD(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function TD(t, e, r) {
  let n = mi(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), xD(t, n, e, r)), n;
}
function hc(t, e) {
  let r = mi(t, e);
  if (r >= 0) return t[r | 1];
}
function mi(t, e) {
  return AD(t, e, 1);
}
function AD(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var dr = {},
  Ze = [],
  fr = new C(""),
  Sh = new C("", -1),
  xh = new C(""),
  Ko = class {
    get(e, r = ii) {
      if (r === ii) {
        let n = new Error(`NullInjectorError: No provider for ${Ae(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  },
  Th = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Th || {}),
  mt = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(mt || {}),
  hr = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(hr || {});
function ND(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function Rc(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      RD(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function OD(t) {
  return t === 3 || t === 4 || t === 6;
}
function RD(t) {
  return t.charCodeAt(0) === 64;
}
function oi(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? Pf(t, r, i, null, e[++n])
              : Pf(t, r, i, null, null));
      }
    }
  return t;
}
function Pf(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var Ah = "ng-template";
function PD(t, e, r, n) {
  let i = 0;
  if (n) {
    for (; i < e.length && typeof e[i] == "string"; i += 2)
      if (e[i] === "class" && ND(e[i + 1].toLowerCase(), r, 0) !== -1)
        return !0;
  } else if (Fu(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let o;
    for (; ++i < e.length && typeof (o = e[i]) == "string"; )
      if (o.toLowerCase() === r) return !0;
  }
  return !1;
}
function Fu(t) {
  return t.type === 4 && t.value !== Ah;
}
function FD(t, e, r) {
  let n = t.type === 4 && !r ? Ah : t.value;
  return e === n;
}
function kD(t, e, r) {
  let n = 4,
    i = t.attrs,
    o = i !== null ? jD(i) : 0,
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !it(n) && !it(c)) return !1;
      if (s && it(c)) continue;
      (s = !1), (n = c | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (c !== "" && !FD(t, c, r)) || (c === "" && e.length === 1))
        ) {
          if (it(n)) return !1;
          s = !0;
        }
      } else if (n & 8) {
        if (i === null || !PD(t, i, c, r)) {
          if (it(n)) return !1;
          s = !0;
        }
      } else {
        let u = e[++a],
          l = LD(c, i, Fu(t), r);
        if (l === -1) {
          if (it(n)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > o ? (d = "") : (d = i[l + 1].toLowerCase()), n & 2 && u !== d)
          ) {
            if (it(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return it(n) || s;
}
function it(t) {
  return (t & 1) === 0;
}
function LD(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return BD(e, t);
}
function Nh(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (kD(t, e[n], r)) return !0;
  return !1;
}
function VD(t) {
  let e = t.attrs;
  if (e != null) {
    let r = e.indexOf(5);
    if (!(r & 1)) return e[r + 1];
  }
  return null;
}
function jD(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (OD(r)) return e;
  }
  return t.length;
}
function BD(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function UD(t, e) {
  e: for (let r = 0; r < e.length; r++) {
    let n = e[r];
    if (t.length === n.length) {
      for (let i = 0; i < t.length; i++) if (t[i] !== n[i]) continue e;
      return !0;
    }
  }
  return !1;
}
function Ff(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function $D(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !it(s) && ((e += Ff(o, i)), (i = "")),
        (n = s),
        (o = o || !it(n));
    r++;
  }
  return i !== "" && (e += Ff(o, i)), e;
}
function HD(t) {
  return t.map($D).join(",");
}
function zD(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!it(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function Qe(t) {
  return pi(() => {
    let e = Lh(t),
      r = U(m({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Th.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || mt.Emulated,
        styles: t.styles || Ze,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Vh(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = Lf(n, !1)), (r.pipeDefs = Lf(n, !0)), (r.id = qD(r)), r
    );
  });
}
function GD(t) {
  return yn(t) || Rh(t);
}
function WD(t) {
  return t !== null;
}
function Ie(t) {
  return pi(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Ze,
    declarations: t.declarations || Ze,
    imports: t.imports || Ze,
    exports: t.exports || Ze,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function kf(t, e) {
  if (t == null) return dr;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o,
        s,
        a = hr.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((r[o] = a !== hr.None ? [n, a] : n), (e[o] = s)) : (r[o] = n);
    }
  return r;
}
function se(t) {
  return pi(() => {
    let e = Lh(t);
    return Vh(e), e;
  });
}
function Oh(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  };
}
function yn(t) {
  return t[lD] || null;
}
function Rh(t) {
  return t[dD] || null;
}
function Ph(t) {
  return t[fD] || null;
}
function Fh(t) {
  let e = yn(t) || Rh(t) || Ph(t);
  return e !== null ? e.standalone : !1;
}
function kh(t, e) {
  let r = t[hD] || null;
  if (!r && e === !0)
    throw new Error(`Type ${Ae(t)} does not have '\u0275mod' property.`);
  return r;
}
function Lh(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || dr,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Ze,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: kf(t.inputs, e),
    outputs: kf(t.outputs),
    debugInfo: null,
  };
}
function Vh(t) {
  t.features?.forEach((e) => e(t));
}
function Lf(t, e) {
  if (!t) return null;
  let r = e ? Ph : GD;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(WD);
}
function qD(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
function Ir(t) {
  return { ɵproviders: t };
}
function ZD(...t) {
  return { ɵproviders: jh(!0, t), ɵfromNgModule: !0 };
}
function jh(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    Pu(e, (s) => {
      let a = s;
      Pc(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Bh(i, o),
    r
  );
}
function Bh(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    ku(i, (o) => {
      e(o, n);
    });
  }
}
function Pc(t, e, r, n) {
  if (((t = Ee(t)), !t)) return !1;
  let i = null,
    o = Af(t),
    s = !o && yn(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = Af(c)), o)) i = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) Pc(u, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let u;
      try {
        Pu(o.imports, (l) => {
          Pc(l, e, r, n) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && Bh(u, e);
    }
    if (!a) {
      let u = vn(i) || (() => new i());
      e({ provide: i, useFactory: u, deps: Ze }, i),
        e({ provide: xh, useValue: i, multi: !0 }, i),
        e({ provide: fr, useValue: () => _(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let u = t;
      ku(c, (l) => {
        e(l, u);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function ku(t, e) {
  for (let r of t)
    wh(r) && (r = r.ɵproviders), Array.isArray(r) ? ku(r, e) : e(r);
}
var YD = K({ provide: String, useValue: K });
function Uh(t) {
  return t !== null && typeof t == "object" && YD in t;
}
function QD(t) {
  return !!(t && t.useExisting);
}
function KD(t) {
  return !!(t && t.useFactory);
}
function pr(t) {
  return typeof t == "function";
}
function JD(t) {
  return !!t.useClass;
}
var Cs = new C(""),
  $o = {},
  XD = {},
  pc;
function Lu() {
  return pc === void 0 && (pc = new Ko()), pc;
}
var Ne = class {},
  si = class extends Ne {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        kc(e, (s) => this.processProvider(s)),
        this.records.set(Sh, or(void 0, this)),
        i.has("environment") && this.records.set(Ne, or(void 0, this));
      let o = this.records.get(Cs);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(xh, Ze, F.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = V(null);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let r = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of r) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          V(e);
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = Ut(this),
        n = Te(void 0),
        i;
      try {
        return e();
      } finally {
        Ut(r), Te(n);
      }
    }
    get(e, r = ii, n = F.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Of))) return e[Of](this);
      n = Ds(n);
      let i,
        o = Ut(this),
        s = Te(void 0);
      try {
        if (!(n & F.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let u = iC(e) && ys(e);
            u && this.injectableDefInScope(u)
              ? (c = or(Fc(e), $o))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = n & F.Self ? Lu() : this.parent;
        return (r = n & F.Optional && r === ii ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Yo] = a[Yo] || []).unshift(Ae(e)), o)) throw a;
          return _D(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Te(s), Ut(o);
      }
    }
    resolveInjectorInitializers() {
      let e = V(null),
        r = Ut(this),
        n = Te(void 0),
        i;
      try {
        let o = this.get(fr, Ze, F.Self);
        for (let s of o) s();
      } finally {
        Ut(r), Te(n), V(e);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(Ae(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new w(205, !1);
    }
    processProvider(e) {
      e = Ee(e);
      let r = pr(e) ? e : Ee(e && e.provide),
        n = tC(e);
      if (!pr(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = or(void 0, $o, !0)),
          (i.factory = () => Oc(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      let n = V(null);
      try {
        return (
          r.value === $o && ((r.value = XD), (r.value = r.factory())),
          typeof r.value == "object" &&
            r.value &&
            rC(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        );
      } finally {
        V(n);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = Ee(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function Fc(t) {
  let e = ys(t),
    r = e !== null ? e.factory : vn(t);
  if (r !== null) return r;
  if (t instanceof C) throw new w(204, !1);
  if (t instanceof Function) return eC(t);
  throw new w(204, !1);
}
function eC(t) {
  if (t.length > 0) throw new w(204, !1);
  let r = cD(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function tC(t) {
  if (Uh(t)) return or(void 0, t.useValue);
  {
    let e = $h(t);
    return or(e, $o);
  }
}
function $h(t, e, r) {
  let n;
  if (pr(t)) {
    let i = Ee(t);
    return vn(i) || Fc(i);
  } else if (Uh(t)) n = () => Ee(t.useValue);
  else if (KD(t)) n = () => t.useFactory(...Oc(t.deps || []));
  else if (QD(t)) n = () => _(Ee(t.useExisting));
  else {
    let i = Ee(t && (t.useClass || t.provide));
    if (nC(t)) n = () => new i(...Oc(t.deps));
    else return vn(i) || Fc(i);
  }
  return n;
}
function or(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function nC(t) {
  return !!t.deps;
}
function rC(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function iC(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof C);
}
function kc(t, e) {
  for (let r of t)
    Array.isArray(r) ? kc(r, e) : r && wh(r) ? kc(r.ɵproviders, e) : e(r);
}
function Ke(t, e) {
  t instanceof si && t.assertNotDestroyed();
  let r,
    n = Ut(t),
    i = Te(void 0);
  try {
    return e();
  } finally {
    Ut(n), Te(i);
  }
}
function Hh() {
  return Eh() !== void 0 || CD() != null;
}
function oC(t) {
  if (!Hh()) throw new w(-203, !1);
}
function sC(t) {
  return typeof t == "function";
}
var Mt = 0,
  T = 1,
  S = 2,
  ye = 3,
  ot = 4,
  Oe = 5,
  gr = 6,
  Jo = 7,
  me = 8,
  mr = 9,
  vt = 10,
  pe = 11,
  ai = 12,
  Vf = 13,
  Mr = 14,
  Ve = 15,
  Dn = 16,
  sr = 17,
  bt = 18,
  ws = 19,
  zh = 20,
  $t = 21,
  gc = 22,
  Cn = 23,
  _e = 25,
  Gh = 1;
var wn = 7,
  Xo = 8,
  vr = 9,
  ve = 10,
  es = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(es || {});
function Ht(t) {
  return Array.isArray(t) && typeof t[Gh] == "object";
}
function St(t) {
  return Array.isArray(t) && t[Gh] === !0;
}
function Wh(t) {
  return (t.flags & 4) !== 0;
}
function Es(t) {
  return t.componentOffset > -1;
}
function Vu(t) {
  return (t.flags & 1) === 1;
}
function zt(t) {
  return !!t.template;
}
function Lc(t) {
  return (t[S] & 512) !== 0;
}
var Vc = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function qh(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function je() {
  return Zh;
}
function Zh(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = cC), aC;
}
je.ngInherit = !0;
function aC() {
  let t = Qh(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === dr) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function cC(t, e, r, n, i) {
  let o = this.declaredInputs[n],
    s = Qh(t) || uC(t, { previous: dr, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[o];
  (a[o] = new Vc(u && u.currentValue, r, c === dr)), qh(t, e, i, r);
}
var Yh = "__ngSimpleChanges__";
function Qh(t) {
  return t[Yh] || null;
}
function uC(t, e) {
  return (t[Yh] = e);
}
var jf = null;
var pt = function (t, e, r) {
    jf?.(t, e, r);
  },
  lC = "svg",
  dC = "math";
function yt(t) {
  for (; Array.isArray(t); ) t = t[Mt];
  return t;
}
function Kh(t, e) {
  return yt(e[t]);
}
function at(t, e) {
  return yt(e[t.index]);
}
function ju(t, e) {
  return t.data[e];
}
function fC(t, e) {
  return t[e];
}
function Zt(t, e) {
  let r = e[t];
  return Ht(r) ? r : r[Mt];
}
function hC(t) {
  return (t[S] & 4) === 4;
}
function Bu(t) {
  return (t[S] & 128) === 128;
}
function pC(t) {
  return St(t[ye]);
}
function yr(t, e) {
  return e == null ? null : t[e];
}
function Jh(t) {
  t[sr] = 0;
}
function gC(t) {
  t[S] & 1024 || ((t[S] |= 1024), Bu(t) && _s(t));
}
function mC(t, e) {
  for (; t > 0; ) (e = e[Mr]), t--;
  return e;
}
function ci(t) {
  return !!(t[S] & 9216 || t[Cn]?.dirty);
}
function jc(t) {
  t[vt].changeDetectionScheduler?.notify(7),
    t[S] & 64 && (t[S] |= 1024),
    ci(t) && _s(t);
}
function _s(t) {
  t[vt].changeDetectionScheduler?.notify(0);
  let e = ui(t);
  for (; e !== null && !(e[S] & 8192 || ((e[S] |= 8192), !Bu(e))); ) e = ui(e);
}
function Xh(t, e) {
  if ((t[S] & 256) === 256) throw new w(911, !1);
  t[$t] === null && (t[$t] = []), t[$t].push(e);
}
function vC(t, e) {
  if (t[$t] === null) return;
  let r = t[$t].indexOf(e);
  r !== -1 && t[$t].splice(r, 1);
}
function ui(t) {
  let e = t[ye];
  return St(e) ? e[ye] : e;
}
var k = { lFrame: fp(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var ep = !1;
function yC() {
  return k.lFrame.elementDepthCount;
}
function DC() {
  k.lFrame.elementDepthCount++;
}
function CC() {
  k.lFrame.elementDepthCount--;
}
function tp() {
  return k.bindingsEnabled;
}
function np() {
  return k.skipHydrationRootTNode !== null;
}
function wC(t) {
  return k.skipHydrationRootTNode === t;
}
function EC() {
  k.skipHydrationRootTNode = null;
}
function B() {
  return k.lFrame.lView;
}
function Me() {
  return k.lFrame.tView;
}
function Sr(t) {
  return (k.lFrame.contextLView = t), t[me];
}
function xr(t) {
  return (k.lFrame.contextLView = null), t;
}
function Be() {
  let t = rp();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function rp() {
  return k.lFrame.currentTNode;
}
function _C() {
  let t = k.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function vi(t, e) {
  let r = k.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function ip() {
  return k.lFrame.isParent;
}
function op() {
  k.lFrame.isParent = !1;
}
function sp() {
  return ep;
}
function Bf(t) {
  ep = t;
}
function ap() {
  let t = k.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function bC() {
  return k.lFrame.bindingIndex;
}
function IC(t) {
  return (k.lFrame.bindingIndex = t);
}
function bs() {
  return k.lFrame.bindingIndex++;
}
function cp(t) {
  let e = k.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function MC() {
  return k.lFrame.inI18n;
}
function SC(t, e) {
  let r = k.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), Bc(e);
}
function xC() {
  return k.lFrame.currentDirectiveIndex;
}
function Bc(t) {
  k.lFrame.currentDirectiveIndex = t;
}
function TC(t) {
  let e = k.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function up() {
  return k.lFrame.currentQueryIndex;
}
function Uu(t) {
  k.lFrame.currentQueryIndex = t;
}
function AC(t) {
  let e = t[T];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Oe] : null;
}
function lp(t, e, r) {
  if (r & F.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & F.Host); )
      if (((i = AC(o)), i === null || ((o = o[Mr]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (k.lFrame = dp());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function $u(t) {
  let e = dp(),
    r = t[T];
  (k.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function dp() {
  let t = k.lFrame,
    e = t === null ? null : t.child;
  return e === null ? fp(t) : e;
}
function fp(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function hp() {
  let t = k.lFrame;
  return (k.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var pp = hp;
function Hu() {
  let t = hp();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function NC(t) {
  return (k.lFrame.contextLView = mC(t, k.lFrame.contextLView))[me];
}
function Yt() {
  return k.lFrame.selectedIndex;
}
function En(t) {
  k.lFrame.selectedIndex = t;
}
function OC() {
  let t = k.lFrame;
  return ju(t.tView, t.selectedIndex);
}
function RC() {
  return k.lFrame.currentNamespace;
}
var gp = !0;
function zu() {
  return gp;
}
function Gu(t) {
  gp = t;
}
function PC(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = Zh(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function Wu(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      c && (t.viewHooks ??= []).push(-r, c),
      u &&
        ((t.viewHooks ??= []).push(r, u), (t.viewCheckHooks ??= []).push(r, u)),
      l != null && (t.destroyHooks ??= []).push(r, l);
  }
}
function Ho(t, e, r) {
  mp(t, e, 3, r);
}
function zo(t, e, r, n) {
  (t[S] & 3) === r && mp(t, e, r, n);
}
function mc(t, e) {
  let r = t[S];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[S] = r));
}
function mp(t, e, r, n) {
  let i = n !== void 0 ? t[sr] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), n != null && a >= n)) break;
    } else
      e[c] < 0 && (t[sr] += 65536),
        (a < o || o == -1) &&
          (FC(t, r, e, c), (t[sr] = (t[sr] & 4294901760) + c + 2)),
        c++;
}
function Uf(t, e) {
  pt(4, t, e);
  let r = V(null);
  try {
    e.call(t);
  } finally {
    V(r), pt(5, t, e);
  }
}
function FC(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[S] >> 14 < t[sr] >> 16 &&
      (t[S] & 3) === e &&
      ((t[S] += 16384), Uf(a, o))
    : Uf(a, o);
}
var lr = -1,
  _n = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function kC(t) {
  return t instanceof _n;
}
function LC(t) {
  return (t.flags & 8) !== 0;
}
function VC(t) {
  return (t.flags & 16) !== 0;
}
function vp(t) {
  return t !== lr;
}
function ts(t) {
  return t & 32767;
}
function jC(t) {
  return t >> 16;
}
function ns(t, e) {
  let r = jC(t),
    n = e;
  for (; r > 0; ) (n = n[Mr]), r--;
  return n;
}
var Uc = !0;
function rs(t) {
  let e = Uc;
  return (Uc = t), e;
}
var BC = 256,
  yp = BC - 1,
  Dp = 5,
  UC = 0,
  gt = {};
function $C(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(ni) && (n = r[ni]),
    n == null && (n = r[ni] = UC++);
  let i = n & yp,
    o = 1 << i;
  e.data[t + (i >> Dp)] |= o;
}
function is(t, e) {
  let r = Cp(t, e);
  if (r !== -1) return r;
  let n = e[T];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    vc(n.data, t),
    vc(e, null),
    vc(n.blueprint, null));
  let i = qu(t, e),
    o = t.injectorIndex;
  if (vp(i)) {
    let s = ts(i),
      a = ns(i, e),
      c = a[T].data;
    for (let u = 0; u < 8; u++) e[o + u] = a[s + u] | c[s + u];
  }
  return (e[o + 8] = i), o;
}
function vc(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Cp(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function qu(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = Ip(i)), n === null)) return lr;
    if ((r++, (i = i[Mr]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return lr;
}
function $c(t, e, r) {
  $C(t, e, r);
}
function wp(t, e, r) {
  if (r & F.Optional || t !== void 0) return t;
  Ou(e, "NodeInjector");
}
function Ep(t, e, r, n) {
  if (
    (r & F.Optional && n === void 0 && (n = null), !(r & (F.Self | F.Host)))
  ) {
    let i = t[mr],
      o = Te(void 0);
    try {
      return i ? i.get(e, n, r & F.Optional) : _h(e, n, r & F.Optional);
    } finally {
      Te(o);
    }
  }
  return wp(n, e, r);
}
function _p(t, e, r, n = F.Default, i) {
  if (t !== null) {
    if (e[S] & 2048 && !(n & F.Self)) {
      let s = WC(t, e, r, n, gt);
      if (s !== gt) return s;
    }
    let o = bp(t, e, r, n, gt);
    if (o !== gt) return o;
  }
  return Ep(e, r, n, i);
}
function bp(t, e, r, n, i) {
  let o = zC(r);
  if (typeof o == "function") {
    if (!lp(e, t, n)) return n & F.Host ? wp(i, r, n) : Ep(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & F.Optional))) Ou(r);
      else return s;
    } finally {
      pp();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = Cp(t, e),
      c = lr,
      u = n & F.Host ? e[Ve][Oe] : null;
    for (
      (a === -1 || n & F.SkipSelf) &&
      ((c = a === -1 ? qu(t, e) : e[a + 8]),
      c === lr || !Hf(n, !1)
        ? (a = -1)
        : ((s = e[T]), (a = ts(c)), (e = ns(c, e))));
      a !== -1;

    ) {
      let l = e[T];
      if ($f(o, a, l.data)) {
        let d = HC(a, e, r, s, n, u);
        if (d !== gt) return d;
      }
      (c = e[a + 8]),
        c !== lr && Hf(n, e[T].data[a + 8] === u) && $f(o, a, e)
          ? ((s = l), (a = ts(c)), (e = ns(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function HC(t, e, r, n, i, o) {
  let s = e[T],
    a = s.data[t + 8],
    c = n == null ? Es(a) && Uc : n != s && (a.type & 3) !== 0,
    u = i & F.Host && o === a,
    l = Go(a, s, r, c, u);
  return l !== null ? bn(e, s, l, a) : gt;
}
function Go(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    c = t.directiveStart,
    u = t.directiveEnd,
    l = o >> 20,
    d = n ? a : a + l,
    f = i ? a + l : u;
  for (let h = d; h < f; h++) {
    let p = s[h];
    if ((h < c && r === p) || (h >= c && p.type === r)) return h;
  }
  if (i) {
    let h = s[c];
    if (h && zt(h) && h.type === r) return c;
  }
  return null;
}
function bn(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (kC(i)) {
    let s = i;
    s.resolving && gD(pD(o[r]));
    let a = rs(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? Te(s.injectImpl) : null,
      l = lp(t, n, F.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && PC(r, o[r], e);
    } finally {
      u !== null && Te(u), rs(a), (s.resolving = !1), pp();
    }
  }
  return i;
}
function zC(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(ni) ? t[ni] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & yp : GC) : e;
}
function $f(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> Dp)] & n);
}
function Hf(t, e) {
  return !(t & F.Self) && !(t & F.Host && e);
}
var mn = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return _p(this._tNode, this._lView, e, Ds(n), r);
  }
};
function GC() {
  return new mn(Be(), B());
}
function Tn(t) {
  return pi(() => {
    let e = t.prototype.constructor,
      r = e[Zo] || Hc(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[Zo] || Hc(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Hc(t) {
  return vh(t)
    ? () => {
        let e = Hc(Ee(t));
        return e && e();
      }
    : vn(t);
}
function WC(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[S] & 2048 && !(s[S] & 512); ) {
    let a = bp(o, s, r, n | F.Self, gt);
    if (a !== gt) return a;
    let c = o.parent;
    if (!c) {
      let u = s[zh];
      if (u) {
        let l = u.get(r, gt, n);
        if (l !== gt) return l;
      }
      (c = Ip(s)), (s = s[Mr]);
    }
    o = c;
  }
  return i;
}
function Ip(t) {
  let e = t[T],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Oe] : null;
}
function zf(t, e = null, r = null, n) {
  let i = Mp(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function Mp(t, e = null, r = null, n, i = new Set()) {
  let o = [r || Ze, ZD(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : Ae(t))),
    new si(o, e || Lu(), n || null, i)
  );
}
var pn = class pn {
  static create(e, r) {
    if (Array.isArray(e)) return zf({ name: "" }, r, e, "");
    {
      let n = e.name ?? "";
      return zf({ name: n }, e.parent, e.providers, n);
    }
  }
};
(pn.THROW_IF_NOT_FOUND = ii),
  (pn.NULL = new Ko()),
  (pn.ɵprov = E({ token: pn, providedIn: "any", factory: () => _(Sh) })),
  (pn.__NG_ELEMENT_ID__ = -1);
var Ye = pn;
var qC = new C("");
qC.__NG_ELEMENT_ID__ = (t) => {
  let e = Be();
  if (e === null) throw new w(204, !1);
  if (e.type & 2) return e.value;
  if (t & F.Optional) return null;
  throw new w(204, !1);
};
var ZC = "ngOriginalError";
function yc(t) {
  return t[ZC];
}
var st = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && yc(e);
      for (; r && yc(r); ) r = yc(r);
      return r || null;
    }
  },
  Sp = new C("", {
    providedIn: "root",
    factory: () => g(st).handleError.bind(void 0),
  }),
  Is = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = YC), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  zc = class extends Is {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return Xh(this._lView, e), () => vC(this._lView, e);
    }
  };
function YC() {
  return new zc(B());
}
var Gc = class {
  constructor() {
    (this.destroyed = !1),
      (this.listeners = null),
      (this.errorHandler = g(st, { optional: !0 })),
      (this.destroyRef = g(Is)),
      this.destroyRef.onDestroy(() => {
        (this.destroyed = !0), (this.listeners = null);
      });
  }
  subscribe(e) {
    if (this.destroyed) throw new w(953, !1);
    return (
      (this.listeners ??= []).push(e),
      {
        unsubscribe: () => {
          let r = this.listeners?.indexOf(e);
          r !== void 0 && r !== -1 && this.listeners?.splice(r, 1);
        },
      }
    );
  }
  emit(e) {
    if (this.destroyed) throw new w(953, !1);
    if (this.listeners === null) return;
    let r = V(null);
    try {
      for (let n of this.listeners)
        try {
          n(e);
        } catch (i) {
          this.errorHandler?.handleError(i);
        }
    } finally {
      V(r);
    }
  }
};
function xp(t) {
  return new Gc();
}
function Gf(t, e) {
  return mh(t, e);
}
function QC(t) {
  return mh(gh, t);
}
var An = ((Gf.required = QC), Gf);
function KC() {
  return Tr(Be(), B());
}
function Tr(t, e) {
  return new ae(at(t, e));
}
var ae = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = KC;
  let t = e;
  return t;
})();
function JC(t) {
  return t instanceof ae ? t.nativeElement : t;
}
var Wc = class extends j {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      Hh() && (this.destroyRef = g(Is, { optional: !0 }) ?? void 0);
  }
  emit(e) {
    let r = V(null);
    try {
      super.next(e);
    } finally {
      V(r);
    }
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (o = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((o = Dc(o)), i && (i = Dc(i)), s && (s = Dc(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof ee && e.add(a), a;
  }
};
function Dc(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var re = Wc;
function XC() {
  return this._results[Symbol.iterator]();
}
var qc = class t {
  get changes() {
    return (this._changes ??= new re());
  }
  constructor(e = !1) {
    (this._emitDistinctChangesOnly = e),
      (this.dirty = !0),
      (this._onDirty = void 0),
      (this._results = []),
      (this._changesDetected = !1),
      (this._changes = void 0),
      (this.length = 0),
      (this.first = void 0),
      (this.last = void 0);
    let r = t.prototype;
    r[Symbol.iterator] || (r[Symbol.iterator] = XC);
  }
  get(e) {
    return this._results[e];
  }
  map(e) {
    return this._results.map(e);
  }
  filter(e) {
    return this._results.filter(e);
  }
  find(e) {
    return this._results.find(e);
  }
  reduce(e, r) {
    return this._results.reduce(e, r);
  }
  forEach(e) {
    this._results.forEach(e);
  }
  some(e) {
    return this._results.some(e);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(e, r) {
    this.dirty = !1;
    let n = MD(e);
    (this._changesDetected = !ID(this._results, n, r)) &&
      ((this._results = n),
      (this.length = n.length),
      (this.last = n[this.length - 1]),
      (this.first = n[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.emit(this);
  }
  onDirty(e) {
    this._onDirty = e;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
};
function Tp(t) {
  return (t.flags & 128) === 128;
}
var Ap = new Map(),
  ew = 0;
function tw() {
  return ew++;
}
function nw(t) {
  Ap.set(t[ws], t);
}
function rw(t) {
  Ap.delete(t[ws]);
}
var Wf = "__ngContext__";
function In(t, e) {
  Ht(e) ? ((t[Wf] = e[ws]), nw(e)) : (t[Wf] = e);
}
function Np(t) {
  return Rp(t[ai]);
}
function Op(t) {
  return Rp(t[ot]);
}
function Rp(t) {
  for (; t !== null && !St(t); ) t = t[ot];
  return t;
}
var Zc;
function Pp(t) {
  Zc = t;
}
function iw() {
  if (Zc !== void 0) return Zc;
  if (typeof document < "u") return document;
  throw new w(210, !1);
}
var Zu = new C("", { providedIn: "root", factory: () => ow }),
  ow = "ng",
  Yu = new C(""),
  ct = new C("", { providedIn: "platform", factory: () => "unknown" });
var Qu = new C("", {
  providedIn: "root",
  factory: () =>
    iw().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var sw = "h",
  aw = "b";
var cw = () => null;
function Ku(t, e, r = !1) {
  return cw(t, e, r);
}
var Fp = !1,
  uw = new C("", { providedIn: "root", factory: () => Fp });
var os = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ph})`;
  }
};
function Ms(t) {
  return t instanceof os ? t.changingThisBreaksApplicationSecurity : t;
}
function kp(t, e) {
  let r = lw(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${ph})`);
  }
  return r === e;
}
function lw(t) {
  return (t instanceof os && t.getTypeName()) || null;
}
var dw = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Lp(t) {
  return (t = String(t)), t.match(dw) ? t : "unsafe:" + t;
}
var Ju = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(Ju || {});
function Vp(t) {
  let e = fw();
  return e ? e.sanitize(Ju.URL, t) || "" : kp(t, "URL") ? Ms(t) : Lp(ri(t));
}
function fw() {
  let t = B();
  return t && t[vt].sanitizer;
}
function jp(t) {
  return t instanceof Function ? t() : t;
}
function hw(t) {
  return (t ?? g(Ye)).get(ct) === "browser";
}
var It = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(It || {}),
  pw;
function Xu(t, e) {
  return pw(t, e);
}
function ar(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    St(n) ? (o = n) : Ht(n) && ((s = !0), (n = n[Mt]));
    let a = yt(n);
    t === 0 && r !== null
      ? i == null
        ? zp(e, r, a)
        : ss(e, r, a, i || null, !0)
      : t === 1 && r !== null
        ? ss(e, r, a, i || null, !0)
        : t === 2
          ? xw(e, a, s)
          : t === 3 && e.destroyNode(a),
      o != null && Aw(e, t, o, r, i);
  }
}
function gw(t, e) {
  return t.createText(e);
}
function mw(t, e, r) {
  t.setValue(e, r);
}
function Bp(t, e, r) {
  return t.createElement(e, r);
}
function vw(t, e) {
  Up(t, e), (e[Mt] = null), (e[Oe] = null);
}
function yw(t, e, r, n, i, o) {
  (n[Mt] = i), (n[Oe] = e), xs(t, n, r, 1, i, o);
}
function Up(t, e) {
  e[vt].changeDetectionScheduler?.notify(8), xs(t, e, e[pe], 2, null, null);
}
function Dw(t) {
  let e = t[ai];
  if (!e) return Cc(t[T], t);
  for (; e; ) {
    let r = null;
    if (Ht(e)) r = e[ai];
    else {
      let n = e[ve];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[ot] && e !== t; ) Ht(e) && Cc(e[T], e), (e = e[ye]);
      e === null && (e = t), Ht(e) && Cc(e[T], e), (r = e && e[ot]);
    }
    e = r;
  }
}
function Cw(t, e, r, n) {
  let i = ve + n,
    o = r.length;
  n > 0 && (r[i - 1][ot] = e),
    n < o - ve
      ? ((e[ot] = r[i]), Mh(r, ve + n, e))
      : (r.push(e), (e[ot] = null)),
    (e[ye] = r);
  let s = e[Dn];
  s !== null && r !== s && $p(s, e);
  let a = e[bt];
  a !== null && a.insertView(t), jc(e), (e[S] |= 128);
}
function $p(t, e) {
  let r = t[vr],
    n = e[ye];
  if (Ht(n)) t[S] |= es.HasTransplantedViews;
  else {
    let i = n[ye][Ve];
    e[Ve] !== i && (t[S] |= es.HasTransplantedViews);
  }
  r === null ? (t[vr] = [e]) : r.push(e);
}
function el(t, e) {
  let r = t[vr],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function li(t, e) {
  if (t.length <= ve) return;
  let r = ve + e,
    n = t[r];
  if (n) {
    let i = n[Dn];
    i !== null && i !== t && el(i, n), e > 0 && (t[r - 1][ot] = n[ot]);
    let o = Qo(t, ve + e);
    vw(n[T], n);
    let s = o[bt];
    s !== null && s.detachView(o[T]),
      (n[ye] = null),
      (n[ot] = null),
      (n[S] &= -129);
  }
  return n;
}
function Ss(t, e) {
  if (!(e[S] & 256)) {
    let r = e[pe];
    r.destroyNode && xs(t, e, r, 3, null, null), Dw(e);
  }
}
function Cc(t, e) {
  if (e[S] & 256) return;
  let r = V(null);
  try {
    (e[S] &= -129),
      (e[S] |= 256),
      e[Cn] && $d(e[Cn]),
      Ew(t, e),
      ww(t, e),
      e[T].type === 1 && e[pe].destroy();
    let n = e[Dn];
    if (n !== null && St(e[ye])) {
      n !== e[ye] && el(n, e);
      let i = e[bt];
      i !== null && i.detachView(t);
    }
    rw(e);
  } finally {
    V(r);
  }
}
function ww(t, e) {
  let r = t.cleanup,
    n = e[Jo];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[Jo] = null);
  let i = e[$t];
  if (i !== null) {
    e[$t] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Ew(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof _n)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            pt(4, a, c);
            try {
              c.call(a);
            } finally {
              pt(5, a, c);
            }
          }
        else {
          pt(4, i, o);
          try {
            o.call(i);
          } finally {
            pt(5, i, o);
          }
        }
      }
    }
}
function Hp(t, e, r) {
  return _w(t, e.parent, r);
}
function _w(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[Mt];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === mt.None || o === mt.Emulated) return null;
    }
    return at(n, r);
  }
}
function ss(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function zp(t, e, r) {
  t.appendChild(e, r);
}
function qf(t, e, r, n, i) {
  n !== null ? ss(t, e, r, n, i) : zp(t, e, r);
}
function bw(t, e, r, n) {
  t.removeChild(e, r, n);
}
function tl(t, e) {
  return t.parentNode(e);
}
function Iw(t, e) {
  return t.nextSibling(e);
}
function Gp(t, e, r) {
  return Sw(t, e, r);
}
function Mw(t, e, r) {
  return t.type & 40 ? at(t, r) : null;
}
var Sw = Mw,
  Zf;
function nl(t, e, r, n) {
  let i = Hp(t, n, e),
    o = e[pe],
    s = n.parent || e[Oe],
    a = Gp(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let c = 0; c < r.length; c++) qf(o, i, r[c], a, !1);
    else qf(o, i, r, a, !1);
  Zf !== void 0 && Zf(o, n, e, r, i);
}
function Wo(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return at(e, t);
    if (r & 4) return Yc(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return Wo(t, n);
      {
        let i = t[e.index];
        return St(i) ? Yc(-1, i) : yt(i);
      }
    } else {
      if (r & 32) return Xu(e, t)() || yt(t[e.index]);
      {
        let n = Wp(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = ui(t[Ve]);
          return Wo(i, n);
        } else return Wo(t, e.next);
      }
    }
  }
  return null;
}
function Wp(t, e) {
  if (e !== null) {
    let n = t[Ve][Oe],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function Yc(t, e) {
  let r = ve + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[T].firstChild;
    if (i !== null) return Wo(n, i);
  }
  return e[wn];
}
function xw(t, e, r) {
  let n = tl(t, e);
  n && bw(t, n, e, r);
}
function rl(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      c = r.type;
    if (
      (s && e === 0 && (a && In(yt(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (c & 8) rl(t, e, r.child, n, i, o, !1), ar(e, t, i, a, o);
      else if (c & 32) {
        let u = Xu(r, n),
          l;
        for (; (l = u()); ) ar(e, t, i, l, o);
        ar(e, t, i, a, o);
      } else c & 16 ? qp(t, e, n, r, i, o) : ar(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function xs(t, e, r, n, i, o) {
  rl(r, n, t.firstChild, e, i, o, !1);
}
function Tw(t, e, r) {
  let n = e[pe],
    i = Hp(t, r, e),
    o = r.parent || e[Oe],
    s = Gp(o, r, e);
  qp(n, 0, e, r, i, s);
}
function qp(t, e, r, n, i, o) {
  let s = r[Ve],
    c = s[Oe].projection[n.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      ar(e, t, i, l, o);
    }
  else {
    let u = c,
      l = s[ye];
    Tp(n) && (u.flags |= 128), rl(t, e, u, l, i, o, !0);
  }
}
function Aw(t, e, r, n, i) {
  let o = r[wn],
    s = yt(r);
  o !== s && ar(e, t, n, o, i);
  for (let a = ve; a < r.length; a++) {
    let c = r[a];
    xs(c[T], c, t, e, n, o);
  }
}
function Nw(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : It.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= It.Important)),
        t.setStyle(r, n, i, o));
  }
}
function Ow(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Zp(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function Yp(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && Rc(t, e, n),
    i !== null && Zp(t, e, i),
    o !== null && Ow(t, e, o);
}
var Dt = {};
function Z(t = 1) {
  Qp(Me(), B(), Yt() + t, !1);
}
function Qp(t, e, r, n) {
  if (!n)
    if ((e[S] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && Ho(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && zo(e, o, 0, r);
    }
  En(r);
}
function M(t, e = F.Default) {
  let r = B();
  if (r === null) return _(t, e);
  let n = Be();
  return _p(n, r, Ee(t), e);
}
function Kp(t, e, r, n, i, o) {
  let s = V(null);
  try {
    let a = null;
    i & hr.SignalBased && (a = e[n][Ua]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & hr.HasDecoratorInputTransform &&
        (o = t.inputTransforms[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, r, n) : qh(e, a, n, o);
  } finally {
    V(s);
  }
}
function Rw(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) En(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          SC(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      En(-1);
    }
}
function Ts(t, e, r, n, i, o, s, a, c, u, l) {
  let d = e.blueprint.slice();
  return (
    (d[Mt] = i),
    (d[S] = n | 4 | 128 | 8 | 64),
    (u !== null || (t && t[S] & 2048)) && (d[S] |= 2048),
    Jh(d),
    (d[ye] = d[Mr] = t),
    (d[me] = r),
    (d[vt] = s || (t && t[vt])),
    (d[pe] = a || (t && t[pe])),
    (d[mr] = c || (t && t[mr]) || null),
    (d[Oe] = o),
    (d[ws] = tw()),
    (d[gr] = l),
    (d[zh] = u),
    (d[Ve] = e.type == 2 ? t[Ve] : d),
    d
  );
}
function yi(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = Pw(t, e, r, n, i)), MC() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = _C();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return vi(o, !0), o;
}
function Pw(t, e, r, n, i) {
  let o = rp(),
    s = ip(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = Bw(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function Jp(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function Xp(t, e, r, n, i) {
  let o = Yt(),
    s = n & 2;
  try {
    En(-1), s && e.length > _e && Qp(t, e, _e, !1), pt(s ? 2 : 0, i), r(n, i);
  } finally {
    En(o), pt(s ? 3 : 1, i);
  }
}
function eg(t, e, r) {
  if (Wh(e)) {
    let n = V(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        if (a.contentQueries) {
          let c = r[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      V(n);
    }
  }
}
function tg(t, e, r) {
  tp() && (qw(t, e, r, at(r, e)), (r.flags & 64) === 64 && sg(t, e, r));
}
function ng(t, e, r = at) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function rg(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = il(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id,
      ))
    : e;
}
function il(t, e, r, n, i, o, s, a, c, u, l) {
  let d = _e + n,
    f = d + i,
    h = Fw(d, f),
    p = typeof u == "function" ? u() : u;
  return (h[T] = {
    type: t,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Fw(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : Dt);
  return r;
}
function kw(t, e, r, n) {
  let o = n.get(uw, Fp) || r === mt.ShadowDom,
    s = t.selectRootElement(e, o);
  return Lw(s), s;
}
function Lw(t) {
  Vw(t);
}
var Vw = () => null;
function jw(t, e, r, n) {
  let i = ug(e);
  i.push(r), t.firstCreatePass && lg(t).push(n, i.length - 1);
}
function Bw(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    np() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Yf(t, e, r, n, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      c = hr.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let u = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      u = i[o];
    }
    t === 0 ? Qf(n, r, u, a, c) : Qf(n, r, u, a);
  }
  return n;
}
function Qf(t, e, r, n, i) {
  let o;
  t.hasOwnProperty(r) ? (o = t[r]).push(e, n) : (o = t[r] = [e, n]),
    i !== void 0 && o.push(i);
}
function Uw(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = n; l < i; l++) {
    let d = o[l],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      p = f ? f.outputs : null;
    (c = Yf(0, d.inputs, l, c, h)), (u = Yf(1, d.outputs, l, u, p));
    let y = c !== null && s !== null && !Fu(e) ? nE(c, l, s) : null;
    a.push(y);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = u);
}
function $w(t) {
  return t === "class"
    ? "className"
    : t === "for"
      ? "htmlFor"
      : t === "formaction"
        ? "formAction"
        : t === "innerHtml"
          ? "innerHTML"
          : t === "readonly"
            ? "readOnly"
            : t === "tabindex"
              ? "tabIndex"
              : t;
}
function Hw(t, e, r, n, i, o, s, a) {
  let c = at(e, r),
    u = e.inputs,
    l;
  !a && u != null && (l = u[n])
    ? (ol(t, r, l, n, i), Es(e) && zw(r, e.index))
    : e.type & 3
      ? ((n = $w(n)),
        (i = s != null ? s(i, e.value || "", n) : i),
        o.setProperty(c, n, i))
      : e.type & 12;
}
function zw(t, e) {
  let r = Zt(e, t);
  r[S] & 16 || (r[S] |= 64);
}
function ig(t, e, r, n) {
  if (tp()) {
    let i = n === null ? null : { "": -1 },
      o = Yw(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && og(t, e, r, s, i, a),
      i && Qw(r, n, i);
  }
  r.mergedAttrs = oi(r.mergedAttrs, r.attrs);
}
function og(t, e, r, n, i, o) {
  for (let u = 0; u < n.length; u++) $c(is(r, e), t, n[u].type);
  Jw(r, t.data.length, n.length);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = Jp(t, e, n.length, null);
  for (let u = 0; u < n.length; u++) {
    let l = n[u];
    (r.mergedAttrs = oi(r.mergedAttrs, l.hostAttrs)),
      Xw(t, r, e, c, l),
      Kw(c, l, i),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      c++;
  }
  Uw(t, r, o);
}
function Gw(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    Ww(s) != a && s.push(a), s.push(r, n, o);
  }
}
function Ww(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function qw(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  Es(r) && eE(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || is(r, e),
    In(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      u = bn(e, t, a, r);
    if ((In(u, e), s !== null && tE(e, a - i, u, c, r, s), zt(c))) {
      let l = Zt(r.index, e);
      l[me] = bn(e, t, a, r);
    }
  }
}
function sg(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = xC();
  try {
    En(o);
    for (let a = n; a < i; a++) {
      let c = t.data[a],
        u = e[a];
      Bc(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          Zw(c, u);
    }
  } finally {
    En(-1), Bc(s);
  }
}
function Zw(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function Yw(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (Nh(e, s.selectors, !1))
        if ((n || (n = []), zt(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let c = a.length;
            Qc(t, e, c);
          } else n.unshift(s), Qc(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function Qc(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function Qw(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new w(-301, !1);
      n.push(e[i], o);
    }
  }
}
function Kw(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    zt(e) && (r[""] = t);
  }
}
function Jw(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function Xw(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = vn(i.type, !0)),
    s = new _n(o, zt(i), M);
  (t.blueprint[n] = s), (r[n] = s), Gw(t, e, n, Jp(t, r, i.hostVars, Dt), i);
}
function eE(t, e, r) {
  let n = at(e, t),
    i = rg(r),
    o = t[vt].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = As(
    t,
    Ts(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null),
  );
  t[e.index] = a;
}
function tE(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      Kp(n, r, c, u, l, d);
    }
}
function nE(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function ag(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function cg(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = V(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          Uu(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      V(n);
    }
  }
}
function As(t, e) {
  return t[ai] ? (t[Vf][ot] = e) : (t[ai] = e), (t[Vf] = e), e;
}
function Kc(t, e, r) {
  Uu(0);
  let n = V(null);
  try {
    e(t, r);
  } finally {
    V(n);
  }
}
function ug(t) {
  return (t[Jo] ??= []);
}
function lg(t) {
  return (t.cleanup ??= []);
}
function dg(t, e) {
  let r = t[mr],
    n = r ? r.get(st, null) : null;
  n && n.handleError(e);
}
function ol(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      c = r[o++],
      u = e[s],
      l = t.data[s];
    Kp(l, u, n, a, c, i);
  }
}
function fg(t, e, r) {
  let n = Kh(e, t);
  mw(t[pe], n, r);
}
function rE(t, e) {
  let r = Zt(e, t),
    n = r[T];
  iE(n, r);
  let i = r[Mt];
  i !== null && r[gr] === null && (r[gr] = Ku(i, r[mr])), sl(n, r, r[me]);
}
function iE(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function sl(t, e, r) {
  $u(e);
  try {
    let n = t.viewQuery;
    n !== null && Kc(1, n, r);
    let i = t.template;
    i !== null && Xp(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[bt]?.finishViewCreation(t),
      t.staticContentQueries && cg(t, e),
      t.staticViewQueries && Kc(2, t.viewQuery, r);
    let o = t.components;
    o !== null && oE(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[S] &= -5), Hu();
  }
}
function oE(t, e) {
  for (let r = 0; r < e.length; r++) rE(t, e[r]);
}
function Di(t, e, r, n) {
  let i = V(null);
  try {
    let o = e.tView,
      a = t[S] & 4096 ? 4096 : 16,
      c = Ts(
        t,
        o,
        r,
        a,
        null,
        e,
        null,
        null,
        n?.injector ?? null,
        n?.embeddedViewInjector ?? null,
        n?.dehydratedView ?? null,
      ),
      u = t[e.index];
    c[Dn] = u;
    let l = t[bt];
    return l !== null && (c[bt] = l.createEmbeddedView(o)), sl(o, c, r), c;
  } finally {
    V(i);
  }
}
function hg(t, e) {
  let r = ve + e;
  if (r < t.length) return t[r];
}
function Dr(t, e) {
  return !e || e.firstChild === null || Tp(t);
}
function Ci(t, e, r, n = !0) {
  let i = e[T];
  if ((Cw(i, e, t, r), n)) {
    let s = Yc(r, t),
      a = e[pe],
      c = tl(a, t[wn]);
    c !== null && yw(i, t[Oe], a, e, c, s);
  }
  let o = e[gr];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function pg(t, e) {
  let r = li(t, e);
  return r !== void 0 && Ss(r[T], r), r;
}
function as(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(yt(o)), St(o) && sE(o, n);
    let s = r.type;
    if (s & 8) as(t, e, r.child, n);
    else if (s & 32) {
      let a = Xu(r, e),
        c;
      for (; (c = a()); ) n.push(c);
    } else if (s & 16) {
      let a = Wp(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let c = ui(e[Ve]);
        as(c[T], c, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function sE(t, e) {
  for (let r = ve; r < t.length; r++) {
    let n = t[r],
      i = n[T].firstChild;
    i !== null && as(n[T], n, i, e);
  }
  t[wn] !== t[Mt] && e.push(t[wn]);
}
var gg = [];
function aE(t) {
  return t[Cn] ?? cE(t);
}
function cE(t) {
  let e = gg.pop() ?? Object.create(lE);
  return (e.lView = t), e;
}
function uE(t) {
  t.lView[Cn] !== t && ((t.lView = null), gg.push(t));
}
var lE = U(m({}, $a), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      _s(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[Cn] = this;
    },
  }),
  dE = 100;
function mg(t, e = !0, r = 0) {
  let n = t[vt],
    i = n.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    fE(t, r);
  } catch (s) {
    throw (e && dg(t, s), s);
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function fE(t, e) {
  let r = sp();
  try {
    Bf(!0), Jc(t, e);
    let n = 0;
    for (; ci(t); ) {
      if (n === dE) throw new w(103, !1);
      n++, Jc(t, 1);
    }
  } finally {
    Bf(r);
  }
}
function hE(t, e, r, n) {
  let i = e[S];
  if ((i & 256) === 256) return;
  let o = !1,
    s = !1;
  !o && e[vt].inlineEffectRunner?.flush(), $u(e);
  let a = null,
    c = null;
  !o && pE(t) && ((c = aE(e)), (a = Bd(c)));
  try {
    Jh(e), IC(t.bindingStartIndex), r !== null && Xp(t, e, r, 2, n);
    let u = (i & 3) === 3;
    if (!o)
      if (u) {
        let f = t.preOrderCheckHooks;
        f !== null && Ho(e, f, null);
      } else {
        let f = t.preOrderHooks;
        f !== null && zo(e, f, 0, null), mc(e, 0);
      }
    if ((s || gE(e), vg(e, 0), t.contentQueries !== null && cg(t, e), !o))
      if (u) {
        let f = t.contentCheckHooks;
        f !== null && Ho(e, f);
      } else {
        let f = t.contentHooks;
        f !== null && zo(e, f, 1), mc(e, 1);
      }
    Rw(t, e);
    let l = t.components;
    l !== null && Dg(e, l, 0);
    let d = t.viewQuery;
    if ((d !== null && Kc(2, d, n), !o))
      if (u) {
        let f = t.viewCheckHooks;
        f !== null && Ho(e, f);
      } else {
        let f = t.viewHooks;
        f !== null && zo(e, f, 2), mc(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[gc])) {
      for (let f of e[gc]) f();
      e[gc] = null;
    }
    o || (e[S] &= -73);
  } catch (u) {
    throw (o || _s(e), u);
  } finally {
    c !== null && (Ud(c, a), uE(c)), Hu();
  }
}
function pE(t) {
  return t.type !== 2;
}
function vg(t, e) {
  for (let r = Np(t); r !== null; r = Op(r))
    for (let n = ve; n < r.length; n++) {
      let i = r[n];
      yg(i, e);
    }
}
function gE(t) {
  for (let e = Np(t); e !== null; e = Op(e)) {
    if (!(e[S] & es.HasTransplantedViews)) continue;
    let r = e[vr];
    for (let n = 0; n < r.length; n++) {
      let i = r[n];
      gC(i);
    }
  }
}
function mE(t, e, r) {
  let n = Zt(e, t);
  yg(n, r);
}
function yg(t, e) {
  Bu(t) && Jc(t, e);
}
function Jc(t, e) {
  let n = t[T],
    i = t[S],
    o = t[Cn],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && Ha(o))),
    (s ||= !1),
    o && (o.dirty = !1),
    (t[S] &= -9217),
    s)
  )
    hE(n, t, n.template, t[me]);
  else if (i & 8192) {
    vg(t, 1);
    let a = n.components;
    a !== null && Dg(t, a, 1);
  }
}
function Dg(t, e, r) {
  for (let n = 0; n < e.length; n++) mE(t, e[n], r);
}
function al(t, e) {
  let r = sp() ? 64 : 1088;
  for (t[vt].changeDetectionScheduler?.notify(e); t; ) {
    t[S] |= r;
    let n = ui(t);
    if (Lc(t) && !n) return t;
    t = n;
  }
  return null;
}
var Mn = class {
    get rootNodes() {
      let e = this._lView,
        r = e[T];
      return as(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[me];
    }
    set context(e) {
      this._lView[me] = e;
    }
    get destroyed() {
      return (this._lView[S] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[ye];
        if (St(e)) {
          let r = e[Xo],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (li(e, n), Qo(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      Ss(this._lView[T], this._lView);
    }
    onDestroy(e) {
      Xh(this._lView, e);
    }
    markForCheck() {
      al(this._cdRefInjectingView || this._lView, 4);
    }
    detach() {
      this._lView[S] &= -129;
    }
    reattach() {
      jc(this._lView), (this._lView[S] |= 128);
    }
    detectChanges() {
      (this._lView[S] |= 1024), mg(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new w(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      this._appRef = null;
      let e = Lc(this._lView),
        r = this._lView[Dn];
      r !== null && !e && el(r, this._lView), Up(this._lView[T], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new w(902, !1);
      this._appRef = e;
      let r = Lc(this._lView),
        n = this._lView[Dn];
      n !== null && !r && $p(n, this._lView), jc(this._lView);
    }
  },
  Sn = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = DE;
    let t = e;
    return t;
  })(),
  vE = Sn,
  yE = class extends vE {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = Di(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: r,
        dehydratedView: n,
      });
      return new Mn(i);
    }
  };
function DE() {
  return cl(Be(), B());
}
function cl(t, e) {
  return t.type & 4 ? new yE(e, t, Tr(t, e)) : null;
}
var dF = new RegExp(`^(\\d+)*(${aw}|${sw})*(.*)`);
var CE = () => null;
function Cr(t, e) {
  return CE(t, e);
}
var wr = class {},
  ul = new C("", { providedIn: "root", factory: () => !1 });
var Cg = new C(""),
  Xc = class {},
  cs = class {};
function wE(t) {
  let e = Error(`No component factory found for ${Ae(t)}.`);
  return (e[EE] = t), e;
}
var EE = "ngComponent";
var eu = class {
    resolveComponentFactory(e) {
      throw wE(e);
    }
  },
  gl = class gl {};
gl.NULL = new eu();
var Er = gl,
  _r = class {},
  Nn = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => _E();
    let t = e;
    return t;
  })();
function _E() {
  let t = B(),
    e = Be(),
    r = Zt(e.index, t);
  return (Ht(r) ? r : t)[pe];
}
var bE = (() => {
    let e = class e {};
    e.ɵprov = E({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  wc = {};
var Kf = new Set();
function On(t) {
  Kf.has(t) ||
    (Kf.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
function wg(t) {
  let e = !0;
  return (
    setTimeout(() => {
      e && ((e = !1), t());
    }),
    typeof gn.requestAnimationFrame == "function" &&
      gn.requestAnimationFrame(() => {
        e && ((e = !1), t());
      }),
    () => {
      e = !1;
    }
  );
}
function Jf(t) {
  let e = !0;
  return (
    queueMicrotask(() => {
      e && t();
    }),
    () => {
      e = !1;
    }
  );
}
function Xf(...t) {}
var W = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new re(!1)),
        (this.onMicrotaskEmpty = new re(!1)),
        (this.onStable = new re(!1)),
        (this.onError = new re(!1)),
        typeof Zone > "u")
      )
        throw new w(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.callbackScheduled = !1),
        SE(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new w(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new w(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, IE, Xf, Xf);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  IE = {};
function ll(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function ME(t) {
  t.isCheckStableRunning ||
    t.callbackScheduled ||
    ((t.callbackScheduled = !0),
    Zone.root.run(() => {
      wg(() => {
        (t.callbackScheduled = !1),
          tu(t),
          (t.isCheckStableRunning = !0),
          ll(t),
          (t.isCheckStableRunning = !1);
      });
    }),
    tu(t));
}
function SE(t) {
  let e = () => {
    ME(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (xE(a)) return r.invokeTask(i, o, s, a);
      try {
        return eh(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          th(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, c) => {
      try {
        return eh(t), r.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection &&
          !t.callbackScheduled &&
          !TE(a) &&
          e(),
          th(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), tu(t), ll(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function tu(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.callbackScheduled === !0)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function eh(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function th(t) {
  t._nesting--, ll(t);
}
var nu = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new re()),
      (this.onMicrotaskEmpty = new re()),
      (this.onStable = new re()),
      (this.onError = new re());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, i) {
    return e.apply(r, n);
  }
};
function xE(t) {
  return Eg(t, "__ignore_ng_zone__");
}
function TE(t) {
  return Eg(t, "__scheduler_tick__");
}
function Eg(t, e) {
  return !Array.isArray(t) || t.length !== 1 ? !1 : t[0]?.data?.[e] === !0;
}
var cr = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(cr || {}),
  AE = { destroy() {} };
function Ns(t, e) {
  !e && oC(Ns);
  let r = e?.injector ?? g(Ye);
  if (!hw(r)) return AE;
  On("NgAfterNextRender");
  let n = r.get(dl),
    i = (n.handler ??= new iu()),
    o = e?.phase ?? cr.MixedReadWrite,
    s = () => {
      i.unregister(c), a();
    },
    a = r.get(Is).onDestroy(s),
    c = Ke(
      r,
      () =>
        new ru(o, () => {
          s(), t();
        }),
    );
  return i.register(c), { destroy: s };
}
var ru = class {
    constructor(e, r) {
      (this.phase = e),
        (this.callbackFn = r),
        (this.zone = g(W)),
        (this.errorHandler = g(st, { optional: !0 })),
        g(wr, { optional: !0 })?.notify(6);
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  iu = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [cr.EarlyRead]: new Set(),
          [cr.Write]: new Set(),
          [cr.MixedReadWrite]: new Set(),
          [cr.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  dl = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of n) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = E({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function ou(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = xf(i, a);
      else if (o == 2) {
        let c = a,
          u = e[++s];
        n = xf(n, c + ": " + u + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var us = class extends Er {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = yn(e);
    return new di(r, this.ngModule);
  }
};
function nh(t) {
  let e = [];
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue;
    let n = t[r];
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return e;
}
function NE(t) {
  let e = t.toLowerCase();
  return e === "svg" ? lC : e === "math" ? dC : null;
}
var su = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = Ds(n);
      let i = this.injector.get(e, wc, n);
      return i !== wc || r === wc ? i : this.parentInjector.get(e, r, n);
    }
  },
  di = class extends cs {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = nh(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return nh(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = HD(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      let o = V(null);
      try {
        i = i || this.ngModule;
        let s = i instanceof Ne ? i : i?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new su(e, s) : e,
          c = a.get(_r, null);
        if (c === null) throw new w(407, !1);
        let u = a.get(bE, null),
          l = a.get(dl, null),
          d = a.get(wr, null),
          f = {
            rendererFactory: c,
            sanitizer: u,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          h = c.createRenderer(null, this.componentDef),
          p = this.componentDef.selectors[0][0] || "div",
          y = n
            ? kw(h, n, this.componentDef.encapsulation, a)
            : Bp(h, p, NE(p)),
          v = 512;
        this.componentDef.signals
          ? (v |= 4096)
          : this.componentDef.onPush || (v |= 16);
        let D = null;
        y !== null && (D = Ku(y, a, !0));
        let $ = il(0, null, null, 1, 0, null, null, null, null, null, null),
          X = Ts(null, $, null, v, null, null, f, h, a, null, D);
        $u(X);
        let Y, Ge;
        try {
          let ue = this.componentDef,
            We,
            zn = null;
          ue.findHostDirectiveDefs
            ? ((We = []),
              (zn = new Map()),
              ue.findHostDirectiveDefs(ue, We, zn),
              We.push(ue))
            : (We = [ue]);
          let dy = OE(X, y),
            fy = RE(dy, y, ue, We, X, f, h);
          (Ge = ju($, _e)),
            y && kE(h, ue, y, n),
            r !== void 0 && LE(Ge, this.ngContentSelectors, r),
            (Y = FE(fy, ue, We, zn, X, [VE])),
            sl($, X, null);
        } finally {
          Hu();
        }
        return new au(this.componentType, Y, Tr(Ge, X), X, Ge);
      } finally {
        V(o);
      }
    }
  },
  au = class extends Xc {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new Mn(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        ol(o[T], o, i, e, r), this.previousInputValues.set(e, r);
        let s = Zt(this._tNode.index, o);
        al(s, 1);
      }
    }
    get injector() {
      return new mn(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function OE(t, e) {
  let r = t[T],
    n = _e;
  return (t[n] = e), yi(r, n, 2, "#host", null);
}
function RE(t, e, r, n, i, o, s) {
  let a = i[T];
  PE(n, t, e, s);
  let c = null;
  e !== null && (c = Ku(e, i[mr]));
  let u = o.rendererFactory.createRenderer(e, r),
    l = 16;
  r.signals ? (l = 4096) : r.onPush && (l = 64);
  let d = Ts(i, rg(r), null, l, i[t.index], t, o, u, null, null, c);
  return (
    a.firstCreatePass && Qc(a, t, n.length - 1), As(i, d), (i[t.index] = d)
  );
}
function PE(t, e, r, n) {
  for (let i of t) e.mergedAttrs = oi(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (ou(e, e.mergedAttrs, !0), r !== null && Yp(n, r, e));
}
function FE(t, e, r, n, i, o) {
  let s = Be(),
    a = i[T],
    c = at(s, i);
  og(a, i, s, r, null, n);
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = bn(i, a, d, s);
    In(f, i);
  }
  sg(a, i, s), c && In(c, i);
  let u = bn(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[me] = i[me] = u), o !== null)) for (let l of o) l(u, e);
  return eg(a, s, i), u;
}
function kE(t, e, r, n) {
  if (n) Rc(t, r, ["ng-version", "18.0.2"]);
  else {
    let { attrs: i, classes: o } = zD(e.selectors[0]);
    i && Rc(t, r, i), o && o.length > 0 && Zp(t, r, o.join(" "));
  }
}
function LE(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function VE() {
  let t = Be();
  Wu(B()[T], t);
}
var Qt = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = jE;
  let t = e;
  return t;
})();
function jE() {
  let t = Be();
  return bg(t, B());
}
var BE = Qt,
  _g = class extends BE {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Tr(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new mn(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = qu(this._hostTNode, this._hostLView);
      if (vp(e)) {
        let r = ns(e, this._hostLView),
          n = ts(e),
          i = r[T].data[n + 8];
        return new mn(i, r);
      } else return new mn(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = rh(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - ve;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = Cr(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, Dr(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !sC(e),
        a;
      if (s) a = r;
      else {
        let p = r || {};
        (a = p.index),
          (n = p.injector),
          (i = p.projectableNodes),
          (o = p.environmentInjector || p.ngModuleRef);
      }
      let c = s ? e : new di(yn(e)),
        u = n || this.parentInjector;
      if (!o && c.ngModule == null) {
        let y = (s ? u : this.parentInjector).get(Ne, null);
        y && (o = y);
      }
      let l = yn(c.componentType ?? {}),
        d = Cr(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = c.create(u, i, f, o);
      return this.insertImpl(h.hostView, a, Dr(this._hostTNode, d)), h;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (pC(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[ye],
            u = new _g(c, c[Oe], c[ye]);
          u.detach(u.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return Ci(s, i, o, n), e.attachToViewContainerRef(), Mh(Ec(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = rh(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = li(this._lContainer, r);
      n && (Qo(Ec(this._lContainer), r), Ss(n[T], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = li(this._lContainer, r);
      return n && Qo(Ec(this._lContainer), r) != null ? new Mn(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function rh(t) {
  return t[Xo];
}
function Ec(t) {
  return t[Xo] || (t[Xo] = []);
}
function bg(t, e) {
  let r,
    n = e[t.index];
  return (
    St(n) ? (r = n) : ((r = ag(n, e, null, t)), (e[t.index] = r), As(e, r)),
    $E(r, e, t, n),
    new _g(r, t, e)
  );
}
function UE(t, e) {
  let r = t[pe],
    n = r.createComment(""),
    i = at(e, t),
    o = tl(r, i);
  return ss(r, o, n, Iw(r, i), !1), n;
}
var $E = GE,
  HE = () => !1;
function zE(t, e, r) {
  return HE(t, e, r);
}
function GE(t, e, r, n) {
  if (t[wn]) return;
  let i;
  r.type & 8 ? (i = yt(n)) : (i = UE(e, r)), (t[wn] = i);
}
var cu = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  uu = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let r = e.queries;
      if (r !== null) {
        let n = e.contentQueries !== null ? e.contentQueries[0] : r.length,
          i = [];
        for (let o = 0; o < n; o++) {
          let s = r.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    finishViewCreation(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let r = 0; r < this.queries.length; r++)
        fl(e, r).matches !== null && this.queries[r].setDirty();
    }
  },
  lu = class {
    constructor(e, r, n = null) {
      (this.flags = r),
        (this.read = n),
        typeof e == "string" ? (this.predicate = XE(e)) : (this.predicate = e);
    }
  },
  du = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementStart(e, r);
    }
    elementEnd(e) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementEnd(e);
    }
    embeddedTView(e) {
      let r = null;
      for (let n = 0; n < this.length; n++) {
        let i = r !== null ? r.length : 0,
          o = this.getByIndex(n).embeddedTView(e, i);
        o &&
          ((o.indexInDeclarationView = n), r !== null ? r.push(o) : (r = [o]));
      }
      return r !== null ? new t(r) : null;
    }
    template(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].template(e, r);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  fu = class t {
    constructor(e, r = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = r);
    }
    elementStart(e, r) {
      this.isApplyingToNode(r) && this.matchTNode(e, r);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, r) {
      this.elementStart(e, r);
    }
    embeddedTView(e, r) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, r),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let r = this._declarationNodeIndex,
          n = e.parent;
        for (; n !== null && n.type & 8 && n.index !== r; ) n = n.parent;
        return r === (n !== null ? n.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, r) {
      let n = this.metadata.predicate;
      if (Array.isArray(n))
        for (let i = 0; i < n.length; i++) {
          let o = n[i];
          this.matchTNodeWithReadOption(e, r, WE(r, o)),
            this.matchTNodeWithReadOption(e, r, Go(r, e, o, !1, !1));
        }
      else
        n === Sn
          ? r.type & 4 && this.matchTNodeWithReadOption(e, r, -1)
          : this.matchTNodeWithReadOption(e, r, Go(r, e, n, !1, !1));
    }
    matchTNodeWithReadOption(e, r, n) {
      if (n !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === ae || i === Qt || (i === Sn && r.type & 4))
            this.addMatch(r.index, -2);
          else {
            let o = Go(r, e, i, !1, !1);
            o !== null && this.addMatch(r.index, o);
          }
        else this.addMatch(r.index, n);
      }
    }
    addMatch(e, r) {
      this.matches === null ? (this.matches = [e, r]) : this.matches.push(e, r);
    }
  };
function WE(t, e) {
  let r = t.localNames;
  if (r !== null) {
    for (let n = 0; n < r.length; n += 2) if (r[n] === e) return r[n + 1];
  }
  return null;
}
function qE(t, e) {
  return t.type & 11 ? Tr(t, e) : t.type & 4 ? cl(t, e) : null;
}
function ZE(t, e, r, n) {
  return r === -1 ? qE(e, t) : r === -2 ? YE(t, e, n) : bn(t, t[T], r, e);
}
function YE(t, e, r) {
  if (r === ae) return Tr(e, t);
  if (r === Sn) return cl(e, t);
  if (r === Qt) return bg(e, t);
}
function Ig(t, e, r, n) {
  let i = e[bt].queries[n];
  if (i.matches === null) {
    let o = t.data,
      s = r.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let u = s[c];
      if (u < 0) a.push(null);
      else {
        let l = o[u];
        a.push(ZE(e, l, s[c + 1], r.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function hu(t, e, r, n) {
  let i = t.queries.getByIndex(r),
    o = i.matches;
  if (o !== null) {
    let s = Ig(t, e, i, r);
    for (let a = 0; a < o.length; a += 2) {
      let c = o[a];
      if (c > 0) n.push(s[a / 2]);
      else {
        let u = o[a + 1],
          l = e[-c];
        for (let d = ve; d < l.length; d++) {
          let f = l[d];
          f[Dn] === f[ye] && hu(f[T], f, u, n);
        }
        if (l[vr] !== null) {
          let d = l[vr];
          for (let f = 0; f < d.length; f++) {
            let h = d[f];
            hu(h[T], h, u, n);
          }
        }
      }
    }
  }
  return n;
}
function QE(t, e) {
  return t[bt].queries[e].queryList;
}
function KE(t, e, r) {
  let n = new qc((r & 4) === 4);
  return (
    jw(t, e, n, n.destroy), (e[bt] ??= new uu()).queries.push(new cu(n)) - 1
  );
}
function JE(t, e, r) {
  let n = Me();
  return (
    n.firstCreatePass &&
      (e_(n, new lu(t, e, r), -1), (e & 2) === 2 && (n.staticViewQueries = !0)),
    KE(n, B(), e)
  );
}
function XE(t) {
  return t.split(",").map((e) => e.trim());
}
function e_(t, e, r) {
  t.queries === null && (t.queries = new du()), t.queries.track(new fu(e, r));
}
function fl(t, e) {
  return t.queries.getByIndex(e);
}
function t_(t, e) {
  let r = t[T],
    n = fl(r, e);
  return n.crossesNgTemplate ? hu(r, t, e, []) : Ig(r, t, n, e);
}
function n_(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Ue(t) {
  let e = n_(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (zt(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new w(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = Bo(t.inputs)),
          (s.inputTransforms = Bo(t.inputTransforms)),
          (s.declaredInputs = Bo(t.declaredInputs)),
          (s.outputs = Bo(t.outputs));
        let a = i.hostBindings;
        a && a_(t, a);
        let c = i.viewQuery,
          u = i.contentQueries;
        if (
          (c && o_(t, c),
          u && s_(t, u),
          r_(t, i),
          sD(t.outputs, i.outputs),
          zt(i) && i.data.animation)
        ) {
          let l = t.data;
          l.animation = (l.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Ue && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  i_(n);
}
function r_(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function i_(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = oi(i.hostAttrs, (r = oi(r, i.hostAttrs))));
  }
}
function Bo(t) {
  return t === dr ? {} : t === Ze ? [] : t;
}
function o_(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function s_(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function a_(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function Os(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n];
      Array.isArray(i) && i[3] && (r[n] = i[3]);
    }
  t.inputTransforms = r;
}
var Gt = class {},
  fi = class {};
var pu = class extends Gt {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new us(this));
      let i = kh(e);
      (this._bootstrapComponents = jp(i.bootstrap)),
        (this._r3Injector = Mp(
          e,
          r,
          [
            { provide: Gt, useValue: this },
            { provide: Er, useValue: this.componentFactoryResolver },
            ...n,
          ],
          Ae(e),
          new Set(["environment"]),
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  gu = class extends fi {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new pu(this.moduleType, e, []);
    }
  };
var ls = class extends Gt {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new us(this)),
      (this.instance = null);
    let r = new si(
      [
        ...e.providers,
        { provide: Gt, useValue: this },
        { provide: Er, useValue: this.componentFactoryResolver },
      ],
      e.parent || Lu(),
      e.debugName,
      new Set(["environment"]),
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function hl(t, e, r = null) {
  return new ls({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Rn = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new he(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Mg(t) {
  return u_(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function c_(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function u_(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
function Sg(t, e, r) {
  return (t[e] = r);
}
function Wt(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function xg(t, e, r, n) {
  let i = Wt(t, e, r);
  return Wt(t, e + 1, n) || i;
}
function l_(t) {
  return (t.flags & 32) === 32;
}
function d_(t, e, r, n, i, o, s, a, c) {
  let u = e.consts,
    l = yi(e, t, 4, s || null, a || null);
  ig(e, r, l, yr(u, c)), Wu(e, l);
  let d = (l.tView = il(
    2,
    l,
    n,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    u,
    null,
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  );
}
function ds(t, e, r, n, i, o, s, a, c, u) {
  let l = r + _e,
    d = e.firstCreatePass ? d_(l, e, t, n, i, o, s, a, c) : e.data[l];
  vi(d, !1);
  let f = f_(e, t, d, r);
  zu() && nl(e, t, f, d), In(f, t);
  let h = ag(f, t, f, d);
  return (
    (t[l] = h),
    As(t, h),
    zE(h, d, t),
    Vu(d) && tg(e, t, d),
    c != null && ng(t, d, u),
    d
  );
}
function Ar(t, e, r, n, i, o, s, a) {
  let c = B(),
    u = Me(),
    l = yr(u.consts, o);
  return ds(c, u, t, e, r, n, i, l, s, a), Ar;
}
var f_ = h_;
function h_(t, e, r, n) {
  return Gu(!0), e[pe].createComment("");
}
function p_(t, e, r, n) {
  return Wt(t, bs(), r) ? e + ri(r) + n : Dt;
}
function g_(t, e, r, n, i, o) {
  let s = bC(),
    a = xg(t, s, r, i);
  return cp(2), a ? e + ri(r) + n + ri(i) + o : Dt;
}
function Uo(t, e) {
  return (t << 17) | (e << 2);
}
function xn(t) {
  return (t >> 17) & 32767;
}
function m_(t) {
  return (t & 2) == 2;
}
function v_(t, e) {
  return (t & 131071) | (e << 17);
}
function mu(t) {
  return t | 2;
}
function br(t) {
  return (t & 131068) >> 2;
}
function _c(t, e) {
  return (t & -131069) | (e << 2);
}
function y_(t) {
  return (t & 1) === 1;
}
function vu(t) {
  return t | 1;
}
function D_(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = xn(s),
    c = br(s);
  t[n] = r;
  let u = !1,
    l;
  if (Array.isArray(r)) {
    let d = r;
    (l = d[1]), (l === null || mi(d, l) > 0) && (u = !0);
  } else l = r;
  if (i)
    if (c !== 0) {
      let f = xn(t[a + 1]);
      (t[n + 1] = Uo(f, a)),
        f !== 0 && (t[f + 1] = _c(t[f + 1], n)),
        (t[a + 1] = v_(t[a + 1], n));
    } else
      (t[n + 1] = Uo(a, 0)), a !== 0 && (t[a + 1] = _c(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = Uo(c, 0)),
      a === 0 ? (a = n) : (t[c + 1] = _c(t[c + 1], n)),
      (c = n);
  u && (t[n + 1] = mu(t[n + 1])),
    ih(t, l, n, !0),
    ih(t, l, n, !1),
    C_(e, l, t, n, o),
    (s = Uo(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function C_(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    mi(o, e) >= 0 &&
    (r[n + 1] = vu(r[n + 1]));
}
function ih(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? xn(i) : br(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let c = t[s],
      u = t[s + 1];
    w_(c, e) && ((a = !0), (t[s + 1] = n ? vu(u) : mu(u))),
      (s = n ? xn(u) : br(u));
  }
  a && (t[r + 1] = n ? mu(i) : vu(i));
}
function w_(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
      ? mi(t, e) >= 0
      : !1;
}
function Re(t, e, r) {
  let n = B(),
    i = bs();
  if (Wt(n, i, e)) {
    let o = Me(),
      s = OC();
    Hw(o, s, n, t, e, n[pe], r, !1);
  }
  return Re;
}
function oh(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  ol(t, r, o[s], s, n);
}
function Nr(t, e, r) {
  return Tg(t, e, r, !1), Nr;
}
function Or(t, e) {
  return Tg(t, e, null, !0), Or;
}
function Tg(t, e, r, n) {
  let i = B(),
    o = Me(),
    s = cp(2);
  if ((o.firstUpdatePass && __(o, t, s, n), e !== Dt && Wt(i, s, e))) {
    let a = o.data[Yt()];
    x_(o, a, i, i[pe], t, (i[s + 1] = T_(e, r)), n, s);
  }
}
function E_(t, e) {
  return e >= t.expandoStartIndex;
}
function __(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[Yt()],
      s = E_(t, r);
    A_(o, n) && e === null && !s && (e = !1),
      (e = b_(i, o, e, n)),
      D_(i, o, e, r, s, n);
  }
}
function b_(t, e, r, n) {
  let i = TC(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = bc(null, t, e, r, n)), (r = hi(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = bc(i, t, e, r, n)), o === null)) {
        let c = I_(t, e, n);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = bc(null, t, e, c[1], n)),
          (c = hi(c, e.attrs, n)),
          M_(t, e, n, c));
      } else o = S_(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function I_(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (br(n) !== 0) return t[xn(n)];
}
function M_(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[xn(i)] = n;
}
function S_(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = hi(n, s, r);
  }
  return hi(n, e.attrs, r);
}
function bc(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = hi(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function hi(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          TD(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function x_(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    u = c[a + 1],
    l = y_(u) ? sh(c, e, r, i, br(u), s) : void 0;
  if (!fs(l)) {
    fs(o) || (m_(u) && (o = sh(c, null, r, i, a, s)));
    let d = Kh(Yt(), r);
    Nw(n, s, d, i, o);
  }
}
function sh(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      f = r[i + 1];
    f === Dt && (f = d ? Ze : void 0);
    let h = d ? hc(f, n) : l === n ? f : void 0;
    if ((u && !fs(h) && (h = hc(c, n)), fs(h) && ((a = h), s))) return a;
    let p = t[i + 1];
    i = s ? xn(p) : br(p);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = hc(c, n));
  }
  return a;
}
function fs(t) {
  return t !== void 0;
}
function T_(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = Ae(Ms(t)))),
    t
  );
}
function A_(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var yu = class {
  destroy(e) {}
  updateValue(e, r) {}
  swap(e, r) {
    let n = Math.min(e, r),
      i = Math.max(e, r),
      o = this.detach(i);
    if (i - n > 1) {
      let s = this.detach(n);
      this.attach(n, o), this.attach(i, s);
    } else this.attach(n, o);
  }
  move(e, r) {
    this.attach(r, this.detach(e));
  }
};
function Ic(t, e, r, n, i) {
  return t === r && Object.is(e, n) ? 1 : Object.is(i(t, e), i(r, n)) ? -1 : 0;
}
function N_(t, e, r) {
  let n,
    i,
    o = 0,
    s = t.length - 1,
    a = void 0;
  if (Array.isArray(e)) {
    let c = e.length - 1;
    for (; o <= s && o <= c; ) {
      let u = t.at(o),
        l = e[o],
        d = Ic(o, u, o, l, r);
      if (d !== 0) {
        d < 0 && t.updateValue(o, l), o++;
        continue;
      }
      let f = t.at(s),
        h = e[c],
        p = Ic(s, f, c, h, r);
      if (p !== 0) {
        p < 0 && t.updateValue(s, h), s--, c--;
        continue;
      }
      let y = r(o, u),
        v = r(s, f),
        D = r(o, l);
      if (Object.is(D, v)) {
        let $ = r(c, h);
        Object.is($, y)
          ? (t.swap(o, s), t.updateValue(s, h), c--, s--)
          : t.move(s, o),
          t.updateValue(o, l),
          o++;
        continue;
      }
      if (((n ??= new hs()), (i ??= ch(t, o, s, r)), Du(t, n, o, D)))
        t.updateValue(o, l), o++, s++;
      else if (i.has(D)) n.set(y, t.detach(o)), s--;
      else {
        let $ = t.create(o, e[o]);
        t.attach(o, $), o++, s++;
      }
    }
    for (; o <= c; ) ah(t, n, r, o, e[o]), o++;
  } else if (e != null) {
    let c = e[Symbol.iterator](),
      u = c.next();
    for (; !u.done && o <= s; ) {
      let l = t.at(o),
        d = u.value,
        f = Ic(o, l, o, d, r);
      if (f !== 0) f < 0 && t.updateValue(o, d), o++, (u = c.next());
      else {
        (n ??= new hs()), (i ??= ch(t, o, s, r));
        let h = r(o, d);
        if (Du(t, n, o, h)) t.updateValue(o, d), o++, s++, (u = c.next());
        else if (!i.has(h))
          t.attach(o, t.create(o, d)), o++, s++, (u = c.next());
        else {
          let p = r(o, l);
          n.set(p, t.detach(o)), s--;
        }
      }
    }
    for (; !u.done; ) ah(t, n, r, t.length, u.value), (u = c.next());
  }
  for (; o <= s; ) t.destroy(t.detach(s--));
  n?.forEach((c) => {
    t.destroy(c);
  });
}
function Du(t, e, r, n) {
  return e !== void 0 && e.has(n)
    ? (t.attach(r, e.get(n)), e.delete(n), !0)
    : !1;
}
function ah(t, e, r, n, i) {
  if (Du(t, e, n, r(n, i))) t.updateValue(n, i);
  else {
    let o = t.create(n, i);
    t.attach(n, o);
  }
}
function ch(t, e, r, n) {
  let i = new Set();
  for (let o = e; o <= r; o++) i.add(n(o, t.at(o)));
  return i;
}
var hs = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(e) {
    return this.kvMap.has(e);
  }
  delete(e) {
    if (!this.has(e)) return !1;
    let r = this.kvMap.get(e);
    return (
      this._vMap !== void 0 && this._vMap.has(r)
        ? (this.kvMap.set(e, this._vMap.get(r)), this._vMap.delete(r))
        : this.kvMap.delete(e),
      !0
    );
  }
  get(e) {
    return this.kvMap.get(e);
  }
  set(e, r) {
    if (this.kvMap.has(e)) {
      let n = this.kvMap.get(e);
      this._vMap === void 0 && (this._vMap = new Map());
      let i = this._vMap;
      for (; i.has(n); ) n = i.get(n);
      i.set(n, r);
    } else this.kvMap.set(e, r);
  }
  forEach(e) {
    for (let [r, n] of this.kvMap)
      if ((e(n, r), this._vMap !== void 0)) {
        let i = this._vMap;
        for (; i.has(n); ) (n = i.get(n)), e(n, r);
      }
  }
};
function Rs(t, e) {
  On("NgControlFlow");
  let r = B(),
    n = bs(),
    i = r[n] !== Dt ? r[n] : -1,
    o = i !== -1 ? ps(r, _e + i) : void 0,
    s = 0;
  if (Wt(r, n, t)) {
    let a = V(null);
    try {
      if ((o !== void 0 && pg(o, s), t !== -1)) {
        let c = _e + t,
          u = ps(r, c),
          l = _u(r[T], c),
          d = Cr(u, l.tView.ssrId),
          f = Di(r, l, e, { dehydratedView: d });
        Ci(u, f, s, Dr(l, d));
      }
    } finally {
      V(a);
    }
  } else if (o !== void 0) {
    let a = hg(o, s);
    a !== void 0 && (a[me] = e);
  }
}
var Cu = class {
  constructor(e, r, n) {
    (this.lContainer = e), (this.$implicit = r), (this.$index = n);
  }
  get $count() {
    return this.lContainer.length - ve;
  }
};
function Ag(t) {
  return t;
}
var wu = class {
  constructor(e, r, n) {
    (this.hasEmptyBlock = e), (this.trackByFn = r), (this.liveCollection = n);
  }
};
function Ng(t, e, r, n, i, o, s, a, c, u, l, d, f) {
  On("NgControlFlow");
  let h = B(),
    p = Me(),
    y = c !== void 0,
    v = B(),
    D = a ? s.bind(v[Ve][me]) : s,
    $ = new wu(y, D);
  (v[_e + t] = $),
    ds(h, p, t + 1, e, r, n, i, yr(p.consts, o)),
    y && ds(h, p, t + 2, c, u, l, d, yr(p.consts, f));
}
var Eu = class extends yu {
  constructor(e, r, n) {
    super(),
      (this.lContainer = e),
      (this.hostLView = r),
      (this.templateTNode = n),
      (this.operationsCounter = void 0),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - ve;
  }
  at(e) {
    return this.getLView(e)[me].$implicit;
  }
  attach(e, r) {
    let n = r[gr];
    (this.needsIndexUpdate ||= e !== this.length),
      Ci(this.lContainer, r, e, Dr(this.templateTNode, n));
  }
  detach(e) {
    return (
      (this.needsIndexUpdate ||= e !== this.length - 1), O_(this.lContainer, e)
    );
  }
  create(e, r) {
    let n = Cr(this.lContainer, this.templateTNode.tView.ssrId),
      i = Di(
        this.hostLView,
        this.templateTNode,
        new Cu(this.lContainer, r, e),
        { dehydratedView: n },
      );
    return this.operationsCounter?.recordCreate(), i;
  }
  destroy(e) {
    Ss(e[T], e), this.operationsCounter?.recordDestroy();
  }
  updateValue(e, r) {
    this.getLView(e)[me].$implicit = r;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let e = 0; e < this.length; e++) this.getLView(e)[me].$index = e;
  }
  getLView(e) {
    return R_(this.lContainer, e);
  }
};
function Og(t) {
  let e = V(null),
    r = Yt();
  try {
    let n = B(),
      i = n[T],
      o = n[r],
      s = r + 1,
      a = ps(n, s);
    if (o.liveCollection === void 0) {
      let u = _u(i, s);
      o.liveCollection = new Eu(a, n, u);
    } else o.liveCollection.reset();
    let c = o.liveCollection;
    if ((N_(c, t, o.trackByFn), c.updateIndexes(), o.hasEmptyBlock)) {
      let u = bs(),
        l = c.length === 0;
      if (Wt(n, u, l)) {
        let d = r + 2,
          f = ps(n, d);
        if (l) {
          let h = _u(i, d),
            p = Cr(f, h.tView.ssrId),
            y = Di(n, h, void 0, { dehydratedView: p });
          Ci(f, y, 0, Dr(h, p));
        } else pg(f, 0);
      }
    }
  } finally {
    V(e);
  }
}
function ps(t, e) {
  return t[e];
}
function O_(t, e) {
  return li(t, e);
}
function R_(t, e) {
  return hg(t, e);
}
function _u(t, e) {
  return ju(t, e);
}
function P_(t, e, r, n, i, o) {
  let s = e.consts,
    a = yr(s, i),
    c = yi(e, t, 2, n, a);
  return (
    ig(e, r, c, yr(s, o)),
    c.attrs !== null && ou(c, c.attrs, !1),
    c.mergedAttrs !== null && ou(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function R(t, e, r, n) {
  let i = B(),
    o = Me(),
    s = _e + t,
    a = i[pe],
    c = o.firstCreatePass ? P_(s, o, i, e, r, n) : o.data[s],
    u = F_(o, i, c, a, e, t);
  i[s] = u;
  let l = Vu(c);
  return (
    vi(c, !0),
    Yp(a, u, c),
    !l_(c) && zu() && nl(o, i, u, c),
    yC() === 0 && In(u, i),
    DC(),
    l && (tg(o, i, c), eg(o, c, i)),
    n !== null && ng(i, c),
    R
  );
}
function L() {
  let t = Be();
  ip() ? op() : ((t = t.parent), vi(t, !1));
  let e = t;
  wC(e) && EC(), CC();
  let r = Me();
  return (
    r.firstCreatePass && (Wu(r, t), Wh(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      LC(e) &&
      oh(r, e, B(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      VC(e) &&
      oh(r, e, B(), e.stylesWithoutHost, !1),
    L
  );
}
function Pe(t, e, r, n) {
  return R(t, e, r, n), L(), Pe;
}
var F_ = (t, e, r, n, i, o) => (Gu(!0), Bp(n, i, RC()));
function Ps() {
  return B();
}
var hn = void 0;
function k_(t) {
  let e = t,
    r = Math.floor(Math.abs(t)),
    n = t.toString().replace(/^[^.]*\.?/, "").length;
  return r === 1 && n === 0 ? 1 : 5;
}
var L_ = [
    "en",
    [["a", "p"], ["AM", "PM"], hn],
    [["AM", "PM"], hn, hn],
    [
      ["S", "M", "T", "W", "T", "F", "S"],
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ],
    hn,
    [
      ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    ],
    hn,
    [
      ["B", "A"],
      ["BC", "AD"],
      ["Before Christ", "Anno Domini"],
    ],
    0,
    [6, 0],
    ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
    ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
    ["{1}, {0}", hn, "{1} 'at' {0}", hn],
    [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
    ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"],
    "USD",
    "$",
    "US Dollar",
    {},
    "ltr",
    k_,
  ],
  Mc = {};
function Je(t) {
  let e = V_(t),
    r = uh(e);
  if (r) return r;
  let n = e.split("-")[0];
  if (((r = uh(n)), r)) return r;
  if (n === "en") return L_;
  throw new w(701, !1);
}
function uh(t) {
  return (
    t in Mc ||
      (Mc[t] =
        gn.ng &&
        gn.ng.common &&
        gn.ng.common.locales &&
        gn.ng.common.locales[t]),
    Mc[t]
  );
}
var oe = (function (t) {
  return (
    (t[(t.LocaleId = 0)] = "LocaleId"),
    (t[(t.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
    (t[(t.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
    (t[(t.DaysFormat = 3)] = "DaysFormat"),
    (t[(t.DaysStandalone = 4)] = "DaysStandalone"),
    (t[(t.MonthsFormat = 5)] = "MonthsFormat"),
    (t[(t.MonthsStandalone = 6)] = "MonthsStandalone"),
    (t[(t.Eras = 7)] = "Eras"),
    (t[(t.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
    (t[(t.WeekendRange = 9)] = "WeekendRange"),
    (t[(t.DateFormat = 10)] = "DateFormat"),
    (t[(t.TimeFormat = 11)] = "TimeFormat"),
    (t[(t.DateTimeFormat = 12)] = "DateTimeFormat"),
    (t[(t.NumberSymbols = 13)] = "NumberSymbols"),
    (t[(t.NumberFormats = 14)] = "NumberFormats"),
    (t[(t.CurrencyCode = 15)] = "CurrencyCode"),
    (t[(t.CurrencySymbol = 16)] = "CurrencySymbol"),
    (t[(t.CurrencyName = 17)] = "CurrencyName"),
    (t[(t.Currencies = 18)] = "Currencies"),
    (t[(t.Directionality = 19)] = "Directionality"),
    (t[(t.PluralCase = 20)] = "PluralCase"),
    (t[(t.ExtraData = 21)] = "ExtraData"),
    t
  );
})(oe || {});
function V_(t) {
  return t.toLowerCase().replace(/_/g, "-");
}
var gs = "en-US";
var j_ = gs;
function B_(t) {
  typeof t == "string" && (j_ = t.toLowerCase().replace(/_/g, "-"));
}
var U_ = (t, e, r) => {};
function Fe(t, e, r, n) {
  let i = B(),
    o = Me(),
    s = Be();
  return H_(o, i, i[pe], s, t, e, n), Fe;
}
function $_(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[Jo],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function H_(t, e, r, n, i, o, s) {
  let a = Vu(n),
    u = t.firstCreatePass && lg(t),
    l = e[me],
    d = ug(e),
    f = !0;
  if (n.type & 3 || s) {
    let y = at(n, e),
      v = s ? s(y) : y,
      D = d.length,
      $ = s ? (Y) => s(yt(Y[n.index])) : n.index,
      X = null;
    if ((!s && a && (X = $_(t, e, i, n.index)), X !== null)) {
      let Y = X.__ngLastListenerFn__ || X;
      (Y.__ngNextListenerFn__ = o), (X.__ngLastListenerFn__ = o), (f = !1);
    } else {
      (o = dh(n, e, l, o)), U_(y, i, o);
      let Y = r.listen(v, i, o);
      d.push(o, Y), u && u.push(i, $, D, D + 1);
    }
  } else o = dh(n, e, l, o);
  let h = n.outputs,
    p;
  if (f && h !== null && (p = h[i])) {
    let y = p.length;
    if (y)
      for (let v = 0; v < y; v += 2) {
        let D = p[v],
          $ = p[v + 1],
          Ge = e[D][$].subscribe(o),
          ue = d.length;
        d.push(o, Ge), u && u.push(i, n.index, ue, -(ue + 1));
      }
  }
}
function lh(t, e, r, n) {
  let i = V(null);
  try {
    return pt(6, e, r), r(n) !== !1;
  } catch (o) {
    return dg(t, o), !1;
  } finally {
    pt(7, e, r), V(i);
  }
}
function dh(t, e, r, n) {
  return function i(o) {
    if (o === Function) return n;
    let s = t.componentOffset > -1 ? Zt(t.index, e) : e;
    al(s, 5);
    let a = lh(e, r, n, o),
      c = i.__ngNextListenerFn__;
    for (; c; ) (a = lh(e, r, c, o) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function Kt(t = 1) {
  return NC(t);
}
function z_(t, e) {
  let r = null,
    n = VD(t);
  for (let i = 0; i < e.length; i++) {
    let o = e[i];
    if (o === "*") {
      r = i;
      continue;
    }
    if (n === null ? Nh(t, o, !0) : UD(n, o)) return i;
  }
  return r;
}
function Rg(t) {
  let e = B()[Ve][Oe];
  if (!e.projection) {
    let r = t ? t.length : 1,
      n = (e.projection = SD(r, null)),
      i = n.slice(),
      o = e.child;
    for (; o !== null; ) {
      let s = t ? z_(o, t) : 0;
      s !== null && (i[s] ? (i[s].projectionNext = o) : (n[s] = o), (i[s] = o)),
        (o = o.next);
    }
  }
}
function Pg(t, e = 0, r, n, i, o) {
  let s = B(),
    a = Me(),
    c = n ? t + 1 : null;
  c !== null && ds(s, a, c, n, i, o, null, r);
  let u = yi(a, _e + t, 16, null, r || null);
  u.projection === null && (u.projection = e), op();
  let d = !s[gr] || np();
  s[Ve][Oe].projection[u.projection] === null && c !== null
    ? G_(s, a, c)
    : d && (u.flags & 32) !== 32 && Tw(a, s, u);
}
function G_(t, e, r) {
  let n = _e + r,
    i = e.data[n],
    o = t[n],
    s = Cr(o, i.tView.ssrId),
    a = Di(t, i, void 0, { dehydratedView: s });
  Ci(o, a, 0, Dr(i, s));
}
function Rr(t, e, r) {
  JE(t, e, r);
}
function Pn(t) {
  let e = B(),
    r = Me(),
    n = up();
  Uu(n + 1);
  let i = fl(r, n);
  if (t.dirty && hC(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = t_(e, n);
      t.reset(o, JC), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function Fn() {
  return QE(B(), up());
}
function W_(t, e, r, n) {
  r >= t.data.length && ((t.data[r] = null), (t.blueprint[r] = null)),
    (e[r] = n);
}
function H(t, e = "") {
  let r = B(),
    n = Me(),
    i = t + _e,
    o = n.firstCreatePass ? yi(n, i, 1, e, null) : n.data[i],
    s = q_(n, r, o, e, t);
  (r[i] = s), zu() && nl(n, r, s, o), vi(o, !1);
}
var q_ = (t, e, r, n, i) => (Gu(!0), gw(e[pe], n));
function ut(t) {
  return Pr("", t, ""), ut;
}
function Pr(t, e, r) {
  let n = B(),
    i = p_(n, t, e, r);
  return i !== Dt && fg(n, Yt(), i), Pr;
}
function Fs(t, e, r, n, i) {
  let o = B(),
    s = g_(o, t, e, r, n, i);
  return s !== Dt && fg(o, Yt(), s), Fs;
}
function Z_(t, e, r) {
  let n = Me();
  if (n.firstCreatePass) {
    let i = zt(t);
    bu(r, n.data, n.blueprint, i, !0), bu(e, n.data, n.blueprint, i, !1);
  }
}
function bu(t, e, r, n, i) {
  if (((t = Ee(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) bu(t[o], e, r, n, i);
  else {
    let o = Me(),
      s = B(),
      a = Be(),
      c = pr(t) ? t : Ee(t.provide),
      u = $h(t),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (pr(t) || !t.multi) {
      let h = new _n(u, i, M),
        p = xc(c, e, i ? l : l + f, d);
      p === -1
        ? ($c(is(a, s), o, c),
          Sc(o, t, e.length),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(h),
          s.push(h))
        : ((r[p] = h), (s[p] = h));
    } else {
      let h = xc(c, e, l + f, d),
        p = xc(c, e, l, l + f),
        y = h >= 0 && r[h],
        v = p >= 0 && r[p];
      if ((i && !v) || (!i && !y)) {
        $c(is(a, s), o, c);
        let D = K_(i ? Q_ : Y_, r.length, i, n, u);
        !i && v && (r[p].providerFactory = D),
          Sc(o, t, e.length, 0),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(D),
          s.push(D);
      } else {
        let D = Fg(r[i ? p : h], u, !i && n);
        Sc(o, t, h > -1 ? h : p, D);
      }
      !i && n && v && r[p].componentProviders++;
    }
  }
}
function Sc(t, e, r, n) {
  let i = pr(e),
    o = JD(e);
  if (i || o) {
    let c = (o ? Ee(e.useClass) : e).prototype.ngOnDestroy;
    if (c) {
      let u = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let l = u.indexOf(r);
        l === -1 ? u.push(r, [n, c]) : u[l + 1].push(n, c);
      } else u.push(r, c);
    }
  }
}
function Fg(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function xc(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function Y_(t, e, r, n) {
  return Iu(this.multi, []);
}
function Q_(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = bn(r, r[T], this.providerFactory.index, n);
    (o = a.slice(0, s)), Iu(i, o);
    for (let c = s; c < a.length; c++) o.push(a[c]);
  } else (o = []), Iu(i, o);
  return o;
}
function Iu(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function K_(t, e, r, n, i) {
  let o = new _n(t, r, M);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    Fg(o, i, n && !r),
    o
  );
}
function xt(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => Z_(n, i ? i(t) : t, e);
  };
}
var J_ = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = jh(!1, n.type),
          o =
            i.length > 0
              ? hl([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = E({
    token: e,
    providedIn: "environment",
    factory: () => new e(_(Ne)),
  });
  let t = e;
  return t;
})();
function Xe(t) {
  On("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(J_).getOrCreateStandaloneInjector(t));
}
function kg(t, e, r, n) {
  return X_(B(), ap(), t, e, r, n);
}
function Lg(t, e) {
  let r = t[e];
  return r === Dt ? void 0 : r;
}
function X_(t, e, r, n, i, o) {
  let s = e + r;
  return Wt(t, s, i) ? Sg(t, s + 1, o ? n.call(o, i) : n(i)) : Lg(t, s + 1);
}
function eb(t, e, r, n, i, o, s) {
  let a = e + r;
  return xg(t, a, i, o)
    ? Sg(t, a + 2, s ? n.call(s, i, o) : n(i, o))
    : Lg(t, a + 2);
}
function Vg(t, e) {
  let r = Me(),
    n,
    i = t + _e;
  r.firstCreatePass
    ? ((n = tb(e, r.pipeRegistry)),
      (r.data[i] = n),
      n.onDestroy && (r.destroyHooks ??= []).push(i, n.onDestroy))
    : (n = r.data[i]);
  let o = n.factory || (n.factory = vn(n.type, !0)),
    s,
    a = Te(M);
  try {
    let c = rs(!1),
      u = o();
    return rs(c), W_(r, B(), i, u), u;
  } finally {
    Te(a);
  }
}
function tb(t, e) {
  if (e)
    for (let r = e.length - 1; r >= 0; r--) {
      let n = e[r];
      if (t === n.name) return n;
    }
}
function jg(t, e, r, n) {
  let i = t + _e,
    o = B(),
    s = fC(o, i);
  return nb(o, i) ? eb(o, ap(), e, s.transform, r, n, s) : s.transform(r, n);
}
function nb(t, e) {
  return t[T].data[e].pure;
}
var ks = (() => {
  let e = class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "platform" }));
  let t = e;
  return t;
})();
var Bg = new C("");
function kn(t) {
  return !!t && typeof t.then == "function";
}
function Ug(t) {
  return !!t && typeof t.subscribe == "function";
}
var $g = new C(""),
  Hg = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = g($g, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (kn(s)) n.push(s);
          else if (Ug(s)) {
            let a = new Promise((c, u) => {
              s.subscribe({ complete: c, error: u });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Ls = new C("");
function rb() {
  qd(() => {
    throw new w(600, !1);
  });
}
function ib(t) {
  return t.isBoundToModule;
}
var ob = 10;
function sb(t, e, r) {
  try {
    let n = r();
    return kn(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
var Ln = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = g(Sp)),
        (this.afterRenderEffectManager = g(dl)),
        (this.zonelessEnabled = g(ul)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new j()),
        (this.afterTick = new j()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = g(Rn).hasPendingTasks.pipe(x((n) => !n))),
        (this._injector = g(Ne));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof cs;
      if (!this._injector.get(Hg).done) {
        let h = !o && Fh(n),
          p = !1;
        throw new w(405, p);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(Er).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = ib(a) ? void 0 : this._injector.get(Gt),
        u = i || a.selector,
        l = a.create(Ye.NULL, [], u, c),
        d = l.location.nativeElement,
        f = l.injector.get(Bg, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Tc(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(n) {
      if (this._runningTick) throw new w(101, !1);
      let i = V(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(n);
      } catch (o) {
        this.internalErrorHandler(o);
      } finally {
        (this._runningTick = !1), V(i), this.afterTick.next();
      }
    }
    detectChangesInAttachedViews(n) {
      let i = null;
      this._injector.destroyed ||
        (i = this._injector.get(_r, null, { optional: !0 }));
      let o = 0,
        s = this.afterRenderEffectManager;
      for (; o < ob; ) {
        let a = o === 0;
        if (n || !a) {
          this.beforeRender.next(a);
          for (let { _lView: c, notifyErrorHandler: u } of this._views)
            ab(c, u, a, this.zonelessEnabled);
        } else i?.begin?.(), i?.end?.();
        if (
          (o++,
          s.executeInternalCallbacks(),
          !this.allViews.some(({ _lView: c }) => ci(c)) &&
            (s.execute(), !this.allViews.some(({ _lView: c }) => ci(c))))
        )
          break;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      Tc(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(Ls, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => Tc(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new w(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Tc(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function ab(t, e, r, n) {
  if (!r && !ci(t)) return;
  mg(t, e, r && !n ? 0 : 1);
}
var Mu = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  pl = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new gu(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = kh(n),
          s = jp(o.declarations).reduce((a, c) => {
            let u = yn(c);
            return u && a.push(new di(u)), a;
          }, []);
        return new Mu(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var cb = (() => {
    let e = class e {
      constructor() {
        (this.zone = g(W)),
          (this.changeDetectionScheduler = g(wr)),
          (this.applicationRef = g(Ln));
      }
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    this.applicationRef.tick();
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ub = new C("", { factory: () => !1 });
function zg({ ngZoneFactory: t, ignoreChangesOutsideZone: e }) {
  return (
    (t ??= () => new W(Wg())),
    [
      { provide: W, useFactory: t },
      {
        provide: fr,
        multi: !0,
        useFactory: () => {
          let r = g(cb, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: fr,
        multi: !0,
        useFactory: () => {
          let r = g(db);
          return () => {
            r.initialize();
          };
        },
      },
      { provide: Sp, useFactory: lb },
      e === !0 ? { provide: Cg, useValue: !0 } : [],
    ]
  );
}
function lb() {
  let t = g(W),
    e = g(st);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function Gg(t) {
  let e = t?.ignoreChangesOutsideZone,
    r = zg({
      ngZoneFactory: () => {
        let n = Wg(t);
        return (
          n.shouldCoalesceEventChangeDetection && On("NgZone_CoalesceEvent"),
          new W(n)
        );
      },
      ignoreChangesOutsideZone: e,
    });
  return Ir([{ provide: ub, useValue: !0 }, { provide: ul, useValue: !1 }, r]);
}
function Wg(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var db = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new ee()),
        (this.initialized = !1),
        (this.zone = g(W)),
        (this.pendingTasks = g(Rn));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              W.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            W.assertInAngularZone(), (n ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var fb = (() => {
  let e = class e {
    constructor() {
      (this.appRef = g(Ln)),
        (this.taskService = g(Rn)),
        (this.ngZone = g(W)),
        (this.zonelessEnabled = g(ul)),
        (this.disableScheduling = g(Cg, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new ee()),
        (this.cancelScheduledCallback = null),
        (this.shouldRefreshViews = !1),
        (this.useMicrotaskScheduler = !1),
        (this.runningTick = !1),
        (this.pendingRenderTaskId = null),
        this.subscriptions.add(
          this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof nu || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      switch (n) {
        case 3:
        case 2:
        case 0:
        case 4:
        case 5:
        case 1: {
          this.shouldRefreshViews = !0;
          break;
        }
        case 8:
        case 7:
        case 6:
        case 9:
        default:
      }
      if (!this.shouldScheduleTick()) return;
      let i = this.useMicrotaskScheduler ? Jf : wg;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.zoneIsDefined
          ? Zone.root.run(() => {
              this.cancelScheduledCallback = i(() => {
                this.tick(this.shouldRefreshViews);
              });
            })
          : (this.cancelScheduledCallback = i(() => {
              this.tick(this.shouldRefreshViews);
            }));
    }
    shouldScheduleTick() {
      return !(
        this.disableScheduling ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled && this.zoneIsDefined && W.isInAngularZone())
      );
    }
    tick(n) {
      if (this.runningTick || this.appRef.destroyed) return;
      let i = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick(n);
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (o) {
        throw (this.taskService.remove(i), o);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        Jf(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(i);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.shouldRefreshViews = !1),
        (this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function hb() {
  return (typeof $localize < "u" && $localize.locale) || gs;
}
var Vs = new C("", {
  providedIn: "root",
  factory: () => g(Vs, F.Optional | F.SkipSelf) || hb(),
});
var qg = new C("");
var qo = null;
function pb(t = [], e) {
  return Ye.create({
    name: e,
    providers: [
      { provide: Cs, useValue: "platform" },
      { provide: qg, useValue: new Set([() => (qo = null)]) },
      ...t,
    ],
  });
}
function gb(t = []) {
  if (qo) return qo;
  let e = pb(t);
  return (qo = e), rb(), mb(e), e;
}
function mb(t) {
  t.get(Yu, null)?.forEach((r) => r());
}
var Ct = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = vb;
  let t = e;
  return t;
})();
function vb(t) {
  return yb(Be(), B(), (t & 16) === 16);
}
function yb(t, e, r) {
  if (Es(t) && !r) {
    let n = Zt(t.index, e);
    return new Mn(n, n);
  } else if (t.type & 47) {
    let n = e[Ve];
    return new Mn(n, e);
  }
  return null;
}
var Su = class {
    constructor() {}
    supports(e) {
      return Mg(e);
    }
    create(e) {
      return new xu(e);
    }
  },
  Db = (t, e) => e,
  xu = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || Db);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        o = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < fh(n, i, o)) ? r : n,
          a = fh(s, i, o),
          c = s.currentIndex;
        if (s === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let u = a - i,
            l = c - i;
          if (u != l) {
            for (let f = 0; f < u; f++) {
              let h = f < o.length ? o[f] : (o[f] = 0),
                p = h + f;
              l <= p && p < u && (o[f] = h + 1);
            }
            let d = s.previousIndex;
            o[d] = l - u;
          }
        }
        a !== c && e(s, a, c);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !Mg(e))) throw new w(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, o, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, o, s, a)),
                Object.is(r.item, o) || this._addIdentityChange(r, o)),
            (r = r._next);
      } else
        (i = 0),
          c_(e, (a) => {
            (s = this._trackByFn(i, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, i)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Tu(r, n), o, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new ms()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new ms()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Tu = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Au = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  ms = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new Au()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function fh(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
function hh() {
  return new js([new Su()]);
}
var js = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || hh()),
        deps: [[e, new Ih(), new gi()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i != null) return i;
      throw new w(901, !1);
    }
  };
  e.ɵprov = E({ token: e, providedIn: "root", factory: hh });
  let t = e;
  return t;
})();
function Zg(t) {
  try {
    let { rootComponent: e, appProviders: r, platformProviders: n } = t,
      i = gb(n),
      o = [zg({}), { provide: wr, useExisting: fb }, ...(r || [])],
      a = new ls({
        providers: o,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get(W);
    return c.run(() => {
      a.resolveInjectorInitializers();
      let u = a.get(st, null),
        l;
      c.runOutsideAngular(() => {
        l = c.onError.subscribe({
          next: (h) => {
            u.handleError(h);
          },
        });
      });
      let d = () => a.destroy(),
        f = i.get(qg);
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d);
        }),
        sb(u, c, () => {
          let h = a.get(Hg);
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let p = a.get(Vs, gs);
              B_(p || gs);
              let y = a.get(Ln);
              return e !== void 0 && y.bootstrap(e), y;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
function wi(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
var Xg = null;
function Nt() {
  return Xg;
}
function em(t) {
  Xg ??= t;
}
var Zs = class {};
var le = new C(""),
  tm = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: () => g(wb), providedIn: "platform" }));
    let t = e;
    return t;
  })();
var wb = (() => {
  let e = class e extends tm {
    constructor() {
      super(),
        (this._doc = g(le)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return Nt().getBaseHref(this._doc);
    }
    onPopState(n) {
      let i = Nt().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("popstate", n, !1),
        () => i.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let i = Nt().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("hashchange", n, !1),
        () => i.removeEventListener("hashchange", n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, i, o) {
      this._history.pushState(n, i, o);
    }
    replaceState(n, i, o) {
      this._history.replaceState(n, i, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = E({ token: e, factory: () => new e(), providedIn: "platform" }));
  let t = e;
  return t;
})();
function nm(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function Yg(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function Vn(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var Qs = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: () => g(rm), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Eb = new C(""),
  rm = (() => {
    let e = class e extends Qs {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            g(le).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return nm(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + Vn(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Vn(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Vn(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(tm), _(Eb, 8));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var Ei = (() => {
  let e = class e {
    constructor(n) {
      (this._subject = new re()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = Ib(Yg(Qg(i)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: o.state,
            type: o.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, i = "") {
      return this.path() == this.normalize(n + Vn(i));
    }
    normalize(n) {
      return e.stripTrailingSlash(bb(this._basePath, Qg(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, i = "", o = null) {
      this._locationStrategy.pushState(o, "", n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Vn(i)), o);
    }
    replaceState(n, i = "", o = null) {
      this._locationStrategy.replaceState(o, "", n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Vn(i)), o);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        (this._urlChangeSubscription ??= this.subscribe((i) => {
          this._notifyUrlChangeListeners(i.url, i.state);
        })),
        () => {
          let i = this._urlChangeListeners.indexOf(n);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(n = "", i) {
      this._urlChangeListeners.forEach((o) => o(n, i));
    }
    subscribe(n, i, o) {
      return this._subject.subscribe({ next: n, error: i, complete: o });
    }
  };
  (e.normalizeQueryParams = Vn),
    (e.joinWithSlash = nm),
    (e.stripTrailingSlash = Yg),
    (e.ɵfac = function (i) {
      return new (i || e)(_(Qs));
    }),
    (e.ɵprov = E({ token: e, factory: () => _b(), providedIn: "root" }));
  let t = e;
  return t;
})();
function _b() {
  return new Ei(_(Qs));
}
function bb(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function Qg(t) {
  return t.replace(/\/index.html$/, "");
}
function Ib(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
var Se = (function (t) {
    return (
      (t[(t.Format = 0)] = "Format"), (t[(t.Standalone = 1)] = "Standalone"), t
    );
  })(Se || {}),
  J = (function (t) {
    return (
      (t[(t.Narrow = 0)] = "Narrow"),
      (t[(t.Abbreviated = 1)] = "Abbreviated"),
      (t[(t.Wide = 2)] = "Wide"),
      (t[(t.Short = 3)] = "Short"),
      t
    );
  })(J || {}),
  $e = (function (t) {
    return (
      (t[(t.Short = 0)] = "Short"),
      (t[(t.Medium = 1)] = "Medium"),
      (t[(t.Long = 2)] = "Long"),
      (t[(t.Full = 3)] = "Full"),
      t
    );
  })($e || {}),
  Jt = {
    Decimal: 0,
    Group: 1,
    List: 2,
    PercentSign: 3,
    PlusSign: 4,
    MinusSign: 5,
    Exponential: 6,
    SuperscriptingExponent: 7,
    PerMille: 8,
    Infinity: 9,
    NaN: 10,
    TimeSeparator: 11,
    CurrencyDecimal: 12,
    CurrencyGroup: 13,
  };
function Mb(t) {
  return Je(t)[oe.LocaleId];
}
function Sb(t, e, r) {
  let n = Je(t),
    i = [n[oe.DayPeriodsFormat], n[oe.DayPeriodsStandalone]],
    o = et(i, e);
  return et(o, r);
}
function xb(t, e, r) {
  let n = Je(t),
    i = [n[oe.DaysFormat], n[oe.DaysStandalone]],
    o = et(i, e);
  return et(o, r);
}
function Tb(t, e, r) {
  let n = Je(t),
    i = [n[oe.MonthsFormat], n[oe.MonthsStandalone]],
    o = et(i, e);
  return et(o, r);
}
function Ab(t, e) {
  let n = Je(t)[oe.Eras];
  return et(n, e);
}
function Bs(t, e) {
  let r = Je(t);
  return et(r[oe.DateFormat], e);
}
function Us(t, e) {
  let r = Je(t);
  return et(r[oe.TimeFormat], e);
}
function $s(t, e) {
  let n = Je(t)[oe.DateTimeFormat];
  return et(n, e);
}
function Ks(t, e) {
  let r = Je(t),
    n = r[oe.NumberSymbols][e];
  if (typeof n > "u") {
    if (e === Jt.CurrencyDecimal) return r[oe.NumberSymbols][Jt.Decimal];
    if (e === Jt.CurrencyGroup) return r[oe.NumberSymbols][Jt.Group];
  }
  return n;
}
function im(t) {
  if (!t[oe.ExtraData])
    throw new Error(
      `Missing extra locale data for the locale "${t[oe.LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`,
    );
}
function Nb(t) {
  let e = Je(t);
  return (
    im(e),
    (e[oe.ExtraData][2] || []).map((n) =>
      typeof n == "string" ? ml(n) : [ml(n[0]), ml(n[1])],
    )
  );
}
function Ob(t, e, r) {
  let n = Je(t);
  im(n);
  let i = [n[oe.ExtraData][0], n[oe.ExtraData][1]],
    o = et(i, e) || [];
  return et(o, r) || [];
}
function et(t, e) {
  for (let r = e; r > -1; r--) if (typeof t[r] < "u") return t[r];
  throw new Error("Locale data API: locale data undefined");
}
function ml(t) {
  let [e, r] = t.split(":");
  return { hours: +e, minutes: +r };
}
var Rb =
    /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
  Hs = {},
  Pb =
    /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/,
  At = (function (t) {
    return (
      (t[(t.Short = 0)] = "Short"),
      (t[(t.ShortGMT = 1)] = "ShortGMT"),
      (t[(t.Long = 2)] = "Long"),
      (t[(t.Extended = 3)] = "Extended"),
      t
    );
  })(At || {}),
  G = (function (t) {
    return (
      (t[(t.FullYear = 0)] = "FullYear"),
      (t[(t.Month = 1)] = "Month"),
      (t[(t.Date = 2)] = "Date"),
      (t[(t.Hours = 3)] = "Hours"),
      (t[(t.Minutes = 4)] = "Minutes"),
      (t[(t.Seconds = 5)] = "Seconds"),
      (t[(t.FractionalSeconds = 6)] = "FractionalSeconds"),
      (t[(t.Day = 7)] = "Day"),
      t
    );
  })(G || {}),
  z = (function (t) {
    return (
      (t[(t.DayPeriods = 0)] = "DayPeriods"),
      (t[(t.Days = 1)] = "Days"),
      (t[(t.Months = 2)] = "Months"),
      (t[(t.Eras = 3)] = "Eras"),
      t
    );
  })(z || {});
function Fb(t, e, r, n) {
  let i = zb(t);
  e = Tt(r, e) || e;
  let s = [],
    a;
  for (; e; )
    if (((a = Pb.exec(e)), a)) {
      s = s.concat(a.slice(1));
      let l = s.pop();
      if (!l) break;
      e = l;
    } else {
      s.push(e);
      break;
    }
  let c = i.getTimezoneOffset();
  n && ((c = sm(n, c)), (i = Hb(i, n, !0)));
  let u = "";
  return (
    s.forEach((l) => {
      let d = Ub(l);
      u += d
        ? d(i, r, c)
        : l === "''"
          ? "'"
          : l.replace(/(^'|'$)/g, "").replace(/''/g, "'");
    }),
    u
  );
}
function Ys(t, e, r) {
  let n = new Date(0);
  return n.setFullYear(t, e, r), n.setHours(0, 0, 0), n;
}
function Tt(t, e) {
  let r = Mb(t);
  if (((Hs[r] ??= {}), Hs[r][e])) return Hs[r][e];
  let n = "";
  switch (e) {
    case "shortDate":
      n = Bs(t, $e.Short);
      break;
    case "mediumDate":
      n = Bs(t, $e.Medium);
      break;
    case "longDate":
      n = Bs(t, $e.Long);
      break;
    case "fullDate":
      n = Bs(t, $e.Full);
      break;
    case "shortTime":
      n = Us(t, $e.Short);
      break;
    case "mediumTime":
      n = Us(t, $e.Medium);
      break;
    case "longTime":
      n = Us(t, $e.Long);
      break;
    case "fullTime":
      n = Us(t, $e.Full);
      break;
    case "short":
      let i = Tt(t, "shortTime"),
        o = Tt(t, "shortDate");
      n = zs($s(t, $e.Short), [i, o]);
      break;
    case "medium":
      let s = Tt(t, "mediumTime"),
        a = Tt(t, "mediumDate");
      n = zs($s(t, $e.Medium), [s, a]);
      break;
    case "long":
      let c = Tt(t, "longTime"),
        u = Tt(t, "longDate");
      n = zs($s(t, $e.Long), [c, u]);
      break;
    case "full":
      let l = Tt(t, "fullTime"),
        d = Tt(t, "fullDate");
      n = zs($s(t, $e.Full), [l, d]);
      break;
  }
  return n && (Hs[r][e] = n), n;
}
function zs(t, e) {
  return (
    e &&
      (t = t.replace(/\{([^}]+)}/g, function (r, n) {
        return e != null && n in e ? e[n] : r;
      })),
    t
  );
}
function lt(t, e, r = "-", n, i) {
  let o = "";
  (t < 0 || (i && t <= 0)) && (i ? (t = -t + 1) : ((t = -t), (o = r)));
  let s = String(t);
  for (; s.length < e; ) s = "0" + s;
  return n && (s = s.slice(s.length - e)), o + s;
}
function kb(t, e) {
  return lt(t, 3).substring(0, e);
}
function ce(t, e, r = 0, n = !1, i = !1) {
  return function (o, s) {
    let a = Lb(t, o);
    if (((r > 0 || a > -r) && (a += r), t === G.Hours))
      a === 0 && r === -12 && (a = 12);
    else if (t === G.FractionalSeconds) return kb(a, e);
    let c = Ks(s, Jt.MinusSign);
    return lt(a, e, c, n, i);
  };
}
function Lb(t, e) {
  switch (t) {
    case G.FullYear:
      return e.getFullYear();
    case G.Month:
      return e.getMonth();
    case G.Date:
      return e.getDate();
    case G.Hours:
      return e.getHours();
    case G.Minutes:
      return e.getMinutes();
    case G.Seconds:
      return e.getSeconds();
    case G.FractionalSeconds:
      return e.getMilliseconds();
    case G.Day:
      return e.getDay();
    default:
      throw new Error(`Unknown DateType value "${t}".`);
  }
}
function te(t, e, r = Se.Format, n = !1) {
  return function (i, o) {
    return Vb(i, o, t, e, r, n);
  };
}
function Vb(t, e, r, n, i, o) {
  switch (r) {
    case z.Months:
      return Tb(e, i, n)[t.getMonth()];
    case z.Days:
      return xb(e, i, n)[t.getDay()];
    case z.DayPeriods:
      let s = t.getHours(),
        a = t.getMinutes();
      if (o) {
        let u = Nb(e),
          l = Ob(e, i, n),
          d = u.findIndex((f) => {
            if (Array.isArray(f)) {
              let [h, p] = f,
                y = s >= h.hours && a >= h.minutes,
                v = s < p.hours || (s === p.hours && a < p.minutes);
              if (h.hours < p.hours) {
                if (y && v) return !0;
              } else if (y || v) return !0;
            } else if (f.hours === s && f.minutes === a) return !0;
            return !1;
          });
        if (d !== -1) return l[d];
      }
      return Sb(e, i, n)[s < 12 ? 0 : 1];
    case z.Eras:
      return Ab(e, n)[t.getFullYear() <= 0 ? 0 : 1];
    default:
      let c = r;
      throw new Error(`unexpected translation type ${c}`);
  }
}
function Gs(t) {
  return function (e, r, n) {
    let i = -1 * n,
      o = Ks(r, Jt.MinusSign),
      s = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
    switch (t) {
      case At.Short:
        return (i >= 0 ? "+" : "") + lt(s, 2, o) + lt(Math.abs(i % 60), 2, o);
      case At.ShortGMT:
        return "GMT" + (i >= 0 ? "+" : "") + lt(s, 1, o);
      case At.Long:
        return (
          "GMT" +
          (i >= 0 ? "+" : "") +
          lt(s, 2, o) +
          ":" +
          lt(Math.abs(i % 60), 2, o)
        );
      case At.Extended:
        return n === 0
          ? "Z"
          : (i >= 0 ? "+" : "") +
              lt(s, 2, o) +
              ":" +
              lt(Math.abs(i % 60), 2, o);
      default:
        throw new Error(`Unknown zone width "${t}"`);
    }
  };
}
var jb = 0,
  qs = 4;
function Bb(t) {
  let e = Ys(t, jb, 1).getDay();
  return Ys(t, 0, 1 + (e <= qs ? qs : qs + 7) - e);
}
function om(t) {
  let e = t.getDay(),
    r = e === 0 ? -3 : qs - e;
  return Ys(t.getFullYear(), t.getMonth(), t.getDate() + r);
}
function vl(t, e = !1) {
  return function (r, n) {
    let i;
    if (e) {
      let o = new Date(r.getFullYear(), r.getMonth(), 1).getDay() - 1,
        s = r.getDate();
      i = 1 + Math.floor((s + o) / 7);
    } else {
      let o = om(r),
        s = Bb(o.getFullYear()),
        a = o.getTime() - s.getTime();
      i = 1 + Math.round(a / 6048e5);
    }
    return lt(i, t, Ks(n, Jt.MinusSign));
  };
}
function Ws(t, e = !1) {
  return function (r, n) {
    let o = om(r).getFullYear();
    return lt(o, t, Ks(n, Jt.MinusSign), e);
  };
}
var yl = {};
function Ub(t) {
  if (yl[t]) return yl[t];
  let e;
  switch (t) {
    case "G":
    case "GG":
    case "GGG":
      e = te(z.Eras, J.Abbreviated);
      break;
    case "GGGG":
      e = te(z.Eras, J.Wide);
      break;
    case "GGGGG":
      e = te(z.Eras, J.Narrow);
      break;
    case "y":
      e = ce(G.FullYear, 1, 0, !1, !0);
      break;
    case "yy":
      e = ce(G.FullYear, 2, 0, !0, !0);
      break;
    case "yyy":
      e = ce(G.FullYear, 3, 0, !1, !0);
      break;
    case "yyyy":
      e = ce(G.FullYear, 4, 0, !1, !0);
      break;
    case "Y":
      e = Ws(1);
      break;
    case "YY":
      e = Ws(2, !0);
      break;
    case "YYY":
      e = Ws(3);
      break;
    case "YYYY":
      e = Ws(4);
      break;
    case "M":
    case "L":
      e = ce(G.Month, 1, 1);
      break;
    case "MM":
    case "LL":
      e = ce(G.Month, 2, 1);
      break;
    case "MMM":
      e = te(z.Months, J.Abbreviated);
      break;
    case "MMMM":
      e = te(z.Months, J.Wide);
      break;
    case "MMMMM":
      e = te(z.Months, J.Narrow);
      break;
    case "LLL":
      e = te(z.Months, J.Abbreviated, Se.Standalone);
      break;
    case "LLLL":
      e = te(z.Months, J.Wide, Se.Standalone);
      break;
    case "LLLLL":
      e = te(z.Months, J.Narrow, Se.Standalone);
      break;
    case "w":
      e = vl(1);
      break;
    case "ww":
      e = vl(2);
      break;
    case "W":
      e = vl(1, !0);
      break;
    case "d":
      e = ce(G.Date, 1);
      break;
    case "dd":
      e = ce(G.Date, 2);
      break;
    case "c":
    case "cc":
      e = ce(G.Day, 1);
      break;
    case "ccc":
      e = te(z.Days, J.Abbreviated, Se.Standalone);
      break;
    case "cccc":
      e = te(z.Days, J.Wide, Se.Standalone);
      break;
    case "ccccc":
      e = te(z.Days, J.Narrow, Se.Standalone);
      break;
    case "cccccc":
      e = te(z.Days, J.Short, Se.Standalone);
      break;
    case "E":
    case "EE":
    case "EEE":
      e = te(z.Days, J.Abbreviated);
      break;
    case "EEEE":
      e = te(z.Days, J.Wide);
      break;
    case "EEEEE":
      e = te(z.Days, J.Narrow);
      break;
    case "EEEEEE":
      e = te(z.Days, J.Short);
      break;
    case "a":
    case "aa":
    case "aaa":
      e = te(z.DayPeriods, J.Abbreviated);
      break;
    case "aaaa":
      e = te(z.DayPeriods, J.Wide);
      break;
    case "aaaaa":
      e = te(z.DayPeriods, J.Narrow);
      break;
    case "b":
    case "bb":
    case "bbb":
      e = te(z.DayPeriods, J.Abbreviated, Se.Standalone, !0);
      break;
    case "bbbb":
      e = te(z.DayPeriods, J.Wide, Se.Standalone, !0);
      break;
    case "bbbbb":
      e = te(z.DayPeriods, J.Narrow, Se.Standalone, !0);
      break;
    case "B":
    case "BB":
    case "BBB":
      e = te(z.DayPeriods, J.Abbreviated, Se.Format, !0);
      break;
    case "BBBB":
      e = te(z.DayPeriods, J.Wide, Se.Format, !0);
      break;
    case "BBBBB":
      e = te(z.DayPeriods, J.Narrow, Se.Format, !0);
      break;
    case "h":
      e = ce(G.Hours, 1, -12);
      break;
    case "hh":
      e = ce(G.Hours, 2, -12);
      break;
    case "H":
      e = ce(G.Hours, 1);
      break;
    case "HH":
      e = ce(G.Hours, 2);
      break;
    case "m":
      e = ce(G.Minutes, 1);
      break;
    case "mm":
      e = ce(G.Minutes, 2);
      break;
    case "s":
      e = ce(G.Seconds, 1);
      break;
    case "ss":
      e = ce(G.Seconds, 2);
      break;
    case "S":
      e = ce(G.FractionalSeconds, 1);
      break;
    case "SS":
      e = ce(G.FractionalSeconds, 2);
      break;
    case "SSS":
      e = ce(G.FractionalSeconds, 3);
      break;
    case "Z":
    case "ZZ":
    case "ZZZ":
      e = Gs(At.Short);
      break;
    case "ZZZZZ":
      e = Gs(At.Extended);
      break;
    case "O":
    case "OO":
    case "OOO":
    case "z":
    case "zz":
    case "zzz":
      e = Gs(At.ShortGMT);
      break;
    case "OOOO":
    case "ZZZZ":
    case "zzzz":
      e = Gs(At.Long);
      break;
    default:
      return null;
  }
  return (yl[t] = e), e;
}
function sm(t, e) {
  t = t.replace(/:/g, "");
  let r = Date.parse("Jan 01, 1970 00:00:00 " + t) / 6e4;
  return isNaN(r) ? e : r;
}
function $b(t, e) {
  return (t = new Date(t.getTime())), t.setMinutes(t.getMinutes() + e), t;
}
function Hb(t, e, r) {
  let n = r ? -1 : 1,
    i = t.getTimezoneOffset(),
    o = sm(e, i);
  return $b(t, n * (o - i));
}
function zb(t) {
  if (Kg(t)) return t;
  if (typeof t == "number" && !isNaN(t)) return new Date(t);
  if (typeof t == "string") {
    if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
      let [i, o = 1, s = 1] = t.split("-").map((a) => +a);
      return Ys(i, o - 1, s);
    }
    let r = parseFloat(t);
    if (!isNaN(t - r)) return new Date(r);
    let n;
    if ((n = t.match(Rb))) return Gb(n);
  }
  let e = new Date(t);
  if (!Kg(e)) throw new Error(`Unable to convert "${t}" into a date`);
  return e;
}
function Gb(t) {
  let e = new Date(0),
    r = 0,
    n = 0,
    i = t[8] ? e.setUTCFullYear : e.setFullYear,
    o = t[8] ? e.setUTCHours : e.setHours;
  t[9] && ((r = Number(t[9] + t[10])), (n = Number(t[9] + t[11]))),
    i.call(e, Number(t[1]), Number(t[2]) - 1, Number(t[3]));
  let s = Number(t[4] || 0) - r,
    a = Number(t[5] || 0) - n,
    c = Number(t[6] || 0),
    u = Math.floor(parseFloat("0." + (t[7] || 0)) * 1e3);
  return o.call(e, s, a, c, u), e;
}
function Kg(t) {
  return t instanceof Date && !isNaN(t.valueOf());
}
function Js(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Dl = /\s+/,
  Jg = [],
  am = (() => {
    let e = class e {
      constructor(n, i) {
        (this._ngEl = n),
          (this._renderer = i),
          (this.initialClasses = Jg),
          (this.stateMap = new Map());
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(Dl) : Jg;
      }
      set ngClass(n) {
        this.rawClass = typeof n == "string" ? n.trim().split(Dl) : n;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set)
          for (let i of n) this._updateState(i, !0);
        else if (n != null)
          for (let i of Object.keys(n)) this._updateState(i, !!n[i]);
        this._applyStateDiff();
      }
      _updateState(n, i) {
        let o = this.stateMap.get(n);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(n, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let i = n[0],
            o = n[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(n, i) {
        (n = n.trim()),
          n.length > 0 &&
            n.split(Dl).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(ae), M(Nn));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [0, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function Wb(t, e) {
  return new w(2100, !1);
}
var qb = "mediumDate",
  Zb = new C(""),
  Yb = new C(""),
  cm = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.locale = n),
          (this.defaultTimezone = i),
          (this.defaultOptions = o);
      }
      transform(n, i, o, s) {
        if (n == null || n === "" || n !== n) return null;
        try {
          let a = i ?? this.defaultOptions?.dateFormat ?? qb,
            c =
              o ??
              this.defaultOptions?.timezone ??
              this.defaultTimezone ??
              void 0;
          return Fb(n, a, s || this.locale, c);
        } catch (a) {
          throw Wb(e, a.message);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(Vs, 16), M(Zb, 24), M(Yb, 24));
    }),
      (e.ɵpipe = Oh({ name: "date", type: e, pure: !0, standalone: !0 }));
    let t = e;
    return t;
  })();
var wl = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = be({}));
    let t = e;
    return t;
  })(),
  El = "browser",
  Qb = "server";
function um(t) {
  return t === El;
}
function Xs(t) {
  return t === Qb;
}
var Fr = class {};
var bi = class {},
  ta = class {},
  Ot = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`,
                    )
                    .forEach((r) => {
                      let n = r.indexOf(":");
                      if (n > 0) {
                        let i = r.slice(0, n),
                          o = i.toLowerCase(),
                          s = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && e instanceof Headers
              ? ((this.headers = new Map()),
                e.forEach((r, n) => {
                  this.setHeaderEntries(n, r);
                }))
              : (this.lazyInit = () => {
                  (this.headers = new Map()),
                    Object.entries(e).forEach(([r, n]) => {
                      this.setHeaderEntries(r, n);
                    });
                })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let r = this.headers.get(e.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, r) {
      return this.clone({ name: e, value: r, op: "a" });
    }
    set(e, r) {
      return this.clone({ name: e, value: r, op: "s" });
    }
    delete(e, r) {
      return this.clone({ name: e, value: r, op: "d" });
    }
    maybeSetNormalizedName(e, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((r) => {
          this.headers.set(r, e.headers.get(r)),
            this.normalizedNames.set(r, e.normalizedNames.get(r));
        });
    }
    clone(e) {
      let r = new t();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        r
      );
    }
    applyUpdate(e) {
      let r = e.name.toLowerCase();
      switch (e.op) {
        case "a":
        case "s":
          let n = e.value;
          if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(e.name, r);
          let i = (e.op === "a" ? this.headers.get(r) : void 0) || [];
          i.push(...n), this.headers.set(r, i);
          break;
        case "d":
          let o = e.value;
          if (!o) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let s = this.headers.get(r);
            if (!s) return;
            (s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s);
          }
          break;
      }
    }
    setHeaderEntries(e, r) {
      let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
        i = e.toLowerCase();
      this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          e(this.normalizedNames.get(r), this.headers.get(r)),
        );
    }
  };
var bl = class {
  encodeKey(e) {
    return dm(e);
  }
  encodeValue(e) {
    return dm(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function Kb(t, e) {
  let r = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let o = i.indexOf("="),
            [s, a] =
              o == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, o)), e.decodeValue(i.slice(o + 1))],
            c = r.get(s) || [];
          c.push(a), r.set(s, c);
        }),
    r
  );
}
var Jb = /%(\d[a-f0-9])/gi,
  Xb = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function dm(t) {
  return encodeURIComponent(t).replace(Jb, (e, r) => Xb[r] ?? e);
}
function ea(t) {
  return `${t}`;
}
var en = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new bl()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = Kb(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((r) => {
            let n = e.fromObject[r],
              i = Array.isArray(n) ? n.map(ea) : [ea(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let r = this.map.get(e);
    return r ? r[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, r) {
    return this.clone({ param: e, value: r, op: "a" });
  }
  appendAll(e) {
    let r = [];
    return (
      Object.keys(e).forEach((n) => {
        let i = e[n];
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: "a" });
            })
          : r.push({ param: n, value: i, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(e, r) {
    return this.clone({ param: e, value: r, op: "s" });
  }
  delete(e, r) {
    return this.clone({ param: e, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let r = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let r = new t({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(e)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let r = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              r.push(ea(e.value)), this.map.set(e.param, r);
              break;
            case "d":
              if (e.value !== void 0) {
                let n = this.map.get(e.param) || [],
                  i = n.indexOf(ea(e.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(e.param, n)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Il = class {
  constructor() {
    this.map = new Map();
  }
  set(e, r) {
    return this.map.set(e, r), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function eI(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function fm(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function hm(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function pm(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function tI(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var _i = class t {
    constructor(e, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let o;
      if (
        (eI(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new Ot()),
        (this.context ??= new Il()),
        !this.params)
      )
        (this.params = new en()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            c = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
            fm(this.body) ||
            hm(this.body) ||
            pm(this.body) ||
            tI(this.body)
          ? this.body
          : this.body instanceof en
            ? this.body.toString()
            : typeof this.body == "object" ||
                typeof this.body == "boolean" ||
                Array.isArray(this.body)
              ? JSON.stringify(this.body)
              : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || pm(this.body)
        ? null
        : hm(this.body)
          ? this.body.type || null
          : fm(this.body)
            ? null
            : typeof this.body == "string"
              ? "text/plain"
              : this.body instanceof en
                ? "application/x-www-form-urlencoded;charset=UTF-8"
                : typeof this.body == "object" ||
                    typeof this.body == "number" ||
                    typeof this.body == "boolean"
                  ? "application/json"
                  : null;
    }
    clone(e = {}) {
      let r = e.method || this.method,
        n = e.url || this.url,
        i = e.responseType || this.responseType,
        o = e.transferCache ?? this.transferCache,
        s = e.body !== void 0 ? e.body : this.body,
        a = e.withCredentials ?? this.withCredentials,
        c = e.reportProgress ?? this.reportProgress,
        u = e.headers || this.headers,
        l = e.params || this.params,
        d = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (u = Object.keys(e.setHeaders).reduce(
            (f, h) => f.set(h, e.setHeaders[h]),
            u,
          )),
        e.setParams &&
          (l = Object.keys(e.setParams).reduce(
            (f, h) => f.set(h, e.setParams[h]),
            l,
          )),
        new t(r, n, s, {
          params: l,
          headers: u,
          context: d,
          reportProgress: c,
          responseType: i,
          withCredentials: a,
          transferCache: o,
        })
      );
    }
  },
  tn = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(tn || {}),
  Ii = class {
    constructor(e, r = 200, n = "OK") {
      (this.headers = e.headers || new Ot()),
        (this.status = e.status !== void 0 ? e.status : r),
        (this.statusText = e.statusText || n),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  na = class t extends Ii {
    constructor(e = {}) {
      super(e), (this.type = tn.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  Mi = class t extends Ii {
    constructor(e = {}) {
      super(e),
        (this.type = tn.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  Xt = class extends Ii {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${e.url || "(unknown url)"}`)
          : (this.message = `Http failure response for ${e.url || "(unknown url)"}: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  ym = 200,
  nI = 204;
function _l(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var xl = (() => {
    let e = class e {
      constructor(n) {
        this.handler = n;
      }
      request(n, i, o = {}) {
        let s;
        if (n instanceof _i) s = n;
        else {
          let u;
          o.headers instanceof Ot ? (u = o.headers) : (u = new Ot(o.headers));
          let l;
          o.params &&
            (o.params instanceof en
              ? (l = o.params)
              : (l = new en({ fromObject: o.params }))),
            (s = new _i(n, i, o.body !== void 0 ? o.body : null, {
              headers: u,
              context: o.context,
              params: l,
              reportProgress: o.reportProgress,
              responseType: o.responseType || "json",
              withCredentials: o.withCredentials,
              transferCache: o.transferCache,
            }));
        }
        let a = I(s).pipe(jt((u) => this.handler.handle(u)));
        if (n instanceof _i || o.observe === "events") return a;
        let c = a.pipe(Ce((u) => u instanceof Mi));
        switch (o.observe || "body") {
          case "body":
            switch (s.responseType) {
              case "arraybuffer":
                return c.pipe(
                  x((u) => {
                    if (u.body !== null && !(u.body instanceof ArrayBuffer))
                      throw new Error("Response is not an ArrayBuffer.");
                    return u.body;
                  }),
                );
              case "blob":
                return c.pipe(
                  x((u) => {
                    if (u.body !== null && !(u.body instanceof Blob))
                      throw new Error("Response is not a Blob.");
                    return u.body;
                  }),
                );
              case "text":
                return c.pipe(
                  x((u) => {
                    if (u.body !== null && typeof u.body != "string")
                      throw new Error("Response is not a string.");
                    return u.body;
                  }),
                );
              case "json":
              default:
                return c.pipe(x((u) => u.body));
            }
          case "response":
            return c;
          default:
            throw new Error(
              `Unreachable: unhandled observe type ${o.observe}}`,
            );
        }
      }
      delete(n, i = {}) {
        return this.request("DELETE", n, i);
      }
      get(n, i = {}) {
        return this.request("GET", n, i);
      }
      head(n, i = {}) {
        return this.request("HEAD", n, i);
      }
      jsonp(n, i) {
        return this.request("JSONP", n, {
          params: new en().append(i, "JSONP_CALLBACK"),
          observe: "body",
          responseType: "json",
        });
      }
      options(n, i = {}) {
        return this.request("OPTIONS", n, i);
      }
      patch(n, i, o = {}) {
        return this.request("PATCH", n, _l(o, i));
      }
      post(n, i, o = {}) {
        return this.request("POST", n, _l(o, i));
      }
      put(n, i, o = {}) {
        return this.request("PUT", n, _l(o, i));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(bi));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  rI = /^\)\]\}',?\n/,
  iI = "X-Request-URL";
function gm(t) {
  if (t.url) return t.url;
  let e = iI.toLocaleLowerCase();
  return t.headers.get(e);
}
var oI = (() => {
    let e = class e {
      constructor() {
        (this.fetchImpl =
          g(Ml, { optional: !0 })?.fetch ?? fetch.bind(globalThis)),
          (this.ngZone = g(W));
      }
      handle(n) {
        return new N((i) => {
          let o = new AbortController();
          return (
            this.doRequest(n, o.signal, i).then(Sl, (s) =>
              i.error(new Xt({ error: s })),
            ),
            () => o.abort()
          );
        });
      }
      doRequest(n, i, o) {
        return io(this, null, function* () {
          let s = this.createRequestInit(n),
            a;
          try {
            let p = this.fetchImpl(n.urlWithParams, m({ signal: i }, s));
            sI(p), o.next({ type: tn.Sent }), (a = yield p);
          } catch (p) {
            o.error(
              new Xt({
                error: p,
                status: p.status ?? 0,
                statusText: p.statusText,
                url: n.urlWithParams,
                headers: p.headers,
              }),
            );
            return;
          }
          let c = new Ot(a.headers),
            u = a.statusText,
            l = gm(a) ?? n.urlWithParams,
            d = a.status,
            f = null;
          if (
            (n.reportProgress &&
              o.next(new na({ headers: c, status: d, statusText: u, url: l })),
            a.body)
          ) {
            let p = a.headers.get("content-length"),
              y = [],
              v = a.body.getReader(),
              D = 0,
              $,
              X,
              Y = typeof Zone < "u" && Zone.current;
            yield this.ngZone.runOutsideAngular(() =>
              io(this, null, function* () {
                for (;;) {
                  let { done: ue, value: We } = yield v.read();
                  if (ue) break;
                  if ((y.push(We), (D += We.length), n.reportProgress)) {
                    X =
                      n.responseType === "text"
                        ? (X ?? "") +
                          ($ ??= new TextDecoder()).decode(We, { stream: !0 })
                        : void 0;
                    let zn = () =>
                      o.next({
                        type: tn.DownloadProgress,
                        total: p ? +p : void 0,
                        loaded: D,
                        partialText: X,
                      });
                    Y ? Y.run(zn) : zn();
                  }
                }
              }),
            );
            let Ge = this.concatChunks(y, D);
            try {
              let ue = a.headers.get("Content-Type") ?? "";
              f = this.parseBody(n, Ge, ue);
            } catch (ue) {
              o.error(
                new Xt({
                  error: ue,
                  headers: new Ot(a.headers),
                  status: a.status,
                  statusText: a.statusText,
                  url: gm(a) ?? n.urlWithParams,
                }),
              );
              return;
            }
          }
          d === 0 && (d = f ? ym : 0),
            d >= 200 && d < 300
              ? (o.next(
                  new Mi({
                    body: f,
                    headers: c,
                    status: d,
                    statusText: u,
                    url: l,
                  }),
                ),
                o.complete())
              : o.error(
                  new Xt({
                    error: f,
                    headers: c,
                    status: d,
                    statusText: u,
                    url: l,
                  }),
                );
        });
      }
      parseBody(n, i, o) {
        switch (n.responseType) {
          case "json":
            let s = new TextDecoder().decode(i).replace(rI, "");
            return s === "" ? null : JSON.parse(s);
          case "text":
            return new TextDecoder().decode(i);
          case "blob":
            return new Blob([i], { type: o });
          case "arraybuffer":
            return i.buffer;
        }
      }
      createRequestInit(n) {
        let i = {},
          o = n.withCredentials ? "include" : void 0;
        if (
          (n.headers.forEach((s, a) => (i[s] = a.join(","))),
          (i.Accept ??= "application/json, text/plain, */*"),
          !i["Content-Type"])
        ) {
          let s = n.detectContentTypeHeader();
          s !== null && (i["Content-Type"] = s);
        }
        return {
          body: n.serializeBody(),
          method: n.method,
          headers: i,
          credentials: o,
        };
      }
      concatChunks(n, i) {
        let o = new Uint8Array(i),
          s = 0;
        for (let a of n) o.set(a, s), (s += a.length);
        return o;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ml = class {};
function Sl() {}
function sI(t) {
  t.then(Sl, Sl);
}
function aI(t, e) {
  return e(t);
}
function cI(t, e, r) {
  return (n, i) => Ke(r, () => e(n, (o) => t(o, i)));
}
var Dm = new C(""),
  uI = new C(""),
  lI = new C("", { providedIn: "root", factory: () => !0 });
var mm = (() => {
  let e = class e extends bi {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = g(Rn)),
        (this.contributeToStability = g(lI));
    }
    handle(n) {
      if (this.chain === null) {
        let i = Array.from(
          new Set([...this.injector.get(Dm), ...this.injector.get(uI, [])]),
        );
        this.chain = i.reduceRight((o, s) => cI(o, s, this.injector), aI);
      }
      if (this.contributeToStability) {
        let i = this.pendingTasks.add();
        return this.chain(n, (o) => this.backend.handle(o)).pipe(
          fn(() => this.pendingTasks.remove(i)),
        );
      } else return this.chain(n, (i) => this.backend.handle(i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(_(ta), _(Ne));
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var dI = /^\)\]\}',?\n/;
function fI(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
      ? t.getResponseHeader("X-Request-URL")
      : null;
}
var vm = (() => {
    let e = class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new w(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? ne(i.ɵloadImpl()) : I(null)).pipe(
          we(
            () =>
              new N((s) => {
                let a = i.build();
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((v, D) =>
                    a.setRequestHeader(v, D.join(",")),
                  ),
                  n.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*",
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let v = n.detectContentTypeHeader();
                  v !== null && a.setRequestHeader("Content-Type", v);
                }
                if (n.responseType) {
                  let v = n.responseType.toLowerCase();
                  a.responseType = v !== "json" ? v : "text";
                }
                let c = n.serializeBody(),
                  u = null,
                  l = () => {
                    if (u !== null) return u;
                    let v = a.statusText || "OK",
                      D = new Ot(a.getAllResponseHeaders()),
                      $ = fI(a) || n.url;
                    return (
                      (u = new na({
                        headers: D,
                        status: a.status,
                        statusText: v,
                        url: $,
                      })),
                      u
                    );
                  },
                  d = () => {
                    let { headers: v, status: D, statusText: $, url: X } = l(),
                      Y = null;
                    D !== nI &&
                      (Y =
                        typeof a.response > "u" ? a.responseText : a.response),
                      D === 0 && (D = Y ? ym : 0);
                    let Ge = D >= 200 && D < 300;
                    if (n.responseType === "json" && typeof Y == "string") {
                      let ue = Y;
                      Y = Y.replace(dI, "");
                      try {
                        Y = Y !== "" ? JSON.parse(Y) : null;
                      } catch (We) {
                        (Y = ue),
                          Ge && ((Ge = !1), (Y = { error: We, text: Y }));
                      }
                    }
                    Ge
                      ? (s.next(
                          new Mi({
                            body: Y,
                            headers: v,
                            status: D,
                            statusText: $,
                            url: X || void 0,
                          }),
                        ),
                        s.complete())
                      : s.error(
                          new Xt({
                            error: Y,
                            headers: v,
                            status: D,
                            statusText: $,
                            url: X || void 0,
                          }),
                        );
                  },
                  f = (v) => {
                    let { url: D } = l(),
                      $ = new Xt({
                        error: v,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: D || void 0,
                      });
                    s.error($);
                  },
                  h = !1,
                  p = (v) => {
                    h || (s.next(l()), (h = !0));
                    let D = { type: tn.DownloadProgress, loaded: v.loaded };
                    v.lengthComputable && (D.total = v.total),
                      n.responseType === "text" &&
                        a.responseText &&
                        (D.partialText = a.responseText),
                      s.next(D);
                  },
                  y = (v) => {
                    let D = { type: tn.UploadProgress, loaded: v.loaded };
                    v.lengthComputable && (D.total = v.total), s.next(D);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", f),
                  a.addEventListener("timeout", f),
                  a.addEventListener("abort", f),
                  n.reportProgress &&
                    (a.addEventListener("progress", p),
                    c !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", y)),
                  a.send(c),
                  s.next({ type: tn.Sent }),
                  () => {
                    a.removeEventListener("error", f),
                      a.removeEventListener("abort", f),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", f),
                      n.reportProgress &&
                        (a.removeEventListener("progress", p),
                        c !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", y)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              }),
          ),
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(Fr));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Cm = new C(""),
  hI = "XSRF-TOKEN",
  pI = new C("", { providedIn: "root", factory: () => hI }),
  gI = "X-XSRF-TOKEN",
  mI = new C("", { providedIn: "root", factory: () => gI }),
  ra = class {},
  vI = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.doc = n),
          (this.platform = i),
          (this.cookieName = o),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = Js(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(le), _(ct), _(pI));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function yI(t, e) {
  let r = t.url.toLowerCase();
  if (
    !g(Cm) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    r.startsWith("http://") ||
    r.startsWith("https://")
  )
    return e(t);
  let n = g(ra).getToken(),
    i = g(mI);
  return (
    n != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, n) })),
    e(t)
  );
}
function wm(...t) {
  let e = [
    xl,
    vm,
    mm,
    { provide: bi, useExisting: mm },
    { provide: ta, useFactory: () => g(oI, { optional: !0 }) ?? g(vm) },
    { provide: Dm, useValue: yI, multi: !0 },
    { provide: Cm, useValue: !0 },
    { provide: ra, useClass: vI },
  ];
  for (let r of t) e.push(...r.ɵproviders);
  return Ir(e);
}
var Nl = class extends Zs {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Ol = class t extends Nl {
    static makeCurrent() {
      em(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
          ? e
          : r === "body"
            ? e.body
            : null;
    }
    getBaseHref(e) {
      let r = CI();
      return r == null ? null : wI(r);
    }
    resetBaseElement() {
      Si = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Js(document.cookie, e);
    }
  },
  Si = null;
function CI() {
  return (
    (Si = Si || document.querySelector("base")),
    Si ? Si.getAttribute("href") : null
  );
}
function wI(t) {
  return new URL(t, document.baseURI).pathname;
}
var EI = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Rl = new C(""),
  Im = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new w(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(Rl), _(W));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ia = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Tl = "ng-app-id",
  Mm = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Xs(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Tl}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(Tl), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Tl, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(le), _(Zu), _(Qu, 8), _(ct));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Al = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Fl = /%COMP%/g,
  Sm = "%COMP%",
  _I = `_nghost-${Sm}`,
  bI = `_ngcontent-${Sm}`,
  II = !0,
  MI = new C("", { providedIn: "root", factory: () => II });
function SI(t) {
  return bI.replace(Fl, t);
}
function xI(t) {
  return _I.replace(Fl, t);
}
function xm(t, e) {
  return e.map((r) => r.replace(Fl, t));
}
var Em = (() => {
    let e = class e {
      constructor(n, i, o, s, a, c, u, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = u),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Xs(c)),
          (this.defaultRenderer = new xi(n, a, u, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === mt.ShadowDom &&
          (i = U(m({}, i), { encapsulation: mt.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof oa
            ? o.applyToHost(n)
            : o instanceof Ti && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            u = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case mt.Emulated:
              s = new oa(u, l, i, this.appId, d, a, c, f);
              break;
            case mt.ShadowDom:
              return new Pl(u, l, n, i, a, c, this.nonce, f);
            default:
              s = new Ti(u, l, i, d, a, c, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        _(Im),
        _(Mm),
        _(Zu),
        _(MI),
        _(le),
        _(ct),
        _(W),
        _(Qu),
      );
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  xi = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(Al[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (_m(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (_m(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new w(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = Al[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = Al[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (It.DashCase | It.Important)
        ? e.style.setProperty(r, n, i & It.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & It.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = Nt().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n),
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function _m(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Pl = class extends xi {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = xm(i.id, i.styles);
      for (let l of u) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Ti = class extends xi {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? xm(c, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  oa = class extends Ti {
    constructor(e, r, n, i, o, s, a, c) {
      let u = i + "-" + n.id;
      super(e, r, n, o, s, a, c, u),
        (this.contentAttr = SI(u)),
        (this.hostAttr = xI(u));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  TI = (() => {
    let e = class e extends ia {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(le));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  bm = ["alt", "control", "meta", "shift"],
  AI = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  NI = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  OI = (() => {
    let e = class e extends ia {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Nt().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          bm.forEach((l) => {
            let d = i.indexOf(l);
            d > -1 && (i.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let u = {};
        return (u.domEventName = o), (u.fullKey = a), u;
      }
      static matchEventFullKeyCode(n, i) {
        let o = AI[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              bm.forEach((a) => {
                if (a !== o) {
                  let c = NI[a];
                  c(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(le));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Tm(t, e) {
  return Zg(m({ rootComponent: t }, RI(e)));
}
function RI(t) {
  return {
    appProviders: [...VI, ...(t?.providers ?? [])],
    platformProviders: LI,
  };
}
function PI() {
  Ol.makeCurrent();
}
function FI() {
  return new st();
}
function kI() {
  return Pp(document), document;
}
var LI = [
  { provide: ct, useValue: El },
  { provide: Yu, useValue: PI, multi: !0 },
  { provide: le, useFactory: kI, deps: [] },
];
var VI = [
  { provide: Cs, useValue: "root" },
  { provide: st, useFactory: FI, deps: [] },
  { provide: Rl, useClass: TI, multi: !0, deps: [le, W, ct] },
  { provide: Rl, useClass: OI, multi: !0, deps: [le] },
  Em,
  Mm,
  Im,
  { provide: _r, useExisting: Em },
  { provide: Fr, useClass: EI, deps: [] },
  [],
];
var Am = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(_(le));
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var P = "primary",
  Wi = Symbol("RouteTitle"),
  Bl = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Ur(t) {
  return new Bl(t);
}
function BI(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s[0] === ":") i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function UI(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!wt(t[r], e[r])) return !1;
  return !0;
}
function wt(t, e) {
  let r = t ? Ul(t) : void 0,
    n = e ? Ul(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !jm(t[i], e[i]))) return !1;
  return !0;
}
function Ul(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function jm(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function Bm(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function rn(t) {
  return dn(t) ? t : kn(t) ? ne(Promise.resolve(t)) : I(t);
}
var $I = { exact: $m, subset: Hm },
  Um = { exact: HI, subset: zI, ignored: () => !0 };
function Nm(t, e, r) {
  return (
    $I[r.paths](t.root, e.root, r.matrixParams) &&
    Um[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function HI(t, e) {
  return wt(t, e);
}
function $m(t, e, r) {
  if (
    !Bn(t.segments, e.segments) ||
    !ca(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !$m(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function zI(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => jm(t[r], e[r]))
  );
}
function Hm(t, e, r) {
  return zm(t, e, e.segments, r);
}
function zm(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!Bn(i, r) || e.hasChildren() || !ca(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!Bn(t.segments, r) || !ca(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !Hm(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !Bn(t.segments, i) || !ca(t.segments, i, n) || !t.children[P]
      ? !1
      : zm(t.children[P], e, o, n);
  }
}
function ca(t, e, r) {
  return e.every((n, i) => Um[r](t[i].parameters, n.parameters));
}
var nn = class {
    constructor(e = new q([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Ur(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return qI.serialize(this);
    }
  },
  q = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return ua(this);
    }
  },
  jn = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= Ur(this.parameters)), this._parameterMap;
    }
    toString() {
      return Wm(this);
    }
  };
function GI(t, e) {
  return Bn(t, e) && t.every((r, n) => wt(r.parameters, e[n].parameters));
}
function Bn(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function WI(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === P && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== P && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var hd = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: () => new ki(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ki = class {
    parse(e) {
      let r = new Hl(e);
      return new nn(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment(),
      );
    }
    serialize(e) {
      let r = `/${Ai(e.root, !0)}`,
        n = QI(e.queryParams),
        i = typeof e.fragment == "string" ? `#${ZI(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  qI = new ki();
function ua(t) {
  return t.segments.map((e) => Wm(e)).join("/");
}
function Ai(t, e) {
  if (!t.hasChildren()) return ua(t);
  if (e) {
    let r = t.children[P] ? Ai(t.children[P], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== P && n.push(`${i}:${Ai(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = WI(t, (n, i) =>
      i === P ? [Ai(t.children[P], !1)] : [`${i}:${Ai(n, !1)}`],
    );
    return Object.keys(t.children).length === 1 && t.children[P] != null
      ? `${ua(t)}/${r[0]}`
      : `${ua(t)}/(${r.join("//")})`;
  }
}
function Gm(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function sa(t) {
  return Gm(t).replace(/%3B/gi, ";");
}
function ZI(t) {
  return encodeURI(t);
}
function $l(t) {
  return Gm(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function la(t) {
  return decodeURIComponent(t);
}
function Om(t) {
  return la(t.replace(/\+/g, "%20"));
}
function Wm(t) {
  return `${$l(t.path)}${YI(t.parameters)}`;
}
function YI(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${$l(e)}=${$l(r)}`)
    .join("");
}
function QI(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${sa(r)}=${sa(i)}`).join("&")
        : `${sa(r)}=${sa(n)}`,
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var KI = /^[^\/()?;#]+/;
function kl(t) {
  let e = t.match(KI);
  return e ? e[0] : "";
}
var JI = /^[^\/()?;=#]+/;
function XI(t) {
  let e = t.match(JI);
  return e ? e[0] : "";
}
var e0 = /^[^=?&#]+/;
function t0(t) {
  let e = t.match(e0);
  return e ? e[0] : "";
}
var n0 = /^[^&#]+/;
function r0(t) {
  let e = t.match(n0);
  return e ? e[0] : "";
}
var Hl = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new q([], {})
        : new q([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[P] = new q(e, r)),
      n
    );
  }
  parseSegment() {
    let e = kl(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new w(4009, !1);
    return this.capture(e), new jn(la(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = XI(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = kl(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[la(r)] = la(n);
  }
  parseQueryParam(e) {
    let r = t0(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = r0(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = Om(r),
      o = Om(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = kl(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new w(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = P);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[P] : new q([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new w(4011, !1);
  }
};
function qm(t) {
  return t.segments.length > 0 ? new q([], { [P]: t }) : t;
}
function Zm(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = Zm(i);
    if (n === P && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new q(t.segments, e);
  return i0(r);
}
function i0(t) {
  if (t.numberOfChildren === 1 && t.children[P]) {
    let e = t.children[P];
    return new q(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function Li(t) {
  return t instanceof nn;
}
function o0(t, e, r = null, n = null) {
  let i = Ym(t);
  return Qm(i, e, r, n);
}
function Ym(t) {
  let e;
  function r(o) {
    let s = {};
    for (let c of o.children) {
      let u = r(c);
      s[c.outlet] = u;
    }
    let a = new q(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = qm(n);
  return e ?? i;
}
function Qm(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return Ll(i, i, i, r, n);
  let o = s0(e);
  if (o.toRoot()) return Ll(i, i, new q([], {}), r, n);
  let s = a0(o, i, t),
    a = s.processChildren
      ? Ri(s.segmentGroup, s.index, o.commands)
      : Jm(s.segmentGroup, s.index, o.commands);
  return Ll(i, s.segmentGroup, a, r, n);
}
function da(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Vi(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Ll(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([c, u]) => {
      o[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
    });
  let s;
  t === e ? (s = r) : (s = Km(t, e, r));
  let a = qm(Zm(s));
  return new nn(a, o, i);
}
function Km(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Km(o, e, r));
    }),
    new q(t.segments, n)
  );
}
var fa = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && da(n[0]))
    )
      throw new w(4003, !1);
    let i = n.find(Vi);
    if (i && i !== Bm(n)) throw new w(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function s0(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new fa(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, u]) => {
              a[c] = typeof u == "string" ? u.split("/") : u;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
          ? (o.split("/").forEach((a, c) => {
              (c == 0 && a === ".") ||
                (c == 0 && a === ""
                  ? (r = !0)
                  : a === ".."
                    ? e++
                    : a != "" && i.push(a));
            }),
            i)
          : [...i, o];
    }, []);
  return new fa(r, e, n);
}
var Vr = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function a0(t, e, r) {
  if (t.isAbsolute) return new Vr(e, !0, 0);
  if (!r) return new Vr(e, !1, NaN);
  if (r.parent === null) return new Vr(r, !0, 0);
  let n = da(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return c0(r, i, t.numberOfDoubleDots);
}
function c0(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new w(4005, !1);
    i = n.segments.length;
  }
  return new Vr(n, !1, i - o);
}
function u0(t) {
  return Vi(t[0]) ? t[0].outlets : { [P]: t };
}
function Jm(t, e, r) {
  if (((t ??= new q([], {})), t.segments.length === 0 && t.hasChildren()))
    return Ri(t, e, r);
  let n = l0(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new q(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[P] = new q(t.segments.slice(n.pathIndex), t.children)),
      Ri(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new q(t.segments, {})
      : n.match && !t.hasChildren()
        ? zl(t, e, r)
        : n.match
          ? Ri(t, 0, i)
          : zl(t, e, r);
}
function Ri(t, e, r) {
  if (r.length === 0) return new q(t.segments, {});
  {
    let n = u0(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== P) &&
      t.children[P] &&
      t.numberOfChildren === 1 &&
      t.children[P].segments.length === 0
    ) {
      let o = Ri(t.children[P], e, r);
      return new q(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Jm(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new q(t.segments, i)
    );
  }
}
function l0(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (Vi(a)) break;
    let c = `${a}`,
      u = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && u && typeof u == "object" && u.outlets === void 0) {
      if (!Pm(c, u, s)) return o;
      n += 2;
    } else {
      if (!Pm(c, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function zl(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (Vi(o)) {
      let c = d0(o.outlets);
      return new q(n, c);
    }
    if (i === 0 && da(r[0])) {
      let c = t.segments[e];
      n.push(new jn(c.path, Rm(r[0]))), i++;
      continue;
    }
    let s = Vi(o) ? o.outlets[P] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && da(a)
      ? (n.push(new jn(s, Rm(a))), (i += 2))
      : (n.push(new jn(s, {})), i++);
  }
  return new q(n, {});
}
function d0(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = zl(new q([], {}), 0, n));
    }),
    e
  );
}
function Rm(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function Pm(t, e, r) {
  return t == r.path && wt(e, r.parameters);
}
var Pi = "imperative",
  ge = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(ge || {}),
  tt = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  ji = class extends tt {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = ge.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Un = class extends tt {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = ge.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  ze = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(ze || {}),
  Gl = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(Gl || {}),
  Rt = class extends tt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = ge.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  $n = class extends tt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = ge.NavigationSkipped);
    }
  },
  Bi = class extends tt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = ge.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  ha = class extends tt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Wl = class extends tt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ql = class extends tt {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = ge.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Zl = class extends tt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Yl = class extends tt {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = ge.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Ql = class {
    constructor(e) {
      (this.route = e), (this.type = ge.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Kl = class {
    constructor(e) {
      (this.route = e), (this.type = ge.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Jl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ge.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Xl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ge.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  ed = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ge.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  td = class {
    constructor(e) {
      (this.snapshot = e), (this.type = ge.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var Ui = class {},
  $r = class {
    constructor(e, r) {
      (this.url = e), (this.navigationBehaviorOptions = r);
    }
  };
var nd = class {
    constructor(e) {
      (this.injector = e),
        (this.outlet = null),
        (this.route = null),
        (this.children = new Ca(this.injector)),
        (this.attachRef = null);
    }
  },
  Ca = (() => {
    let e = class e {
      constructor(n) {
        (this.parentInjector = n), (this.contexts = new Map());
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return (
          i || ((i = new nd(this.parentInjector)), this.contexts.set(n, i)), i
        );
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(Ne));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  pa = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = rd(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = rd(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = id(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return id(e, this._root).map((r) => r.value);
    }
  };
function rd(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = rd(t, r);
    if (n) return n;
  }
  return null;
}
function id(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = id(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var He = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Lr(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var ga = class extends pa {
  constructor(e, r) {
    super(e), (this.snapshot = r), pd(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Xm(t) {
  let e = f0(t),
    r = new he([new jn("", {})]),
    n = new he({}),
    i = new he({}),
    o = new he({}),
    s = new he(""),
    a = new Hr(r, n, o, s, i, P, t, e.root);
  return (a.snapshot = e.root), new ga(new He(a, []), e);
}
function f0(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new jr([], e, n, i, r, P, t, null, {});
  return new va("", new He(o, []));
}
var Hr = class {
  constructor(e, r, n, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(x((u) => u[Wi])) ?? I(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(x((e) => Ur(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(x((e) => Ur(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function ma(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: m(m({}, e.params), t.params),
          data: m(m({}, e.data), t.data),
          resolve: m(m(m(m({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: m({}, t.params),
          data: m({}, t.data),
          resolve: m(m({}, t.data), t._resolvedData ?? {}),
        }),
    i && tv(i) && (n.resolve[Wi] = i.title),
    n
  );
}
var jr = class {
    get title() {
      return this.data?.[Wi];
    }
    constructor(e, r, n, i, o, s, a, c, u) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = u);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= Ur(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Ur(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  va = class extends pa {
    constructor(e, r) {
      super(r), (this.url = e), pd(this, r);
    }
    toString() {
      return ev(this._root);
    }
  };
function pd(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => pd(t, r));
}
function ev(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(ev).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function Vl(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      wt(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      wt(e.params, r.params) || t.paramsSubject.next(r.params),
      UI(e.url, r.url) || t.urlSubject.next(r.url),
      wt(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function od(t, e) {
  let r = wt(t.params, e.params) && GI(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || od(t.parent, e.parent));
}
function tv(t) {
  return typeof t.title == "string" || t.title === null;
}
var h0 = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = P),
          (this.activateEvents = new re()),
          (this.deactivateEvents = new re()),
          (this.attachEvents = new re()),
          (this.detachEvents = new re()),
          (this.parentContexts = g(Ca)),
          (this.location = g(Qt)),
          (this.changeDetector = g(Ct)),
          (this.inputBinder = g(gd, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new w(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new w(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new w(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new w(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          u = new sd(n, c, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: u,
          environmentInjector: i,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [je],
      }));
    let t = e;
    return t;
  })(),
  sd = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e);
    }
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === Hr
        ? this.route
        : e === Ca
          ? this.childContexts
          : this.parent.get(e, r);
    }
  },
  gd = new C("");
function p0(t, e, r) {
  let n = $i(t, e._root, r ? r._root : void 0);
  return new ga(n, e);
}
function $i(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = g0(t, e, r);
    return new He(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => $i(t, a))),
          s
        );
      }
    }
    let n = m0(e.value),
      i = e.children.map((o) => $i(t, o));
    return new He(n, i);
  }
}
function g0(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return $i(t, n, i);
    return $i(t, n);
  });
}
function m0(t) {
  return new Hr(
    new he(t.url),
    new he(t.params),
    new he(t.queryParams),
    new he(t.fragment),
    new he(t.data),
    t.outlet,
    t.component,
    t,
  );
}
var Hi = class {
    constructor(e, r) {
      (this.redirectTo = e), (this.navigationBehaviorOptions = r);
    }
  },
  nv = "ngNavigationCancelingError";
function ya(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = Li(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = rv(!1, ze.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function rv(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ""}`);
  return (r[nv] = !0), (r.cancellationCode = e), r;
}
function v0(t) {
  return iv(t) && Li(t.url);
}
function iv(t) {
  return !!t && t[nv];
}
var y0 = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Qe({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [Xe],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && Pe(0, "router-outlet");
      },
      dependencies: [h0],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function D0(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = hl(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function md(t) {
  let e = t.children && t.children.map(md),
    r = e ? U(m({}, t), { children: e }) : m({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== P &&
      (r.component = y0),
    r
  );
}
function dt(t) {
  return t.outlet || P;
}
function C0(t, e) {
  let r = t.filter((n) => dt(n) === e);
  return r.push(...t.filter((n) => dt(n) !== e)), r;
}
function qi(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var w0 = (t, e, r, n) =>
    x(
      (i) => (
        new ad(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      ),
    ),
  ad = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        Vl(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = Lr(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = Lr(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = Lr(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = Lr(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new td(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Xl(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((Vl(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Vl(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = qi(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a ?? s.injector),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  Da = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Br = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function E0(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return Ni(n, i, r, [n.value]);
}
function _0(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function Gr(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !yh(t) ? t : e.get(t)) : n;
}
function Ni(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = Lr(e);
  return (
    t.children.forEach((s) => {
      b0(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Fi(a, r.getContext(s), i)),
    i
  );
}
function b0(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = I0(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new Da(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Ni(t, e, a ? a.children : null, n, i) : Ni(t, e, r, n, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Br(a.outlet.component, s));
  } else
    s && Fi(e, a, i),
      i.canActivateChecks.push(new Da(n)),
      o.component
        ? Ni(t, null, a ? a.children : null, n, i)
        : Ni(t, null, r, n, i);
  return i;
}
function I0(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !Bn(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !Bn(t.url, e.url) || !wt(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !od(t, e) || !wt(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !od(t, e);
  }
}
function Fi(t, e, r) {
  let n = Lr(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? Fi(s, e.children.getContext(o), r)
        : Fi(s, null, r)
      : Fi(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new Br(e.outlet.component, i))
        : r.canDeactivateChecks.push(new Br(null, i))
      : r.canDeactivateChecks.push(new Br(null, i));
}
function Zi(t) {
  return typeof t == "function";
}
function M0(t) {
  return typeof t == "boolean";
}
function S0(t) {
  return t && Zi(t.canLoad);
}
function x0(t) {
  return t && Zi(t.canActivate);
}
function T0(t) {
  return t && Zi(t.canActivateChild);
}
function A0(t) {
  return t && Zi(t.canDeactivate);
}
function N0(t) {
  return t && Zi(t.canMatch);
}
function ov(t) {
  return t instanceof _t || t?.name === "EmptyError";
}
var aa = Symbol("INITIAL_VALUE");
function zr() {
  return we((t) =>
    ko(t.map((e) => e.pipe(qe(1), ir(aa)))).pipe(
      x((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === aa) return aa;
            if (r === !1 || O0(r)) return r;
          }
        return !0;
      }),
      Ce((e) => e !== aa),
      qe(1),
    ),
  );
}
function O0(t) {
  return Li(t) || t instanceof Hi;
}
function R0(t, e) {
  return ie((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? I(U(m({}, r), { guardsResult: !0 }))
      : P0(s, n, i, t).pipe(
          ie((a) => (a && M0(a) ? F0(n, o, t, e) : I(a))),
          x((a) => U(m({}, r), { guardsResult: a })),
        );
  });
}
function P0(t, e, r, n) {
  return ne(t).pipe(
    ie((i) => B0(i.component, i.route, r, e, n)),
    ht((i) => i !== !0, !0),
  );
}
function F0(t, e, r, n) {
  return ne(e).pipe(
    jt((i) =>
      tr(
        L0(i.route.parent, n),
        k0(i.route, n),
        j0(t, i.path, r),
        V0(t, i.route, r),
      ),
    ),
    ht((i) => i !== !0, !0),
  );
}
function k0(t, e) {
  return t !== null && e && e(new ed(t)), I(!0);
}
function L0(t, e) {
  return t !== null && e && e(new Jl(t)), I(!0);
}
function V0(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return I(!0);
  let i = n.map((o) =>
    Lo(() => {
      let s = qi(e) ?? r,
        a = Gr(o, s),
        c = x0(a) ? a.canActivate(e, t) : Ke(s, () => a(e, t));
      return rn(c).pipe(ht());
    }),
  );
  return I(i).pipe(zr());
}
function j0(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => _0(s))
      .filter((s) => s !== null)
      .map((s) =>
        Lo(() => {
          let a = s.guards.map((c) => {
            let u = qi(s.node) ?? r,
              l = Gr(c, u),
              d = T0(l) ? l.canActivateChild(n, t) : Ke(u, () => l(n, t));
            return rn(d).pipe(ht());
          });
          return I(a).pipe(zr());
        }),
      );
  return I(o).pipe(zr());
}
function B0(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return I(!0);
  let s = o.map((a) => {
    let c = qi(e) ?? i,
      u = Gr(a, c),
      l = A0(u) ? u.canDeactivate(t, e, r, n) : Ke(c, () => u(t, e, r, n));
    return rn(l).pipe(ht());
  });
  return I(s).pipe(zr());
}
function U0(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return I(!0);
  let o = i.map((s) => {
    let a = Gr(s, t),
      c = S0(a) ? a.canLoad(e, r) : Ke(t, () => a(e, r));
    return rn(c);
  });
  return I(o).pipe(zr(), sv(n));
}
function sv(t) {
  return Ya(
    fe((e) => {
      if (typeof e != "boolean") throw ya(t, e);
    }),
    x((e) => e === !0),
  );
}
function $0(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return I(!0);
  let o = i.map((s) => {
    let a = Gr(s, t),
      c = N0(a) ? a.canMatch(e, r) : Ke(t, () => a(e, r));
    return rn(c);
  });
  return I(o).pipe(zr(), sv(n));
}
var zi = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Gi = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function kr(t) {
  return Xn(new zi(t));
}
function H0(t) {
  return Xn(new w(4e3, !1));
}
function z0(t) {
  return Xn(rv(!1, ze.GuardRejected));
}
var cd = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return I(n);
        if (i.numberOfChildren > 1 || !i.children[P])
          return H0(`${e.redirectTo}`);
        i = i.children[P];
      }
    }
    applyRedirectCommands(e, r, n, i, o) {
      if (typeof r != "string") {
        let a = r,
          {
            queryParams: c,
            fragment: u,
            routeConfig: l,
            url: d,
            outlet: f,
            params: h,
            data: p,
            title: y,
          } = i,
          v = Ke(o, () =>
            a({
              params: h,
              data: p,
              queryParams: c,
              fragment: u,
              routeConfig: l,
              url: d,
              outlet: f,
              title: y,
            }),
          );
        if (v instanceof nn) throw new Gi(v);
        r = v;
      }
      let s = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n,
      );
      if (r[0] === "/") throw new Gi(s);
      return s;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new nn(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment,
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o[0] === ":") {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, n, i);
        }),
        new q(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path[0] === ":"
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, n),
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new w(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  ud = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function G0(t, e, r, n, i) {
  let o = vd(t, e, r);
  return o.matched
    ? ((n = D0(e, n)),
      $0(n, e, r, i).pipe(x((s) => (s === !0 ? o : m({}, ud)))))
    : I(o);
}
function vd(t, e, r) {
  if (e.path === "**") return W0(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? m({}, ud)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || BI)(r, t, e);
  if (!i) return m({}, ud);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s =
    i.consumed.length > 0
      ? m(m({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function W0(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Bm(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Fm(t, e, r, n) {
  return r.length > 0 && Y0(t, r, n)
    ? {
        segmentGroup: new q(e, Z0(n, new q(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && Q0(t, r, n)
      ? {
          segmentGroup: new q(t.segments, q0(t, r, n, t.children)),
          slicedSegments: r,
        }
      : { segmentGroup: new q(t.segments, t.children), slicedSegments: r };
}
function q0(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (wa(t, e, o) && !n[dt(o)]) {
      let s = new q([], {});
      i[dt(o)] = s;
    }
  return m(m({}, n), i);
}
function Z0(t, e) {
  let r = {};
  r[P] = e;
  for (let n of t)
    if (n.path === "" && dt(n) !== P) {
      let i = new q([], {});
      r[dt(n)] = i;
    }
  return r;
}
function Y0(t, e, r) {
  return r.some((n) => wa(t, e, n) && dt(n) !== P);
}
function Q0(t, e, r) {
  return r.some((n) => wa(t, e, n));
}
function wa(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function K0(t, e, r, n) {
  return dt(t) !== n && (n === P || !wa(e, r, t)) ? !1 : vd(e, t, r).matched;
}
function J0(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var ld = class {};
function X0(t, e, r, n, i, o, s = "emptyOnly") {
  return new dd(t, e, r, n, i, s, o).recognize();
}
var eM = 31,
  dd = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new cd(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new w(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = Fm(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        x(({ children: r, rootSnapshot: n }) => {
          let i = new He(n, r),
            o = new va("", i),
            s = o0(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            { state: o, tree: s }
          );
        }),
      );
    }
    match(e) {
      let r = new jr(
        [],
        Object.freeze({}),
        Object.freeze(m({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        P,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, e, P, r).pipe(
        x((n) => ({ children: n, rootSnapshot: r })),
        Vt((n) => {
          if (n instanceof Gi)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof zi ? this.noMatchError(n) : n;
        }),
      );
    }
    processSegmentGroup(e, r, n, i, o) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n, o)
        : this.processSegment(e, r, n, n.segments, i, !0, o).pipe(
            x((s) => (s instanceof He ? [s] : [])),
          );
    }
    processChildren(e, r, n, i) {
      let o = [];
      for (let s of Object.keys(n.children))
        s === "primary" ? o.unshift(s) : o.push(s);
      return ne(o).pipe(
        jt((s) => {
          let a = n.children[s],
            c = C0(r, s);
          return this.processSegmentGroup(e, c, a, s, i);
        }),
        lc((s, a) => (s.push(...a), s)),
        Bt(null),
        cc(),
        ie((s) => {
          if (s === null) return kr(n);
          let a = av(s);
          return tM(a), I(a);
        }),
      );
    }
    processSegment(e, r, n, i, o, s, a) {
      return ne(r).pipe(
        jt((c) =>
          this.processSegmentAgainstRoute(
            c._injector ?? e,
            r,
            c,
            n,
            i,
            o,
            s,
            a,
          ).pipe(
            Vt((u) => {
              if (u instanceof zi) return I(null);
              throw u;
            }),
          ),
        ),
        ht((c) => !!c),
        Vt((c) => {
          if (ov(c)) return J0(n, i, o) ? I(new ld()) : kr(n);
          throw c;
        }),
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a, c) {
      return K0(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s, c)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s, c)
            : kr(i)
        : kr(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s, a) {
      let {
        matched: c,
        parameters: u,
        consumedSegments: l,
        positionalParamSegments: d,
        remainingSegments: f,
      } = vd(r, i, o);
      if (!c) return kr(r);
      typeof i.redirectTo == "string" &&
        i.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > eM && (this.allowRedirects = !1));
      let h = new jr(
          o,
          u,
          Object.freeze(m({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          km(i),
          dt(i),
          i.component ?? i._loadedComponent ?? null,
          i,
          Lm(i),
        ),
        p = ma(h, a, this.paramsInheritanceStrategy);
      (h.params = Object.freeze(p.params)), (h.data = Object.freeze(p.data));
      let y = this.applyRedirects.applyRedirectCommands(
        l,
        i.redirectTo,
        d,
        h,
        e,
      );
      return this.applyRedirects
        .lineralizeSegments(i, y)
        .pipe(ie((v) => this.processSegment(e, n, r, v.concat(f), s, !1, a)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o, s) {
      let a = G0(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        a.pipe(
          we((c) =>
            c.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  we(({ routes: u }) => {
                    let l = n._loadedInjector ?? e,
                      {
                        parameters: d,
                        consumedSegments: f,
                        remainingSegments: h,
                      } = c,
                      p = new jr(
                        f,
                        d,
                        Object.freeze(m({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        km(n),
                        dt(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        Lm(n),
                      ),
                      y = ma(p, s, this.paramsInheritanceStrategy);
                    (p.params = Object.freeze(y.params)),
                      (p.data = Object.freeze(y.data));
                    let { segmentGroup: v, slicedSegments: D } = Fm(r, f, h, u);
                    if (D.length === 0 && v.hasChildren())
                      return this.processChildren(l, u, v, p).pipe(
                        x((X) => new He(p, X)),
                      );
                    if (u.length === 0 && D.length === 0)
                      return I(new He(p, []));
                    let $ = dt(n) === o;
                    return this.processSegment(
                      l,
                      u,
                      v,
                      D,
                      $ ? P : o,
                      !0,
                      p,
                    ).pipe(x((X) => new He(p, X instanceof He ? [X] : [])));
                  }),
                ))
              : kr(r),
          ),
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? I({ routes: r.children, injector: e })
        : r.loadChildren
          ? r._loadedRoutes !== void 0
            ? I({ routes: r._loadedRoutes, injector: r._loadedInjector })
            : U0(e, r, n, this.urlSerializer).pipe(
                ie((i) =>
                  i
                    ? this.configLoader.loadChildren(e, r).pipe(
                        fe((o) => {
                          (r._loadedRoutes = o.routes),
                            (r._loadedInjector = o.injector);
                        }),
                      )
                    : z0(r),
                ),
              )
          : I({ routes: [], injector: e });
    }
  };
function tM(t) {
  t.sort((e, r) =>
    e.value.outlet === P
      ? -1
      : r.value.outlet === P
        ? 1
        : e.value.outlet.localeCompare(r.value.outlet),
  );
}
function nM(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function av(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!nM(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = av(n.children);
    e.push(new He(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function km(t) {
  return t.data || {};
}
function Lm(t) {
  return t.resolve || {};
}
function rM(t, e, r, n, i, o) {
  return ie((s) =>
    X0(t, e, r, n, s.extractedUrl, i, o).pipe(
      x(({ state: a, tree: c }) =>
        U(m({}, s), { targetSnapshot: a, urlAfterRedirects: c }),
      ),
    ),
  );
}
function iM(t, e) {
  return ie((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return I(r);
    let o = new Set(i.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let u of cv(c)) s.add(u);
    let a = 0;
    return ne(s).pipe(
      jt((c) =>
        o.has(c)
          ? oM(c, n, t, e)
          : ((c.data = ma(c, c.parent, t).resolve), I(void 0)),
      ),
      fe(() => a++),
      rr(1),
      ie((c) => (a === s.size ? I(r) : Le)),
    );
  });
}
function cv(t) {
  let e = t.children.map((r) => cv(r)).flat();
  return [t, ...e];
}
function oM(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !tv(i) && (o[Wi] = i.title),
    sM(o, t, e, n).pipe(
      x(
        (s) => (
          (t._resolvedData = s), (t.data = ma(t, t.parent, r).resolve), null
        ),
      ),
    )
  );
}
function sM(t, e, r, n) {
  let i = Ul(t);
  if (i.length === 0) return I({});
  let o = {};
  return ne(i).pipe(
    ie((s) =>
      aM(t[s], e, r, n).pipe(
        ht(),
        fe((a) => {
          if (a instanceof Hi) throw ya(new ki(), a);
          o[s] = a;
        }),
      ),
    ),
    rr(1),
    sc(o),
    Vt((s) => (ov(s) ? Le : Xn(s))),
  );
}
function aM(t, e, r, n) {
  let i = qi(e) ?? n,
    o = Gr(t, i),
    s = o.resolve ? o.resolve(e, r) : Ke(i, () => o(e, r));
  return rn(s);
}
function jl(t) {
  return we((e) => {
    let r = t(e);
    return r ? ne(r).pipe(x(() => e)) : I(e);
  });
}
var uv = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === P));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[Wi];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: () => g(cM), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  cM = (() => {
    let e = class e extends uv {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(Am));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  yd = new C("", { providedIn: "root", factory: () => ({}) }),
  Dd = new C(""),
  uM = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = g(pl));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return I(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = rn(n.loadComponent()).pipe(
            x(lv),
            fe((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            fn(() => {
              this.componentLoaders.delete(n);
            }),
          ),
          o = new Pt(i, () => new j()).pipe(Yn());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return I({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = lM(i, this.compiler, n, this.onLoadEndListener).pipe(
            fn(() => {
              this.childrenLoaders.delete(i);
            }),
          ),
          a = new Pt(s, () => new j()).pipe(Yn());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function lM(t, e, r, n) {
  return rn(t.loadChildren()).pipe(
    x(lv),
    ie((i) =>
      i instanceof fi || Array.isArray(i) ? I(i) : ne(e.compileModuleAsync(i)),
    ),
    x((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(Dd, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(md), injector: o }
      );
    }),
  );
}
function dM(t) {
  return t && typeof t == "object" && "default" in t;
}
function lv(t) {
  return dM(t) ? t.default : t;
}
var Cd = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: () => g(fM), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  fM = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  hM = new C("");
var pM = new C(""),
  gM = (() => {
    let e = class e {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new j()),
          (this.transitionAbortSubject = new j()),
          (this.configLoader = g(uM)),
          (this.environmentInjector = g(Ne)),
          (this.urlSerializer = g(hd)),
          (this.rootContexts = g(Ca)),
          (this.location = g(Ei)),
          (this.inputBindingEnabled = g(gd, { optional: !0 }) !== null),
          (this.titleStrategy = g(uv)),
          (this.options = g(yd, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = g(Cd)),
          (this.createViewTransition = g(hM, { optional: !0 })),
          (this.navigationErrorHandler = g(pM, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => I(void 0)),
          (this.rootComponentType = null);
        let n = (o) => this.events.next(new Ql(o)),
          i = (o) => this.events.next(new Kl(o));
        (this.configLoader.onLoadEndListener = i),
          (this.configLoader.onLoadStartListener = n);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let i = ++this.navigationId;
        this.transitions?.next(
          U(m(m({}, this.transitions.value), n), { id: i }),
        );
      }
      setupNavigations(n, i, o) {
        return (
          (this.transitions = new he({
            id: 0,
            currentUrlTree: i,
            currentRawUrl: i,
            extractedUrl: this.urlHandlingStrategy.extract(i),
            urlAfterRedirects: this.urlHandlingStrategy.extract(i),
            rawUrl: i,
            extras: {},
            resolve: () => {},
            reject: () => {},
            promise: Promise.resolve(!0),
            source: Pi,
            restoredState: null,
            currentSnapshot: o.snapshot,
            targetSnapshot: null,
            currentRouterState: o,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            Ce((s) => s.id !== 0),
            x((s) =>
              U(m({}, s), {
                extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
              }),
            ),
            we((s) => {
              let a = !1,
                c = !1;
              return I(s).pipe(
                we((u) => {
                  if (this.navigationId > s.id)
                    return (
                      this.cancelNavigationTransition(
                        s,
                        "",
                        ze.SupersededByNewNavigation,
                      ),
                      Le
                    );
                  (this.currentTransition = s),
                    (this.currentNavigation = {
                      id: u.id,
                      initialUrl: u.rawUrl,
                      extractedUrl: u.extractedUrl,
                      trigger: u.source,
                      extras: u.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? U(m({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let l =
                      !n.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    d = u.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!l && d !== "reload") {
                    let f = "";
                    return (
                      this.events.next(
                        new $n(
                          u.id,
                          this.urlSerializer.serialize(u.rawUrl),
                          f,
                          Gl.IgnoredSameUrlNavigation,
                        ),
                      ),
                      u.resolve(!1),
                      Le
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                    return I(u).pipe(
                      we((f) => {
                        let h = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new ji(
                              f.id,
                              this.urlSerializer.serialize(f.extractedUrl),
                              f.source,
                              f.restoredState,
                            ),
                          ),
                          h !== this.transitions?.getValue()
                            ? Le
                            : Promise.resolve(f)
                        );
                      }),
                      rM(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      fe((f) => {
                        (s.targetSnapshot = f.targetSnapshot),
                          (s.urlAfterRedirects = f.urlAfterRedirects),
                          (this.currentNavigation = U(
                            m({}, this.currentNavigation),
                            { finalUrl: f.urlAfterRedirects },
                          ));
                        let h = new ha(
                          f.id,
                          this.urlSerializer.serialize(f.extractedUrl),
                          this.urlSerializer.serialize(f.urlAfterRedirects),
                          f.targetSnapshot,
                        );
                        this.events.next(h);
                      }),
                    );
                  if (
                    l &&
                    this.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                  ) {
                    let {
                        id: f,
                        extractedUrl: h,
                        source: p,
                        restoredState: y,
                        extras: v,
                      } = u,
                      D = new ji(f, this.urlSerializer.serialize(h), p, y);
                    this.events.next(D);
                    let $ = Xm(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = s =
                        U(m({}, u), {
                          targetSnapshot: $,
                          urlAfterRedirects: h,
                          extras: U(m({}, v), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = h),
                      I(s)
                    );
                  } else {
                    let f = "";
                    return (
                      this.events.next(
                        new $n(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          f,
                          Gl.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      u.resolve(!1),
                      Le
                    );
                  }
                }),
                fe((u) => {
                  let l = new Wl(
                    u.id,
                    this.urlSerializer.serialize(u.extractedUrl),
                    this.urlSerializer.serialize(u.urlAfterRedirects),
                    u.targetSnapshot,
                  );
                  this.events.next(l);
                }),
                x(
                  (u) => (
                    (this.currentTransition = s =
                      U(m({}, u), {
                        guards: E0(
                          u.targetSnapshot,
                          u.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    s
                  ),
                ),
                R0(this.environmentInjector, (u) => this.events.next(u)),
                fe((u) => {
                  if (
                    ((s.guardsResult = u.guardsResult),
                    u.guardsResult && typeof u.guardsResult != "boolean")
                  )
                    throw ya(this.urlSerializer, u.guardsResult);
                  let l = new ql(
                    u.id,
                    this.urlSerializer.serialize(u.extractedUrl),
                    this.urlSerializer.serialize(u.urlAfterRedirects),
                    u.targetSnapshot,
                    !!u.guardsResult,
                  );
                  this.events.next(l);
                }),
                Ce((u) =>
                  u.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(u, "", ze.GuardRejected),
                      !1),
                ),
                jl((u) => {
                  if (u.guards.canActivateChecks.length)
                    return I(u).pipe(
                      fe((l) => {
                        let d = new Zl(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(d);
                      }),
                      we((l) => {
                        let d = !1;
                        return I(l).pipe(
                          iM(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector,
                          ),
                          fe({
                            next: () => (d = !0),
                            complete: () => {
                              d ||
                                this.cancelNavigationTransition(
                                  l,
                                  "",
                                  ze.NoDataFromResolver,
                                );
                            },
                          }),
                        );
                      }),
                      fe((l) => {
                        let d = new Yl(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(d);
                      }),
                    );
                }),
                jl((u) => {
                  let l = (d) => {
                    let f = [];
                    d.routeConfig?.loadComponent &&
                      !d.routeConfig._loadedComponent &&
                      f.push(
                        this.configLoader.loadComponent(d.routeConfig).pipe(
                          fe((h) => {
                            d.component = h;
                          }),
                          x(() => {}),
                        ),
                      );
                    for (let h of d.children) f.push(...l(h));
                    return f;
                  };
                  return ko(l(u.targetSnapshot.root)).pipe(Bt(null), qe(1));
                }),
                jl(() => this.afterPreactivation()),
                we(() => {
                  let { currentSnapshot: u, targetSnapshot: l } = s,
                    d = this.createViewTransition?.(
                      this.environmentInjector,
                      u.root,
                      l.root,
                    );
                  return d ? ne(d).pipe(x(() => s)) : I(s);
                }),
                x((u) => {
                  let l = p0(
                    n.routeReuseStrategy,
                    u.targetSnapshot,
                    u.currentRouterState,
                  );
                  return (
                    (this.currentTransition = s =
                      U(m({}, u), { targetRouterState: l })),
                    (this.currentNavigation.targetRouterState = l),
                    s
                  );
                }),
                fe(() => {
                  this.events.next(new Ui());
                }),
                w0(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (u) => this.events.next(u),
                  this.inputBindingEnabled,
                ),
                qe(1),
                fe({
                  next: (u) => {
                    (a = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new Un(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          this.urlSerializer.serialize(u.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(
                        u.targetRouterState.snapshot,
                      ),
                      u.resolve(!0);
                  },
                  complete: () => {
                    a = !0;
                  },
                }),
                rt(
                  this.transitionAbortSubject.pipe(
                    fe((u) => {
                      throw u;
                    }),
                  ),
                ),
                fn(() => {
                  !a &&
                    !c &&
                    this.cancelNavigationTransition(
                      s,
                      "",
                      ze.SupersededByNewNavigation,
                    ),
                    this.currentTransition?.id === s.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                Vt((u) => {
                  if (((c = !0), iv(u)))
                    this.events.next(
                      new Rt(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        u.message,
                        u.cancellationCode,
                      ),
                    ),
                      v0(u)
                        ? this.events.next(
                            new $r(u.url, u.navigationBehaviorOptions),
                          )
                        : s.resolve(!1);
                  else {
                    let l = new Bi(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u,
                      s.targetSnapshot ?? void 0,
                    );
                    try {
                      let d = Ke(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(l),
                      );
                      if (d instanceof Hi) {
                        let { message: f, cancellationCode: h } = ya(
                          this.urlSerializer,
                          d,
                        );
                        this.events.next(
                          new Rt(
                            s.id,
                            this.urlSerializer.serialize(s.extractedUrl),
                            f,
                            h,
                          ),
                        ),
                          this.events.next(
                            new $r(d.redirectTo, d.navigationBehaviorOptions),
                          );
                      } else {
                        this.events.next(l);
                        let f = n.errorHandler(u);
                        s.resolve(!!f);
                      }
                    } catch (d) {
                      this.options.resolveNavigationPromiseOnError
                        ? s.resolve(!1)
                        : s.reject(d);
                    }
                  }
                  return Le;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(n, i, o) {
        let s = new Rt(
          n.id,
          this.urlSerializer.serialize(n.extractedUrl),
          i,
          o,
        );
        this.events.next(s), n.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        return (
          this.urlHandlingStrategy
            .extract(this.urlSerializer.parse(this.location.path(!0)))
            .toString() !== this.currentTransition?.extractedUrl.toString() &&
          !this.currentTransition?.extras.skipLocationChange
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function mM(t) {
  return t !== Pi;
}
var vM = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: () => g(yM), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  fd = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  yM = (() => {
    let e = class e extends fd {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Tn(e)))(o || e);
      };
    })()),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  dv = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: () => g(DM), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  DM = (() => {
    let e = class e extends dv {
      constructor() {
        super(...arguments),
          (this.location = g(Ei)),
          (this.urlSerializer = g(hd)),
          (this.options = g(yd, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = g(Cd)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new nn()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Xm(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof ji) this.stateMemento = this.createStateMemento();
        else if (n instanceof $n) this.rawUrlTree = i.initialUrl;
        else if (n instanceof ha) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof Ui
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl,
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof Rt &&
                (n.code === ze.GuardRejected ||
                  n.code === ze.NoDataFromResolver)
              ? this.restoreHistory(i)
              : n instanceof Bi
                ? this.restoreHistory(i, !0)
                : n instanceof Un &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = m(m({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = m(
            m({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1),
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Tn(e)))(o || e);
      };
    })()),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Oi = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(Oi || {});
function CM(t, e) {
  t.events
    .pipe(
      Ce(
        (r) =>
          r instanceof Un ||
          r instanceof Rt ||
          r instanceof Bi ||
          r instanceof $n,
      ),
      x((r) =>
        r instanceof Un || r instanceof $n
          ? Oi.COMPLETE
          : (
                r instanceof Rt
                  ? r.code === ze.Redirect ||
                    r.code === ze.SupersededByNewNavigation
                  : !1
              )
            ? Oi.REDIRECTING
            : Oi.FAILED,
      ),
      Ce((r) => r !== Oi.REDIRECTING),
      qe(1),
    )
    .subscribe(() => {
      e();
    });
}
function wM(t) {
  throw t;
}
var EM = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  _M = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  fv = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.console = g(ks)),
          (this.stateManager = g(dv)),
          (this.options = g(yd, { optional: !0 }) || {}),
          (this.pendingTasks = g(Rn)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = g(gM)),
          (this.urlSerializer = g(hd)),
          (this.location = g(Ei)),
          (this.urlHandlingStrategy = g(Cd)),
          (this._events = new j()),
          (this.errorHandler = this.options.errorHandler || wM),
          (this.navigated = !1),
          (this.routeReuseStrategy = g(vM)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = g(Dd, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!g(gd, { optional: !0 })),
          (this.eventsSubscription = new ee()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof Rt &&
                  i.code !== ze.Redirect &&
                  i.code !== ze.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof Un) this.navigated = !0;
              else if (i instanceof $r) {
                let a = i.navigationBehaviorOptions,
                  c = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  u = m(
                    {
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        mM(o.source),
                    },
                    a,
                  );
                this.scheduleNavigation(c, Pi, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            IM(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Pi,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            },
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let u = m({}, o);
          delete u.navigationId,
            delete u.ɵrouterPageId,
            Object.keys(u).length !== 0 && (s.state = u);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(md)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: u,
          } = i,
          l = u ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = m(m({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          f = Ym(h);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (f = this.currentUrlTree.root);
        }
        return Qm(f, n, d, l ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = Li(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, Pi, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return bM(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = m({}, EM)) : i === !1 ? (o = m({}, _M)) : (o = i),
          Li(n))
        )
          return Nm(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return Nm(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {},
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, u, l;
        a
          ? ((c = a.resolve), (u = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              (c = f), (u = h);
            }));
        let d = this.pendingTasks.add();
        return (
          CM(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: c,
            reject: u,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function bM(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new w(4008, !1);
}
function IM(t) {
  return !(t instanceof Ui) && !(t instanceof $r);
}
var MM = new C("");
function hv(t, ...e) {
  return Ir([
    { provide: Dd, multi: !0, useValue: t },
    [],
    { provide: Hr, useFactory: SM, deps: [fv] },
    { provide: Ls, multi: !0, useFactory: xM },
    e.map((r) => r.ɵproviders),
  ]);
}
function SM(t) {
  return t.routerState.root;
}
function xM() {
  let t = g(Ye);
  return (e) => {
    let r = t.get(Ln);
    if (e !== r.components[0]) return;
    let n = t.get(fv),
      i = t.get(TM);
    t.get(AM) === 1 && n.initialNavigation(),
      t.get(NM, null, F.Optional)?.setUpPreloading(),
      t.get(MM, null, F.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var TM = new C("", { factory: () => new j() }),
  AM = new C("", { providedIn: "root", factory: () => 1 });
var NM = new C("");
var pv = [];
var gv = { providers: [wm(), Gg({ eventCoalescing: !0 }), hv(pv)] };
var _v = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(Nn), M(ae));
    }),
      (e.ɵdir = se({ type: e }));
    let t = e;
    return t;
  })(),
  OM = (() => {
    let e = class e extends _v {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = Tn(e)))(o || e);
      };
    })()),
      (e.ɵdir = se({ type: e, features: [Ue] }));
    let t = e;
    return t;
  })(),
  bv = new C("");
var RM = { provide: bv, useExisting: qt(() => Na), multi: !0 };
function PM() {
  let t = Nt() ? Nt().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var FM = new C(""),
  Na = (() => {
    let e = class e extends _v {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !PM());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(Nn), M(ae), M(FM, 8));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            Fe("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [xt([RM]), Ue],
      }));
    let t = e;
    return t;
  })();
function on(t) {
  return (
    t == null || ((typeof t == "string" || Array.isArray(t)) && t.length === 0)
  );
}
function Iv(t) {
  return t != null && typeof t.length == "number";
}
var Mv = new C(""),
  Sv = new C(""),
  kM =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  Xi = class {
    static min(e) {
      return LM(e);
    }
    static max(e) {
      return VM(e);
    }
    static required(e) {
      return jM(e);
    }
    static requiredTrue(e) {
      return BM(e);
    }
    static email(e) {
      return UM(e);
    }
    static minLength(e) {
      return $M(e);
    }
    static maxLength(e) {
      return HM(e);
    }
    static pattern(e) {
      return zM(e);
    }
    static nullValidator(e) {
      return xv(e);
    }
    static compose(e) {
      return Pv(e);
    }
    static composeAsync(e) {
      return kv(e);
    }
  };
function LM(t) {
  return (e) => {
    if (on(e.value) || on(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r < t ? { min: { min: t, actual: e.value } } : null;
  };
}
function VM(t) {
  return (e) => {
    if (on(e.value) || on(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r > t ? { max: { max: t, actual: e.value } } : null;
  };
}
function jM(t) {
  return on(t.value) ? { required: !0 } : null;
}
function BM(t) {
  return t.value === !0 ? null : { required: !0 };
}
function UM(t) {
  return on(t.value) || kM.test(t.value) ? null : { email: !0 };
}
function $M(t) {
  return (e) =>
    on(e.value) || !Iv(e.value)
      ? null
      : e.value.length < t
        ? { minlength: { requiredLength: t, actualLength: e.value.length } }
        : null;
}
function HM(t) {
  return (e) =>
    Iv(e.value) && e.value.length > t
      ? { maxlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function zM(t) {
  if (!t) return xv;
  let e, r;
  return (
    typeof t == "string"
      ? ((r = ""),
        t.charAt(0) !== "^" && (r += "^"),
        (r += t),
        t.charAt(t.length - 1) !== "$" && (r += "$"),
        (e = new RegExp(r)))
      : ((r = t.toString()), (e = t)),
    (n) => {
      if (on(n.value)) return null;
      let i = n.value;
      return e.test(i)
        ? null
        : { pattern: { requiredPattern: r, actualValue: i } };
    }
  );
}
function xv(t) {
  return null;
}
function Tv(t) {
  return t != null;
}
function Av(t) {
  return kn(t) ? ne(t) : t;
}
function Nv(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? m(m({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function Ov(t, e) {
  return e.map((r) => r(t));
}
function GM(t) {
  return !t.validate;
}
function Rv(t) {
  return t.map((e) => (GM(e) ? e : (r) => e.validate(r)));
}
function Pv(t) {
  if (!t) return null;
  let e = t.filter(Tv);
  return e.length == 0
    ? null
    : function (r) {
        return Nv(Ov(r, e));
      };
}
function Fv(t) {
  return t != null ? Pv(Rv(t)) : null;
}
function kv(t) {
  if (!t) return null;
  let e = t.filter(Tv);
  return e.length == 0
    ? null
    : function (r) {
        let n = Ov(r, e).map(Av);
        return oc(n).pipe(x(Nv));
      };
}
function Lv(t) {
  return t != null ? kv(Rv(t)) : null;
}
function mv(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function Vv(t) {
  return t._rawValidators;
}
function jv(t) {
  return t._rawAsyncValidators;
}
function wd(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function _a(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function vv(t, e) {
  let r = wd(e);
  return (
    wd(t).forEach((i) => {
      _a(r, i) || r.push(i);
    }),
    r
  );
}
function yv(t, e) {
  return wd(e).filter((r) => !_a(t, r));
}
var ba = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = Fv(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = Lv(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  Zr = class extends ba {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  eo = class extends ba {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  Ia = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  WM = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  d1 = U(m({}, WM), { "[class.ng-submitted]": "isSubmitted" }),
  Bv = (() => {
    let e = class e extends Ia {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(eo, 2));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            Or("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine,
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid,
            )("ng-pending", o.isPending);
        },
        features: [Ue],
      }));
    let t = e;
    return t;
  })(),
  Uv = (() => {
    let e = class e extends Ia {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(Zr, 10));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (i, o) {
          i & 2 &&
            Or("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine,
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid,
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        features: [Ue],
      }));
    let t = e;
    return t;
  })();
var Yi = "VALID",
  Ea = "INVALID",
  Wr = "PENDING",
  Qi = "DISABLED",
  sn = class {},
  Ma = class extends sn {
    constructor(e, r) {
      super(), (this.value = e), (this.source = r);
    }
  },
  Ki = class extends sn {
    constructor(e, r) {
      super(), (this.pristine = e), (this.source = r);
    }
  },
  Ji = class extends sn {
    constructor(e, r) {
      super(), (this.touched = e), (this.source = r);
    }
  },
  qr = class extends sn {
    constructor(e, r) {
      super(), (this.status = e), (this.source = r);
    }
  },
  Ed = class extends sn {
    constructor(e) {
      super(), (this.source = e);
    }
  },
  _d = class extends sn {
    constructor(e) {
      super(), (this.source = e);
    }
  };
function $v(t) {
  return (Oa(t) ? t.validators : t) || null;
}
function qM(t) {
  return Array.isArray(t) ? Fv(t) : t || null;
}
function Hv(t, e) {
  return (Oa(e) ? e.asyncValidators : t) || null;
}
function ZM(t) {
  return Array.isArray(t) ? Lv(t) : t || null;
}
function Oa(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
function YM(t, e, r) {
  let n = t.controls;
  if (!(e ? Object.keys(n) : n).length) throw new w(1e3, "");
  if (!n[r]) throw new w(1001, "");
}
function QM(t, e, r) {
  t._forEachChild((n, i) => {
    if (r[i] === void 0) throw new w(1002, "");
  });
}
var Sa = class {
    constructor(e, r) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = null),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._events = new j()),
        (this.events = this._events.asObservable()),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(r);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === Yi;
    }
    get invalid() {
      return this.status === Ea;
    }
    get pending() {
      return this.status == Wr;
    }
    get disabled() {
      return this.status === Qi;
    }
    get enabled() {
      return this.status !== Qi;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
          ? this.parent.updateOn
          : "change";
    }
    setValidators(e) {
      this._assignValidators(e);
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e);
    }
    addValidators(e) {
      this.setValidators(vv(e, this._rawValidators));
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(vv(e, this._rawAsyncValidators));
    }
    removeValidators(e) {
      this.setValidators(yv(e, this._rawValidators));
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(yv(e, this._rawAsyncValidators));
    }
    hasValidator(e) {
      return _a(this._rawValidators, e);
    }
    hasAsyncValidator(e) {
      return _a(this._rawAsyncValidators, e);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(e = {}) {
      let r = this.touched === !1;
      this.touched = !0;
      let n = e.sourceControl ?? this;
      this._parent &&
        !e.onlySelf &&
        this._parent.markAsTouched(U(m({}, e), { sourceControl: n })),
        r && e.emitEvent !== !1 && this._events.next(new Ji(!0, n));
    }
    markAllAsTouched(e = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: e.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((r) => r.markAllAsTouched(e));
    }
    markAsUntouched(e = {}) {
      let r = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let n = e.sourceControl ?? this;
      this._forEachChild((i) => {
        i.markAsUntouched({
          onlySelf: !0,
          emitEvent: e.emitEvent,
          sourceControl: n,
        });
      }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e, n),
        r && e.emitEvent !== !1 && this._events.next(new Ji(!1, n));
    }
    markAsDirty(e = {}) {
      let r = this.pristine === !0;
      this.pristine = !1;
      let n = e.sourceControl ?? this;
      this._parent &&
        !e.onlySelf &&
        this._parent.markAsDirty(U(m({}, e), { sourceControl: n })),
        r && e.emitEvent !== !1 && this._events.next(new Ki(!1, n));
    }
    markAsPristine(e = {}) {
      let r = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let n = e.sourceControl ?? this;
      this._forEachChild((i) => {
        i.markAsPristine({ onlySelf: !0, emitEvent: e.emitEvent });
      }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e, n),
        r && e.emitEvent !== !1 && this._events.next(new Ki(!0, n));
    }
    markAsPending(e = {}) {
      this.status = Wr;
      let r = e.sourceControl ?? this;
      e.emitEvent !== !1 &&
        (this._events.next(new qr(this.status, r)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !e.onlySelf &&
          this._parent.markAsPending(U(m({}, e), { sourceControl: r }));
    }
    disable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = Qi),
        (this.errors = null),
        this._forEachChild((i) => {
          i.disable(U(m({}, e), { onlySelf: !0 }));
        }),
        this._updateValue();
      let n = e.sourceControl ?? this;
      e.emitEvent !== !1 &&
        (this._events.next(new Ma(this.value, n)),
        this._events.next(new qr(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(U(m({}, e), { skipPristineCheck: r }), this),
        this._onDisabledChange.forEach((i) => i(!0));
    }
    enable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = Yi),
        this._forEachChild((n) => {
          n.enable(U(m({}, e), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors(U(m({}, e), { skipPristineCheck: r }), this),
        this._onDisabledChange.forEach((n) => n(!1));
    }
    _updateAncestors(e, r) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e),
        e.skipPristineCheck || this._parent._updatePristine({}, r),
        this._parent._updateTouched({}, r));
    }
    setParent(e) {
      this._parent = e;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(e = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let n = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === Yi || this.status === Wr) &&
            this._runAsyncValidator(n, e.emitEvent);
      }
      let r = e.sourceControl ?? this;
      e.emitEvent !== !1 &&
        (this._events.next(new Ma(this.value, r)),
        this._events.next(new qr(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !e.onlySelf &&
          this._parent.updateValueAndValidity(
            U(m({}, e), { sourceControl: r }),
          );
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild((r) => r._updateTreeValidity(e)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? Qi : Yi;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(e, r) {
      if (this.asyncValidator) {
        (this.status = Wr),
          (this._hasOwnPendingAsyncValidator = { emitEvent: r !== !1 });
        let n = Av(this.asyncValidator(this));
        this._asyncValidationSubscription = n.subscribe((i) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(i, { emitEvent: r, shouldHaveEmitted: e });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let e = this._hasOwnPendingAsyncValidator?.emitEvent ?? !1;
        return (this._hasOwnPendingAsyncValidator = null), e;
      }
      return !1;
    }
    setErrors(e, r = {}) {
      (this.errors = e),
        this._updateControlsErrors(
          r.emitEvent !== !1,
          this,
          r.shouldHaveEmitted,
        );
    }
    get(e) {
      let r = e;
      return r == null ||
        (Array.isArray(r) || (r = r.split(".")), r.length === 0)
        ? null
        : r.reduce((n, i) => n && n._find(i), this);
    }
    getError(e, r) {
      let n = r ? this.get(r) : this;
      return n && n.errors ? n.errors[e] : null;
    }
    hasError(e, r) {
      return !!this.getError(e, r);
    }
    get root() {
      let e = this;
      for (; e._parent; ) e = e._parent;
      return e;
    }
    _updateControlsErrors(e, r, n) {
      (this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        (e || n) && this._events.next(new qr(this.status, r)),
        this._parent && this._parent._updateControlsErrors(e, r, n);
    }
    _initObservables() {
      (this.valueChanges = new re()), (this.statusChanges = new re());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? Qi
        : this.errors
          ? Ea
          : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Wr)
            ? Wr
            : this._anyControlsHaveStatus(Ea)
              ? Ea
              : Yi;
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls((r) => r.status === e);
    }
    _anyControlsDirty() {
      return this._anyControls((e) => e.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((e) => e.touched);
    }
    _updatePristine(e, r) {
      let n = !this._anyControlsDirty(),
        i = this.pristine !== n;
      (this.pristine = n),
        this._parent && !e.onlySelf && this._parent._updatePristine(e, r),
        i && this._events.next(new Ki(this.pristine, r));
    }
    _updateTouched(e = {}, r) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new Ji(this.touched, r)),
        this._parent && !e.onlySelf && this._parent._updateTouched(e, r);
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e;
    }
    _setUpdateStrategy(e) {
      Oa(e) && e.updateOn != null && (this._updateOn = e.updateOn);
    }
    _parentMarkedDirty(e) {
      let r = this._parent && this._parent.dirty;
      return !e && !!r && !this._parent._anyControlsDirty();
    }
    _find(e) {
      return null;
    }
    _assignValidators(e) {
      (this._rawValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedValidatorFn = qM(this._rawValidators));
    }
    _assignAsyncValidators(e) {
      (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedAsyncValidatorFn = ZM(this._rawAsyncValidators));
    }
  },
  xa = class extends Sa {
    constructor(e, r, n) {
      super($v(r), Hv(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(e, r) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = r),
          r.setParent(this),
          r._registerOnCollectionChange(this._onCollectionChange),
          r);
    }
    addControl(e, r, n = {}) {
      this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(e, r = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    setControl(e, r, n = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        r && this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
    }
    setValue(e, r = {}) {
      QM(this, !0, e),
        Object.keys(e).forEach((n) => {
          YM(this, !0, n),
            this.controls[n].setValue(e[n], {
              onlySelf: !0,
              emitEvent: r.emitEvent,
            });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (Object.keys(e).forEach((n) => {
          let i = this.controls[n];
          i && i.patchValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = {}, r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e ? e[i] : null, { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r, this),
        this._updateTouched(r, this),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (e, r, n) => ((e[n] = r.getRawValue()), e),
      );
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (r, n) =>
        n._syncPendingControls() ? !0 : r,
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach((r) => {
        let n = this.controls[r];
        n && e(n, r);
      });
    }
    _setUpControls() {
      this._forEachChild((e) => {
        e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(e) {
      for (let [r, n] of Object.entries(this.controls))
        if (this.contains(r) && e(n)) return !0;
      return !1;
    }
    _reduceValue() {
      let e = {};
      return this._reduceChildren(
        e,
        (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r),
      );
    }
    _reduceChildren(e, r) {
      let n = e;
      return (
        this._forEachChild((i, o) => {
          n = r(n, i, o);
        }),
        n
      );
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls))
        if (this.controls[e].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
    }
  };
var bd = new C("CallSetDisabledState", {
    providedIn: "root",
    factory: () => Ra,
  }),
  Ra = "always";
function KM(t, e) {
  return [...e.path, t];
}
function Dv(t, e, r = Ra) {
  Id(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    XM(t, e),
    tS(t, e),
    eS(t, e),
    JM(t, e);
}
function Cv(t, e, r = !0) {
  let n = () => {};
  e.valueAccessor &&
    (e.valueAccessor.registerOnChange(n), e.valueAccessor.registerOnTouched(n)),
    Aa(t, e),
    t &&
      (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function Ta(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function JM(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function Id(t, e) {
  let r = Vv(t);
  e.validator !== null
    ? t.setValidators(mv(r, e.validator))
    : typeof r == "function" && t.setValidators([r]);
  let n = jv(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(mv(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  Ta(e._rawValidators, i), Ta(e._rawAsyncValidators, i);
}
function Aa(t, e) {
  let r = !1;
  if (t !== null) {
    if (e.validator !== null) {
      let i = Vv(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.validator);
        o.length !== i.length && ((r = !0), t.setValidators(o));
      }
    }
    if (e.asyncValidator !== null) {
      let i = jv(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.asyncValidator);
        o.length !== i.length && ((r = !0), t.setAsyncValidators(o));
      }
    }
  }
  let n = () => {};
  return Ta(e._rawValidators, n), Ta(e._rawAsyncValidators, n), r;
}
function XM(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && zv(t, e);
  });
}
function eS(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && zv(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function zv(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function tS(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function nS(t, e) {
  t == null, Id(t, e);
}
function rS(t, e) {
  return Aa(t, e);
}
function iS(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function oS(t) {
  return Object.getPrototypeOf(t.constructor) === OM;
}
function sS(t, e) {
  t._syncPendingControls(),
    e.forEach((r) => {
      let n = r.control;
      n.updateOn === "submit" &&
        n._pendingChange &&
        (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1));
    });
}
function aS(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === Na ? (r = o) : oS(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
function cS(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function wv(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Ev(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var Md = class extends Sa {
  constructor(e = null, r, n) {
    super($v(r), Hv(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Oa(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (Ev(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1),
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    wv(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    wv(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    Ev(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var uS = (t) => t instanceof Md;
var Gv = new C("");
var lS = { provide: Zr, useExisting: qt(() => Sd) },
  Sd = (() => {
    let e = class e extends Zr {
      constructor(n, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new re()),
          this._setValidators(n),
          this._setAsyncValidators(i);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Aa(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let i = this.form.get(n.path);
        return (
          Dv(i, n, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          i
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        Cv(n.control || null, n, !1), cS(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        this.form.get(n.path).setValue(i);
      }
      onSubmit(n) {
        return (
          (this.submitted = !0),
          sS(this.form, this.directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Ed(this.control)),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n),
          (this.submitted = !1),
          this.form._events.next(new _d(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let i = n.control,
            o = this.form.get(n.path);
          i !== o &&
            (Cv(i || null, n),
            uS(o) && (Dv(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let i = this.form.get(n.path);
        nS(i, n), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let i = this.form.get(n.path);
          i && rS(i, n) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        Id(this.form, this), this._oldForm && Aa(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(Mv, 10), M(Sv, 10), M(bd, 8));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (i, o) {
          i & 1 &&
            Fe("submit", function (a) {
              return o.onSubmit(a);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { form: [0, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [xt([lS]), Ue, je],
      }));
    let t = e;
    return t;
  })();
var dS = { provide: eo, useExisting: qt(() => xd) },
  xd = (() => {
    let e = class e extends eo {
      set isDisabled(n) {}
      constructor(n, i, o, s, a) {
        super(),
          (this._ngModelWarningConfig = a),
          (this._added = !1),
          (this.name = null),
          (this.update = new re()),
          (this._ngModelWarningSent = !1),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = aS(this, s));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          iS(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return KM(
          this.name == null ? this.name : this.name.toString(),
          this._parent,
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
    };
    (e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (i) {
        return new (i || e)(
          M(Zr, 13),
          M(Mv, 10),
          M(Sv, 10),
          M(bv, 10),
          M(Gv, 8),
        );
      }),
      (e.ɵdir = se({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: [0, "formControlName", "name"],
          isDisabled: [0, "disabled", "isDisabled"],
          model: [0, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        features: [xt([dS]), Ue, je],
      }));
    let t = e;
    return t;
  })();
var Wv = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Ie({ type: e })),
    (e.ɵinj = be({}));
  let t = e;
  return t;
})();
var qv = (() => {
    let e = class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [{ provide: bd, useValue: n.callSetDisabledState ?? Ra }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = be({ imports: [Wv] }));
    let t = e;
    return t;
  })(),
  Zv = (() => {
    let e = class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [
            {
              provide: Gv,
              useValue: n.warnOnNgModelWithFormControl ?? "always",
            },
            { provide: bd, useValue: n.callSetDisabledState ?? Ra },
          ],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = be({ imports: [Wv] }));
    let t = e;
    return t;
  })();
var hS = (t) => ({ "prev-page--disabled": t }),
  Yv = (() => {
    let e = class e {
      constructor() {
        (this.page = An.required()), (this.pageChanged = xp());
      }
      get prevPageDisabled() {
        return this.page() <= 1;
      }
      prevPage() {
        this.prevPageDisabled || this.pageChanged.emit(this.page() - 1);
      }
      nextPage() {
        this.pageChanged.emit(this.page() + 1);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵcmp = Qe({
        type: e,
        selectors: [["app-paginator"]],
        inputs: { page: [1, "page"] },
        outputs: { pageChanged: "pageChanged" },
        standalone: !0,
        features: [Xe],
        decls: 6,
        vars: 4,
        consts: [
          [1, "paginator"],
          [1, "prev-page", 3, "click", "ngClass"],
          [1, "next-page", 3, "click"],
        ],
        template: function (i, o) {
          i & 1 &&
            (R(0, "div", 0)(1, "span", 1),
            Fe("click", function () {
              return o.prevPage();
            }),
            H(2, " < "),
            L(),
            H(3),
            R(4, "span", 2),
            Fe("click", function () {
              return o.nextPage();
            }),
            H(5, " > "),
            L()()),
            i & 2 &&
              (Z(),
              Re("ngClass", kg(2, hS, o.prevPageDisabled)),
              Z(2),
              Pr(" ", o.page(), " "));
        },
        dependencies: [wl, am],
        styles: [
          "[_nghost-%COMP%]   .paginator[_ngcontent-%COMP%]{display:flex;flex-direction:row;gap:12px}[_nghost-%COMP%]   .paginator[_ngcontent-%COMP%]   .prev-page[_ngcontent-%COMP%], [_nghost-%COMP%]   .paginator[_ngcontent-%COMP%]   .next-page[_ngcontent-%COMP%]{cursor:pointer}[_nghost-%COMP%]   .paginator[_ngcontent-%COMP%]   .prev-page--disabled[_ngcontent-%COMP%], [_nghost-%COMP%]   .paginator[_ngcontent-%COMP%]   .next-page--disabled[_ngcontent-%COMP%]{cursor:default;color:#d3d3d3}",
        ],
        changeDetection: 0,
      }));
    let t = e;
    return t;
  })();
var Pa = class t {
  constructor(e = {}) {
    Object.assign(this, e);
  }
  get imageSrc() {
    return `${this.image}?id=${this.login?.uuid}`;
  }
  static mapFromUserResult(e) {
    return e.map(
      (r) =>
        new t({
          firstname: r.name.first,
          lastname: r.name.last,
          email: r.email,
          phone: r.phone,
          image: r.picture.medium,
          nat: r.nat,
          login: r.login,
          age: r.dob.age,
          dateOfBirth: new Date(r.dob.date),
          address: {
            state: r.location.state,
            street: `${r.location.street.name}, ${r.location.street.number}`,
            zipCode: r.location.postcode.toString().padStart(5, "0"),
            country: r.location.country,
          },
        }),
    );
  }
};
var Fa = class {
    constructor() {
      (this.users = []), (this.users$ = new j());
    }
  },
  ka = (() => {
    let e = class e {
      get users() {
        return this.state.users;
      }
      get users$() {
        return this.state.users$.asObservable();
      }
      constructor(n) {
        (this.httpClient = n),
          (this.apiUrl = "https://randomuser.me/api"),
          (this.state = new Fa());
      }
      getUsers(n = 1) {
        return this.httpClient
          .get(`${this.apiUrl}?results=5000&seed=awork&page=${n}`)
          .pipe(
            x((i) => {
              let o = Pa.mapFromUserResult(i.results);
              (this.state.users = o), this.state.users$.next(o);
            }),
          );
      }
      reset() {
        this.state = new Fa();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(xl));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var pS = ["userDetails"],
  Qv = (() => {
    let e = class e {
      constructor() {
        (this.user = An.required()), (this.usersService = g(ka));
      }
      get nationalitiesCount() {
        return this.usersService.users.length
          ? this.usersService.users.reduce(
              (n, i) => (i.nat === this.user().nat ? n + 1 : n),
              0,
            )
          : 0;
      }
      ngOnChanges(n) {
        n.user.previousValue &&
          this.detailsRef.nativeElement.classList.remove("show");
      }
      toggleDetails() {
        this.detailsRef.nativeElement.classList.toggle("show");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵcmp = Qe({
        type: e,
        selectors: [["app-user-item"]],
        viewQuery: function (i, o) {
          if ((i & 1 && Rr(pS, 5, ae), i & 2)) {
            let s;
            Pn((s = Fn())) && (o.detailsRef = s.first);
          }
        },
        inputs: { user: [1, "user"] },
        standalone: !0,
        features: [je, Xe],
        decls: 38,
        vars: 15,
        consts: [
          ["userDetails", ""],
          [1, "user-item", 3, "click"],
          [1, "user-summary"],
          [1, "user-item__image", 3, "src"],
          [1, "user-item__name"],
          [1, "user-item__email"],
          [1, "user-item__phone"],
          [1, "user-item__nat"],
          [1, "user-details"],
          [1, "user-details__address"],
          [1, "user-details__line"],
          [1, "user-details__hint"],
          [1, "user-details__street"],
          [1, "user-details__zipcode"],
          [1, "user-details__state"],
          [1, "user-details__country"],
          [1, "user-details__dob"],
        ],
        template: function (i, o) {
          if (i & 1) {
            let s = Ps();
            R(0, "div", 1),
              Fe("click", function () {
                return Sr(s), xr(o.toggleDetails());
              }),
              R(1, "div", 2),
              Pe(2, "img", 3),
              R(3, "span", 4),
              H(4),
              L(),
              R(5, "span", 5),
              H(6),
              L(),
              R(7, "span", 6),
              H(8),
              L(),
              R(9, "span", 7),
              H(10),
              L()(),
              R(11, "div", 8, 0)(13, "div", 9)(14, "div", 10)(15, "span", 11),
              H(16, "Street"),
              L(),
              R(17, "span", 12),
              H(18),
              L(),
              R(19, "span", 11),
              H(20, "Zipcode"),
              L(),
              R(21, "span", 13),
              H(22),
              L()(),
              R(23, "div", 10)(24, "span", 11),
              H(25, "State"),
              L(),
              R(26, "span", 14),
              H(27),
              L(),
              R(28, "span", 11),
              H(29, "Country"),
              L(),
              R(30, "span", 15),
              H(31),
              L()()(),
              R(32, "div", 16)(33, "span", 11),
              H(34, "Date of Birth"),
              L(),
              R(35, "span"),
              H(36),
              Vg(37, "date"),
              L()()()();
          }
          if (i & 2) {
            let s, a, c, u;
            Z(2),
              Re("src", o.user().image, Vp),
              Z(2),
              Fs("", o.user().firstname, " ", o.user().lastname, ""),
              Z(2),
              ut(o.user().email),
              Z(2),
              ut(o.user().phone),
              Z(2),
              Fs("", o.user().nat, " (", o.nationalitiesCount, ")"),
              Z(8),
              ut((s = o.user().address) == null ? null : s.street),
              Z(4),
              ut((a = o.user().address) == null ? null : a.zipCode),
              Z(5),
              ut((c = o.user().address) == null ? null : c.state),
              Z(4),
              ut((u = o.user().address) == null ? null : u.country),
              Z(5),
              ut(jg(37, 12, o.user().dateOfBirth, "dd/MM/yyyy"));
          }
        },
        dependencies: [cm],
        styles: [
          '[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]{align-items:center;box-sizing:border-box;display:flex;flex-direction:column;flex-wrap:nowrap;padding:12px;color:var(--color-night)}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]{display:flex;width:100%}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]{flex-direction:column}}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__image[_ngcontent-%COMP%]{border-radius:20%;height:40px;width:40px}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__image[_ngcontent-%COMP%]{align-self:center;height:60px;width:60px}}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__name[_ngcontent-%COMP%], [_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__email[_ngcontent-%COMP%], [_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__phone[_ngcontent-%COMP%]{margin:12px;overflow:hidden;text-overflow:ellipsis;text-align:left;white-space:nowrap}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__name[_ngcontent-%COMP%]{flex:1;min-width:100px}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__email[_ngcontent-%COMP%]{width:220px}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__phone[_ngcontent-%COMP%]{width:110px}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__nat[_ngcontent-%COMP%]{margin-left:12px;text-align:right;width:80px;height:fit-content;margin-top:auto;margin-bottom:auto}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-summary[_ngcontent-%COMP%]   .user-item__nat[_ngcontent-%COMP%]{text-align:left}}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details[_ngcontent-%COMP%]{max-height:0;width:100%;overflow:hidden;transition:max-height .5s ease-out,opacity .5s ease-out;opacity:0;flex-direction:row;display:flex}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details[_ngcontent-%COMP%]{flex-direction:column}}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details.show[_ngcontent-%COMP%]{padding:12px;max-height:100px;opacity:1;transition:max-height .5s ease-in,opacity .5s ease-in}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__line[_ngcontent-%COMP%]{display:flex;flex-direction:row;gap:4px}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__hint[_ngcontent-%COMP%]{font-size:11px;line-height:14px;color:#a1bbe5;display:flex;flex-direction:row;margin:auto 0}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__hint[_ngcontent-%COMP%]:after{content:":"}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__address[_ngcontent-%COMP%]{width:50%}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__address[_ngcontent-%COMP%]{width:100%}}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__dob[_ngcontent-%COMP%]{width:fit-content;margin-left:auto}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__dob[_ngcontent-%COMP%]{margin-left:0;padding-top:16px}}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__street[_ngcontent-%COMP%], [_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__state[_ngcontent-%COMP%]{margin-right:16px}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__street[_ngcontent-%COMP%], [_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__state[_ngcontent-%COMP%]{margin-right:auto}}[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__zipcode[_ngcontent-%COMP%]{margin-right:auto}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-item[_ngcontent-%COMP%]   .user-details__zipcode[_ngcontent-%COMP%]{margin-right:0}}',
        ],
        changeDetection: 0,
      }));
    let t = e;
    return t;
  })();
function to(t, e = 0) {
  return gS(t) ? Number(t) : arguments.length === 2 ? e : 0;
}
function gS(t) {
  return !isNaN(parseFloat(t)) && !isNaN(Number(t));
}
function Kv(t) {
  return t instanceof ae ? t.nativeElement : t;
}
var Td;
try {
  Td = typeof Intl < "u" && Intl.v8BreakIterator;
} catch {
  Td = !1;
}
var no = (() => {
  let e = class e {
    constructor(n) {
      (this._platformId = n),
        (this.isBrowser = this._platformId
          ? um(this._platformId)
          : typeof document == "object" && !!document),
        (this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent)),
        (this.TRIDENT =
          this.isBrowser && /(msie|trident)/i.test(navigator.userAgent)),
        (this.BLINK =
          this.isBrowser &&
          !!(window.chrome || Td) &&
          typeof CSS < "u" &&
          !this.EDGE &&
          !this.TRIDENT),
        (this.WEBKIT =
          this.isBrowser &&
          /AppleWebKit/i.test(navigator.userAgent) &&
          !this.BLINK &&
          !this.EDGE &&
          !this.TRIDENT),
        (this.IOS =
          this.isBrowser &&
          /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          !("MSStream" in window)),
        (this.FIREFOX =
          this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent)),
        (this.ANDROID =
          this.isBrowser &&
          /android/i.test(navigator.userAgent) &&
          !this.TRIDENT),
        (this.SAFARI =
          this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(_(ct));
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var ft = (function (t) {
    return (
      (t[(t.NORMAL = 0)] = "NORMAL"),
      (t[(t.NEGATED = 1)] = "NEGATED"),
      (t[(t.INVERTED = 2)] = "INVERTED"),
      t
    );
  })(ft || {}),
  La,
  Hn;
function Jv() {
  if (Hn == null) {
    if (
      typeof document != "object" ||
      !document ||
      typeof Element != "function" ||
      !Element
    )
      return (Hn = !1), Hn;
    if ("scrollBehavior" in document.documentElement.style) Hn = !0;
    else {
      let t = Element.prototype.scrollTo;
      t ? (Hn = !/\{\s*\[native code\]\s*\}/.test(t.toString())) : (Hn = !1);
    }
  }
  return Hn;
}
function Yr() {
  if (typeof document != "object" || !document) return ft.NORMAL;
  if (La == null) {
    let t = document.createElement("div"),
      e = t.style;
    (t.dir = "rtl"),
      (e.width = "1px"),
      (e.overflow = "auto"),
      (e.visibility = "hidden"),
      (e.pointerEvents = "none"),
      (e.position = "absolute");
    let r = document.createElement("div"),
      n = r.style;
    (n.width = "2px"),
      (n.height = "1px"),
      t.appendChild(r),
      document.body.appendChild(t),
      (La = ft.NORMAL),
      t.scrollLeft === 0 &&
        ((t.scrollLeft = 1),
        (La = t.scrollLeft === 0 ? ft.NEGATED : ft.INVERTED)),
      t.remove();
  }
  return La;
}
var vS = new C("cdk-dir-doc", { providedIn: "root", factory: yS });
function yS() {
  return g(le);
}
var DS =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function CS(t) {
  let e = t?.toLowerCase() || "";
  return e === "auto" && typeof navigator < "u" && navigator?.language
    ? DS.test(navigator.language)
      ? "rtl"
      : "ltr"
    : e === "rtl"
      ? "rtl"
      : "ltr";
}
var Va = (() => {
  let e = class e {
    constructor(n) {
      if (((this.value = "ltr"), (this.change = new re()), n)) {
        let i = n.body ? n.body.dir : null,
          o = n.documentElement ? n.documentElement.dir : null;
        this.value = CS(i || o || "ltr");
      }
    }
    ngOnDestroy() {
      this.change.complete();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(_(vS, 8));
  }),
    (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Ad = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Ie({ type: e })),
    (e.ɵinj = be({}));
  let t = e;
  return t;
})();
var Nd = class {};
function Xv(t) {
  return t && typeof t.connect == "function" && !(t instanceof Pt);
}
var ja = class extends Nd {
    constructor(e) {
      super(), (this._data = e);
    }
    connect() {
      return dn(this._data) ? this._data : I(this._data);
    }
    disconnect() {}
  },
  ro = (function (t) {
    return (
      (t[(t.REPLACED = 0)] = "REPLACED"),
      (t[(t.INSERTED = 1)] = "INSERTED"),
      (t[(t.MOVED = 2)] = "MOVED"),
      (t[(t.REMOVED = 3)] = "REMOVED"),
      t
    );
  })(ro || {}),
  Od = new C("_ViewRepeater");
var Ba = class {
  constructor() {
    (this.viewCacheSize = 20), (this._viewCache = []);
  }
  applyChanges(e, r, n, i, o) {
    e.forEachOperation((s, a, c) => {
      let u, l;
      if (s.previousIndex == null) {
        let d = () => n(s, a, c);
        (u = this._insertView(d, c, r, i(s))),
          (l = u ? ro.INSERTED : ro.REPLACED);
      } else
        c == null
          ? (this._detachAndCacheView(a, r), (l = ro.REMOVED))
          : ((u = this._moveView(a, c, r, i(s))), (l = ro.MOVED));
      o && o({ context: u?.context, operation: l, record: s });
    });
  }
  detach() {
    for (let e of this._viewCache) e.destroy();
    this._viewCache = [];
  }
  _insertView(e, r, n, i) {
    let o = this._insertViewFromCache(r, n);
    if (o) {
      o.context.$implicit = i;
      return;
    }
    let s = e();
    return n.createEmbeddedView(s.templateRef, s.context, s.index);
  }
  _detachAndCacheView(e, r) {
    let n = r.detach(e);
    this._maybeCacheView(n, r);
  }
  _moveView(e, r, n, i) {
    let o = n.get(e);
    return n.move(o, r), (o.context.$implicit = i), o;
  }
  _maybeCacheView(e, r) {
    if (this._viewCache.length < this.viewCacheSize) this._viewCache.push(e);
    else {
      let n = r.indexOf(e);
      n === -1 ? e.destroy() : r.remove(n);
    }
  }
  _insertViewFromCache(e, r) {
    let n = this._viewCache.pop();
    return n && r.insert(n, e), n || null;
  }
};
var ES = ["contentWrapper"],
  _S = ["*"],
  ry = new C("VIRTUAL_SCROLL_STRATEGY"),
  Rd = class {
    constructor(e, r, n) {
      (this._scrolledIndexChange = new j()),
        (this.scrolledIndexChange = this._scrolledIndexChange.pipe(ac())),
        (this._viewport = null),
        (this._itemSize = e),
        (this._minBufferPx = r),
        (this._maxBufferPx = n);
    }
    attach(e) {
      (this._viewport = e),
        this._updateTotalContentSize(),
        this._updateRenderedRange();
    }
    detach() {
      this._scrolledIndexChange.complete(), (this._viewport = null);
    }
    updateItemAndBufferSize(e, r, n) {
      n < r,
        (this._itemSize = e),
        (this._minBufferPx = r),
        (this._maxBufferPx = n),
        this._updateTotalContentSize(),
        this._updateRenderedRange();
    }
    onContentScrolled() {
      this._updateRenderedRange();
    }
    onDataLengthChanged() {
      this._updateTotalContentSize(), this._updateRenderedRange();
    }
    onContentRendered() {}
    onRenderedOffsetChanged() {}
    scrollToIndex(e, r) {
      this._viewport && this._viewport.scrollToOffset(e * this._itemSize, r);
    }
    _updateTotalContentSize() {
      this._viewport &&
        this._viewport.setTotalContentSize(
          this._viewport.getDataLength() * this._itemSize,
        );
    }
    _updateRenderedRange() {
      if (!this._viewport) return;
      let e = this._viewport.getRenderedRange(),
        r = { start: e.start, end: e.end },
        n = this._viewport.getViewportSize(),
        i = this._viewport.getDataLength(),
        o = this._viewport.measureScrollOffset(),
        s = this._itemSize > 0 ? o / this._itemSize : 0;
      if (r.end > i) {
        let c = Math.ceil(n / this._itemSize),
          u = Math.max(0, Math.min(s, i - c));
        s != u &&
          ((s = u), (o = u * this._itemSize), (r.start = Math.floor(s))),
          (r.end = Math.max(0, Math.min(i, r.start + c)));
      }
      let a = o - r.start * this._itemSize;
      if (a < this._minBufferPx && r.start != 0) {
        let c = Math.ceil((this._maxBufferPx - a) / this._itemSize);
        (r.start = Math.max(0, r.start - c)),
          (r.end = Math.min(
            i,
            Math.ceil(s + (n + this._minBufferPx) / this._itemSize),
          ));
      } else {
        let c = r.end * this._itemSize - (o + n);
        if (c < this._minBufferPx && r.end != i) {
          let u = Math.ceil((this._maxBufferPx - c) / this._itemSize);
          u > 0 &&
            ((r.end = Math.min(i, r.end + u)),
            (r.start = Math.max(
              0,
              Math.floor(s - this._minBufferPx / this._itemSize),
            )));
        }
      }
      this._viewport.setRenderedRange(r),
        this._viewport.setRenderedContentOffset(this._itemSize * r.start),
        this._scrolledIndexChange.next(Math.floor(s));
    }
  };
function bS(t) {
  return t._scrollStrategy;
}
var iy = (() => {
    let e = class e {
      constructor() {
        (this._itemSize = 20),
          (this._minBufferPx = 100),
          (this._maxBufferPx = 200),
          (this._scrollStrategy = new Rd(
            this.itemSize,
            this.minBufferPx,
            this.maxBufferPx,
          ));
      }
      get itemSize() {
        return this._itemSize;
      }
      set itemSize(n) {
        this._itemSize = to(n);
      }
      get minBufferPx() {
        return this._minBufferPx;
      }
      set minBufferPx(n) {
        this._minBufferPx = to(n);
      }
      get maxBufferPx() {
        return this._maxBufferPx;
      }
      set maxBufferPx(n) {
        this._maxBufferPx = to(n);
      }
      ngOnChanges() {
        this._scrollStrategy.updateItemAndBufferSize(
          this.itemSize,
          this.minBufferPx,
          this.maxBufferPx,
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [["cdk-virtual-scroll-viewport", "itemSize", ""]],
        inputs: {
          itemSize: "itemSize",
          minBufferPx: "minBufferPx",
          maxBufferPx: "maxBufferPx",
        },
        standalone: !0,
        features: [
          xt([{ provide: ry, useFactory: bS, deps: [qt(() => e)] }]),
          je,
        ],
      }));
    let t = e;
    return t;
  })(),
  IS = 20,
  Pd = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngZone = n),
          (this._platform = i),
          (this._scrolled = new j()),
          (this._globalSubscription = null),
          (this._scrolledCount = 0),
          (this.scrollContainers = new Map()),
          (this._document = o);
      }
      register(n) {
        this.scrollContainers.has(n) ||
          this.scrollContainers.set(
            n,
            n.elementScrolled().subscribe(() => this._scrolled.next(n)),
          );
      }
      deregister(n) {
        let i = this.scrollContainers.get(n);
        i && (i.unsubscribe(), this.scrollContainers.delete(n));
      }
      scrolled(n = IS) {
        return this._platform.isBrowser
          ? new N((i) => {
              this._globalSubscription || this._addGlobalListener();
              let o =
                n > 0
                  ? this._scrolled.pipe(ti(n)).subscribe(i)
                  : this._scrolled.subscribe(i);
              return (
                this._scrolledCount++,
                () => {
                  o.unsubscribe(),
                    this._scrolledCount--,
                    this._scrolledCount || this._removeGlobalListener();
                }
              );
            })
          : I();
      }
      ngOnDestroy() {
        this._removeGlobalListener(),
          this.scrollContainers.forEach((n, i) => this.deregister(i)),
          this._scrolled.complete();
      }
      ancestorScrolled(n, i) {
        let o = this.getAncestorScrollContainers(n);
        return this.scrolled(i).pipe(Ce((s) => !s || o.indexOf(s) > -1));
      }
      getAncestorScrollContainers(n) {
        let i = [];
        return (
          this.scrollContainers.forEach((o, s) => {
            this._scrollableContainsElement(s, n) && i.push(s);
          }),
          i
        );
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _scrollableContainsElement(n, i) {
        let o = Kv(i),
          s = n.getElementRef().nativeElement;
        do if (o == s) return !0;
        while ((o = o.parentElement));
        return !1;
      }
      _addGlobalListener() {
        this._globalSubscription = this._ngZone.runOutsideAngular(() => {
          let n = this._getWindow();
          return nr(n.document, "scroll").subscribe(() =>
            this._scrolled.next(),
          );
        });
      }
      _removeGlobalListener() {
        this._globalSubscription &&
          (this._globalSubscription.unsubscribe(),
          (this._globalSubscription = null));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(W), _(no), _(le, 8));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  oy = (() => {
    let e = class e {
      constructor(n, i, o, s) {
        (this.elementRef = n),
          (this.scrollDispatcher = i),
          (this.ngZone = o),
          (this.dir = s),
          (this._destroyed = new j()),
          (this._elementScrolled = new N((a) =>
            this.ngZone.runOutsideAngular(() =>
              nr(this.elementRef.nativeElement, "scroll")
                .pipe(rt(this._destroyed))
                .subscribe(a),
            ),
          ));
      }
      ngOnInit() {
        this.scrollDispatcher.register(this);
      }
      ngOnDestroy() {
        this.scrollDispatcher.deregister(this),
          this._destroyed.next(),
          this._destroyed.complete();
      }
      elementScrolled() {
        return this._elementScrolled;
      }
      getElementRef() {
        return this.elementRef;
      }
      scrollTo(n) {
        let i = this.elementRef.nativeElement,
          o = this.dir && this.dir.value == "rtl";
        n.left == null && (n.left = o ? n.end : n.start),
          n.right == null && (n.right = o ? n.start : n.end),
          n.bottom != null &&
            (n.top = i.scrollHeight - i.clientHeight - n.bottom),
          o && Yr() != ft.NORMAL
            ? (n.left != null &&
                (n.right = i.scrollWidth - i.clientWidth - n.left),
              Yr() == ft.INVERTED
                ? (n.left = n.right)
                : Yr() == ft.NEGATED && (n.left = n.right ? -n.right : n.right))
            : n.right != null &&
              (n.left = i.scrollWidth - i.clientWidth - n.right),
          this._applyScrollToOptions(n);
      }
      _applyScrollToOptions(n) {
        let i = this.elementRef.nativeElement;
        Jv()
          ? i.scrollTo(n)
          : (n.top != null && (i.scrollTop = n.top),
            n.left != null && (i.scrollLeft = n.left));
      }
      measureScrollOffset(n) {
        let i = "left",
          o = "right",
          s = this.elementRef.nativeElement;
        if (n == "top") return s.scrollTop;
        if (n == "bottom") return s.scrollHeight - s.clientHeight - s.scrollTop;
        let a = this.dir && this.dir.value == "rtl";
        return (
          n == "start" ? (n = a ? o : i) : n == "end" && (n = a ? i : o),
          a && Yr() == ft.INVERTED
            ? n == i
              ? s.scrollWidth - s.clientWidth - s.scrollLeft
              : s.scrollLeft
            : a && Yr() == ft.NEGATED
              ? n == i
                ? s.scrollLeft + s.scrollWidth - s.clientWidth
                : -s.scrollLeft
              : n == i
                ? s.scrollLeft
                : s.scrollWidth - s.clientWidth - s.scrollLeft
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(ae), M(Pd), M(W), M(Va, 8));
    }),
      (e.ɵdir = se({
        type: e,
        selectors: [
          ["", "cdk-scrollable", ""],
          ["", "cdkScrollable", ""],
        ],
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  MS = 20,
  SS = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._platform = n),
          (this._change = new j()),
          (this._changeListener = (s) => {
            this._change.next(s);
          }),
          (this._document = o),
          i.runOutsideAngular(() => {
            if (n.isBrowser) {
              let s = this._getWindow();
              s.addEventListener("resize", this._changeListener),
                s.addEventListener("orientationchange", this._changeListener);
            }
            this.change().subscribe(() => (this._viewportSize = null));
          });
      }
      ngOnDestroy() {
        if (this._platform.isBrowser) {
          let n = this._getWindow();
          n.removeEventListener("resize", this._changeListener),
            n.removeEventListener("orientationchange", this._changeListener);
        }
        this._change.complete();
      }
      getViewportSize() {
        this._viewportSize || this._updateViewportSize();
        let n = {
          width: this._viewportSize.width,
          height: this._viewportSize.height,
        };
        return this._platform.isBrowser || (this._viewportSize = null), n;
      }
      getViewportRect() {
        let n = this.getViewportScrollPosition(),
          { width: i, height: o } = this.getViewportSize();
        return {
          top: n.top,
          left: n.left,
          bottom: n.top + o,
          right: n.left + i,
          height: o,
          width: i,
        };
      }
      getViewportScrollPosition() {
        if (!this._platform.isBrowser) return { top: 0, left: 0 };
        let n = this._document,
          i = this._getWindow(),
          o = n.documentElement,
          s = o.getBoundingClientRect(),
          a = -s.top || n.body.scrollTop || i.scrollY || o.scrollTop || 0,
          c = -s.left || n.body.scrollLeft || i.scrollX || o.scrollLeft || 0;
        return { top: a, left: c };
      }
      change(n = MS) {
        return n > 0 ? this._change.pipe(ti(n)) : this._change;
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _updateViewportSize() {
        let n = this._getWindow();
        this._viewportSize = this._platform.isBrowser
          ? { width: n.innerWidth, height: n.innerHeight }
          : { width: 0, height: 0 };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(_(no), _(W), _(le, 8));
    }),
      (e.ɵprov = E({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ey = new C("VIRTUAL_SCROLLABLE"),
  xS = (() => {
    let e = class e extends oy {
      constructor(n, i, o, s) {
        super(n, i, o, s);
      }
      measureViewportSize(n) {
        let i = this.elementRef.nativeElement;
        return n === "horizontal" ? i.clientWidth : i.clientHeight;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(M(ae), M(Pd), M(W), M(Va, 8));
    }),
      (e.ɵdir = se({ type: e, features: [Ue] }));
    let t = e;
    return t;
  })();
function TS(t, e) {
  return t.start == e.start && t.end == e.end;
}
var AS = typeof requestAnimationFrame < "u" ? rc : tc,
  Fd = (() => {
    let e = class e extends xS {
      get orientation() {
        return this._orientation;
      }
      set orientation(n) {
        this._orientation !== n &&
          ((this._orientation = n), this._calculateSpacerSize());
      }
      constructor(n, i, o, s, a, c, u, l) {
        super(n, c, o, a),
          (this.elementRef = n),
          (this._changeDetectorRef = i),
          (this._scrollStrategy = s),
          (this.scrollable = l),
          (this._platform = g(no)),
          (this._detachedSubject = new j()),
          (this._renderedRangeSubject = new j()),
          (this._orientation = "vertical"),
          (this.appendOnly = !1),
          (this.scrolledIndexChange = new N((d) =>
            this._scrollStrategy.scrolledIndexChange.subscribe((f) =>
              Promise.resolve().then(() => this.ngZone.run(() => d.next(f))),
            ),
          )),
          (this.renderedRangeStream = this._renderedRangeSubject),
          (this._totalContentSize = 0),
          (this._totalContentWidth = ""),
          (this._totalContentHeight = ""),
          (this._renderedRange = { start: 0, end: 0 }),
          (this._dataLength = 0),
          (this._viewportSize = 0),
          (this._renderedContentOffset = 0),
          (this._renderedContentOffsetNeedsRewrite = !1),
          (this._isChangeDetectionPending = !1),
          (this._runAfterChangeDetection = []),
          (this._viewportChanges = ee.EMPTY),
          (this._injector = g(Ye)),
          (this._isDestroyed = !1),
          (this._viewportChanges = u.change().subscribe(() => {
            this.checkViewportSize();
          })),
          this.scrollable ||
            (this.elementRef.nativeElement.classList.add(
              "cdk-virtual-scrollable",
            ),
            (this.scrollable = this));
      }
      ngOnInit() {
        this._platform.isBrowser &&
          (this.scrollable === this && super.ngOnInit(),
          this.ngZone.runOutsideAngular(() =>
            Promise.resolve().then(() => {
              this._measureViewportSize(),
                this._scrollStrategy.attach(this),
                this.scrollable
                  .elementScrolled()
                  .pipe(ir(null), ti(0, AS), rt(this._destroyed))
                  .subscribe(() => this._scrollStrategy.onContentScrolled()),
                this._markChangeDetectionNeeded();
            }),
          ));
      }
      ngOnDestroy() {
        this.detach(),
          this._scrollStrategy.detach(),
          this._renderedRangeSubject.complete(),
          this._detachedSubject.complete(),
          this._viewportChanges.unsubscribe(),
          (this._isDestroyed = !0),
          super.ngOnDestroy();
      }
      attach(n) {
        this._forOf,
          this.ngZone.runOutsideAngular(() => {
            (this._forOf = n),
              this._forOf.dataStream
                .pipe(rt(this._detachedSubject))
                .subscribe((i) => {
                  let o = i.length;
                  o !== this._dataLength &&
                    ((this._dataLength = o),
                    this._scrollStrategy.onDataLengthChanged()),
                    this._doChangeDetection();
                });
          });
      }
      detach() {
        (this._forOf = null), this._detachedSubject.next();
      }
      getDataLength() {
        return this._dataLength;
      }
      getViewportSize() {
        return this._viewportSize;
      }
      getRenderedRange() {
        return this._renderedRange;
      }
      measureBoundingClientRectWithScrollOffset(n) {
        return this.getElementRef().nativeElement.getBoundingClientRect()[n];
      }
      setTotalContentSize(n) {
        this._totalContentSize !== n &&
          ((this._totalContentSize = n),
          this._calculateSpacerSize(),
          this._markChangeDetectionNeeded());
      }
      setRenderedRange(n) {
        TS(this._renderedRange, n) ||
          (this.appendOnly &&
            (n = { start: 0, end: Math.max(this._renderedRange.end, n.end) }),
          this._renderedRangeSubject.next((this._renderedRange = n)),
          this._markChangeDetectionNeeded(() =>
            this._scrollStrategy.onContentRendered(),
          ));
      }
      getOffsetToRenderedContentStart() {
        return this._renderedContentOffsetNeedsRewrite
          ? null
          : this._renderedContentOffset;
      }
      setRenderedContentOffset(n, i = "to-start") {
        n = this.appendOnly && i === "to-start" ? 0 : n;
        let o = this.dir && this.dir.value == "rtl",
          s = this.orientation == "horizontal",
          a = s ? "X" : "Y",
          u = `translate${a}(${Number((s && o ? -1 : 1) * n)}px)`;
        (this._renderedContentOffset = n),
          i === "to-end" &&
            ((u += ` translate${a}(-100%)`),
            (this._renderedContentOffsetNeedsRewrite = !0)),
          this._renderedContentTransform != u &&
            ((this._renderedContentTransform = u),
            this._markChangeDetectionNeeded(() => {
              this._renderedContentOffsetNeedsRewrite
                ? ((this._renderedContentOffset -=
                    this.measureRenderedContentSize()),
                  (this._renderedContentOffsetNeedsRewrite = !1),
                  this.setRenderedContentOffset(this._renderedContentOffset))
                : this._scrollStrategy.onRenderedOffsetChanged();
            }));
      }
      scrollToOffset(n, i = "auto") {
        let o = { behavior: i };
        this.orientation === "horizontal" ? (o.start = n) : (o.top = n),
          this.scrollable.scrollTo(o);
      }
      scrollToIndex(n, i = "auto") {
        this._scrollStrategy.scrollToIndex(n, i);
      }
      measureScrollOffset(n) {
        let i;
        return (
          this.scrollable == this
            ? (i = (o) => super.measureScrollOffset(o))
            : (i = (o) => this.scrollable.measureScrollOffset(o)),
          Math.max(
            0,
            i(n ?? (this.orientation === "horizontal" ? "start" : "top")) -
              this.measureViewportOffset(),
          )
        );
      }
      measureViewportOffset(n) {
        let i,
          o = "left",
          s = "right",
          a = this.dir?.value == "rtl";
        n == "start"
          ? (i = a ? s : o)
          : n == "end"
            ? (i = a ? o : s)
            : n
              ? (i = n)
              : (i = this.orientation === "horizontal" ? "left" : "top");
        let c = this.scrollable.measureBoundingClientRectWithScrollOffset(i);
        return this.elementRef.nativeElement.getBoundingClientRect()[i] - c;
      }
      measureRenderedContentSize() {
        let n = this._contentWrapper.nativeElement;
        return this.orientation === "horizontal"
          ? n.offsetWidth
          : n.offsetHeight;
      }
      measureRangeSize(n) {
        return this._forOf
          ? this._forOf.measureRangeSize(n, this.orientation)
          : 0;
      }
      checkViewportSize() {
        this._measureViewportSize(), this._scrollStrategy.onDataLengthChanged();
      }
      _measureViewportSize() {
        this._viewportSize = this.scrollable.measureViewportSize(
          this.orientation,
        );
      }
      _markChangeDetectionNeeded(n) {
        n && this._runAfterChangeDetection.push(n),
          this._isChangeDetectionPending ||
            ((this._isChangeDetectionPending = !0),
            this.ngZone.runOutsideAngular(() =>
              Promise.resolve().then(() => {
                this._doChangeDetection();
              }),
            ));
      }
      _doChangeDetection() {
        this._isDestroyed ||
          this.ngZone.run(() => {
            this._changeDetectorRef.markForCheck(),
              (this._contentWrapper.nativeElement.style.transform =
                this._renderedContentTransform),
              Ns(
                () => {
                  this._isChangeDetectionPending = !1;
                  let n = this._runAfterChangeDetection;
                  this._runAfterChangeDetection = [];
                  for (let i of n) i();
                },
                { injector: this._injector },
              );
          });
      }
      _calculateSpacerSize() {
        (this._totalContentHeight =
          this.orientation === "horizontal"
            ? ""
            : `${this._totalContentSize}px`),
          (this._totalContentWidth =
            this.orientation === "horizontal"
              ? `${this._totalContentSize}px`
              : "");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        M(ae),
        M(Ct),
        M(W),
        M(ry, 8),
        M(Va, 8),
        M(Pd),
        M(SS),
        M(ey, 8),
      );
    }),
      (e.ɵcmp = Qe({
        type: e,
        selectors: [["cdk-virtual-scroll-viewport"]],
        viewQuery: function (i, o) {
          if ((i & 1 && Rr(ES, 7), i & 2)) {
            let s;
            Pn((s = Fn())) && (o._contentWrapper = s.first);
          }
        },
        hostAttrs: [1, "cdk-virtual-scroll-viewport"],
        hostVars: 4,
        hostBindings: function (i, o) {
          i & 2 &&
            Or(
              "cdk-virtual-scroll-orientation-horizontal",
              o.orientation === "horizontal",
            )(
              "cdk-virtual-scroll-orientation-vertical",
              o.orientation !== "horizontal",
            );
        },
        inputs: {
          orientation: "orientation",
          appendOnly: [2, "appendOnly", "appendOnly", wi],
        },
        outputs: { scrolledIndexChange: "scrolledIndexChange" },
        standalone: !0,
        features: [
          xt([
            {
              provide: oy,
              useFactory: (n, i) => n || i,
              deps: [[new gi(), new bh(ey)], e],
            },
          ]),
          Os,
          Ue,
          Xe,
        ],
        ngContentSelectors: _S,
        decls: 4,
        vars: 4,
        consts: [
          ["contentWrapper", ""],
          [1, "cdk-virtual-scroll-content-wrapper"],
          [1, "cdk-virtual-scroll-spacer"],
        ],
        template: function (i, o) {
          i & 1 && (Rg(), R(0, "div", 1, 0), Pg(2), L(), Pe(3, "div", 2)),
            i & 2 &&
              (Z(3),
              Nr("width", o._totalContentWidth)(
                "height",
                o._totalContentHeight,
              ));
        },
        styles: [
          "cdk-virtual-scroll-viewport{display:block;position:relative;transform:translateZ(0)}.cdk-virtual-scrollable{overflow:auto;will-change:scroll-position;contain:strict;-webkit-overflow-scrolling:touch}.cdk-virtual-scroll-content-wrapper{position:absolute;top:0;left:0;contain:content}[dir=rtl] .cdk-virtual-scroll-content-wrapper{right:0;left:auto}.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper{min-height:100%}.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>dl:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>ol:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>table:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper>ul:not([cdkVirtualFor]){padding-left:0;padding-right:0;margin-left:0;margin-right:0;border-left-width:0;border-right-width:0;outline:none}.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper{min-width:100%}.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>dl:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>ol:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>table:not([cdkVirtualFor]),.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper>ul:not([cdkVirtualFor]){padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;border-top-width:0;border-bottom-width:0;outline:none}.cdk-virtual-scroll-spacer{height:1px;transform-origin:0 0;flex:0 0 auto}[dir=rtl] .cdk-virtual-scroll-spacer{transform-origin:100% 0}",
        ],
        encapsulation: 2,
        changeDetection: 0,
      }));
    let t = e;
    return t;
  })();
function ty(t, e, r) {
  let n = r;
  if (!n.getBoundingClientRect) return 0;
  let i = n.getBoundingClientRect();
  return t === "horizontal"
    ? e === "start"
      ? i.left
      : i.right
    : e === "start"
      ? i.top
      : i.bottom;
}
var sy = (() => {
  let e = class e {
    get cdkVirtualForOf() {
      return this._cdkVirtualForOf;
    }
    set cdkVirtualForOf(n) {
      (this._cdkVirtualForOf = n),
        Xv(n)
          ? this._dataSourceChanges.next(n)
          : this._dataSourceChanges.next(
              new ja(dn(n) ? n : Array.from(n || [])),
            );
    }
    get cdkVirtualForTrackBy() {
      return this._cdkVirtualForTrackBy;
    }
    set cdkVirtualForTrackBy(n) {
      (this._needsUpdate = !0),
        (this._cdkVirtualForTrackBy = n
          ? (i, o) =>
              n(i + (this._renderedRange ? this._renderedRange.start : 0), o)
          : void 0);
    }
    set cdkVirtualForTemplate(n) {
      n && ((this._needsUpdate = !0), (this._template = n));
    }
    get cdkVirtualForTemplateCacheSize() {
      return this._viewRepeater.viewCacheSize;
    }
    set cdkVirtualForTemplateCacheSize(n) {
      this._viewRepeater.viewCacheSize = to(n);
    }
    constructor(n, i, o, s, a, c) {
      (this._viewContainerRef = n),
        (this._template = i),
        (this._differs = o),
        (this._viewRepeater = s),
        (this._viewport = a),
        (this.viewChange = new j()),
        (this._dataSourceChanges = new j()),
        (this.dataStream = this._dataSourceChanges.pipe(
          ir(null),
          uc(),
          we(([u, l]) => this._changeDataSource(u, l)),
          fc(1),
        )),
        (this._differ = null),
        (this._needsUpdate = !1),
        (this._destroyed = new j()),
        this.dataStream.subscribe((u) => {
          (this._data = u), this._onRenderedDataChange();
        }),
        this._viewport.renderedRangeStream
          .pipe(rt(this._destroyed))
          .subscribe((u) => {
            (this._renderedRange = u),
              this.viewChange.observers.length &&
                c.run(() => this.viewChange.next(this._renderedRange)),
              this._onRenderedDataChange();
          }),
        this._viewport.attach(this);
    }
    measureRangeSize(n, i) {
      if (n.start >= n.end) return 0;
      n.start < this._renderedRange.start || n.end > this._renderedRange.end;
      let o = n.start - this._renderedRange.start,
        s = n.end - n.start,
        a,
        c;
      for (let u = 0; u < s; u++) {
        let l = this._viewContainerRef.get(u + o);
        if (l && l.rootNodes.length) {
          a = c = l.rootNodes[0];
          break;
        }
      }
      for (let u = s - 1; u > -1; u--) {
        let l = this._viewContainerRef.get(u + o);
        if (l && l.rootNodes.length) {
          c = l.rootNodes[l.rootNodes.length - 1];
          break;
        }
      }
      return a && c ? ty(i, "end", c) - ty(i, "start", a) : 0;
    }
    ngDoCheck() {
      if (this._differ && this._needsUpdate) {
        let n = this._differ.diff(this._renderedItems);
        n ? this._applyChanges(n) : this._updateContext(),
          (this._needsUpdate = !1);
      }
    }
    ngOnDestroy() {
      this._viewport.detach(),
        this._dataSourceChanges.next(void 0),
        this._dataSourceChanges.complete(),
        this.viewChange.complete(),
        this._destroyed.next(),
        this._destroyed.complete(),
        this._viewRepeater.detach();
    }
    _onRenderedDataChange() {
      this._renderedRange &&
        ((this._renderedItems = this._data.slice(
          this._renderedRange.start,
          this._renderedRange.end,
        )),
        this._differ ||
          (this._differ = this._differs
            .find(this._renderedItems)
            .create((n, i) =>
              this.cdkVirtualForTrackBy ? this.cdkVirtualForTrackBy(n, i) : i,
            )),
        (this._needsUpdate = !0));
    }
    _changeDataSource(n, i) {
      return (
        n && n.disconnect(this),
        (this._needsUpdate = !0),
        i ? i.connect(this) : I()
      );
    }
    _updateContext() {
      let n = this._data.length,
        i = this._viewContainerRef.length;
      for (; i--; ) {
        let o = this._viewContainerRef.get(i);
        (o.context.index = this._renderedRange.start + i),
          (o.context.count = n),
          this._updateComputedContextProperties(o.context),
          o.detectChanges();
      }
    }
    _applyChanges(n) {
      this._viewRepeater.applyChanges(
        n,
        this._viewContainerRef,
        (s, a, c) => this._getEmbeddedViewArgs(s, c),
        (s) => s.item,
      ),
        n.forEachIdentityChange((s) => {
          let a = this._viewContainerRef.get(s.currentIndex);
          a.context.$implicit = s.item;
        });
      let i = this._data.length,
        o = this._viewContainerRef.length;
      for (; o--; ) {
        let s = this._viewContainerRef.get(o);
        (s.context.index = this._renderedRange.start + o),
          (s.context.count = i),
          this._updateComputedContextProperties(s.context);
      }
    }
    _updateComputedContextProperties(n) {
      (n.first = n.index === 0),
        (n.last = n.index === n.count - 1),
        (n.even = n.index % 2 === 0),
        (n.odd = !n.even);
    }
    _getEmbeddedViewArgs(n, i) {
      return {
        templateRef: this._template,
        context: {
          $implicit: n.item,
          cdkVirtualForOf: this._cdkVirtualForOf,
          index: -1,
          count: -1,
          first: !1,
          last: !1,
          odd: !1,
          even: !1,
        },
        index: i,
      };
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(M(Qt), M(Sn), M(js), M(Od), M(Fd, 4), M(W));
  }),
    (e.ɵdir = se({
      type: e,
      selectors: [["", "cdkVirtualFor", "", "cdkVirtualForOf", ""]],
      inputs: {
        cdkVirtualForOf: "cdkVirtualForOf",
        cdkVirtualForTrackBy: "cdkVirtualForTrackBy",
        cdkVirtualForTemplate: "cdkVirtualForTemplate",
        cdkVirtualForTemplateCacheSize: "cdkVirtualForTemplateCacheSize",
      },
      standalone: !0,
      features: [xt([{ provide: Od, useClass: Ba }])],
    }));
  let t = e;
  return t;
})();
var ny = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = be({}));
    let t = e;
    return t;
  })(),
  ay = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Ie({ type: e })),
      (e.ɵinj = be({ imports: [Ad, ny, Ad, ny] }));
    let t = e;
    return t;
  })();
var OS = ["scrollViewport"];
function RS(t, e) {
  if ((t & 1 && (R(0, "div", 11), Pe(1, "app-user-item", 12), L()), t & 2)) {
    let r = e.$implicit;
    Z(), Re("user", r);
  }
}
function PS(t, e) {
  if (
    (t & 1 &&
      (R(0, "div", 1)(1, "h2", 3),
      H(2),
      L(),
      R(3, "article", 2)(4, "div", 4)(5, "span", 5),
      H(6, "Name"),
      L(),
      R(7, "span", 6),
      H(8, "Email"),
      L(),
      R(9, "span", 7),
      H(10, "Phone"),
      L(),
      R(11, "span", 8),
      H(12, "Nationality"),
      L()(),
      R(13, "cdk-virtual-scroll-viewport", 9, 0),
      Ar(15, RS, 2, 1, "div", 10),
      L()()()),
    t & 2)
  ) {
    let r = Kt();
    Z(2),
      ut(r.title()),
      Z(11),
      Nr("height", r.viewportHeight, "px"),
      Z(2),
      Re("cdkVirtualForOf", r.users());
  }
}
function FS(t, e) {
  t & 1 && (R(0, "article", 2)(1, "p"), H(2, "Loading\u2026"), L()());
}
var cy = (() => {
  let e = class e {
    constructor() {
      (this.users = An.required()),
        (this.title = An.required()),
        (this.viewportHeight = 0);
    }
    ngOnChanges(n) {
      if (n.users.currentValue) {
        let i = n.users.currentValue.length ?? 0,
          o = 60,
          s = 236,
          a = 600,
          c = 12,
          u = window.innerWidth > a ? o : s;
        this.viewportHeight = Math.min(window.innerHeight, i * u + c * 2);
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Qe({
      type: e,
      selectors: [["app-user-list"]],
      viewQuery: function (i, o) {
        if ((i & 1 && Rr(OS, 5), i & 2)) {
          let s;
          Pn((s = Fn())) && (o.scrollViewport = s.first);
        }
      },
      inputs: { users: [1, "users"], title: [1, "title"] },
      standalone: !0,
      features: [je, Xe],
      decls: 2,
      vars: 1,
      consts: [
        ["scrollViewport", ""],
        [1, "user-list-container"],
        [1, "user-list"],
        [1, "user-list-title"],
        [1, "user-list__header"],
        [1, "user-list__header-name"],
        [1, "user-list__header-email"],
        [1, "user-list__header-phone"],
        [1, "user-list__header-nat"],
        ["itemSize", "50", 1, "user-list__viewport"],
        [
          "class",
          "user-list__viewport-wrapper",
          4,
          "cdkVirtualFor",
          "cdkVirtualForOf",
        ],
        [1, "user-list__viewport-wrapper"],
        [3, "user"],
      ],
      template: function (i, o) {
        i & 1 && Ar(0, PS, 16, 4, "div", 1)(1, FS, 3, 0, "article", 2),
          i & 2 && Rs(o.users().length ? 0 : 1);
      },
      dependencies: [Qv, ay, iy, sy, Fd],
      styles: [
        "[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]{max-width:60%;display:flex;flex-direction:column;margin:0 auto;padding:12px}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]{max-width:85%}}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list-title[_ngcontent-%COMP%]{padding:12px}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list__header[_ngcontent-%COMP%]{padding:12px;display:flex;gap:24px}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list__header[_ngcontent-%COMP%]{display:none}}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list__header-name[_ngcontent-%COMP%]{min-width:100px;margin-left:40px;padding-left:12px;margin-right:auto}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list__header-email[_ngcontent-%COMP%]{width:220px}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list__header-phone[_ngcontent-%COMP%]{width:110px}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list__header-nat[_ngcontent-%COMP%]{width:80px}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list[_ngcontent-%COMP%]{background-color:var(--color-white);border-radius:18px;border:6px solid var(--color-sky);padding:12px}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list[_ngcontent-%COMP%]   .user-list__viewport-wrapper[_ngcontent-%COMP%]{border-bottom:1px solid var(--color-fog)}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list[_ngcontent-%COMP%]   .user-list__viewport-wrapper[_ngcontent-%COMP%]:last-of-type{border-bottom:none}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list[_ngcontent-%COMP%]   .user-list__viewport[_ngcontent-%COMP%]{-ms-overflow-style:none;scrollbar-width:none}[_nghost-%COMP%]   .user-list-container[_ngcontent-%COMP%]   .user-list[_ngcontent-%COMP%]   .user-list__viewport[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}",
      ],
      changeDetection: 0,
    }));
  let t = e;
  return t;
})();
var uy = (() => {
  let e = class e {
    constructor() {
      this.destroySubject$ = new j();
    }
    get destroy$() {
      return this.destroySubject$.asObservable();
    }
    ngOnDestroy() {
      this.destroySubject$.next();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵdir = se({ type: e }));
  let t = e;
  return t;
})();
function kS(t, e) {
  if ((t & 1 && Pe(0, "app-user-list", 9), t & 2)) {
    let r = e.$implicit,
      n = Kt(2);
    Re("users", n.groupedUsers[r])("title", r);
  }
}
function LS(t, e) {
  if (t & 1) {
    let r = Ps();
    R(0, "div", 2)(1, "div", 3),
      Pe(2, "input", 4),
      R(3, "button", 5),
      Fe("click", function () {
        Sr(r);
        let i = Kt();
        return xr(i.filter());
      }),
      H(4, " Filter users "),
      L()(),
      R(5, "div", 6)(6, "span"),
      H(7),
      L(),
      R(8, "button", 7),
      Fe("click", function () {
        Sr(r);
        let i = Kt();
        return xr(i.switchCategory());
      }),
      H(9, "Switch Category"),
      L()(),
      R(10, "app-paginator", 8),
      Fe("pageChanged", function (i) {
        Sr(r);
        let o = Kt();
        return xr(o.updatePage(i));
      }),
      L()(),
      Ng(11, kS, 1, 2, "app-user-list", 9, Ag);
  }
  if (t & 2) {
    let r = Kt();
    Z(),
      Re("formGroup", r.form),
      Z(),
      Re("formControlName", "searchFilter"),
      Z(),
      Re("disabled", r.form.invalid),
      Z(4),
      Pr("Currently grouped by: ", r.currentlyAppliedCategory, ""),
      Z(3),
      Re("page", r.currentPage),
      Z(),
      Og(r.displayedCategories);
  }
}
function VS(t, e) {
  t & 1 &&
    (R(0, "article", 1),
    Pe(1, "img", 10),
    R(2, "span"),
    H(3, "Loading users data"),
    L()());
}
var ly = (() => {
  let e = class e extends uy {
    constructor() {
      super(...arguments),
        (this.usersService = g(ka)),
        (this.cdr = g(Ct)),
        (this.loading = !0),
        (this.form = new xa({
          searchFilter: new Md("", [Xi.minLength(3), Xi.required]),
        })),
        (this.currentPage = 1),
        (this.groupedUsers = {}),
        (this.currentlyAppliedCategory = "ALPHABETICALLY"),
        (this.categories = ["ALPHABETICALLY", "AGE", "NATIONALITY"]);
    }
    get displayedCategories() {
      return Object.keys(this.groupedUsers);
    }
    ngOnInit() {
      this.usersService.reset(),
        this.usersService.users$.pipe(rt(this.destroy$)).subscribe(() => {
          this.groupUsersData(this.usersService.users);
        }),
        this.callApi();
    }
    filter() {
      let n = this.form.value?.searchFilter;
      n &&
        this.groupUsersData(
          this.usersService.users.filter((i) =>
            i.firstname?.toLowerCase()?.startsWith(n.toLowerCase()),
          ),
        );
    }
    switchCategory() {
      this.form.reset();
      let n =
        this.categories.indexOf(this.currentlyAppliedCategory) + 1 >=
        this.categories.length
          ? 0
          : this.categories.indexOf(this.currentlyAppliedCategory) + 1;
      (this.currentlyAppliedCategory = this.categories[n]),
        this.groupUsersData(this.usersService.users);
    }
    updatePage(n) {
      (this.currentPage = n), this.callApi();
    }
    groupUsersData(n) {
      this.loading = !0;
      let i = new Worker(new URL("worker-LPCMETMT.js", import.meta.url), {
        type: "module",
      });
      i.addEventListener("message", ({ data: o }) => {
        (this.groupedUsers = o), (this.loading = !1), this.cdr.markForCheck();
      }),
        i.postMessage({ users: n, category: this.currentlyAppliedCategory }),
        this.cdr.markForCheck();
    }
    callApi() {
      (this.loading = !0),
        this.usersService
          .getUsers(this.currentPage)
          .pipe(qe(1))
          .subscribe(() => {});
    }
  };
  (e.ɵfac = (() => {
    let n;
    return function (o) {
      return (n || (n = Tn(e)))(o || e);
    };
  })()),
    (e.ɵcmp = Qe({
      type: e,
      selectors: [["app-root"]],
      standalone: !0,
      features: [Ue, Xe],
      decls: 4,
      vars: 1,
      consts: [
        ["src", "logo.svg", "alt", "awork logo"],
        [1, "loading-spinner"],
        [1, "app-container"],
        [1, "users-filter", 3, "formGroup"],
        [
          "placeholder",
          "Search user by First name. Type in at least 3 letters",
          3,
          "formControlName",
        ],
        ["type", "submit", 3, "click", "disabled"],
        [1, "sorting-information"],
        [3, "click"],
        [3, "pageChanged", "page"],
        [3, "users", "title"],
        ["src", "loading.svg", "alt", "Loading"],
      ],
      template: function (i, o) {
        i & 1 &&
          (R(0, "header"),
          Pe(1, "img", 0),
          L(),
          Ar(2, LS, 13, 5)(3, VS, 4, 0, "article", 1)),
          i & 2 && (Z(2), Rs(o.loading ? 3 : 2));
      },
      dependencies: [cy, qv, Na, Bv, Uv, Zv, Sd, xd, Yv],
      styles: [
        "[_nghost-%COMP%]   header[_ngcontent-%COMP%]{height:200px;text-align:center;box-sizing:border-box;display:flex;justify-content:center;align-items:center}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]{max-width:60%;display:flex;flex-direction:column;margin:0 auto;gap:12px}@media only screen and (max-width: 600px){[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]{max-width:85%}}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{height:fit-content;margin:auto auto auto 0}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{background:transparent;border:none;border-bottom:1px solid var(--color-text-light);margin-right:24px;flex-grow:1;color:var(--color-text-light)}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:var(--color-sky);border:none;padding:12px;border-radius:12px;margin-left:auto;color:var(--color-steel);cursor:pointer;font-size:16px;border:2px solid transparent}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:active{border:2px solid var(--color-steel);background-color:var(--color-fog)}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:var(--color-fog)}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{background-color:#d3d3d3;cursor:not-allowed}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   .sorting-information[_ngcontent-%COMP%]{display:flex;flex-direction:row}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   .users-filter[_ngcontent-%COMP%]{display:flex;flex-direction:row}[_nghost-%COMP%]   .app-container[_ngcontent-%COMP%]   app-paginator[_ngcontent-%COMP%]{margin-left:auto;margin-right:auto}[_nghost-%COMP%]   .loading-spinner[_ngcontent-%COMP%]{flex-direction:column;display:flex;align-items:center}[_nghost-%COMP%]   .loading-spinner[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:80px;width:fit-content}",
      ],
      changeDetection: 0,
    }));
  let t = e;
  return t;
})();
Tm(ly, gv).catch((t) => console.error(t));
