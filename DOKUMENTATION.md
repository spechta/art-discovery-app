Hier ist die überarbeitete Dokumentation, in der die wichtigsten Funktionalitäten in kleineren Codeblöcken erklärt werden. Die Struktur bleibt die gleiche, aber der Code ist jetzt kompakter und fokussierter.

---

# Dokumentation des Kunstprojekts

## Inhaltsverzeichnis
1. [Einleitung](#einleitung)
2. [HomeScreen.js](#homescreenjs)
3. [LikedArtScreen.js](#likedartscreenjs)
4. [FetchInstagram.js](#fetchinstagramjs)
5. [Übrige Dateien](#übrigedateien)
6. [Challenges](#challenges)


---

## Einleitung

Dieses Dokument beschreibt die wichtigsten Dateien und deren Funktionen in einem React Native Kunstprojekt. Die Anwendung ermöglicht Benutzern, Kunstwerke von verschiedenen Künstlern zu entdecken und zu liken. Die Kernkomponenten der Anwendung sind `HomeScreen.js`, `LikedArtScreen.js` und `FetchInstagram.js`.

## HomeScreen.js

### Überblick

`HomeScreen.js` ist der Hauptbildschirm, der eine Swipe-Oberfläche bietet, um Künstler zu entdecken.

### Wichtige Imports

```javascript
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-react-native-classnames";
import { db } from "../firebase";
```

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

```javascript
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { db } from "../firebase";
```

### Abrufen der gelikten Künstler

Die Funktion `fetchLikedArtists` ruft die gelikten Künstler vom Firestore ab.

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

Die Künstlerbilder werden zufällig angeordnet, um ein besseres Benutzererlebnis zu bieten.

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

Die ScrollView zeigt die gelikten Künstlerbilder an.

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

### Wichtige Imports

```javascript
import axios from 'axios';
import { setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
```

### Abrufen der Instagram-Daten

Die Funktion `fetchInstagramData` ruft die Daten für eine Liste von Benutzernamen ab.

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

### FetchInstagram.js
Eine Utility-Datei, die Funktionen zum Abrufen von Daten von Instagram bereitstellt, um Kunstwerke anzuzeigen.

### firebase.js
Konfiguriert Firebase für die Verwendung in der Anwendung, einschließlich Authentifizierung und Datenbankverbindung.

### index.js
Der Einstiegspunkt der Anwendung, der die Haupt-App-Komponente in das DOM rendert.

### input.css
Beinhaltet die globalen CSS-Stile für die Anwendung.

### LICENSE
Die Lizenzdatei, die die rechtlichen Bestimmungen für die Nutzung und Verteilung der Anwendung beschreibt.

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
Definiert den Stack-Navigator für die Anwendung, der es Benutzern ermöglicht, zwischen verschiedenen Bildschirmen zu navigieren.

### proxy/server.js
Beinhaltet die Logik für den Server, der API-Anfragen behandelt und die Kommunikation zwischen dem Frontend und dem Backend ermöglicht.

### screens/HomeScreen.js
Der Startbildschirm der Anwendung, der eine Übersicht über alle verfügbaren Kunstwerke bietet.

### screens/LikedArtScreen.js
Ein Bildschirm, der die Kunstwerke anzeigt, die vom Benutzer gemocht wurden.

### screens/LoginScreen.js
Bietet die Anmeldelogik für Benutzer, um sich in der Anwendung zu authentifizieren.

### screens/ModalScreen.js
Ein Modalscreen für verschiedene Benutzerinteraktionen, wie z.B. das Anzeigen von Details zu einem Kunstwerk.

## Challenges
todo

---

