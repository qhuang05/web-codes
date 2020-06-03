class Student {
    fullName: String;
    constructor(firstName, lastName){
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + ' ' + lastName;
    }
}

interface Person {
    firstName: String;
    lastName: String;
}
function greeter(person:Person){
    return "Hello, " + person.firstName + ' ' + person.lastName;
    // return "Hello, " + person.fullName;
}
// let user = "Jane User";
// let user = ["Jane User", "Mary"];
// let user = {firstName: "Jane", lastName: 'User'};
let user = new Student('Jane', 'User');
console.log(user)

document.body.innerHTML = greeter(user);
