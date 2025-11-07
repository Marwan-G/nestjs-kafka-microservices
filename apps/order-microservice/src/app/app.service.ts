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
			this.logger.log("🔌 Connecting to Kafka (Order Service)...");
			await this.kafkaClient.connect();
			this.logger.log("✅ Connected to Kafka successfully (Order Service)");
		} catch (error) {
			this.logger.error("❌ Failed to connect to Kafka:", error);
			throw error;
		}
	}

	async processOrder(data: any) {
		this.logger.log("=== Order Microservice Received ===");
		this.logger.log("Payload type:", typeof data);
		this.logger.log("Payload:", JSON.stringify(data, null, 2));
		this.logger.log("====================================");

		// Send to payment service - simple one line!
		this.kafkaClient.emit("process_payment", data);
		this.logger.log("💳 Sent to process_payment topic");

		return {
			status: "processed",
			message: "Order received and sent to payment",
			receivedData: data,
			timestamp: new Date().toISOString(),
		};
	}
}
