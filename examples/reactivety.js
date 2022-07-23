import { Dep, watchEffect, reactive } from '../src/reactivety/index.js';


// example
// a 变化的时候, 自动执行副作用 --> b = a.val + 10
// const a = new Dep(10);
// let b = 0;
// watchEffect(() => {
//   b = a.value + 10;
// });

// // a.value = 20 will trigger b = 30
// a.value = 20;
// console.log(`a: ${a.value}, b: ${b}`);

const student = reactive({
    age: 20,
})

let b;
watchEffect(() => {
    b = student.age + 1
})

student.age = 30
console.log(`student.age: ${student.age} b: ${b}`)

