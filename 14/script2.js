function answer(searchString) {
  let firstElfIndex = 0,
    secondElfIndex = 1;
  const recipeScores = [3, 7];
  outside: while (true) {
    const newRecipes = createNewRecipes(
      recipeScores[firstElfIndex] + recipeScores[secondElfIndex]
    );
    recipeScores.push(...newRecipes);
    firstElfIndex =
      (firstElfIndex + 1 + recipeScores[firstElfIndex]) % recipeScores.length;
    secondElfIndex =
      (secondElfIndex + 1 + recipeScores[secondElfIndex]) % recipeScores.length;

    for (let shift = 0; shift < newRecipes.length; shift++) {
      let index = recipeScores.length - shift - searchString.length;
      if (recipeScores.slice(index, index + searchString.length).join("") === searchString) {
        console.log(index);
        break outside;
      }
    }
  }
}

function createNewRecipes(scoreSum) {
  return scoreSum
    .toString()
    .split("")
    .map(Number);
}

answer("51589");
answer("01245");
answer("92510");
answer("59414");
answer("290431");
