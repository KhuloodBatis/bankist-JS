'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2022-08-15T14:11:59.604Z',
      '2022-08-10T17:01:17.194Z',
      '2022-08-20T23:36:17.929Z',
      '2022-08-21T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const accounts = [account1, account2];
  

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

//! FORMAT DATE 
const formatMovementDate = function(date,locale){
    const calcDaysPassed = (date1,date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
   const daysPassed = calcDaysPassed(new Date(), date)
   console.log(daysPassed);

      if(daysPassed === 0) return 'Today';
      if(daysPassed === 1) return 'Yesterday';
      if(daysPassed <= 7) return `${daysPassed} days ago `;
    //   else{
    //     // const day = `${date.getDate()}`.padStart(2,0);
    //     // const month = `${date.getMonth()+1}`.padStart(2,0);
    //     // const year = date.getFullYear();
    //     // return  `${day}/${month}/${year}` ;
    //   }
    return new Intl.DateTimeFormat(locale).format(date);

}
//!CURRENCY
const formatCur = function(value,locale,currency){

    return  new Intl.NumberFormat(locale,{
        style: 'currency',
        currency: currency
    }).format(value);
} 


//!displayMovements
const displayMovements = function(acc, sort=false){
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a,b)=> a-b):acc.movements;

    movs.forEach(function(mov,i){
        const type = mov > 0 ? 'deposit' : 'withdrawal' ;
        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date,acc.locale);
        const formattedMov = formatCur(mov,acc.locale,acc.currency);

        const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1}${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
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
labelSumIn.textContent = formatCur(
    incomes,
    acc.locale,
    acc.currency);


    //?out 
    const out = acc.movements
    .filter(mov => mov < 0 )
    .reduce((acc,mov) => acc + mov,0 );
    labelSumOut.textContent = formatCur(
        Math.abs(out),
        acc.locale,
        acc.currency);


    //?insert
    const insert = acc.movements
    .filter(mov => mov > 0 )
    .map(deposit => deposit *acc.interestRate/100)
    .filter((int,i,arr)=>{
        // console.log(arr);
        return int >= 1;
    })
    .reduce((acc,int) => acc + int,0 );
    labelSumInterest.textContent =formatCur(
        insert,
        acc.locale,
        acc.currency);
 }

//  calcDisplaySummary(account1.movements)



//!how caluclaat price 
const calaDisplayPrintBalance = function (acc){
    acc.balance = acc.movements.reduce((acc,mov)=>
     acc + mov,0);

    labelBalance.textContent = formatCur(
        acc.balance,
        acc.locale,
        acc.currency);
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
     displayMovements(acc);
        
     // ? DISPLAY balance

     calaDisplayPrintBalance(acc);
     // ? DISPLAY summary
     
     calcDisplaySummary(acc);
}

//! SET TIME 
const startLogOutTimer = function(){
   const tick = function(){

        const min = String(Math.trunc(time/60)).padStart(2,0);
        const sec = String(time % 60).padStart(2,0) ;
       
        //! In each call, print the remaing time to UI
       labelTimer.textContent = `${min}:${sec}`;

       //! When 0 seconds, stop timer and log out user 
       
       if( time === 0  ){
          clearInterval(timer)
              // ? DISPLAY UI and message 
              labelWelcome.textContent ='Log in to get started'
              //?Hide ui 
              containerApp.style.opacity = 0
       }
              
       //! Decrese 1s
       
       time--;
       }
        //! SET time to 5 minutes 
        let time  =120;

        tick()
        //!Call the timer every second 
        const timer = setInterval(tick,1000);
        return timer;
}



//!LOGIN btn 
let currentAccount, timer;
//!Fake ALWAYS LOGGED IN
// currentAccount= account1;
// updateUI(currentAccount);



btnLogin.addEventListener('click',function(e){
    //Prevent form from submitting 
    e.preventDefault();

    // console.log('LOGIN ');

    currentAccount =  accounts.find(
        acc => acc.username === inputLoginUsername.value);
    // console.log(currentAccount);

    if(currentAccount?.pin === +(inputLoginPin.value)){
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
           //Creat current data and time 
           
        //    const day = `${now.getDate()}`.padStart(2,0);
        //    const month = `${now.getMonth() + 1}`.padStart(2,0);
        //    const year = now.getFullYear();
        //    const hour = `${now.getHours()}`.padStart(2,0);
        //    const min = `${now.getMinutes()}`.padStart(2,0);
        //    labelDate.textContent = `${day}/ ${month}/${year}, ${hour}:${min}`;

        //!Ewperimenting API 
        const now = new Date();
        //?option date 

        const options = {
            hour : 'numeric',
            minute : 'numeric',
            day : 'numeric',
            month : 'numeric',
            year: 'numeric',
            // weekday : 'long'
        }

        const local = navigator.languages;
        console.log(local);//en-US or en-GB
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.local, options).format(now);

        //!ti start Timer 
     

        if(timer) clearInterval(timer);
        timer = startLogOutTimer();
        //!update UI 
       updateUI(currentAccount);
    }
})

//! btn transFer 

btnTransfer.addEventListener('click', function(e){
    e.preventDefault();
    const amount = +(inputTransferAmount.value);
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
   //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
     //Add transfar date 
     currentAccount.movementsDates.push(new Date().toISOString());
     receiverAcc.movementsDates.push(new Date().toISOString());

       //!update UI 
       updateUI(currentAccount);

       //!Reset timer 
      clearInterval(timer);
       timer = startLogOutTimer();

    }
});


//! btn close 

btnClose.addEventListener('click' , function(e){
 e.preventDefault();
//  console.log('Delete');


if(inputCloseUsername.value === currentAccount.username
    && +(inputClosePin.value) === currentAccount.pin)
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

    const amount = Math.floor(inputLoanAmount.value);
    if ( amount > 0 && currentAccount.movements.some(mov => mov<= amount * 0.1)){
        setTimeout(function(){
     //?ADD amount 
    currentAccount.movements.push(amount)
     //Add laon date 
    currentAccount.movementsDates.push(new Date().toISOString());
        //?update Ui 
       updateUI(currentAccount);
    });
    }

    inputLoanAmount.value = ' '; 
       //!Reset timer 
       clearInterval(timer);
       timer = startLogOutTimer();
 });

 //!btn sort
 let sorted = false ; 
 btnSort.addEventListener('click', function(e){
e.preventDefault();
// console.log('click');

displayMovements(currentAccount.movements, !sorted);
sorted = !sorted;

 });

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
// 3. For each remaining dog, log to the console whether it's an adult ("Dog + 1
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


// //! SOME 
// //?WQUALITY
// console.log(movements);
// console.log(movements.includes(-130));//true 


// //?CONDITION
// console.log(movements.some(mov => mov == -130));

// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// //! EVERY 


// const allDeposits = movements.every(mov => mov > 0);
// console.log(allDeposits);
// console.log(account4.movements.every(mov => mov > 0));

// //!somthing NEW \seprate callback 

// const deposts = mov => mov < 0 ;
// console.log(movements.some(deposts));
// console.log(movements.every(deposts));
// console.log(movements.filter(deposts));

//! flat and faltMap 

const arr = [[1,2,3],[4,5,6],7,8];

// console.log(arr.flat());

const arrDeep =  [[[1,2,3],[4,5,6]],7,8];

// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc=> acc.movements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overBalance = allMovements.reduce(
//     (acc,mov)=>acc+mov,0)
// console.log(overBalance);

// const overBalance = accounts
// .map(acc => acc.movements)
// .flat()
// .reduce((acc,mov) => acc+mov,0);

// console.log(overBalance);

//!flatMap 
// const overBalance2 = accounts
// .flatMap(acc => acc.movements)
// .flat()
// .reduce((acc,mov) => acc+mov,0);

// console.log(overBalance);

//!SortingArray
const owners = ['Janas','Zach','Adam','Martha'];
// console.log(owners.sort());
// console.log(owners);

// console.log(movements);
// console.log(movements.sort());
 

//?Ascending
//return > 0 A,B (keep order )
//return < 0 B,A ( SWICH order )
// movements.sort((a,b)=>{
// if(a>b) return 1;
// if(b>a) return -1;
// });
// console.log(movements);
movements.sort((a,b)=> a-b );
//  console.log(movements);

//?Descending
// movements.sort((a,b)=>{
//     if(a>b) return -1;
//     if(b>a) return 1;
//     });
//     console.log(movements);


//  movements.sort((a,b)=> b - a );
//  console.log(movements);


//! ways to creating and fill Array 

// console.log([1,2,3,4,5,6,7]);
// console.log(new Array(1,2,3,4,5,6,7));

// const x = new Array(7);//just select length array 
// console.log(x);
// console.log(x.map(()=>5));
// x.fill(1,3,5);
// console.log(x);


// const arr1 = [1,2,3,4,5,6,7];
// arr1.fill(23,2,6)
// console.log(arr1);

//?ARRAY array.from()

// const y = Array.from({length: 7},()=>1);
// console.log(y);


// const z= Array.from({length: 7},(cur,i)=>i+1);
// console.log(z);

//! how creat array random element in 100 item 

// const k = Array.from({length: 10},(_,i)=>i+1);
// console.log(k);
// const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//        );
//        console.log(movementsUI);


labelBalance.addEventListener('click', function(){
    // console.log('click');
    const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),el=> Number(el.textContent.replace('€','')));
console.log(movementsUI);
})
//! Which Array Method to Use?



//!Array Methods Practice 
///?1)
// const bankDepositsum = accounts.flatMap(acc =>acc.movements).filter(mov => mov >0)
// .reduce((sum,mov) => sum+mov,0);
// console.log(bankDepositsum);

//?2)
// const numDeposits10001 = accounts
// .flatMap(acc=>acc.movements)
// .filter(mov => mov >= 1000).length;

// console.log(numDeposits10001);

// const numDeposits1000 = accounts
// .flatMap(acc=>acc.movements)
// .reduce((count,mov)=> 
// (mov >=1000?++count:count),0)

// console.log(numDeposits1000);

//?3)

// const sums = accounts
// .flatMap(acc => acc.movements)
// .reduce((sums,cur)=>{
// sums[cur > 0 ? 'deposits':'withdrawals'] += cur;
// return sums;
// },
// {deposits:0,withdrawals:0}
// );

// console.log(deposits,withdrawals);


// let a = 10 
// console.log(a++);
// console.log(a);

//?4) 

// const converTitleCase = function(title){
//     const capitzalize = str=> str[0].toUpperCase()+str.slice(1);
//  const expections = ['a','an','the','but','or','on','in','with'];

//  const titleCase = title
//  .toLowerCase()
//  .split(' ')
//  .map(word =>expections.includes(word)?word: capitzalize(word))
// .join(' ');
//  return titleCase;

// }
// console.log(converTitleCase('this is a nice title'));
// console.log(converTitleCase('this is a LONG title but not too long'));
// console.log(converTitleCase('and here is another title with an EXAMPLE'));

//!@)#((#**@***#&&&#^^^CHALLENGE@@######))

// The Complete JavaScript Course 25
// Coding Challenge #4
// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:
// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)
// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)
// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects 😉)
// The Complete JavaScript Course 26
// Hints:
// § Use many different tools to solve these challenges, you can use the summary
// lecture to choose between them 😉
// § Being within a range 10% above and below the recommended portion means:
// current > (recommended * 0.90) && current < (recommended *
// 1.10). Basically, the current portion should be between 90% and 110% of the
// recommended portion.
// Test data:
// const dogs = [
// { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
// { weight: 8, curFood: 200, owners: ['Matilda'] },
// { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
// { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// GOOD LUCK 😀
//?1)

// dogs.forEach(dog=> (dog.recFood = Math.trunc(dog.weight**0.75*28)) )

// console.log(dogs);

//?2) 
// const dogsSaarah = dogs.find(dog=> dog.owners.includes('Sarah'))

// console.log(dogsSaarah);
// console.log(`Sarah's dog is eating too ${dogsSaarah.curFood > dogsSaarah.recFood ? 'much' :
// 'little'}`);


 //?3)
// const ownersEatTooMuch = dogs
// .filter(dog => dog.curFood > dog.recFood)
// .flatMap(dog=> dog.owners)
// // .flat();
// const ownersEatTooLittle = dogs
// .filter(dog => dog.curFood < dog.recFood)
// .flatMap(dog=> dog.owners)
// // .flat();

// console.log(ownersEatTooLittle);

// console.log(ownersEatTooMuch);
 //?4)
//  "Matilda and
 // Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
 // too little!"

//  console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);



//  console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

 //?5) 
//  console.log(dogs.some(dog => dog.curFood === dog.recFood));

//  //?6)
//  const checkOk =   dog => 
//  dog.curFood > dog.recFood * 0.90 
//  && dog.curFood < dog.recFood *
//  1.10;
//  console.log(dogs.some(checkOk ));

 //?7)


//  console.log(dogs.filter(checkOk ));

 //?8)

//  const dogsCopy = dogs.slice().sort(
//     (a,b) => a.recFood - b.recFood);

// console.log(dogsCopy);

//!V170 

// console.log(23 === 23.0);

//Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.333333
//Binary nase 2 - 0 1

// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);
// //! without Number 
// console.log(+('23'));
// console.log(+'23');

// //! parsing

// console.log(Number.parseInt('30px'));
// console.log(Number.parseInt('e23'));
// //!praseFlat
// console.log(Number.parseFloat('2.5rem'));

//! isNumber 

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20x'));
// console.log(Number.isNaN(23 / 0));

// //!isFinite

// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));

// //!isInteger
// console.log(Number.isInteger(20));
// console.log(Number.isInteger(20));
// console.log(Number.isInteger(+'20X'));

//!MATH + RANDOM 
//!sort
// console.log(Math.sqrt(25));
// console.log(25 ** (1/2));
// console.log(8 ** (1/3));
// //!max
// console.log(Math.max(5,18,23,11,2));
// console.log(Math.max(5,18,'23',11,2));
// console.log(Math.max(5,18,'23px',11,2));
// //!min
// console.log(Math.min(5,18,23,11,2));
//!PI

// console.log(Math.PI);
// console.log(Math.PI *Number.parseFloat('10px')**2);

// console.log(Math.trunc(Math.random()*6)+1);

// const randomInt = (min,max)=>Math.trunc(Math.random()*(max-min)+1)+min

// console.log(randomInt(10,20));

//! Rounding



// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));


// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.trunc(23.3));

// //! trunc VS floor
// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));

// //!Rounding 
// //!TOFIXED
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log(+(2.345).toFixed(2));


//!The Ramainder Operator 

// console.log(5 % 2);
// console.log(5 / 2);//5 = 2 * 2 + 1

// console.log(8 % 3);
// console.log(8 / 3);

// console.log(6 % 2);
// console.log(6 / 2);

// console.log(7 % 2);
// console.log(7 / 2);
//  //! isEven
// const isEven = n => n % 2 === 0;
//  console.log(isEven(8));
//  console.log(isEven(23));
//  console.log(isEven(514));


//  const isOdd = n => n % 2 === 1;
//  console.log(isOdd(8));
//  console.log(isOdd(23));
//  console.log(isOdd(514));


//  labelBalance.addEventListener('click',function(){
//     [...document.querySelectorAll('.movements__row')].forEach(function(raw,i){
//      if ( i % 2 === 0) raw.style.backgroundColor='orangered'
//      if(i % 2 === 1)  raw.style.backgroundColor='blue'

//     });
//  });
 
//!Numeric Separators

// const diameter = 287460000000;

// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee = 15_00

//!Working with Biglnt
// console.log(2**53-1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2**53-1);
// console.log(3542786538647487768446354254n);

// console.log(10000n + 10000n);
// console.log(389360982840287134708);

// console.log(12n/3n);
// console.log(10/3);
// //!toString   
// var n = 34523453.345;
// console.log(n.toLocaleString()); 
//! create a date DATA

// const now = new Date();
// console.log(now);

// console.log(new Date('Aug 20 2022 22:28:50'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 31, 15, 23, 5));

// console.log(new Date(0));
// console.log(new Date(3*24*60*60*1000));

// //!working with dates 

// const future = new Date(2037, 10, 19, 15, 23, 5);

// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getUTCFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

//!Opration with Date 
//?IntL.formatDate 
// const future = new Date(2037,10,19,15,23);
// console.log(+future);
// const calcDaysPassed = (date1,date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037,3,14), new Date(2037, 3, 4));

// console.log(days1);

//!INTERNATIONALIZING NUMBER (int)

// const num = 3884764.23;

// const options = {
//    style: 'currency',
//    unit : 'celsius',
//    currency: 'EUR',
//    useGrouping: false,
// }

// console.log('US:',new Intl.NumberFormat('en-US', options).format(num));

// console.log('Germany:',new Intl.NumberFormat('de-DE', options).format(num));

// console.log('Syria:',new Intl.NumberFormat('ar-SY', options).format(num));

// console.log('Yemen:',new Intl.NumberFormat('ar-YM', options).format(num));

// console.log('Saudi Arabi :',new Intl.NumberFormat('ar-SA', options).format(num));

// console.log(navigator.language, new Intl.NumberFormat(navigator.language, options).format(num));
//! setTimeout

// const ingredients =['olives','']
//  const pizzaTimer = setTimeout(
//     (ing1,ing2)=> console.log(`Here is your pizza ${ing1} and ${ing2} 🍕`),3000,...ingredients);

// console.log('Waiting....');
// //!ClearTimeout
// if( ingredients.includes('spinach')) clearTimeout(pizzaTimer);



//! setInterval 

setInterval(function(){
    const now = new Date();
    console.log(now);
}, 1000)







