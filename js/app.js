class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
    this._displayAllMeals();
    this._displayAllWorkouts();
  }

  // Public Methods/API
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.setTotalCalories(this._totalCalories);
    Storage.setMeals(this._meals);
    this._render();
    this._displayNewMeal(meal);
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.setTotalCalories(this._totalCalories);
    Storage.setWorkouts(this._workouts);
    this._render();
    this._displayNewWorkout(workout);
  }
  removeMeal(item) {
    console.log(this._meals);
    this._meals = this._meals.filter((meal) => {
      if (meal.id === item.getAttribute('id')) {
        this._totalCalories -= meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeMeal(meal);
      }
      return meal.id !== item.getAttribute('id');
    });
    item.remove();
    this._render();
  }
  removeWorkout(item) {
    this._workouts = this._workouts.filter((workout) => {
      if (workout.id === item.getAttribute('id')) {
        this._totalCalories += workout.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeWorkout(workout);
      }
      return workout.id !== item.getAttribute('id');
    });
    item.remove();
    this._render();
  }
  reset() {
    this._calorieLimit = 2000;
    Storage.setCalorieLimit(2000);
    this._totalCalories = 0;
    Storage.setTotalCalories(0);
    this._meals = [];
    Storage.setMeals([]);
    this._workouts = [];
    Storage.setWorkouts([]);
    this._displayCaloriesLimit();
    this._render();
    document.querySelector('.meal-list').innerHTML = '';
    document.querySelector('.workout-list').innerHTML = '';
  }
  setLimit(limit) {
    this._calorieLimit = limit;
    this._displayCaloriesLimit();
    this._render();
  }
  // Private Methods/API
  _displayCaloriesTotal() {
    const totalCalories = document.querySelector('.gain-loss-text');
    const gainLoss = document.querySelector('.gain-loss');
    totalCalories.textContent = this._totalCalories;
    gainLoss.style.backgroundColor =
      this._totalCalories < 0 ? 'red' : '#599f3d';
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
    this._addNewItem('meal', meal, mealList);
  }
  _displayNewWorkout(workout) {
    const workoutList = document.querySelector('.workout-list');
    this._addNewItem('workout', workout, workoutList);
  }
  _displayAllMeals() {
    const mealList = document.querySelector('.meal-list');
    this._meals.forEach((meal) => {
      this._addNewItem('meal', meal, mealList);
    });
  }
  _displayAllWorkouts() {
    const workoutList = document.querySelector('.workout-list');
    this._workouts.forEach((workout) => {
      this._addNewItem('workout', workout, workoutList);
    });
  }
  _addNewItem(type, { id, name, calories }, listElem) {
    // Creating Elements
    const listItem = document.createElement('li');
    const itemName = document.createElement('p');
    const itemCalories = document.createElement('p');
    const button = document.createElement('button');
    // Setting Attributes
    listItem.setAttribute('id', id);
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
    document
      .querySelector('.meal-list')
      .addEventListener('click', this._removeItem.bind(this));
    document
      .querySelector('.workout-list')
      .addEventListener('click', this._removeItem.bind(this));
    document
      .querySelector('#filter-meals')
      .addEventListener('input', this._filterItems.bind(this, 'meal'));
    document
      .querySelector('#filter-workouts')
      .addEventListener('input', this._filterItems.bind(this, 'workout'));
    document
      .querySelector('.reset-day-btn')
      .addEventListener('click', this._resetDay.bind(this));
    document
      .querySelector('.set-daily-limit-btn')
      .addEventListener('click', this._setDailyLimit.bind(this));
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
  _removeItem(e) {
    if (e.target.nodeName !== 'I') return;
    const listItem = e.target.parentElement.parentElement;
    listItem.classList.contains('meal-item')
      ? this._tracker.removeMeal(listItem)
      : this._tracker.removeWorkout(listItem);
  }
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    const items = document.querySelector(`.${type}-list`).children;
    Array.from(items).forEach((item) => {
      const itemName = item.firstElementChild.textContent.toLowerCase();
      item.style.display = !itemName.includes(text) ? 'none' : 'grid';
    });
  }
  _resetDay() {
    this._tracker.reset();
  }
  _setDailyLimit() {
    const dialog = document.querySelector('.set-daily-limit-dialog');
    dialog.classList.remove('hide');
    document.querySelector('#set-limit-btn').addEventListener('click', (e) => {
      const limit = document.querySelector('#daily-limit').value;
      if (limit === '') {
        alert('Please enter a value');
        return;
      }
      e.preventDefault();
      this._tracker.setLimit(limit);
      dialog.classList.add('hide');
    });
    document
      .querySelector('#close-dialog-btn')
      .addEventListener('click', (e) => {
        e.preventDefault();
        dialog.classList.add('hide');
      });
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    return localStorage.getItem('calorieLimit') === null
      ? defaultLimit
      : Number(localStorage.getItem('calorieLimit'));
  }
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }
  static getTotalCalories(defaultCalories = 0) {
    return localStorage.getItem('totalCalories') === null
      ? defaultCalories
      : Number(localStorage.getItem('totalCalories'));
  }
  static setTotalCalories(totalCalories) {
    localStorage.setItem('totalCalories', totalCalories);
  }
  static getMeals() {
    return localStorage.getItem('meals') === null
      ? []
      : JSON.parse(localStorage.getItem('meals'));
  }
  static setMeals(meals) {
    localStorage.setItem('meals', JSON.stringify(meals));
  }
  static removeMeal(meal) {
    let meals = JSON.parse(localStorage.getItem('meals'));
    meals = meals.filter((m) => {
      return m.id !== meal.id;
    });
    this.setMeals(meals);
  }
  static getWorkouts() {
    return localStorage.getItem('workouts') === null
      ? []
      : JSON.parse(localStorage.getItem('workouts'));
  }
  static setWorkouts(workouts) {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }
  static removeWorkout(workout) {
    let workouts = JSON.parse(localStorage.getItem('workouts'));
    workouts = workouts.filter((w) => w.id !== workout.id);
    this.setWorkouts(workouts);
  }
}

const app = new App();
