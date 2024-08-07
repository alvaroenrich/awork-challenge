addEventListener("message", ({ data: s }) => {
  let e = s.users,
    r = s.category,
    t = 400,
    n = {},
    a = 0,
    g = () => {
      let c = e.slice(a, a + t),
        o = {};
      switch (r) {
        case "ALPHABETICALLY":
          o = f(c);
          break;
        case "AGE":
          o = U(c);
          break;
        case "NATIONALITY":
          o = u(c);
          break;
        default:
          n = {};
      }
      Object.keys(o).forEach((i) => {
        n[i] ? (n[i] = [...n[i], ...o[i]]) : (n[i] = o[i]);
      }),
        (a += t),
        a < e.length ? requestAnimationFrame(g) : postMessage(n);
    };
  g();
});
var f = (s) =>
    s.reduce((e, r) => {
      if (!r.firstname)
        throw Error("User does not have firstname. It cant be grouped");
      let t = r.firstname.charAt(0).toUpperCase();
      return e[t] || (e[t] = []), e[t].push(r), e;
    }, {}),
  u = (s) => {
    let e = {};
    return (
      s.forEach((r) => {
        r.nat && (e[r.nat] || (e[r.nat] = []), e[r.nat].push(r));
      }),
      e
    );
  },
  U = (s) => {
    let e = {};
    return (
      s.forEach((r) => {
        if (r.age) {
          let t = r.age.toString();
          e[t] || (e[t] = []), e[t].push(r);
        }
      }),
      e
    );
  };
