const regulators = require('./regulators.json');
const sections = require('./sections.json');
const requirements = require('./requirements.json');
const rules = require('./rules.json');
const requirementLinks = require('./requirementLinks.json');

export const nodes = [...requirements, ...sections, ...regulators, ...rules];
export const links = [];

requirementLinks.forEach((r) =>
  links.push(
    { source: r.regulator_id, target: r.section_id },
    { source: r.section_id, target: r.rule_id },
    { source: r.rule_id, target: r.id }
  )
);
