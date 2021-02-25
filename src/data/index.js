const questions = require("./json/questions.json");
const answers = require("./json/answers.json");
const regulators = require("./json/regulators.json");
const requirements = require("./json/requirements.json");
const modules = require("./json/modules.json");
const subjects = require("./json/subjects.json");
const rules = require("./json/rules.json");
const supportingInfos = require("./json/supportingInformation.json");

const parseIdsAsInteger = (node) => {
  const properIds = Object.entries(node).map(([key, value]) =>
    key.match(/id/) ? [key, parseInt(value)] : [key, value]
  );
  const newObj = Object.fromEntries(properIds);
  return newObj;
};

const regulatorNodes = regulators.map(parseIdsAsInteger);
const regulatorLinks = [];

const questionNodes = questions.map(q => ({...q, label: "Question"})).map(parseIdsAsInteger)
const questionLinks = questionNodes.map((q) => ({
  source: q.id,
  target: q["id(regulator)"],
  label: "ABRIDGES",
}));

const answerNodes = answers
  .map((q) => ({ ...q, label: "Answer" }))
  .map(parseIdsAsInteger);
const answerLinks = answerNodes.map((a) => ({
  source: a.id,
  target: a["id(question)"],
  label: "ORGANIZES",
}));

const moduleNodes = modules.map(parseIdsAsInteger);
const moduleLinks = moduleNodes.map((mod) => ({
  source: mod["id(regulator)"],
  target: mod.id,
  label: "SLICED_INTO",
}));

const subjectNodes = subjects.map(parseIdsAsInteger);
const subjectLinks = subjectNodes.map((subj) => ({
  source: subj["id(module)"],
  target: subj.id,
  label: "SLICED_INTO",
}));

const ruleNodes = rules.map(parseIdsAsInteger);
const ruleLinks = ruleNodes.map((rule) => ({
  source: rule["id(subject)"],
  target: rule.id,
  label: "SLICED_INTO",
}));

const requirementNodes = requirements.map(parseIdsAsInteger);
const requirementLinks = requirementNodes.map((req) => ({
  source: req["id(rule)"],
  target: req.id,
  label: "SLICED_INTO",
}));

const supportingInfoNodes = supportingInfos.map(parseIdsAsInteger);
const supportingInfoLinks = [
  ...supportingInfoNodes.map((si) => ({
    source: si["id(rule)"],
    target: si.id,
    label: "SLICED_INTO",
  })),
  ...supportingInfoNodes.map((si) => ({
    source: si.id,
    target: si["id(subject)"],
    label: "APPLIES TO",
  })),
];

const supportingInfoLinks_DAGsafe = supportingInfoNodes.map((si) => ({
    source: si["id(rule)"],
    target: si.id,
    label: "SLICED_INTO",
}))

export const nodes = [
//  const nodes = [
  ...regulatorNodes,
  ...questionNodes,
  ...answerNodes,
  ...moduleNodes,
  ...subjectNodes,
  ...ruleNodes,
  ...requirementNodes,
  ...supportingInfoNodes,
];
export const links = [
  //  const links = [
  ...regulatorLinks,
  ...questionLinks,
  ...answerLinks,
  ...moduleLinks,
  ...subjectLinks,
  ...ruleLinks,
  ...requirementLinks,
  ...supportingInfoLinks,
];

console.log(nodes)
console.log(links)
/*
RULES
MATCH p=(reg:Regulator {name: "California Consumer Privacy Act (CCPA)"})-[:SLICED_INTO]->(module:Section)-[:SLICED_INTO]->(subject:Section)-[:SLICED_INTO]->(rule:Rule)
return  id(subject), id(rule), rule.relational_type, rule.starts_at, rule.number, rule.updated_at, rule.text, rule.position, rule.uuid, rule.slug, rule.risk_rating

SUPPORTING INFO
MATCH p=(reg:Regulator {name: "California Consumer Privacy Act (CCPA)"})-[:SLICED_INTO]->(module:Section)-[:SLICED_INTO*0..2]->(subject:Section)-[:SLICED_INTO]-(rule:Rule)-[:SLICED_INTO]->(si:SupportingInformation)
return id(si), id(rule), id(subject), si.relational_type, si.starts_at, si.updated_at, si.base_content,si.created_at,si.titles, si.content

SUBJECTS
MATCH p=(reg:Regulator {name: "California Consumer Privacy Act (CCPA)"})-[:SLICED_INTO]->(module:Section)-[:SLICED_INTO*0..2]->(sub:Section)-[:SLICED_INTO]->(rule:Rule)-[:SLICED_INTO]-()
return distinct id(module),id(sub),sub.relational_type,sub.name,sub.created_at,sub.position,sub.uuid,sub.slug

MODULES
MATCH p=(reg:Regulator {name: "California Consumer Privacy Act (CCPA)"})-[:SLICED_INTO]->(module:Section)-[:SLICED_INTO*0..2]->(sub:Section)-[:SLICED_INTO]->(rule:Rule)-[:SLICED_INTO]-()
return distinct id(regulator),id(module),module.relational_type,module.name,module.created_at,module.position,module.uuid,module.slug

ANSWERS
MATCH p=(a:Answer)<-[:ORGANIZES]-(q:Question)-[:ABRIDGES]->(reg:Regulator {name: "California Consumer Privacy Act (CCPA)"})
return id(question),id(a), a.uuid, a.content
*/
