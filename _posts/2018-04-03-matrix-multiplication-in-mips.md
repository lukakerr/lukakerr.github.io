---
layout: default
title:  "Matrix Multiplication In MIPS"
date:   2018-04-02 17:25:00 +1100
permalink: assembly/matrix-multiplication-in-mips
category: assembly
tags: 
  - assembly
  - mips
color: 6E4C13
comments: true
---

# Matrix Multiplication In MIPS

I've been learning MIPS assembly for about 2 weeks now at uni and wanted to share how i've implemented a simple matrix multiplication function in MIPS.

This is the function in C that will be implemented. It takes in 6 parameters:

- `n`: number of rows in A
- `m`: number of columns in B
- `p`: number of columns in A
- `A[n][m]`: a matrix A with dimensions `n * m`
- `B[m][p]`: a matrix B with dimensions `m * p`
- `C[n][p]`: a matrix C where the result is stored with dimensions `n * p`

```c
void multiply(int n, int m, int p, int A[n][m], int B[m][p], int C[n][p]) {
  for (int r = 0; r < n; r++) {
    for (int c = 0; c < p; c++) {
      int sum = 0;
      for (int i = 0; i < m; i++) {
        sum += A[r][i] * B[i][c];
      }
      C[r][c] = sum;    
    }
}
```

The resulting matrix C will have dimensions of `n * p`. For the purpose of this tutorial i'm not doing any checks to see whether the matrices can actually be multiplied.

First lets declare some data to be used as input. For this example, matrices  `A[3][2]` and `B[2][4]` are used.

```ruby
   .data
N: .word  3
M: .word  2
P: .word  4
A: .word  1, 2, 3, 4, 5, 6         # { {1, 2}, {3, 4}, {5, 6} }
B: .word  8, 7, 6, 5, 4, 3, 2, 1   # { {8, 7, 6, 5}, {4, 3, 2, 1} }
C: .space 48
```

Next the `multiply` function will be implemented in steps. First the global symbol `multiply` is introduced in the `text` section.

```ruby
.text
  .globl multiply
multiply:
```

This declares the `multiply` symbol as a global symbol that is visible to other files. 

Next the function prologue can be setup. This modifies the frame pointer and stack pointer, as well as allocating space on the stack for some `$s?` registers, which get deallocated in the function epilogue.

```ruby
.text
  .globl multiply
multiply:
  # Register usage:
  # n is $s0, m is $s1, p is $s2,
  # r is $s3, c is $s4, i is $s5, 
  # sum is $s6

  # Prologue
  sw   $fp, -4($sp)
  la   $fp, -4($sp)
  sw   $ra, -4($fp)
  sw   $s0, -8($fp)
  sw   $s1, -12($fp)
  sw   $s2, -16($fp)
  sw   $s3, -20($fp)
  sw   $s4, -24($fp)
  sw   $s5, -28($fp)
  sw   $s6, -32($fp)
  addi $sp, $sp, -36
```

After this the main logic of `multiply` can be introduced. I've left comments next to most operations that correspond to the C code in the `multiply` function. Since a 2D array is used for storing matrices, we have to do a bit of calculation when accessing a value. 

This can be done using a formula of `(r * x * 4) + (c * 4)` where:

- `r` = row (e.g. `C[r][c]`)
- `x` = dependent on context:
  - For A: `x` = number of columns in B (`m`) 
  - For B: `x` = number of rows in A (`n`)
  - For C: `x` = number of columns in A (`p`), which can be thought of as the number of columns in C
- `c` = column (e.g. `C[r][c]`)
- `4` = `sizeof(Int)`

> If accessing a 2D array of bytes, you would use `(r * p * 1) + (c * 1)`, as `sizeof(Byte) = 1`.

```ruby
  # Save arguments
  move $s0, $a0             # n
  move $s1, $a1             # m
  move $s2, $a2             # p

  li   $s3, 0               # r = 0
  li   $t0, 4               # sizeof(Int)

mult_loop:
  bge  $s3, $s0, mult_end   # if r >= n, branch
  li   $s4, 0               # c = 0

mult_loop2:
  bge  $s4, $s2, mult_end2  # if c >= p, branch
  li   $s6, 0               # int sum = 0;
  j    mult_loop3

mult_store:
  mul  $t3, $s3, $s2        # t3 = r * p
  mul  $t3, $t3, $t0        # t3 = t3 * 4
  mul  $t4, $s4, $t0        # t4 = c * 4
  add  $t3, $t3, $t4        # t3 = t3 * t4 = (r * p * 4) + (c * 4) 
  sw   $s6, C($t3)          # C[r][c] = sum;

  addi $s4, $s4, 1          # c++

  li   $s5, 0               # i = 0
  j    mult_loop2

mult_loop3:
  bge  $s5, $s1, mult_store # if i >= m, branch

  # A[r][i]
  mul  $t5, $s3, $s1        # t5 = r * m
  mul  $t5, $t5, $t0        # t5 = t5 * 4
  mul  $t6, $s5, $t0        # t6 = i * 4
  add  $t5, $t5, $t6        # t5 = (r * m * 4) + (i * 4)
  lw   $t5, A($t5)

  # B[i][c]
  mul  $t7, $s5, $s2        # t7 = i * n
  mul  $t7, $t7, $t0        # t7 = t7 * 4
  mul  $t8, $s4, $t0        # t8 = 4 * c
  add  $t7, $t7, $t8        # t7 = (i * n * 4) + (c * 4)
  lw   $t7, B($t7)

  mul  $t7, $t5, $t7        # t7 = t5 * t7
  add  $s6, $s6, $t7        # sum = sum + t7

  addi $s5, $s5, 1          # i++
  j    mult_loop3

mult_end2:
  addi $s3, $s3, 1          # r++
  j    mult_loop
```

Finally the function epilogue can be implemented, where we restore the frame pointer and stack pointer, and deallocate the non-temporary registers we used:

```ruby
mult_end:
  # Epilogue
  lw   $ra, -4($fp)
  lw   $s0, -8($fp)
  lw   $s1, -12($fp)
  lw   $s2, -16($fp)
  lw   $s3, -20($fp)
  lw   $s4, -24($fp)
  lw   $s5, -28($fp)
  lw   $s6, -32($fp)
  la   $sp, 4($fp)
  lw   $fp, ($fp)
  jr   $ra
```

Putting it all together we get:

```ruby
  .text
  .globl multMatrices
multiply:
  # Register usage:
  # n is $s0, m is $s1, p is $s2,
  # r is $s3, c is $s4, i is $s5, 
  # sum is $s6

  # Prologue
  sw   $fp, -4($sp)
  la   $fp, -4($sp)
  sw   $ra, -4($fp)
  sw   $s0, -8($fp)
  sw   $s1, -12($fp)
  sw   $s2, -16($fp)
  sw   $s3, -20($fp)
  sw   $s4, -24($fp)
  sw   $s5, -28($fp)
  sw   $s6, -32($fp)
  addi $sp, $sp, -36

  # Save arguments
  move $s0, $a0             # n
  move $s1, $a1             # m
  move $s2, $a2             # p

  li   $s3, 0               # r = 0
  li   $t0, 4               # sizeof(Int)

mult_loop:
  bge  $s3, $s0, mult_end   # if r >= n, branch
  li   $s4, 0               # c = 0

mult_loop2:
  bge  $s4, $s2, mult_end2  # if c >= p, branch
  li   $s6, 0               # int sum = 0;
  j    mult_loop3

mult_store:
  mul  $t3, $s3, $s2        # t3 = r * p
  mul  $t3, $t3, $t0        # t3 = t3 * 4
  mul  $t4, $s4, $t0        # t4 = c * 4
  add  $t3, $t3, $t4        # t3 = t3 * t4 = (r * p * 4) + (c * 4) 
  sw   $s6, C($t3)          # C[r][c] = sum;

  addi $s4, $s4, 1          # c++

  li   $s5, 0               # i = 0
  j    mult_loop2

mult_loop3:
  bge  $s5, $s1, mult_store # if i >= m, branch

  # A[r][i]
  mul  $t5, $s3, $s1        # t5 = r * m
  mul  $t5, $t5, $t0        # t5 = t5 * 4
  mul  $t6, $s5, $t0        # t6 = i * 4
  add  $t5, $t5, $t6        # t5 = (r * m * 4) + (i * 4)
  lw   $t5, A($t5)

  # B[i][c]
  mul  $t7, $s5, $s2        # t7 = i * n
  mul  $t7, $t7, $t0        # t7 = t7 * 4
  mul  $t8, $s4, $t0        # t8 = 4 * c
  add  $t7, $t7, $t8        # t7 = (i * n * 4) + (c * 4)
  lw   $t7, B($t7)

  mul  $t7, $t5, $t7        # t7 = t5 * t7
  add  $s6, $s6, $t7        # sum = sum + t7

  addi $s5, $s5, 1          # i++
  j    mult_loop3

mult_end2:
  addi $s3, $s3, 1          # r++
  j    mult_loop
  
mult_end:
  # Epilogue
  lw   $ra, -4($fp)
  lw   $s0, -8($fp)
  lw   $s1, -12($fp)
  lw   $s2, -16($fp)
  lw   $s3, -20($fp)
  lw   $s4, -24($fp)
  lw   $s5, -28($fp)
  lw   $s6, -32($fp)
  la   $sp, 4($fp)
  lw   $fp, ($fp)
  jr   $ra
```

To call this MIPS function, we can do something like this:

```ruby
# Store M, N, P in $a? registers
lw   $a0, N
lw   $a1, M
lw   $a2, P
jal  multiply
nop
```

After this block executes, the `C[n][p]` matrix will store the result of `A * B`. To print each matrix, a similar process can be implemented taking in M, N, P and a single matrix, but rather than doing the calculation, a system call can be made to print out the value found at `(r * x * 4) + (c * 4)`.