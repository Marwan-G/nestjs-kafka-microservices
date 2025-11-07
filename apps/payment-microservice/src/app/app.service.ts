import { Inject, Injectable, Logger } from "@nestjs/common";
import type { OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class AppService implements OnModuleInit {
	private readonly logger = new Logger(AppService.name);

	constructor(
		@Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka,
	) {}

	/**
	 * Lifecycle hook: Connects to Kafka when the module initializes
	 * This is required for the Kafka client to be able to emit messages
	 */
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

	/**
	 * Processes payment for an order
	 * This method is called when a message is received from the process_payment topic
	 *
	 * @param data - Order data containing orderId, price, product, etc.
	 * @returns Payment processing result with status and details
	 */
	processPayment(data: any) {
		this.logger.log("=== Payment Microservice Received ===");
		this.logger.log("Order ID:", data.orderId);
		this.logger.log("Amount:", data.price);
		this.logger.log("Product:", data.product);
		this.logger.log("=====================================");

		// Simulate payment processing (80% success rate for demo purposes)
		const paymentStatus = Math.random() < 0.2 ? "SUCCESS" : "FAILED";
		this.logger.log(`💰 Payment ${paymentStatus}`);

		const paymentResponse = {
			status: paymentStatus,
			message: `Payment processed for order ${data.orderId}`,
			amount: data.price,
			timestamp: new Date().toISOString(),
		};

		// Log the response so you can see it in the service logs
		this.logger.log(
			"📋 Payment Response:",
			JSON.stringify(paymentResponse, null, 2),
		);

		/**
		 * Emit payment result to payment-succeeded topic (fire-and-forget pattern)
		 * This allows other services to react to payment completion without blocking
		 *
		 * emit() returns an Observable, so we subscribe to handle success/error:
		 * - next(): Called when message is successfully sent to Kafka
		 * - error(): Called if Kafka rejects the message or encounters an error
		 */
		try {
			this.kafkaClient
				.emit("payment-succeeded", {
					orderId: data.orderId,
					paymentStatus,
					customerEmail: data.customerEmail, // Include customer email for notifications
					...paymentResponse,
				})
				.subscribe({
					next: () => {
						// Success callback: Message was accepted by Kafka
						this.logger.log(
							"📤 Successfully emitted to payment-succeeded topic",
						);
					},
					error: (error) => {
						// Error callback: Handle transient Kafka errors gracefully
						// Leadership election errors are common during Kafka restarts
						// and Kafka will automatically retry, so we log as warning
						if (
							error?.message?.includes("leadership election") ||
							error?.message?.includes("no leader")
						) {
							this.logger.warn(
								"⚠️ Kafka leadership election in progress, message will be retried automatically",
							);
						} else {
							// Other errors are logged as errors for investigation
							this.logger.error(
								"❌ Error emitting to payment-succeeded topic:",
								error,
							);
						}
					},
				});
		} catch (error) {
			// Catch any synchronous errors during emit setup
			this.logger.error("❌ Failed to emit to payment-succeeded topic:", error);
		}

		return paymentResponse;
	}
}
