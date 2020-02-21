document.addEventListener("DOMContentLoaded", () => {
    var clipboard = new ClipboardJS('.btn');

    clipboard.on('success', function (e) {
        const copied = document.getElementById("copied");
        copied.style.visibility = "visible";
        setTimeout(() => {
            copied.style.visibility = "hidden";
        }, 1500);

    });
});

const submitLink = async () => {

    document.getElementById("succeeded").style.visibility = "hidden"

    const link = document.getElementById("link").value;
    const data = "link=" + encodeURIComponent(link); // just like a HTTP form
    fetch(window.location.href.split('?')[0] + ".netlify/functions/new", {
        method: "post",
        body: data
    })
        .then(async res => {
            const data = await res.text();
            if (res.status === 200) {
                return data;
            }
            throw new Error(data);
        })
        .then(data => {
            document.getElementById("new-link").value = data;
            document.getElementById("copy-button").disabled = false;
            const succeeded = document.getElementById("succeeded")
            succeeded.textContent = data;
            succeeded.href = data;
            succeeded.style.visibility = "visible";
        })
        .catch(err => {
            const errored = document.getElementById("errored");
            errored.textContent = err;
            errored.style.visibility = "visible";
        });

    return false;
}

const clearError = () => {
    document.getElementById("errored").style.visibility = "hidden";
}