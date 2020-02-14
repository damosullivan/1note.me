
document.addEventListener("DOMContentLoaded", () => {
    var clipboard = new ClipboardJS('.btn');

    // TODO: on success, say copied
});

const submitLink = (e) => {
    // disable form submit

    const link_input = document.getElementById("links");

    alert("submitted", e);
}