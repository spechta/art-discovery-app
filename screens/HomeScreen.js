import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { db, timestamp } from "../firebase";
import { fetchInstagramData } from "../FetchInstagram"; 
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [artists, setArtists] = useState([]);
  const swipeRef = useRef(null);

  const usernames = [
    'wlop', 'rossdraws', 'samdoesarts', 'loisvb', 'kuvshinov_ilya',
    'pascalcampionart', 'artof666k', 'artofmervin', 'devinellekurtz',
    'yuumeiart', 'guweiz', 'esbenlash', 'demizuposuka', 'yuming_art',
  ];
 
  useLayoutEffect(() => {
    // Ensure user profile exists, navigate to modal if not.
    getDoc(doc(db, "users", user.uid)).then((snapShot) => {
      if (!snapShot.exists()) {
        navigation.navigate("Modal");
      }
    });
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Fetch the liked and passed artists for the current user
        const passesSnapshot = await getDocs(collection(db, "users", user.uid, "passes"));
        const likesSnapshot = await getDocs(collection(db, "users", user.uid, "likes"));
        
        // Get IDs of artists that the user has passed or liked
        const passedArtistIds = passesSnapshot.docs.map(doc => doc.id);
        const likedArtistIds = likesSnapshot.docs.map(doc => doc.id);
        const excludedArtistIds = [...passedArtistIds, ...likedArtistIds];
        
        // Fetch all artists from Firebase
        const artistsSnapshot = await getDocs(collection(db, "artists"));
        const allArtists = artistsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Filter out artists that have been passed or liked
        const filteredArtists = allArtists.filter(artist => !excludedArtistIds.includes(artist.id));
        
        // Set filtered artists to display
        setArtists(filteredArtists);
      } catch (error) {
        console.log("Error fetching artists:", error);
      }
    };
  
    fetchCards(); // Fetch and filter artist profiles from Firebase
  }, [user.uid]);

  const swipeLeft = (cardIndex) => {
    if (!artists[cardIndex]) return;

    const artistSwiped = artists[cardIndex];

    // Update Firestore
    setDoc(doc(db, "users", user.uid, "passes", artistSwiped.id), artistSwiped);
};

const swipeRight = (cardIndex) => {
    if (!artists[cardIndex]) return;

    const artistLiked = artists[cardIndex];

    // Update Firestore
    setDoc(doc(db, "users", user.uid, "likes", artistLiked.id), artistLiked);
};


  return (
    <SafeAreaView style={tw.style("flex-1 mt-6")}>
      <View style={tw.style("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Image
          style={tw.style("h-20 w-20 rounded-full")}
          source={{
            uri: user?.photoURL 
              ? user.photoURL // Use user's photo URL if available
              : "https://img.freepik.com/free-icon/user_318-159711.jpg", // Fallback to a default image
          }}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw.style("h-24 w-24")}
            source={require("../assets/logo.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LikedArt")}>
          <Ionicons name="heart-sharp" size={50} color="#40e0d0" />
        </TouchableOpacity>
      </View>

        <View style={tw.style("flex-1 -mt-6")}>
    <Swiper
      ref={swipeRef}
      containerStyle={{
        backgroundColor: "transparent",
      }}
      cards={artists}
      stackSize={5}
      cardIndex={0}
      animateCardOpacity
      verticalSwipe={false}
      onSwipedLeft={(cardIndex) => {
        console.log("Swiped left");
        swipeLeft(cardIndex);
      }}
      onSwipedRight={(cardIndex) => {
        console.log("Swiped right");
        swipeRight(cardIndex);
      }}
      backgroundColor="#4FD0E9"
      overlayLabels={{
        left: {
          title: "NOPE",
          style: {
            label: {
              textAlign: "right",
              color: "red",
            },
          },
        },
        right: {
          title: "LIKE",
          style: {
            label: {
              color: "#4DED30",
            },
          },
        },
      }}
      renderCard={(artist) => {
        return artist ? (
          <View
            key={artist.id}
            style={tw.style("bg-white h-5/6 rounded-xl relative w-full max-w-xl mx-auto")} // Center and limit width
          >
            {/* Rendering the first image from the images array */}
            {artist.images && artist.images.length > 0 ? (
              <Image
                style={tw.style("absolute top-0 h-5/6 w-full rounded-t-xl")} // Adjust image size
                source={{uri: `http://localhost:3001/proxy-image?url=${encodeURIComponent(artist.images[0])}`,}} 
                resizeMode="contain"
              />
            ) : (
              <Image
                style={tw.style("absolute top-0 h-2/3 w-full rounded-t-xl")}
                source={{ uri: "https://via.placeholder.com/300" }} // Placeholder if no image is found
              />
            )}

            <View
              style={tw.style(
                "absolute bottom-0 bg-white w-full h-1/6 justify-between items-center flex-row px-4 py-2 rounded-b-xl shadow-xl"
              )}
            >
              <View>
                {/* Rendering the artist's name */}
                <Text style={tw.style("text-lg font-bold")}>
                  {artist.name || "Unknown Artist"}
                </Text>
                {/* Optional bio if you have one */}
                <Text style={tw.style("text-sm")}>
                  {artist.bio || "No bio available"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={tw.style(
              "relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl w-full max-w-xs mx-auto"
            )}
          >
            <Text style={tw.style("font-bold pb-5")}>No more artists</Text>
            <Image
              style={tw.style("h-20 w-20")}
              source={{
                uri: "https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037",
              }}
            />
          </View>
        );
      }}
    />
  </View>

      <View style={tw.style("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw.style(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw.style(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <Entypo name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
