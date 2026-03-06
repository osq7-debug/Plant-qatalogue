/// HOMEPAGEN READ MORE NAPPI///

const nappi = document.getElementById("Lisaa");
const extraText = document.getElementById("extra-text");

nappi.addEventListener("click", function () {

    extraText.classList.toggle("show");

    if (extraText.classList.contains("show")) {
        nappi.textContent = "Read Less";
    } else {
        nappi.textContent = "Read More";
    }

});