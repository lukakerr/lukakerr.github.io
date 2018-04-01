---
layout: default
title:  "TMP36 LCD Temperature Display"
date:   2018-04-01 10:30:00 +1100
permalink: arduino/tmp36-lcd-temperature-display
category: arduino
tags: 
  - arduino
  - fritzing
color: BD79D1
comments: true
---

# TMP36 LCD Temperature Display

<small style="color: #777; top: -10px; position: relative">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on April 1, 2018
</small>

The TMP36 sensor is a temperature sensor, and using it with a 16 pin LCD display is a nice way to display the current temperature.

The first thing you must do it include the LCD library so that text can be displayed. This is shown below

```cpp
// include the library code:
#include <LiquidCrystal.h>
```

Next you need to specify which pins you want to use to display the output. For this example we are using pins 12, 11, 5, 4, 3, 2. You can see more clearly in the Fritzing diagram at the bottom where these pins are located.

```cpp
// Initialize the library with the numbers of the interface pins
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
```

Next we declare the analog input pin for the TMP36, for this example we are using pin 1. 

```cpp
int tempPin = 1;
```

Next is the setup function. This returns nothing but sets up the properties of the LCD display including its width in characters, height in characters and the text that is displayed. 

```cpp
void setup() {
  // Setup the LCD number of columns and rows
  lcd.begin(16, 2);
  lcd.print("Temp ");
  lcd.print((char)223);
  lcd.print("C = ");
}
```

Finally we use the loop function which continuously loops through the TMP36's input and performs a calculation to convert the analog reading into temperature (degrees Celsius). This then gets displayed on the LCD screen, and updates every 1000ms, or every 1 second.

```cpp
void loop() {
  float voltage, temp;
  int reading = analogRead(tempPin);

  temp = 1.8 * ((reading + 30) / 8.3) + 32;
  temp = ((temp - 32) * 5) / 9;

  // Print result to lcd display
  lcd.setCursor(10, 0);
  lcd.print(temp);

  // Sleep
  delay(1000);
}
```

In the end this is what your code should look similar to.

> You will need to modify the `temp` variable's calculation if you want it in fahrenheit. 

```cpp
// include the library code:
#include <LiquidCrystal.h>

// Initialize the library with the numbers of the interface pins
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

int tempPin = 1;

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  lcd.print("Temp ");
  lcd.print((char)223);
  lcd.print("C = ");
}

void loop() {
  float voltage, temp;
  int reading = analogRead(tempPin);

  temp = 1.8 * ((reading + 30) / 8.3) + 32;
  temp = ((temp - 32) * 5) / 9;

  // print result to lcd display
  lcd.setCursor(10, 0);
  lcd.print(temp);

  // sleep...
  delay(1000);
}
```

## Fritzing Diagram

The wiring for the display and temperature is shown below:

![fritzing]({{ "/assets/img/arduino/lcd-tmp36.jpg" | absolute_url }})
