export function updateHtmlTooltipContent(tooltip: HTMLDivElement) {
    [
        [tooltip.querySelector('#tooltipEnergyMetric'), 10],
        [tooltip.querySelector('#tooltipHeatMetric'), 5],
        [tooltip.querySelector('#tooltipSteamMetric'), 1],
    ].forEach(payload => {
        const el = payload[0];
        if (!el) return;

        const multiplier = payload[1] as number;

        (el as Element).innerHTML = Math.floor(Math.random() * 1000 * multiplier).toString();
    })
}

export function getHtmlTooltip() {
    const htmlTooltip = document.querySelector("div#tooltip");

    if(!htmlTooltip || !(htmlTooltip instanceof HTMLDivElement)) {
        throw new Error("Tooltip element not found")
    }

    return htmlTooltip;
}