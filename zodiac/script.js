document.getElementById('calculate-btn').addEventListener('click', function() {
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;

    if (!isValidDate(day, month)) {
        showPopup("Please enter a valid date.");
        return;
    }

    fetch('zodiac.json')
        .then(response => response.json())
        .then(data => {
            const zodiacSign = getZodiacSign(day, month, data.zodiacSigns);
            fetchZodiacDescription(zodiacSign);
        })
        .catch(error => console.error('Error loading zodiac signs:', error));
});

document.getElementById('close-btn').addEventListener('click', closePopup);
document.getElementById('retry-btn').addEventListener('click', function() {
    document.getElementById('day').value = '';
    document.getElementById('month').value = '';
    closePopup();
});

document.getElementById('month').addEventListener('change', function() {
    adjustDayInputMax(this.value);
});

document.getElementById('read-more-btn').addEventListener('click', function() {
    const zodiacSign = document.getElementById('zodiac-name').textContent;
    if (zodiacSign) {
        window.open(`https://en.wikipedia.org/wiki/${zodiacSign}`, '_blank');
    }
});

function isValidDate(day, month) {
    day = parseInt(day, 10);
    month = parseInt(month, 10);
    if (isNaN(day) || isNaN(month) || day <= 0 || day > getDaysInMonth(month)) {
        return false;
    }
    return true;
}

function getDaysInMonth(month) {
    const daysInMonth = {
        "01": 31,
        "02": 29,  // Consider leap years later if necessary
        "03": 31,
        "04": 30,
        "05": 31,
        "06": 30,
        "07": 31,
        "08": 31,
        "09": 30,
        "10": 31,
        "11": 30,
        "12": 31
    };
    return daysInMonth[month] || 31;
}

function adjustDayInputMax(month) {
    const dayInput = document.getElementById('day');
    const maxDays = getDaysInMonth(month);
    dayInput.max = maxDays;
    if (parseInt(dayInput.value) > maxDays) {
        dayInput.value = '';
    }
}

function getZodiacSign(day, month, zodiacSigns) {
    const date = `${month}-${day.toString().padStart(2, '0')}`;

    for (const zodiac of zodiacSigns) {
        if (isDateInRange(date, zodiac.start, zodiac.end)) {
            return zodiac.sign;
        }
    }

    // Handle Capricorn case (overlaps years)
    const isCapricorn = zodiacSigns.find(z => z.sign === 'Capricorn');
    if (isDateInRange(date, isCapricorn.start, "12-31") || isDateInRange(date, "01-01", isCapricorn.end)) {
        return isCapricorn.sign;
    }

    return "Unknown";
}

function isDateInRange(date, start, end) {
    return (date >= start && date <= end);
}

function fetchZodiacDescription(zodiacSign) {
    fetch(`https://zodiacal.herokuapp.com/${zodiacSign.toLowerCase()}`)
        .then(response => response.json())
        .then(data => {
            const description = data[0].general || "No description available.";
            showPopup(`Your Zodiac Sign is: ${zodiacSign}\n\n${description}`, zodiacSign);
        })
        .catch(error => {
            console.error('Error fetching zodiac description:', error);
            showPopup(`Your Zodiac Sign is: ${zodiacSign}\n\nNo description available.`, zodiacSign);
        });
}

function showPopup(message, zodiacSign) {
    const popup = document.getElementById('popup');
    document.getElementById('result').textContent = message;
    document.getElementById('zodiac-name').textContent = zodiacSign;
    popup.style.display = "block";
}

function closePopup() {
    document.getElementById('popup').style.display = "none";
}