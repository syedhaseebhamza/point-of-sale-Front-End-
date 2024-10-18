import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDFReceipt = (data: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 200],
  });

  const options = { timeZone: "Asia/Karachi", hour12: true };
  const orderDate = new Date(data.Date).toLocaleString("en-PK", options);

  doc.setFontSize(12);
  doc.text(`Order: ${data.orderId}`, 40, 10, { align: "center" });

  doc.setFontSize(8);
  doc.text(orderDate, 40, 20, { align: "center" });

  const tableData = data.productData.map((item: any) => [
    item.productQuantity,
    item.productName,
    item.productPrice.toFixed(2),
    (item.productPrice * item.productQuantity).toFixed(2),
  ]);

  //   @ts-ignore
  doc.autoTable({
    startY: 30,
    head: [["Qty", "Item", "Price", "Total"]],
    body: tableData,
    theme: "plain",
    styles: { fontSize: 8 },
    headStyles: { halign: "center", fontStyle: "bold" },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
    },
    didDrawCell: (data: any) => {
      const doc = data.doc;

      if (data.column.index < 3) {
        doc.setLineDash([1, 1], 0);
        doc.line(
          data.cell.x + data.cell.width,
          data.cell.y,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }

      if (data.row.index < data.table.body.length - 1) {
        doc.setLineDash([1, 1], 0);
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    },
  });

  //   @ts-ignore
  const finalY = doc.autoTable.previous.finalY;

  doc.setFontSize(8);
  doc.text("Sale", 40, finalY + 10, { align: "center" });

  const subtotal = data.productData
    .reduce(
      (acc: any, item: any) => acc + item.productPrice * item.productQuantity,
      0
    )
    .toFixed(2);
  const discount = data.discount.toFixed(2);
  const total = data.totalPrice.toFixed(2);

  doc.text(`Subtotal: ${subtotal}`, 40, finalY + 20, { align: "center" });
  doc.text(`Discount: ${discount}`, 40, finalY + 25, { align: "center" });
  doc.text(`Total: ${total}`, 40, finalY + 30, { align: "center" });

  doc.setFontSize(10);
  doc.text("Customer Copy", 40, finalY + 50, { align: "center" });
  doc.text("Thanks for visiting", 40, finalY + 55, { align: "center" });

  doc.save(`Order-${data.orderId}.pdf`);
};
