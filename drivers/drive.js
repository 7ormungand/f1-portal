
function renderdriverCard(number, name, team, born, nat, link, img) {
    const driversContainer = document.getElementById('driversContainer');
    if (!driversContainer) return;

    const c_driver = document.createElement('div');
    c_driver.className = 'driver_card';

    c_driver.innerHTML = `
        <a href="">
            <img src="" alt="${name}">
            <span class="drive_name_num"><h4></h4> <div class="num"><p></p></div></span>
            <span class="drive_team"><h3>Team</h3>: <h4></h4></span>
            <span class="drive_date"><h3>Born</h3>: <h4></h4></span>
            <span class="drive_nat"><h3>Nationality</h3>: <h4></h4></span>
        </a>
    `;

    c_driver.querySelector('.drive_name_num h4').textContent = name;
    c_driver.querySelector('.num p').textContent = number;
    c_driver.querySelector('.drive_team h4').textContent = team;
    c_driver.querySelector('.drive_date h4').textContent = born;
    c_driver.querySelector('.drive_nat h4').textContent = nat;
    c_driver.querySelector('a').href = link;
    c_driver.querySelector('img').src = img;
    

    driversContainer.insertBefore(c_driver, driversContainer.firstChild);
}

async function loadDrivers() {
    try {
        const response = await fetch('https://formula-1.com/api/drivers.php');
        const drivers = await response.json();

        const driversContainer = document.getElementById('driversContainer');
        if (driversContainer) driversContainer.innerHTML = ''; // Очистка

        drivers.reverse().forEach(driver => {
            renderdriverCard(driver.number, driver.name, driver.team, driver.born, driver.nat, driver.link, driver.img);
        });
    } catch (error) {
        console.error('Ошибка отправки отзыва:', error);
    }
}

loadDrivers();