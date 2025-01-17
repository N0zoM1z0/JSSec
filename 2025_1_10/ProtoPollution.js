// const o = {
//     a:1,
//     b:2,
//     c:3,
//     __proto__:{
//         b:6,
//         d:9
//     }
// }
//
// console.log(o.d);
//
// o1 = {
//     a:1,
//     b:2
// }
//
// o2 = {
//     a:11,
//     b:22
// }
// o2.__proto__.c = 33
//
// console.log(o2.c);
//
// o3 = {}
// console.log(o3.c);

function line(){
    console.log("-----------------------------");
}
function merge(target, source) {
    for (let key in source) {
        if (key in source && key in target) {
            merge(target[key], source[key])
        } else {
            target[key] = source[key]
        }
    }
}
line();
o1 = {}
o2 = JSON.parse('{"a":1,"__proto__":{"b":"polluted!"}}');
console.log(o2);
console.log(o1.b)
line();
merge(o1,o2);
console.log(o1.b);
line();
o3 = {}
console.log(o3.b);
