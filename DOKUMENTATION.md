---

# Dokumentation der Web-App

## Inhaltsverzeichnis
1. [Einleitung](#einleitung)
2. [HomeScreen.js](#homescreenjs)
3. [LikedArtScreen.js](#likedartscreenjs)
4. [FetchInstagram.js](#fetchinstagramjs)
5. [Übrige Dateien](#übrige-dateien)
6. [Challenges](#challenges)


---

## Einleitung

Dieses Dokument beschreibt die wichtigsten Dateien und deren Funktionen in einem React Native Projekt. Die Anwendung ermöglicht Benutzern, Kunstwerke von verschiedenen Künstlern zu entdecken und zu liken. Die Kernkomponenten der Anwendung sind `HomeScreen.js`, `LikedArtScreen.js` und `FetchInstagram.js`.

## HomeScreen.js

### Überblick

`HomeScreen.js` ist der Hauptbildschirm, der eine Swipe-Oberfläche bietet, um Künstler zu entdecken.

### Benutzeroberfläche

Der Header enthält das Benutzerbild und einen Button zu den gelikten Künstlern.

```javascript
<TouchableOpacity onPress={() => navigation.navigate("LikedArt")}>
  <Image style={tw.style("h-20 w-20 rounded-full")} source={{ uri: user?.photoURL }} />
</TouchableOpacity>
```

### Abrufen von Künstlern

Die Funktion `fetchCards` ruft Künstlerdaten aus Firestore ab und filtert bereits gelikte oder abgelehnte Künstler.

```javascript
const fetchCards = async () => {
  const artists = []; // Array zur Speicherung der Künstlerdaten
  // Daten abrufen
  const snapshot = await getDocs(collection(db, "artists"));
  snapshot.forEach(doc => {
    artists.push(doc.data());
  });
  setArtists(artists);
};
```

### Swipe-Funktionalität

Die Swipe-Funktion wird durch die Verwendung von `react-native-deck-swiper` ermöglicht.

```javascript
<Swiper
  ref={swiperRef}
  cards={artists}
  onSwipedLeft={swipeLeft}
  onSwipedRight={swipeRight}
/>
```

### Liken oder Ablehnen

Die Funktionen `swipeLeft` und `swipeRight` handhaben das Liken und Ablehnen von Künstlern.

```javascript
const swipeLeft = (cardIndex) => {
  // Ablehnen des Künstlers in Firestore speichern
};

const swipeRight = (cardIndex) => {
  // Liken des Künstlers in Firestore speichern
};
```

## LikedArtScreen.js

### Überblick

`LikedArtScreen.js` zeigt die vom Benutzer gelikten Künstler und deren Kunstwerke an.

### Wichtige Imports

### Abrufen der gelikten Künstler

Die Funktion `fetchLikedArtists` ruft die gelikten Künstler aus Firestore ab.

```javascript
const fetchLikedArtists = async () => {
  const likedArtists = []; // Array zur Speicherung der gelikten Künstler
  const snapshot = await getDocs(collection(db, "likedArtists"));
  snapshot.forEach(doc => {
    likedArtists.push(doc.data());
  });
  setArtists(likedArtists);
};
```

### Anordnung der Künstler

Die Künstlerbilder werden zufällig angeordnet, um die Explore-Page interessanter zu gestalten.

```javascript
const shuffleArray = (array) => {
  // Zufällige Anordnung der Elemente im Array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
```

### Layout

Die ScrollView zeigt alle Posts aller Künstleran, die mit einem Like gespeichert sind.

```javascript
<ScrollView>
  {shuffledImages.map((item, index) => (
    <Image key={index} source={{ uri: item.imageUri }} style={{ width: 100, height: 100 }} />
  ))}
</ScrollView>
```

## FetchInstagram.js

### Überblick

`FetchInstagram.js` ist verantwortlich für das Abrufen von Daten von Instagram.

### Abrufen der Instagram-Daten

Die Funktion `fetchInstagramData` ruft die Daten für eine Liste von Benutzernamen ab.
Folgende API wird verwendet, wobei Instagram-Posts von Künstlern über den jeweiligen Instagram Username gefetcht werden. (Die Liste der Namen befindet sich am Anfang von HomeScreen und diese kann auch erweitert werden)
https://rapidapi.com/social-api1-instagram/api/instagram-scraper-api2/playground/apiendpoint_b1301387-dc09-4b1f-ba39-b7b51d186b40

```javascript
export const fetchInstagramData = async (usernames) => {
  for (const username of usernames) {
    const docRef = doc(db, 'artists', username);
    // Abrufen der Daten von Instagram
    const response = await axios.get(`https://instagram.api/${username}`);
    // Speichern der Daten in Firestore
    await setDoc(docRef, { ...response.data });
  }
};
```

### Überprüfung der bestehenden Daten

Vor dem Abrufen wird überprüft, ob bereits Daten existieren und ob diese innerhalb der letzten 72 Stunden abgerufen wurden.

```javascript
if (docSnap.exists()) {
  const fetchedAt = docSnap.data().fetchedAt.toDate();
  const now = new Date();
  // Prüfen, ob die Daten älter als 72 Stunden sind
  if (fetchedAt > now.setHours(now.getHours() - 72)) {
    continue; // Daten wurden kürzlich abgerufen
  }
}
```

## Übrige Dateien

Dateibeschreibungen
### App.js
Die Hauptkomponente der Anwendung, die die grundlegende Struktur definiert und die anderen Komponenten zusammenführt.

### app.json
Enthält Konfigurationseinstellungen für die Anwendung, einschließlich Name, Version und Abhängigkeiten.

### babel.config.js
Konfigurationsdatei für Babel, die dafür sorgt, dass der JavaScript-Code in eine für Browser verständliche Form transpiliert wird.

### firebase.js 
Konfiguriert Firebase für die Verwendung in der Anwendung, einschließlich Authentifizierung und Datenspeicherung (Dienst von Google).

### index.js
Der Einstiegspunkt der Anwendung.

### metro.config.js
Konfigurationsdatei für den Metro-Bundler, der für die Verarbeitung von React-Native-Projekten verwendet wird.

### package.json
Verwaltet die Projektabhängigkeiten und enthält Skripte für verschiedene Entwicklungsbefehle.

### tailwind.config.js
Konfiguriert Tailwind CSS, um benutzerdefinierte Stile in der Anwendung zu ermöglichen.

### tailwind.json
Speichert Tailwind CSS-Konfigurationen und -Stile für die Anwendung.

### yarn.lock
Eine automatische von Yarn generierte Datei, die genaue Versionen der Abhängigkeiten speichert.

### hooks/useAuth.js
Ein benutzerdefinierter Hook, der die Authentifizierungslogik für die Anwendung behandelt.

### navigation/StackNavigator.js
Definiert den Stack-Navigator für die Anwendung, der es Benutzern ermöglicht, zwischen verschiedenen Screens zu navigieren.

### proxy/server.js
Beinhaltet die Logik für den Server, der API-Anfragen behandelt und die Kommunikation zwischen dem Frontend und dem Backend ermöglicht.

### screens/LoginScreen.js
Bietet die Anmeldelogik für Benutzer, um sich in der Anwendung zu authentifizieren.

### screens/ModalScreen.js
Ein Modalscreen ermöglicht das Konfigurieren von Profilinformationen.

## Challenges
1. API
   -Es war schwierig eine API zu finden, die genug Fetch-Requests erlaubt außerdem muss für FetchInstagram.js die Dateistrukture beachtet werden, also an welcher Stelle Bilder gespeichert sind        und ob es sich um Single-Posts oder Caroussel-Posts handelt
   -Des Weiteren sind die URLs der API nach einer Zeit expired also wird kein Bild angezeigt, weswegen die Posts neu gefetcht werden müssen
2. Proxy
   - Instagram erlaubt keinen Cross-Origin-Acess, also Posts stammen von Instagram.com und die Web-App liefert einen Cross-Origin-Error da von einem anderen Ursprung auf die Bilder zugegriffen 
    wird. Der Proxy-Server wird mit dem Modul concurrently, in package.json definiert, gleichzeitig beim Start der App gestartet und URL-Requests laufen über den Proxy um das ganze zu umgehen
3. UI & Navigation
   - Schwierig war es auch mithilfe von StackNavigator.js eine korrekte Navigation über die Knöpfe zu gewährleisten, als entsprechende Explore-Page zu erstellen

---

