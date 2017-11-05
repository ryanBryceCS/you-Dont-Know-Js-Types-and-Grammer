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









*/
