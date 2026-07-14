import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBYMAJYuHNWYNkcn5ZfHKGfpza-aWZ5Cfw",
  authDomain: "f1-portal-51937.firebaseapp.com",
  projectId: "f1-portal-51937",
  storageBucket: "f1-portal-51937.firebasestorage.app",
  messagingSenderId: "414131358854",
  appId: "1:414131358854:web:f6d70733d732891d151507",
  measurementId: "G-Z8XQT8BELN"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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
        const querySnapshot = await getDocs(collection(db, "drivers"));

        const driversContainer = document.getElementById('driversContainer');
        if (driversContainer) driversContainer.innerHTML = ''; // Очистка заглушки

        const drivers = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            drivers.push({
                number: data.number,
                name: data.name,
                team: data.team,
                born: data.born,
                nationality: data.nationality,
                link: data.link,
                img: data.img
            });
        });

        // Сортируем и рендерим гонщиков
        drivers.reverse().forEach(driver => {
            renderdriverCard(driver.number, driver.name, driver.team, driver.born, driver.nationality, driver.link, driver.img);
        });
    } catch (error) {
        console.error('Ошибка загрузки пилотов из Firebase:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDrivers();
});
