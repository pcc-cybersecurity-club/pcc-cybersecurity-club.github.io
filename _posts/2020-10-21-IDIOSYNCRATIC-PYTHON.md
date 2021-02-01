---
layout: post
title: Python Idiosyncracies
tags: [ncl, capture, the flag, reversing]
author: Blake Eakin
---
<em>Python Idiosyncracies</em>

<p>
Reading through obfuscated code, that's meant to try and keep you from understanding its control flow, is a lot like trying to figure out which path to take in a twisty, curt choose your own adventure novel in order to get to the best ending. What makes a Choose Your Own Adventure easier is that we are well acquainted with the language used and the branching is simpler (wait, isn't that everything?). Here I'd like to make a sort of reference for facets of Python that aren't always typical in other similar languages, or necessarily well-known to people just getting into the language. While general programming knowledge of common syntaxes can get you far in reading and understanding confusing code, most challenges will make use of idiosyncratic syntaxes and features that may throw you off if you don't know what they mean. There are certainly more obscure Python features, but these are some of the things you're most likely to see in a CTF challenge.
</p>

<h3>Array Slicing</h3>
<p>
    The array slicing operator offers a way to return a sub-array from another array according to some arithmetic pattern. While array slicing itself isn't too complicated, the ability to use negative indices can quickly ramp up the confusion. Here is the general form: <code>array[start:stop:step]</code> Where start is the index in the array where the slice will begin (inclusive), stop is the index up to which the slice will end (exclusive), and the step is how many indices to move on to before including another element in the slice. Slices can easily be visualized using strings, here is the most basic case:

</p>
<pre>
    <code>
    >>> initString = "Hack the planet!"
    >>> initString[5:8:1]
    'the'
    </code>
</pre>
<p>
    Notice that the start is counted from 0 just like any other array reference, the end is one larger than the index it stops on. The step of one includes array elements sequentially, but can be changed to include every other letter, or every 3rd, etc.
</p>
<pre>
    <code>
    >>> initString[9:15:2] #Includes every other character
    'pae'
    >>> initString[9:15:3] #Or every third
    'pn'
    </code>
</pre>
<p>
    But the step can be left out and will default to one. In fact any of it can be left out to be left to default values.
</p>
<pre>
    <code>
    >>> initString[9:15:] #Leaving out step will default to step=1
    'planet'
    >>> initString[9::] #Leaving out end will default to including elements all the way to the end
    'planet!'
    >>> initString[:15:2] #Leaving out start will default to including elements starting at 0
    'Hc h lnt'
    >>> initString[::] #Leaving out all fields will default to including the whole array
    'Hack the planet!'
    >>> initString[:8:] #Any mixture of included and excluded fields will work
    'Hack the'
    </code>
</pre>

<p>
    Ok, that all makes sense, but how would negative numbers fit in? Well, if you just consider that the inputs provided for start and end are just calculated as a distance from the starting 0 index, then negative/positive values declare direction.
</p>

<pre>
    <code>
    >>> initString[-7:] #Negative indices walk backwards through the array to find start/end points
    'planet!'
    >>> initString[-7:-1] 
    'planet'
    >>> initString[-7:15] 
    'planet'
    >>> initString[::-1] #Negative steps reverse step direction
    '!tenalp eht kcaH'
    >>> initString[-7::-1] #It still considers the last element as the end, just in the other direction
    'p eht kcaH'
    >>> initString[-7:-1:-1] #But doesn't wrap
    ''
    >>> initString[-2:8:-1] #Any mix of + and - indices can be used only if they are on the way in the step direction without wrapping
    'tenalp'
    </code>
</pre>

<pre>
    <code>
    >>> intArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    >>> hexArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    >>> hexArray[10:] = ['A', 'B', 'C', 'D', 'E', 'F'] # Slices can be assigned to as well, but not in strings
    >>> hexArray
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    </code>
</pre>

<p>
    Really this is all just a bit of 'syntactic sugar' for using the <code>slice()</code> built-in function.
</p>
<pre>
    <code>
    >>> initString[slice(0,4)]
    'Hack'
    >>> mySlice = slice(0,4) # In fact you can save slices for reuse
    >>> initString[mySlice]
    'Hack'
    </code>
</pre>
<h3>Uncommon Operators And Syntax</h3>

<pre>
    <code>
    >>> 10 < x <= 20 # Condtional operators can be chained, equivalent to 10 < x and x <= 20
    True
    >>> 10 <= x/2 < x < 30
    True

    >>> 15 / 3 #Normal division results in a float
    5.0
    >>> 15 // 3 #So floor division rounds down to provide the more typical integer division
    5

    >>> x = 1.0
    >>> y = 1
    >>> x == y
    True
    >>> x is y #The is operator is similar to javascript's === operator. It checks for equality in values and types
    False
    
    >>> print("True") if 1==1 else print("False") # The ternary operator is for writing inline conditional statements
    True
    >>> print("True") if 1!=1 else print("False") # The syntax is: expression-if-true if condition else expression-if-false
    False

    </code>
</pre>

<h3>Lambda Functions</h3>

<p>
    Lambda functions are basically functions with no names. They can be used to generate dynamic functions, passed as function arguments, and cause a lot of general confusion. Their general form is <code> lambda <i>arguments</i> : <i>return expression</i></code>
</p>

<pre>
    <code>
        >>> def sum(a, b):
        ...     return a + b
        ... 
        >>> sum(5, 12)
        17
        >>> lambdaSum = lambda a, b: a + b # This is the same as sum
        >>> lambdaSum(5, 12) # And can be called similarly
        17
        >>> (lambda a, b: a + b)(5, 12) # They can be used dynamically
        17
        >>> (lambda a, b, c: c(a, b))(5, 12, lambda a, b: a+b) # They can be passed as arguments
        17
        >>> (lambda a, b, c: c(a, b))(5, 12, lambdaSum) # All named functions can be passed as well
        17
        >>> (lambda a, b, c: c(a, b))(5, 12, sum)
        17
        >>> (lambda a, b: a + b)((lambda a, b: a-b)(8,3), (lambda a, b, c: c(a, b))(6, 6, sum)) # Things can get hairy pretty quickly
        17

    </code>
</pre>

<h3>Comprehensions And Generator Expressions</h3>
<p>
    In Python comprehensions are a very robust tool that can be used for a variety of purposes. But the most general way of explaining them is that they perform an operation on every element of an iterable object, possibly subject to a condition, and return the results in a specified data structure. They can be generalized as <code><i>operation on variable</i> for <i>variable</i> in <i>iterable</i> [if <i>optional condition</i>]</code>
</p>

<pre>
    <code>
    >>> [x * 2 for x in range(11)] # This will create an array of all of the first ten numbers doubled
    [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

    >>> [x * 2 for x in range(11) if x % 2 == 0] # This does the same, but only for the even numbers
    [0, 4, 8, 12, 16, 20]

    >>> [ [y ** x for y in range(1,6)] for x in range(1,6)] #Comprehensions can be nested for multi-dimensional results
    [[1, 2, 3, 4, 5], [1, 4, 9, 16, 25], [1, 8, 27, 64, 125], [1, 16, 81, 256, 625], [1, 32, 243, 1024, 3125]]

    >>> someLetters = ['a', 'g', 'Y', 'e', 'M', 'A', 'z', 'U', 'I', 'A', 'q', 'q', 'Q', 'q'] 
    >>> { letter.lower() for letter in someLetters } # Comprehensions can be used for sets to gauarantee unique elements
    {'u', 'z', 'y', 'a', 'e', 'm', 'i', 'q', 'g'}

    >>> { chr(i): i for i in range(97, 123) } # And dictionaries
    {'a': 97, 'b': 98, 'c': 99, 'd': 100, 'e': 101, 'f': 102, 'g': 103, 'h': 104, 'i': 105, 'j': 106, 'k': 107, 'l': 108, 'm': 109, 'n': 110, 'o': 111, 'p': 112, 'q': 113, 'r': 114, 's': 115, 't': 116, 'u': 117, 'v': 118, 'w': 119, 'x': 120, 'y': 121, 'z': 122}
    
    >>> gen = ( 2**x for x in range(10) ) # They can also be used to make generator objects
    >>> next(gen) # Which will give you elements on demand
    1
    >>> next(gen)
    2
    >>> next(gen)
    4
    </code>
</pre>

<h3>Declaration Unpacking</h3>
<p>Unpacking is a quick way of declaring many variables together</p>
<pre>
    <code>
    >>> a, b, c, d = "a", ord('b'), 4.0, [1,2,3]
    >>> a
    'a'
    >>> b
    98
    >>> c
    4.0
    >>> d
    [1, 2, 3]
    
    >>> a, b, c, d = (2**(x+1) for x in range(4)) #They can be built with generator expressions
    >>> a
    2
    >>> b
    4
    >>> c
    8
    >>> d
    16
    
    >>> a, *b, c = 1, 2, 3, 4, 5 # Unpacking can do this too
    >>> a
    1
    >>> b
    [2, 3, 4]
    >>> c
    5
    
    >>> def funWithTwoParams(a, b):
    ...     return (a, b)
    ...
    >>> tup = (1, 2)
    >>> funWithTwoParams(*tup) # The star or 'splat' operator can be used to unpack a tuple into multiple arguments as well
    (1, 2)
    </code>
</pre>

<h3>Pythonic Functions</h3>
<p>
These are all built in functions that are meant to make life easier by efficiently implementing common procedures. Some are used for quick conversions between different number systems and ascii encoding.
</p>
<pre>
    <code>
    >>> nums = [97, 98, 99, 100, 101, 102]
    >>> [chr(x) for x in nums] # chr() takes a decimal number and turns it into an equivalent ascii character
    ['a', 'b', 'c', 'd', 'e', 'f']
    
    >>> [bin(x) for x in nums] # bin() takes a decimal number and returns a string of its binary equivalent
    ['0b1100001', '0b1100010', '0b1100011', '0b1100100', '0b1100101', '0b1100110']
    
    >>> [hex(x) for x in nums] # The same but for hex values
    ['0x61', '0x62', '0x63', '0x64', '0x65', '0x66']
    
    >>> [oct(x) for x in nums] # And also octal
    ['0o141', '0o142', '0o143', '0o144', '0o145', '0o146']
    
    >>> [ord(x) for x in [chr(y) for y in nums] ] # ord() will do the same but from character to decimal
    [97, 98, 99, 100, 101, 102]
    </code>
</pre>
<p>A few others make many common list operations much simpler</p>
<pre>
    <code>
    >>> nums = [97, 98, 99, 100]
    >>> chrs = ['a', 'b', 'c', 'd']
    
    >>> list(zip(nums, chrs)) # zip() takes in a list of iterables and combines them by element order
    [(97, 'a'), (98, 'b'), (99, 'c'), (100, 'd')]
    
    >>> list(enumerate(chrs)) #enumerate() takes in an iterable and combines each element with what is basically its index
    [(0, 'a'), (1, 'b'), (2, 'c'), (3, 'd')]
    
    >>> list(enumerate(chrs, start=97)) # It can take an optional start parameter that sets the beginning of the count
    [(97, 'a'), (98, 'b'), (99, 'c'), (100, 'd')]
    
    >>> list(filter(lambda x: x % 2 == 0, nums)) #filter() returns an iterable of elements from the iterable passed in for which the passed in function returns True
    [98, 100]
    
    >>> list(map(chr, nums)) # map() returns on iterable of every element of the passed in iterable processed through the passed in function
    ['a', 'b', 'c', 'd']
    </code>
</pre>

<p>Lastly, several built-in functions are commonly used to obscure what other functions they are calling</p>

<pre>
    <code>
    >>> __import__('datetime').date.today() #__import__() imports modules, it is part of normal imports, but can be used to dynamically import modules
    datetime.date(2020, 10, 20)
    
    >>> globals() # This will return a dictionary of the current globals from the module scope where it is called
    {'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>}
    
    >>> globals()['__builtins__'].__dict__['print']("Hello") # Which can be used as a really confusing way to refer to variables and call functions
    Hello
    
    >>> exampleVar = "example"
    >>> locals() #The same can be done with locals()
    {'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <class '_frozen_importlib.BuiltinImporter'>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, 'exampleVar': 'example'}
    >>> locals()['exampleVar']
    'example'
    
    >>> globals()['newVar'] = 5 # globals() and locals() can even be used to declare new variables and manipulate existing ones
    >>> newVar
    5
    >>> globals()['newVar'] += 1
    >>> newVar
    6
    </code>
</pre>
<h3>Challenges For Further Practice</h3>
<ul>
    <li><a href="https://ctflearn.com/challenge/743" target="_blank">CTFLearn - Time to Eat</a></li>
    <li><a href="https://ctflearn.com/challenge/449" target="_blank">CTFLearn - Python Reversal</a></li>
    <li><a href="https://ctflearn.com/challenge/161" target="_blank">CTFLearn - Ten Thousand Hours</a> !Don't solve this unless you like wasting time. Just try to understand what's going on!</li>
</ul>
