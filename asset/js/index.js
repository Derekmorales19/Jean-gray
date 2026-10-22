// Toggle Dark/Light mode globally & save setting in localStorage
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
 
  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector('i');
 
    // Restore user theme preference if previously saved
    const savedTheme = localStorage.getItem('fiao-theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    }
 
    // Event listener for theme toggle
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
 
      if (isDarkMode) {
        localStorage.setItem('fiao-theme', 'dark');
        if (icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      } else {
        localStorage.setItem('fiao-theme', 'light');
        if (icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
    });
  }
});
 