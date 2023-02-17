window.onload = function() {
    const audio = document.getElementById('audio');
    const file = document.getElementById('file-input')
    const canvas = document.getElementById('canvas')



    file.onchange = function() {
        const files = this.files;
        console.log('FILES[0]: ', files[0])
        audio.src = URL.createObjectURL(files[0]);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');

        const audioCtx = new AudioContext();
        let src = audioCtx.createMediaElementSource(audio);
        const analyser = audioCtx.createAnalyser();
    
        src.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 32;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        console.log(dataArray)

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
        
        function renderFrame() {

            let sizeSliderOutput = sizeSlider.value;
            let colourSliderOutput = colourSlider.value;
            let attenuatorOutput = attenuator.value/20;
            let barsOutput = attenuatorBars.value;
            let fadeTimeOutput = (fadeTime.value)/100;
            let roundnessOutput = roundnessSlider.value; 

            requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = `rgba(0,0,0,${fadeTimeOutput})`;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            
            drawShapes (xButtonState, yButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT)
            ctx.globalCompositeOperation = "source-over";
        }
        audio.play();
        renderFrame();
    }
}
function drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT) {
    for (let i = 0; i < barsOutput; i++) {
        shapeGrowth = (dataArray[i] * attenuatorOutput + (sizeSliderOutput * 1.7));
        shapeColor = (colourSliderOutput);
        shapeSaturation = (30 + attenuatorOutput + (dataArray[i]) % 80);
        
        if (modifyState.value == 1) {
            ctx.fillStyle = `hsla(${(shapeColor + shapeSaturation) % 360}, ${shapeSaturation}%, ${60}%, ${90}%) `;
            ctx.beginPath();
            ctx.roundRect(Math.floor(WIDTH / 2 - shapeGrowth), Math.floor(HEIGHT / 2 - shapeGrowth), Math.floor(shapeGrowth * 2), Math.floor(shapeGrowth * 2), roundnessOutput);
            ctx.fill();
        } else if (modifyState.value == 2) {
            ctx.fillStyle = `hsla(${(i*shapeColor + shapeSaturation) % 360}, ${shapeSaturation}%, ${60}%, ${90}%)`;
            ctx.beginPath();
            ctx.roundRect(Math.floor(WIDTH / 2 - shapeGrowth), Math.floor(HEIGHT / 2 - shapeGrowth), Math.floor(shapeGrowth * 2), Math.floor(shapeGrowth * 2), roundnessOutput);
            ctx.fill();

        } else if (modifyState.value == 3) {
            ctx.fillStyle = `hsla(${(i*shapeColor + i**2) % 360}, ${shapeSaturation+5*i}%, ${50}%, ${90}%)`;
            ctx.beginPath();
            ctx.roundRect(Math.floor(WIDTH / 2 - shapeGrowth * i), Math.floor(HEIGHT / 2 - shapeGrowth + 10*i), Math.floor(shapeGrowth * 2), Math.floor(shapeGrowth * 2), roundnessOutput);
            ctx.fill();
        } else if (modifyState.value == 4) {
            ctx.fillStyle = `hsla(${(shapeColor + (dataArray[i]% 40) /i) % 360}, ${shapeSaturation+5*i}%, ${50}%, ${90}%)`;
            ctx.beginPath();
            ctx.roundRect(Math.floor(WIDTH / 2 - shapeGrowth * i + i), Math.floor(HEIGHT / 2 - shapeGrowth + 2**i - i), Math.floor(shapeGrowth * 2), Math.floor(shapeGrowth * 2), roundnessOutput);
            ctx.roundRect(Math.floor(WIDTH / 2 - shapeGrowth * -i - i), Math.floor(HEIGHT / 2 - shapeGrowth + 2**i - i), Math.floor(shapeGrowth * 2), Math.floor(shapeGrowth * 2), roundnessOutput);
            ctx.fill();
        } else if (modifyState.value == 5) {
            ctx.fillStyle = `hsla(${(shapeColor + dataArray[5*i]%130) % 360}, ${shapeSaturation+5*i}%, ${50}%)`;
            ctx.beginPath();
            ctx.roundRect(Math.floor(WIDTH / 2 - (shapeGrowth +dataArray[i]%400) + 10*i), Math.floor(HEIGHT / 2 - (shapeGrowth +(dataArray[i]%400) + 10*i)), Math.floor((shapeGrowth * 2) + dataArray[i] %100), Math.floor(shapeGrowth * 2 + dataArray[i] %100), roundnessOutput);
            ctx.fill();
        } else {
            ctx.fillStyle = `hsla(${(shapeColor + dataArray[i]%160) % 360}, ${shapeSaturation+5*i}%, ${50}%)`;
            ctx.beginPath();
            ctx.roundRect(Math.floor(WIDTH / 2 - (shapeGrowth) + 10*i), Math.floor(HEIGHT / 2 - (shapeGrowth) + 10*i), Math.floor((shapeGrowth * 2) + dataArray[i] %50), Math.floor(shapeGrowth * 2), roundnessOutput)
            ctx.fill();
        }
    }
}
const xButtonState = {value: 1, max:5};
const yButtonState = {value: 1, max:3};
const modifyState = {value: 1, max:6}
const blendState = {value: 1, max:3}


function changeButtonState(buttonState) {
    if (buttonState.value == buttonState.max) {
        return buttonState.value = 1;
    } else {
        console.log(buttonState)
        return buttonState.value++;
        
    }
}

function changeBlendMode(blendState , ctx){
    if (blendState.value == 1) {
        return ctx.globalCompositeOperation = "source-over"
    } else if (blendState.value == 2) {
        return ctx.globalCompositeOperation = "color-burn"
    } else {
        return ctx.globalCompositeOperation = "difference"
    }
}

function drawShapes (xButtonState, yButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT) {
    repeatInY(yButtonState, xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT);
    //changeBlendMode(blendState, ctx);

}

function repeatInY(yButtonState, xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT) {
    for (let i = 1; i <= yButtonState.value; i++) {
        if (yButtonState.value == 1) {
            RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT);
        } else if (yButtonState.value == 2) {
            if (i == 1) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, ((HEIGHT + HEIGHT / 2) - sizeSliderOutput / 2));
            } else if (i = 2) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, (HEIGHT / 2) - sizeSliderOutput / 2);
            }
        } else if (yButtonState.value == 3) {
            if (i == 1) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, ((HEIGHT + (2 * HEIGHT / 3)) - sizeSliderOutput / 2));
            } else if (i == 3) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, ((HEIGHT / 3) - sizeSliderOutput / 2));
            }
        } 
        changeBlendMode(blendState, ctx);
    } 
}

function RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT) {
    for (let i = 1; i <= xButtonState.value; i++) {
        if (xButtonState.value == 1) {
            drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT);
        } else if (xButtonState.value == 2) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH + (WIDTH / 2) - sizeSliderOutput / 2) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH / 2) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 3) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH + (2 * WIDTH / 3)) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH / 3) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 4) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH + WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 3) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((3 * WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, (WIDTH + (3 * WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 5) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 3) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((WIDTH + (2 * WIDTH) / 5) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 4) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, ((3 * WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, roundnessOutput,  modifyState,  ctx, (WIDTH + (4 * WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            }
        }
    } 
    changeBlendMode(blendState, ctx);
}
