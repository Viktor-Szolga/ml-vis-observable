import os
import pyperclip

folder = "src\\data\\vis"
clip = ""

for animal in os.listdir(folder):
    if animal == "original.png" or "_" in animal or animal == "conv1":
        continue
    clip += f'{animal}: FileAttachment("data/vis/{animal}/{animal}.png"),\n'
    for dir in os.listdir(os.path.join(folder, animal)):
        if dir != f"{animal}.png":
            for i, file in enumerate(os.listdir(os.path.join("src\\data\\vis", animal, dir))):
                clip += f'{animal}_{dir}_{i}: FileAttachment("data/vis/{animal}/{dir}/feature_{i:03d}.png"),\n'
pyperclip.copy(clip)

print("Done")