import pyttsx3
import time

print("Testing Voice Engine...")
try:
    engine = pyttsx3.init()
    engine.say("Testing voice system. One, two, three.")
    engine.runAndWait()
    print("Voice test completed successfully.")
except Exception as e:
    print(f"Voice test failed: {e}")
