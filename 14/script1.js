function answer(number) {
  let firstElfIndex = 0,
    secondElfIndex = 1;
  const recipeScores = [3, 7];
  while (recipeScores.length < number + 10) {
    recipeScores.push(
      ...createNewRecipes(
        recipeScores[firstElfIndex] + recipeScores[secondElfIndex]
      )
    );
    firstElfIndex =
      (firstElfIndex + 1 + recipeScores[firstElfIndex]) % recipeScores.length;
    secondElfIndex =
      (secondElfIndex + 1 + recipeScores[secondElfIndex]) % recipeScores.length;
  }

  console.log(recipeScores.slice(number, number + 10).join(""));
}

function createNewRecipes(scoreSum) {
  return scoreSum
    .toString()
    .split("")
    .map(Number);
}

answer(290431);
