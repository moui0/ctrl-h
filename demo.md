# Demo

Find a if statement which if-block is empty, without else-block

```java
if(){<<empty>>}else{<<null>>}
```



Find all public methods

```java
public <<>>(){}
```



Find all classes without any method

```java
class <<>> { \<<>>(){}}
```



Swap if-block and else-block

```java
if(){
}else{
}

[0.0]=>[0.1]$
[0.1]=>[0.0]$
```



Insert "print(a);" before if-block's first statement, and insert "print(b);" before else-block's first statement.
This is a simple demo of code instrumentation.

```java
if() {
}else{
}

[0.0]=>"""print(a);""" ## [0.0]$
[0.1]=>"""print(b);""" ## [0.1]$
```



Use for-statement equivalent substitution while-statement.

```java
while (i < 5) {
}

[0] => """for(int i=1; i<5; i++){""" ## [0.0]$ ## """}"""$
```



Use while-statement equivalent substitution for-statement.

```java
for (int i=0; i<5; i++) {
}

[0] => """while (i<5) {""" ## [0.0] ## """}""" $
```

