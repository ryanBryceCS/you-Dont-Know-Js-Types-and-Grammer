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






























*/
