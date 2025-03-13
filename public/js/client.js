const API_URL = "https://mielle-2dr7.onrender.com";

let selectedSkinType = "";

async function fetchIngredients(skinType) {
    try {
      const response = await fetch(`http://localhost:8000/ingredients/${skinType}`);
      const data = await response.json();
      console.log("Ingredienser for:", skinType, data);
    } catch (error) {
      console.error("Feil ved henting av ingredienser:", error);
    }
  }

document.querySelectorAll(".skinType").forEach(button => {
    button.addEventListener("click", () => {
        selectedSkinType = button.dataset.type;
        document.querySelectorAll(".skinType").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

document.getElementById("checkButton").addEventListener("click", async () => {
    const selectedSkinType = document.querySelector("input[name='skinType']:checked")?.value;
    if (!selectedSkinType) return alert("Please select a skin type!");

    let input = document.getElementById("ingredientInput").value.trim();
    if (!input) return alert("Paste the ingredient list first!");

    const ingredients = input
        .toLowerCase()
        .replace(/[^a-z0-9 ,-/().]/g, "")
        .split(",")
        .map(i => i.trim());

    console.log("Processed Ingredients:", ingredients);

    try {
        const response = await fetch(`https://mielle-2dr7.onrender.com/api/ingredients?skinType=${selectedSkinType}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients })
        });

        const data = await response.json();
        console.log("API Response:", data);

        displayResults(data, ingredients);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});




function displayResults(results, originalIngredients) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const sortedResults = {
        Best: [],
        Good: [],
        Varies: [],
        Avoid: [],
        Unknown: []
    };

    results.forEach(({ name, compatibility, description }) => {
        let category = "Unknown";

        if (Array.isArray(compatibility)) {
            const ratings = compatibility.map(c => c.rating);
            if (ratings.includes("Best")) category = "Best";
            else if (ratings.includes("Good")) category = "Good";
            else if (ratings.includes("Varies")) category = "Varies";
            else if (ratings.includes("Avoid")) category = "Avoid";
        } else {
            category = compatibility || "Unknown";
        }

        sortedResults[category].push({ name, description: description || "No description available" });
    });

    originalIngredients.forEach(ingredient => {
        if (!results.some(r => r.name.toLowerCase() === ingredient.toLowerCase())) {
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

    resultDiv.innerHTML = `
        ${createSection("Best Ingredients", sortedResults.Best, "blue")}
        ${createSection("Good Ingredients", sortedResults.Good, "green")}
        ${createSection("Varies by Skin Type", sortedResults.Varies, "yellow")}
        ${createSection("Avoid", sortedResults.Avoid, "red")}
        ${createSection("No Registered Effect", sortedResults.Unknown, "gray")}
    `;
}
