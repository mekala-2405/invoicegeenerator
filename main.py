from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import mm
import datetime
"""
(y↑)
841 ─────────────────────── top (0, height)
    |                      ↑
    |                      |
    |                      |
    |                      | 
    |                      |
    |                      ↓
 0  ─────────────────────── bottom (0, 0) → x→
    0                    595
"""
def gen_invoice(ref_num, date, due_date, issued_to, pay_to, items, tax_rate, filename):
    #Temp location for file storage on the desktop of cuurent Windows User. Need to create folders for different company profiles at desired user location.
    save_path = os.path.join(os.path.expanduser("~"), "Desktop/", filename)
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4

    margin_x = 40
    y = height - 40

    # Title
    title = "INVOICE"
    font_name = "Helvetica-Bold"
    font_size = 26
    c.setFont(font_name, font_size)

    # Get text width and calculate x position
    #had to use this approach as the invoice title isnt centered
    text_width = c.stringWidth(title, font_name, font_size)
    x = (width - text_width) / 2
    c.drawString(x, y, title)

    # Invoice Info
    c.setFont("Helvetica-Bold", 10)
    c.drawRightString(width - margin_x, y, f"INVOICE NO:   {ref_num}")
    y -= 15 #to go a line down
    c.drawRightString(width - margin_x, y, f"DATE:          {date}")
    y -= 15
    c.drawRightString(width - margin_x, y, f"DUE DATE:      {due_date}")
    y = height - 120

    # Issued To
    c.setFont("Helvetica-Bold", 10)
    c.drawString(margin_x, y, "ISSUED TO:")
    y -= 12
    c.setFont("Helvetica", 10)
    for line in issued_to:
        c.drawString(margin_x, y, line)
        y -= 12

    y -= 20
    # Pay To
    c.setFont("Helvetica-Bold", 10)
    c.drawString(margin_x, y, "PAY TO:")
    y -= 12
    c.setFont("Helvetica", 10)
    for line in pay_to:
        c.drawString(margin_x, y, line)
        y -= 12

    y -= 40

    # Table Headers
    col_x = [margin_x, margin_x + 240, margin_x + 340, margin_x + 400]
    c.setFont("Helvetica-Bold", 10)
    c.drawString(col_x[0], y, "DESCRIPTION")
    c.drawString(col_x[1], y, "UNIT PRICE")
    c.drawString(col_x[2], y, "QTY")
    c.drawString(col_x[3], y, "TOTAL")
    y -= 5

    # Line
    c.setStrokeColor(colors.black)
    c.line(margin_x, y, width - margin_x, y)
    y -= 15

    # Table Rows
    c.setFont("Helvetica", 10)
    subtotal = 0
    for desc, unit_price, qty in items:
        total = unit_price * qty
        subtotal += total
        c.drawString(col_x[0], y, desc)
        c.drawString(col_x[1], y, f"${unit_price}")
        c.drawString(col_x[2], y, f"{qty}")
        c.drawString(col_x[3], y, f"${total}")
        y -= 15

    y -= 10
    c.line(margin_x, y, width - margin_x, y)

    # Subtotal & Total
    y -= 20
    c.setFont("Helvetica-Bold", 10)
    c.drawRightString(width - margin_x - 80, y, "SUBTOTAL:")
    c.drawRightString(width - margin_x, y, f"${subtotal}")

    tax_amount = round(subtotal * tax_rate / 100, 2)
    y -= 15
    c.drawRightString(width - margin_x - 80, y, f"Tax ({tax_rate}%):")
    c.drawRightString(width - margin_x, y, f"${tax_amount}")

    total = subtotal + tax_amount
    y -= 15
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(width - margin_x - 80, y, "TOTAL:")
    c.drawRightString(width - margin_x, y, f"${total}")

    # Signature line
    y -= 60
    c.line(margin_x, y, margin_x + 120, y)
    c.setFont("Helvetica", 9)
    c.drawString(margin_x, y - 12, "Signature")

    c.save()

# 🔧 Example usage
gen_invoice(
    ref_num="01234",
    date="11.02.2030",
    due_date="11.03.2030",
    issued_to=[
        "Richard Sanchez",
        "Thynk Unlimited",
        "123 Anywhere St., Any City"
    ],
    pay_to=[
        "Borcele Bank",
        "Account Name: Adeline Palmerston",
        "Account No.: 0123 4567 8901"
    ],
    items=[
        ("Brand consultation", 100, 1),
        ("Logo design", 100, 1),
        ("Website design", 100, 1),
        ("Social media templates", 100, 1),
        ("Brand photography", 100, 1),
        ("Brand guide", 100, 1),
    ],
    tax_rate=10,
    filename="final_invoice.pdf"
)
