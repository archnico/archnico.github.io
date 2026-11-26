const {screen}=require('./thermal.js');
const base={model:'dummy',variant:'A',face:'rear',next:0,u0:0,u1:65,v0:0,v1:190,wallRear:0,wallFront:500,top:500,leftWall:250};
function expect(o,name,d){const r=screen(o);if(!r.hits.some(h=>h[0].includes(name)&&h[1]===d))throw Error(name+' '+d);}
expect(base,'Parete posteriore',95);
expect({...base,face:'right',u1:195,next:1},'Carrier occupato',97.5);
expect({...base,face:'right',u1:195,next:0},'Guida propria',30.5);
expect({...base,face:'top',u1:65,v1:195,top:400},'Ostacolo superiore',186.5);
if(!screen({...base,face:'bottom',v1:195}).exception)throw Error('bottom exception missing');
if(!screen({...base,u1:200}).error)throw Error('rectangle outside face');
console.log('PASS: rear 95, adjacent 97.5, guide 30.5, top 186.5, exception, invalid rectangle');
