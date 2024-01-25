import fetch from "../include/fetch.js";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

// TODO - Now its your turn to make the working example! :)

/*Our program returns all the meals and their recipes from themealdb.com api based on the
category (beef, seafood, vegetarian), and area (American, Italian, Chinese) choice they choose.
fetchCategory returns an array of all the meals of the chosen category
fetchArea returns an array of all the meals of the chosen area
We then find the intersection of the two arrays, and call fetchMeal on each one, where
we then print out all desired information of each meal
*/

interface dish {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

interface meal {
  strMeal: string;
  strYoutube: string;
}

//returns an array of {strMeal:string, strMealThumb:string, idMeal:string} of category argument
export function fetchCategory(category: string): Promise<dish[]> {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/filter.php");
  url.searchParams.append("c", category);

  return new Promise<dish[]>((resolve, reject) => {
    fetch(url.toString())
      .then((response: Response) => (response.ok ? response.json() : Promise.reject("No results found for query.")))
      .then(data => {
        resolve(data.meals);
      })
      .catch(err => reject(err));
  });
}

//returns an array of {strMeal:string, strMealThumb:string, idMeal:string} of area argument
export function fetchArea(area: string): Promise<dish[]> {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/filter.php");
  url.searchParams.append("a", area);

  return new Promise<dish[]>((resolve, reject) => {
    fetch(url.toString())
      .then((response: Response) => (response.ok ? response.json() : Promise.reject("No results found for query.")))
      .then(data => {
        resolve(data.meals);
      })
      .catch(err => reject(err));
  });
}

//returns the meal name, its instructions, and youtube link give a meal name
export function fetchMeal(name: string): Promise<meal> {
  const url = new URL("https://www.themealdb.com/api/json/v1/1/search.php");
  url.searchParams.append("s", name);

  return new Promise<meal>((resolve, reject) => {
    fetch(url.toString())
      .then((response: Response) => (response.ok ? response.json() : Promise.reject("No results found for query")))
      .then(data => {
        resolve(data.meals);
      })
      .catch(err => reject(err));
  });
}

let category: string = "";
let area: string = "";

const rl = readline.createInterface({ input, output });

//asks user for category and area
rl.question("Would you like beef, seafood, or vegetarian? ", (answer: string) => {
  //checks if answer is valid
  if (answer === "beef" || answer === "seafood" || answer === "vegetarian") {
    category = answer; //set category to input
    console.log(`You have chosen: ${answer}\n`);
    rl.question("American, Italian, or Chinese? ", (answer: string) => {
      //checks if answer is valid
      if (
        answer === "American" ||
        answer === "american" ||
        answer === "Italian" ||
        answer === "italian" ||
        answer === "chinese" ||
        answer === "Chinese"
      ) {
        area = answer; //set area to input
        console.log(`You have chosen: ${answer}\n`);
        rl.close();
      } else {
        //invalid input was given, exits program
        console.log(`I'm sorry, ${answer} is not a valid area!`);
        rl.close();
        return;
      }
    });
  } else {
    //invalid input was given, exits program
    console.log(`I'm sorry, ${answer} is not a valid category!`);
    rl.close();
    return;
  }
});

//Goes through the list of ingredients and their corresponding amounts
function displayMealIngredientsAndAmounts(meal: any) {
  const ingredients: string[] = [];
  const amounts: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}`;
    const amountKey = `strMeasure${i}`;
    const ingredient = meal[0][ingredientKey];
    const amount = meal[0][amountKey];
    if (ingredient && typeof ingredient === "string" && ingredient.trim() !== "") {
      ingredients.push(ingredient);
    } else {
      break;
    }
    if (amount && typeof amount === "string" && amount.trim() !== "") {
      amounts.push(amount);
    } else {
      break;
    }
  }
  //Prints out ingredients->amount
  console.log("Ingredients and their measures:");
  for (let i = 0; i < ingredients.length; i++) {
    console.log(ingredients[i], "->", amounts[i]);
  }
}

rl.on("close", () => {
  let mealsCategory: dish[] = [];
  let mealsArea: dish[] = [];

  const promise = fetchCategory(category);
  const promise1 = fetchArea(area);

  Promise.all([promise, promise1])
    .then(([resultCategory, resultArea]) => {
      mealsCategory = resultCategory;
      mealsArea = resultArea;

      const mealsCategoryArea = mealsCategory.filter(dish1 => mealsArea.some(dish2 => dish2.idMeal === dish1.idMeal));
      const mealNames: string[] = mealsCategoryArea.map((x: dish) => x.strMeal);
      mealNames.forEach(dish => {
        fetchMeal(dish)
          .then((meal: any) => {
            console.log(meal[0].strMeal, "", meal[0].strYoutube, "\n");
            displayMealIngredientsAndAmounts(meal);
            console.log(meal[0].strInstructions, "\n\n\n");
          })
          .catch(error => {
            console.error(error);
          });
      });
    })
    .catch(error => {
      console.error(error);
    });
});
