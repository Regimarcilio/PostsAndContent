for (const group of document.querySelectorAll('.languages')) {
  const buttons = group.querySelectorAll('button');
  group.addEventListener('click', event => {
    if (!buttons.length || !event.target.matches('button')) return;
    for (const button of buttons) {
      const selected = button === event.target;
      button.setAttribute('aria-pressed', String(selected));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !selected;
    }
  });
}
