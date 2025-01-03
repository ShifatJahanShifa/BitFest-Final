import asyncio

async def example_task():
    print("Starting task")
    await asyncio.sleep(1)
    print("Task completed")

async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(example_task())
            # Add more tasks if necessary
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())
