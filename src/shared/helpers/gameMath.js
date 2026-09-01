export function maxUpgradesCost(energy, currentCost) {
    if (energy < currentCost) return 0;

    const b = 2 * currentCost - 1;
    const disc = (2 * currentCost - 1) ** 2 + 8 * energy;

    const k = Math.floor((-b + Math.sqrt(disc)) / 2);

    return k * currentCost + k * (k - 1) / 2
}

