'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const displayMovements = function(movements){
    containerMovements.innerHTML = '';
    movements.forEach(function(mov,i){
        const type = mov > 0 ? 'deposit' : 'withdrawal' ;
        const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1}${type}
        </div>
        <div class="movements__value">${mov}€</div>
      </div>`; 
      containerMovements.insertAdjacentHTML('afterbegin',html);
    });
};

// displayMovements(account1.movements);
//! how caluclate Summary 
 const calcDisplaySummary = function(acc){
    //?incom
    const incomes = acc.movements
               .filter(mov => mov > 0 )
               .reduce((acc,mov) => acc + mov,0 );
               labelSumIn.textContent = `${incomes}€ `;
    //?out 
    const out = acc.movements
    .filter(mov => mov < 0 )
    .reduce((acc,mov) => acc + mov,0 );
    labelSumOut.textContent = `${out}€ `;


    //?insert
    const insert = acc.movements
    .filter(mov => mov > 0 )
    .map(deposit => deposit *acc.interestRate/100)
    .filter((int,i,arr)=>{
        // console.log(arr);
        return int >= 1;
    })
    .reduce((acc,int) => acc + int,0 );
    labelSumInterest.textContent = `${insert}€ `;
 }

//  calcDisplaySummary(account1.movements)



//!how caluclaat price 
const calaDisplayPrintBalance = function (acc){
    const balance = acc.movements.reduce((acc,mov)=>
     acc+ mov,0);
     acc.balance = balance;
    labelBalance.textContent = `${acc.balance} €`
}
// calaDisplayPrintBalance(account1.movements)
//!3^ add username for all accounts

const createUsernames = function (accs){
    accs.forEach(function(acc){
       acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map( name=>name[0] )
        .join('');
    }) 
};
createUsernames(accounts);
// console.log(accounts);
//! update UIT 
const updateUI = function(acc){
     // ? DISPLAY movements
     displayMovements(acc.movements);
        
     // ? DISPLAY balance

     calaDisplayPrintBalance(acc);
     // ? DISPLAY summary
     
     calcDisplaySummary(acc);
}
//!LOGIN btn 
let currentAccount;

btnLogin.addEventListener('click',function(e){
    //Prevent form from submitting 
    e.preventDefault();

    // console.log('LOGIN ');

    currentAccount =  accounts.find(
        acc => acc.username === inputLoginUsername.value);
    // console.log(currentAccount);

    if(currentAccount?.pin === Number(inputLoginPin.value)){
        // console.log('LOGIN');
        //? Clear input fields 
     inputLoginUsername.value = inputLoginUsername.value = '';
     inputLoginPin.value = inputLoginPin.value = '';
     inputLoginPin.blur();

        // ? DISPLAY UI and message 
          labelWelcome.textContent =
           `Welcome back, ${currentAccount.owner.split(' ')[0]}`
           //?Hide ui 
           containerApp.style.opacity = 100
        //!update UI 
       updateUI(currentAccount);
    }
})

//! btn translate 

btnTransfer.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    //! to clear input 

    inputTransferAmount.value = inputTransferTo.value = '';
    console.log(amount,receiverAcc);

    if(amount > 0 &&
         receiverAcc &&
         currentAccount.balance >= amount && 
         receiverAcc?.username !== currentAccount.usernam ){
    //    console.log('Transfar value ');
   
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    

       //!update UI 
       updateUI(currentAccount);
    }
});


//! btn close 

btnClose.addEventListener('click' , function(e){
 e.preventDefault();
//  console.log('Delete');


if(inputCloseUsername.value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin)
    {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username);
           console.log(index);
           //.indexOf(23)
           //?delete account
      accounts.splice(index,1);

       //?Hide ui 
       containerApp.style.opacity = 0;
    }

    //?to cleare field 
inputCloseUsername.value = inputClosePin.value = ' ';

});
 //!btn LOAN 

 btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    // console.log('click');

    const amount = Number(inputLoanAmount.value);
    if ( amount > 0 && currentAccount.movements.some(mov => mov<= amount * 0.1)){
        //?ADD amount 
        currentAccount.movements.push(amount)

        //?update Ui 
       updateUI(currentAccount);
    }

    inputLoanAmount.value = ' '; 
 })

// //!151 hoe usename 2^

// const createUsernames = function (user){
//     const username = user
//     .toLowerCase()
//     .split(' ')
//     .map( name=>name[0] )
//     .join('');
//    return username; 
// };
// console.log(createUsernames('Steven Thomas Williams'));
// console.log(createUsernames(account1.owner));


//!1^
// const user = 'Steven Thomas Williams';
// const username = user.toLocaleLowerCase().split(' ').map(
//     name=>name[0]
// //     function(name){
// //     return name[0];// [ "s", "t", "w" ]
// // }
// )
// .join('');

// console.log(username);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);



const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//?slice
// let arr = ['a','b','c','d','e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1,-2));
// console.log(arr.slice());
// console.log([...arr]);
//?splice 

// console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1,2);
// console.log(arr);

//?REVERSE

// arr = ['a','b','c','d','e'];
// const arr2 = ['j','i','h','g','j'];
// console.log(arr2.reverse());
// console.log(arr2);
//? CONCAT

// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr,...arr2]);

//?join

// console.log(letters.join(' - '));//a - b - c - d - e - j - g - h - i - j

//? AT 

// const arr = [23,11,64];

// console.log(arr[0]);//23
// console.log(arr.at(0));//23

// console.log(arr[arr.length - 1]);//64
// console.log(arr.slice(-1)[0]);//64
// console.log(arr.at(-2));//64
// // console.log(arr.at(-1));//11

// //?at work with string
//  console.log('jonase kool '.at(5));
//!loop Array
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// for( const movement of movements){
//     if(movement > 0){
//         console.log(`You deposited ${movement}`);
//     }else{
//         console.log(`You withdrew ${Math.abs(movement)}`);
//     }
// }

//!forEach
// console.log("-------forEach-------");
// movements.forEach(function(movement){
//     if(movement > 0){
//         console.log(`You deposited ${movement}`);
//     }else{
//         console.log(`You withdrew ${Math.abs(movement)}`);
//     }
// });
//0: FUNCTION(200)
//1: FUNCTION(450)
//2: FUNCTION(400)

// console.log("lllll?/??");

// for( const [i,movement] of movements.entries()){
//     if(movement > 0){
//         console.log(`Movement ${i+1}: You deposited ${movement}`);
//     }else{
//         console.log(`Movement ${i+1}: You withdrew ${Math.abs(movement)}`);
//     }
// }

// console.log("-------forEach-@------");
// movements.forEach(function(movement,index,array){
//     if(movement > 0){
//         console.log(`Movement ${index+1}: You deposited ${movement}`);
//     }else{
//         console.log(`Movement ${index+1}: You withdrew ${Math.abs(movement)}`);
//     }
// });

//!+++_-=-==+++MAPS++_+_++

// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
//   ]);

//   currencies.forEach(function(value,key,map){
//      console.log(`${key}:${value}`);
//   }) ;

//   ///!_+__+__++SET

//   const currenciesUnique = new Set(['USD','GBP','USD','EUR','EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function ( value,_,map){
//     console.log(`${value}: ${value}`);
// })
//!+_++__+CHALENge 

// The Complete JavaScript Course 23
// Working With Arrays
// Coding Challenge #1
// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// 🐶 ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far 😉
// GOOD LUCK 😀

// const checkDogs = function(dogsJulia,dogsKate){
// const juliaCorrect = dogsJulia.slice();
// juliaCorrect.splice(0,1);
// juliaCorrect.splice(-2);
// const dogs = juliaCorrect.concat(dogsKate);

// console.log(dogs);

// dogs.forEach(function(dog,i){
//     if(dog >= 3){
//         console.log(`Dog number ${i+1}
//          is an adult, and is ${dog} years old`);
//     }else{
//         console.log(`Dog number ${i+1} is still a puppy
//          🐶`);
//     }
// })

// }

// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3],[10, 5, 6, 1, 4]);
//!MAP
// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov=> mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for(const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

//     const movementDescriptions = movements.map((mov,i,arr)=>
    
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited': 'withdrew'} ${Math.abs(mov)}`
    
    // {
    //     if(mov>0 ){
    //     return `Movement ${i+1}: You deposited ${mov}`;
    //     }else{
    //         return `Movement ${i+1}: You withdrew ${Math.abs(mov)}`;
    // } }
    // );
//    console.log(movementDescriptions);
//!)(_(()__((((((FILTER))))))))
// //?this way more refer to lower code 
// const deposits = movements.filter(function(mov){
// return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// //?another solution

// const depositsFor = [];
// for(const mov of movements)if (mov >0 ) depositsFor.push(mov);
// console.log(depositsFor);

// //?small //!challeng

// const withdrawals = movements.filter(mov => mov < 0 );

// console.log(withdrawals);

//!_)))(())Reduce)(((())))

// console.log(movements);

// //accumlator -> snowball
// const balance = movements.reduce(function(acc,cur,i,arr){
//   console.log(`Iteration ${i}: acc ${acc} cur ${cur}`);
//   return acc + cur;
// },0);
// //? arrow 

// // const balance = movements.reduce((acc,cur,) => acc + cur ,0);

// console.log('ba',balance);

// //? another ways 

// let balance2 = 0 ;

// for(const mov of movements) balance2 += mov;
// console.log(balance2); 

// //?Maximum value 
//  const max = movements.reduce((acc,mov) =>{
//  if (acc > mov)
//  return  acc ;
//  else 
//  return mov ;
//  }, movements[0]);
//  console.log(`MAX : ${max}`);

//! chalenge jolay 

// The Complete JavaScript Course 24
// Coding Challenge #2
// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK 😀

// const calcAverageHumanAge = function(age){
//     const humanAges = age.map(
//         age => age <= 2 ? 2*age : 16 + age * 4  );
//     const adults = humanAges.filter(age => age >= 18);
//     console.log(humanAges);
//     console.log(adults);

//     const average = adults.reduce((acc,age,i,arr) => acc + age / Array.length, 0 );
//     return average; 
// }

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1,avg2);
// const eurToUsd = 1.1;
// //?PIPELINE

// const totalDepositsUSD = movements
// .filter(mov => mov > 0 )
// .map((mov, i,arr) =>{
//     console.log(arr);
//     return mov * eurToUsd;
// })
                   
//                     // .map(mov=>mov * eurToUsd)
//                     .reduce((acc,mov) => acc + mov,0);
// console.log(totalDepositsUSD);



//!Coding Challenge #3
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK 😀


// const calcAverageHumanAge = ((age)=>
//       age
//     .map(age => age <= 2 ? 2*age : 16 + age * 4  )//logic 
//     .filter(age => age >= 18)//math
//     .reduce((acc,age,i,arr) => acc + age / arr.length, 0 )//result
//  )
 

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])

// console.log(avg1,avg2);

//!FIND

// const firstWithdrawal = movements.find(mov => mov < 0 );//return the first emlemnt true condtion 
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account);
// //!find method


//! SOME 
//?WQUALITY
console.log(movements);
console.log(movements.includes(-130));//true 


//?CONDITION
console.log(movements.some(mov => mov == -130));

const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);

//! EVERY 


const allDeposits = movements.every(mov => mov > 0);
console.log(allDeposits);
console.log(account4.movements.every(mov => mov > 0));


