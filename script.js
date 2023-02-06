
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

        const WIDTH = canvas.width
        const HEIGHT = canvas.height;
        const barWidth = (WIDTH / bufferLength) * 1.5

        let barHeight;


        
        function renderFrame() {
            requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgba(0,0,0,0.08)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            let bars = 36;

            for (let i = 0; i < bars; i++) {
                barHeight = (dataArray[i] * 2);

                ctx.fillStyle = `rgb(${i*10}, ${barHeight}, ${barHeight*2%200})`;
                ctx.fillRect(barHeight*3, barWidth + barHeight, barHeight, barHeight);
                
            }
        }
        audio.play();
        renderFrame();
    }
}


