---
title: "circle"
excerpt: "Sketch a circle."
layout: manual
---

Sketch a circle.



```js
circle(center: [number], radius: number, tag?: String, sketch_surface_or_group: SketchSurfaceOrGroup) -> SketchGroup
```

### Examples

```js
const circles = startSketchOn('XY')
  |> circle([5, 5], 1, %)
  |> patternLinear2d({
       axis: [1, 1],
       repetitions: 12,
       distance: 3
     }, %)

const rectangle = startSketchOn('XY')
  |> startProfileAt([0, 0], %)
  |> line([0, 50], %)
  |> line([50, 0], %)
  |> line([0, -50], %)
  |> close(%)
  |> hole(circles, %)
```

![Rendered example of circle 0](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAAAALQCAYAAADPfd1WAABM70lEQVR4Ae3gAZAkSZIkSRKLqpm7R0REZmZmVlVVVVV3d3d3d/fMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMdHd3d3dXV1VVVVVmZkZGRIS7m5kKz0xmV3d1d3dPz8zMzMxMYn3Qgx7EVVddddVVV1111VVXXXXVVVddddVVV131fxKVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4rKVVddddVVV1111VVXXXXVVVddddVVV131fxWVq6666qqrrrrqqquuuuqqq6666qqrrrrq/yoqV1111VVXXXXVVVddddVVV1111VVXXXXV/1VUrrrqqquuuuqqq6666qqrrrrqqquuuuqq/6uoXHXVVVddddVVV1111VVXXXXVVVddddVV/1dRueqqq6666qqrrrrqqquuuuqqq6666qqr/q+ictVVV1111VVXXXXVVVddddVVV1111VVX/V9F5aqrrrrqqquuuuqqq6666qqrrrrqqquu+r+KylVXXXXVVVddddVVV1111VVXXXXVVVdd9X8Vlauuuuqqq6666qqrrrrqqquuuuqqq6666v8qKlddddVVV1111VVXXXXVVVddddVVV1111f9VVK666qqrrrrqqquuuuqqq6666qqrrrrqqv+rqFx11VVXXXXVVVddddVVV1111VVXXXXVVf9XUbnqqquuuuqqq6666qqrrrrqqquuuuqqq/6vonLVVVddddVVV1111VVXXXXVVVddddVVV/1fReWqq6666qqrrrrqqquuuuqqq6666qqrrvq/ispVV1111VVXXXXVVVddddVVV1111VVXXfV/FZWrrrrqqquuuuqqq6666qqrrrrqqquuuur/KipXXXXVVVddddVVV1111VVXXXXVVVddddX/VVSuuuqqq6666qqrrrrqqquuuuqqq6666qr/q6hcddVVV1111VVXXXXVVVddddVVV1111VX/V1G56qqrrrrqqquuuuqqq6666qqrrrrqqqv+r6Jy1VVXXXXVVVddddVVV1111VVXXXXVVVf9X0Xlqquuuuqqq6666qqrrrrqqquuuuqqq676v4p/BKfiC56mgvA4AAAAAElFTkSuQmCC)

### Arguments

* `center`: `[number]` (REQUIRED)
* `radius`: `number` (REQUIRED)
* `tag`: `String` (OPTIONAL)
* `sketch_surface_or_group`: `SketchSurfaceOrGroup` - A sketch surface or a sketch group. (REQUIRED)
```js
{
	// The id of the plane.
	id: uuid,
	// Origin of the plane.
	origin: {
	x: number,
	y: number,
	z: number,
},
	type: "plane",
	// Type for a plane.
	value: "XY" | "XZ" | "YZ" | "Custom",
	// What should the plane’s X axis be?
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// What should the plane’s Y axis be?
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis (normal).
	zAxis: {
	x: number,
	y: number,
	z: number,
},
} |
{
	// the face id the sketch is on
	faceId: uuid,
	// The id of the face.
	id: uuid,
	// The original sketch group id of the object we are sketching on.
	sketchGroupId: uuid,
	type: "face",
	// The tag of the face.
	value: string,
	// What should the face’s X axis be?
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// What should the face’s Y axis be?
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis (normal).
	zAxis: {
	x: number,
	y: number,
	z: number,
},
} |
{
	// The plane id or face id of the sketch group.
	entityId: uuid,
	// The id of the sketch group.
	id: uuid,
	// What the sketch is on (can be a plane or a face).
	on: {
	// The id of the plane.
	id: uuid,
	// Origin of the plane.
	origin: {
	x: number,
	y: number,
	z: number,
},
	type: "plane",
	// Type for a plane.
	value: "XY" | "XZ" | "YZ" | "Custom",
	// What should the plane’s X axis be?
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// What should the plane’s Y axis be?
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis (normal).
	zAxis: {
	x: number,
	y: number,
	z: number,
},
} |
{
	// the face id the sketch is on
	faceId: uuid,
	// The id of the face.
	id: uuid,
	// The original sketch group id of the object we are sketching on.
	sketchGroupId: uuid,
	type: "face",
	// The tag of the face.
	value: string,
	// What should the face’s X axis be?
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// What should the face’s Y axis be?
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis (normal).
	zAxis: {
	x: number,
	y: number,
	z: number,
},
},
	// The position of the sketch group.
	position: [number, number, number],
	// The rotation of the sketch group base plane.
	rotation: [number, number, number, number],
	// The starting path.
	start: {
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
},
	// The paths in the sketch group.
	value: [{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "ToPoint",
} |
{
	// arc's direction
	ccw: string,
	// the arc's center
	center: [number, number],
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "TangentialArcTo",
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "TangentialArc",
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "Horizontal",
	// The x coordinate.
	x: number,
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "AngledLineTo",
	// The x coordinate.
	x: number,
	// The y coordinate.
	y: number,
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "Base",
}],
	// The x-axis of the sketch group base plane in the 3D space
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// The y-axis of the sketch group base plane in the 3D space
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis of the sketch group base plane in the 3D space
	zAxis: {
	x: number,
	y: number,
	z: number,
},
}
```

### Returns

`SketchGroup` - A sketch group is a collection of paths.
```js
{
	// The plane id or face id of the sketch group.
	entityId: uuid,
	// The id of the sketch group.
	id: uuid,
	// What the sketch is on (can be a plane or a face).
	on: {
	// The id of the plane.
	id: uuid,
	// Origin of the plane.
	origin: {
	x: number,
	y: number,
	z: number,
},
	type: "plane",
	// Type for a plane.
	value: "XY" | "XZ" | "YZ" | "Custom",
	// What should the plane’s X axis be?
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// What should the plane’s Y axis be?
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis (normal).
	zAxis: {
	x: number,
	y: number,
	z: number,
},
} |
{
	// the face id the sketch is on
	faceId: uuid,
	// The id of the face.
	id: uuid,
	// The original sketch group id of the object we are sketching on.
	sketchGroupId: uuid,
	type: "face",
	// The tag of the face.
	value: string,
	// What should the face’s X axis be?
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// What should the face’s Y axis be?
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis (normal).
	zAxis: {
	x: number,
	y: number,
	z: number,
},
},
	// The position of the sketch group.
	position: [number, number, number],
	// The rotation of the sketch group base plane.
	rotation: [number, number, number, number],
	// The starting path.
	start: {
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
},
	// The paths in the sketch group.
	value: [{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "ToPoint",
} |
{
	// arc's direction
	ccw: string,
	// the arc's center
	center: [number, number],
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "TangentialArcTo",
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "TangentialArc",
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "Horizontal",
	// The x coordinate.
	x: number,
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "AngledLineTo",
	// The x coordinate.
	x: number,
	// The y coordinate.
	y: number,
} |
{
	// The from point.
	from: [number, number],
	// The name of the path.
	name: string,
	// The to point.
	to: [number, number],
	type: "Base",
}],
	// The x-axis of the sketch group base plane in the 3D space
	xAxis: {
	x: number,
	y: number,
	z: number,
},
	// The y-axis of the sketch group base plane in the 3D space
	yAxis: {
	x: number,
	y: number,
	z: number,
},
	// The z-axis of the sketch group base plane in the 3D space
	zAxis: {
	x: number,
	y: number,
	z: number,
},
}
```



