import React, { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Invoice.css";
import { getOrderDetails } from "../../../API/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Invoice = () => {
  const invoiceRef = useRef();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useLocation();
  const appSettings = useSelector((state) => state.appSetting.appSetting);
  const navigate = useNavigate();

  const fetchInvoiceData = async () => {
    try {
      const response = await getOrderDetails({ order_id: state?.orderId });
      if (response.status !== 200)
        throw new Error("Failed to fetch invoice data");

      const data = response.data.info;
      const mappedData = {
        invoiceId: data.order_id,
        dateIssued: new Date(data.createdAt).toLocaleDateString(),
        serviceDate: new Date(data.date).toLocaleDateString(),
        serviceTime: data.time,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: `${data.house_no}${data.house_no ? "," : ""} ${data.colony}${
            data.colony ? "," : ""
          } ${data.city}, ${data.pincode}`,
          carDetails: {
            name: data.carname,
            number: data.carnumber,
            type: data.cartype_id.name,
          },
        },
        address_id: {
          address: data.address_id.address,
          city: data.address_id.city,
          country: data.address_id.country,
          zipCode: data.address_id.zipCode,
          email: data.address_id.email,
          phone: data.address_id.phone,
        },
        service: {
          name: data.service_id.name,
          description: data.service_id.description,
          basePrice: data.service_id.price,
          baseTime: data.service_id.time,
          addons: data.addons_id.length > 0 ? data.addons_id : [],
        },
        billing: {
          serviceAmount: data.service_amount,
          discount: data.discount_amount,
          totalAmount: data.total_amount,
        },
        payment: {
          mode: data.paymentmode,
          status: data.paymentstatus,
          intentId: data.paymentIntentId,
          method: data.paymentMethod,
          transactionDate: new Date(data.updatedAt).toLocaleDateString(),
        },
        additionalInfo: data.additionalinfo,
        pickupDropoff: data.pickupanddrop ? "Yes" : "No",
        orderStatus: data.order_status,
      };
      setInvoiceData(mappedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.orderId) fetchInvoiceData();
    else navigate("/servicehistory");
  }, [state, navigate]);

  const totalTime = invoiceData
    ? invoiceData.service.baseTime +
      invoiceData.service.addons.reduce(
        (sum, addon) => sum + (addon.time || 0),
        0
      )
    : 0;

  const taxAmount = invoiceData
    ? invoiceData.billing.totalAmount -
      invoiceData.billing.serviceAmount +
      invoiceData.billing.discount
    : 0;

  const taxRate =
    invoiceData && invoiceData.billing.serviceAmount !== 0
      ? (taxAmount / invoiceData.billing.serviceAmount) * 100
      : 0;

  const downloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2, useCORS: true, logging: false }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1);
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          null,
          "FAST"
        );
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(
            imgData,
            "JPEG",
            0,
            position,
            imgWidth,
            imgHeight,
            null,
            "FAST"
          );
          heightLeft -= pageHeight;
        }
        pdf.save(`Invoice_${invoiceData.invoiceId}.pdf`);
      }
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!invoiceData)
    return <div className="no-data">No invoice data available</div>;

  return (
    <div className="invoice-wrapper">
      <button onClick={downloadPDF} className="download-btn">
        Download PDF
      </button>
      <div ref={invoiceRef} className="invoice-container">
        <div className="header">
          <div className="title">Customer Invoice</div>
          <div className="text">Invoice ID: {invoiceData.invoiceId}</div>
          <div className="text">Date Issued: {invoiceData.dateIssued}</div>
          <div className="text">
            Service Date: {invoiceData.serviceDate} at {invoiceData.serviceTime}
          </div>
        </div>

        <div className="business-info section">
          <div className="subtitle">{appSettings?.name}</div>
          <div className="text">
            {invoiceData?.address_id?.address}, {invoiceData?.address_id?.city},{" "}
            {invoiceData?.address_id?.country},{" "}
            {invoiceData?.address_id?.zipCode}
          </div>
          <div className="text">Email: {invoiceData?.address_id?.email}</div>
          <div className="text">Phone: {invoiceData?.address_id?.phone}</div>
        </div>

        <div className="customer-info section">
          <div className="subtitle">Customer Information</div>
          <div className="text">Name: {invoiceData.customer.name}</div>
          <div className="text">Email: {invoiceData.customer.email}</div>
          <div className="text">Phone: {invoiceData.customer.phone}</div>
          <div className="text">Address: {invoiceData.customer.address}</div>
          <div className="text">
            Pickup & Drop-off: {invoiceData.pickupDropoff}
          </div>
          <div className="text">Car Details:</div>
          <ul className="list">
            <li className="list-item">
              Name: {invoiceData.customer.carDetails.name}
            </li>
            <li className="list-item">
              Number: {invoiceData.customer.carDetails.number}
            </li>
            <li className="list-item">
              Type: {invoiceData.customer.carDetails.type}
            </li>
          </ul>
        </div>

        <div className="service-details section">
          <div className="subtitle">Service Details</div>
          <div className="text">Service: {invoiceData.service.name}</div>
          <div className="text">
            Base Price: {appSettings?.currency_symbol}
            {invoiceData.service.basePrice.toFixed(2)}
          </div>
          <div className="text">
            Base Time: {invoiceData.service.baseTime} minutes
          </div>
          <div className="subsubtitle">Add-ons:</div>
          <table className="table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Price</th>
                <th className="table-header">Time</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.service.addons.length > 0 ? (
                invoiceData.service.addons.map((addon, index) => (
                  <tr key={index}>
                    <td className="table-cell">{addon.name}</td>
                    <td className="table-cell">
                      {appSettings?.currency_symbol}
                      {addon.price.toFixed(2)}
                    </td>
                    <td className="table-cell">{addon.time} min</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="table-cell" colSpan="3">
                    No add-ons selected
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="text">Total Time: {totalTime} minutes</div>
        </div>

        <div className="billing-summary section">
          <div className="subtitle">Billing Summary</div>
          <table className="table">
            <tbody>
              <tr>
                <td className="table-cell">Service Amount:</td>
                <td className="table-cell">
                  {appSettings?.currency_symbol}
                  {invoiceData.billing.serviceAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="table-cell">Tax ({taxRate.toFixed(2)}%):</td>
                <td className="table-cell">
                  {appSettings?.currency_symbol}
                  {taxAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="table-cell">Discount:</td>
                <td className="table-cell">
                  {appSettings?.currency_symbol}
                  {invoiceData.billing.discount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="table-cell">Total Amount:</td>
                <td className="table-cell">
                  {appSettings?.currency_symbol}
                  {invoiceData.billing.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="payment-details section">
          <div className="subtitle">Payment Details</div>
          <div className="text">Payment Mode: {invoiceData.payment.mode}</div>
          <div className="text">
            Payment Status: {invoiceData.payment.status}
          </div>
          {invoiceData.payment.intentId && (
            <div className="text">
              Payment Intent ID: {invoiceData.payment.intentId}
            </div>
          )}
          <div className="text">
            Transaction Date: {invoiceData.payment.transactionDate}
          </div>
        </div>

        <div className="additional-info section">
          <div className="subtitle">Additional Information</div>
          <div className="text">
            Note: {invoiceData.additionalInfo || "N/A"}
          </div>

          <div className="text">Order Status: {invoiceData.orderStatus}</div>
        </div>

        <div className="footer">
          <div className="text">
            Thank you for choosing {appSettings?.name} Detailing Services!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
