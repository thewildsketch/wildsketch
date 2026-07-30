import os
import numpy as np
from PIL import Image


def make_skeleton_transparent(input_path, output_path, white_threshold=235, max_size_mb=1.0):
    """
    將骨架圖片的純白背景轉為透明，同時保留炭筆線條的半透明邊緣，且維持畫布尺寸不變。
    若輸出檔案超過指定大小上限，會逐步縮小尺寸重新存檔，直到符合限制。

    :param input_path: 輸入的黑白 JPG 骨架圖路徑
    :param output_path: 輸出的透明 PNG 骨架圖路徑
    :param white_threshold: 判定為背景的白色亮度閾值（0-255，大於此值將被設為透明）
    :param max_size_mb: 輸出檔案大小上限（單位 MB），超過會自動縮小尺寸重存
    """
    if not os.path.exists(input_path):
        print(f"錯誤：找不到輸入檔案 {input_path}")
        return

    # 1. 載入圖片並轉為 RGBA 模式
    img = Image.open(input_path).convert("RGBA")
    arr = np.array(img)  # shape: (H, W, 4), dtype=uint8

    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    # 判斷背景區域：RGB 三通道皆大於閾值
    is_bg = (r > white_threshold) & (g > white_threshold) & (b > white_threshold)

    gray = (r.astype(np.int32) + g + b) / 3.0
    alpha_bg = np.clip(255 - gray, 0, 255).astype(np.uint8)

    new_alpha = np.where(is_bg, alpha_bg, 255).astype(np.uint8)
    arr[..., 3] = new_alpha

    img = Image.fromarray(arr, mode="RGBA")

    # 2. 存檔為透明 PNG（維持畫布物理尺寸，不作 Trim 裁剪）
    max_size_bytes = max_size_mb * 1024 * 1024

    img.save(output_path, "PNG", optimize=True, compress_level=9)
    file_size = os.path.getsize(output_path)

    # 若超過上限，逐步縮小尺寸重新存檔，直到符合限制或縮到最小可接受尺寸
    scale = 1.0
    min_scale = 0.3  # 避免無限縮小，最多縮到原尺寸的 30%
    current_img = img
    while file_size > max_size_bytes and scale > min_scale:
        scale -= 0.1
        new_w = max(1, int(img.size[0] * scale))
        new_h = max(1, int(img.size[1] * scale))
        current_img = img.resize((new_w, new_h), Image.LANCZOS)
        current_img.save(output_path, "PNG", optimize=True, compress_level=9)
        file_size = os.path.getsize(output_path)

    size_mb = file_size / (1024 * 1024)
    print(f"成功去背！資產已儲存至：{output_path} "
          f"(尺寸: {current_img.size[0]}x{current_img.size[1]} px, 檔案大小: {size_mb:.2f} MB)")


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("用法: python remove_background.py <input_jpg> <output_png> [threshold] [max_size_mb]")
    else:
        threshold = int(sys.argv[3]) if len(sys.argv) > 3 else 235
        max_size = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
        make_skeleton_transparent(sys.argv[1], sys.argv[2], threshold, max_size)
