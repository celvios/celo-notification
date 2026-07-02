// all notification templates in one place
// each template has email subject, email body, and WhatsApp message

interface TemplatePayload {
  businessName:  string;
  contactName:   string;
  invoiceNumber: string;
  amount:        string;
  currency:      string;
  dueDate:       string;
  paymentLink:   string;
  extra:         string;
}

interface Template {
  subject:    string;
  emailBody:  string;
  whatsapp:   string;
  sms:        string;
}

export const getTemplate = (templateName: string, payload: TemplatePayload): Template => {
  switch (templateName) {
    case 'INVOICE_SENT':
      return {
        subject:   `Invoice ${payload.invoiceNumber} from ${payload.businessName}`,
        emailBody: buildEmailBody(
          payload.businessName,
          `Hi ${payload.contactName}, please find your invoice attached.`,
          payload.invoiceNumber,
          payload.amount,
          payload.dueDate,
          payload.paymentLink
        ),
        whatsapp: `Hi ${payload.contactName} 👋\n\n*${payload.businessName}* sent you an invoice.\n\n📄 *${payload.invoiceNumber}*\n💰 *${payload.amount}*\n📅 Due: *${payload.dueDate}*\n\nPay here 👇\n${payload.paymentLink}`,
        sms: `Invoice ${payload.invoiceNumber} for ${payload.amount} from ${payload.businessName}. Due ${payload.dueDate}. Pay: ${payload.paymentLink}`,
      };

    case 'INVOICE_REMINDER':
      return {
        subject:   `Reminder: Invoice ${payload.invoiceNumber} due soon`,
        emailBody: buildEmailBody(
          payload.businessName,
          `Hi ${payload.contactName}, this is a friendly reminder that your invoice is due soon.`,
          payload.invoiceNumber,
          payload.amount,
          payload.dueDate,
          payload.paymentLink
        ),
        whatsapp: `Hi ${payload.contactName} 👋\n\nJust a reminder from *${payload.businessName}*.\n\n📄 Invoice *${payload.invoiceNumber}* for *${payload.amount}* is due on *${payload.dueDate}*.\n\nPay now 👇\n${payload.paymentLink}`,
        sms: `Reminder: Invoice ${payload.invoiceNumber} for ${payload.amount} due ${payload.dueDate}. Pay: ${payload.paymentLink}`,
      };

    case 'PAYMENT_RECEIVED':
      return {
        subject:   `Payment received for invoice ${payload.invoiceNumber}`,
        emailBody: buildEmailBody(
          payload.businessName,
          `Hi ${payload.contactName}, we've received your payment. Thank you!`,
          payload.invoiceNumber,
          payload.amount,
          '',
          ''
        ),
        whatsapp: `Hi ${payload.contactName} ✅\n\nWe received your payment of *${payload.amount}* for invoice *${payload.invoiceNumber}*. Thank you!`,
        sms: `Payment of ${payload.amount} received for invoice ${payload.invoiceNumber}. Thank you!`,
      };

    case 'INVOICE_OVERDUE':
      return {
        subject:   `Overdue: Invoice ${payload.invoiceNumber} payment required`,
        emailBody: buildEmailBody(
          payload.businessName,
          `Hi ${payload.contactName}, your invoice is now overdue. Please settle the payment as soon as possible.`,
          payload.invoiceNumber,
          payload.amount,
          payload.dueDate,
          payload.paymentLink
        ),
        whatsapp: `Hi ${payload.contactName} ⚠️\n\nYour invoice *${payload.invoiceNumber}* for *${payload.amount}* from *${payload.businessName}* is now overdue.\n\nPlease pay immediately 👇\n${payload.paymentLink}`,
        sms: `OVERDUE: Invoice ${payload.invoiceNumber} for ${payload.amount} is past due. Pay now: ${payload.paymentLink}`,
      };

    case 'SETTLEMENT_DONE':
      return {
        subject:   `Settlement complete for invoice ${payload.invoiceNumber}`,
        emailBody: buildEmailBody(
          payload.businessName,
          `Your settlement of ${payload.amount} has been processed successfully.`,
          payload.invoiceNumber,
          payload.amount,
          '',
          ''
        ),
        whatsapp: `✅ Settlement of *${payload.amount}* for invoice *${payload.invoiceNumber}* has been processed.`,
        sms: `Settlement of ${payload.amount} for invoice ${payload.invoiceNumber} processed.`,
      };

    case 'WELCOME':
      return {
        subject:   `Welcome to Celo, ${payload.businessName}!`,
        emailBody: `<h2>Welcome to Celo!</h2><p>Your account for ${payload.businessName} is ready. Start sending invoices and collecting payments across Africa.</p>`,
        whatsapp: `Welcome to Celo, *${payload.businessName}*! 🎉\n\nYour account is ready. Start sending invoices and collecting payments.`,
        sms: `Welcome to Celo! Your account for ${payload.businessName} is ready.`,
      };

    default:
      throw new Error(`Unknown template: ${templateName}`);
  }
};

// shared email HTML structure
const buildEmailBody = (
  businessName: string,
  message:      string,
  invoiceNumber: string,
  amount:       string,
  dueDate:      string,
  paymentLink:  string
): string => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; }
    .header { background: #6366f1; color: white; padding: 32px; text-align: center; border-radius: 8px 8px 0 0; }
    .body { padding: 32px; background: #fff; border: 1px solid #e5e7eb; }
    .detail { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .btn { display: block; background: #6366f1; color: white; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
    .footer { text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header"><h2>${businessName}</h2></div>
  <div class="body">
    <p>${message}</p>
    ${invoiceNumber ? `<div class="detail">
      <div class="detail-row"><span>Invoice</span><strong>${invoiceNumber}</strong></div>
      ${amount ? `<div class="detail-row"><span>Amount</span><strong>${amount}</strong></div>` : ''}
      ${dueDate ? `<div class="detail-row"><span>Due Date</span><strong>${dueDate}</strong></div>` : ''}
    </div>` : ''}
    ${paymentLink ? `<a href="${paymentLink}" class="btn">Pay Now</a>` : ''}
  </div>
  <div class="footer">Powered by Celo · celo.finance</div>
</body>
</html>
`;
