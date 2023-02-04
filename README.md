# Music-Visualiser
A self-driven project to create audio-reactive imagery that can be user controlled.

## Aims
+ To create a program that is fun and interesting to use
+ To have UI input controls to effect the visualisation
+ To learn more about the Canvas element
+ To learn more, and utilize, API's
+ To complete a personal coding project that i have designed

## Concept
A video synthesiser is a device that creates visual material without the need for a video input, like a camera, allowing users to create complex patterns and images.
Music visualisers generate real-time images based on the audio signal passed in.
The [Atari Video Music](https://en.wikipedia.org/wiki/Atari_Video_Music) was the first commercially available music visualiser and is a direct inspiration on this project.
It allowed the user to change parameter with buttons and knobs such as shapes, color and mirroring of axis.

Video synthesisers have a far greater range of potential outcomes however they are a lot harder to use and require more work and time. Music visualisers are often preset or offer simple controls with limited change in outputs.
I would like to create this app to allow more changes and potential than most music visualisers whilst still keeping many restrictions to allow for ease of use and for giving creative constraints.

## Implementation Ideas

### Controls and access
+ Controls need to be hidable so visuals can be seen in full
    + should have an opacity slider to obscure them
    + a button should be assigned to show and hide them
+ Sliders will be used over knobs
+ Buttons need to clearly show what state they are in (on/off and differentiate if multi-press)

### User inputs
+ A color parameter (potentially 3 for rbg) - slider
+ Saturation - slider 
+ Incoming gain,  A attenuverter of incoming audio signal to effect amount and polarity of audio change -slider
+ Shape sides - quantised slider
+ Shape size - slider
+ Shape smoothing - slider
+ Shape feathering - slider 
+ Mirroring output (x and y) - buttons
+ kaleidoscope mode - button
+ Invert Colors - button 
+ feedback - button with slider
+ Pixel Mode - button (multi-press, large to small pixels)
+ Preset button - button (multi-press)

+ Mod matrix
audio signal is split up into 5 bands, each band can then be assigned to change the selected parameter. 
Each parameter may need another slider to attenuate gain per parameter.

