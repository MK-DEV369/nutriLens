import asyncio
import socket

async def is_server_running():
    """Check if the server is running by attempting to connect to the port."""
    loop = asyncio.get_event_loop()
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setblocking(False)
        try:
            await loop.sock_connect(sock, ('127.0.0.1', 5000))
            return True
        except (ConnectionRefusedError, OSError):
            return False

async def start_server():
    """Start the server if it's not already running."""
    if not await is_server_running():
        print("Starting server...")
        process = await asyncio.create_subprocess_exec(
            "python", "app.py",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        print("Server started")
        stdout, stderr = await process.communicate()
        print(stdout.decode() if stdout else "No stdout")
        print(stderr.decode() if stderr else "No stderr")
    else:
        print("Server already running")

if __name__ == "__main__":
    asyncio.run(start_server())
