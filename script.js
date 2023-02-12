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
        analyser.fftSize = 64;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        console.log(dataArray)

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const xRepeatButton = document.querySelector("#xRepeatButton");
        xRepeatButton.addEventListener('click', () => {changeButtonStateX(xButtonState)});
        const yRepeatButton = document.querySelector("#yRepeatButton");
        yRepeatButton.addEventListener('click', () => {changeButtonStateY(yButtonState)});

        const sizeSlider = document.getElementById("sliderSize");
        const colourSlider = document.getElementById("sliderColour");
        const attenuator = document.getElementById("attenuator");
        const attenuatorBars = document.getElementById("attenuatorBars");
        const fadeTime = document.getElementById("fadeTime")
        
        function renderFrame() {

            let sizeSliderOutput = sizeSlider.value;
            let colourSliderOutput = colourSlider.value;
            let attenuatorOutput = attenuator.value/20;
            let barsOutput = attenuatorBars.value;
            let fadeTimeOutput = (fadeTime.value)/100;

            requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = `rgba(0,0,0,${fadeTimeOutput})`;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            drawShapes (xButtonState, yButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT)
        }
        audio.play();
        renderFrame();
    }
}
function drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT) {
    for (let i = 0; i < barsOutput; i++) {
        shapeGrowth = (dataArray[i] * attenuatorOutput + (sizeSliderOutput * 1.7));
        shapeColor = (colourSliderOutput);
        shapeSaturation = (30 + attenuatorOutput + (dataArray[i]) % 50);

        ctx.fillStyle = `hsl(${(shapeColor + shapeSaturation) % 360}, ${shapeSaturation}%, ${50}%)`;
        ctx.fillRect(WIDTH / 2 - shapeGrowth, HEIGHT / 2 - shapeGrowth, shapeGrowth * 1.5, shapeGrowth * 1.5);
    }
    return shapeGrowth;
}
const xButtonState = {value: 1};
function changeButtonStateX(initialButtonState) {
    if (initialButtonState.value == 5) {
        return initialButtonState.value = 1;
    } else {
        return initialButtonState.value++;
    }
}
const yButtonState = {value: 1};
function changeButtonStateY(initialButtonState) {
    if (initialButtonState.value == 3) {
        return initialButtonState.value = 1;
    } else {
        return initialButtonState.value++;
    }
}

function drawShapes (xButtonState, yButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT) {
    for (let i = 1 ; i <= yButtonState.value; i++) {
        if (yButtonState.value == 1) {
            RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT);
        } else if(yButtonState.value == 2) {
            if(i == 1) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, ((HEIGHT + HEIGHT / 2) - sizeSliderOutput / 2));
            } else if (i = 2) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, (HEIGHT / 2) - sizeSliderOutput / 2);
            }
        } else if (yButtonState.value == 3) {
            if (i == 1) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, ((HEIGHT + (2 * HEIGHT / 3)) - sizeSliderOutput / 2));
            } else if (i == 3) {
                RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, ((HEIGHT /3) - sizeSliderOutput /2))
            }

        }
    }
}

function RepeatInX(xButtonState, barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT) {
    for (let i = 1; i <= xButtonState.value; i++) {
        if (xButtonState.value == 1) {
            drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT);
        } else if (xButtonState.value == 2) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH + (WIDTH / 2) - sizeSliderOutput / 2) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH / 2) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 3) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH + (2 * WIDTH / 3)) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH / 3) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 4) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH + WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 3) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((3 * WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, (WIDTH + (3 * WIDTH / 4) - sizeSliderOutput / 2), HEIGHT);
            }
        } else if (xButtonState.value == 5) {
            if (i == 1) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT);
            } else if (i == 2) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 3) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((WIDTH + (2 * WIDTH) / 5) - sizeSliderOutput / 2), HEIGHT);
            } else if (i == 4) {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, ((3 * WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            } else {
                drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, (WIDTH + (4 * WIDTH / 5) - sizeSliderOutput / 2), HEIGHT);
            }
        }
    }
}
