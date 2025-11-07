import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	processPayment(data: any) {
		this.logger.log("=== Payment Microservice Received ===");
		this.logger.log("Order ID:", data.orderId);
		this.logger.log("Amount:", data.price);
		this.logger.log("Product:", data.product);
		this.logger.log("=====================================");

		// Simulate payment processing
		const paymentStatus = Math.random() > 0.2 ? "SUCCESS" : "FAILED";
		this.logger.log(`💰 Payment ${paymentStatus}`);

		return {
			status: paymentStatus,
			message: `Payment processed for order ${data.orderId}`,
			amount: data.price,
			timestamp: new Date().toISOString(),
		};
	}
}
