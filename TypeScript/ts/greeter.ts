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

