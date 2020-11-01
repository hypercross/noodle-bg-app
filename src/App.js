import React from "react";
import "./style.css";
import * as sichuan from "./sichuan";
import { Noodle } from "./noodle";

export default function App() {
  const [i, inc] = React.useReducer(i => i + 1, 0);
  const noodle = React.useMemo(() => new Noodle(), []);
  const { select, flavor } = sichuan.useFlavorSelect();

  noodle.useUpdate(inc);
  noodle.catalog = sichuan.catalog;
  noodle.rules = [...flavor.rules, ...sichuan.basicRules];

  return (
    <div>
      {noodle.renderCatalog()}
      {noodle.renderIngredients()}
      {select}
      {noodle.renderRules()}
      {noodle.renderTotalScore()}
    </div>
  );
}
