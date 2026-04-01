from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Encabezado
        self.image('header201.png', x=10, y=8, w=190)  # Ajusta la posición y tamaño
        self.set_y(30)  # Ajusta el margen después del encabezado

    def footer(self):
        # Pie de página
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Pág.{self.page_no()} - Informe obtenido de Phoenix SOS', 0, 0, 'C')

    def add_table(self, data, col_widths):
        self.set_font('Arial', '', 10)
        for row in data:
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 10, str(cell), border=1, align='C')
            self.ln()

# Datos de ejemplo
data = [
    ['Nombre', 'Edad', 'Ciudad'],
    ['Juan', '25', 'Santiago'],
    ['Ana', '30', 'Lima'],
    ['Pedro', '28', 'Bogotá']
]

# Ancho de las columnas
col_widths = [40, 30, 50]

# Crear PDF
pdf = PDF()
pdf.add_page()
pdf.set_font('Arial', 'B', 14)
pdf.ln(10)

# Agregar tabla
pdf.add_table(data, col_widths)

# Guardar PDF
pdf.output('informe.pdf')
