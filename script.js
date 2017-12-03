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
  // ()
  // c; // "oof"


////Numbers

  JavaScript has just one numeric type: number. This type includes both "integer" values and fractional decimal numbers. I say "integer" in quotes because it's long been a criticism of JS that there are not true integers, as there are in other languages. That may change at some point in the future, but for now, we just have numbers for everything.

  So, in JS, an "integer" is just a value that has no fractional decimal value. That is, 42.0 is as much an "integer" as 42.

  Like most modern languages, including practically all scripting languages, the implementation of JavaScript's numbers is based on the "IEEE 754" standard, often called "floating-point." JavaScript specifically uses the "double precision" format (aka "64-bit binary") of the standard.

  //Numeric Syntax
  By default, most numbers will be outputted as base-10 decimals, with trailing fractional 0s removed. So:

  // var a = 42.300;
  // var b = 42.0;
  //
  // a; // 42.3
  // b; // 42
  toFixed(..) method allows you to specify how many fractional decimal places you'd like the value to be represented with:
  toPrecision(..) is similar, but specifies how many significant digits should be used to represent the value:

  You don't have to use a variable with the value in it to access these methods; you can access these methods directly on number literals. But you have to be careful with the . operator. Since . is a valid numeric character, it will first be interpreted as part of the number literal, if possible, instead of being interpreted as a property accessor.

  // // invalid syntax:
  // 42.toFixed( 3 );	// SyntaxError
  //
  // // these are all valid:
  // (42).toFixed( 3 );	// "42.000"
  // 0.42.toFixed( 3 );	// "0.420"
  // 42..toFixed( 3 );	// "42.000"

  42.toFixed(3) is invalid syntax, because the . is swallowed up as part of the 42. literal (which is valid -- see above!), and so then there's no . property operator present to make the .toFixed access.

  42..toFixed(3) works because the first . is part of the number and the second . is the property operator. But it probably looks strange, and indeed it's very rare to see something like that in actual JavaScript code. In fact, it's pretty uncommon to access methods directly on any of the primitive values. Uncommon doesn't mean bad or wrong.

  numbers can also be specified in exponent form, which is common when representing larger numbers, such as:

  // var onethousand = 1E3;						// means 1 * 10^3
  // var onemilliononehundredthousand = 1.1E6;	// means 1.1 * 10^6
  // number literals can also be expressed in other bases, like binary, octal, and hexadecimal.

  //Small Decimal Values

  //0.1 + 0.2 === 0.3; // false

  Mathematically, we know that statement should be true. Why is it false?

  Simply put, the representations for 0.1 and 0.2 in binary floating-point are not exact, so when they are added, the result is not exactly 0.3. It's really close: 0.30000000000000004, but if your comparison fails, "close" is irrelevant.

///Special Values
  There are several special values spread across the various types that the alert JS developer needs to be aware of , and use properly.

  //The Non-value Values

  Both undefined and null are often taken to be interchangeable as either "empty"
  values or "non"
  values.Other developers prefer to distinguish between them with nuance.For example:

  null is an empty value
  undefined is a missing value
  Or:

    undefined hasn't had a value yet
    null had a value and doesn't anymore

  In non - strict mode, it's actually possible (though incredibly ill-advised!) to assign a value to the globally provided undefined identifier:
  function foo() {
    undefined = 2; // really bad idea!
  }

  In both non - strict mode and strict mode, however, you can create a local variable of the name undefined.But again, this is a terrible idea!

    function foo() {
      "use strict";
      var undefined = 2;
      console.log(undefined); // 2
    }

  foo();
  foo();
  Friends don 't let friends override undefined. Ever.

//// void Operator


  While undefined is a built - in identifier that holds(unless modified--see above!) the built - in undefined value, another way to get this value is the void operator.
  The expression void ___ "voids"
  out any value, so that the result of the expression is always the undefined value.It doesn 't modify the existing value; it just ensures that no value comes back from the operator expression.

  var a = 42;
  console.log(void a, a); // undefined 42

  By convention(mostly from C - language programming), to represent the undefined value stand - alone by using void, you 'd use void 0 (though clearly even void true or any other void expression does the same thing). There'
  s no practical difference between void 0, void 1, and undefined.

  But the void operator can be useful in a few other circumstances,
    if you need to ensure that an expression has no result value(even
    if it has side effects).

  For example:
  function doSomething() {
    // note: `APP.ready` is provided by our application
    if (!APP.ready) {
      // try again later
      return void setTimeout(doSomething, 100);
    }

    var result;

    // do some other stuff
    return result;
  }

  // were we able to do it right away?
  if (doSomething()) {
    // handle next tasks right away
  }
  Here, the setTimeout(..)
  function returns a numeric value(the unique identifier of the timer interval,
    if you wanted to cancel it), but we want to void that out so that the
  return value of our
  function doesn 't give a false-positive with the if statement.

  In general,
  if there 's ever a place where a value exists (from some expression) and you'
  d find it useful
  for the value to be undefined instead, use the void operator.That probably won 't be terribly common in your programs, but in the rare cases you do need it, it can be quite helpful.


////Special Numbers


  The number type includes several special values.We 'll take a look at each in detail.

  //The Not Number, Number
  Any mathematic operation you perform without both operands being numbers(or values that can be interpreted as regular numbers in base 10 or base 16) will result in the operation failing to produce a valid number, in which
  case you will get the NaN value.

  NaN literally stands
  for "not a number", though this label / description is very poor and misleading, as we 'll see shortly. It would be much more accurate to think of NaN as being "invalid number," "failed number," or even "bad number," than to think of it as "not a number."

  For example:

	var a = 2 / "foo"; // NaN

	typeof a === "number"; // true
	In other words: "the type of not-a-number is 'number'!"Hooray

	for confusing names and semantics.
	NaN is a kind of "sentinel value" (an otherwise normal value that 's assigned a special meaning) that represents a special kind of error condition within the number set. The error condition is, in essence: "I tried to perform a mathematic operation but failed, so here's the failed number result instead."

  So, if you have a value in some variable and want to test to see if it's this special failed-number NaN, you might think you could directly compare to NaN itself, as you can with any other value, like null or undefined. Nope.

  var a = 2 / "foo";

  a == NaN;	// false
  a === NaN;	// false
	NaN is a very special value in that it's never equal to another NaN value (i.e., it's never equal to itself). It's the only value, in fact, that is not reflexive (without the Identity characteristic x === x). So, NaN !== NaN. A bit strange, huh?

  So how do we test for it, if we can't compare to NaN (since that comparison would always fail)?

  var a = 2 / "foo";

  isNaN( a ); // true

  Easy enough, right? We use the built-in global utility called isNaN(..) and it tells us if the value is NaN or not. Problem solved!

  Not so fast.

  The isNaN(..) utility has a fatal flaw. It appears it tried to take the meaning of NaN ("Not a Number") too literally -- that its job is basically: "test if the thing passed in is either not a number or is a number." But that's not quite accurate.

  var a = 2 / "foo";
  var b = "foo";

  a; // NaN
  b; // "foo"

  window.isNaN( a ); // true
  window.isNaN( b ); // true -- ouch!

  Clearly, "foo" is literally not a number, but it's definitely not the NaN value either! This bug has been in JS since the very beginning (over 19 years of ouch).

  As of ES6, finally a replacement utility has been provided: Number.isNaN(..). A simple polyfill for it so that you can safely check NaN values now even in pre-ES6 browsers is:

  if (!Number.isNaN) {
    Number.isNaN = function(n) {
      return (
        typeof n === "number" &&
        window.isNaN( n )
      );
    };
  }

  var a = 2 / "foo";
  var b = "foo";

  Number.isNaN( a ); // true
  Number.isNaN( b ); // false -- phew!
  Actually, we can implement a Number.isNaN(..) polyfill even easier, by taking advantage of that peculiar fact that NaN isn't equal to itself. NaN is the only value in the whole language where that's true; every other value is always equal to itself.

  So:

  if (!Number.isNaN) {
    Number.isNaN = function(n) {
      return n !== n;
    };
  }
  Weird, huh? But it works!

  NaNs are probably a reality in a lot of real-world JS programs, either on purpose or by accident. It's a really good idea to use a reliable test, like Number.isNaN(..) as provided (or polyfilled), to recognize them properly.

  If you're currently using just isNaN(..) in a program, the sad reality is your program has a bug, even if you haven't been bitten by it yet!

////Infinities

  Developers from traditional compiled languages like C are probably used to seeing either a compiler error or runtime exception, like "Divide by zero," for an operation like:

  var a = 1 / 0;
  However, in JS, this operation is well-defined and results in the value Infinity (aka Number.POSITIVE_INFINITY). Unsurprisingly:

  var a = 1 / 0;	// Infinity
  var b = -1 / 0;	// -Infinity
  As you can see, -Infinity (aka Number.NEGATIVE_INFINITY) results from a divide-by-zero where either (but not both!) of the divide operands is negative.

  JS uses finite numeric representations (IEEE 754 floating-point, which we covered earlier), so contrary to pure mathematics, it seems it is possible to overflow even with an operation like addition or subtraction, in which case you'd get Infinity or -Infinity.

  For example:

  var a = Number.MAX_VALUE;	// 1.7976931348623157e+308
  a + a;						// Infinity
  a + Math.pow( 2, 970 );		// Infinity
  a + Math.pow( 2, 969 );		// 1.7976931348623157e+308
  According to the specification, if an operation like addition results in a value that's too big to represent, the IEEE 754 "round-to-nearest" mode specifies what the result should be. So, in a crude sense, Number.MAX_VALUE + Math.pow( 2, 969 ) is closer to Number.MAX_VALUE than to Infinity, so it "rounds down," whereas Number.MAX_VALUE + Math.pow( 2, 970 ) is closer to Infinity so it "rounds up".

  If you think too much about that, it's going to make your head hurt. So don't. Seriously, stop!

  Once you overflow to either one of the infinities, however, there's no going back. In other words, in an almost poetic sense, you can go from finite to infinite but not from infinite back to finite.

  It's almost philosophical to ask: "What is infinity divided by infinity". Our naive brains would likely say "1" or maybe "infinity." Turns out neither is true. Both mathematically and in JavaScript, Infinity / Infinity is not a defined operation. In JS, this results in NaN.

  But what about any positive finite number divided by Infinity? That's easy! 0. And what about a negative finite number divided by Infinity? Keep reading!

























































































































































































































































































































































































































*/
