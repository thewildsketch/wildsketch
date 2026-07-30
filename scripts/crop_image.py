import os
import argparse
from PIL import Image

def crop_and_resize(input_path, output_path, aspect_ratio_str, target_width=None, x_offset=None, y_offset=None):
    """
    將輸入圖片進行等比例置中裁剪 (Center Crop) 與縮放，符合指定的寬高比。
    支援手動指定 x_offset 或 y_offset 以防止主體（如頭部、雙耳或手腳）被切除。
    本工具遵守「嚴禁 AI 背景填充 (No AI Outpainting)」原則，僅對原圖進行實體裁剪。
    
    :param input_path: 輸入 JPG/PNG 圖片路徑
    :param output_path: 輸出 JPG/PNG 圖片路徑
    :param aspect_ratio_str: 目標寬高比，格式為 'W:H' (例如 '3:2', '1:1', '4:3')
    :param target_width: 輸出圖片的目標寬度（像素）。若未指定，則不縮放僅裁剪。
    :param x_offset: 手動指定 X 軸起點像素值（適用於寬圖）
    :param y_offset: 手動指定 Y 軸起點像素值（適用於長圖）
    """
    if not os.path.exists(input_path):
        print(f"錯誤：找不到輸入檔案 {input_path}")
        return

    # 1. 解析比例
    try:
        w_part, h_part = map(float, aspect_ratio_str.split(':'))
        target_ratio = w_part / h_part
    except Exception:
        print("錯誤：寬高比格式錯誤，應為 'W:H' (例如 '3:2')")
        return

    # 2. 載入圖片
    img = Image.open(input_path)
    orig_w, orig_h = img.size
    orig_ratio = orig_w / orig_h

    print(f"原始圖片尺寸: {orig_w}x{orig_h} (比例: {orig_ratio:.3f})")
    print(f"目標裁剪比例: {aspect_ratio_str} (比例: {target_ratio:.3f})")

    # 3. 計算裁剪區域
    if orig_ratio > target_ratio:
        # 原始圖片較寬，需要裁寬度 (X 軸)
        crop_w = int(orig_h * target_ratio)
        crop_h = orig_h
        crop_y = 0
        if x_offset is not None:
            crop_x = max(0, min(x_offset, orig_w - crop_w))
            print(f"使用手動 X 軸偏移量: {crop_x}")
        else:
            crop_x = (orig_w - crop_w) // 2
    else:
        # 原始圖片較長，需要裁高度 (Y 軸)
        crop_w = orig_w
        crop_h = int(orig_w / target_ratio)
        crop_x = 0
        if y_offset is not None:
            crop_y = max(0, min(y_offset, orig_h - crop_h))
            print(f"使用手動 Y 軸偏移量: {crop_y}")
        else:
            crop_y = (orig_h - crop_h) // 2

    print(f"裁剪區域: X={crop_x}, Y={crop_y}, W={crop_w}, H={crop_h}")
    cropped_img = img.crop((crop_x, crop_y, crop_x + crop_w, crop_y + crop_h))

    # 4. 縮放至目標寬度 (如果指定)
    if target_width:
        target_height = int(target_width / target_ratio)
        print(f"等比例縮放至: {target_width}x{target_height}")
        resample_method = Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.ANTIALIAS
        final_img = cropped_img.resize((target_width, target_height), resample_method)
    else:
        final_img = cropped_img

    # 5. 確保目標資料夾存在
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    # 6. 存檔
    ext = os.path.splitext(output_path)[1].lower()
    save_format = "JPEG" if ext in [".jpg", ".jpeg"] else "PNG"
    
    if save_format == "JPEG" and final_img.mode in ("RGBA", "P"):
        final_img = final_img.convert("RGB")
        
    final_img.save(output_path, format=save_format, quality=90, optimize=True)
    print(f"成功儲存裁剪後圖片至: {output_path} (尺寸: {final_img.size[0]}x{final_img.size[1]})")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WildSketch 圖片置中裁剪與等比例縮放工具")
    parser.add_argument("input", help="輸入圖片路徑")
    parser.add_argument("output", help="輸出圖片路徑")
    parser.add_argument("ratio", help="目標寬高比 (例如 '3:2', '1:1', '4:3')")
    parser.add_argument("--width", type=int, default=None, help="目標輸出寬度 (像素)")
    parser.add_argument("--x-offset", type=int, default=None, help="手動指定 X 軸起點像素值（適用於寬圖）")
    parser.add_argument("--y-offset", type=int, default=None, help="手動指定 Y 軸起點像素值（適用於長圖）")
    
    args = parser.parse_args()
    crop_and_resize(args.input, args.output, args.ratio, args.width, args.x_offset, args.y_offset)
