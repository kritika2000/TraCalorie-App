class AddItem {
  constructor(type, name, calories, listElem) {
    // Creating Elements
    const listItem = document.createElement('li');
    const itemName = document.createElement('p');
    const itemCalories = document.createElement('p');
    const button = document.createElement('button');
    // Setting Attributes
    listItem.setAttribute('class', `${type}-item`);
    itemName.setAttribute('class', `${type}`);
    itemCalories.setAttribute('class', `calorie`);
    button.setAttribute('class', `${type}-item-remove-btn`);
    itemName.textContent = name;
    itemCalories.textContent = calories;
    // Append Elements
    button.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    listItem.appendChild(itemName);
    listItem.appendChild(itemCalories);
    listItem.appendChild(button);
    listElem.appendChild(listItem);
  }
}

class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }

  // Public Methods/API
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
    this._displayNewMeal(meal);
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
    this._displayNewWorkout(workout);
  }

  // Private Methods/API
  _displayCaloriesTotal() {
    const totalCalories = document.querySelector('.gain-loss-text');
    const gainLoss = document.querySelector('.gain-loss');
    totalCalories.textContent = this._totalCalories;
    gainLoss.style.backgroundColor = this._totalCalories < 0 && 'red';
  }
  _displayCaloriesLimit() {
    const calorieLimit = document.querySelector('.calorie-limit-text');
    calorieLimit.textContent = this._calorieLimit;
  }
  _displayCaloriesConsumed() {
    const caloriesConsumed = document.querySelector('.calories-consumed-text');
    const consumed = this._meals.reduce((acc, meal) => acc + meal.calories, 0);
    caloriesConsumed.textContent = consumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurned = document.querySelector('.calories-burned-text');
    const burned = this._workouts.reduce(
      (acc, workout) => acc + workout.calories,
      0
    );
    caloriesBurned.textContent = burned;
  }
  _displayCaloriesRemaining() {
    const caloriesRemaining = document.querySelector(
      '.calories-remaining-text'
    );
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemaining.textContent = remaining;
    remaining >= 0
      ? caloriesRemaining.parentElement.classList.remove('danger')
      : !caloriesRemaining.parentElement.classList.contains('danger') &&
        caloriesRemaining.parentElement.classList.add('danger');
  }
  _displayCaloriesProgress() {
    const progressBar = document.querySelector('.bar-progress');
    const barWidth =
      this._totalCalories < 0
        ? 0
        : Math.min((this._totalCalories / this._calorieLimit) * 100, 100);
    const remaining = this._calorieLimit - this._totalCalories;
    progressBar.style.width = `${barWidth}%`;
    remaining < 0
      ? progressBar.classList.remove('success')
      : !progressBar.classList.contains('success') &&
        progressBar.classList.add('success');
  }
  _displayNewMeal(meal) {
    const mealList = document.querySelector('.meal-list');
    new AddItem('meal', meal.name, meal.calories, mealList);
  }
  _displayNewWorkout(workout) {
    const workoutList = document.querySelector('.workout-list');
    new AddItem('workout', workout.name, workout.calories, workoutList);
  }
  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

// Meal Class Represents each meal we add in the list.
class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

// Workout Class Represents each workout we add in the list.
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document
      .querySelector('.meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));
    document
      .querySelector('.workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));
    document
      .querySelector('.add-meal-btn')
      .addEventListener('click', this._toggleForm);
    document
      .querySelector('.add-workout-btn')
      .addEventListener('click', this._toggleForm);
  }
  _toggleForm(e) {
    const form = e.target.parentElement.nextElementSibling;
    form.classList.toggle('hide');
  }
  _newItem(type, e) {
    e.preventDefault();
    const name = document.querySelector(`.${type}-form input:nth-child(1)`);
    const calories = document.querySelector(`.${type}-form input:nth-child(2)`);
    if (name.value === '') {
      alert('Please fill all fields');
      return;
    }
    if (calories.value === '') {
      alert('Please fill all fields');
      return;
    }
    if (type === 'meal') {
      const item = new Meal(name.value, Number(calories.value));
      this._tracker.addMeal(item);
    } else {
      const item = new Workout(name.value, Number(calories.value));
      this._tracker.addWorkout(item);
    }
    e.target.classList.add('hide');
    name.value = '';
    calories.value = '';
  }
}

const app = new App();
