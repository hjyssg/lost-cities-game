var  log = console.log;



// Object.prototype.get_key_with_max_value = function()
// {
//     var maxKey, maxValue;
//     for (var key in this) {
//         if (!maxKey && !maxValue) {
//             maxKey = key
//             maxValue = this[key]
//         } else if (this[key] > maxValue) {
//             maxKey = key
//             maxValue = this[key]
//         }
//     }
//     return maxKey;
// }



// a = {a:2, b:4, c:6}
// log(a.prototype)


a = [1,2,3]
// log(a.prototype)

// log(a.get_key_with_max_value())


// log(1,2,3,4,4)


// var clone_of_a = JSON.parse( JSON.stringify( a ) );

Object.prototype.VClone = function (){
    // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
   return JSON.parse( JSON.stringify(this) );
}

// clone_of_a[1] = 3
var b = a.VClone()
b[1]= 3

log(a, b)