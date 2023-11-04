import { escapeSpaces, getTooltipWrapperId, setZIndex } from "./Utils.ts";
import { FacilityDataStatic, SceneObject } from "./objects/index.ts";

export function getHtmlTooltip() {
    const htmlTooltip = document.querySelector("div#tooltip");

    if (!htmlTooltip || !(htmlTooltip instanceof HTMLDivElement)) {
        throw new Error("Tooltip element not found");
    }

    return htmlTooltip;
}

export function generateTooltipTable(label: string, data: SceneObject["data"], passportURI: string): [HTMLDivElement, number[]] | [] {
    console.log(label);
    
    const tooltip = document.querySelector(getTooltipWrapperId(label))
    const table = tooltip?.querySelector('table');
    
    if(!table || !tooltip) {
        return [];
    }

    const updateIntervals = [];

    for (const [key, value] of Object.entries(data)) {
        const row = table.insertRow();

        const cell1 = row.insertCell(0);
        const spacer = row.insertCell(1)
        const cell2 = row.insertCell(2);
        cell1.textContent = key;
        cell2.textContent = formatValue(value[0]);
        cell2.classList.add(getCellColor(value[1]));
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

    const spacerRow = table.insertRow();
    spacerRow.insertCell(0);
    spacerRow.insertCell(1);
    spacerRow.insertCell(2);
    spacerRow.classList.add('tooltip-spacer-row')

    if(passportURI) {
        const linkDiv = createPassportLink(passportURI)
        tooltip.appendChild(linkDiv);
    }

    return [tooltip as HTMLDivElement, updateIntervals];
}

function createPassportLink(passportURI: string): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add('passport-link-wrapper')
    setTimeout(() => div.classList.add('visible'), 0);
    const a = document.createElement('a');
    a.innerText = "Паспорт";
    
    a.href = passportURI;
    a.target="_blank"
    div.appendChild(a)

    return div;
}

export function generateTooltipNametag(label: string, content: string) {
    const wrapper = document.createElement("div");
    wrapper.id = `tooltip-wrapper-${escapeSpaces(label)}`
    wrapper.classList.add(`tooltip-wrapper`)

    const table = document.createElement("table");
    table.style.width = "100%";

    const firstRow = document.createElement("p");
    firstRow.classList.add('tooltip-header-row')

    const span = document.createElement('span');
    span.innerText = content;
    span.style.margin = 'auto';
    span.classList.add('tooltip-header-span')

    wrapper.appendChild(table);
    // wrapper.appendChild(firstRow);
    table.appendChild(firstRow)
    firstRow.appendChild(span)

    return wrapper
}


function formatValue(val: string | number) {
    if(!Number.isNaN(Number(val))) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
    // TODO: formatting?
    return String(val);
}

function getCellColor(color: FacilityDataStatic[1]) {
    switch(color) {
        case "green":
            return 'text-black'
        case "orange":
        case "yellow":
            return 'text-orange'
        case "red":
            return 'text-red'
    }
}

function getRandomIntInclusive(min: number, max: number): string {
  const res = Math.floor(Math.random() * (max - min + 1) + min);

  return String(res);
}

export function resetAnnotationsZIndex() {
    document.querySelectorAll('.annotation').forEach(el => setZIndex(el as HTMLElement, '2'))
}