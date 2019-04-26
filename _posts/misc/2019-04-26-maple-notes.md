---
layout: default
title:  "Maple Notes"
date:   2019-04-26 09:30:00 +1100
permalink: misc/maple-notes
category: misc
hidden: true
tags:
  - maple
  - linear algebra
  - calculus
color: 3D6117
comments: true
---

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on April 26, 2019
</small>

## Maple Notes

Before entering commands, load the relevant packages to ensure all needed functions are available:

```c
// use LinearAlgebra package
with(LinearAlgebra);

// use VectorCalculus package
with(VectorCalculus);

// use plots package
with(plots);

// use geom3d package
with(geom3d);
```

### Significant figures

To 45 significant figures:

```c
x := 100 * sin(28);
evalf[45](x);
```

### dy/dx

Given an equation `eqn`, to find $\frac{dy}{dx}$:

```c
implicitdiff(eqn, y, x);
```

### Constants

$e$ = `exp(1);`

$e^x$ = `exp(x);`

$\pi$ = `Pi;`

$\infty$ = `infinity;`

$i$ = `I`;


### Trigonometric Functions

Inverse:

$sin^{-1}(x)$ = `arcsin(x);`

$cos^{-1}(x)$ = `arccos(x);`

$tan^{-1}(x)$ = `arctan(x);`

### Unique Turning Point

For $5 sin(\frac{1}{4}x^4) - sin(\frac{5}{4}x)^4$, to find a unique turning point over the interval $[1, 2]$:

```c
f := 5 * sin(1/4 * x^4) - sin(5/4 *x)^4;

// solve the derivate of f over [1, 2]
fsolve(diff(f, x), x=1..2);
```

To then find the value of the 2nd derivative at this unique turning point:

```c
// where % is the unique turning point from the last solution above
evalf(subs(x = %, diff(f, x$2)));
```

### Integration

To integrate a given equation `eqn`, with bottom limit `a`, and top limit `b`:

```c
int(eqn, x=a..b);
```

To evaluate $\int_{-\infty}^{\infty} \frac{cos(\frac{x}{4})}{x^4 + 6 cot^{-1}x}$ to 10 significant figures:

```c
evalf[10](int((cos(x/4))/(x^4 + 6*arccot(x)), x=-infinity..infinity));
```

### Complex Numbers

Principal arguments for $z^5 - 4z^2 - 2z - 3$:

```c
// R1 is an array of complex roots
R1 := [fsolve(z^5 -4*z^2 -2*z -3, complex)];

// get arguments from array
argument~(R1)

// get max from last
max(%);
```

Moduli of roots for $z^5 -4z^4 -4z^2 + 1$:

```c
// R2 is an array of complex roots
R2 := [fsolve(z^5 -4*z^4 -4*z^2 +1, complex)];

// get absolute values from array
abs~(R2);

// get max from last
max(%);
```

### Roots

Get complex roots of $z^5 + 4z^3 - z^2 - 4$:

```c
fsolve(z^5 + 4*z^3 -z^2 -4, complex);
```

### Limits

To find the limit of a function $f$ as $x \to a$:

```c
limit(f, x=a)
```

To find $$\lim_{n\to\infty} \bigg[ n^{11/2} \prod_{k = 1}^{n} \frac{2k}{2k + 11} \bigg]$$

```c
limit((n^(11/2) * product((2*k)/(2*k + 11), k=1..n)), n=infinity);
```

To find $$\lim_{k\to\infty} \bigg[ \sum_{n = 1}^{k} \frac{1}{3n + \frac{k}{7}} \bigg]$$

```c
limit(sum(1/(3*n + k/7), n=1..k), k=infinity);
```

### Vectors

Projection of $a = (70, 197, 236)$ onto $v = (19, 128, 56)$:

```c
// vector a
a := <70, 197, 236>;

// vector b
b := <19, 128, 56>;

u := Normalize(b, Euclidean); 
v := DotProduct(a, u) * u;
```

Dot product:

```c
// vector a
a := <70, 197, 236>;

// vector b
b := <19, 128, 56>;

// dotproduct
a.b;

// or
DotProduct(a, b);
```

Cross product:

```c
// vector a
a := <70, 197, 236>;

// vector b
b := <19, 128, 56>;

// calculate cross product
CrossProduct(a, b);
```

The area of the parallelogram spanned by $a$ and $b$:

```c
// vector a
a := <70, 197, 236>;

// vector b
b := <19, 128, 56>;

cp := CrossProduct(a, b);

// magnitude of the cross product
Norm(cp);
```

### Mapping Functions

Function that takes in a list of complex numbers and returns the largest modulus from that list: 

```c
x -> max(map(abs, x))
```

Function that takes in a list of complex numbers and returns the smallest cosine from that list:

```c
x -> min(map(cos, x))
```

### Mean Value Theorum

To find a real number $c$ that satisfies the conclusion of the MVT for $f(x) = x^4 -12x^3 +56x^2 -120x +81$:

```c
// define f
f := x^4-12*x^3+56*x^2-120*x+81;

// solve for interval, and output the point
MeanValueTheorem(f, 3..4, output=points);
```

### Plotting

To plot a function:

```c
f := x^2;
plot(f);

// plot f in a region
plot(f, x=-10..10, y=-10..10);
```

To plot a polar function:

```c
// define polar function
r := 3 * sin(theta) - cos(4 * theta);

// plot function
polarplot(r);
```

To plot two curves and find the number of intersections in $-10 \le x \le 10, -10 \le y \le 10$. After plotting, the number of intersections should be able to be seen.

```c
// define both functions
f1 := -x * y^2 + 4*x = 5;
f2 := 1/3 * x^2 * y + tanh(y) = 1;

// plot both functions
implicitplot([f1, f2], x=-10..10, y=-10..10);
```

### Piecewise Functions

To define a piece wise function 

$$
\begin{array}{cc}
  \Bigg\{ & 
    \begin{array}{cc}
      x & x\lt 1 \\
      x^3 & x\lt 3 \\
      3 - x & otherwise
    \end{array}
\end{array}
$$

```c
piecewise(x < 1, x, x < 3, x^3, 3 - x);
```

### Matrices

Given a matrix $A$, create a vector $b$ that is column 3 from $A$, and a matrix $C$ that is made from columns 1 to 2, and 4 to 11 of $A$. 

Then solve $Cx = b$ and enter the 6th component of the unique vector solution for $x$.

```c
// set a to the matrix given
A := <...>

// create b
b := Column(A, 3);

// create C
C := Submatrix(A, [1..10], [1..2, 4..11]);

// set v to be Cx = b
v := LinearSolve(C, b);

// get 6th component
v[6];
```

### Functions

Using the arrow `->` we can express the function $f(x, y) = 6x^9 y^4 \ sin(6x -3y)$ as

```c
(x, y) -> 6*x^9 * y^4 * sin(6*x - 3*y);
```

### Partial Derivatives

Given a function $f(x, y) = cos(7y^7 + 5x^2)$, we can find the partial derivative $\dfrac{\partial^3}{\partial y^2 \partial x} f(x, y)$

```c
// Define f(x, y)
f := (x, y) -> cos(7*y^7 + 5*x^2);

// y = 2, x, = 1
D[2, 2, 1](f);
```

### Partial Fraction Decomposition

Given a $p(x)$ and $q(x)$ find the partial fraction decomposition of $\dfrac{p(x)}{q(x)}$:

```c
p := ...;
q := ...;
convert(p / q, parfrac, x);
```

### Initial Value Problem

Find the solution to the initial value problem $y \dfrac{d^2 y}{d x^2} + (\dfrac{dy}{dx})^2 = 0$ with initial conditions $y(0) = 2$ and $y'(0) = 3$

```c
ODE := y(x) * diff(y(x), x$2) + (diff(y(x), x))^2 = 0;
dsolve({ODE, y(0) = 2, D(y)(0) = 3}, y(x));
```

### Taylor Series

Given a taylor series for $e^x \ sin(4x)$ about 0 $= a_0 + a_1 x + a_2 x^2 + \dots + a_8 x^8 + \dots$, we can find values for $a_n$:

```c
// Enter the taylor series, from 0 to n + 1, e.g to find a_8
taylor(exp(x) * sin(4*x), x=0, 9);
```

### Dot Product and Linear Combinations

Given a number of vertices $u_1, u_2 \dots u_n$, to find the dot product between $u_k$ and $u_j$:

```c
uk := <...>;
uj := <...>;
uk . uj;
```

If $A = (u_1 \| u_2 \| u_3 \| u_4)$ and $v = (17, 59, 75, -74)$ , then $A v$ is a linear combination of the form $\lambda_1 u_1 + \lambda_2 u_2 + \lambda_3 u_3 + \lambda_4 u_4$, where the lambda values are $\lambda_1 = 17$,  $\lambda_2 = 59$, $\lambda_3 = 75$, $\lambda_4 = -74$

Suppose that $Av = (b_1 \ b_2 \ \dots \ b_5)^T$, to find the value of $b_2$ 

```c
// Find Av first
Av := A . v;

// Calculate transpose
Transpose(Av);
```

### Kernel and Nullity

Given an $m \times n$ matrix $A$ we can find:

```c
A := <<...> | <...> | <...> | <...>>;

// nullity(A)
nops(NullSpace(A));

// rank(A)
Rank(A);
```

To determine if a vector $v$ is in the kernel of $A$, $Av$ must produce the zero vector:

```c
A := <<...> | <...> | <...> | <...>>;
v := <....>;
Av := A . v;
```

If $Av = (0, \dots, 0)$, then $v$ is in $ker(A)$

To determine if a vector $v$ is in the image of $A$, there must be a linear system for $Av$:

```c
A := <<...> | <...> | <...> | <...>>;
v := <....>;

// If this produces an 'inconsistent system', then v is not in im(A)
LinearSolve(A, v);
```

### Sets

Given a set $S = \{ u_1, u_2, u_3, u_4, u_5, u_6\} \subset \mathbb{R^5}$

- $S$ is linearly dependent since the number of vectors in $S \gt dim(\mathbb{R^5})$

To find lambda values for $\lambda_1 u_1 + \lambda_2 u_2 + \lambda_3 u_3 + \lambda_4 u_4 = 0$:

```c
A := <<...> | <...> | <...> | <...>>;
B := <0, 0, 0, 0>;
LinearSolve(A, B);
```

### Eigenvalues

Given an $m \times n$ matrix $A$ we can find its eigenvalues:

```c
A := <<...> | <...> | <...> | <...>>;
Eigenvalues(A);
```

### Geom3D

Plotting:

```c
// Plot point
point(A, [1, 2, 3]);
point(B, [4, 5, 6]);
point(C, [7, 8, 9]);

// Plot line through A and parallel to [-1, -2, -3]
line(L1, [A, [-1, -2, -3]]);

// Plot plane through B with normal [-4, -5, -6]
plane(P, [B, [-4, -5, -6]]);

// Plot intersection of L1 and P
intersection(E, L1, P);

// Plot sphere through A B C E
sphere(S, [A, B, C, E]);

// Plot sphere with center A and radius 8
sphere(S, [A, 8]);

// Plot center of S
center(F, S);

// Plot line through C and F
line(L2, [C, F]);
```

Evaluating:

```c
// Angle between line and point to 10 dp
evalf(FindAngle(L, P), 10);

// Coordinates of F
coordinates(F);

// Distance between A and L2
distance(A, L2);
```

### Q11) For Loops

Write a for loop for $\sum^{21}\_{n = 16} sin(\dfrac{k}{n})$ for k from 2 to 60

```python
for
  k
from
  2
to
  60
do
  evalf(add(sin(k/n), n=16..21)
end do;
```

Another example:

```python
f := proc(m)
  local a, i;
  a[0] := 0;
  
  for i to m do
    a[i] := evalf(sin((1+(1/4) * a[i-1])^2));
  end do; 
  
  if abs(a[m] - a[m-1]) < 10^(-16) then 
    a[m] 
  else 
    -1
  end if 
end proc;

f(80);
```

Given a recurrence relation $a_{n+1} = a_n - 4a_{n-1} + a_{n-2}$ for $n = 3, 4, 5$, write a for loop to find the value of $a_{70}$ given that $a_1 = 5$, $a_2 = 2$ and $a_3 = -1$

```python
a := proc(n)
  local a, i;
  a[1] := 5;
  a[2] := 2;
  a[3] := -1;
  
  for i from 3 to n - 1 do
    a[i + 1] := a[i] - 4 * a[i - 1] + a[i - 1]
  end do;
  
  return a[n]
end proc;

a(70);
```
