const list = document.getElementById("pizza-list");
const templ = document.getElementById("template");

const el = {};

function _id() {
  return round(Math.random()*10000, 0).padStart(4, 0);
}
function newId() {
  return `${_id()}-${_id()}-${_id()}`;
}

document.getElementById("add-pizza").onclick = createNewPizza;
function createNewPizza() {
  const clone = templ.content.cloneNode(true);
  const root = clone.querySelector(".pizza");
  const id = newId();
  root.dataset.uid = id;
  el[id] = {};
  el[id]["increase-pizzas"] = root.querySelector(".amount > .increase-pizzas");
  el[id]["pizza-count"] = root.querySelector(".amount > span");
  el[id]["decrease-pizzas"] = root.querySelector(".amount > .decrease-pizzas");
  el[id]["diameter"] = root.querySelector(".circle > .diameter");
  el[id]["whole-price"] = root.querySelector(".whole-cost > .whole-price");
  el[id]["area-value"] = root.querySelector(".area > .area-value");
  el[id]["unit-price"] = root.querySelector(".unit-cost > .unit-price");
  /////
  el[id]["increase-pizzas"].onclick = plusPizza;
  el[id]["decrease-pizzas"].onclick = minusPizza;
  el[id]["diameter"].oninput = changeDiameter;
  el[id]["whole-price"].oninput = changePrice;
  list.appendChild(clone);
}
createNewPizza();

function inf(n) {
  return n == Infinity ? 0 : n;
}
function num(n) {
  return inf(Number(n) || 0);
}
function round(val, n) {
  return inf(num(val)).toFixed(n);
}
function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}


function updateArea(id, count) {
  const area = piR2(num(el[id]["diameter"].value)/2);
  el[id]["area-value"].textContent = round(area * count, 2);
}
function updatePrice(id, count) {
  const price = num(el[id]["whole-price"].dataset.price);
  el[id]["whole-price"].value = round(price * count, 2);
}
function plusPizza() {
  const id = this.parentElement.parentElement.dataset.uid;
  const count = changePizzaCount(id, 1);
  if(count <= 0)
    return this.parentElement.parentElement.remove();
  updateArea(id, count);
  updatePrice(id, count);
}
function minusPizza() {
  const id = this.parentElement.parentElement.dataset.uid;
  const count = changePizzaCount(id, -1);
  if(count <= 0)
    return this.parentElement.parentElement.remove();
  updateArea(id, count);
  updatePrice(id, count);
}

function changePizzaCount(id, delta) {
  const val = num(el[id]["pizza-count"].textContent);
  const total = clamp(val + delta, 0, 20);
  el[id]["pizza-count"].textContent = total;
  return total;
}
function changePizzaCountFixed(id, val) {
  const total = clamp(val, 1, 20);
  el[id]["pizza-count"].textContent = total;
}

function piR2(r) {
  return clamp(r**2 * Math.PI, 0, 9999);
}

// Called when diameter is changed
function changeDiameter() {
  // r = d/2
  const r = num(this.value)/2;
  // A = πr², clamped to [0, 9999]
  const a = piR2(r);
  // Resets pizza count to 1
  const id = this.parentElement.parentElement.dataset.uid;
  changePizzaCountFixed(id, 1);
  updateArea(id, 1);
  updatePrice(id, 1);
  // Updates total pizza area
  const area = el[id]["area-value"];
  // Rounded to 2 decimals
  area.textContent = round(a, 2);
  // Updates price, since area changed
  const price = num(el[id]["whole-price"].value);
  _changePrice(price, id);
}
// Called when price is changed
function changePrice() {
  // Gets price
  const price = num(this.value);
  // Saves price for 1 pizza
  this.dataset.price = price;
  // Resets pizza count to 1
  const id = this.parentElement.parentElement.dataset.uid;
  changePizzaCountFixed(id, 1);
  updateArea(id, 1);
  // Update price per unit of area
  _changePrice(price, id);
}
// Called by changing either diameter or price
function _changePrice(price, id) {
  // Calculates price per unit of area
  const area = num(el[id]["area-value"].textContent);
  // Clamped to [0, 999]
  const ppa = clamp(price/area, 0, 999);
  // Rounded to 4 decimals
  el[id]["unit-price"].textContent = round(ppa, 4);
}