const deleteCandidateButtonElements = document.querySelectorAll(
  ".candidate-card button"
);

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.candidateid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/admin/products/" + productId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteCandidateButtonElement of deleteCandidateButtonElements) {
  deleteCandidateButtonElement.addEventListener("click", deleteProduct);
}
