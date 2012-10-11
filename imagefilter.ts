module ImageFilter {
	// filter process
	export function filter(canvas : HTMLCanvasElement, filterType : string) : void{
		switch(filterType){
			case "grayscale" :
				grayscaleFilter(canvas);
				break;
			case "sepia" :
				sepiaFilter(canvas);
				break;
			case "negative" :
				negativeFilter(canvas);
				break;
			case "mosaic" :
				mosaicFilter(canvas, false);
				break;
			case "mosaicGray" :
				mosaicFilter(canvas, true);
				break;
		}
	}

	// swap image process
	export function swapImage(imageName : string, canvas : HTMLCanvasElement, callback:any) : void {
		var img = loadImage(imageName);
		img.onload = function(){
			canvas.width = img.width;
			canvas.height = img.height;

			var context = canvas.getContext("2d");
			context.drawImage(img, 0, 0, img.width, img.height);

			callback();
		};
	}

	// load image process
	function loadImage(imageName : string) : HTMLImageElement {
		var img = new Image();
		img.src = imageName;
		return img;
	}

	// grayscale filter process
	function grayscaleFilter(canvas : HTMLCanvasElement) : void {
		var context = canvas.getContext("2d");
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var len = imageData.data.length;
		var r, g, b, gray;
		for(var i = 0; i < len; i+=4){
			r = imageData.data[i];
			g = imageData.data[i+1];
			b = imageData.data[i+2];
			gray = 0.299 * r + 0.587 * g + 0.114 * b;

			imageData.data[i] = gray;
			imageData.data[i+1] = gray;
			imageData.data[i+2] = gray;
		}
		context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
	}

	// sepia filter process
	function sepiaFilter(canvas : HTMLCanvasElement) : void {
		var context = canvas.getContext("2d");
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var len = imageData.data.length;
		var r, g, b, sepia;
		for(var i = 0; i < len; i+=4){
			r = imageData.data[i];
			g = imageData.data[i+1];
			b = imageData.data[i+2];
			sepia = 0.299 * r + 0.587 * g + 0.114 * b;

			imageData.data[i] = sepia/255*240;
			imageData.data[i+1] = sepia/255*200;
			imageData.data[i+2] = sepia/255*145;
		}
		context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
	}

	// negative filter process
	function negativeFilter(canvas : HTMLCanvasElement) : void {
		var context = canvas.getContext("2d");
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var len = imageData.data.length;
		var r, g, b;
		for(var i = 0; i < len; i+=4){
			r = imageData.data[i];
			g = imageData.data[i+1];
			b = imageData.data[i+2];

			imageData.data[i] = 255 - r;
			imageData.data[i+1] = 255 - g;
			imageData.data[i+2] = 255 - b;
		}
		context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
	}

	// mosaic filter process
	function mosaicFilter(canvas : HTMLCanvasElement, isGray : bool) : void {
		var context = canvas.getContext("2d");
		var dot = 8;
		var w = canvas.width / dot;
		var h = canvas.height / dot;
		var px, py;
		var gray;
		for(var x = 0; x < w; x++){
			for(var y = 0; y < h; y++){
				px = x * dot;
				py = y * dot;

				var color = getAverageColor(context, px, py, dot);
				if(isGray){
					gray = (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) | 0;
					context.fillStyle = "rgb(" + gray + "," + gray + "," + gray + ")";
				}else{
					context.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
				}
				context.fillRect(px, py, dot, dot);
			}
		}
	}

	function getAverageColor(context : CanvasRenderingContext2D, px : number, py : number, dot : number) : any {
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
		return [r/len | 0, g/len | 0, b/len | 0];
	}
}

window.onload = function(){
	var canvas = <HTMLCanvasElement>document.getElementById("stage");
	var imageSelector = <HTMLSelectElement>document.getElementById("imageSelector");
	var filterSelector = <HTMLSelectElement>document.getElementById("filterSelector");
	var filterButton = <HTMLButtonElement>document.getElementById("filterButton");

	var lockFunc = function(){
		filterButton.disabled = true;
	};
	var unlockFunc = function(){
		filterButton.disabled = false;
	};

	// filter process event
	filterButton.addEventListener("click", (e) => {
		var start = new Date();

		var filterType = this.filterSelector.options[filterSelector.selectedIndex].value;
		ImageFilter.filter(canvas, filterType);

		var end = new Date();
		var executionTime = end.getTime() - start.getTime();
		console.log(executionTime);

		var calcTime = <HTMLDivElement>document.getElementById("execTime");
		calcTime.innerHTML = "execution time is " + executionTime + "ms";
	});
	// image changed event
	imageSelector.addEventListener("change", function(e) {
		lockFunc();
		var imageName = this.options[this.selectedIndex].value;
		ImageFilter.swapImage(imageName, canvas, unlockFunc);
	});

	lockFunc();
	ImageFilter.swapImage(this.imageSelector.options[0].value, canvas, unlockFunc);
}
