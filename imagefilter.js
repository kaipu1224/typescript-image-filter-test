var ImageFilter;
(function (ImageFilter) {
    function filter(canvas, filterType) {
        switch(filterType) {
            case "grayscale": {
                grayscaleFilter(canvas);
                break;

            }
            case "sepia": {
                sepiaFilter(canvas);
                break;

            }
            case "negative": {
                negativeFilter(canvas);
                break;

            }
            case "mosaic": {
                mosaicFilter(canvas, false);
                break;

            }
            case "mosaicGray": {
                mosaicFilter(canvas, true);
                break;

            }
        }
    }
    ImageFilter.filter = filter;
    function swapImage(imageName, canvas, callback) {
        var img = loadImage(imageName);
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0, img.width, img.height);
            callback();
        };
    }
    ImageFilter.swapImage = swapImage;
    function loadImage(imageName) {
        var img = new Image();
        img.src = imageName;
        return img;
    }
    function grayscaleFilter(canvas) {
        var context = canvas.getContext("2d");
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var len = imageData.data.length;
        var r;
        var g;
        var b;
        var gray;

        for(var i = 0; i < len; i += 4) {
            r = imageData.data[i];
            g = imageData.data[i + 1];
            b = imageData.data[i + 2];
            gray = 0.299 * r + 0.587 * g + 0.114 * b;
            imageData.data[i] = gray;
            imageData.data[i + 1] = gray;
            imageData.data[i + 2] = gray;
        }
        context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    }
    function sepiaFilter(canvas) {
        var context = canvas.getContext("2d");
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var len = imageData.data.length;
        var r;
        var g;
        var b;
        var sepia;

        for(var i = 0; i < len; i += 4) {
            r = imageData.data[i];
            g = imageData.data[i + 1];
            b = imageData.data[i + 2];
            sepia = 0.299 * r + 0.587 * g + 0.114 * b;
            imageData.data[i] = sepia / 255 * 240;
            imageData.data[i + 1] = sepia / 255 * 200;
            imageData.data[i + 2] = sepia / 255 * 145;
        }
        context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    }
    function negativeFilter(canvas) {
        var context = canvas.getContext("2d");
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var len = imageData.data.length;
        var r;
        var g;
        var b;

        for(var i = 0; i < len; i += 4) {
            r = imageData.data[i];
            g = imageData.data[i + 1];
            b = imageData.data[i + 2];
            imageData.data[i] = 255 - r;
            imageData.data[i + 1] = 255 - g;
            imageData.data[i + 2] = 255 - b;
        }
        context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    }
    function mosaicFilter(canvas, isGray) {
        var context = canvas.getContext("2d");
        var dot = 8;
        var w = canvas.width / dot;
        var h = canvas.height / dot;
        var px;
        var py;

        var gray;
        for(var x = 0; x < w; x++) {
            for(var y = 0; y < h; y++) {
                px = x * dot;
                py = y * dot;
                var color = getAverageColor(context, px, py, dot);
                if(isGray) {
                    gray = (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) | 0;
                    context.fillStyle = "rgb(" + gray + "," + gray + "," + gray + ")";
                } else {
                    context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
                }
                context.fillRect(px, py, dot, dot);
            }
        }
    }
    function getAverageColor(context, px, py, dot) {
        var imageData = context.getImageData(px, py, dot, dot);
        var len = imageData.data.length / 4;
        var r = 0;
        var g = 0;
        var b = 0;
        for(var i = 0; i < len; i++) {
            r += imageData.data[i * 4];
            g += imageData.data[i * 4 + 1];
            b += imageData.data[i * 4 + 2];
        }
        return [
            r / len | 0, 
            g / len | 0, 
            b / len | 0
        ];
    }
})(ImageFilter || (ImageFilter = {}));

