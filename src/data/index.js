const regulator = require('./regulator.json')
const requirements = require('./requirements.json')


export const nodes = [...requirements, ...regulator]
export const links = requirements.map( r => ({source:regulator.id, target: r.id}))
