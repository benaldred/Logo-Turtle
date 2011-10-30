== Decisions

I decided that as I would be using Arrays a lot that I would use the Underscore library created by DocumentCloud. It also makes things more Ruby like ;)

=== Eval
I decided to use the eval function to dynamically call functions on the turtle object easily turning the command 'forward 50' into the call turtle.forward(50); I realise that eval is often misused and can cause performance, debugging and security problems. I would probably not use it in production code but it fitted well with what I was trying to achieve.

== Limitations

* No checking for correct syntax of loops i.e. will break if an end is not included
* Does not use the indentation to discover the repeat loops, so will not handle complex repeat loop structures very well.

== Testing

I am a big fan of BDD and if I were writing code for production I would also include a test suite. I would use something like Jasmine () which has a strong open source community and it plugs in nicely to Rails.


== Try these instructions

<pre>
forward 50
right 90
forward 50
right 90
penup
forward 25
color #ff0000
pendown
forward 25
color #000000
right 90
forward 50
</pre>
    
<pre>
backward 50
left 90
backward 50
left 90
backward 50
left 90
backward 50
</pre>
      
<pre>
repeat 4
  forward 50
  right 90
end
</pre>

<pre>
repeat 36
  repeat 12
    forward 30
    right 30
  end
  right 10
end
</pre>