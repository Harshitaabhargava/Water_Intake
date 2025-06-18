function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadData() {
  return JSON.parse(localStorage.getItem("waterData") || "{}");
}

function saveData(data) {
  localStorage.setItem("waterData", JSON.stringify(data));
}

function addWater(amount) {
  const data = loadData();
  const today = getToday();
  data[today] = (data[today] || 0) + amount;
  saveData(data);
  updateUI();
}

function addCustomWater() {
  const customInput = document.getElementById("customAmount");
  const amount = parseInt(customInput.value);
  if (!isNaN(amount) && amount > 0) {
    addWater(amount);
    customInput.value = "";
  }
}

function updateUI() {
  const data = loadData();
  const today = getToday();
  const goalInput = document.getElementById("goal");
  const goal = parseInt(goalInput.value) || 2000;
  const total = data[today] || 0;
  const percent = Math.min((total / goal) * 100, 100);

  // Update status
  document.getElementById("status").textContent = `Today: ${total} / ${goal} ml`;
  document.getElementById("progress").style.width = percent + "%";

  // Update history
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  const dates = Object.keys(data).sort().reverse().slice(0, 7);
  dates.forEach(date => {
    const li = document.createElement("li");
    const isToday = date === today ? " (today)" : "";
    const tick = data[date] >= goal ? " ✓" : "";
    li.textContent = `${date}: ${(data[date] / 1000).toFixed(1)} L${tick}${isToday}`;
    historyList.appendChild(li);
  });
}

document.getElementById("goal").addEventListener("change", updateUI);
window.onload = updateUI;
