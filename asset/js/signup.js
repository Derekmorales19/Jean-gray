// Lógica para la página de Sign In / Sign Up
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
 
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
     
      const pass = document.getElementById('password').value;
      const confirmPass = document.getElementById('confirm-password').value;
 
      if (pass !== confirmPass) {
        alert('Passwords do not match. Please try again.');
        return;
      }
 
      // Redirección a la página de Credit al registrarse con éxito
      window.location.href = 'Credit.html';
    });
  }
});
 