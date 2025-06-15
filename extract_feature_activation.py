import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import matplotlib.pyplot as plt
import requests
from io import BytesIO
import numpy as np
import os

motive = 'labrador'

model = models.resnet18(pretrained=True)
model.eval()

features = {}
def get_features(name):
    def hook(model, input, output):
        features[name] = output.detach()
    return hook

model.conv1.register_forward_hook(get_features('conv1'))

layer_count = 1
for layer_name in ['layer1', 'layer2', 'layer3', 'layer4']:
    layer = getattr(model, layer_name)
    for block_idx, block in enumerate(layer):
        for conv_name in ['conv1', 'conv2']:
            conv_layer = getattr(block, conv_name)
            hook_name = f'{layer_name}_{block_idx}_{conv_name}'
            conv_layer.register_forward_hook(get_features(hook_name))
            layer_count += 1


url = "https://raw.githubusercontent.com/EliSchwartz/imagenet-sample-images/refs/heads/master/n01704323_triceratops.JPEG" # triceratops
url = "https://raw.githubusercontent.com/EliSchwartz/imagenet-sample-images/refs/heads/master/n02007558_flamingo.JPEG" # flamingo
url = "https://raw.githubusercontent.com/EliSchwartz/imagenet-sample-images/refs/heads/master/n02051845_pelican.JPEG" # pelican
url = "https://raw.githubusercontent.com/EliSchwartz/imagenet-sample-images/refs/heads/master/n02391049_zebra.JPEG" #zebra
url = "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg" # labrador
response = requests.get(url)
img = Image.open(BytesIO(response.content)).convert('RGB')

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])
input_tensor = preprocess(img).unsqueeze(0)

_ = model(input_tensor)

original_img = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
])(img)

base_dir = motive
os.makedirs(base_dir, exist_ok=True)
original_img.save(os.path.join(base_dir, f'{motive}.png'))

def upsample_feature_map(fmap, size=(224, 224)):
    fmap = fmap.unsqueeze(0)
    fmap_upsampled = F.interpolate(fmap, size=size, mode='bilinear', align_corners=False)
    return fmap_upsampled[0]

for lname in features:
    os.makedirs(os.path.join(base_dir, lname), exist_ok=True)

for lname, fmap in features.items():
    fmap = fmap[0]
    fmap_upsampled = upsample_feature_map(fmap, size=(224, 224))

    for i in range(min(16, fmap_upsampled.shape[0])):
        act = fmap_upsampled[i].cpu()
        act = act - act.min()
        act = act / (act.max() + 1e-5)

        plt.figure(figsize=(4, 4))
        plt.imshow(original_img)
        plt.imshow(act.numpy(), cmap='inferno', alpha=0.5)
        plt.axis('off')

        save_path = os.path.join(base_dir, lname, f'feature_{i:03d}.png')
        plt.savefig(save_path, bbox_inches='tight', pad_inches=0)
        plt.close()
