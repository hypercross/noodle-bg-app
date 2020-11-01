import React, { useState } from "react";

export const catalog = [
  { type: "肉", name: "墨鱼" },
  { type: "肉", name: "花甲" },
  { type: "肉", name: "牛肉" },
  { type: "肉", name: "排骨" },
  { type: "肉", name: "臊子" },
  { type: "肉", name: "煎蛋" },
  { type: "肉", name: "虾" },
  { type: "肉", name: "肥肠" },

  { type: "菜", name: "软浆叶" },
  { type: "菜", name: "香菇" },
  { type: "菜", name: "番茄" },
  { type: "菜", name: "豌豆尖" },
  { type: "菜", name: "飘儿白" },
  { type: "菜", name: "芹菜" },

  { type: "佐料", name: "红油" },
  { type: "佐料", name: "盐须" },
  { type: "佐料", name: "葱花" }
];

function makeTypeRule(type, score) {
  return ings => {
    return ings.find(n => n.type == type)
      ? {
          type: "ok",
          message: "有" + type,
          score
        }
      : {};
  };
}

export const basicRules = [
  makeTypeRule("肉", 3),
  makeTypeRule("菜", 2),
  makeTypeRule("佐料", 1),
  ings => {
    let score = 0;
    const names = {};
    for (const ing of ings) {
      names[ing.name] = (names[ing.name] || 0) + 1;
    }
    const msgs = [];
    for (const ing of Object.keys(names)) {
      let n = names[ing];
      while (n >= 3) {
        msgs.push(`${ing} x 3`);
        score += 5;
        n -= 3;
      }
      while (n >= 2) {
        msgs.push(`${ing} x 2`);
        score += 2;
        n -= 3;
      }
    }
    return {
      score,
      type: score > 0 ? "ok" : null,
      message: msgs.join(", ")
    };
  }
];

class NoodleFlavor {
  name = "点单";
  tiers = [
    { count: 5, score: 13, tier: "大份" },
    { count: 1, score: 8, tier: "小份" }
  ];
  required = [];
  recommended = [];
  prohibited = [];

  findMatch(ings, required) {
    const matched = ings.slice();

    for (const req of required) {
      const i = matched.findIndex(req);
      if (i < 0) return false;

      matched.splice(i, 1);
    }

    return true;
  }

  orderRule = ings => {
    if (!this.findMatch(ings, this.required)) return {};
    for (const tier of this.tiers) {
      if (ings.length >= tier.count) {
        return {
          type: "ok",
          score: tier.score,
          message: `${this.name}·${tier.tier}`
        };
      }
    }
    return {};
  };

  recommendedRule = ings => {
    let score = 0;
    const msgs = [];

    for (const r of this.recommended) {
      if (this.findMatch(ings, [r])) {
        msgs.push(`${r.name}`);
        score += r.score;
      }
    }

    return score != 0
      ? { type: "recommended", message: msgs.join(", "), score }
      : {};
  };

  prohibitedRule = ings => {
    let score = 0;
    const msgs = [];

    for (const r of this.prohibited) {
      if (this.findMatch(ings, [r])) {
        msgs.push(`${r.name}`);
        score += r.score;
      }
    }

    return score != 0
      ? { type: "prohibited", message: msgs.join(", "), score }
      : {};
  };

  rules = [this.orderRule, this.recommendedRule, this.prohibitedRule];
}

function 葱花推荐(ing) {
  return ing.name == "葱花";
}
葱花推荐.score = 2;

function 盐须推荐(ing) {
  return ing.name == "盐须";
}
盐须推荐.score = 2;

function 盐须禁选(ing) {
  return ing.name == "盐须";
}
盐须禁选.score = -3;

function 红油推荐(ing) {
  return ing.name == "红油";
}
红油推荐.score = 2;

function 红油禁选(ing) {
  return ing.name == "红油";
}
红油禁选.score = -3;

const seafood = {
  墨鱼: true,
  花甲: true,
  虾: true
};

function 海鲜(ing) {
  return ing.type == "肉" && !!seafood[ing.name];
}

function named(name) {
  return ing => ing.name == name;
}

function typed(type) {
  return ing => ing.type == type;
}
const n0 = new NoodleFlavor();
n0.name = "商务套餐";
n0.tiers = [];

const n1 = new NoodleFlavor();
n1.name = "番茄煎蛋面";
n1.required.push(named("番茄"), named("煎蛋"));
n1.recommended.push(葱花推荐);
n1.prohibited.push(红油禁选);

const n2 = new NoodleFlavor();
n2.name = "红烧排骨面";
n2.required.push(named("排骨"), named("红油"));
n2.recommended.push(葱花推荐);

const flavors = [n0, n1, n2];

export function useFlavorSelect() {
  const [flavor, setFlavor] = useState("商务套餐");

  const select = (
    <select
      className="flavor"
      value={flavor}
      onChange={e => setFlavor(e.target.value)}
    >
      {flavors.map(f => (
        <option value={f.name} key={f.name}>
          {f.name}
        </option>
      ))}
    </select>
  );

  return { select, flavor: flavors.find(f => f.name == flavor) };
}
