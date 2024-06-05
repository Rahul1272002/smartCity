import argparse
from pathlib import Path
from ultralytics.models import load_model  # Replace yolov5 with ultralytics
from ultralytics.utils import torch_utils, plots  # Replace yolov5 with ultralytics
from PIL import Image
import torch

def detect(image_path):
    img = Image.open(image_path)
    img_tensor = transforms.ToTensor()(img).unsqueeze_(0).to(device)

    results = model(img_tensor)[0]
    return results

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', type=str, default='best.pt', help='model.pt path')
    parser.add_argument('--img-size', type=int, default=640, help='inference size (pixels)')
    parser.add_argument('--source', type=str, default='data/images', help='source')  # file/folder, 0 for webcam
    opt = parser.parse_args()

    device = torch_utils.select_device('')
    model = load_model(opt.weights, map_location=device)  # Load the YOLOv8 model

    model.to(device).eval()

    with torch.no_grad():
        results = detect(opt.source)

    # Process and print the results as needed
    print(results)