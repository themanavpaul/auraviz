import { CameraView, Camera, CameraCapturedPicture } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";
import { useState, useRef, useEffect } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    Image,
    ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import { analyzeImage } from "../../services/NebiusAIService";

export default function CameraFunction() {
    const [cameraPermission, setCameraPermission] = useState<boolean | undefined>(); //State variable for camera permission
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | undefined>(); //State variable for media library permission
    //   const [micPermission, setMicPermission] = useState(); //// state variable for microphone permission
    const [facing, setFacing] = useState<CameraType>("back");
    const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(undefined); //After picture is taken this state will be updated with the picture
    const [imageDescription, setImageDescription] = useState<string | null>(null); // State to store AI description
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false); // State to track analysis status
    //   const [video, setVideo] = useState(); //After video is recorded this state will be updated
    //   const [flashMode, setFlashMode] = useState("on"); //Camera Flash will be ON by default
    //   const [recording, setRecording] = useState(false); //State will be true when the camera will be recording
    //   const [zoom, setZoom] = useState(0); //State to control the digital zoom
    const cameraRef = useRef<CameraView>(null); //Creates a ref object and assigns it to the variable cameraRef.
    const navigation = useNavigation();

    //When the screen is rendered initially the use effect hook will run and check if permission is granted to the app to access the Camera, Microphone and Media Library.
    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission =
                await MediaLibrary.requestPermissionsAsync();
            const microphonePermission =
                await Camera.requestMicrophonePermissionsAsync();
            setCameraPermission(cameraPermission.status === "granted" ? true : false);
            setMediaLibraryPermission(mediaLibraryPermission.status === "granted");
            //   setMicPermission(microphonePermission.status === "granted");
        })();
    }, []);

    //If permissions are not granted app will have to wait for permissions
    if (
        cameraPermission === undefined ||
        mediaLibraryPermission === undefined
        // micPermission === undefined
    ) {
        return <Text>Request Permissions....</Text>;
    } else if (!cameraPermission) {
        return (
            <Text>
                Permission for camera not granted. Please change this in settings
            </Text>
        );
    }

    //Function to toggle between back and front camera
    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    //Function to toggle flash on or off
    //   function toggleFlash() {
    //     setFlashMode((current) => (current === "on" ? "off" : "on"));
    //   }

    //Function to capture picture
    let takePic = async () => {
        if (!cameraRef.current) return; //If the cameraRef is not set, the function will return
        //Declares takePic as an asynchronous function using the async keyword.
        let options = {
            quality: 1, //Specifies the quality of the captured image. A value of 1 indicates maximum quality, whereas lower values reduce quality (and file size).
            base64: true, //Includes the image's Base64 representation in the returned object. This is useful for embedding the image directly in data URIs or for immediate upload to servers.
            exif: false, //Disables the inclusion of EXIF metadata in the image (e.g., location, device info). Setting this to true would include such metadata.
        };

        let newPhoto = await cameraRef.current.takePictureAsync(options); //Refers to the camera instance (set using a ref in React). This is used to call methods on the camera.
        //Captures an image with the specified options and returns a promise that resolves to an object containing: URI and Base64 string and/or EXIF data, based on the provided options.
        setPhoto(newPhoto); //Update photo state with the new photo object
        
        // Process image with Nebius AI
        try {
            setIsAnalyzing(true);
            setImageDescription(null);
            
            if (newPhoto && newPhoto.base64) {
                // Send to Nebius AI for analysis
                const description = await analyzeImage(newPhoto.base64);
                setImageDescription(description);
            } else {
                setImageDescription("Failed to capture image with base64 data.");
            }
        } catch (error) {
            console.error("Error analyzing image:", error);
            setImageDescription("Failed to analyze image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    //After the picture is captured it will be displayed to the user and the user will also be provided the option to save or discard the image
    if (photo) {
        let savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
                setPhoto(undefined);
                setImageDescription(null);
            });
        };

        let discardPhoto = () => {
            setPhoto(undefined);
            setImageDescription(null);
        };

        return (
            <SafeAreaView style={styles.imageContainer}>
                <Image style={styles.preview} source={{ uri: photo.uri }} />
                
                {/* AI Description Display */}
                <View style={styles.descriptionContainer}>
                    {isAnalyzing ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.loadingText}>Analyzing image...</Text>
                        </View>
                    ) : (
                        <Text style={styles.descriptionText}>
                            {imageDescription || "No description available"}
                        </Text>
                    )}
                </View>
                
                <View style={styles.btnContainer}>
                    {mediaLibraryPermission ? (
                        <TouchableOpacity style={styles.btn} onPress={savePhoto}>
                            <Ionicons name="save-outline" size={30} color="black" />
                        </TouchableOpacity>
                    ) : undefined}
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={discardPhoto}
                    >
                        <Ionicons name="trash-outline" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    //Video Recorder
    //   async function recordVideo(){
    //     setRecording(true); //Updates the recording state to true. This will also toggle record button to stop button.
    //     cameraRef.current.recordAsync({ //cameraRef is a useRef hook pointing to the camera component. It provides access to the camera's methods, such as recordAsync. Starts recording a video and returns a Promise that resolves with the recorded video's details.
    //       maxDuration: 30, //Limits the recording duration to 30 seconds. After 30 seconds, the recording automatically stops, and the Promise resolves.
    //     })
    //     .then((newVideo) => { //The result of this Promise is an object (newVideo) containing information about the recorded video, such as the file's URI and other metadata. This callback runs when the recording completes successfully. 
    //       setVideo(newVideo); // Stores the recorded video details in the state, which can later be used for playback, uploading, or other actions.
    //       setRecording(false);
    //     })
    //     console.log(video.uri)
    //   }

    //   function stopRecording(){
    //     setRecording(false);
    //     cameraRef.current.stopRecording();
    //     console.log("Recording stopped");
    //   }

    //   if(video) {
    //     let uri = video.uri;
    //     navigation.navigate("Video", {uri})
    //   }
    //We will design the camera UI first
    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
            // flash={flashMode}
            // mode={cameraMode}
            // zoom={zoom}
            >
                {/* <Slider
          style={{ width: "100%", height: 40, position: "absolute", top: "75%" }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="cyan"
          maximumTrackTintColor="white"
          value={zoom}
          onValueChange={(value) => setZoom(value)}
        /> */}
                {/* <View style={styles.buttonContainer}> */}
                {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCameraMode("picture")}
          >
            <Ionicons name="camera-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCameraMode("video")}
          >
            <Ionicons name="videocam-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleFlash}>
            <Text>
              {flashMode === "on" ? (
                <Ionicons name="flash-outline" size={20} color="white" />
              ) : (
                <Ionicons name="flash-off-outline" size={20} color="white" />
              )}
            </Text>
          </TouchableOpacity>
        </View> */}
                <View style={styles.shutterContainer}>
                    {/* {cameraMode === "picture" ? ( */}
                    <TouchableOpacity style={styles.button} onPress={takePic}>
                        <Ionicons name="aperture-outline" size={100} color="white" />
                    </TouchableOpacity>
                    {/* ) : recording ? ( */}
                    {/* <TouchableOpacity style={styles.button} onPress={stopRecording}>
              <Ionicons name="stop-circle-outline" size={40} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={recordVideo}>
              <Ionicons name="play-circle-outline" size={40} color="white" />
            </TouchableOpacity>
          )} */}
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    // buttonContainer: {
    //     flex: 1,
    //     flexDirection: "row",
    //     backgroundColor: "transparent",
    //     margin: 20,
    // },
    shutterContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
        position: "absolute",
        // margin: ,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    btnContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "white",
    },
    btn: {
        justifyContent: "center",
        margin: 10,
        elevation: 5,
    },
    imageContainer: {
        height: "95%",
        width: "100%",
    },
    preview: {
        alignSelf: "stretch",
        flex: 0.7,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    // Added new styles for the description section
    descriptionContainer: {
        flex: 0.3,
        backgroundColor: "white",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    descriptionText: {
        fontSize: 18,
        color: "#333",
        lineHeight: 24,
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
});