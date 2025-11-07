import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	/**
	 * Send notification when order is created
	 * @param data - Order data from order_created topic
	 */
	sendOrderNotification(data: any) {
		this.logger.log("=== Order Notification ===");
		this.logger.log(
			`📧 Sending order confirmation email for Order #${data.orderId}`,
		);
		this.logger.log(`Product: ${data.product}`);
		this.logger.log(`Amount: $${data.price}`);
		this.logger.log("==========================");

		// In production, this would send email/SMS/push notification
		// Example: await this.emailService.sendOrderConfirmation(data);

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
		this.logger.log("=== Payment Notification ===");
		this.logger.log(`📧 Sending payment ${data.paymentStatus} notification`);
		this.logger.log(`Order ID: ${data.orderId}`);
		this.logger.log(`Status: ${data.paymentStatus}`);
		this.logger.log(`Amount: $${data.amount}`);
		this.logger.log("=============================");

		// In production, this would send email/SMS/push notification
		// Example: await this.emailService.sendPaymentConfirmation(data);

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
