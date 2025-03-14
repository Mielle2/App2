const API_URL = "https://mielle-2dr7.onrender.com";

document.querySelector("input[name='skinType']").checked = true;

async function fetchIngredients(skinType) {
    try {
        const response = await fetch(`${API_URL}/api/ingredients?skinType=${skinType}`);
        const data = await response.json();
        console.log("Ingredienser for:", skinType, data);
    } catch (error) {
        console.error("Feil ved henting av ingredienser:", error);
    }
}

document.getElementById("checkButton").addEventListener("click", async () => {
    const selectedSkinType = document.querySelector("input[name='skinType']:checked")?.value;
    if (!selectedSkinType) return alert("Please select a skin type!");

    let input = document.getElementById("ingredientInput").value.trim();
    if (!input) return alert("Paste the ingredient list first!");

    const ingredients = input
    .toLowerCase()
    .replace(/[^a-z0-9 ,-/().\n]/g, "")
    .split(/[\n,]+/)
    .map(i => i.trim())
    .filter(i => i.length > 0);
    
    console.log("Processed Ingredients:", ingredients);

    try {
        const response = await fetch(`${API_URL}/api/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients, skinType: selectedSkinType })
        });
    
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unknown error from server");
    
        console.log("🔥 API Response:", data);
        displayResults(data, ingredients);
    } catch (error) {
        console.error("🔥 Error fetching data:", error);
        alert(`Error: ${error.message}`);
    }
    
});

document.querySelectorAll(".skinType").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".skinType").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

function displayResults(results, originalIngredients) {
    console.log("🔥 Results received in displayResults:", results);
    console.log("🔥 Original ingredients:", originalIngredients);

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const sortedResults = {
        Best: [],
        Good: [],
        Varies: [],
        Avoid: [],
        Unknown: []
    };

    results.forEach(({ name, rating, description }) => {
        console.log("🔥 Processing ingredient:", name, "with rating:", rating);

        let category = "Unknown";
    
        if (rating === "Best") category = "Best";
        else if (rating === "Good") category = "Good";
        else if (rating === "Varies") category = "Varies";
        else if (rating === "Avoid") category = "Avoid";
    
        sortedResults[category].push({ name, description: description || "No description available" });
    });

    originalIngredients.forEach(ingredient => {
        if (!results.some(r => r.name.toLowerCase() === ingredient.toLowerCase())) {
            console.warn("🔥 Missing from results:", ingredient);
            sortedResults.Unknown.push({ name: ingredient, description: "No data found in database" });
        }
    });

    function createSection(title, items, colorClass) {
        if (items.length === 0) return "";

        let sectionHTML = `<h3 class="${colorClass}">${title}</h3><ul>`;
        items.forEach(({ name, description }) => {
            sectionHTML += `<li><strong>${name}</strong>: ${description}</li>`;
        });
        sectionHTML += `</ul>`;
        return sectionHTML;
    }

    console.log("🔥 Final sorted results:", sortedResults);

    resultDiv.innerHTML = `
        ${createSection("Best Ingredients", sortedResults.Best, "blue")}
        ${createSection("Good Ingredients", sortedResults.Good, "green")}
        ${createSection("Varies by Skin Type", sortedResults.Varies, "yellow")}
        ${createSection("Avoid", sortedResults.Avoid, "red")}
        ${createSection("No Registered Effect", sortedResults.Unknown, "gray")}
    `;
}

