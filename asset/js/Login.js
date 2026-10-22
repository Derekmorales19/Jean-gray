// Lógica para la página de Log In
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
 
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
     
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const recaptchaChecked = document.getElementById('recaptcha-check').checked;
 
      if (!recaptchaChecked) {
        alert('Please verify that you are not a robot.');
        return;
      }
 
      // Redirección a la página de Credit al iniciar sesión
      window.location.href = 'Credit.html';
    });
  }
});