import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	/**
	 * Send notification when order is created
	 * @param data - Order data from order_created topic
	 */
	sendOrderNotification(data: any) {
		// Extract customer email from the message
		const customerEmail = data.customerEmail || data.email;

		if (!customerEmail) {
			this.logger.warn(
				`⚠️ No customer email found for order ${data.orderId}, skipping email notification`,
			);
			return {
				status: "skipped",
				type: "order_created",
				orderId: data.orderId,
				message: "No customer email provided",
				timestamp: new Date().toISOString(),
			};
		}

		this.logger.log("=== Order Notification ===");
		this.logger.log(
			`📧 Sending order confirmation email to ${customerEmail} for Order #${data.orderId}`,
		);
		this.logger.log(`Product: ${data.product}`);
		this.logger.log(`Amount: $${data.price}`);
		this.logger.log("==========================");

		// In production, this would send email/SMS/push notification
		// Example:
		// await this.emailService.send({
		//   to: customerEmail,
		//   subject: `Order Confirmation #${data.orderId}`,
		//   html: `<h1>Order Confirmed!</h1><p>Product: ${data.product}</p>`
		// });

		return {
			status: "sent",
			type: "order_created",
			orderId: data.orderId,
			message: "Order confirmation notification sent",
			timestamp: new Date().toISOString(),
		};
	}

	/**
	 * Send notification when payment is processed
	 * @param data - Payment data from payment-succeeded topic
	 */
	sendPaymentNotification(data: any) {
		// Extract customer email from the message
		const customerEmail = data.customerEmail || data.email;

		if (!customerEmail) {
			this.logger.warn(
				`⚠️ No customer email found for order ${data.orderId}, skipping email notification`,
			);
			return {
				status: "skipped",
				type: "payment-succeeded",
				orderId: data.orderId,
				message: "No customer email provided",
				timestamp: new Date().toISOString(),
			};
		}

		this.logger.log("=== Payment Notification ===");
		this.logger.log(
			`📧 Sending payment ${data.paymentStatus} notification to ${customerEmail}`,
		);
		this.logger.log(`Order ID: ${data.orderId}`);
		this.logger.log(`Status: ${data.paymentStatus}`);
		this.logger.log(`Amount: $${data.amount}`);
		this.logger.log("=============================");

		// In production, this would send email/SMS/push notification
		// Example:
		// await this.emailService.send({
		//   to: customerEmail,
		//   subject: `Payment ${data.paymentStatus} - Order #${data.orderId}`,
		//   html: `<h1>Payment ${data.paymentStatus}</h1><p>Amount: $${data.amount}</p>`
		// });

		return {
			status: "sent",
			type: "payment-succeeded",
			orderId: data.orderId,
			paymentStatus: data.paymentStatus,
			message: `Payment ${data.paymentStatus} notification sent`,
			timestamp: new Date().toISOString(),
		};
	}
}
