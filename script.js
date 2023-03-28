window.onload = function() {
    const audio = document.getElementById('audio');
    const file = document.getElementById('file-input')
    const canvas = document.getElementById('canvas')

    document.addEventListener('keydown', function(event){
        if (event.key === 'm') {
            const inputControls = document.querySelector('.inputContainer')
            inputControls.classList.toggle('inputContainerTransparent')
            console.log('test')
        }
    })




    file.onchange = function() {
        const files = this.files;
        audio.src = URL.createObjectURL(files[0]);

        canvas.width = (window.innerWidth/1.3);
        canvas.height = (window.innerHeight/1.3);
        const ctx = canvas.getContext('2d');

        const audioCtx = new AudioContext();
        let src = audioCtx.createMediaElementSource(audio);
        const analyser = audioCtx.createAnalyser();
    
        src.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.smoothingTimeConstant = 0.85;
        analyser.fftSize = 64;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const xRepeatButton = document.querySelector("#xRepeatButton");
        const yRepeatButton = document.querySelector("#yRepeatButton");
        const modifyButton = document.querySelector("#modifyButton");
        const blendButton = document.querySelector('#blendButton')
        xRepeatButton.addEventListener('click', () => {changeButtonState(xButtonState)});
        yRepeatButton.addEventListener('click', () => {changeButtonState(yButtonState)});
        modifyButton.addEventListener('click', () => {changeButtonState(modifyState)});
        blendButton.addEventListener('click', () => {changeButtonState(blendState)});


        const sizeSlider = document.getElementById("sliderSize");
        const colourSlider = document.getElementById("sliderColour");
        const attenuator = document.getElementById("attenuator");
        const attenuatorBars = document.getElementById("attenuatorBars");
        const fadeTime = document.getElementById("fadeTime")
        const roundnessSlider = document.getElementById("roundness")
        const depthLFOSlider = document.getElementById("depthLFO")
        const rateLFOSlider = document.getElementById("rateLFO")

        const lfoCheckBoxStates = {
            sliderSizeLFOBox: false,
            roundnessLFOBox: false,
            attenuatorBarsLFOBox: false,
            fadeTimeLFOBox: false,
            attenuatorLFOBox: false,
            sliderColourLFOBox: false    
        }
        
        const sliderSizeLFOBox = document.querySelector("#sliderSizeLFO")
        const roundnessLFOBox = document.querySelector("#roundnessLFO")
        const attenuatorBarsLFOBox = document.querySelector("#attenuatorBarsLFO")
        const fadeTimeLFOBox = document.querySelector("#fadeTimeLFO")
        const attenuatorLFOBox = document.querySelector("#attenuatorLFO")
        const sliderColourLFOBox = document.querySelector("#sliderColourLFO")


        function renderFrame() {

            let sizeSliderOutput = sizeSlider.value/2;
            let colourSliderOutput = colourSlider.value;
            let attenuatorOutput = attenuator.value/30;
            let barsOutput = attenuatorBars.value;
            let fadeTimeOutput = (fadeTime.value)/100;
            let roundnessOutput = roundnessSlider.value;
            let depthLFOOutput = depthLFOSlider.value/5;
            let rateLFOOutput = rateLFOSlider.value/200;
            
            const timeInSeconds = Date.now() / 1000;
            //Outputs a changing value the user can control
            const sineWaveValue = ((Math.sin(2 * Math.PI * rateLFOOutput * timeInSeconds))*depthLFOOutput);


            requestAnimationFrame(renderFrame);

            if (lfoCheckBoxStates.fadeTimeLFOBox == true) {
                fadeTimeOutput = ((fadeTimeOutput + (sineWaveValue))%2)/10;
            } else {
                fadeTimeOutput = fadeTimeOutput;
            }

            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = `rgba(0,0,0,${fadeTimeOutput})`;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            
            //When pressing LFO assignment button it will update the object that can be referenced inside of draw shape
            sliderSizeLFOBox.addEventListener('change', () => lfoCheckBoxStates.sliderSizeLFOBox = sliderSizeLFOBox.checked);
            roundnessLFOBox.addEventListener('change', () => lfoCheckBoxStates.roundnessLFOBox = roundnessLFOBox.checked);
            attenuatorBarsLFOBox.addEventListener('change', () => lfoCheckBoxStates.attenuatorBarsLFOBox = attenuatorBarsLFOBox.checked);
            sliderColourLFOBox.addEventListener('change', () => lfoCheckBoxStates.sliderColourLFOBox = sliderColourLFOBox.checked);
            attenuatorLFOBox.addEventListener('change', () => lfoCheckBoxStates.attenuatorLFOBox = attenuatorLFOBox.checked);
            fadeTimeLFOBox.addEventListener('change', () => lfoCheckBoxStates.fadeTimeLFOBox = fadeTimeLFOBox.checked);




            drawShapes (xButtonState, yButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT)
            ctx.globalCompositeOperation = "source-over";

        }
        audio.play();
        renderFrame();
    }
}
function drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT) {
    // adjust amount of shapes (barsOutput)
    if (lfoCheckBoxStates.attenuatorBarsLFOBox == true) {
        barsOutput = ((barsOutput * Math.abs(sineWaveValue))%36);
    } else {
        barsOutput = barsOutput;
    }

    for (let i = 0; i < barsOutput; i++) {
        //Set modifiers if lfo is assained or not
        if(lfoCheckBoxStates.attenuatorLFOBox == true) {
            attenuatorOutput = (attenuatorOutput + (Math.abs(sineWaveValue) % 5) % 10) / 4
            if (attenuatorOutput >= 8) {
                attenuatorOutput = 8;
            }
        } else {
            attenuatorOutput = attenuatorOutput
        }
        if (lfoCheckBoxStates.sliderSizeLFOBox == true) {
            shapeGrowth = (dataArray[i] * attenuatorOutput + (sizeSliderOutput * 1.7)) * sineWaveValue;
        } else {
            shapeGrowth = (dataArray[i] * attenuatorOutput + (sizeSliderOutput * 1.7));
        }
        if (lfoCheckBoxStates.roundnessLFOBox == true){
            roundnessOutput =  ~~((Math.abs(sineWaveValue)*40)%300); // ~~ is bit shift operator to round with better performance 
        } else {
            roundnessOutput = roundnessOutput;
        }
        if (lfoCheckBoxStates.sliderColourLFOBox == true) {
            shapeColor = colourSliderOutput + (Math.abs(sineWaveValue))*40
        } else {
            shapeColor = (colourSliderOutput);
        }
        shapeSaturation = (30 + attenuatorOutput + (dataArray[i]) % 80);
        
        if (modifyState.value == 1) {
            ctx.fillStyle = `hsla(${(shapeColor) % 360}, ${shapeSaturation}%, ${60}%, ${90}%) `;
            ctx.beginPath();
            ctx.roundRect((WIDTH / 2 - shapeGrowth), ~~(HEIGHT / 2 - shapeGrowth), ~~(shapeGrowth * 2), ~~(shapeGrowth * 2), roundnessOutput);
            ctx.fill();
        } else if (modifyState.value == 2) {
            ctx.fillStyle = `hsla(${(i*shapeColor + shapeSaturation) % 360}, ${shapeSaturation}%, ${60}%, ${90}%)`;
            ctx.beginPath();
            ctx.roundRect(~~(WIDTH / 2 - shapeGrowth), ~~(HEIGHT / 2 - shapeGrowth), ~~(shapeGrowth * 2), ~~(shapeGrowth * 2), roundnessOutput);
            ctx.fill();
        } else if (modifyState.value == 3) {
            ctx.fillStyle = `hsla(${(i*shapeColor + i**2) % 360}, ${shapeSaturation+5*i}%, ${50}%, ${90}%)`;
            ctx.beginPath();
            ctx.roundRect(~~(WIDTH / 2 - shapeGrowth * i), ~~(HEIGHT / 2 - shapeGrowth + 10*i), ~~(shapeGrowth * 2), ~~(shapeGrowth * 2), roundnessOutput);
            ctx.fill();
        } else if (modifyState.value == 4) {
            ctx.fillStyle = `hsla(${(shapeColor + (dataArray[i]% 40) /i) % 360}, ${shapeSaturation+5*i}%, ${50}%, ${90}%)`;
            ctx.beginPath();
            ctx.roundRect(~~(WIDTH / 2 - shapeGrowth * i + i), ~~(HEIGHT / 2 - shapeGrowth + 2**i - i), ~~(shapeGrowth * 2), ~~(shapeGrowth * 2), roundnessOutput);
            ctx.roundRect(~~(WIDTH / 2 - shapeGrowth * -i - i), ~~(HEIGHT / 2 - shapeGrowth + 2**i - i), ~~(shapeGrowth * 2), ~~(shapeGrowth * 2), roundnessOutput);
            ctx.fill();
        } else if (modifyState.value == 5) {
            ctx.fillStyle = `hsla(${(shapeColor + dataArray[5*i]%130) % 360}, ${shapeSaturation+5*i}%, ${50}%)`;
            ctx.beginPath();
            ctx.roundRect(~~(WIDTH / 2 - (shapeGrowth +dataArray[i]%400) + 10*i), ~~(HEIGHT / 2 - (shapeGrowth +(dataArray[i]%400) + 10*i)), ~~((shapeGrowth * 2) + dataArray[i] %100), ~~(shapeGrowth * 2 + dataArray[i] %100), roundnessOutput);
            ctx.fill();
        } else {
            ctx.fillStyle = `hsla(${(shapeColor + dataArray[i]%160) % 360}, ${shapeSaturation+5*i}%, ${50}%)`;
            ctx.beginPath();
            ctx.roundRect(~~(WIDTH / 2 - (shapeGrowth) + 10*i), ~~(HEIGHT / 2 - (shapeGrowth) + 10*i), ~~((shapeGrowth * 2) + dataArray[i] %50), ~~(shapeGrowth * 2), roundnessOutput)
            ctx.fill();
        }
    }
}
const xButtonState = {value: 1, max:5};
const yButtonState = {value: 1, max:3};
const modifyState = {value: 1, max:6}
const blendState = {value: 1, max:4}


function changeButtonState(buttonState) {
    if (buttonState.value == buttonState.max) {
        return buttonState.value = 1;
    } else {
        return buttonState.value++;
    }
}

function changeBlendMode(blendState , ctx){
    if (blendState.value == 1) {
        return ctx.globalCompositeOperation = "source-over"
    } else if (blendState.value == 2) {
        return ctx.globalCompositeOperation = "color-burn"
    } else if (blendState.value ==3) {
        return ctx.globalCompositeOperation = "difference"
    } else {
        return ctx.globalCompositeOperation = "soft-light"

    }
}

function drawShapes (xButtonState, yButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT) {
    repeatInY(yButtonState, xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT);
    //changeBlendMode(blendState, ctx);

}

function repeatInY(yButtonState, xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT) {
    for (let i = 1; i <= yButtonState.value; i++) {
        if (yButtonState.value == 1) {
            RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT);
            changeBlendMode(blendState, ctx);
        } else if (yButtonState.value == 2) {
            if (i == 1) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, ((HEIGHT + HEIGHT / 2) - sizeSliderOutput / 2));
            } else if (i = 2) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, (HEIGHT / 2) - sizeSliderOutput / 2);
            }
            changeBlendMode(blendState, ctx);
        } else if (yButtonState.value == 3) {
            if (i == 1) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, ((HEIGHT + (2 * HEIGHT / 3)) - sizeSliderOutput / 2));
            } else if (i == 3) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, ((HEIGHT / 3) - sizeSliderOutput / 2));
            }
            changeBlendMode(blendState, ctx);
        } 
    } 
}

function RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT) {
    for (let i = 1; i <= xButtonState.value; i++) {
        if (xButtonState.value == 1) {
            drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT);
            changeBlendMode(blendState, ctx);
        } else if (xButtonState.value == 2) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH + (WIDTH / 2) - sizeSliderOutput / 2) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH / 2) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 3) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH + (2 * WIDTH / 3)) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH / 3) - sizeSliderOutput / 2), HEIGHT);
            }
            changeBlendMode(blendState, ctx);
        } else if (xButtonState.value == 4) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH + WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 3) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((3 * WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, (WIDTH + (3 * WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 5) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 3) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((WIDTH + (2 * WIDTH) / 5) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 4) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, ((3 * WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput, modifyState, sineWaveValue, lfoCheckBoxStates, ctx, (WIDTH + (4 * WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            }
            changeBlendMode(blendState, ctx);
        }
    } 
    //changeBlendMode(blendState, ctx);
}
