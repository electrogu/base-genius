import requests
import json
import os
import google.generativeai as genai

# =============================================================================
# AYARLAR
# =============================================================================
NEYNAR_API_KEY = "242D8AD2-0469-4C75-A391-044524A20554"      # Neynar Key'in
GEMINI_API_KEY = "AIzaSyDOfqHgQKWP-ucDRd87cRk0T8CI7914NdU"      # aistudio.google.com'dan aldığın ücretsiz key

# Gemini Konfigürasyonu
genai.configure(api_key=GEMINI_API_KEY)

def get_farcaster_trends():
    """Neynar API ile son haftanın trendlerini çeker."""
    url = "https://api.neynar.com/v2/farcaster/feed/trending"
    
    headers = {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY
    }
    
    params = {
        "limit": 50,          # 50 gönderi çekelim
        "time_window": "7d",  # 7 günlük veri
        "provider": "neynar"
    }
    
    print("📡 Neynar API'den veri çekiliyor...")
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            casts = data.get('casts', [])
            
            combined_text = ""
            for cast in casts:
                text = cast.get('text', '').replace("\n", " ")
                if text:
                    combined_text += f"- {text}\n"
            
            print(f"✅ {len(casts)} adet gönderi çekildi.")
            return combined_text
        else:
            print(f"❌ Veri çekme hatası: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Bağlantı hatası: {e}")
        return None

def generate_questions_with_gemini(context_text):
    """Gemini 1.5 Flash kullanarak ücretsiz soru üretir."""
    
    if not context_text:
        return []

    # Bedava ve hızlı olan model: gemini-1.5-flash
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""
    Sen bir soru üretme uzmanısın. Aşağıdaki metin Farcaster sosyal ağındaki son bir haftanın gündemidir.
    
    GÖREV:
    Bu metni analiz et ve içindeki bilgilerden **tam 50 adet** soru ve cevap oluştur.
    
    ÇIKTI FORMATI:
    Sadece ve sadece geçerli bir JSON listesi döndür.
    Örnek:
    [
      {{"soru": "Konu nedir?", "cevap": "Konu X'tir."}},
      {{"soru": "Kim ne dedi?", "cevap": "Y kişisi Z dedi."}}
    ]
    
    METİN:
    {context_text}
    """

    print("⚡ Gemini (Ücretsiz) soruları düşünüyor...")

    try:
        # JSON formatında çıktı vermesi için generation_config ekleyebiliriz
        # ama Gemini Flash düz promptla da JSON'u çok iyi verir.
        response = model.generate_content(prompt)
        
        text_response = response.text
        
        # Markdown temizliği (```json ... ``` kısımlarını atar)
        text_response = text_response.replace("```json", "").replace("```", "").strip()
        
        return json.loads(text_response)

    except Exception as e:
        print(f"❌ Gemini hatası: {e}")
        # Hata durumunda boş liste dön
        return []

def save_to_json(data, filename="farcaster_sorular.json"):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"💾 Dosya kaydedildi: {os.path.abspath(filename)}")

# --- ANA PROGRAM ---
if __name__ == "__main__":
    
    # 1. Veriyi Al
    raw_text = get_farcaster_trends()
    
    if raw_text:
        # 2. Gemini'ye Gönder
        questions = generate_questions_with_gemini(raw_text)
        
        if questions:
            print(f"Toplam {len(questions)} soru oluşturuldu.")
            # 3. Kaydet
            save_to_json(questions)
        else:
            print("Soru üretilemedi.")