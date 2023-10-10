import { FacilityBoxDataDynamic, FacilityDataStatic } from "./objects/index.ts";

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
    firstRow.classList.add('tooltip-header-row')

    const span = document.createElement('span');
    span.innerText = displayName;
    span.style.margin = 'auto';
    span.classList.add('tooltip-header-span')
    firstRow.appendChild(span)
    wrapper.appendChild(firstRow);

    const table = document.createElement("table");
    table.style.width = "100%";
    wrapper.appendChild(table);

    let i = 1;
    for (const [key, value] of Object.entries(data)) {
        const row = table.insertRow();

        row.style.backgroundColor = i % 2 === 0 ? "#666666" : "black";
        i++;

        const cell1 = row.insertCell(0);
        const spacer = row.insertCell(1)
        const cell2 = row.insertCell(2);
        cell1.textContent = key;
        cell2.textContent = formatValue(value[0]);
        cell2.style.color = getCellColor(value[1]);
        cell1.classList.add('tooltip-cell-left')
        cell2.classList.add('tooltip-cell-right')
        spacer.classList.add('tooltip-spacer');

        // cell2.style.fontWeight = "bold";
        // cell2.style.textAlign = "center";
        // cell2.style.paddingLeft = "15px";
        // cell2.style.paddingRight = "15px";
        // cell1.style.paddingLeft = "5px";
        // cell1.style.paddingRight = "20px";

        const [valMin, valMax, updateIntervalSec] = [value[2], value[3], value[4]];
        if(!valMin || !valMax || !updateIntervalSec) {
          continue;
        }

        const interval = setInterval(() => {
            cell2.innerText = getRandomIntInclusive(valMin, valMax)
        }, updateIntervalSec * 1000)
        updateIntervals.push(interval);
    }

    return [wrapper, updateIntervals];
}

function formatValue(val: string | number) {
    // TODO: formatting?
    return String(val);
}

function getCellColor(color: FacilityDataStatic[1]) {
    switch(color) {
        case "green":
            return '#29FF00'
        case "orange":
        case "yellow":
            return '#ECE21E'
        case "red":
            return '#FF0000'
    }
}

function getRandomIntInclusive(min: number, max: number): string {
  const res = Math.floor(Math.random() * (max - min + 1) + min);

  return String(res);
}