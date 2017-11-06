/*
PREFACE:
  Because JavaScript can be used without understanding, the understanding of the language is often never attained.

  While this subset has been famously dubbed "The Good Parts", I would implore you, dear reader, to instead consider it the "The Easy Parts", "The Safe Parts", or even "The Incomplete Parts".

  This You Don't Know JavaScript book series offers a contrary challenge: learn and deeply understand all of JavaScript, even and especially "The Tough Parts".

  I am not content, nor should you be, at stopping once something just works, and not really knowing why. I gently challenge you to journey down that bumpy "road less traveled" and embrace all that JavaScript is and can do. With that knowledge, no technique, no framework, no popular buzzword acronym of the week, will be beyond your understanding.

  The JavaScript you know right now is probably parts handed down to you by others who've been burned by incomplete understanding. That JavaScript is but a shadow of the true language. You don't really know JavaScript, yet, but if you dig into this series, you will. Read on, my friends. JavaScript awaits you.


CHAPTER 1: TYPES

  The ECMAScript language types are Undefined, Null, Boolean, String, Number, and Object.

A Type By Any Other Name...

  Armed with a full understanding of JavaScript types, we're aiming to illustrate why coercion's bad reputation is largely overhyped and somewhat undeserved -- to flip your perspective, to seeing coercion's power and usefulness.


Built-in Types

  JavaScript defines seven built-in types:

  null
  undefined
  boolean
  number
  string
  object
  symbol -- added in ES6!
  Note: All of these types except object are called "primitives".

  The typeof operator inspects the type of the given value, and always returns one of seven string values -- surprisingly, there's not an exact 1-to-1 match with the seven built-in types we just listed.
  typeof undefined     === "undefined"; // true
  typeof true          === "boolean";   // true
  typeof 42            === "number";    // true
  typeof "42"          === "string";    // true
  typeof { life: 42 }  === "object";    // true

  // added in ES6!
  typeof Symbol()      === "symbol";    // true

  As you may have noticed, I excluded null from the above listing. It's special -- special in the sense that it's buggy when combined with the typeof operator:

  typeof null === "object"; // true

  null is the only primitive value that is "falsy" (aka false-like; see Chapter 4) but that also returns "object" from the typeof check.

  It's easy to think that function would be a top-level built-in type in JS, However, if you read the spec, you'll see it's actually a "subtype" of object. Specifically, a function is referred to as a "callable object" -- an object that has an internal [[Call]] property that allows it to be invoked.

  The fact that functions are actually objects is quite useful. Most importantly, they can have properties. For example:

  function a(b,c) {

  }
  The function object has a length property set to the number of formal parameters it is declared with.

  a.length; // 2
  Since you declared the function with two formal named parameters (b and c), the "length of the function" is 2.

  What about arrays? They're native to JS, so are they a special type?

  typeof [1,2,3] === "object"; // true
  Nope, just objects. It's most appropriate to think of them also as a "subtype" of object (see Chapter 3), in this case with the additional characteristics of being numerically indexed (as opposed to just being string-keyed like plain objects) and maintaining an automatically updated .length property.


//Values as Types

  In JavaScript, variables don't have types -- values have types. Variables can hold any value, at any time.

  you use typeof against a variable, it's not asking "what's the type of the variable?" as it may seem, since JS variables have no types. Instead, it's asking "what's the type of the value in the variable?"

  The typeof operator always returns a string. So:

  typeof typeof 42; // "string"
  The first typeof 42 returns "number", and typeof "number" is "string".

  An "undefined" variable is one that has been declared in the accessible scope, but at the moment has no other value in it. By contrast, an "undeclared" variable is one that has not been formally declared in the accessible scope.
  //   var a;
  //   function hmm() {
  //   var f;
  //   console.log(a); //a is undefined availiable in acessible scope
  // }
  // hmm();
  // console.log(f); //f is not defined

  There's also a special behavior associated with typeof as it relates to undeclared variables that even further reinforces the confusion. Consider:

  The typeof operator returns "undefined" even for "undeclared" (or "not defined") variables. Notice that there was no error thrown when we executed typeof b, even though b is an undeclared variable. This is a special safety guard in the behavior of typeof.

  As a simple example, imagine having a "debug mode" in your program that is controlled by a global variable (flag) called DEBUG. You'd want to check if that variable was declared before performing a debug task like logging a message to the console. A top-level global var DEBUG = true declaration would only be included in a "debug.js" file, which you only load into the browser when you're in development/testing, but not in production.

  However, you have to take care in how you check for the global DEBUG variable in the rest of your application code, so that you don't throw a ReferenceError. The safety guard on typeof is our friend in this case.

  // oops, this would throw an error!
  if (DEBUG) {
  	console.log( "Debugging is starting" );
  }

  // this is a safe existence check
  if (typeof DEBUG !== "undefined") {
  	console.log( "Debugging is starting" );
  }

  This sort of check is useful even if you're not dealing with user-defined variables (like DEBUG). If you are doing a feature check for a built-in API, you may also find it helpful to check without throwing an error:

  // if (typeof atob === "undefined") {
  // 	atob = function() {};
  // }

  Another way of doing these checks against global variables but without the safety guard feature of typeof is to observe that all global variables are also properties of the global object, which in the browser is basically the window object. So, the above checks could have been done (quite safely) as:
  if (window.DEBUG) {
	// ..
  }

  if (!window.atob) {
  	// ..
  }
  Other developers would prefer a design pattern called "dependency injection," where instead of doSomethingCool() inspecting implicitly for FeatureXYZ to be defined outside/around it, it would need to have the dependency explicitly passed in, like:

  function doSomethingCool(FeatureXYZ) {
  	var helper = FeatureXYZ ||
  		function() { /.. default feature ../ };

  	var val = helper();
  	// ..
  }

  JavaScript has seven built-in types: null, undefined, boolean, number, string, object, symbol. They can be identified by the typeof operator.

  Variables don't have types, but the values in them do. These types define intrinsic behavior of the values.

  Many developers will assume "undefined" and "undeclared" are roughly the same thing, but in JavaScript, they're quite different. undefined is a value that a declared variable can hold. "Undeclared" means a variable has never been declared.

  JavaScript unfortunately kind of conflates these two terms, not only in its error messages ("ReferenceError: a is not defined") but also in the return values of typeof, which is "undefined" for both cases.

  However, the safety guard (preventing an error) on typeof when used against an undeclared variable can be helpful in certain cases.



Chapter 2: Values

  arrays, strings, and numbers are the most basic building-blocks of any program, but JavaScript has some unique characteristics with these types that may either delight or confound you.

  Let's look at several of the built-in value types in JS, and explore how we can more fully understand and correctly leverage their behaviors.


////Arrays

  As compared to other type-enforced languages, JavaScript arrays are just containers for any type of value, from string to number to object to even another array (which is how you get multidimensional arrays).

  // var a = [ 1, "2", [3] ];
  //
  // a.length;		// 3
  // a[0] === 1;		// true
  // a[2][0] === 3;	// true

  You don't need to presize your arrays (see "Arrays" in Chapter 3), you can just declare them and add values as you see fit:

  // var a = [ ];
  //
  // a.length;	// 0
  //
  // a[0] = 1;
  // a[1] = "2";
  // a[2] = [ 3 ];
  //
  // a.length;	// 3

  Warning: Using delete on an array value will remove that slot from the array, but even if you remove the final element, it does not update the length property, so be careful! We'll cover the delete operator itself in more detail in Chapter 5.

  arrays are numerically indexed (as you'd expect), but the tricky thing is that they also are objects that can have string keys/properties added to them (but which don't count toward the length of the array):

  // var a = [ ];
  //
  // a["13"] = 42;
  //
  // a.length; // 14


//Array-Likes

  For example, various DOM query operations return lists of DOM elements that are not true arrays but are array-like enough for our conversion purposes. Another common example is when functions expose the arguments (array-like) object (as of ES6, deprecated) to access the arguments as a list.

  One very common way to make such a conversion is to borrow the slice(..) utility against the value:

  // function foo() {
  // 	var arr = Array.prototype.slice.call( arguments );
  // 	arr.push( "bam" );
  // 	console.log( arr );
  // }
  //
  // foo( "bar", "baz" ); // ["bar","baz","bam"]

  As of ES6, there's also a built-in utility called Array.from(..) that can do the same task:

  ...
  var arr = Array.from( arguments );
  ...
  Note: Array.from(..) has several powerful capabilities, and will be covered in detail in the ES6 & Beyond title of this series.

////Strings

  It's a very common belief that strings are essentially just arrays of characters. While the implementation under the covers may or may not use arrays, it's important to realize that JavaScript strings are really not the same as arrays of characters. The similarity is mostly just skin-deep.

  JavaScript strings are immutable, while arrays are quite mutable. Moreover, the a[1] character position access form was not always widely valid JavaScript. Older versions of IE did not allow that syntax (but now they do). Instead, the correct approach has been a.charAt(1).

  A further consequence of immutable strings is that none of the string methods that alter its contents can modify in-place, but rather must create and return new strings. By contrast, many of the methods that change array contents actually do modify in-place.

  Also, many of the array methods that could be helpful when dealing with strings are not actually available for them, but we can "borrow" non-mutation array methods against our string:

  // a.join;			// undefined
  // a.map;			// undefined
  //
  // var c = Array.prototype.join.call( a, "-" );
  // var d = Array.prototype.map.call( a, function(v){
  // 	return v.toUpperCase() + ".";
  // } ).join( "" );
  //
  // c;				// "f-o-o"
  // d;				// "F.O.O."

  Another workaround (aka hack) is to convert the string into an array, perform the desired operation, then convert it back to a string.

  // var c = a
  // 	// split `a` into an array of characters
  // 	.split( "" )
  // 	// reverse the array of characters
  // 	.reverse()
  // 	// join the array of characters back to a string
  // 	.join( "" );
  // 
  // c; // "oof"






*/
