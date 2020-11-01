import React, { useEffect, Fragment } from "react";
const update = new Event("update");

/**
 * @param target: EventTarget
 */
export function useEvent(target, type, callback, deps) {
  useEffect(function() {
    if (!target) return;
    if (!type) return;

    target.addEventListener(type, callback);
    return function() {
      target.removeEventListener(type, callback);
    };
  }, deps);
}

export class Noodle extends EventTarget {
  flavor = null;
  ingredients = [];
  rules = [];
  catalog = [];

  update() {
    this.dispatchEvent(update);
  }

  useUpdate(cb) {
    useEvent(this, "update", cb, [this]);
  }

  renderRuleItem(rule, key) {
    const { message, type, score } = rule(this.ingredients);
    if (!type || !message) return null;

    return (
      <div className={"rule-item " + type} key={key}>
        <span className="message">{message}</span>
        <span className="score">{score}</span>
      </div>
    );
  }

  renderCatalog() {
    return (
      <div className="catalog">
        {this.catalog.map(c => {
          const onClick = () => {
            if (this.ingredients.length >= 5) return;
            this.ingredients.push(Object.create(c));
            this.update();
          };
          return (
            <div
              onClick={onClick}
              key={c.name}
              className={"ingredient " + c.type}
            >
              {c.name}
            </div>
          );
        })}
      </div>
    );
  }

  renderRules() {
    return (
      <div className="rules">
        {this.rules.map((r, i) => this.renderRuleItem(r, i))}
      </div>
    );
  }

  renderIngredients() {
    if (!this.ingredients.length) {
      return (
        <div className="ingredients">
          <div className="hint">点击上方食材添加</div>
        </div>
      );
    }
    return (
      <div className="ingredients">
        {this.ingredients.map((ing, i) => {
          const { name, type } = ing;
          const onClick = () => {
            this.ingredients.splice(i, 1);
            this.update();
          };
          return (
            <span key={i} className={"ingredient " + type} onClick={onClick}>
              {name}
            </span>
          );
        })}
      </div>
    );
  }

  renderTotalScore(children) {
    const nums = this.rules
      .map(r => r(this.ingredients).score)
      .filter(n => !isNaN(n) && n != 0);

    if (nums.length == 0) nums.push(0);
    const total = nums.reduce((a, b) => a + b, 0);
    const scores = nums.map((r, i) => (
      <span key={"is-" + i} className="item-score">
        {r}
      </span>
    ));
    for (let i = 0; i + 1 < scores.length; i += 2) {
      scores.splice(
        i + 1,
        0,
        <span key={"add-" + i} className="add">
          +
        </span>
      );
    }
    scores.push(
      <span key="equals" className="equals">
        =
      </span>
    );
    scores.push(
      <span key="total" className="total-score">
        ￥{total}
      </span>
    );
    return (
      <div className="scores">
        {scores}
        {children}
      </div>
    );
  }

  renderBowl(onClick) {
    return (
      <div className="bowl" onClick={onClick}>
        <div className="label">{this.flavor ? this.flavor.name : "面"}</div>
        <div className="price">￥{this.totalPrice()}</div>
      </div>
    );
  }

  totalPrice() {
    return this.rules
      .map(r => r(this.ingredients).score || 0)
      .reduce((a, b) => a + b, 0);
  }
}

export const testNoodle = new Noodle();
testNoodle.ingredients.push(
  {
    type: "肉",
    name: "墨鱼"
  },
  {
    type: "菜",
    name: "软江叶"
  },
  {
    type: "佐料",
    name: "红油"
  },
  {
    type: "佐料",
    name: "红油"
  },
  {
    type: "佐料",
    name: "红油"
  }
);

testNoodle.rules.push(function(ings) {
  if (ings.length < 1) return {};
  if (ings.length < 5)
    return {
      type: "ok",
      message: "小份",
      score: 8
    };
  return {
    type: "ok",
    message: "大份",
    score: 13
  };
});

testNoodle.rules.push(function(ings) {
  const exists = !!ings.find(e => e.type == "肉");
  if (!exists) return {};
  return {
    type: "ok",
    message: "有肉",
    score: 3
  };
});

testNoodle.catalog.push({
  type: "肉",
  name: "花甲"
});
