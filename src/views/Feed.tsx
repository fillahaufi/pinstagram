import React, { useEffect } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import FeedItem from "../components/FeedItem";
import myTheme from "../styles/global";
import FeedItemPlaceholder from "../components/FeedItemPlaceholder";
import * as Font from "expo-font";

const Feed = () => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const [posts, setPosts] = React.useState<Post[]>([]);
	const [fontsLoaded, setFontsLoaded] = React.useState<boolean>(false);

	useEffect(() => {
		loadFonts();
		getAllPosts();

		return () => {
			setPosts([]);
		};
	}, []);

	const loadFonts = async () => {
		await Font.loadAsync({
			Pacifico: require("../../assets/fonts/Pacifico.ttf"),
		});
		setFontsLoaded(true);
	};

	const getAllPosts = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				"https://private-8656e-fillahaufi.apiary-mock.com/allfeeds"
			);
			const json = (await response.json()) as AllPostResponse;

			setPosts(json.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handlePostPress = () => {
		console.log("Pressed");
	};

	return (
		<View
			className="flex-1 items-center justify-center"
			style={{
				backgroundColor: myTheme.colors.background,
			}}
		>
			<View
				className="absolute top-0 h-20 px-5 pt-6 w-full justify-between flex flex-row"
				style={{
					backgroundColor: myTheme.colors.tertiary,
					borderBottomLeftRadius: 20,
					borderBottomRightRadius: 20,
					zIndex: 10,
				}}
			>
				{fontsLoaded ? (
					<Text
						className="text-2xl mt-3"
						style={{
							fontFamily: "Pacifico",
						}}
					>
						Pinstagram
					</Text>
				) : null}
				<IconButton
					icon={"bookmark"}
					iconColor={myTheme.colors.onPrimary}
				/>
			</View>
			<FeedItemPlaceholder isVisible={loading} />
			<FlatList
				data={posts}
				className={`${
					loading ? "hidden" : ""
				} w-full absolute bottom-0`}
				renderItem={({ item }) => (
					<FeedItem handlePress={handlePostPress} post={item} />
				)}
				numColumns={1}
				keyExtractor={(item, index) => index.toString()}
				style={{
					height: "90%",
					paddingTop: 10,
				}}
			/>
		</View>
	);
};

export default Feed;
