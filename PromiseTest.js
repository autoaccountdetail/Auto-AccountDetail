const promise1 = (param) => {
    return new Promise((resolve, reject) => {
        if(param){ // 성공했을 때 resolve, 실패했을 때 reject
            resolve("Resolve!");
        } else {
            reject("Reject!");
        }
    })
};

promise1(true).then((result) => {
    console.log("Success : " + result);
}, (err) => {
    console.log("Error: "+ err);
});

console.log("End");