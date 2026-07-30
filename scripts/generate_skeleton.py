import os
import sys
import argparse
import json
import urllib.request
import urllib.error

# Import make_skeleton_transparent
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from remove_background import make_skeleton_transparent
except ImportError:
    # Fallback if run from a different CWD
    def make_skeleton_transparent(input_path, output_path, white_threshold=235):
        from PIL import Image
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        new_data = []
        for item in datas:
            r, g, b, a = item
            if r > white_threshold and g > white_threshold and b > white_threshold:
                gray = int((r + g + b) / 3.0)
                alpha = 255 - gray
                new_data.append((r, g, b, max(0, min(alpha, 255))))
            else:
                new_data.append((r, g, b, 255))
        img.putdata(new_data)
        img.save(output_path, "PNG", optimize=True)
        print(f"成功去背！已儲存至 {output_path}")

def generate_skeleton_image(animal, angle, output_path, api_key=None):
    """
    呼叫 Google Gemini/Imagen API 生成動物指定視角的白底骨骼圖，
    並自動進行去背處理（轉為透明 PNG）。
    """
    if not api_key:
        api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print("錯誤：找不到 GEMINI_API_KEY 環境變數，亦未透過參數傳入。")
        sys.exit(1)

    # 1. 根據視角決定 Prompt 與 aspect_ratio
    angle = angle.lower()
    if angle == "front":
        prompt = f"Scientific anatomical front-view skeleton of a {animal} in a standing pose. Charcoal pencil sketch, highly detailed medical drawing, bones clearly defined, clean skeleton structure, solid pure white background, isolated, high contrast, black lines only."
        aspect_ratio = "1:1"
    elif angle == "side":
        prompt = f"Anatomical side profile skeleton of a {animal} facing left, standing pose. Clean charcoal pencil sketch, medical drawing, precise bone structure, solid pure white background, isolated, black lines only."
        aspect_ratio = "3:2"
    elif angle == "threequarter" or angle == "three-quarter" or angle == "three_quarter":
        prompt = f"Anatomical three-quarter view skeleton of a {animal}, body angled at 45 degrees, facing left, standing pose. Charcoal pencil drawing, scientific illustration, precise joints, solid pure white background, isolated."
        aspect_ratio = "4:3"
    else:
        prompt = f"Anatomical skeleton drawing of a {animal}, solid pure white background, charcoal sketch, isolated."
        aspect_ratio = "1:1"

    print(f"開始為 {animal} ({angle}) 生成骨骼圖...")
    print(f"Prompt: {prompt}")
    print(f"比例: {aspect_ratio}")

    # 2. 呼叫 Imagen 3 API (使用 REST API)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key={api_key}"
    
    payload = {
        "numberOfImages": 1,
        "prompt": prompt,
        "aspectRatio": aspect_ratio,
        "outputMimeType": "image/jpeg",
        "personGeneration": "DONT_ALLOW"
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    temp_jpg = output_path + ".temp.jpg"

    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            
            # 提取 base64 影像資料
            image_base64 = res_data["generatedImages"][0]["image"]["imageBytes"]
            import base64
            with open(temp_jpg, "wb") as f:
                f.write(base64.b64decode(image_base64))
            print("AI 骨骼圖生成成功，開始執行去背作業...")
            
            # 3. 執行去背並輸出透明 PNG
            make_skeleton_transparent(temp_jpg, output_path)
            
            # 清理暫存檔
            if os.path.exists(temp_jpg):
                os.remove(temp_jpg)
                
            print(f"完成！已生成去背骨骼資產並存檔至: {output_path}")

    except urllib.error.HTTPError as e:
        print(f"API 請求失敗，HTTP 狀態碼: {e.code}")
        print(e.read().decode("utf-8"))
        sys.exit(1)
    except Exception as e:
        print(f"發生未預期的錯誤: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WildSketch AI 骨骼生成與去背工具")
    parser.add_argument("animal", help="動物名稱（英文，例如 cat, dog, deer）")
    parser.add_argument("angle", help="視角（front, side, threequarter）")
    parser.add_argument("output", help="輸出透明 PNG 的路徑")
    parser.add_argument("--api-key", help="Gemini API Key（選填，預設讀取環境變數）")
    
    args = parser.parse_args()
    generate_skeleton_image(args.animal, args.angle, args.output, args.api_key)
