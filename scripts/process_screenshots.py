import os
from PIL import Image, ImageOps

# iPad Pro 12.9" Resolution
TARGET_SIZE = (2048, 2732)

INPUT_FILES = [
    "/Users/tongxu/Projects/pro-gemini5/voiceagent-rn/截屏2026-02-12 12.08.13.png",
    "/Users/tongxu/Projects/pro-gemini5/voiceagent-rn/截屏2026-02-12 12.11.23.png",
    "/Users/tongxu/Projects/pro-gemini5/voiceagent-rn/截屏2026-02-12 12.12.00.png"
]

OUTPUT_DIR = "/Users/tongxu/Projects/pro-gemini5/voiceagent-rn/screenshots_processed_ipad"

def process_image(filepath, index):
    try:
        print(f"Processing: {filepath}")
        img = Image.open(filepath).convert("RGBA")
        
        # 1. Trim transparency/shadow (Get Bounding Box with Threshold)
        # Standard getbbox() considers any non-zero alpha as content.
        # We need to trim soft shadows (low alpha).
        # We'll create a binary mask where alpha > 250 and get bbox of that.
        alpha = img.split()[-1]
        bbox = alpha.point(lambda p: 255 if p > 50 else 0).getbbox() # Threshold 50 covers the main object usually
        
        # If we want to be very strict and remove ALL shadow, we might need a higher threshold or different logic.
        # macOS Window screenshots usually have a distinct shadow.
        # Let's try aggressive cropping.
        if bbox:
            # Re-crop the original image to this bbox
            img = img.crop(bbox)
            print(f"  Cropped to content bbox (threshold > 50): {bbox}")
        
        # 2. Resize to iPad Pro Resolution
        # We will use resize (stretch) as aspect ratio correction
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        
        # 3. Save as solid PNG (keeping alpha if it's the shape of the iPad)
        # If the user wants "only iPad body", they might mean the shape.
        # We'll keep it as RGBA to preserve the shape if it has rounded corners/bezel.
        
        filename = os.path.basename(filepath)
        name, ext = os.path.splitext(filename)
        output_path = os.path.join(OUTPUT_DIR, f"iPad_Clean_{index+1}_{name}.png")
        img.save(output_path, "PNG")
        print(f"  Saved: {output_path}")
        return output_path

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return None

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    generated_files = []
    for i, filepath in enumerate(INPUT_FILES):
        path = process_image(filepath, i)
        if path:
            generated_files.append(path)

    print("\nProcessing Complete. Generated files:")
    for f in generated_files:
        print(f)

if __name__ == "__main__":
    main()
