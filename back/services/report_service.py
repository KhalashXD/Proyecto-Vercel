from io import BytesIO
from typing import Iterable

from openpyxl import Workbook
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle


def _format_datetime(value):
    if not value:
        return ""

    return value.strftime("%d-%m-%Y %H:%M")


def _incident_rows(incidents: Iterable[dict]):
    rows = []

    for incident in incidents:
        rows.append(
            [
                incident.get("incident_code", ""),
                incident.get("emergency_code", ""),
                incident.get("emergency_name", ""),
                f"{incident.get('street_1', '')} con {incident.get('street_2', '')}",
                incident.get("status", ""),
                incident.get("priority", ""),
                _format_datetime(incident.get("created_at")),
                _format_datetime(incident.get("closed_at")),
                ", ".join(incident.get("assigned_vehicles", [])),
            ]
        )

    return rows


def generar_historial_excel(incidents: Iterable[dict]) -> BytesIO:
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Historial"

    headers = [
        "Codigo",
        "Clave",
        "Tipo emergencia",
        "Ubicacion",
        "Estado",
        "Prioridad",
        "Creado",
        "Cerrado",
        "Vehiculos asignados",
    ]

    sheet.append(headers)

    for row in _incident_rows(incidents):
        sheet.append(row)

    for column_cells in sheet.columns:
        max_length = max(
            len(str(cell.value or ""))
            for cell in column_cells
        )
        sheet.column_dimensions[column_cells[0].column_letter].width = min(
            max(max_length + 2, 12),
            42,
        )

    for cell in sheet[1]:
        cell.font = cell.font.copy(bold=True)

    output = BytesIO()
    workbook.save(output)
    output.seek(0)

    return output


def generar_historial_pdf(incidents: Iterable[dict]) -> BytesIO:
    output = BytesIO()
    document = SimpleDocTemplate(
        output,
        pagesize=landscape(letter),
        rightMargin=24,
        leftMargin=24,
        topMargin=24,
        bottomMargin=24,
    )

    styles = getSampleStyleSheet()
    elements = [
        Paragraph("Historial de Emergencias", styles["Title"]),
        Spacer(1, 12),
    ]

    headers = [
        "Codigo",
        "Clave",
        "Ubicacion",
        "Estado",
        "Creado",
        "Cerrado",
        "Vehiculos",
    ]

    rows = [
        [
            row[0],
            row[1],
            row[3],
            row[4],
            row[6],
            row[7],
            row[8],
        ]
        for row in _incident_rows(incidents)
    ]

    table = Table(
        [headers] + rows,
        repeatRows=1,
        colWidths=[72, 54, 190, 72, 92, 92, 150],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f47633")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#dddddd")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7f7f7")]),
            ]
        )
    )

    if rows:
        elements.append(table)
    else:
        elements.append(Paragraph("No hay registros en el historial.", styles["Normal"]))

    document.build(elements)
    output.seek(0)

    return output
