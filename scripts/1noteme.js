document.addEventListener("DOMContentLoaded", () => {
    var clipboard = new ClipboardJS('.btn');

    clipboard.on('success', function(e) {
        const copied = document.getElementById("copied");
        copied.style.visibility = "visible";
        setTimeout(() => {
            copied.style.visibility = "hidden";
        }, 1500);

    });
});

const submitLink = (e) => {
    // disable form submit

    const link_input = document.getElementById("links");

    alert("submitted", e);
}

const copied = () => {

}