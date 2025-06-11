var d = Object.defineProperty;
var f = (r, e, t) => e in r ? d(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var l = (r, e, t) => (f(r, typeof e != "symbol" ? e + "" : e, t), t);
class L {
  constructor(e, t = {}) {
    l(this, "element");
    l(this, "options");
    l(this, "inputElement", null);
    this.element = e, this.options = { ...t }, this.init();
  }
  init() {
    this.render(), this.bindEvents();
  }
  render() {
    this.element.innerHTML = `
      <input type="text" 
        class="dx-textbox" 
        placeholder="${this.options.placeholder || ""}"
        value="${this.options.value || ""}"
        ${this.options.disabled ? "disabled" : ""}
        ${this.options.readOnly ? "readonly" : ""}
      >
    `, this.inputElement = this.element.querySelector("input");
  }
  bindEvents() {
    var e;
    (e = this.inputElement) == null || e.addEventListener("input", (t) => {
      var i, n;
      const s = t.target;
      this.options.value = s.value, (n = (i = this.options).onValueChanged) == null || n.call(i, { value: s.value });
    });
  }
  option(e, t) {
    if (arguments.length === 1)
      return this.options[e];
    if (this.options[e] = t, !!this.inputElement)
      switch (e) {
        case "value":
          this.inputElement.value = t != null ? t : "";
          break;
        case "disabled":
          this.inputElement.disabled = t;
          break;
        case "readOnly":
          this.inputElement.readOnly = t;
          break;
        case "placeholder":
          this.inputElement.placeholder = t != null ? t : "";
          break;
      }
  }
  dispose() {
    this.inputElement && this.inputElement.removeEventListener("input", () => {
    }), this.element.innerHTML = "";
  }
}
class g {
  constructor() {
    l(this, "errors", {});
  }
  add(e, t) {
    this.errors[e] || (this.errors[e] = []), this.errors[e].push(t);
  }
  clear(e) {
    e ? delete this.errors[e] : this.errors = {};
  }
  has(e) {
    var t;
    return !!((t = this.errors[e]) != null && t.length);
  }
  first(e) {
    var t;
    return ((t = this.errors[e]) == null ? void 0 : t[0]) || null;
  }
  all() {
    return this.errors;
  }
}
const m = (r) => typeof r == "string" ? r.trim().length > 0 : Array.isArray(r) ? r.length > 0 : r != null && r !== "", p = (r, e) => {
  if (!e)
    return !1;
  const t = document.querySelector(`[name="${e}"]`);
  return r === (t == null ? void 0 : t.value);
}, b = (r, e) => {
  const t = parseFloat(e || "0");
  return typeof r == "string" ? r.length >= t : Number(r) >= t;
}, y = (r, e) => {
  const t = parseFloat(e || "0");
  return typeof r == "string" ? r.length <= t : Number(r) <= t;
}, E = (r, e) => {
  if (!e)
    return !1;
  const [t, s] = e.split(","), i = parseFloat(t), n = parseFloat(s), o = typeof r == "string" ? r.length : Number(r);
  return o >= i && o <= n;
}, x = (r) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r), $ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  required: m,
  confirmed: p,
  min: b,
  max: y,
  between: E,
  email: x
}, Symbol.toStringTag, { value: "Module" })), M = {
  required: "This field is required",
  email: "Please enter a valid email address",
  confirmed: (r) => {
    const e = typeof r == "object" ? r == null ? void 0 : r.target : r;
    return `Must match ${e ? `the ${e} field` : "confirmation field"}`;
  },
  min: (r) => `Minimum of ${(typeof r == "object" ? r == null ? void 0 : r.value : r) || "value"} characters`,
  max: (r) => `Maximum of ${(typeof r == "object" ? r == null ? void 0 : r.value : r) || "value"} characters`,
  between: (r) => {
    let e, t;
    return typeof r == "string" ? [e, t] = r.split(",") : typeof r == "object" && (e = r.min, t = r.max), `Must be between ${e || "min"} and ${t || "max"}`;
  }
};
class j {
  constructor(e) {
    l(this, "errorBag", new g());
    l(this, "rules", {});
    l(this, "fields", /* @__PURE__ */ new Map());
    l(this, "locales", {});
    l(this, "currentLocale", "en-US");
    this.registerDefaultRules(), this.defineMessages("en-US", M), e && this.locales[e] && (this.currentLocale = e);
  }
  registerDefaultRules() {
    Object.entries($).forEach(([e, t]) => {
      this.defineRule(e, t);
    });
  }
  defineRule(e, t) {
    this.rules[e] = t;
  }
  defineMessages(e, t) {
    this.locales[e] = { ...this.locales[e], ...t };
  }
  setLocale(e) {
    if (!this.locales[e])
      throw new Error(`Locale '${e}' is not registered. Use defineMessages() first.`);
    this.currentLocale = e;
  }
  resolveMessage(e, t) {
    const s = this.locales[this.currentLocale], i = s == null ? void 0 : s[e];
    if (typeof i == "function") {
      const n = t != null && t.includes("=") ? t.split(",").reduce((o, u) => {
        const [c, h] = u.split("=");
        return c && h && (o[c] = h), o;
      }, {}) : t;
      return i(n);
    }
    return i || `Validation failed for rule "${e}".`;
  }
  registerField(e, t) {
    this.fields.set(e, t);
  }
  unregisterField(e) {
    this.fields.delete(e);
  }
  parseRule(e) {
    const [t, s] = e.split(":");
    return { name: t, params: s };
  }
  async validate(e, t) {
    const s = e.getAttribute("name") || "", i = e.value;
    this.errorBag.clear(s);
    const n = [];
    for (const o of t) {
      const { name: u, params: c } = this.parseRule(o), h = this.rules[u];
      if (!h)
        throw new Error(`Validation rule "${u}" is not defined.`);
      if (!await h(i, c, s)) {
        const a = this.resolveMessage(u, c);
        n.push(a);
      }
    }
    return n.length > 0 ? (n.forEach((o) => this.errorBag.add(s, o)), Promise.reject(this.errorBag)) : Promise.resolve({ isValid: !0 });
  }
  async validateAll(e) {
    const t = {};
    let s = !0;
    for (const [i, n] of this.fields.entries()) {
      if (e && !e.contains(i))
        continue;
      const o = i.getAttribute("name") || "";
      try {
        await this.validate(i, n);
      } catch (u) {
        s = !1, t[o] = u.get(o);
      }
    }
    return { isValid: s, errors: t };
  }
  get errors() {
    return this.errorBag;
  }
}
export {
  L as TextBox,
  j as Validator
};
