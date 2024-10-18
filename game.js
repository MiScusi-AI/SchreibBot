let points = 0;
let coins = 0;
let totalWords = 0;
let isGameActive = false;  // Startet als false, da wir erst den Intro-Text anzeigen
let countdownStarted = false;
let hasStartedTyping = false; // Neue Variable: ob der Benutzer angefangen hat zu schreiben

// Funktion zum Anzeigen des Intro-Texts Buchstabe für Buchstabe
function typeIntroText(text, callback) {
  const introElement = document.getElementById('introText');
  let index = 0;
  const speed = 50; // Geschwindigkeit der Zeichenanzeige in Millisekunden

  function type() {
    if (index < text.length) {
      introElement.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // Sobald der Text fertig ist, starten wir das Spiel
      isGameActive = true;
      if (callback) callback();
    }
  }
  type();
}

// Funktion zum Zählen der Wörter während des Tippens
function countWords() {
  if (!isGameActive) return;  // Stoppe das Zählen, wenn das Spiel nicht aktiv ist

  const text = document.getElementById('textInput').value.trim();
  if (text === "") {
    points = 0;
    coins = 0;
    totalWords = 0;
    updateScore();
    return;
  }

  const words = text.split(/\s+/);  // Trennt nach Leerzeichen
  let validWords = words.length;  // Zählt alle Wörter, auch unsinnige und unleserliche

  points = validWords;
  coins = validWords;
  totalWords = validWords;

  updateScore();

  // Erfolgsmeldung nach jedem 10. Wort anzeigen (z.B. "10 Wörter!", "20 Wörter!" usw.)
  if (totalWords % 10 === 0 && totalWords > 0) {
    showFloatingMessage(totalWords + " Wörter!");
  }
}

// Aktualisiere die Punktanzeige
function updateScore() {
  document.getElementById('points').innerText = points;
  document.getElementById('coins').innerText = coins;
}

// Zeige eine schwebende Meldung an (Erfolgsmeldungen und Countdown)
function showFloatingMessage(message) {
  const floatingMessage = document.getElementById('floatingMessage');
  
  try {
    if (message && typeof message === "string") {
      floatingMessage.innerText = message;
      floatingMessage.classList.remove('hidden');
      floatingMessage.classList.add('showFloatingMessage');

      // Blende die Nachricht nach 3 Sekunden wieder aus
      setTimeout(() => {
        floatingMessage.classList.remove('showFloatingMessage');
        floatingMessage.classList.add('hidden');
      }, 3000);
    } else {
      console.error("Ungültige Nachricht übergeben:", message);
    }
  } catch (error) {
    console.error("Fehler beim Anzeigen der Meldung:", error);
  }
}

// Funktion zum Entfernen des Intro-Texts
function removeIntroText() {
  const introElement = document.getElementById('introText');
  introElement.innerHTML = '';  // Leert den Inhalt des Intro-Textes
  introElement.style.display = 'none';  // Blendet den Text aus
}

// Funktion zum Beenden der Schreibübung nach 2 Minuten
function endGame() {
  isGameActive = false;  // Stoppe das Spiel
  document.getElementById('textInput').disabled = true;  // Deaktiviert das Textfeld

  const finalMessage = document.getElementById('finalMessage');
  finalMessage.innerText = `Gut gemacht, du hast ${totalWords} Wörter geschrieben und dadurch ${totalWords} Münzen verdient. Bis bald!`;
}

// Funktion zum Starten des Countdowns 10 Sekunden vor dem Ende
function startCountdown() {
  if (countdownStarted) return; // Verhindert mehrfaches Starten des Countdowns
  countdownStarted = true;

  let countdownValue = 10;

  const countdownInterval = setInterval(() => {
    showFloatingMessage(`Noch ${countdownValue} Sekunden...`);
    countdownValue--;

    if (countdownValue < 0) {
      clearInterval(countdownInterval);  // Stoppt den Countdown
      showFloatingMessage("Ende der Übung");
    }
  }, 1000);  // Alle 1000 Millisekunden (1 Sekunde) aktualisieren
}

// Starte das Spiel nach dem Intro-Text
function startGame() {
  // Event-Listener für das Zählen bei jedem Tastendruck
  document.getElementById('textInput').addEventListener('input', () => {
    if (!hasStartedTyping) {
      removeIntroText();  // Entfernt den Intro-Text, wenn der Benutzer zu schreiben beginnt
      hasStartedTyping = true;
    }
    countWords();
  });

  // Setze Fokus auf das Textfeld
  document.getElementById('textInput').focus();

  // Starte den Timer für die Schreibübung (2 Minuten)
  setTimeout(() => {
    startCountdown();  // 10 Sekunden vor Ablauf der 2 Minuten den Countdown starten
  }, 110000);  // 110.000 Millisekunden = 1 Minute und 50 Sekunden

  setTimeout(() => {
    endGame();  // Nach Ablauf der 2 Minuten das Spiel beenden
  }, 120000);  // 120.000 Millisekunden = 2 Minuten
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  const introText = "Willkommen bei Schreibbot. Lass uns gleich loslegen! Schreibe alles auf, was dir in den Sinn kommt, ohne Pausen oder Nachdenken. Es geht nicht um Grammatik oder Stil, sondern darum, ins Schreiben zu kommen. Du hast zwei Minuten Zeit, ab... jetzt!";
  
  typeIntroText(introText, startGame);
});
