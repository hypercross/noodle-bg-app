import React from "react";
import "./style.css";
import * as sichuan from "./sichuan";
import { Noodle } from "./noodle";

function NoodleSelector(props) {
  return (
    <div className="noodle-select">
      {props.noodles.map((noodle, i) =>
        i == props.active
          ? props.select
          : noodle.renderBowl(() => props.pick(i))
      )}
    </div>
  );
}

export default function App() {
  const [_, inc] = React.useReducer(i => i + 1, 0);
  const noodles = React.useMemo(
    () => [new Noodle(), new Noodle(), new Noodle()],
    []
  );
  const [i, setI] = React.useState(0);
  const noodle = noodles[i];
  const select = sichuan.renderFlavorSelect(noodle);

  noodle.useUpdate(inc);
  noodle.catalog = sichuan.catalog;
  noodle.rules = [
    ...(noodle.flavor ? noodle.flavor.rules : []),
    ...sichuan.basicRules
  ];

  return (
    <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      {noodle.renderCatalog()}
      {noodle.renderIngredients()}
      {noodle.renderRules()}
      {noodle.renderTotalScore(
        <span className="player-score">
          / ￥{noodles.map(n => n.totalPrice()).reduce((a, b) => a + b, 0)}
        </span>
      )}
      <NoodleSelector
        noodles={noodles}
        active={i}
        select={select}
        pick={setI}
      />
    </div>
  );
}
