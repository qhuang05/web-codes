// function greeter(person: string){
//     return 'Hello, ' + person
// }
// let user = 'World';
// document.body.innerHTML = greeter(user);
// // tsc greeter.ts   报错



class Student {
  fullName: string;
  constructor(public firstName, public lastName) {
      this.fullName = `${firstName} ${lastName}`;
  }
}
interface Person{
  firstName: string;
  lastName: string;
}
function greeter(person: Person){
  return `Hello, ${person.firstName} ${person.lastName}`;
}
let user = new Student('Jane', 'User');
document.body.innerHTML = greeter(user);



for (var i = 0; i < 10; i++) {
  // capture the current state of 'i'
  // by invoking a function with its current value
  (function (i) {
      setTimeout(function () { console.log(i); }, 100 * i);
  })(i);
}