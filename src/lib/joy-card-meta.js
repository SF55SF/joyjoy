import { calculateInvestment, hasPublishedInvestment, hasPublishedUnitInvestment } from '../../public/js/joyjoy-investment-model.js';

// Metadata for the catalog card. Financial formulas remain in the existing model.
export function buildJoyCardMeta(property) {
  const enabled = property.showProjects === true;
  const models = [];
  if (enabled) {
    if (hasPublishedInvestment(property)) {
      const result = calculateInvestment(property.investment);
      if (result.ok && Number.isFinite(result.irrPercent) && Number.isFinite(result.netProfit)) models.push(result);
    }
    for (const unit of property.units || []) {
      if (!hasPublishedUnitInvestment(unit)) continue;
      const result = calculateInvestment(unit.investment);
      if (result.ok && Number.isFinite(result.irrPercent) && Number.isFinite(result.netProfit)) models.push(result);
    }
  }
  models.sort((a, b) => b.irrPercent - a.irrPercent || b.netProfit - a.netProfit);
  const units = Array.isArray(property.units) ? property.units.filter(u => u.published !== false) : [];
  const areas = units.map(u => Number(u.area)).filter(n => Number.isFinite(n) && n > 0);
  const prices = units.map(u => Number(u.pricePerSqm)).filter(n => Number.isFinite(n) && n > 0);
  const askingTotal = Number(property.priceUsd);
  const singleTotal = units.length === 1 ? Number(units[0].area) * Number(units[0].pricePerSqm) : NaN;
  const fullPrice = Number.isFinite(askingTotal) && askingTotal > 0 ? askingTotal : singleTotal;
  const priceMode = units.length > 1 ? (prices.length ? 'perSqm' : 'request') : (Number.isFinite(fullPrice) && fullPrice > 0 ? 'total' : 'request');
  return {
    slug: property.slug,
    investment: enabled && models.length > 0,
    status: property.status || null,
    areaMin: areas.length ? Math.min(...areas) : property.area,
    areaMax: areas.length ? Math.max(...areas) : property.area,
    priceMode,
    priceValue: priceMode === 'perSqm' ? Math.min(...prices) : priceMode === 'total' ? fullPrice : null,
    irr: models[0]?.irrPercent ?? null,
    profit: models[0]?.netProfit ?? null
  };
}
