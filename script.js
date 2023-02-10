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

        const sizeSlider = document.getElementById("sliderSize");
        const colourSlider = document.getElementById("sliderColour");
        const attenuator = document.getElementById("attenuator");
        const attenuatorBars = document.getElementById("attenuatorBars")

        
        function renderFrame() {

            let sizeSliderOutput = sizeSlider.value;
            let colourSliderOutput = colourSlider.value;
            let attenuatorOutput = attenuator.value/20;
            let barsOutput = attenuatorBars.value

            requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput, ctx, WIDTH, HEIGHT)
            drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput+60, ctx, WIDTH/2, HEIGHT);
            drawRectangle(barsOutput, dataArray, attenuatorOutput, sizeSliderOutput, colourSliderOutput+20, ctx, WIDTH/0.65, HEIGHT);
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

