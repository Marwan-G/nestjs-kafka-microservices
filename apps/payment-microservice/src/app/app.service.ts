import { Inject, Injectable, Logger } from "@nestjs/common";
import type { OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name);

	constructor(
		@Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka,
	) {}

	async onModuleInit() {
		try {
			this.logger.log("🔌 Connecting to Kafka (Payment Service Producer)...");
			await this.kafkaClient.connect();
			this.logger.log(
				"✅ Connected to Kafka successfully (Payment Service Producer)",
			);
		} catch (error) {
			this.logger.error("❌ Failed to connect to Kafka:", error);
			throw error;
		}
	}

	processPayment(data: any) {
		this.logger.log("=== Payment Microservice Received ===");
		this.logger.log("Order ID:", data.orderId);
		this.logger.log("Amount:", data.price);
		this.logger.log("Product:", data.product);
		this.logger.log("=====================================");

		// Simulate payment processing
		const paymentStatus = Math.random() < 0.2 ? "SUCCESS" : "FAILED";
		this.logger.log(`💰 Payment ${paymentStatus}`);

		const paymentResponse = {
			status: paymentStatus,
			message: `Payment processed for order ${data.orderId}`,
			amount: data.price,
			timestamp: new Date().toISOString(),
		};

		// Log the response so you can see it
		this.logger.log(
			"📋 Payment Response:",
			JSON.stringify(paymentResponse, null, 2),
		);

		// Emit payment result to payment-succeeded topic (fire-and-forget)
		this.kafkaClient.emit("payment-succeeded", {
			orderId: data.orderId,
			paymentStatus,
			...paymentResponse,
		});
		this.logger.log("📤 Emitted to payment-succeeded topic");

		return paymentResponse;
	}
}
