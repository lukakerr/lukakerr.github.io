---
layout: default
title:  "Binary Search Tree"
date:   2018-08-12 14:00:00 +1100
permalink: code/binary-search-tree
category: code
hidden: true
tags:
  - c
color: 555555
comments: true
---

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on August 12, 2018
</small>

## Binary Search Tree

The code for a [binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree), written while at UNSW.

```c
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <string.h>
#include "BST.h"
#include "PQ.h"

/**
 * Handy macros for operating on a binary search tree
 */
#define left(tree) tree->left
#define right(tree) tree->right
#define key(tree) tree->key
#define val(tree) tree->key

/**
 * @typedef {struct}  BST: a pointer to the root node of a BST
 */
typedef struct BSTNode *BST;

/**
 * @typedef  {struct}      BSTNode: a node in a binary search tree
 * @property {key}         - unique key of node
 * @property {val}         - value of node
 * @property {BSTNode *}   - pointer to left child node
 * @property {BSTNode *}   - pointer to right child node
 */
typedef struct BSTNode {
  int key;
  int val;
  struct BSTNode *left;
  struct BSTNode *right;
} BSTNode;

static BST deleteRootBST(BST tree);

/**
 * Creates a new node with a key and a value
 * @param  {int}   key   The key of the new node
 * @param  {int}   val   The value of the new node
 * @return {BSTNode *}   A pointer to a new node
 */
static BSTNode *newBSTNode(int key, int val) {
  BSTNode *new = malloc(sizeof(BSTNode));
  assert(new != NULL);

  new->key = key;
  new->val = val;
  new->left = NULL;
  new->right = NULL;

  return new;
}

/**
 * Creates a new binary search tree and returns it
 * @return {BST}   A new binary search tree (NULL initially)
 */
BST newBST() {
  return NULL;
}

/**
 * Frees all memory of the given binary search tree
 * @param  {BST}   tree  The tree to free
 * @return {void}
 */
void freeBST(BST tree) {
  if (tree == NULL) {
    return;
  }

  freeBST(left(tree));
  freeBST(right(tree));
  free(tree);
}

/**
 * Inserts a new node in to the tree with a given key and value
 * @param  {BST}   tree  The tree to insert into
 * @param  {int}   key   The key of the new node
 * @param  {int}   val   The value of the new node
 * @return {BST}         The tree containing the inserted value
 */
BST insertBST(BST tree, int key, int val) {
  if (tree == NULL) {
    return newBSTNode(key, val);
  } else if (key < key(tree)) {
    left(tree) = insertBST(left(tree), key, val);
  } else if (key > key(tree)) {
    right(tree) = insertBST(right(tree), key, val);
  }
  return tree;
}

/**
 * Checks whether a node is in a tree, given a key
 * @param  {int}   key   The key to use to search
 * @param  {BST}   tree  The tree to search
 * @return {int}         Returns -1 if the node doesn't exist, or
 *                       returns the value of the node if it exists
 */
int searchBST(BST tree, int key) {
  if (tree == NULL) {
    return -1;
  } else if (key < key(tree)) {
    return searchBST(left(tree), key);
  } else if (key > key(tree)) {
    return searchBST(right(tree), key);
  } else {
    return val(tree);
  }
}

/**
 * Checks whether a node is in a tree, given a key
 * @param  {int}   key   The key to use to search
 * @param  {BST}   tree  The tree to search
 * @return {BST}         Returns NULL if the node doesn't exist, or
 *                       returns the node if it exists
 */
static BST searchNodeBST(BST tree, int key) {
  if (tree == NULL) {
    return NULL;
  } else if (key < key(tree)) {
    return searchNodeBST(left(tree), key);
  } else if (key > key(tree)) {
    return searchNodeBST(right(tree), key);
  }

  return tree;
}

/**
 * Swaps two nodes in a tree given two unique keys, given both nodes exist
 * @param  {BST}   tree  The tree to operate on
 * @param  {BST}   k1    The first key
 * @param  {int}   k2    The second key
 * @return {void}
 */
void swapBST(BST tree, int k1, int k2) {
  BST t1 = searchNodeBST(tree, k1);
  BST t2 = searchNodeBST(tree, k2);

  if (t1 && t2) {
    int tmp = val(t1);
    val(t1) = val(t2);
    val(t2) = tmp;
  }
}

/**
 * Delete a node from a tree given a key
 * @param  {BST}   tree  The tree to operate on
 * @param  {int}   key   The key of the node to delete
 * @return {BST}         The tree with the node removed
 */
BST deleteBST(BST tree, int key) {
  if (tree == NULL) {
    return NULL;
  } else if (key < key(tree)) {
    left(tree) = deleteBST(left(tree), key);
  } else if (key > key(tree)) {
    right(tree) = deleteBST(right(tree), key);
  } else {
    tree = deleteRootBST(tree);
  }

  return tree;
}

/**
 * Deletes the root node of the given tree
 * @param  {BST}   tree  The tree to operate on
 * @return {BST}         The tree with the root node removed
 */
static BST deleteRootBST(BST tree) {
  // handle cases where both or one subtree doesn't exist
  if (left(tree) == NULL && right(tree) == NULL) {
    free(tree);
    return NULL;
  } else if (left(tree) == NULL && right(tree) != NULL) {
    free(tree);
    return right(tree);
  } else if (left(tree) != NULL && right(tree) == NULL) {
    free(tree);
    return left(tree);
  }

  // the root node has both a left and right tree
  // - find inorder successor
  // - move its value to root
  // - delete inorder successor node
  BSTNode *parent = tree;
  BSTNode *successor = right(tree);

  while (left(successor) != NULL) {
    parent = successor;
    successor = left(successor);
  }

  key(tree) = key(successor);
  val(tree) = val(successor);
  free(successor);

  if (parent == tree) {
    right(parent) = NULL;
  } else {
    left(parent) = NULL;
  }

  return tree;
}
```