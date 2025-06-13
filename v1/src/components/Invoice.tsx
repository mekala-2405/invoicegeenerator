import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TextInput } from "./TextInput";
import { TextArea } from "./TextArea";
import { Item, type ItemDataType } from "./Item";
import { InvoicePdf } from "./InvoicePdf";

export const Invoice = () => {
  const [pdfData, setPdfData] = useState({});
  const [isError, setIsError] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [billToName, setBillToName] = useState<string>("");
  const [billToAddress, setBillToAddress] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<number>(0);
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [displayPdf, setDisplayPdf] = useState<boolean>(false);
  const [terms, setTerms] = useState<string>("");
  const [items, setItems] = useState<{ id: number; data: ItemDataType }[]>([
    {
      id: 0,
      data: { description: "", qty: 1, price: 0, discount: 0, gst: 0 },
    },
  ]);
  const itemIdCounter = useRef(1);

  const downloadInvoice = async () => {
    const input = document.getElementById("invoice-content");

    if (!input) {
      alert("Invoice content not found");
      return;
    }

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  const calculateTotals = () => {
    let itemTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    items.forEach(({ data }) => {
      const { qty, price, discount, gst } = data;
      const baseAmount = qty * price;
      const discountAmount = baseAmount * (discount / 100);
      const amountAfterDiscount = baseAmount - discountAmount;
      const gstAmount = amountAfterDiscount * (gst / 100);

      itemTotal += amountAfterDiscount;
      totalDiscount += discountAmount;
      totalTax += gstAmount;
    });

    const totalAmount = itemTotal + totalTax;

    return {
      itemTotal,
      totalDiscount,
      totalTax,
      totalAmount,
    };
  };

  const { itemTotal, totalDiscount, totalTax, totalAmount } = calculateTotals();

  const updateItem = (id: number, data: ItemDataType) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, data } : item)),
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const addItem = () => {
    const newId = itemIdCounter.current++;
    const newItem: { id: number; data: ItemDataType } = {
      id: newId,
      data: { description: "", qty: 1, price: 0, discount: 0, gst: 0 },
    };
    setItems((prev) => [...prev, newItem]);
  };

  const resetForm = () => {
    setCompanyName("");
    setCompanyAddress("");
    setBillToName("");
    setBillToAddress("");
    setInvoiceNumber(0);
    setInvoiceDate("");
    setDueDate("");
    setNotes("");
    setTerms("");
    setItems([
      {
        id: 0,
        data: { description: "", qty: 1, price: 0, discount: 0, gst: 0 },
      },
    ]);
    itemIdCounter.current = 1;
  };

  const saveForm = async () => {
    if (
      !companyName ||
      !companyAddress ||
      !billToName ||
      !billToAddress ||
      invoiceNumber <= 0 ||
      !invoiceDate ||
      !dueDate ||
      items.length === 0
    ) {
      setIsError(true);
      return;
    }
    const invoiceData = {
      companyName,
      companyAddress,
      billToName,
      billToAddress,
      invoiceNumber: invoiceNumber.toString(),
      invoiceDate,
      dueDate,
      notes,
      terms,
      items: items.map((item) => item.data),
    };
    setPdfData(invoiceData);
    setDisplayPdf(true);
  };
  return !displayPdf ? (
    <div className="flex flex-col items-center gap-10">
      <div className="overflow-x-hidden h-[1122px] overflow-y-visible w-1/2 font-normal text-base overflow-hidden items-center flex flex-col text-black rounded-2xl bg-gradient-to-b from-white to-white/95">
        <div className="h-4 bg-blue-500 w-full"></div>
        <div className="w-full px-10 py-5 flex flex-col gap-4">
          <div className="flex w-full">
            <div className="flex flex-col w-1/2 gap-4">
              <div className="flex flex-col gap-2">
                {/* <div className="h-20 border border-dotted w-72 border-slate-300 flex justify-center items-center text-gray-500"> */}
                {/*   Logo */}
                {/* </div> */}
                <TextInput
                  placeholder="Enter Your Company's Name"
                  text={companyName}
                  onChange={setCompanyName}
                />
                <TextArea
                  placeholder="Enter Your Company's Address"
                  text={companyAddress}
                  onChange={setCompanyAddress}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div>Bill To</div>
                <TextInput
                  placeholder="Company Name"
                  text={billToName}
                  onChange={setBillToName}
                />
                <TextArea
                  placeholder="Company Address"
                  text={billToAddress}
                  onChange={setBillToAddress}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2 gap-4 items-end">
              <div className="pb-10 text-black/80 font-extrabold text-4xl">
                Invoice
              </div>
              <div className="flex gap-2 w-full justify-end">
                <div className="w-44 p-2">Invoice Number:</div>
                <input
                  type="number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(Number(e.target.value))}
                  className="w-32 bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
                  placeholder="Number"
                />
              </div>
              <div className="flex gap-2 w-full justify-end">
                <div className="w-44 p-2">Invoice Date:</div>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-32 bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
                  placeholder="Number"
                />
              </div>
              <div className="flex gap-2 w-full justify-end">
                <div className="w-44 p-2">Due Date:</div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-32 bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
                  placeholder="Number"
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <div className="h-10 bg-blue-950 grid grid-cols-[5fr_1fr_1fr_1fr_1fr_1fr] text-white items-center font-bold">
              <div className="text-xs font-semibold p-2">Description</div>
              <div className="text-xs font-semibold p-2 text-right">Qty</div>
              <div className="text-xs font-semibold p-2 text-right">Price</div>
              <div className="text-xs font-semibold p-2 text-right">
                Discount
              </div>
              <div className="text-xs font-semibold p-2 text-right">Tax</div>
              <div className="text-xs font-semibold p-2 text-right">Amount</div>
            </div>
            {items.map(({ id, data }) => (
              <Item
                key={id}
                data={data}
                onRemove={() => removeItem(id)}
                onChange={(updatedData) => updateItem(id, updatedData)}
              />
            ))}

            <div
              onClick={addItem}
              className="text-blue-500 hover:text-blue-900 text-sm px-2 py-2 hover:cursor-pointer"
            >
              + Add Item
            </div>
          </div>
          <div className="mt-10 flex flex-col items-end w-full">
            <div className="flex bg-gray-200 p-4 text-black w-80 justify-between border-b border-slate-300">
              <div className="w-1/2">Item Total:</div>
              <div className="w-1/2 text-left font-bold">
                ₹{itemTotal.toFixed(2)}
              </div>
            </div>
            <div className="flex bg-gray-200 p-4 text-black w-80 justify-between border-b border-slate-300">
              <div className="w-1/2">Discount Total:</div>
              <div className="w-1/2 text-left font-bold">
                ₹{totalDiscount.toFixed(2)}
              </div>
            </div>
            <div className="flex bg-gray-200 p-4 text-black w-80 justify-between border-b border-slate-300">
              <div className="w-1/2">Tax:</div>
              <div className="w-1/2 text-left font-bold">
                ₹{totalTax.toFixed(2)}
              </div>
            </div>
            <div className="flex bg-gray-200 p-4 text-black w-80 justify-between border-b border-slate-300">
              <div className="w-1/2">Total:</div>
              <div className="w-1/2 text-left font-bold">
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your notes here..."
              className="w-full bg-gray-50 h-20 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            Terms and Conditions
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Enter all terms and conditions here..."
              className="w-full bg-gray-50 h-20 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>
      <div
        className={`bg-red-500/20 border border-red-600 text-red-100 text-sm font-light px-4 py-6 w-1/2 rounded-sm flex justify-center items-center ${isError ? "visible" : "hidden"}`}
      >
        Fill the form first
      </div>
      <div className="flex justify-between w-1/2 px-20 text-2xl">
        <div
          onClick={resetForm}
          className="hover:bg-purple-200 active:scale-95 cursor-pointer transition-all duration-200 bg-white py-4 px-8 rounded-full text-purple-500"
        >
          Reset
        </div>
        <div
          onClick={saveForm}
          className="bg-purple-500 hover:bg-purple-900 py-4 px-8 rounded-full active:scale-95 text-white cursor-pointer transition-all duration-200 flex items-center justify-center"
        >
          Save and Preview
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col w-full items-center gap-10">
      <div
        className="w-[794px] h-[1123px] flex justify-center"
        id="invoice-content"
      >
        <InvoicePdf data={pdfData || null} />
      </div>
      <div
        onClick={downloadInvoice}
        className="bg-purple-500 hover:bg-purple-900 py-4 px-8 rounded-full active:scale-95 text-white text-lg cursor-pointer transition-all duration-200 flex items-center justify-center"
      >
        Download
      </div>
    </div>
  );
};
