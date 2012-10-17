/// <reference path="imagefilter.ts" />

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