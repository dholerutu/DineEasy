from pathlib import Path
import qrcode

SITE_URL = "https://dholerutu.github.io/DineEasy/"
OUTPUT = Path(__file__).with_name("1_qrcode.png")

qrcode.make(SITE_URL).save(OUTPUT)
print(f"QR code saved to {OUTPUT}")
print(f"It opens {SITE_URL}")
