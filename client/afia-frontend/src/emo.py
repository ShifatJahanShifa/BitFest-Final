from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials

# Replace with your Azure Face API key and endpoint
API_KEY = "your_face_api_key"
ENDPOINT = "https://your_face_api_endpoint"

# Authenticate the FaceClient
face_client = FaceClient(ENDPOINT, CognitiveServicesCredentials(API_KEY))

# URL of the image to analyze
image_url = "https://example.com/image.jpg"

# Detect face and analyze emotions
def analyze_emotions(image_url):
    try:
        # Define attributes to analyze
        attributes = ["emotion"]
        
        # Call the Face API
        detected_faces = face_client.face.detect_with_url(
            url=image_url,
            return_face_attributes=attributes
        )
        
        # Process and print results
        if not detected_faces:
            print("No faces detected.")
            return
        
        for face in detected_faces:
            print("Face ID:", face.face_id)
            print("Emotions:")
            for emotion, score in face.face_attributes.emotion.__dict__.items():
                if isinstance(score, float):  # Filter valid emotion scores
                    print(f"  {emotion}: {score:.2f}")
    except Exception as e:
        print("Error:", str(e))

# Run the emotion analysis
analyze_emotions(image_url)
