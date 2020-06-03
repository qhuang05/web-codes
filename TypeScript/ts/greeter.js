var Student = /** @class */ (function () {
    function Student(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + ' ' + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstName + ' ' + person.lastName;
    // return "Hello, " + person.fullName;
}
// let user = "Jane User";
// let user = ["Jane User", "Mary"];
// let user = {firstName: "Jane", lastName: 'User'};
var user = new Student('Jane', 'User');
console.log(user);
document.body.innerHTML = greeter(user);
