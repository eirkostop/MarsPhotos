// classic ES5 function syntax
function add(a, b) {
    return a + b;
}
// modern ES6 arrow syntax
let add_es6 = (a, b) => a + b;

// ES5
function print_and_add(a, b) {
    let result = a + b;
    console.log(`${a} + ${b} = ${result}`);
    return result;
}
// ES6
let print_and_add_es6 = (a, b) => {
    let result = a + b;
    console.log(`${a} + ${b} = ${result}`);
    return result;
}

const button = document.getElementById('button');
// ES5
button.addEventListener('click', function() {
    // do something
});
// ES6
button.addEventListener('click', () => {
    // do something
});

// What is callback hell?
setTimeout(function() {
    // do something
    setTimeout(function() {
        // do something else
        setTimeout(function() {
            // do somethin else else
            EXCEPTION
        }, 2000)
    }, 2000)
}, 2000)

function promisedTimeout(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
        } ,milliseconds);
    });
}

promisedTimeout(2000)
    .then(() => {
        console.log('2 seconds passed');
        return promisedTimeout(2000);
    })
    .then(() => {
        console.log('2 more seconds passed');
        return promisedTimeout(2000);
    })
    .then(() => {
        console.log('2 more seconds passed');
        return promisedTimeout(2000);
    });