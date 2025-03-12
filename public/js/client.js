document.getElementById("checkButton").addEventListener("click", async () => {
    const input = document.getElementById("ingredientInput").value.trim();
    if (!input) return alert("Lim inn ingredienslisten først!");

    const ingredients = input.split(",").map(i => i.trim());

    const response = await fetch("https://din-api-url.onrender.com/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients })
    });

    const data = await response.json();
    displayResults(data);
});

function displayResults(results) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    results.forEach(({ name, compatibility, description }) => {
        const div = document.createElement("div");
        div.classList.add("ingredient");

        if (compatibility === "Grønn") div.classList.add("green");
        else if (compatibility === "Blå") div.classList.add("blue");
        else if (compatibility === "Gul") div.classList.add("yellow");
        else if (compatibility === "Rød") div.classList.add("red");

        div.innerHTML = `<strong>${name}</strong>: ${compatibility} <br> ${description}`;
        resultDiv.appendChild(div);
    });
}
