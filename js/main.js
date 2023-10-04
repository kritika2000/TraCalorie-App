const root = document.getElementById('root');

function openDialog(e) {
  e.stopPropagation();
  const dialog = document.querySelector('.set-daily-limit-dialog');
  dialog.classList.add('show');
  root.style.backgroundColor = '#f3f3f3';
  root.style.opacity = '0.4';
  dialog.style.zIndex = 1;
  const form = document.querySelector('.set-daily-limit-dialog form');
  const input = document.querySelector('.set-daily-limit-dialog input');
  const setLimitBtn = document.querySelector(
    '.set-daily-limit-dialog .btn-container button:first-child'
  );
  const closeDialogBtn = document.querySelector(
    '.set-daily-limit-dialog .btn-container button:last-child'
  );
  setLimitBtn.addEventListener('click', (e) => setDailyLimit(e, input.value));
  closeDialogBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDialog();
  });
  form.addEventListener('click', (e) => e.stopPropagation());
  input.addEventListener('click', (e) => e.stopPropagation());
}

function closeDialog() {
  const dialog = document.querySelector('.set-daily-limit-dialog');
  dialog.classList.remove('show');
  root.style.backgroundColor = '#FFF';
  root.style.opacity = '1';
}

function setDailyLimit(e, value) {
  e.stopPropagation();
  e.preventDefault();
  const calorieLimit = document.querySelector('.calorie-limit-text');
  const gainLoss = document.querySelector('.gain-loss-text');
  const caloriesConsumed = document.querySelector('.calories-consumed-text');
  const caloriesRemaining = document.querySelector('.calories-remaining-text');
  const caloriesBurnt = document.querySelector('.calories-burned-text');

  calorieLimit.textContent = value;
  gainLoss.textContent = 0;
  caloriesConsumed.textContent = 0;
  caloriesBurnt.textContent = 0;
  caloriesRemaining.textContent = value;
  closeDialog();
}

function resetDailyLimit() {
  const calorieLimit = document.querySelector('.calorie-limit-text');
  const gainLoss = document.querySelector('.gain-loss-text');
  const caloriesConsumed = document.querySelector('.calories-consumed-text');
  const caloriesRemaining = document.querySelector('.calories-remaining-text');
  const caloriesBurnt = document.querySelector('.calories-burned-text');

  calorieLimit.textContent = 2000;
  gainLoss.textContent = 0;
  caloriesConsumed.textContent = 0;
  caloriesBurnt.textContent = 0;
  caloriesRemaining.textContent = 2000;
}

function init() {
  const setDailyLimitBtn = document.querySelector('.set-daily-limit-btn');
  const resetBtn = document.querySelector('.reset-day-btn');
  setDailyLimitBtn.addEventListener('click', openDialog);
  document.body.addEventListener('click', closeDialog);
  resetBtn.addEventListener('click', resetDailyLimit);
}

document.addEventListener('DOMContentLoaded', init);
