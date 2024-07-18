document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.showDetailsButton');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const charterId = button.dataset.charterId;
            try {
                // Itt meg kell tenni az adott karakter részleteinek lekérdezését a szerverről
                const response = await fetch(`/charters/${charterdata}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Részletek megjelenítése a megfelelő helyen
                const charterDetailsContainer = document.getElementById(`charterDetails_${charterId}`);
                charterDetailsContainer.innerHTML = `<p>${data.charter.name}: ${data.charter.data}</p>`;

            } catch (error) {
                console.error('Error fetching charter details:', error);
                alert('Hiba történt a karakter részleteinek lekérése közben.');
            }
        });
    });
});