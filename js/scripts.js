
function renderReviewCard(name, text, dateFormatted) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;

    const reviewCard = document.createElement('div');
    reviewCard.className = 'review_card';

    reviewCard.innerHTML = `
        <div class="review_header">
            <h4></h4>
            <span class="review_date"></span>
        </div>
        <p></p>
    `;

    reviewCard.querySelector('h4').textContent = name;
    reviewCard.querySelector('.review_date').textContent = dateFormatted;
    reviewCard.querySelector('p').textContent = text;

    reviewsContainer.insertBefore(reviewCard, reviewsContainer.firstChild);
}

async function loadReviews() {
    try {
        const response = await fetch('../api/reviews.php');
        const reviews = await response.json();

        const reviewsContainer = document.getElementById('reviewsContainer');
        if (reviewsContainer) reviewsContainer.innerHTML = ''; // Очистка

        reviews.reverse().forEach(review => {
            renderReviewCard(review.name, review.text, review.date);
        });
    } catch (error) {
        console.error('Ошибка отправки отзыва:', error);
    }
}

async function addReview() {
    const nameInput = document.getElementById('name');
    const reviewTextInput = document.getElementById('reviewText');

    if (!nameInput || !reviewTextInput) return;

    const nameValue = nameInput.value.trim();
    const reviewValue = reviewTextInput.value.trim();

    if (nameValue === "" || reviewValue === "") {
        alert('Пожалуйста, заполните все поля перед отправкой!');
        return;
    }

   
    const data = {
        name: nameValue,
        reviewText: reviewValue
    };

    try {
        const response = await fetch('../api/reviews.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            await loadReviews();
            
            nameInput.value = '';
            reviewTextInput.value = '';
        } else {
            alert(result.error || 'Произошла ошибка при сохранении.');
        }
    } catch (error) {
        console.error('Ошибка отправки отзыва:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadReviews();

    const submitBtn = document.getElementById('myBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', addReview);
    }
});

