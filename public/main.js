(() => {
  const $ = selector => {
    return document.querySelectorAll(selector);
  };

  const currentQuestion = $('#currentQuestion')[0];
  const questions = $('.question');
  const update = $('#update')[0];
  const add = $('#add')[0];
  const deleteButtons = $('.delete');
  let selectedQuestion;

  // Add event listeners to all li
  for (let q of questions) {
    q.addEventListener('click', function(e) {
      currentQuestion.textContent = this.textContent.trim();
      selectedQuestion = this;
      add.classList.add('hidden');
      update.classList.remove('hidden');
    });
  }

  // add event listeners to all delete buttons
  for (let del of deleteButtons) {
    del.addEventListener('click', function(e) {
      const id = this.parentNode.getAttribute('data-oid');

      const config = {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      };
      fetch('/questions', config).then(() => {
        for (let q of questions) {
          if (q.parentNode.getAttribute('data-oid') === id) {
            const elToDelete = this.parentNode;
            elToDelete.parentNode.removeChild(elToDelete);
          }
        }
        currentQuestion.textContent = '';
      });
    });
  }

  // add event listener for textarea and update value on every change
  currentQuestion.addEventListener('keyup', function(e) {
    this.innerHTML = e.target.value;
  });

  // add event listener to update button
  update.addEventListener('click', function(e) {
    const id = selectedQuestion.parentNode.getAttribute('data-oid');
    const question = currentQuestion.textContent.trim();

    const config = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    };
    fetch(`questions/${id}`, config).then(() => {
      selectedQuestion.textContent = question;
      currentQuestion.textContent = null;
      window.location.reload();
    });
  });
})();
