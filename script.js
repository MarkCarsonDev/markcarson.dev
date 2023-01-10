window.onload = function () {
    const textElement = document.getElementById("cycle2");
    const textArray = JSON.parse(textElement.dataset.states);
    let currentTextIndex = 0;
    textElement.style.transform = "scaleY(0)";

    textElement.addEventListener('transitionend', function(){
        setTimeout(function(){
            textElement.style.transform = "scaleY(0)";
            textElement.style.transformOrigin = "top"

            currentTextIndex = currentTextIndex + 1 >= textArray.length ? 0 : currentTextIndex + 1;
            textElement.textContent = textArray[currentTextIndex];

            textElement.style.transform = "scaleY(1)";
            textElement.style.transformOrigin = "bottom"
        }, 2000)
    });


}