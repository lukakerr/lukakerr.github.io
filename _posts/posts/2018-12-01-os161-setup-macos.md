---
layout: default
title:  "OS/161 Setup On macOS"
date:   2018-12-01 13:20:00 +1100
permalink: c/os161-setup-macos
category: post
tags:
  - c
  - os161
color: 555555
comments: true
---

# OS/161 Setup On macOS

<small class="written-by">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on December 1, 2018
</small>

## Installing and Running OS/161 on macOS

This is a simple line by line tutorial on how to install and run [os161](http://os161.eecs.harvard.edu) on macOS.

It assumes you have [Homebrew](https://brew.sh) installed.

I found it quite tedious to install the toolchain on macOS just by reading the Harvard guidelines,
and installing on a Mac with Homebrew simplifies things a bit.

If you face any issues, leave a comment and i'll be happy to help.

### Installing the OS/161 Toolchain

```bash
# We will run these commands from ~ but this can be changed to anywhere
cd ~

# Make necessary directories
mkdir ~/os161
mkdir ~/os161/toolbuild
mkdir ~/os161/tools
mkdir ~/os161/tools/bin

# Download necessary files
# Not all files from the OS/161 website are needed, some will be installed with homebrew
wget http://os161.eecs.harvard.edu/download/os161-base-2.0.3.tar.gz
wget http://os161.eecs.harvard.edu/download/gcc-4.8.3+os161-2.1.tar.gz
wget http://os161.eecs.harvard.edu/download/sys161-2.0.8.tar.gz

# Extract all files from tarballs
tar -xvzf os161-base-2.0.3.tar.gz
tar -xvzf gcc-4.8.3+os161-2.1.tar.gz
tar -xvzf sys161-2.0.8.tar.gz

# Install needed binaries
brew install binutils
brew install mpfr
brew install libmpc
brew install gdb
brew install bmake
brew install make   # this installs `gmake` or GNU make

# Install gcc 4.8
cd gcc-4.8.3+os161-2.1
find . -name '*.info' | xargs touch
touch intl/plural.c
cd ..
mkdir buildgcc
cd buildgcc
../gcc-4.8.3+os161-2.1/configure \
  --enable-languages=c,lto \
  --nfp --disable-shared --disable-threads \
  --disable-libmudflap --disable-libssp \
  --disable-libstdcxx --disable-nls \
  --target=mips-harvard-os161 \
  --prefix=$HOME/os161/tools
gmake
gmake install
cd ..

# Install System/161
cd sys161-2.0.8
./configure --prefix=$HOME/os161/tools mipseb
make
make install
cd ..
```

### Building OS/161

```bash
# Configure os161
cd os161-base-2.0.3
./configure --prefix=$HOME/os161/tools mipseb

# Build userland
bmake
bmake install

# Configure kernel
cd kern/conf
./config DUMBVM   # this can be any conf, we will use DUMBVM

# Compile kernel
cd ../compile
bmake depend
bmake
bmake install
```

### Running OS/161

```bash
cd ~/os161/root
sys161 kernel
```