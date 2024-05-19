function updateTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours() % 12 || 12; // Convierte a formato 12 horas y usa 12 en lugar de 0.
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    const amPm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours}:${minutes}:${seconds} ${amPm}`;
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.innerText = formattedTime;
    }
}

function startClock() {
    updateTime();
    setInterval(updateTime, 1000);
}

document.addEventListener('DOMContentLoaded', startClock);