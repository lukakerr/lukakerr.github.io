---
layout: default
title:  "Priority Queue"
date:   2018-08-13 12:30:00 +1100
permalink: code/priority-queue
category: code
hidden: true
tags:
  - c
color: 555555
comments: true
---

## Priority Queue

<small class="written-by">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on August 13, 2018
</small>

The code for a [binary heap](https://en.wikipedia.org/wiki/Binary_heap) based [priority queue](https://en.wikipedia.org/wiki/Priority_queue), written while at UNSW. Relies on an [AVL tree](/code/avl-tree).


```c
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include "AVL.h"

// multiplier to resize an [] by, see https://cs.stackexchange.com/q/74350
#define MULTIPLER 2
#define MIN_ITEMS 100

/**
 * @typedef {struct}  PQ: a pointer to a binary heap
 */
typedef struct PQRep *PQ;

/**
 * @typedef  {struct}    ItemPQ: a priority queue item
 * @property {key}       - the key of the item
 * @property {value}     - the value of the item
 */
typedef struct ItemPQ {
  int key;
  int value;
} ItemPQ;

/**
 * @typedef  {enum}      Action: action to perform when reallocating
 * @property {DECREASE}  - when realloc'ing decrease the size 
 * @property {INCREASE}  - when realloc'ing increase the size
 */
typedef enum {
  DECREASE = 0, 
  INCREASE = 1
} Action;

/**
 * @typedef  {struct}    PQRep: a binary heap
 * @property {numI}      - the number of actual items in the array
 * @property {numE}      - the number of possible slots in the array
 * @property {ItemPQ *}  - array of PQ items
 * @property {AVL}       - AVL tree to hold key and index of items
 */
typedef struct PQRep {
  int numI;
  int numS;
  ItemPQ *items;
  AVL keyTree;
} PQRep;

static bool reallocPQ(PQ q, Action action);
static void bubbleUp(PQ q, ItemPQ *items, int a);
static void bubbleDown(PQ q, ItemPQ *items, int a, int n);
static void swap(PQ q, ItemPQ *a, int b, int c);
static bool greater(ItemPQ a, ItemPQ b);

/**
 * Create a new priority queue, that can store items of type ItemPQ
 * @return {PQ}   The newly created priority queue
 */
PQ newPQ() {
  PQRep *q;

  q = malloc(sizeof(PQRep));
  assert(q != NULL);

  q->items = malloc(sizeof(ItemPQ) * (MIN_ITEMS + 1));
  assert(q->items != NULL);

  q->numI = 0;
  q->numS = MIN_ITEMS;
  q->keyTree = newAVL();

  return q;
}

/**
 * Adds an item to the priority queue. If an item with the key already
 * exists, then its value is just updated
 * @param  {PQ}      q         The queue to operate on
 * @param  {ItemPQ}  element   The item to add
 * @return {void}
 */
void addPQ(PQ q, ItemPQ element) {
  assert(q != NULL);

  // trying to add but not enough space in array, so make space
  if (q->numI >= q->numS) {
    assert(reallocPQ(q, INCREASE));
  }

  // check if item with key exists
  int found = searchAVL(q->keyTree, element.key);
  if (found != -1) {
    q->items[found].value = element.value;
    bubbleUp(q, q->items, found);
    return;
  }

  q->numI++; 
  q->items[q->numI] = element;
  q->keyTree = insertAVL(q->keyTree, element.key, q->numI);
  bubbleUp(q, q->items, q->numI);
}

/**
 * Removes and returns the item with the smallest value. For items with
 * equal value, follow FIFO. If the queue is empty, return NULL
 * @param  {PQ}      q   The queue to operate on
 * @return {ItemPQ}      The item with the smallest value
 */
ItemPQ dequeuePQ(PQ q) {
  assert(!PQEmpty(q));
  swap(q, q->items, 1, q->numI);
  q->numI--;
  bubbleDown(q, q->items, 1, q->numI);
  q->keyTree = deleteAVL(q->keyTree, q->items[q->numI + 1].key);
  return q->items[q->numI + 1];
}

/**
 * Updates the item with a given key, by updating that item's value to the
 * given value. If an item with the given key does not exists in the queue,
 * do nothing
 * @param  {PQ}      q         The queue to operate on
 * @param  {ItemPQ}  element   The item to update
 * @return {void}
 */
void updatePQ(PQ q, ItemPQ element) {
  assert(q != NULL);

  int found = searchAVL(q->keyTree, element.key);
  if (found != -1) {
    int oldValue = q->items[found].value;
    q->items[found].value = element.value;

    if (oldValue > element.value) {
      bubbleUp(q, q->items, found);
    } else if (oldValue < element.value) {
      bubbleDown(q, q->items, found, q->numI);
    }
  }
}

/**
 * Returns an int (1 or 0) for whether the queue is empty
 * @param  {PQ}  q   The priority queue to check
 * @return {int}     The 1 if empty, 0 if not
 */
int PQEmpty(PQ q) {
  assert(q != NULL);
  return q->numI <= 0;
}

/**
 * Frees all the memory from a given priority queue
 * @param  {PQ}    q   The queue to free
 * @return {void}
 */
void freePQ(PQ q) {
  assert(q != NULL);

  freeAVL(q->keyTree);
  free(q->items);
  free(q);
}

/**
 * Increase or decrease space in an items array in a priority queue
 * @param  {PQ}      q   The queue to realloc
 * @param  {Action}  a   The action to perform (DECREASE or INCREASE)
 * @return {bool}        Whether the realloc was successful
 */
static bool reallocPQ(PQ q, Action a) {
  int n = q->numS;

  q->numS = a ? (n * MULTIPLER) : (n / MULTIPLER);
  n = q->numS;

  int size = a ? (n * MULTIPLER) : (n / MULTIPLER);
  q->items = realloc(q->items, size * sizeof(ItemPQ));

  return q->items != NULL;
}

/**
 * Moves the item at items[a] into the correct position in the queue
 * @param  {PQ}        q       The priority queue
 * @param  {ItemPQ *}  items   The array of items in the queue
 * @param  {int}       a       The item index to correct
 * @return {void}
 */
static void bubbleUp(PQ q, ItemPQ *items, int a) {
  while (a > 1 && greater(items[a / 2], items[a])) {
    swap(q, items, a, a / 2); 
    a = a / 2;
  } 
}

/**
 * Moves the item at items[a] into the correct position in the queue
 * @param  {PQ}        q       The priority queue
 * @param  {ItemPQ *}  items   The array of items in the queue
 * @param  {int}       a       The item index to correct
 * @param  {int}       n       The max index and number of items in the queue
 * @return {void}
 */
static void bubbleDown(PQ q, ItemPQ *items, int a, int n) {
  while (2 * a <= n) {
    // compute address of left child
    int j = 2 * a;

    // choose larger of two children
    if (j < n && greater(items[j], items[j + 1])) {
      j++;
    }

    if (!greater(items[a], items[j])) {
      break;
    }

    swap(q, items, a, j);

    // move one level down the heap
    a = j;
  }
}

/**
 * Swap two indexes in an array
 * @param  {PQ}        q       The priority queue
 * @param  {ItemPQ *}  items   The array of items in the queue
 * @param  {int}       b       An index to swap
 * @param  {int}       c       An index to swap
 * @return {void}
 */
static void swap(PQ q, ItemPQ *items, int b, int c) {
  swapAVL(q->keyTree, items[b].key, items[c].key);

  ItemPQ tmp = items[b];
  items[b] = items[c];
  items[c] = tmp;
}

/**
 * Returns whether the first passed item is greater than the second
 * @param  {ItemPQ}  a   The first item
 * @param  {ItemPQ}  b   The second item
 * @return {bool}        Whether a > b
 */
static bool greater(ItemPQ a, ItemPQ b) {
  return a.value > b.value;
}
```