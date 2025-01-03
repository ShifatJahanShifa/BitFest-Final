import asyncio
import base64
import json
import os
import pyaudio
import azure.cognitiveservices.speech as speechsdk
from websockets.asyncio.client import connect
from dotenv import load_dotenv

load_dotenv()

class SimpleGeminiVoice:
    def __init__(self):
        self.audio_queue = asyncio.Queue()
        api_key = os.getenv("GOOGLE_GEMINI_API_KEY")
        self.model = "gemini-2.0-flash-exp"
        self.uri = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key={api_key}"
        # Audio settings
        self.FORMAT = pyaudio.paInt16
        self.CHANNELS = 1
        self.CHUNK = 512
        self.RATE = 16000
        self.stop_event = asyncio.Event()  # Stop signal

    async def start(self):
        # Initialize websocket
        self.ws = await connect(
            self.uri, additional_headers={"Content-Type": "application/json"}
        )
        await self.ws.send(json.dumps({"setup": {"model": f"models/{self.model}"}}))
        await self.ws.recv(decode=False)
        print("Connected to Gemini, You can start talking now")

        # Start audio streaming and command listening
        async with asyncio.TaskGroup() as tg:
            tg.create_task(self.capture_audio())
            tg.create_task(self.stream_audio())
            tg.create_task(self.play_response())
            tg.create_task(self.listen_for_stop())  # New task to listen for stop command

    async def capture_audio(self):
        audio = pyaudio.PyAudio()
        stream = audio.open(
            format=self.FORMAT,
            channels=self.CHANNELS,
            rate=self.RATE,
            input=True,
            frames_per_buffer=self.CHUNK,
        )
        try:
            while not self.stop_event.is_set():
                data = await asyncio.to_thread(stream.read, self.CHUNK)
                await self.ws.send(
                    json.dumps(
                        {
                            "realtime_input": {
                                "media_chunks": [
                                    {
                                        "data": base64.b64encode(data).decode(),
                                        "mime_type": "audio/pcm",
                                    }
                                ]
                            }
                        }
                    )
                )
        finally:
            stream.stop_stream()
            stream.close()
            audio.terminate()

    async def stream_audio(self):
        async for msg in self.ws:
            response = json.loads(msg)
            try:
                audio_data = response["serverContent"]["modelTurn"]["parts"][0][
                    "inlineData"
                ]["data"]
                self.audio_queue.put_nowait(base64.b64decode(audio_data))
            except KeyError:
                pass
            try:
                turn_complete = response["serverContent"]["turnComplete"]
            except KeyError:
                pass
            else:
                if turn_complete:
                    print("\nEnd of turn")
                    while not self.audio_queue.empty():
                        self.audio_queue.get_nowait()

    async def play_response(self):
        audio = pyaudio.PyAudio()
        stream = audio.open(
            format=self.FORMAT, channels=self.CHANNELS, rate=24000, output=True
        )
        try:
            while not self.stop_event.is_set():
                data = await self.audio_queue.get()
                await asyncio.to_thread(stream.write, data)
        finally:
            stream.stop_stream()
            stream.close()
            audio.terminate()

    async def listen_for_stop(self):
        """Listen for user input to stop the process."""
        while not self.stop_event.is_set():
            user_input = await asyncio.to_thread(input, "Type 'stop' to end: ")
            if user_input.lower() == "stop":
                await self.stop()

    async def stop(self):
        """Stop the process and clean up resources."""
        self.stop_event.set()
        if self.ws:
            await self.ws.close()
        print("Stopped and cleaned up resources.")


if __name__ == "__main__":
    client = SimpleGeminiVoice()
    try:
        asyncio.run(client.start())
    except KeyboardInterrupt:
        print("KeyboardInterrupt: Stopping the client.")
