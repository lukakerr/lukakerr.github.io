---
layout: default
title:  "NSWindow Styles"
date:   2018-03-31 20:25:00 +1100
permalink: swift/nswindow-styles
category: swift
tags: 
  - swift
  - nswindow
  - showcase
color: EAB168
comments: true
---

# NSWindow Style Showcase

A showcase of many of the different styles of windows possible with NSWindow on MacOS. In some examples, NSToolbar, and NSVisualEffectView are used. No private API's are used.

All code is assumed to be put in a window controller such as `WindowController.swift`, in the `windowDidLoad` function. You should just be able to place each block inside that function to get the exact same result.

### 1. Hide title

Don't show the title text in the titlebar.

![1]({{ "/assets/img/swift/nswindow-styles/1.png" | absolute_url }})

```swift
window?.titleVisibility = .hidden
```

### 2. Hide titlebar

Hide the titlebar completely.

![2]({{ "/assets/img/swift/nswindow-styles/2.png" | absolute_url }})

```swift
window?.styleMask.remove(.titled)
```

### 3. Vibrant background

Create a vibrant background where whatever is behind the window can be slightly seen. This uses `NSVisualEffectView`.

![3]({{ "/assets/img/swift/nswindow-styles/3.png" | absolute_url }})

```swift
let visualEffect = NSVisualEffectView()
visualEffect.blendingMode = .behindWindow
visualEffect.state = .active
visualEffect.material = .dark
window?.contentView = visualEffect
```

`visualEffect.material` can take multiple values including:

- `.appearanceBased`: based on the views appearance
- `.dark`: dark appearance
- `.ultraDark`: ultra dark appearance
- `.light`: light appearance
- `.mediumLight`: medium light appearance
- others such as `.menu`, `.popover`, `.selection`, `.sidebar` and `.titlebar`

### 4. Vibrant background with transparent titlebar

Same as above, with a transparent titlebar.

![4]({{ "/assets/img/swift/nswindow-styles/4.png" | absolute_url }})

```swift
let visualEffect = NSVisualEffectView()
visualEffect.blendingMode = .behindWindow
visualEffect.state = .active
visualEffect.material = .dark
window?.contentView = visualEffect

window?.titlebarAppearsTransparent = true
window?.styleMask.insert(.fullSizeContentView)
```

### 5. Vibrant background without titlebar

Same as above, without the titlebar.

![5]({{ "/assets/img/swift/nswindow-styles/5.png" | absolute_url }})

```swift
let visualEffect = NSVisualEffectView()
visualEffect.blendingMode = .behindWindow
visualEffect.state = .active
visualEffect.material = .dark
window?.contentView = visualEffect

window?.styleMask.remove(.titled)
window?.isMovableByWindowBackground = true
```

### 6. Vibrant background with border radius and no titlebar

A vibrant window with a custom border radius. The border radius value can be changed at `visualEffect.layer?.cornerRadius = 16.0`.

![6]({{ "/assets/img/swift/nswindow-styles/6.png" | absolute_url }})

```swift
let visualEffect = NSVisualEffectView()
visualEffect.translatesAutoresizingMaskIntoConstraints = false
visualEffect.material = .dark
visualEffect.state = .active
visualEffect.wantsLayer = true
visualEffect.layer?.cornerRadius = 16.0

window?.titleVisibility = .hidden
window?.styleMask.remove(.titled)
window?.backgroundColor = .clear
window?.isMovableByWindowBackground = true

window?.contentView?.addSubview(visualEffect)

guard let constraints = window?.contentView else {
  return
}

visualEffect.leadingAnchor.constraint(equalTo: constraints.leadingAnchor).isActive = true
visualEffect.trailingAnchor.constraint(equalTo: constraints.trailingAnchor).isActive = true
visualEffect.topAnchor.constraint(equalTo: constraints.topAnchor).isActive = true
visualEffect.bottomAnchor.constraint(equalTo: constraints.bottomAnchor).isActive = true
```

### 7. Transparent titlebar

A window with a transparent titlebar.

![7]({{ "/assets/img/swift/nswindow-styles/7.png" | absolute_url }})

```swift
window?.titlebarAppearsTransparent = true
```

### 8. Transparent titlebar with background color

Same as above with a background color.

![8]({{ "/assets/img/swift/nswindow-styles/8.png" | absolute_url }})

```swift
window?.titlebarAppearsTransparent = true
window?.backgroundColor = .red
```

### 9. Toolbar

A window with a toolbar.

![9]({{ "/assets/img/swift/nswindow-styles/9.png" | absolute_url }})

```swift
let customToolbar = NSToolbar()
window?.titleVisibility = .hidden
window?.toolbar = customToolbar
```

### 10. Transparent toolbar

Same as above, with the toolbar transparent.

![10]({{ "/assets/img/swift/nswindow-styles/10.png" | absolute_url }})

```swift
let customToolbar = NSToolbar()
window?.titlebarAppearsTransparent = true
window?.titleVisibility = .hidden
window?.toolbar = customToolbar
```

### 11. Transparent toolbar without seperator

Same as above, without the toolbar seperator.

![11]({{ "/assets/img/swift/nswindow-styles/11.png" | absolute_url }})

```swift
let customToolbar = NSToolbar()
customToolbar.showsBaselineSeparator = false
window?.titlebarAppearsTransparent = true
window?.titleVisibility = .hidden
window?.toolbar = customToolbar
```

### 12. Transparent toolbar with background color and without seperator

Same as above, with a background color.

![12]({{ "/assets/img/swift/nswindow-styles/12.png" | absolute_url }})

```swift
let customToolbar = NSToolbar()
customToolbar.showsBaselineSeparator = false
window?.titlebarAppearsTransparent = true
window?.titleVisibility = .hidden
window?.backgroundColor = .red
window?.toolbar = customToolbar
```

### 13. Translucent toolbar

A translucent toolbar allowing for content behind the toolbar to be slightly seen.

![13]({{ "/assets/img/swift/nswindow-styles/13.png" | absolute_url }})

```swift
let customToolbar = NSToolbar()
window?.titleVisibility = .hidden
window?.styleMask.insert(.fullSizeContentView)
window?.contentView?.wantsLayer = true
window?.contentView?.layer?.contents = NSImage(named: NSImage.Name(rawValue: "Background"))
window?.toolbar = customToolbar
```

### 14. Translucent titlebar

Same as above with a titlebar instead of a toolbar.

![14]({{ "/assets/img/swift/nswindow-styles/14.png" | absolute_url }})

```swift
window?.titleVisibility = .hidden
window?.styleMask.insert(.fullSizeContentView)
window?.contentView?.wantsLayer = true
window?.contentView?.layer?.contents = NSImage(named: NSImage.Name(rawValue: "Background"))
```

### 15. Transparent titlebar without title

Same as above with a transparent titlebar.

![15]({{ "/assets/img/swift/nswindow-styles/15.png" | absolute_url }})

```swift
window?.titleVisibility = .hidden
window?.styleMask.insert(.fullSizeContentView)
window?.titlebarAppearsTransparent = true
window?.contentView?.wantsLayer = true
window?.contentView?.layer?.contents = NSImage(named: NSImage.Name(rawValue: "Background"))
```