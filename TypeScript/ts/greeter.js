// function greeter(person: string){
//     return 'Hello, ' + person
// }
// let user = 'World';
// document.body.innerHTML = greeter(user);
// // tsc greeter.ts   报错
var Student = /** @class */ (function () {
    function Student(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
var user = new Student('Jane', 'User');
document.body.innerHTML = greeter(user);
