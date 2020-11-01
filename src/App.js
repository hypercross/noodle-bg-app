import React from "react";
import "./style.css";
import { testNoodle } from "./noodle";
import * as sichuan from "./sichuan";

testNoodle.catalog = sichuan.catalog;
testNoodle.rules = sichuan.basicRules;

export default function App() {
  const [i, inc] = React.useReducer(i => i + 1, 0);
  testNoodle.useUpdate(inc);
  const { select, flavor } = sichuan.useFlavorSelect();

  testNoodle.rules = [...sichuan.basicRules, ...flavor.rules];
  return (
    <div>
      {testNoodle.renderCatalog()}
      {testNoodle.renderIngredients()}
      {select}
      {testNoodle.renderRules()}
      {testNoodle.renderTotalScore()}
    </div>
  );
}
