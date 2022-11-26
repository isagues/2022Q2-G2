const form = document.getElementById('form');
const cv = document.getElementById('cv');

async function sendIT() {
  const url = new URL("/api/getPresignedURL", document.baseURI);
  url.searchParams.append("busqueda", 0)

  const URLresponse = await fetch(url, {
    method: 'POST',
  });

  console.log(URLresponse);
  const presignedURL = await URLresponse.json();


  console.log(presignedURL);

  let response = await fetch(presignedURL.URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/pdf',
    },
    body: cv.files[0],
  });
  console.log(response);
}

form.addEventListener("submit", (event) => {
  sendIT();
  event.preventDefault()
});