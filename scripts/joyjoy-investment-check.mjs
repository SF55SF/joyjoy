import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calculateInvestment,validateProperty,isPublishedProject} from '../public/js/joyjoy-investment-model.js';
const m={currency:'USD',purchasePrice:1000000,transactionCosts:20000,fitOutCosts:80000,otherCosts:0,lettableArea:500,monthlyRent:20,occupancy:90,annualExpenses:18000};
const r=calculateInvestment(m);
assert.equal(r.totalInvestment,1100000);assert.equal(r.annualRent,108000);assert.equal(r.annualNet,90000);assert.equal(r.paybackYears,1100000/90000);
for(const [key,value] of [['monthlyRent',null],['transactionCosts',null],['purchasePrice',0],['lettableArea',0],['occupancy',101],['annualExpenses',-1]])assert.equal(calculateInvestment({...m,[key]:value}).ok,false);
assert.equal(calculateInvestment({...m,occupancy:0}).paybackYears,null);
assert.equal(calculateInvestment({...m,annualExpenses:108000}).paybackYears,null);
assert.equal(calculateInvestment({...m,annualExpenses:200000}).paybackYears,null);
const ids=new Set();for(const name of fs.readdirSync('src/content/properties').filter(x=>x.endsWith('.json'))){const p=JSON.parse(fs.readFileSync('src/content/properties/'+name,'utf8'));assert.deepEqual(validateProperty(p),[],name);assert.equal(name,p.slug+'.json');assert.ok(!ids.has(p.slug));ids.add(p.slug);if(p.showProjects&&p.published!==false)assert.equal(isPublishedProject(p),true);}
for(const page of ['index.html','en/index.html','uz/index.html','projects/index.html','en/projects/index.html','uz/projects/index.html','admin/joyjoy/index.html'])assert.ok(fs.existsSync('dist/'+page),'Missing built page: '+page);
console.log('JoyJoy: investment formulas, incomplete/zero/negative scenarios, property data and built routes passed.');
