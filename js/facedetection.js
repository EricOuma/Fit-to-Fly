// You have to call delete method of cv.Mat to free memory allocated in Emscripten's heap. Please refer to Memory management of Emscripten for details.
function detect_face(isStreaming) {
    let canvasOutput = document.getElementById("cvOutput");
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat();
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();
    
    // load pre-trained classifiers
    classifier.load('haarcascade_frontalface_default.xml');
    
    const FPS = 30;
    function processVideo() {
    try {
        if (!isStreaming) {
            // clean and stop.
            console.log("Clean and Stop");
            src.delete();
            dst.delete();
            gray.delete();
            faces.delete();
            classifier.delete();
            return;
        }
        let begin = Date.now();
        // start processing.
        cap.read(src);
        src.copyTo(dst);
        cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        // detect faces.
        classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
        console.log("start processing");
        // draw faces.
        for (let i = 0; i < faces.size(); ++i) {
            let face = faces.get(i);
            let point1 = new cv.Point(face.x, face.y);
            let point2 = new cv.Point(face.x + face.width, face.y + face.height);
            cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
        }
        cv.imshow('cvOutput', dst);
        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    } catch (file) {
        console.log("Error: ",file)
        //utils.printError(err);
    }
    };
    
    // schedule the first one.
    setTimeout(processVideo, 0);
}
