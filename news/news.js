function renderNews(title, link, dateFormatted) {
    const newsContainer = document.getElementById('list-news-tubs');
    if (!newsContainer) return;

    const c_new = document.createElement('li');
    c_new.className = 'list-news-el';

    c_new.innerHTML = `
        <a href="" class="news-title"><p></p></a>
        <span class="news-date"></span>
    `;

    c_new.querySelector('p').textContent = title;
    c_new.querySelector('.news-date').textContent = dateFormatted;
    c_new.querySelector('.news-title').href = link;

    newsContainer.insertBefore(c_new, newsContainer.firstChild);
}

async function loadNews() {
    try {
        const response = await fetch('https://formula-1.com/api/news.php');
        const news = await response.json();

        const newsContainer = document.getElementById('list-news-tubs');
        if (newsContainer) newsContainer.innerHTML = ''; // Очистка

        news.reverse().forEach(item => {
            renderNews(item.title, item.link, item.date);
        });
    } catch (error) {
        console.error('Ошибка отправки отзыва:', error);
    }
}

loadNews();