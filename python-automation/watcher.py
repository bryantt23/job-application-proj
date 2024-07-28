import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import os


class Watcher:
    def __init__(self, directory_to_watch, script_to_run):
        self.DIRECTORY_TO_WATCH = directory_to_watch
        self.script_to_run = script_to_run
        self.observer = Observer()

    def run(self):
        event_handler = Handler(self.script_to_run)
        self.observer.schedule(
            event_handler, self.DIRECTORY_TO_WATCH, recursive=False)
        self.observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.observer.stop()
        self.observer.join()


class Handler(FileSystemEventHandler):
    def __init__(self, script_to_run):
        self.script_to_run = script_to_run

    def on_modified(self, event):
        if event.src_path.endswith(".py"):
            print(f'{event.src_path} has been modified')
            self.run_script()

    def on_created(self, event):
        if event.src_path.endswith(".py"):
            print(f'{event.src_path} has been created')
            self.run_script()

    def run_script(self):
        print(f'Running script: {self.script_to_run}')
        subprocess.run(["python", self.script_to_run], check=True)


if __name__ == '__main__':
    # Directory to watch
    directory_to_watch = os.path.dirname(os.path.abspath(__file__))
    # Script to run when changes are detected
    script_to_run = os.path.join(directory_to_watch, 'job_apply.py')

    watcher = Watcher(directory_to_watch, script_to_run)
    watcher.run()
