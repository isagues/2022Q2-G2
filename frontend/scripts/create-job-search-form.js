const createSearchUsername = localStorage.getItem('username');
const titleField = document.getElementById('job-title-input');
const descriptionField = document.getElementById('job-description-input');
const createbutton = document.getElementById('create-job-search-button');
createbutton.onclick = () => nuevaBusqueda(titleField.value, descriptionField.value, createSearchUsername);
