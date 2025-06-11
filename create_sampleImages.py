import os
import pyperclip

sampleImages = 'original: FileAttachment("data/vis/original.png"),'

for folder in os.listdir("src\\data\\vis"):
    if folder != "original.png":
        for i, file in enumerate(os.listdir(os.path.join("src\\data\\vis", folder))):
            sampleImages += f'{folder}_{i}: FileAttachment("data/vis/{folder}/feature_{i:03d}.png"),\n'
pyperclip.copy(sampleImages)

print("Done")