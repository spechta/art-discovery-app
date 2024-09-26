import { View, Text, SafeAreaView, ScrollView, Image, useWindowDimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// Function to shuffle the images randomly
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const LikedArtScreen = ({ navigation }) => { 
  const { user } = useAuth();
  const [likedArtists, setLikedArtists] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    const fetchLikedArtists = async () => {
      const likedSnapshots = await getDocs(
        collection(db, "users", user.uid, "likes")
      );
      const likedArtistsData = likedSnapshots.docs.map((doc) => doc.data());
      setLikedArtists(likedArtistsData);

      const allImages = likedArtistsData.flatMap((artist) =>
        artist.images.map((imageUri) => ({
          imageUri: `http://localhost:3001/proxy-image?url=${encodeURIComponent(imageUri)}`,
          displayName: artist.name,
        }))
      );
      setShuffledImages(shuffleArray(allImages)); // Randomize the images
    };

    fetchLikedArtists();
  }, []);

  const numColumns = Math.floor(screenWidth / 200);
  const imageWidth = screenWidth / numColumns - 16;

  return (
    <SafeAreaView style={tw.style("pt-5 flex-1")}>
      {/* Back Button */}
      <View style={tw.style("absolute top-5 left-4")}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#58b6a6" />
        </TouchableOpacity>
      </View>

      <Text style={tw.style("text-2xl font-bold text-center mb-4", { color: '#58b6a6' })}>
        Liked Artists
      </Text>

      <ScrollView>
        <View style={tw.style("flex flex-wrap flex-row justify-between px-4")}>
          {shuffledImages.map((item, index) => (
            <View
              key={index}
              style={{
                width: imageWidth,
                marginBottom: 16,
              }}
            >
              <Image
                source={{ uri: item.imageUri }}
                style={{ width: "100%", height: 300, borderRadius: 20 }}
              />
              <Text style={tw.style("text-center text-sm mt-1", { color: '#036661' })}>
                {item.displayName}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LikedArtScreen;
