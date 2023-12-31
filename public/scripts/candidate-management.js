const deleteCandidateButtonElements = document.querySelectorAll(
  ".candidate-card button"
);
const sortCandidatesButtonElements = document.querySelectorAll(".candidate-sort button");

async function deleteCandidate(event) {
  const buttonElement = event.target;
  const userId = buttonElement.dataset.candidateid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/lookingforjob/" + userId + "/delete" + "?_csrf=" + csrfToken,
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
  deleteCandidateButtonElement.addEventListener("click", deleteCandidate);
}