 var log = console.log

 function A()
 {
   this.foo = function()
   {
     log("a")
   }

 }

A.foo = function(){log("b")}
A.prototype.foo = function(){log("c")}


 var a = new A()
 a.foo()
 A.foo()