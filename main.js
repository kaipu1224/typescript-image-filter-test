window.onload = function () {
    var _this = this;
    var canvas = document.getElementById("stage");
    var imageSelector = document.getElementById("imageSelector");
    var filterSelector = document.getElementById("filterSelector");
    var filterButton = document.getElementById("filterButton");
    var lockFunc = function () {
        filterButton.disabled = true;
    };
    var unlockFunc = function () {
        filterButton.disabled = false;
    };
    filterButton.addEventListener("click", function (e) {
        var start = new Date();
        var filterType = _this.filterSelector.options[filterSelector.selectedIndex].value;
        ImageFilter.filter(canvas, filterType);
        var end = new Date();
        var executionTime = end.getTime() - start.getTime();
        console.log(executionTime);
        var calcTime = document.getElementById("execTime");
        calcTime.innerHTML = "execution time is " + executionTime + "ms";
    });
    imageSelector.addEventListener("change", function (e) {
        lockFunc();
        var imageName = this.options[this.selectedIndex].value;
        ImageFilter.swapImage(imageName, canvas, unlockFunc);
    });
    lockFunc();
    ImageFilter.swapImage(this.imageSelector.options[0].value, canvas, unlockFunc);
};
