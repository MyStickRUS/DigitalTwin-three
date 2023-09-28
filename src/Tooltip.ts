import { FacilityBoxDataDynamic, FacilityDataStatic } from "./ObjectController";

export function getHtmlTooltip() {
    const htmlTooltip = document.querySelector("div#tooltip");

    if (!htmlTooltip || !(htmlTooltip instanceof HTMLDivElement)) {
        throw new Error("Tooltip element not found");
    }

    return htmlTooltip;
}

export function generateTooltipTable(displayName: string, data: { [K: string]: FacilityDataStatic | FacilityBoxDataDynamic }): [HTMLDivElement, number[]] {
    console.log(displayName);
    const wrapper = document.createElement("div");

    const updateIntervals = [];

    const firstRow = document.createElement("p");
    firstRow.innerText = displayName;
    firstRow.style.textAlign = "center";
    firstRow.style.margin = "0";
    wrapper.appendChild(firstRow);

    const table = document.createElement("table");
    wrapper.appendChild(table);

    let i = 1;
    for (const [key, value] of Object.entries(data)) {
        const row = table.insertRow();

        row.style.backgroundColor = i % 2 === 0 ? "gray" : "black";
        i++;

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = key;
        cell2.textContent = formatValue(value[0]);
        cell2.style.color = value[1];

        cell2.style.fontWeight = "bold";
        cell2.style.textAlign = "center";
        cell2.style.paddingLeft = "15px";
        cell2.style.paddingRight = "15px";
        cell1.style.paddingLeft = "5px";
        cell1.style.paddingRight = "20px";

        
        const [valMin, valMax, updateIntervalSec] = [value[2], value[3], value[4]];
        if(!valMin || !valMax || !updateIntervalSec) {
          continue;
        }

        const interval = setInterval(() => {cell2.innerText = getRandomIntInclusive(valMin, valMax)}, updateIntervalSec * 1000)
        updateIntervals.push(interval);
    }

    return [wrapper, updateIntervals];
}

function formatValue(val: string | number) {
    // TODO: formatting?
    return String(val);
}

function getRandomIntInclusive(min: number, max: number): string {
  const res = Math.floor(Math.random() * (max - min + 1) + min);

  return String(res);
}