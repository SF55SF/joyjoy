import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../public/js/joyjoy-money-display.js',import.meta.url),'utf8');
for(const lang of ['ru','uz','en']){
  let observer;
  const parent={closest:()=>null};
  const text=value=>({nodeType:3,nodeValue:value,parentElement:parent});
  const scaled=['$7.52 млн','$7.52 тыс','$7.52 million','$7.52 thousand','$7.52 ming','$7.52 mln','$7.52 m','$7.52 k'];
  const nodes=[text('$1,234.56'),text('1 234,56 $'),...scaled.map(text),text('IRR 11.5%'),text('$0.00')];
  const skipped=text('$1.25');skipped.parentElement={closest:()=>({})};nodes.push(skipped);
  const body={nodeType:1,matches:()=>false};
  vm.runInNewContext(source,{
    document:{documentElement:{lang},body,readyState:'complete',createTreeWalker(){let index=0;return {nextNode(){this.currentNode=nodes[index++];return !!this.currentNode;}};}},
    NodeFilter:{SHOW_TEXT:4},
    MutationObserver:class {constructor(callback){observer=callback;}observe(){}}
  });
  const formatted=new Intl.NumberFormat(lang==='en'?'en-US':'ru-RU',{maximumFractionDigits:0}).format(1235);
  assert.equal(nodes[0].nodeValue,'$'+formatted);
  assert.equal(nodes[1].nodeValue,formatted+' $');
  assert.deepEqual(nodes.slice(2,10).map(node=>node.nodeValue),scaled);
  assert.equal(nodes[10].nodeValue,'IRR 11.5%');
  assert.equal(nodes[11].nodeValue,'$0');
  assert.equal(skipped.nodeValue,'$1.25');
  const dynamic=text('$42.60');observer([{type:'childList',addedNodes:[dynamic]}]);
  assert.equal(dynamic.nodeValue,'$43');
  observer([{type:'characterData',target:dynamic}]);assert.equal(dynamic.nodeValue,'$43');
}
console.log('Joy2 V249: money display, scaled KPIs, excluded inputs and dynamic text passed in RU/UZ/EN.');
