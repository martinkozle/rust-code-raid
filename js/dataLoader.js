var pins = [];

function createTable(N, K, start) {
    let table = document.getElementById("tablePins");
    let tbody = table.getElementsByTagName("tbody")[0];
    for (const [i, pin] of pins.entries()) {
        if (i + 1 >= start && i % N === K - 1) {
            let tr = document.createElement("tr");
            const checkMark = `<input class="form-check-input btn btn-primary" style="width:100px;height:30px" type="checkbox" value="">`
            tr.innerHTML = `<th scope="row">${i + 1}</th><td>${pin}</td><td>${checkMark}</td>`;
            tbody.appendChild(tr);
        }
    }
}

function getParameters() {

    // Address of the current window
    let address = window.location.search

    // Returns a URLSearchParams object instance
    let parameterList = new URLSearchParams(address)

    // Created a map which holds key value pairs
    let map = new Map()

    // Storing every key value pair in the map
    parameterList.forEach((value, key) => {
        map.set(key, value)
    })

    // Returning the map of GET parameters
    return map
}

function loadData() {
    const params = getParameters()
    const URL = params.get("dataURL");
    const N = parseInt(params.get("numberCodeCrackers") ? params.get("numberCodeCrackers") : "1");
    const K = parseInt(params.get("numberK") ? params.get("numberK") : "1");
    const start = parseInt(params.get("start") ? params.get("start") : "1");
    const delimiter = params.get("delimiter") ? params.get("delimiter") : ",";
    const splitIndex = parseInt(params.get("splitIndex") ? params.get("splitIndex") : "0");
    document.getElementById("numberCodeCrackers").value = N;
    document.getElementById("numberK").value = K;
    document.getElementById("start").value = start;
    document.getElementById("delimiter").value = delimiter;
    document.getElementById("splitIndex").value = splitIndex;
    if (!URL || !URL.match(/^https?:\/\//))
        return;
    document.getElementById("dataURL").value = URL;
    fetch(URL).then(response => {
        if (response.ok)
            return response.text()
        else
            throw new Error(`${response.status} ${response.statusText}`)
    }).then(data =>
        data.split("\n")
            .map(row => row.split(delimiter)[splitIndex])
            .filter(x => x != undefined && x !== "")
    ).then(data => {
        pins = data;
        createTable(N, K, start);
    }).catch(error => {
        console.log(error);
        let alertDanger = document.getElementById("alertDanger");
        let alertText = document.getElementById("alertText");
        alertDanger.hidden = false;
        alertText.innerText = error.message;
    });
}

document.addEventListener("DOMContentLoaded", loadData);
